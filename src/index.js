import React from 'react';
import {Observable, Subject} from 'rxjs';

function isObject(obj) {
  return !Array.isArray(obj) && typeof obj === 'object' && obj !== null
}

class ObservableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.observables = {};
  }
  componentWillMount() {
    if (!this.state) {
      throw new Error('ObservableComponent: You have to define some initial state on your component');
    }

    if (!this.getObservables) {
      throw new Error('ObservableComponent: You have to define a getObservables method which returns your observables. You mistyped maybe?');
    }

    const observables = this.getObservables();

    if (!isObject(observables)) {
      throw new Error('ObservableComponent: You did not return an object from the getObservables method');
    }

    const getState = () => {
      return this.state;
    }

    const stateChangers = Object.keys(observables).reduce((stateChangers, key) => {
      const subject = new Subject();

      if (typeof observables[key] !== 'function') {
        throw new Error('ObservableComponent: You did not set a function on ' + key);
      }

      const stateChange$ = observables[key](subject, getState);

      if (!stateChange$) {
        throw new Error('ObservableComponent: You did not return an observable from the key ' + key);
      }

      return stateChangers.concat({
        key,
        cb() {subject.next(arguments[0])},
        stateChange$
      });
    }, []);

    stateChangers.reduce((observables, stateChanger) => {
      observables[stateChanger.key] = stateChanger.cb;

      return observables;
    }, this.observables);

    const stateChangers$ = stateChangers.map(stateChanger => stateChanger.stateChange$);
    Observable.merge.apply(Observable, stateChangers$)
      .subscribe(newState => {

        if (!isObject(newState)) {
          throw new Error('ObservableComponent: You did not return an object as a state change');
        }

        this.setState(newState);
      });
  }
}

export default ObservableComponent;
