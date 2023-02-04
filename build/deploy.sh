#!/usr/bin/env sh

set -e

npm run build:core

git checkout gh-pages
git merge master

npm run build

git add .
git commit -m "publish"
git push origin gh-pages 

git checkout master