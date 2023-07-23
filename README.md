## Café

Café is a global state manager for React and vanilla JavaScript

# React
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

# Vanilla JS

```bash
npm i vanilla-cafe
```

```ts
// src/store/index.js
import { createStore } from "vanilla-cafe";

export const { set, sub, states } = createStore({
  count: 0
})
```

```tsx
// src/components/Count.js
import { set, sub, state } from '../store';

/* --------change value--------- */
function increment(){
  set.count(p => p + 1)
}

/*----------subscribe-----------*/
let count = 0;

function handleCountChange(newValue){
  count = newValue
}

const unsubscribe = sub.count(handleCountChange)

/*------get current value-------*/

const count = states.count()
```