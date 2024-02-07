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
