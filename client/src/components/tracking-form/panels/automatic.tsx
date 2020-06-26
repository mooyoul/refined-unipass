import * as React from 'react';

import { useTextInput } from '../../form';
import { TrackingFormPanel } from './base';

export type TrackingFormPanelAutomaticProps = {
  disabled?: boolean;
  onSubmit(value: string): void;
};

export function TrackingFormPanelAutomatic(props: TrackingFormPanelAutomaticProps) {
  const { disabled, onSubmit } = props;
  const [value, onChange] = useTextInput();

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value);
  };

  return (
    <TrackingFormPanel>
      <form onSubmit={onFormSubmit}>
        <fieldset disabled={disabled}>
          <div className="field">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="label" htmlFor="automatic">화물관리번호 혹은 운송장번호 입력</label>
            <div className="control">
              <input className="input" type="text" name="automatic" placeholder="1234567890" value={value} onChange={onChange} required />
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
