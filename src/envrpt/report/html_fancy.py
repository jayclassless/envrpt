
from pip._vendor.pkg_resources import resource_filename

from .basic import BasicReport
from .json import create as create_json


def get_data(name):
    filename = resource_filename(  # noqa: not-callable
        'envrpt',
        'data/html_fancy/%s' % (name,),
    )
    with open(filename) as res:
        return res.read()


class FancyHtmlReport(BasicReport):
    templates = {
        'MAIN': '''
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Python Environment Report</title>
    <meta name="generator" content="{analyzer}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>{bundle_css|s}</style>
    <script>
      var ENVIRONMENT = {json_payload|s};
      var HOMEPAGE = "{envrpt_home_page}";
    </script>
  </head>
  <body>
    <div id="__root__"></div>
    <script>{bundle_js|s}</script>
  </body>
</html>''',  # noqa
    }

    def create_template_args(self, environment, options):
        args = super().create_template_args(environment, options)
        args['json_payload'] = create_json(environment, options)
        args['bundle_js'] = get_data('bundle.js')
        args['bundle_css'] = get_data('bundle.css')
        return args


def create(environment, options):
    return FancyHtmlReport().create(environment, options)

