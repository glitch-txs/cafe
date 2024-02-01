type Callback<T> = (state: T)=>unknown

type SetFn<T> = (prev: T)=>unknown

type Setter<T> = {
  [K in keyof T & string as `set${Capitalize<K>}`]?: (newVal: T[K] | SetFn<T[K]>)=>void
}

type Subscribe<T> = {
  [K in keyof T & string as `sub${Capitalize<K>}`]?: (cb: Callback<T[K]>)=>()=>void
}

type Getter<T> = { [K in keyof T & string as `get${Capitalize<K>}`]?: () => T[K] };

type ExKey<T> = Extract<keyof T, string>

type ExValue<T> = T[Extract<keyof T, string>]

export function createStore<TStates>(initialStore: TStates){
  
  let setter: Setter<TStates> = {};
  let getter: Getter<TStates> = {};
  let subscribe: Subscribe<TStates> = {};

  const states = new Map<ExKey<TStates>, ExValue<TStates>>()
  const callbacks = new Map<keyof TStates, Set<Callback<ExValue<TStates>>>>()
  
  const handleCallbacks = (state: ExKey<TStates>)=>{
    callbacks.get(state)?.forEach(cb =>{ cb(states.get(state) as ExValue<TStates>) })
  };
  
  function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  for(const state in initialStore){
    states.set(state, initialStore[state])
    
    const getState = "get" + capitalize(state) as `get${Capitalize<typeof state>}`

    //@ts-ignore - state key, key value are not correlated in types
    getter[getState] = ()=>states.get(state)

    const subState = "sub" + capitalize(state) as `sub${Capitalize<typeof state>}`

    //@ts-ignore not inferring type correctly
    subscribe[subState] = (cb: Callback<ExValue<TStates>>)=>{
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

    const setState = "set" + capitalize(state) as `set${Capitalize<typeof state>}`

    //@ts-ignore not inferring type correctly
    setter[setState] = (val)=>{
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

  return Object.create({ ...getter, ...setter, ...subscribe }) as Required<Getter<TStates>> & Required<Setter<TStates>> & Required<Subscribe<TStates>>
}