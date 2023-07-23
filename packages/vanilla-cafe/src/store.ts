type Subscribe<T> = {
  [key in keyof T]?: (cb: Callback<T>)=>()=>void
}

type Callback<T> = (state: T[keyof T])=>unknown

type SetFn<T> = (prev: T)=>unknown

type SetValue<T> = {
  [key in keyof T]?: (newVal: T[key] | SetFn<T[key]>)=>void
}

type Store<TStates> = {
  [key in keyof TStates]?: ()=>TStates[key]
}

export function createStore<TStates>(initialStore: TStates){
  
  let setter: SetValue<TStates> = {};
  let getter: Store<TStates> = {};
  let subscribe: Subscribe<TStates> = {};

  const states = new Map<keyof TStates, TStates[keyof TStates]>()
  const callbacks = new Map<keyof TStates, Set<Callback<TStates>>>()
  
  const handleCallbacks = (state: keyof TStates)=>{
    callbacks.get(state)?.forEach(cb =>{ cb(states.get(state) as TStates[keyof TStates]) })
  };

  for(const state in initialStore){
    states.set(state, initialStore[state])
    //@ts-ignore - state key, key value are not correlated in types
    getter[state] = ()=>states.get(state)

    subscribe[state] = (cb: Callback<TStates>)=>{
      if(callbacks.has(state)){
        callbacks.get(state)?.add(cb)
      }else{
        const providerCallbacks = new Set<Callback<TStates>>()
        providerCallbacks.add(cb)
        callbacks.set(state, providerCallbacks)
      }
      return ()=>{
        callbacks.get(state)?.delete(cb)
      }
    }

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

  return Object.create({ snap: getter, set: setter, sub: subscribe }) as 
  { 
    snap: Required<Store<TStates>>,
    set: Required<SetValue<TStates>>,
    sub: Required<Subscribe<TStates>>
  }
}