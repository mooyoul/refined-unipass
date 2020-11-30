import * as React from 'react';

import { CargoClearanceProgressTypes } from 'unipass';
import { format as formatDate } from '../../../util/date';

export type TrackingDetailOverviewTableProps = {
  data: CargoClearanceProgressTypes.DetailedQueryResult;
};

export const TrackingDetailOverviewTable: React.FunctionComponent<TrackingDetailOverviewTableProps> = (props) => {
  const { data } = props;

  return (
    <div className="table-container tracking-detail-overview-table">
      <table className="table is-hoverable">
        <tbody>
          <tr>
            <th>화물관리번호</th>
            <td>{data.ref}</td>
            <th>진행상태</th>
            <td>{data.status.summary}</td>
            <th>선사/항공사</th>
            <td colSpan={3}>{data.forwarder.name}</td>
          </tr>
          <tr>
            <th>Master B/L - House B/L</th>
            <td>{data.masterBL} - {data.houseBL}</td>
            <th>화물구분</th>
            <td>{data.cargo.type}</td>
            <th>선박/항공편명</th>
            <td colSpan={3}>{data.ship.name}</td>
          </tr>
          <tr>
            <th>통관진행상태</th>
            <td>{data.clearance.summary}</td>
            <th>처리일시</th>
            <td>{formatDate(data.status.updatedAt, 'YYYY-MM-DD HH:mm:ss')}</td>
            <th>선박국적</th>
            <td>{data.ship.nationality.name}</td>
            <th>선박대리점</th>
            <td>{data.agency}</td>
          </tr>
          <tr>
            <th>품명</th>
            <td colSpan={3}>{data.product}</td>
            <th>적재항</th>
            <td colSpan={3}>{data.arrival.port.name}</td>
          </tr>
          <tr>
            <th>포장개수</th>
            <td>{data.package.value} {data.package.unit}</td>
            <th>총 중량</th>
            <td>{data.weight.value} {data.weight.unit}</td>
            <th>양륙항</th>
            <td>{data.arrival.port.code}:{data.arrival.port.name}</td>
            <th>입항세관</th>
            <td>{data.arrival.customs}</td>
          </tr>
          <tr>
            <th>용적</th>
            <td>{data.measurement}</td>
            <th>B/L유형</th>
            <td>{data.billType.name}</td>
            <th>입항일</th>
            <td>{formatDate(data.arrival.date, 'YYYY-MM-DD')}</td>
            <th>항차</th>
            <td>{data.voyage}</td>
          </tr>
          <tr>
            <th>관리대상지정여부</th>
            <td>{data.cargo.isManagedTarget ? 'Y' : 'N'}</td>
            <th>컨테이너개수</th>
            <td>{data.container.count}</td>
            <th>반출의무과태료</th>
            <td>{data.cargo.hasReleasePeriodPassedDuty ? 'Y' : 'N'}</td>
            <th>신고지연가산세</th>
            <td>{data.cargo.hasDelayedClearanceTax ? 'Y' : 'N'}</td>
          </tr>
          <tr>
            <th>특수화물코드</th>
            <td>{data.cargo.specialCargoCode}</td>
            <th>컨테이너번호</th>
            <td colSpan={5}>{data.container.ref}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
