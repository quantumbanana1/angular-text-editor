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

  public setNullText = new BehaviorSubject<IState>(defaultState);
  notifyNullTextChange = this.setNullText.asObservable();

  public setNewElement = new BehaviorSubject(true);
  notifyNewElement = this.setNewElement.asObservable();

  constructor() {}

  setBold() {
    console.log(defaultState);
    if (defaultState.values.includes('null')) {
      defaultState.values = defaultState.values.filter(
        (value) => value !== 'null',
      );
      defaultState.values.push('bold');
      return this.setBoldText.next(defaultState);
    }

    if (defaultState.values.includes('bold')) {
      defaultState.values = defaultState.values.filter(
        (value) => value !== 'bold',
      );
      if (defaultState.values.length === 0) {
        return this.setNull();
      }
    }
  }

  setNull() {
    defaultState.values = ['null'];
    return this.setNullText.next(defaultState);
  }
}
