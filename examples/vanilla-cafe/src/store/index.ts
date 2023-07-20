import { createStore } from 'vanilla-cafe';

type MyStore = {
  count: number
}

export const store = createStore<MyStore>({
  count: 0
})