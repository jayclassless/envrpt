
from .basic import BasicReport


class MarkdownReport(BasicReport):
    templates = {
        'MAIN': '''
# Python Environment Report

## Environment
* Python: {python_version}
* Runtime: {runtime} {runtime_version}
* Pip: {pip_version}
* Location: {base_directory}

## Summary
* Total: {packages|len}
* Outdated: {?outdated}{outdated|len}{#outdated}
  * {.}{/outdated}{:else}0{/outdated}
* Missing: {?missing}{missing|len}{#missing}
  * {.}{/missing}{:else}0{/missing}
* Invalid: {?invalid}{invalid|len}{#invalid}
  * {.}{/invalid}{:else}0{/invalid}

{?summary_only}{:else}{?problems_only}## Problematic Packages
{#problem_packages}{>PACKAGE/}{/problem_packages}{:else}## Packages
{#packages}{>PACKAGE/}{/packages}{/problems_only}{/summary_only}
Generated by [`{analyzer}`]({envrpt_home_page}) on {date_analyzed|date} at {date_analyzed|time}
''',  # noqa

        'PACKAGE': '''* **{?home_page}[{name}]({home_page}){:else}{name}{/home_page}**
  * Version: {version}
  * License: {?license}{license}{:else}Unknown{/license}
{?issues}  * Issues:
{#issues}    * {@eq key=type value="OUTDATED"}Package is outdated; **{latest_version}** is available{/eq}{@eq key=type value="REQ_MISSING"}Dependency **{key}** is missing{/eq}{@eq key=type value="REQ_INVALID"}Dependency **{key}** is invalid; require **{requirement|s}** but **{installed}** is installed{/eq}{~n}{/issues}{/issues}{?dependencies}  * Dependencies:
{#dependencies}    * {key}{?spec} ({spec|s}){/spec}{~n}{/dependencies}{/dependencies}{?dependents}  * Dependents:
{#dependents}    * {key}{~n}{/dependents}{/dependents}
''',  # noqa
    }


def create(environment, options):
    return MarkdownReport().create(environment, options)

