import * as React from 'react';

// eslint-disable-next-line
import { CargoClearanceProgressTypes } from 'unipass';

import { format } from '../../util/date';
import { Callout } from '../callout';

export type TrackingListProps = {
  data: CargoClearanceProgressTypes.MultipleQueryResult;
};

export function TrackingList(props: TrackingListProps) {
  const { data } = props;

  const [objectUrl, setObjectUrl] = React.useState<null | string>(null);
  const blob = React.useMemo(
    () => {
      const headers = [
        '#',
        '화물관리번호',
        'Master B/L',
        'House B/L',
        '입항일',
        '양륙항',
        '운송사명',
      ].join(',');

      const rows = data.records
        .map((record, index) => [
          index + 1,
          JSON.stringify(record.ref),
          JSON.stringify(record.masterBL),
          JSON.stringify(record.houseBL),
          format(record.arrival.date, 'YYYY-MM-DD'),
          JSON.stringify(record.arrival.port.name),
          JSON.stringify(record.carrier.name),
        ].join(','));

      const csv = [
        headers,
        ...rows,
      ].join('\n');

      return new Blob([csv], { type: 'text/csv; charset=utf-8' });
    }, [data],
  );

  React.useEffect(() => {
    const url = URL.createObjectURL(blob);
    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [blob]);

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
      <Callout modifier="is-warning">
        ⚠️ 복수의 결과가 존재하는 경우, 미리보기를 제공하지 않습니다.
        <br />
        결과를 확인해야 하는 경우, 아래 버튼을 클릭해 다운로드 받으시기 바랍니다.
      </Callout>
      <div className="container is-narrow is-padded">
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        <h3 className="title">
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          { data.records.length }개의 조회 결과
        </h3>
        <p className="content">
          {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
          <a className="button is-light" href={objectUrl!} download="tracking.csv">💾 리스트 내려받기</a>
        </p>
      </div>
    </>
  );
}
