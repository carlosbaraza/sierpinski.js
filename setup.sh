#!/usr/bin/env bash

npm install bower
npm install gulp
npm install
./node_modules/bower/bin/bower install --allow-root
./node_modules/gulp/bin/gulp.js build
