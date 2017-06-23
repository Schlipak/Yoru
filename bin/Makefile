DIR 		= sources/
OUT		= ./
MAIN 		= yoru.js
SOURCES 	= $(MAIN) $(DIR)scripts/*.js

EXEC_BABEL 	= ../node_modules/.bin/babel
ECHO 		= `which echo` -e

all: clean build

build:	clean
	@$(ECHO) "[\033[1;34mTRANS\033[0m] Running Babel"
	@$(EXEC_BABEL) $(DIR) --out-dir $(OUT)
	@chmod +x $(OUT)$(MAIN)
	@$(ECHO) "[\033[1;32mOK\033[0m] All done!"

clean:
	@$(ECHO) "[\033[1;31mRM\033[0m] Clean compiled sources"
	@rm -f $(MAIN)
	@rm -rf $(OUT)scripts/

.PHONY: all build clean
