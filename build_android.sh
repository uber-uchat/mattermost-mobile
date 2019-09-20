#!/bin/bash
set -ex -o pipefail

export SENTRY_ENABLED=true

# The following tools must be installed prior to running this script
# Android SDK, gradle, jdk, make, node, npm
# The following variables must be set prior to running this script
# ANDROID_HOME, KEYSTORES_RELEASE_ANDROID_UCHAT, ANDROID_UCHAT_STORE_PASSWORD, ANDROID_UCHAT_KEY_ALIAS, ANDROID_UCHAT_KEY_PASSWORD
# The following port must be open and not in use
# 8081/tcp
# requires `yarn` and `npm` and `yarn global add node-gyp` to be in path

PWD=$(pwd)
PRODUCT_WORKSPACE="${PWD}/android"

pushd ${PRODUCT_WORKSPACE}
./gradlew --info clean assembleRelease
popd