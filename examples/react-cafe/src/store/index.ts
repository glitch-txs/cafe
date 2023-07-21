import { createStore } from "react-cafe";

type MyStore = {
  count: number
  name: string
}
export const { set, states } = createStore<MyStore>({
  count: 0,
  name: 'c'
})