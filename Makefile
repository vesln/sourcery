TESTS = $(shell find test/ -name "*.test.js" -type f | sort)
UI = tdd
REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--ui $(UI) \
		$(TESTS)

.PHONY: test
