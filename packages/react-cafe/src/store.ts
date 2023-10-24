import { useSyncExternalStore } from "react";

type Subscribe = (()=>unknown)

type Callback<T> = (prev: T)=>unknown

type SetValue<TStates> = {
  [key in keyof TStates]?: (state: TStates[key] | Callback<TStates[key]>)=>void
}

type Store<TStates> = {
  [key in keyof TStates]?: ()=>TStates[key]
}

type Sub<T> = {
  [key in keyof T]?: (cb: Callback<T[key]>)=>()=>void
}

type ExValue<T> = T[Extract<keyof T, string>]

export function createStore<TStates>(initialStore: TStates){
  
  let setter: SetValue<TStates> = {};
  let getter: Store<TStates> = {};
  let snapshot: Store<TStates> = {};
  let sub: Sub<TStates> = {};

  const states = new Map<keyof TStates, TStates[keyof TStates]>()
  const callbacks = new Map<keyof TStates, Set<Callback<ExValue<TStates>>>>()
  
  const handleCallbacks = (state: keyof TStates)=>{
    callbacks.get(state)?.forEach(cb =>{ cb(states.get(state) as ExValue<TStates>) })
  };

  const subscribe = (state: keyof TStates)=>{
    
    return (cb: Callback<ExValue<TStates>>)=>{
      if(callbacks.has(state)){
        callbacks.get(state)?.add(cb)
      }else{
        const providerCallbacks = new Set<Callback<ExValue<TStates>>>()
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

    sub[state] = subscribe(state)
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

  return Object.create({ states: getter, set: setter, snap: snapshot, sub }) as 
  { 
    states: Required<Store<TStates>>,
    set: Required<SetValue<TStates>>,
    snap: Required<Store<TStates>>,
    sub: Required<Sub<TStates>>,
  }
}