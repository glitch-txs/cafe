import { createStore } from 'vanilla-cafe';

type MyStore = {
  count: number
}

export const { set, sub, snap } = createStore<MyStore>({
  count: 0
})