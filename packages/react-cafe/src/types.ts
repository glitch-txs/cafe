export type Callback<T> = (prev: T) => unknown

export type SetFn<T> = (prev: T) => unknown

export type Setter<T> = {
	[K in keyof T & string as `set${Capitalize<K>}`]?: (newVal: T[K] | SetFn<T[K]>) => void
}

export type Subscribe<T> = {
	[K in keyof T & string as `sub${Capitalize<K>}`]?: (cb: Callback<T[K]>) => () => void
}

export type Getter<T> = {
	[K in keyof T & string as `get${Capitalize<K>}`]?: () => T[K]
}

export type Use<T> = {
	[K in keyof T & string as `use${Capitalize<K>}`]?: () => [T[K], (newVal: T[K] | SetFn<T[K]>) => void]
}

export type ExValue<T> = T[Extract<keyof T, string>]