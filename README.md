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
import { store } from '@/store/store'
import React from 'react'

const Count = () => {

  const count = store.count()

  return (
    <div>
      <button onClick={()=>store.set.count((v: number) => v + 1)} >Increment</button>
      Count: {count}
    </div>
  )
}

export default Count
```