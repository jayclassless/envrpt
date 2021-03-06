
import re

from .basic import BasicReport


class HtmlReport(BasicReport):
    templates = {
        'MAIN': '''
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Python Environment Report</title>
        <meta name="generator" content="{analyzer}">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <h1>Python Environment Report</h1>

        <h2>Environment</h2>
        <ul>
            <li>Python: {python_version}</li>
            <li>Runtime: {runtime} {runtime_version}</li>
            <li>Platform: {platform}</li>
            <li>Pip: {pip_version}</li>
            <li>Location: {base_directory}</li>
        </ul>

        <h2>Summary</h2>
        <ul>
            <li>Total: {packages|len}</li>
            <li><span title="Installed packages that have newer versions available.">Outdated:</span> {?outdated}{outdated|len}
                {?outdated}
                <ul>
                    {#outdated}
                    <li>{?summary_only}{.}{:else}<a href="#{.}">{.}</a>{/summary_only}</li>
                    {/outdated}
                </ul>
                {/outdated}{:else}0{/outdated}
            </li>
            <li><span title="Installed packages that have known vulnerabilities.">Vulnerable:</span> {?vulnerable}{vulnerable|len}
                {?vulnerable}
                <ul>
                    {#vulnerable}
                    <li>{?summary_only}{.}{:else}<a href="#{.}">{.}</a>{/summary_only}</li>
                    {/vulnerable}
                </ul>
                {/vulnerable}{:else}0{/vulnerable}
            </li>
            <li><span title="Required packages that are not currently installed.">Missing:</span> {?missing}{missing|len}
                {?missing}
                <ul>
                    {#missing}
                    <li>{.}</li>
                    {/missing}
                </ul>
                {/missing}{:else}0{/missing}
            </li>
            <li><span title="Installed packages whose version conflicts with another package's requirements.">Invalid:</span> {?invalid}{invalid|len}
                {?invalid}
                <ul>
                    {#invalid}
                    <li>{?summary_only}{.}{:else}<a href="#{.}">{.}</a>{/summary_only}</li>
                    {/invalid}
                </ul>
                {/invalid}{:else}0{/invalid}
            </li>
        </ul>

        {?summary_only}{:else}
        {?problems_only}
        <h2>Problematic Packages</h2>
        <ul>
            {#problem_packages}{>PACKAGE/}{/problem_packages}
        </ul>
        {:else}
        <h2>Packages</h2>
        <ul>
            {#packages}{>PACKAGE/}{/packages}
        </ul>
        {/problems_only}
        {/summary_only}

        <p>Generated by <code><a href="{envrpt_home_page}">{analyzer}</a></code> on {date_analyzed|date} at {date_analyzed|time}</p>
    </body>
</html>''',  # noqa

        'PACKAGE': '''
<li id="{key}"><strong>{?home_page}<a href="{home_page}">{name}</a>{:else}{name}{/home_page}</strong>
<ul>
    {?description}<li>{description}</li>{/description}
    <li>Version: {version}</li>
    <li>License: {?license}{license}{:else}Unknown{/license}</li>
{?issues}
    <li>Issues:
        <ul>
            {#issues}
            <li>{@eq key=type value="OUTDATED"}Package is outdated; <strong>{latest_version}</strong> is available{/eq}{@eq key=type value="REQ_MISSING"}Dependency <strong>{key}</strong> is missing{/eq}{@eq key=type value="REQ_INVALID"}Dependency <strong>{?summary_only}{key}{:else}<a href="#{key}">{key}</a>{/summary_only}</strong> is invalid; require <strong>{requirement}</strong> but <strong>{installed}</strong> is installed{/eq}{@eq key=type value="VULNERABLE"}Package has a known vulnerability: {id}: {description}{/eq}</li>
            {/issues}
        </ul>
    </li>
{/issues}
{?dependencies}
    <li><span title="Other packages that are required by this package.">Dependencies:</span>
        <ul>
            {#dependencies}
            <li>{?installed}<a href="#{key}">{key}</a>{:else}{key}{/installed}{?spec} ({spec}){/spec}</li>
            {/dependencies}
        </ul>
    </li>
{/dependencies}
{?dependents}
    <li><span title="Other packages that depend on this package.">Dependents:</span>
        <ul>
            {#dependents}
            <li><a href="#{key}">{key}</a></li>
            {/dependents}
        </ul>
    </li>
{/dependents}
</ul>
''',  # noqa
    }


def create(environment, options):
    rpt = HtmlReport().create(environment, options)
    return re.sub(r'>\s+<', '><', rpt)

