import * as React from 'react';
import { Observable, Subscription } from 'rxjs';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// tslint:disable:prefer-object-spread

export default <TProps extends StateProps & ActionsProps, StateProps, ActionsProps>(
  observable: () => Observable<StateProps>,
  triggers: ActionsProps,
) =>
  (Component: React.ComponentType<TProps>): React.ComponentClass<Omit<TProps, keyof (StateProps & ActionsProps)>> => {

    class WithObservableStream extends React.PureComponent<Omit<TProps, keyof (StateProps & ActionsProps)>> {
      public store = {} as StateProps;
      public subscription: Subscription | null = null;

      constructor(props: Omit<TProps, keyof (StateProps & ActionsProps)>) {
        super(props);
        this.subscription = observable().subscribe(newState => {
          this.store = Object.assign({}, this.store, newState);
          this.forceUpdate();
        });
      }

      public render() {
        return (
          <Component {...this.store} {...this.props} {...triggers} />
        );
      }
    }

    return WithObservableStream;
  };
