import React from 'react';
import {Observable, Subject} from 'rxjs';

function isObject(obj) {
  return !Array.isArray(obj) && typeof obj === 'object' && obj !== null
}

class ObservableComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const observables = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).reduce((observables, key) => {
      if (key[key.length - 1] === '$') {
        observables[key] = this[key];
      }
      return observables;
    }, {});

    const getState = () => {
      return this.state;
    }

    const stateChangers = Object.keys(observables).reduce((stateChangers, key) => {
      const subject = new Subject();

      if (typeof observables[key] !== 'function') {
        throw new Error('ObservableComponent: You did not set a function on ' + key);
      }

      if (key === 'componentDidMount$') {
        this.componentDidMount = () => subject.next();
      }

      if (key === 'componentWillUnmount$') {
        this.componntWillUnmount = () => subject.next();
      }

      if (key === 'componentWillReceiveProps$') {
        this.componentWillReceiveProps = (nextProps) => subject.next(nextProps);
      }

      if (key === 'componentWillUpdate$') {
        this.componentWillUpdate = (nextProps, nextState) => subject.next({nextProps, nextState});
      }

      if (key === 'componentDidUpdate$') {
        this.componentDidUpdate = (prevProps, prevState) => subject.next({prevProps, prevState});
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

    stateChangers.forEach((stateChanger) => {
      this[stateChanger.key] = stateChanger.cb;
    });

    const stateChangers$ = stateChangers
      .filter(stateChanger => Boolean(stateChanger.stateChange$))
      .map(stateChanger => stateChanger.stateChange$);
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
