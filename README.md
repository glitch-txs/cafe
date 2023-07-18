## Getting Started

### Install

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
    store.set.count((v: number) => v + 1)
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