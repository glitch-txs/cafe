import { createStore } from 'vanilla-cafe';

type MyStore = {
  count: number
}

export const { set, sub, get } = createStore<MyStore>({
  count: 0
})