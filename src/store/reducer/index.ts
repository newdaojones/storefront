import { Reducer, combineReducers } from 'redux';

import { IAction } from '../../models';
import { userReducer } from './user.reducer';

export function createReducer<S>(initialState: S, handlers: any): Reducer<S> {
  const r = (state: S = initialState, action: IAction<S>): S => {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };

  return r as Reducer<S>;
}

const rootReducer = () =>
  combineReducers({
    userState: userReducer,
  });

export default rootReducer();
