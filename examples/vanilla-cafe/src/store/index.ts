import { createStore } from 'vanilla-cafe';

type MyStore = {
  count: number
}

export const { set, sub, states } = createStore<MyStore>({
  count: 0
})