import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.sass';

import { Callout } from './components/callout';
import { TrackingDetail } from './components/tracking-detail';
// eslint-disable-next-line no-unused-vars
import { TrackingForm, TrackingInput } from './components/tracking-form';
import { TrackingList } from './components/tracking-list';
import { useQuery } from './components/use-query';

function App() {
  const [input, setInput] = React.useState<TrackingInput | null>(null);
  const { isLoading, data, error } = useQuery(input);
  const onSubmit = (value: TrackingInput) => {
    setInput(value);
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
