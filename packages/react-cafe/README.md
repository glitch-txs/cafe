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

export const { set, states, snap } = createStore<MyStore>({
  count: 0
})
```

### Use in any React Component
```tsx
// src/components/Counter.tsx
import React from 'react'
import { set, states } from '../store'

const Counter = () => {

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

export default Counter
```
### Use outside React
```tsx
// src/utils/vanilla.ts
import { set, snap } from '../store'

const count = snap.count() // Get a snapshot of the current value

set.count(p => p + 1) // Update state

```

### Considerations

- **states** is an object of hooks, they can only be called inside React components.