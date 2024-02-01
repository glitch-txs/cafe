```bash
npm i react-cafe
```

### Create a store
```ts
// src/store/index.ts
import { createStore } from "react-cafe";

type MyStore = {
  count: number
}

export const myStore = createStore<MyStore>({
  count: 0,
  name: 'John'
})
```

### Use in any React Component
```tsx
// src/components/Counter.tsx
import React from 'react'
import { myStore } from '../store'

const Counter = () => {

  const [count, setCount] = myStore.useCount()

  const increment = ()=>{
    setCount(p => p + 1)
  }

  return (
    <div>
      <button onClick={increment} >Increment</button>
      Count: {count}
    </div>
  )
}

export default Counter
```
### Use outside React
```tsx
// src/utils/vanilla.ts
import { myStore } from '../store'

const count = myStore.getCount() // Get a snapshot of the current value

myStore.setCount(p => p + 1) // Update state

```