import { EUserActionTypes } from '../enums';

export interface IAction<T> {
  type: IActionType;
  payload: T;
}

export type IActionType = EUserActionTypes;
