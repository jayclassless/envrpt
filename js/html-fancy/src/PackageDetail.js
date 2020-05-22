import {useState, useContext} from 'preact/hooks';
import {route, Link} from 'preact-router';

import EnvironmentContext from './EnvironmentContext';


function ExternalLink({href, children}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer">
      {children}
    </a>
  );
}


function PackageDependencies({pkg}) {
  const environment = useContext(EnvironmentContext);

  let detail = environment.packages[pkg];
  let reqs = Object.keys(detail.requirements).sort();
  let deps = Object.keys(environment.packages).sort().filter(key =>
    environment.packages[key].requirements[pkg] !== undefined
  );

  let defaultTab;
  if (reqs.length > 0) {
    defaultTab = 'reqs';
  } else if (deps.length > 0) {
    defaultTab = 'deps';
  } else {
    return null;
  }

  const [activeTab, setTab] = useState(defaultTab); // eslint-disable-line react-hooks/rules-of-hooks

  let content;
  if (activeTab === 'reqs') {
    content = (
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Required</th>
            <th>Installed</th>
          </tr>
        </thead>
        <tbody>
          {reqs.map(key => {
            let dep = environment.packages[key];

            let name, installed;
            if (dep) {
              name = <Link href={`/pkg/${dep.key}`}>{dep.name}</Link>;
              installed = dep.version;

              let invalid = detail.issues.filter(
                issue => issue.type === 'REQ_INVALID' && issue.key === dep.key
              );
              if (invalid.length > 0) {
                installed = <span class="text-error">{installed}</span>;
              }
            } else {
              name = key;
              installed = <span class="text-error">MISSING!</span>;
            }

            return (
              <tr>
                <td>{name}</td>
                <td>{detail.requirements[key]}</td>
                <td>{installed}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  } else if (activeTab === 'deps') {
    content = (
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Requires</th>
          </tr>
        </thead>
        <tbody>
          {deps.map(key => {
            let dep = environment.packages[key];
            return (
              <tr>
                <td><Link href={`/pkg/${dep.key}`}>{dep.name}</Link></td>
                <td>{dep.requirements[pkg] || 'Any'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  return (
    <>
      <ul class="tab tab-block">
        {reqs.length > 0 &&
          <li class={`tab-item ${activeTab === 'reqs' ? 'active' : ''}`}>
            <a
              class="tooltip c-hand"
              data-tooltip={`Packages that ${detail.name} depends on`}
              onClick={() => setTab('reqs')}>
              Dependencies
            </a>
          </li>
        }
        {deps.length > 0 &&
          <li class={`tab-item ${activeTab === 'deps' ? 'active' : ''}`}>
            <a
              class="tooltip c-hand"
              data-tooltip={`Packages that depend on ${detail.name}`}
              onClick={() => setTab('deps')}>
              Dependents
            </a>
          </li>
        }
      </ul>
      {content}
    </>
  );
}


function Issue({pkg, issue}) {
  const environment = useContext(EnvironmentContext);

  switch (issue.type) {
    case 'OUTDATED':
      return (
        <span>Package is outdated; <ExternalLink href={`https://pypi.org/project/${pkg.key}/${issue.latest_version}`}><strong>{issue.latest_version}</strong></ExternalLink> is available.</span>
      );

    case 'REQ_MISSING':
      return (
        <span>Dependency <strong>{issue.key}</strong> is missing.</span>
      );

    case 'REQ_INVALID':
      return (
        <span>Dependency <strong><Link href={`/pkg/${issue.key}`}>{environment.packages[issue.key].name}</Link></strong> is invalid; require <strong>{issue.requirement}</strong> but <strong>{issue.installed}</strong> is installed.</span>
      );

    case 'VULNERABLE':
      return (
        <span>Package has a known vulnerability: {issue.id}: {issue.description}</span>
      );
  }
}


export default function PackageDetail({pkg}) {
  const environment = useContext(EnvironmentContext);

  let detail = environment.packages[pkg];
  if (!detail) {
    route('/pkg');
    return;
  }

  document.title = `Python Environment Report: ${detail.name}`;

  return (
    <div class="container">
      <h1>{detail.name}</h1>
      <div class="columns">
        <div class="column col-6">
          <table class="table">
            <tbody>
              <tr>
                <td>Version</td>
                <td>{detail.version}</td>
              </tr>
              {detail.license &&
                <tr>
                  <td>License</td>
                  <td>{detail.license}</td>
                </tr>
              }
              {detail.home_page &&
                <tr>
                  <td>Home Page</td>
                  <td><ExternalLink href={detail.home_page}>{detail.home_page}</ExternalLink></td>
                </tr>
              }
              <tr>
                <td>Description</td>
                <td>{detail.description}</td>
              </tr>
              {detail.issues.length > 0 &&
                <tr>
                  <td style={{verticalAlign: 'top'}}>Issues</td>
                  <td>
                    <ul style={{margin: 0}}>
                      {detail.issues.map(issue => <li><Issue pkg={detail} issue={issue} /></li>)}
                    </ul>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="column col-6">
          <PackageDependencies
            key={pkg}
            pkg={pkg}
            />
        </div>
      </div>
    </div>
  );
}

