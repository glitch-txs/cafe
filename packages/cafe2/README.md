```bash
npm i vanilla-cafe
```
### Create a store
```ts
import { createStore } from "vanilla-cafe";

export const myStore = createStore({
  count: 0
})
```
### Update states
```ts
import myStore from '../store';

function increment(){
  myStore.setCount(p => p + 1)
}
```
### Subscribe to changes
```ts
let count = 0;

function handleCountChange(newValue){
  count = newValue
}

const unsubscribe = myStore.subCount(handleCountChange)
```
### Get the current state's value
```ts
const count = myStore.getCount()