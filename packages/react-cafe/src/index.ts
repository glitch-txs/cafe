import { useSyncExternalStore } from 'react'
import type { Callback, ExValue, Getter, Setter, Subscribe, Use } from './types'

export function createStore<TStates>(initialStore: TStates) {
	let setter: Setter<TStates> = {}
	let use: Use<TStates> = {}
	let getter: Getter<TStates> = {}
	let sub: Subscribe<TStates> = {}

	const states = new Map<keyof TStates, TStates[keyof TStates]>()
	const callbacks = new Map<keyof TStates, Set<Callback<ExValue<TStates>>>>()

	const handleCallbacks = (state: keyof TStates) => {
		callbacks.get(state)?.forEach((cb) => {
			cb(states.get(state) as ExValue<TStates>)
		})
	}

	function capitalize(word: string) {
		return word.charAt(0).toUpperCase() + word.slice(1)
	}

	const subscribe = (state: keyof TStates) => {
		return (cb: Callback<ExValue<TStates>>) => {
			if (callbacks.has(state)) {
				callbacks.get(state)?.add(cb)
			} else {
				const providerCallbacks = new Set<Callback<ExValue<TStates>>>()
				providerCallbacks.add(cb)
				callbacks.set(state, providerCallbacks)
			}

			return () => {
				callbacks.get(state)?.delete(cb)
			}
		}
	}

	for (const state in initialStore) {
		states.set(state, initialStore[state])

		const subState = ('sub' + capitalize(state)) as `sub${Capitalize<Extract<keyof TStates, string>>}`

		//@ts-ignore not inferring type correctly
		sub[subState] = subscribe(state)

		const getState = ('get' + capitalize(state)) as `get${Capitalize<Extract<keyof TStates, string>>}`

		//@ts-ignore not inferring type correctly
		getter[getState] = () => states.get(state)

		const setState = ('set' + capitalize(state)) as `set${Capitalize<Extract<keyof TStates, string>>}`
		//@ts-ignore not inferring type correctly
		setter[setState] = (val) => {
			if (typeof val === 'function') {
				//@ts-ignore - type is function
				states.set(state, val(states.get(state)))
				handleCallbacks(state)
				return
			}
			if (states.get(state) === val) return
			states.set(state, val)
			handleCallbacks(state)
		}

		const useState = ('use' + capitalize(state)) as `use${Capitalize<Extract<keyof TStates, string>>}`
		//@ts-ignore - state key, key value are not correlated in types
		use[useState] = () => {
			//@ts-ignore - no block ignore https://github.com/Microsoft/TypeScript/issues/19573
			const state = useSyncExternalStore(
				//@ts-ignore
				subscribe(state),
				() => states.get(state),
				//@ts-ignore
				() => initialStore[state],
			)

			//@ts-ignore - no block ignore https://github.com/Microsoft/TypeScript/issues/19573
			return [state, setter[setState]]
		}
	}

	return Object.create({ ...use, ...setter, ...getter, ...sub }) as Required<Getter<TStates>> &
		Required<Setter<TStates>> &
		Required<Use<TStates>> &
		Required<Subscribe<TStates>>
}
