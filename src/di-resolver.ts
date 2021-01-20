import {
    TypeAlreadyBeingResolvedError,
    IncorrectDependencyType,
    UnknownDependencyError,
} from "./errors";
import { Resolver, Type } from "./types";

export class DIResolver {
    private readonly resolvers = new Map<Type<any>, Resolver<any>>();
    private readonly typesBeingResolved = new Set<Type<any>>();

    register<T>(type: Type<T>, resolver: Resolver<T>): void {
        this.resolvers.set(type, resolver);
    }

    isRegistered(type: Type<any>): boolean {
        return this.resolvers.has(type) && this.resolvers.get(type) != null;
    }

    get<T>(type: Type<T>): T | never {
        this.checkIsRegistered(type);
        this.checkIsNotBeingResolved(type);
        const instance = this.resolve(type);
        this.checkIsOfExpectedType(instance, type);
        return instance;
    }

    private resolve<T>(type: Type<T>): T | never {
        this.typesBeingResolved.add(type);
        const instance = this.resolvers.get(type)!();
        this.typesBeingResolved.delete(type);
        return instance;
    }

    private checkIsRegistered<T>(type: Type<T>): void | never {
        if (!this.isRegistered(type)) {
            throw new UnknownDependencyError(type);
        }
    }

    private checkIsNotBeingResolved<T>(type: Type<T>): void | never {
        if (this.typesBeingResolved.has(type)) {
            throw new TypeAlreadyBeingResolvedError(type);
        }
    }

    private checkIsOfExpectedType<T>(instance: T | null, expectedType: Type<T>): void | never {
        if (!(instance instanceof expectedType)) {
            throw new IncorrectDependencyType({
                actualType: (instance as any).constructor,
                correctType: expectedType,
            });
        }
    }
}
