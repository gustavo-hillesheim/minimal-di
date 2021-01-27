export type Type<T> = { new (...args: any[]): T };
export type Resolver<T> = () => T;

export interface DIContainer {
    register<T>(type: Type<T>, resolver: Resolver<T>): void;
    get<T>(type: Type<T>): T;
    isRegistered(type: Type<any>): boolean;
    resolveAll(): void;
}
