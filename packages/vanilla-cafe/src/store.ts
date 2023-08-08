type Subscribe<T> = {
  [key in keyof T]?: (cb: Callback<T[key]>)=>()=>void
}

type Callback<T> = (state: T)=>unknown

type SetFn<T> = (prev: T)=>unknown

type SetValue<T> = {
  [key in keyof T]?: (newVal: T[key] | SetFn<T[key]>)=>void
}

type Store<TStates> = {
  [key in keyof TStates]?: ()=>TStates[key]
}

type ExKey<T> = Extract<keyof T, string>

type ExValue<T> = T[Extract<keyof T, string>]

export function createStore<TStates>(initialStore: TStates){
  
  let setter: SetValue<TStates> = {};
  let getter: Store<TStates> = {};
  let subscribe: Subscribe<TStates> = {};

  const states = new Map<ExKey<TStates>, ExValue<TStates>>()
  const callbacks = new Map<keyof TStates, Set<Callback<ExValue<TStates>>>>()
  
  const handleCallbacks = (state: ExKey<TStates>)=>{
    callbacks.get(state)?.forEach(cb =>{ cb(states.get(state) as ExValue<TStates>) })
  };

  for(const state in initialStore){
    states.set(state, initialStore[state])
    //@ts-ignore - state key, key value are not correlated in types
    getter[state] = ()=>states.get(state)

    subscribe[state] = (cb: Callback<ExValue<TStates>>)=>{
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

  return Object.create({ get: getter, set: setter, sub: subscribe }) as 
  { 
    get: Required<Store<TStates>>,
    set: Required<SetValue<TStates>>,
    sub: Required<Subscribe<TStates>>
  }
}