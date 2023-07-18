import { useSyncExternalStore } from "react";

type Subscribe = (()=>unknown)

type SetFn<TStates> = (prev: TStates[keyof TStates])=>unknown

type SetValue<TStates> = {
  [key in keyof TStates]?: (newVal: TStates[keyof TStates] | SetFn<TStates>)=>void
}

type Store<TStates> = {
  [key in keyof TStates]?: (()=>TStates[keyof TStates] | undefined)
}

export function createStore<TStates>(initialStore: TStates){
  
  let setter: SetValue<TStates> = {};
  let store: Store<TStates> = {};
  
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
    store[state] = ()=>useSyncExternalStore(subscribe(state), ()=>states.get(state), ()=>initialStore[state])

    setter[state] = (val)=>{
      if(typeof val === 'function'){
        //@ts-ignore - not callable?
        states.set(state, val(states.get(state)))
        handleCallbacks(state)
        return
      }
      if(states.get(state) === val) return
      states.set(state, val)
      handleCallbacks(state)
    }
  }

  return Object.create({...store, set:setter}) as Required<Store<TStates>> & { set: Required<SetValue<TStates>> }
}

//test---------------------------------------
type Test = {
  count: number
}

export const store = createStore<Test>({
  count: 0
})