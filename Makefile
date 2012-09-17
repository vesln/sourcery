TESTS = test/*.test.js
UI = tdd
REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--ui $(UI) \
		$(TESTS)

.PHONY: test
