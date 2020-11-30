import * as React from 'react';
import { CargoClearanceProgressTypes } from 'unipass';
import { format as formatDate } from '../../../util/date';

export type TrackingDetailEventsTableProps = {
  data: CargoClearanceProgressTypes.DetailedQueryResult;
};

export const TrackingDetailEventsTable: React.FunctionComponent<TrackingDetailEventsTableProps> = (props) => {
  const { data } = props;

  return (
    <div className="table-container tracking-detail-events-table">
      <table className="table">
        <thead>
          <tr>
            <th rowSpan={2}>#</th>
            <th>처리단계</th>
            <th>장치장/장치위치</th>
            <th>포장개수</th>
            <th>반출입(처리)일시</th>
            <th>신고번호</th>
          </tr>
          <tr>
            <th>처리일시</th>
            <th>장치장명</th>
            <th>중량</th>
            <th>반출입(처리)내용</th>
            <th>반출입근거번호</th>
          </tr>
        </thead>
        { data.events.length === 0 && (
          <tbody>
            <tr>
              <td colSpan={6}>통관 기록이 존재하지 않습니다.</td>
            </tr>
          </tbody>
        ) }

        { data.events.map((event, index) => {
          const key = `${data.ref}-events-${index}`;

          const hasNotes = !!event.notes;

          const rowNumber = data.events.length - index;
          const rowSpan = hasNotes ? 3 : 2;

          return (
            <tbody key={key}>
              <tr>
                <td rowSpan={rowSpan}>{rowNumber}</td>
                <td>{event.summary}</td>
                <td>{event.shed.code}</td>
                <td>{event.package.value} {event.package.unit}</td>
                <td>{event.carry.date && formatDate(event.carry.date, 'YYYY-MM-DD HH:mm:ss')}</td>
                <td>{event.declarationId}</td>
              </tr>
              <tr>
                <td>{formatDate(event.updatedAt, 'YYYY-MM-DD HH:mm:ss')}</td>
                <td>{event.shed.name}</td>
                <td>{event.weight.value} {event.weight.unit}</td>
                <td>{event.carry.summary}</td>
                <td>{event.carry.notes}</td>
              </tr>
              { hasNotes && (
                <tr>
                  <td colSpan={6}>{event.notes}</td>
                </tr>
              ) }
            </tbody>
          );
        }) }
      </table>
    </div>
  );
};
