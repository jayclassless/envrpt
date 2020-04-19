import {useState, useCallback, useContext} from 'preact/hooks';
import {Link} from 'preact-router';

import EnvironmentContext from './EnvironmentContext';


function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(!value), [value]);
  return [value, toggle];
}


export default function PackageList() {
  const environment = useContext(EnvironmentContext);
  const [showOutdated, toggleOutdated] = useToggle();
  const [showVulnerable, toggleVulnerable] = useToggle();
  const [showBroken, toggleBroken] = useToggle();
  const [search, setSearch] = useState();

  document.title = 'Python Environment Report: Installed Packages';

  let packages = Object.keys(environment.packages).sort().map(
    key => environment.packages[key]
  );
  if (showOutdated || showVulnerable || showBroken) {
    packages = packages.filter(pkg => (
      (showOutdated && pkg.outdated)
      || (showVulnerable && pkg.vulnerable)
      || (showBroken && pkg.broken)
    ));
  }
  if (search) {
    packages = packages.filter(pkg => (
      pkg.name.includes(search)
      | pkg.version.includes(search)
      | (pkg.description && pkg.description.includes(search))
    ));
  }

  return (
    <>
      <div class="container mt-2">
        <div class="columns">
          <div class="column col-6">
            <div class="form-group">
              <label class="form-switch form-inline">
                <input type="checkbox" checked={showOutdated} onClick={toggleOutdated} />
                <i class="form-icon" /> Outdated
              </label>
              <label class="form-switch form-inline">
                <input type="checkbox" checked={showVulnerable} onClick={toggleVulnerable} />
                <i class="form-icon" /> Vulnerable
              </label>
              <label class="form-switch form-inline">
                <input type="checkbox" checked={showBroken} onClick={toggleBroken} />
                <i class="form-icon" /> Broken
              </label>
            </div>
          </div>
          <div class="column col-6">
            <input class="form-input" type="text" placeholder="Search..." onInput={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Version</th>
            <th>Issues</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {packages.map(pkg => (
            <tr>
              <td><Link href={`/pkg/${pkg.key}`}>{pkg.name}</Link></td>
              <td>{pkg.version}</td>
              <td>
                {pkg.outdated &&
                  <span class="label label-rounded label-warning">outdated</span>
                }
                {pkg.vulnerable &&
                  <span class="label label-rounded label-error">vulnerable</span>
                }
                {pkg.broken &&
                  <span class="label label-rounded label-error">broken</span>
                }
              </td>
              <td>{pkg.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

