import * as React from 'react';

import { useNumberInput, useTextInput } from '../../form';
import { TrackingFormPanel } from './base';

const range = (start: number, end: number): number[] => {
  const collection: number[] = [];
  // eslint-disable-next-line no-plusplus
  for (let i = start; i <= end; i++) {
    collection.push(i);
  }
  return collection;
};

export type TrackingFormPanelBillOfLandingInput = {
  masterBL: string;
  houseBL: string;
  year: number;
};

export type TrackingFormPanelBillOfLandingProps = {
  disabled?: boolean;
  onSubmit(value: TrackingFormPanelBillOfLandingInput): void;
};

export function TrackingFormPanelBillOfLanding(props: TrackingFormPanelBillOfLandingProps) {
  const { disabled, onSubmit } = props;
  const [masterBL, onMasterBLChange] = useTextInput();
  const [houseBL, onHouseBLChange] = useTextInput();

  const currentYear = new Date().getFullYear();
  const [year, onYearChange] = useNumberInput(currentYear);
  const years = range(currentYear - 10, currentYear + 1);

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      houseBL,
      masterBL,
      year,
    });
  };

  return (
    <TrackingFormPanel>
      <form onSubmit={onFormSubmit}>
        <fieldset disabled={disabled}>
          <div className="field">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="label" htmlFor="master_bl">Master B/L</label>
            <div className="control">
              <input className="input" type="text" name="master_bl" placeholder="1234567890" value={masterBL} onChange={onMasterBLChange} />
            </div>
          </div>
          <div className="field">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="label" htmlFor="house_bl">House B/L</label>
            <div className="control">
              <input className="input" type="text" name="house_bl" placeholder="1234567890" value={houseBL} onChange={onHouseBLChange} />
            </div>
          </div>
          <div className="field">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="label" htmlFor="year">입항년도</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="year" onChange={onYearChange} value={year}>
                  { years.map((value) => (
                    <option key={value} value={value}>
                      {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                      {value}년
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <button type="submit" className={disabled ? 'button is-primary is-medium is-fullwidth is-loading' : 'button is-primary is-medium is-fullwidth'}>
            조회하기
          </button>
        </fieldset>
      </form>
    </TrackingFormPanel>
  );
}
