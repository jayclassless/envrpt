### Environment initialization

setup-python::
	poetry install

setup-js::
	cd js/html-fancy && npm install --no-package-lock

setup:: setup-python setup-js



### Environment cleanup

clean-python::
	rm -rf dist build poetry.lock

clean-full-python:: clean-python
	poetry env remove `poetry run which python`

clean-js::
	rm -rf js/html-fancy/build js/html-fancy/size-plugin.json

clean-full-js:: clean-js
	rm -rf js/html-fancy/node_modules

clean:: clean-python clean-js

clean-full:: clean-full-python clean-full-js

env::
	poetry self --version
	poetry version
	poetry env info
	poetry show --all



### Source analysis

lint-python::
	poetry run tidypy check

lint-js::
	cd js/html-fancy && npm run lint

lint:: lint-python lint-js



### Compilation and packaging

build-python:: clean-python
	poetry build

build-js:: clean-js
	cd js/html-fancy && npm run build

embed-js:: build-js
	cp js/html-fancy/build/bundle.*.js src/envrpt/data/html_fancy/bundle.js
	cp js/html-fancy/build/bundle.*.css src/envrpt/data/html_fancy/bundle.css

build:: build-python



### Distribution

publish::
	poetry publish

