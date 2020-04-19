import {useContext} from 'preact/hooks';
import {Link} from 'preact-router';

import EnvironmentContext from './EnvironmentContext';


function FullDateTime({value}) {
  let dt = new Intl.DateTimeFormat(
    'default',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }
  ).format(
    new Date(value)
  );

  return <span>{dt}</span>;
}


function IssueSummary() {
  const environment = useContext(EnvironmentContext);

  let columns = [];
  [
    ['outdated', 'Outdated', 'Packages that have newer versions available'],
    ['vulnerable', 'Vulnerable', 'Packages that have known vulnerabilities'],
    ['broken', 'Broken', 'Packages that have dependency problems'],
  ].forEach(type => {
    if (environment[type[0]].length > 0) {
      columns.push(
        <div class="column">
          <h6
            class="tooltip"
            data-tooltip={type[2]}>
            {`${type[1]} (${environment[type[0]].length})`}
          </h6>
          <ul>
            {environment[type[0]].sort().map(key => {
              let pkg = environment.packages[key];
              return (
                <li><Link href={`/pkg/${pkg.key}`}>{pkg.name}</Link></li>
              );
            })}
          </ul>
        </div>
      );
    }
  });

  if (columns.length === 0) {
    return (
      <span class="label label-success">None!</span>
    );
  }

  return (
    <div class="container">
      <div class="columns">
        {columns}
      </div>
    </div>
  );
}


export default function Summary() {
  const environment = useContext(EnvironmentContext);
  let pkgs = Object.keys(environment.packages);

  document.title = 'Python Environment Report';

  return (
    <div class="container">
      <div class="columns">
        <div class="column col-6 col-mx-auto">
          <table class="table mt-2">
            <tbody>
              <tr>
                <td>Location</td>
                <td>{environment.base_directory}</td>
              </tr>
              <tr>
                <td>Date Analyzed</td>
                <td><FullDateTime value={environment.date_analyzed} /></td>
              </tr>
              <tr>
                <td>Python</td>
                <td>{environment.python_version} ({environment.runtime} {environment.runtime_version} on {environment.platform})</td>
              </tr>
              <tr>
                <td>PIP</td>
                <td>{environment.pip_version}</td>
              </tr>
              <tr>
                <td>Packages</td>
                <td><Link href="/pkg">{pkgs.length}</Link></td>
              </tr>
              <tr>
                <td style={{verticalAlign: 'top'}}>Issues</td>
                <td><IssueSummary /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

