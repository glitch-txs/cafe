type Subscribe<T> = {
  [key in keyof T]?: (cb: Callback<T>)=>()=>void
}

type Callback<T> = (state?: T[keyof T])=>unknown

type SetFn<T> = (prev: T)=>unknown

type SetValue<T> = {
  [key in keyof T]?: (newVal: T[key] | SetFn<T[key]>)=>void
}

type Store<TStates> = {
  [key in keyof TStates]?: ()=>TStates[key]
}

export function createStore<TStates>(initialStore: TStates){
  
  let setter: SetValue<TStates> = {};
  let store: Store<TStates> = {};
  let subscribe: Subscribe<TStates> = {};

  const states = new Map<keyof TStates, TStates[keyof TStates]>()
  const callbacks = new Map<keyof TStates, Map<string, Callback<TStates>>>()
  
  const handleCallbacks = (state: keyof TStates)=>{
    callbacks.get(state)?.forEach(cb =>{ cb(states.get(state)) })
  };

  for(const state in initialStore){
    states.set(state, initialStore[state])
    //@ts-ignore - state key, key value are not correlated in types
    store[state] = ()=>states.get(state)

    subscribe[state] = (cb: Callback<TStates>)=>{
      const id = crypto.randomUUID()
      if(callbacks.has(state)){
        callbacks.get(state)?.set(id, cb)
      }else{
        const providerCallbacks = new Map<string,Callback<TStates>>()
        providerCallbacks.set(id, cb)
        callbacks.set(state, providerCallbacks)
      }
      return ()=>{
        callbacks.get(state)?.delete(id)
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

  return Object.create({ ...store, set: setter, sub: subscribe }) as 
  Required<Store<TStates>> & 
  { set: Required<SetValue<TStates>> } &
  { sub: Required<Subscribe<TStates>> }
}