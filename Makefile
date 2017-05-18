NAME = yoru
SKEL_DIRS = examples/ lib/ test/ src/
ESLINT_DIRS = list/ test/ src/

all: eslint babel

eslint:
	@echo -e "[\033[1;35mCHECK\033[0m] Running ESLint"
	@./node_modules/eslint/bin/eslint.js $(ESLINT_DIRS) $(NAME).js

tests: test

babel:
	@echo -e "[\033[1;31mRM\033[0m] Clean dist/"
	@rm -rf dist/*
	@echo -e "[\033[1;31mRM\033[0m] Clean compiled examples/"
	@rm -rf examples/yoru.*
	@echo -e "[\033[1;34mTRANS\033[0m] Running Babel"
	@babel $(NAME).js src/ --out-dir dist/
	@echo -e "[\033[1;34mPACK\033[0m] Running Webpack"
	@./node_modules/.bin/webpack dist/yoru.js examples/yoru.pkg.js
	@echo -e "[\033[1;32mOK\033[0m] All done!"

skel:
	mkdir -p $(SKEL_DIRS) dist/
	touch $(NAME).js

.PHONY: all eslint tests babel skel
