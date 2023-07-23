## Café

Café is a global state manager for React and vanilla JavaScript

# React ![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-cafe)

```bash
npm i react-cafe
```

```ts
// src/store/index.ts
import { createStore } from "react-cafe";

type MyStore = {
  count: number
}

export const { set, states } = createStore<MyStore>({
  count: 0
})
```

```tsx
// src/components/Count.tsx
import React from 'react'
import { set, states } from '@/store'

const Count = () => {

  const count = states.count()

  const increment = ()=>{
    set.count(p => p + 1)
  }

  return (
    <div>
      <button onClick={increment} >Increment</button>
      Count: {count}
    </div>
  )
}

export default Count
```

# Vanilla JS ![npm bundle size](https://img.shields.io/bundlephobia/minzip/vanilla-cafe)

```bash
npm i vanilla-cafe
```
### Create a store
```ts
import { createStore } from "vanilla-cafe";

export const { set, sub, states } = createStore({
  count: 0
})
```
### Update states
```ts
import { set, sub, state } from '../store';

function increment(){
  set.count(p => p + 1)
}
```
### Subscribe to changes
```ts
let count = 0;

function handleCountChange(newValue){
  count = newValue
}

const unsubscribe = sub.count(handleCountChange)
```
### Get the current state's value
```ts
const count = states.count()
```