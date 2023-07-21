import { useSyncExternalStore } from "react";

type Subscribe = (()=>unknown)

type SetFn<T> = (prev: T)=>unknown

type SetValue<TStates> = {
  [key in keyof TStates]?: (newVal: TStates[key] | SetFn<TStates[key]>)=>void
}

type Store<TStates> = {
  [key in keyof TStates]?: (()=>TStates[key] | undefined)
}

export function createStore<TStates>(initialStore: TStates){
  
  let setter: SetValue<TStates> = {};
  let getter: Store<TStates> = {};

  const states = new Map<keyof TStates, TStates[keyof TStates]>()
  const callbacks = new Map<keyof TStates, Map<string, Subscribe>>()
  
  const handleCallbacks = (state: keyof TStates)=>{
    callbacks.get(state)?.forEach(cb =>{ cb() })
  };

  const subscribe = (state: keyof TStates)=>{
    const id = crypto.randomUUID()
    
    return (cb: Subscribe)=>{
      if(callbacks.has(state)){
        callbacks.get(state)?.set(id, cb)
      }else{
        const providerCallbacks = new Map<string,Subscribe>()
        providerCallbacks.set(id, cb)
        callbacks.set(state, providerCallbacks)
      }

      return ()=>{
        callbacks.get(state)?.delete(id)
      }
    }

  }

  for(const state in initialStore){
    states.set(state, initialStore[state])
    //@ts-ignore - state key, key value are not correlated in types
    getter[state] = ()=>useSyncExternalStore(subscribe(state), ()=>states.get(state), ()=>initialStore[state])

    setter[state] = (val)=>{
      if(typeof val === 'function'){
        //@ts-ignore - type is function
        states.set(state, val(states.get(state)))
        handleCallbacks(state)
        return
      }
      if(states.get(state) === val) return
      states.set(state, val)
      handleCallbacks(state)
    }
  }

  return Object.create({ states: getter, set: setter }) as 
  { 
    states: Required<Store<TStates>>,
    set: Required<SetValue<TStates>>
  }
}