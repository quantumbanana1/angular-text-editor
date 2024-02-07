import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// @ts-ignore
import { IState, AlllowedStates, AllowedValues } from './textEditorTypes';
enum AllowedStates {
  null,
  bold,
  italic,
  underline,
  image,
}

type AllowedValues = keyof typeof AllowedStates;
interface IState {
  values: AllowedValues[];
}

const defaultState: IState = {
  values: ['null'],
};

@Injectable({
  providedIn: 'root',
})
export class TextEditorService {
  public setBoldText = new BehaviorSubject<IState>(defaultState);
  notifyBoldTextChange = this.setBoldText.asObservable();

  constructor() {}

  setBold() {
    defaultState.values.push('bold');
    return this.setBoldText.next(defaultState);
  }
}
