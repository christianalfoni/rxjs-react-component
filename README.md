# rxjs-react-component
A component allowing you to change state using observables

### Install
`npm install rxjs-react-component`

Depends on React and rxjs

### Howto
By convention all methods defined with a `$` at the end will expose an observable instead. If you return the observable it is expected to map to an object. This object will be run with `this.setState(mappedObservableObject)` and cause a render on the component.

```js
import React from 'react';
import ObservableComponent from 'rxjs-react-component';

class MyComponent extends ObservableComponent {
  constructor(props) {
    super(props);
    this.state = {count: 0};
  }
  onClick$(observable) {
    return observable.map(() => ({count: this.state.count + 1}));
  }
  render() {
    return (
      <div>
        <h1>Hello world ({this.state.count})</h1>
        <button onClick={this.onClick$}>Increase</button>
      </div>
    );
  }
}
```

You can create complex state changes by merging multiple observables.

```js
import React from 'react';
import ObservableComponent from 'rxjs-react-component';
import {Observable} from 'rxjs';

class MyComponent extends ObservableComponent {
  constructor(props) {
    super(props);
    this.state = {count: 0};
  }
  onClick$(observable) {
    const increase$ = observable.map(() => ({count: this.state.count + 1}));
    const delayedIncrease$ = observable.delay(200).map(() => ({count: this.state.count + 1}));
    return Observable.merge(
      increase$,
      delayedIncrease$
    );
  }
  render() {
    return (
      <div>
        <h1>Hello world ({this.state.count})</h1>
        <button onClick={this.onClick$}>Increase</button>
      </div>
    );
  }
}
```

You can also hook on to life-cycle hooks using the same naming convention. Not all of these should cause a new render of the component and you handle that by just not returning the observable.

```js
import React from 'react';
import ObservableComponent from 'rxjs-react-component';

class MyComponent extends ObservableComponent {
  componentWillUpdate$(observable) {
    observable.forEach({nextProps} => console.log(nextProps));
  }
  render() {
    return (
      <div>
        <h1>Hello world</h1>
      </div>
    );
  }
}
```
