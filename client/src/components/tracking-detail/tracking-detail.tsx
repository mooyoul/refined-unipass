import * as React from 'react';
// eslint-disable-next-line no-unused-vars,import/no-extraneous-dependencies
import { CargoClearanceProgressTypes } from 'unipass';

import { TrackingDetailEventsTable, TrackingDetailEventsTimeline } from './tracking-detail-events';
import { TrackingDetailOverviewCard, TrackingDetailOverviewTable } from './tracking-detail-overview';

export type TrackingDetailProps = {
  data: CargoClearanceProgressTypes.DetailedQueryResult;
};

// eslint-disable-next-line no-unused-vars
export function TrackingDetail(props: TrackingDetailProps) {
  const { data } = props;

  const [detailedViewEnabled, enableDetailedView] = React.useState(false);

  const onDisableDetailedOverviewClicked = React.useCallback(() => {
    enableDetailedView(false);
  }, []);
  const onEnableDetailedOverviewClicked = React.useCallback(() => {
    enableDetailedView(true);
  }, []);

  const detailedOverviewButtonClassNames = React.useMemo(() => {
    const baseClass = 'button is-small is-light';
    const activeClass = 'is-info';

    const classes = {
      disable: baseClass,
      enable: baseClass,
    };

    const active = detailedViewEnabled ? 'disable' : 'enable';
    classes[active] = `${baseClass} ${activeClass}`;

    return classes;
  }, [detailedViewEnabled]);

  return (
    <section className="tracking-detail">
      <div className="container is-narrow is-padded">
        <div className="buttons is-right">
          <button type="button" className={detailedOverviewButtonClassNames.enable} onClick={onDisableDetailedOverviewClicked}>
            {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
            <span className="icon">🔖</span>
            <span>간략히</span>
          </button>
          <button type="button" className={detailedOverviewButtonClassNames.disable} onClick={onEnableDetailedOverviewClicked}>
            {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
            <span className="icon">📚</span>
            <span>자세히</span>
          </button>
        </div>
      </div>

      { !detailedViewEnabled && (
        <div className="container is-narrow is-padded">
          <TrackingDetailOverviewCard data={data} />
          <TrackingDetailEventsTimeline data={data} />
        </div>
      ) }

      { detailedViewEnabled && (
        <div className="container">
          <TrackingDetailOverviewTable data={data} />
          <TrackingDetailEventsTable data={data} />
        </div>
      ) }
    </section>
  );
}
