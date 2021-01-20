import { Type } from "./types";

export class UnknownDependencyError<T> extends Error {
    constructor(public readonly type: Type<T>) {
        super(`Unknown dependency ${type.name}`);
    }
}

export class IncorrectDependencyType<RT, ET> extends Error {
    public readonly actualType: Type<RT>;
    public readonly correctType: Type<ET>;

    constructor({ actualType, correctType }: { actualType: Type<RT>; correctType: Type<ET> }) {
        super(
            `Incorrect dependency type. Corect type is ${correctType.name} but actual type was ${actualType.name}`
        );
        this.actualType = actualType;
        this.correctType = correctType;
    }
}

export class TypeAlreadyBeingResolvedError<T> extends Error {
    constructor(public readonly type: Type<T>) {
        super(
            `Type ${type.name} is already being resolved. This may be indicative of a circular dependency`
        );
    }
}
