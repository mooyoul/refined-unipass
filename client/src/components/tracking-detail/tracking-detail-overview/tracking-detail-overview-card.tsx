/* eslint-disable react/jsx-one-expression-per-line */
import * as React from 'react';

// eslint-disable-next-line no-unused-vars,import/no-extraneous-dependencies
import { CargoClearanceProgressTypes } from 'unipass';
import { format as formatDate } from '../../../util/date';

export type TrackingDetailOverviewCardProps = {
  data: CargoClearanceProgressTypes.DetailedQueryResult;
};

// eslint-disable-next-line no-unused-vars
export function TrackingDetailOverviewCard(props: TrackingDetailOverviewCardProps) {
  const { data } = props;

  return (
    <div className="tracking-detail-overview-card">
      <h3 className="title">{data.clearance.summary}</h3>
      <p className="content">
        <span className="tag">화물관리번호: {data.ref}</span>
        <span className="tag">House B/L: {data.houseBL}</span>
        <span className="tag">입항일: {formatDate(data.arrival.date, 'YYYY-MM-DD')}</span>
        <br />
        조회하신 <span className="tag">{data.product}</span> 화물은 현재 <span className="tag">{data.status.summary}</span> 상태입니다.
      </p>
    </div>
  );
}
