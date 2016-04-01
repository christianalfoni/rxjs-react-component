# rxjs-react-component
A component allowing you to change state using observables

### Install
`npm install rxjs-react-component`

Depends on React and rxjs

### Howto

```js
import React from 'react';
import ObservableComponent from 'rxjs-react-component';

class MyComponent extends ObservableComponent {
  constructor(props) {
    super(props);
    this.state = {count: 0};
  }
  getObservables() {
    return {
      onClick$(observable, getState) {
        return observable.map(() => ({count: getState().count + 1}));
      }
    }
  }
  render() {
    return (
      <div>
        <h1>Hello world ({this.state.count})</h1>
        <button onClick={this.observables.onClick$}>Increase</button>
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
  getObservables() {
    return {
      onClick$(observable, getState) {
        const increase$ = observable.map(() => ({count: getState().count + 1}));
        const delayedIncrease$ = observable.delay(200).map(() => ({count: getState().count + 1}));
        return Observable.merge(
          increase$,
          delayedIncrease$
        );
      }
    }
  }
  render() {
    return (
      <div>
        <h1>Hello world ({this.state.count})</h1>
        <button onClick={this.observables.onClick$}>Increase</button>
      </div>
    );
  }
}
```
