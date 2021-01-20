import {
    IncorrectDependencyType,
    TypeAlreadyBeingResolvedError,
    UnknownDependencyError,
} from "../src";
import { MinimalDIContainer } from "../src/di-container";

describe("MinimalDIContainer", () => {
    let diContainer: MinimalDIContainer;

    beforeEach(() => {
        diContainer = new MinimalDIContainer();
    });

    it("should register dependency resolver", () => {
        diContainer.register(TestClass, () => new TestClass());
        expect(diContainer.isRegistered(TestClass)).toBeTrue();
    });

    it("should resolve dependency", () => {
        diContainer.register(TestClass, () => new TestClass());
        expect(diContainer.get(TestClass)).toBeInstanceOf(TestClass);
    });

    it("should resolve same instance every time", () => {
        diContainer.register(TestClass, () => new TestClass());
        const firstInstance = diContainer.get(TestClass);
        const secondInstance = diContainer.get(TestClass);
        expect(firstInstance).toBe(secondInstance);
    });

    it("should resolve dependencies lazily", () => {
        const resolver = {
            resolve: () => new TestClass(),
        };
        const resolverSpy = spyOn(resolver, "resolve").and.callThrough();

        diContainer.register(TestClass, resolver.resolve);

        expect(resolverSpy).not.toHaveBeenCalled();
        diContainer.get(TestClass);
        expect(resolverSpy).toHaveBeenCalled();
    });

    it("should resolved inherited class", () => {
        diContainer.register(TestClass, () => new TestClass3(new TestClass2()));
        const instance = diContainer.get(TestClass);
        expect(instance).toBeInstanceOf(TestClass);
        expect(instance).toBeInstanceOf(TestClass3);
    });

    it("should resolve dependency with nested dependencies", () => {
        diContainer.register(TestClass2, () => new TestClass2());
        diContainer.register(TestClass3, () => new TestClass3(diContainer.get(TestClass2)));

        expect(diContainer.get(TestClass3)).toBeTruthy();
    });

    it("should throw error on circular dependencies", () => {
        diContainer.register(TestClass4, () => new TestClass4(diContainer.get(TestClass5)));
        diContainer.register(TestClass5, () => new TestClass5(diContainer.get(TestClass4)));

        expect(() => diContainer.get(TestClass4)).toThrow(
            new TypeAlreadyBeingResolvedError(TestClass4)
        );
    });

    it("should check dependency type when resolving", () => {
        diContainer.register(TestClass, () => (new TestClass2() as any) as TestClass);
        expect(() => diContainer.get(TestClass)).toThrow(
            new IncorrectDependencyType({
                correctType: TestClass,
                actualType: TestClass2,
            })
        );
    });

    it("should throw error on resolving unknown dependency TestClass", () => {
        expect(() => diContainer.get(TestClass)).toThrow(new UnknownDependencyError(TestClass));
    });
});

class TestClass {
    name: string = "";
}
class TestClass2 {
    name: string = "";
}
class TestClass3 extends TestClass {
    age: number = 0;
    constructor(public dependency: TestClass2) {
        super();
    }
}

class TestClass4 {
    constructor(public dependency: TestClass5) {}
}

class TestClass5 {
    constructor(public dependency: TestClass4) {}
}
