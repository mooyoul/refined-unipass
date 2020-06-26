/* eslint-disable */
import * as React from 'react';

import { TabPanel, useTabState } from "../tab-panel";
import { TrackingFormPanelAutomatic } from "./panels/automatic";
import { TrackingFormPanelBillOfLanding, TrackingFormPanelBillOfLandingInput } from "./panels/bill-of-landing";
import { TrackingFormPanelReference } from "./panels/reference";

export const enum TrackingInputType {
  Automatic = "AUTOMATIC",
  Reference = "REF",
  BL = "BL",
}

export type AutomaticTrackingInput = {
  type: TrackingInputType.Automatic,
  value: string;
}

export type ReferenceTrackingInput = {
  type: TrackingInputType.Reference,
  value: string;
}

export type BLTrackingInput = {
  type: TrackingInputType.BL,
  value: TrackingFormPanelBillOfLandingInput;
};

export type TrackingInput = AutomaticTrackingInput
  | ReferenceTrackingInput
  | BLTrackingInput;

export type TabProps = React.PropsWithChildren<{}>;
export function TrackingFormTab(props: TabProps) {
  const { children } = props;
  const { isActive, onClick } = useTabState();

  return (
    <li className={isActive ? 'is-active' : ''}>
      {/* eslint-disable-next-line */}
      <a onClick={onClick}>
        {children}
      </a>
    </li>
  );
}

export type TrackingFormProps = {
  disabled?: boolean;
  onSubmit(value: TrackingInput): void;
}
export function TrackingForm(props: TrackingFormProps) {
  const { disabled, onSubmit } = props;

  const onAutomaticSubmit = (value: string) => onSubmit({
    type: TrackingInputType.Automatic,
    value,
  });

  const onReferenceSubmit = (value: string) => onSubmit({
    type: TrackingInputType.Reference,
    value,
  });
  const onBillOfLandingSubmit = (value: TrackingFormPanelBillOfLandingInput) => onSubmit({
    type: TrackingInputType.BL,
    value,
  });

  return (
    <div className="container is-narrow">
      <TabPanel>
        <div className="tracking-form">
          <div className="tabs is-fullwidth">
            <ul>
              <TrackingFormTab>
                <span>⚡️ 간편조회</span>
              </TrackingFormTab>
              <TrackingFormTab>
                <span>화물관리번호</span>
              </TrackingFormTab>
              <TrackingFormTab>
                <span>B/L</span>
              </TrackingFormTab>
            </ul>
          </div>

          <TrackingFormPanelAutomatic disabled={disabled} onSubmit={onAutomaticSubmit} />
          <TrackingFormPanelReference disabled={disabled} onSubmit={onReferenceSubmit} />
          <TrackingFormPanelBillOfLanding disabled={disabled} onSubmit={onBillOfLandingSubmit} />
        </div>
      </TabPanel>
    </div>
  );
}
