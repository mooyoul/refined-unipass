import * as React from 'react';

type OnChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
type OnChangeCallback = (event: OnChangeEvent) => void;

export function useTextInput(initial: string = ''): [string, OnChangeCallback] {
  const [value, setValue] = React.useState(initial);

  const onChange: OnChangeCallback = (event: OnChangeEvent) => {
    setValue(event.target.value);
  };

  return [value, onChange];
}

export function useNumberInput(initial: number): [number, OnChangeCallback] {
  const [value, setValue] = React.useState(initial);

  const onChange: OnChangeCallback = (event: OnChangeEvent) => {
    setValue(parseInt(event.target.value, 10));
  };

  return [value, onChange];
}
