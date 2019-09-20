export NODE_BINARY=node

echo "Sentry native integration is enabled"

./makeSentryProperties.sh

export SENTRY_PROPERTIES=sentry.properties
../node_modules/@sentry/cli/bin/sentry-cli react-native xcode ./react-native-xcode.sh