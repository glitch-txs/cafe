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
  let snapshot: Store<TStates> = {};

  const states = new Map<keyof TStates, TStates[keyof TStates]>()
  const callbacks = new Map<keyof TStates, Set<Subscribe>>()
  
  const handleCallbacks = (state: keyof TStates)=>{
    callbacks.get(state)?.forEach(cb =>{ cb() })
  };

  const subscribe = (state: keyof TStates)=>{
    
    return (cb: Subscribe)=>{
      if(callbacks.has(state)){
        callbacks.get(state)?.add(cb)
      }else{
        const providerCallbacks = new Set<Subscribe>()
        providerCallbacks.add(cb)
        callbacks.set(state, providerCallbacks)
      }

      return ()=>{
        callbacks.get(state)?.delete(cb)
      }
    }

  }

  for(const state in initialStore){
    states.set(state, initialStore[state])
    //@ts-ignore - state key, key value are not correlated in types
    getter[state] = ()=>useSyncExternalStore(subscribe(state), ()=>states.get(state), ()=>initialStore[state])
    //@ts-ignore - state key, key value are not correlated in types
    snapshot[state] = ()=>states.get(state)

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

  return Object.create({ states: getter, set: setter, snap: snapshot }) as 
  { 
    states: Required<Store<TStates>>,
    set: Required<SetValue<TStates>>,
    snap: Required<Store<TStates>>
  }
}