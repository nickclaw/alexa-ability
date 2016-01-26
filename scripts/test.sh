#!/bin/bash

./node_modules/.bin/mocha ./test        \
    --require babel-register            \
    --require test/setup                \
    --check-leaks                       \
    --throw-deprecation
