# Load .env if it exists
ifneq (,$(wildcard ./.env))
	include .env
	export
endif

# Default forge command
FORGE = forge

# Targets
build:
	$(FORGE) build

test:
	$(FORGE) test

test-fork:
	$(FORGE) test --fork-url $(MAINNET_FORK_URL) -vvv

clean:
	$(FORGE) clean
