import * as React from 'react';

import useConstant from 'use-constant';

export type TabPanelContext = {
  acquireTabIndex(): number;
  acquirePanelIndex(): number;
  activeIndex: number;
  setActiveIndex(index: number): void;
}

const TabPanelContext = React.createContext<TabPanelContext>({
  acquireTabIndex: () => 0,
  acquirePanelIndex: () => 0,
  activeIndex: 0,
  setActiveIndex() { },
});

export type TabPanelProps = React.PropsWithChildren<{}>;

export const TabPanel = (props: TabPanelProps) => {
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

export const useTabState = () => {
  const {
    activeIndex,
    acquireTabIndex,
    setActiveIndex,
  } = React.useContext(TabPanelContext);

  const tabIndex = useConstant(() => acquireTabIndex());

  const onClick = () => setActiveIndex(tabIndex);

  return React.useMemo(
    () => ({
      isActive: activeIndex === tabIndex,
      onClick,
    }),
    [activeIndex, onClick, tabIndex],
  );
};

export const usePanelState = () => {
  const { activeIndex, acquirePanelIndex } = React.useContext(TabPanelContext);
  const panelIndex = useConstant(() => acquirePanelIndex());

  return { isActive: panelIndex === activeIndex };
};
