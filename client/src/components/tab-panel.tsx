import * as React from 'react';
import useConstant from 'use-constant';

export type TabPanelContext = {
  acquireTabIndex(): number;
  acquirePanelIndex(): number;
  activeIndex: number;
  setActiveIndex(index: number): void;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
const TabPanelContext = React.createContext<TabPanelContext>({
  acquireTabIndex: () => 0,
  acquirePanelIndex: () => 0,
  activeIndex: 0,
  setActiveIndex() { /* no op */ },
});

export const TabPanel: React.FunctionComponent<React.PropsWithChildren<Record<string, unknown>>> = (props) => {
  const { children } = props;

  const [activeIndex, setActiveIndex] = React.useState(0);

  let tab = 0;
  let panel = 0;

  const state = {
    // eslint-disable-next-line no-plusplus
    acquireTabIndex: () => tab++,
    // eslint-disable-next-line no-plusplus
    acquirePanelIndex: () => panel++,
    activeIndex,
    setActiveIndex,
  } as TabPanelContext;

  return (
    <TabPanelContext.Provider value={state}>{children}</TabPanelContext.Provider>
  );
};

export const useTabState = (): {
  isActive: boolean;
  activate: () => void;
} => {
  const {
    activeIndex,
    acquireTabIndex,
    setActiveIndex,
  } = React.useContext(TabPanelContext);

  const tabIndex = useConstant(() => acquireTabIndex());

  return React.useMemo(
    () => ({
      isActive: activeIndex === tabIndex,
      activate: () => setActiveIndex(tabIndex),
    }),
    [activeIndex, setActiveIndex, tabIndex],
  );
};

export const usePanelState = (): {
  isActive: boolean;
} => {
  const { activeIndex, acquirePanelIndex } = React.useContext(TabPanelContext);
  const panelIndex = useConstant(() => acquirePanelIndex());

  return { isActive: panelIndex === activeIndex };
};
