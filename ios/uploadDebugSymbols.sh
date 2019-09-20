#!/bin/sh

echo "Uploading debugging symbols to Sentry"

./makeSentryProperties.sh

export SENTRY_PROPERTIES=sentry.properties
../node_modules/@sentry/cli/bin/sentry-cli upload-dsym
