```bash
npm i vanilla-cafe
```
### Create a store
```ts
import { createStore } from "vanilla-cafe";

export const { set, sub, get } = createStore({
  count: 0
})
```
### Update states
```ts
import { set, sub, get } from '../store';

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
const count = get.count()