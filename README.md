## Café

Café is a global state manager for React and vanilla JavaScript

# Vanilla JS

```bash
npm i vanilla-cafe
```

```ts
// src/store/index.js
import { createStore } from "vanilla-cafe";

export const store = createStore({
  count: 0
})
```

```tsx
// src/components/Count.js
import { store } from '../store';

/* --------change value--------- */
function increment(){
  store.set.count(p => p + 1)
}

/*----------subscribe-----------*/
let count = 0;

function handleCountChange(newValue){
  count = newValue
}

const unsubscribe = store.sub.count(handleCountChange)


/*------get current value-------*/

const count = store.count()
```

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

export const store = createStore<MyStore>({
  count: 0
})
```

```tsx
// src/components/Count.tsx
import React from 'react'
import { store } from '@/store'

const Count = () => {

  const count = store.count()

  const increment = ()=>{
    store.set.count(p => p + 1)
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