import { DIResolver } from "./di-resolver";
import { Type, Resolver } from "./types";

export class MinimalDIContainer {
    private readonly cache = new Map<Type<any>, any>();
    private readonly diResolver = new DIResolver();

    register<T>(type: Type<T>, resolver: Resolver<T>): void {
        this.diResolver.register(type, resolver);
    }

    isRegistered(type: Type<any>): boolean {
        return this.diResolver.isRegistered(type);
    }

    get<T>(type: Type<T>): T | never {
        if (!this.cache.has(type)) {
            this.cache.set(type, this.diResolver.get(type));
        }
        return this.cache.get(type);
    }
}
