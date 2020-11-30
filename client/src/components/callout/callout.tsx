import * as React from 'react';

export type CalloutProps = React.PropsWithChildren<{
  modifier: 'is-warning' | 'is-danger';
}>;

export const Callout: React.FunctionComponent<CalloutProps> = (props) => {
  const { children, modifier } = props;

  return (
    <div className="container is-narrow is-padded">
      <p className={`callout ${modifier}`}>
        { children }
      </p>
    </div>
  );
};
