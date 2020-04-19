BINDIR = $(if $(wildcard venv/bin), venv/bin/, '')


### Environment initialization

setup-python::
	python -m venv venv
	./venv/bin/pip install -r requirements.txt
	./venv/bin/pip install -e .

setup-js::
	cd js/html-fancy && npm install --no-package-lock

setup:: setup-python setup-js



### Environment cleanup

clean-python::
	rm -rf dist build

clean-full-python:: clean-python
	rm -rf venv pip-wheel-metadata src/envrpt.egg-info
	find src -depth -name __pycache__ -type d -exec rm -rf "{}" \;

clean-js::
	rm -rf js/html-fancy/build js/html-fancy/size-plugin.json

clean-full-js:: clean-js
	rm -rf js/html-fancy/node_modules

clean:: clean-python clean-js

clean-full:: clean-full-python clean-full-js



### Source analysis

lint-python::
	${BINDIR}tidypy check

lint-js::
	cd js/html-fancy && npm run lint

lint:: lint-python lint-js



### Compilation and packaging

build-python:: clean-python
	${BINDIR}python setup.py sdist
	${BINDIR}python setup.py bdist_wheel

build-js:: clean-js
	cd js/html-fancy && npm run build

embed-js:: build-js
	cp js/html-fancy/build/bundle.*.js src/envrpt/data/html_fancy/bundle.js
	cp js/html-fancy/build/bundle.*.css src/envrpt/data/html_fancy/bundle.css

build:: build-python



### Distribution

publish::
	${BINDIR}twine upload dist/*

