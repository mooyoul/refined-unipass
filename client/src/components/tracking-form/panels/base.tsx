import * as React from 'react';
import { usePanelState } from '../../tab-panel';

export const TrackingFormPanel: React.FunctionComponent<React.PropsWithChildren<Record<string, unknown>>> = (props) => {
  const { children } = props;
  const { isActive } = usePanelState();

  return (
    <div style={{
      display: isActive ? 'block' : 'none',
    }}
    >
      {children}
    </div>
  );
};
