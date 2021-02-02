import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Callout } from './components/callout';
import { useLocation } from "./components/location";
import { TrackingDetail } from './components/tracking-detail';
import { TrackingForm, TrackingInput } from './components/tracking-form';
import { TrackingList } from './components/tracking-list';
import { useQuery } from './components/use-query';

import './index.sass';

function App() {
  const { shouldBait, referrer } = useLocation();
  const [trapped, setTrapped] = React.useState<boolean>(false);
  const [input, setInput] = React.useState<TrackingInput | null>(null);
  const { isLoading, data, error } = useQuery(input);
  const onSubmit = (value: TrackingInput) => {
    if (shouldBait && !trapped) {
      setTrapped(true);
      window.open("https://www.catchfashion.com/", "_blank");
      gtag("event", "bait", {
        event_category: referrer,
      });
    }

    setInput(value);
    gtag("event", "enquiry", {
      event_category: value.type,
    });
  };

  return (
    <>
      <section className="hero is-primary">
        <div className="hero-body">
          <div className="container is-narrow">
            <h1 className="title is-spaced">
              <span className="is-block is-size-1 mb-3" role="img" aria-label="Box Icon">📦</span>
              관세청 수입통관 조회
            </h1>
            <h2 className="subtitle">
              조회하실 화물관리번호 혹은 운송장번호를 입력하세요.
            </h2>
          </div>
          <div className="container is-narrow mt-6">
            <a className="card is-block is-sponsored" href="https://www.catchfashion.com/about/catch" target="_blank">
              <div className="card-content">
                <p className="mb-2 has-text-grey">
                  <span className="tag is-light">Sponsored</span>
                </p>
                <div className="media">
                  <div className="media-left">
                    <figure className="image is-48x48">
                      <img src="https://www.catchfashion.com/favicon.png" alt="CATCH" />
                    </figure>
                  </div>
                  <div className="media-content">
                    <p className="title is-6 has-text-weight-medium has-text-dark mb-2">캐치패션 - 세상 쉬운 명품 직구</p>
                    <p className="subtitle is-6 has-text-grey mt-2">
                      전세계 13000여개 명품 브랜드, 240만개 이상의 럭셔리 상품의 실시간 가격을 비교하고 한국어 결제까지 한 번에!
                    </p>
                    <p className="has-text-grey-dark has-text-underline">자세히 알아보기</p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <TrackingForm disabled={isLoading} onSubmit={onSubmit} />

      { error && (
        <Callout modifier="is-danger">
          { error.message }
        </Callout>
      ) }

      { !error && (data && !data.data) && (
        <Callout modifier="is-warning">
          조회 결과가 없습니다.
        </Callout>
      ) }

      { data?.data?.type === 'MULTIPLE' && (
        <TrackingList data={data.data} />
      ) }

      { data?.data?.type === 'DETAILED' && (
        <TrackingDetail data={data.data} />
      ) }

      { /* }
      <div>
        <h3>Error</h3>
        <p>{ JSON.stringify(error) }</p>
        <h3>Data</h3>
        <p>{ JSON.stringify(data) }</p>
      </div>
      { */ }

      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            {/* eslint-disable */}
            Made with <span role="img" aria-label="Love">❤️</span> by <a href="https://github.com/mooyoul">MooYeol Lee</a>
            <br />
            <a href="https://github.com/mooyoul/refined-unipass" target="_blank">The source code</a> is <a href="http://opensource.org/licenses/mit-license.php">MIT</a> licensed.
            {/* eslint-enable */}
          </p>
        </div>
      </footer>
    </>
  );
}

ReactDOM.render((<App />), document.getElementById('app'));
