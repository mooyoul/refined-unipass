import * as React from 'react';

export type CalloutProps = React.PropsWithChildren<{
  modifier: 'is-warning' | 'is-danger';
}>;

export function Callout(props: CalloutProps) {
  const { children, modifier } = props;

  return (
    <p className={`callout ${modifier}`}>
      { children }
    </p>
  );
}
