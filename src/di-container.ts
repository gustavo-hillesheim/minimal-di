import { DIResolver } from "./di-resolver";
import { Type, Resolver, DIContainer } from "./types";

export class MinimalDIContainer implements DIContainer {
    private readonly cache = new Map<Type<any>, any>();
    private readonly diResolver = new DIResolver();

    register<T>(type: Type<T>, resolver: Resolver<T>): void {
        this.diResolver.register(type, resolver);
    }

    isRegistered(type: Type<any>): boolean {
        return this.diResolver.isRegistered(type);
    }

    get<T>(type: Type<T>): T | never {
        this.ensureIsCached(type);
        return this.cache.get(type);
    }

    resolveAll(): void | never {
        this.diResolver.getRegisteredTypes().forEach((type) => {
            this.ensureIsCached(type);
        });
    }

    private ensureIsCached(type: Type<any>): void {
        if (!this.cache.has(type)) {
            this.cache.set(type, this.diResolver.get(type));
        }
    }
}
