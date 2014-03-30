TESTS = $(shell find test/ -name "*.test.js" -type f | sort)
REPORTER = dot

check: test

lib-cov:
	@rm -fr ./$@
	@jscoverage lib $@

test-cov: lib-cov
	@SOURCERY_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--require ./test/support/bootstrap.js \
		--ui bdd \
		$(TESTS)

.PHONY: test
