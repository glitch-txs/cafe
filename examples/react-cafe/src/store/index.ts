import { createStore } from "react-cafe";

type MyStore = {
  count: number
  name: string
}
export const myStore = createStore<MyStore>({
  count: 0,
  name: 'c'
})