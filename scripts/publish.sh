#!/bin/bash

./scripts/build.sh
npm version $1
git push origin master --tags
npm publish
