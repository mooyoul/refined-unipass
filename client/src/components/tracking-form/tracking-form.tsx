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

export type TrackingFormTabProps = React.PropsWithChildren<{
  onClick?: () => void;
}>;

export const TrackingFormTab: React.FunctionComponent<TrackingFormTabProps> = (props) => {
  const { children, onClick } = props;
  const { isActive, activate } = useTabState();

  const onClickCallback = React.useCallback(() => {
    activate();
    onClick?.();
  }, [activate, onClick]);

  return (
    <li className={isActive ? 'is-active' : ''}>
      {/* eslint-disable-next-line */}
      <a onClick={onClickCallback}>
        {children}
      </a>
    </li>
  );
};

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
              <TrackingFormTab onClick={() => gtag("event", "tab", { event_category: "automatic" })}>
                <span>⚡️ 간편조회</span>
              </TrackingFormTab>
              <TrackingFormTab onClick={() => gtag("event", "tab", { event_category: "reference" })}>
                <span>화물관리번호</span>
              </TrackingFormTab>
              <TrackingFormTab onClick={() => gtag("event", "tab", { event_category: "bill-of-landing" })}>
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
