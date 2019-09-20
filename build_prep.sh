#!/bin/bash
repo=repo
set -ex -o pipefail

if [[ ! -x $(command -v npm) ]]; then
  echo "npm command not found. Cannot proceed with it, please install Nodejs.";
  exit 1;
fi

if [[ ! -x $(command -v yarn) ]]; then
  echo "yarn command not found. Cannot proceed with it, please install Yarn.";
fi

sed -i -- 's/\(^\s*\.\/node_modules\/\.bin\/remotedev-debugger\)/#\1/' Makefile

rm package-lock.json

make clean

npm install

themeFile=./node_modules/mattermost-redux/src/constants/preferences.js
sed -i '' "s/sidebarHeaderBg: '#1153ab'/sidebarHeaderBg: '#000000'/g" $themeFile
sed -i '' "s/buttonBg: '#166de0'/buttonBg: '#11939a'/g" $themeFile

make post-install

touch ~/.android/repositories.cfg

rm -rf dist

make dist/assets

cat dist/assets/config.json

cd ios && pod install --repo-update