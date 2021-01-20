export type Type<T> = { new (...args: any[]): T };
export type Resolver<T> = () => T;
