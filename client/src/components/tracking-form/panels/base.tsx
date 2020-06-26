import * as React from 'react';
import { usePanelState } from '../../tab-panel';

export type PanelProps = React.PropsWithChildren<{}>;

export function TrackingFormPanel(props: PanelProps) {
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
}
