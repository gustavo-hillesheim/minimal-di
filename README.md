# Minimal DI

<a href="https://badge.fury.io/js/minimal-di">
  <img src="https://badge.fury.io/js/minimal-di.svg" alt="npm version badge" height="18">
</a>

## About

A minimalistic Dependency Injection library. Ideal por small projects that just want that extra testability and decoupling.
All dependencies are lazy singletons, so your dependencies will only be resolved when needed and only once.

## Usage

First you need to create a `MinimalDIContainer` instance.

```
import ( MinimalDIContainer } from 'minimal-di';

const diContainer = new MinimalDIContainer();
```

Then you register your dependency and how the container should resolve it

```
class SimpleComponent {
  doTheThing() {
    ...
  }
}
diContainer.register(SimpleComponent, () => new SimpleComponent());
```

And when you need your `SimpleComponent`, just get it!

```
const simpleComponent = diContainer.get(SimpleComponent);
simpleComponent.doTheThing();
```

To resolve dependencies of a dependency, just use `diContainer.get` inside your dependency resolver

```
class ComplexComponent {
  constructor(simpleComponent) {
    this.simpleComponent = simpleComponent;
  }
}
diContainer.register(ComplexComponent, () => new ComplexComponent(diContainer.get(SimpleComponent)));
```
