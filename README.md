## Getting Started

npm install (soon)

```ts
// src/store/index.ts
type MyStore = {
  count: number
}

export const store = createStore<MyStore>({
  count: 0
})
```

```tsx
import { store } from '@/store'
import React from 'react'

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