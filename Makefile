NAME = yoru
SKEL_DIRS = examples/ lib/ test/ src/ tmp/
ESLINT_DIRS = test/ src/

EXEC_BABEL = ./node_modules/.bin/babel
EXEC_WEBPACK = ./node_modules/.bin/webpack

all: eslint babel

eslint:
	@echo -e "[\033[1;35mCHECK\033[0m] Running ESLint"
	@./node_modules/eslint/bin/eslint.js $(ESLINT_DIRS) $(NAME).js

tests: test

babel:
	@echo -e "[\033[1;31mRM\033[0m] Clean dist/ tmp/"
	@rm -rf dist/* tmp/*
	@echo -e "[\033[1;31mRM\033[0m] Clean compiled examples/"
	@rm -rf examples/yoru.*
	@mkdir -p tmp/
	@echo -e "[\033[1;34mTRANS\033[0m] Running Babel"
	@$(EXEC_BABEL) $(NAME).js src/ --out-dir tmp/
	@echo -e "[\033[1;34mPACK\033[0m] Running Webpack"
	@$(EXEC_WEBPACK) tmp/yoru.js dist/yoru.pkg.js
	@echo -e "[\033[1;34mMIN\033[0m] Running Uglify"
	@./node_modules/.bin/uglifyjs dist/yoru.pkg.js > dist/yoru.pkg.min.js
	@echo -e "[\033[1;34mCP\033[0m] dist/ -> examples/"
	@cp dist/yoru.pkg.min.js examples/
	@echo -e "[\033[1;32mOK\033[0m] All done!"

clean:
	@echo -e "[\033[1;31mRM\033[0m] Clean dist/ tmp/"
	@rm -rf dist/* tmp/*

fclean: clean
	@echo -e "[\033[1;31mRM\033[0m] Clean compiled examples/"
	@rm -rf examples/yoru.*
	@mkdir -p tmp/

skel:
	mkdir -p $(SKEL_DIRS) dist/
	touch $(NAME).js

.PHONY: all eslint tests babel skel
