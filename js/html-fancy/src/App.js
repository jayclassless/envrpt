import {Router, Link} from 'preact-router';
import {createHashHistory} from 'history';

import EnvironmentContext from './EnvironmentContext';
import PackageDetail from './PackageDetail';
import PackageList from './PackageList';
import Summary from './Summary';


function uniqAdd(arr, value) {
  if (!arr.includes(value)) {
    arr.push(value);
  }
}


export default function App({environment, home_page}) {
  let env = {
    outdated: [],
    vulnerable: [],
    broken: [],
    ...environment
  };

  for (let [key, pkg] of Object.entries(env['packages'])) {
    pkg['issues'].forEach(issue => {
      pkg.outdated = pkg.vulnerable = pkg.broken = false;
      switch (issue.type) {
        case 'OUTDATED':
          uniqAdd(env['outdated'], key);
          pkg.outdated = true;
          break;
        case 'VULNERABLE':
          uniqAdd(env['vulnerable'], key);
          pkg.vulnerable = true;
          break;
        case 'REQ_INVALID':
        case 'REQ_MISSING':
          uniqAdd(env['broken'], key);
          pkg.broken = true;
          break
      }
    });
  }

  return (
    <EnvironmentContext.Provider value={env}>
      <header class="navbar">
        <section class="navbar-section">
          <Link href="/" class="navbar-brand m-2"><strong>Python Environment Report</strong></Link>
          <Link href="/pkg" class="btn btn-link">Installed Packages</Link>
        </section>
        <section class="navbar-section">
          <a href={home_page} class="m-2">{env.analyzer}</a>
        </section>
      </header>
      <Router history={createHashHistory({hashType: 'noslash'})}>
        <PackageList path="/pkg" />
        <PackageDetail path="/pkg/:pkg" />
        <Summary default path="/" />
      </Router>
    </EnvironmentContext.Provider>
  );
}

