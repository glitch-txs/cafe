import { createStore } from "./store"

//test---------------------------------------
type MyStore = {
  count: number
  name: string
}

export const store = createStore<MyStore>({
  count: 0,
  name: 'c'
})