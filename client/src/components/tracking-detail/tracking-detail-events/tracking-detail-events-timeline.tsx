import * as React from 'react';

import { CargoClearanceProgressTypes } from 'unipass';
import {
  groupBy,
  pipe,
  sortBy,
} from '../../../util/collection';
import { format as formatDate } from '../../../util/date';

const groupEventsDateTime = (format: string) => pipe(
  groupBy<CargoClearanceProgressTypes.DeclarationEvent, string>(
    (event) => formatDate(event.updatedAt, format),
  ),
  sortBy(([date]) => date, true),
);

export type TrackingDetailEventsTimelineProps = {
  data: CargoClearanceProgressTypes.DetailedQueryResult;
};

export const TrackingDetailEventsTimeline: React.FunctionComponent<TrackingDetailEventsTimelineProps> = (props) => {
  const { data } = props;

  const feed = groupEventsDateTime('YYYY-MM-DD')(data.events)
    .map(([, dateGroupedEvents]) => {
      const timeGrouped = groupEventsDateTime('HH:mm')(dateGroupedEvents);

      return {
        date: formatDate(dateGroupedEvents[0].updatedAt, 'M월 D일, dddd'),
        times: timeGrouped.map(([time, timeGroupedEvents]) => ({
          time,
          events: timeGroupedEvents,
        })),
      };
    });

  return (
    <div className="tracking-detail-events-timeline">
      { feed.map(({ date, times }) => (
        <div className="timeline-item" key={date}>
          <h4 className="timeline-title">{date}</h4>
          <ol className="timeline-events">
            { times.map(({ time, events }) => events.map((event, index) => {
              const key = `${date}-${time}-${index}`;

              return (
                <li className="timeline-event" key={key}>
                  { index === 0 && <time className="timeline-event-time" dateTime={event.updatedAt as unknown as string}>{time}</time> }
                  { index !== 0 && <span className="timeline-event-time" /> }
                  <span className="timeline-event-summary">
                    <span className="timeline-event-status">
                      {event.summary}
                      { event.carry.summary && ` (${event.carry.summary})`}
                    </span>
                    { event.shed.name && (
                      <small className="timeline-item-location">{event.shed.name}</small>
                    ) }
                  </span>
                </li>
              );
            })) }
          </ol>
        </div>
      )) }
    </div>
  );
};
