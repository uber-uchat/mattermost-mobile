#!/bin/bash
set -ex -o pipefail

export SENTRY_ENABLED=true

# The following tools must be installed prior to running this script
# Xcode,
# The following variables must be set prior to running this script
# PRODUCT_BUNDLE_IDENTIFIER, DEVELOPMENT_TEAM, IOS_KEYCHAIN_PASSWORD
# The following port must be open and not in use
# 8081/tcp
# Requires `yarn` and `npm` and `yarn global add node-gyp` to be in path

#sudo xcode-select -s /Applications/Xcode.app/Contents/Developer

PWD=$(pwd)
PRODUCT_BUNDLE_IDENTIFIER="com.ubercab.uChat.Enterprise"
PRODUCT_BUNDLE_EXT_IDENTIFIER="com.ubercab.uChat.Enterprise.share"
PRODUCT_BUNDLE_NOTIFICATION_SERVICE_IDENTIFIER="com.ubercab.uChat.Enterprise.NotificationService"
NIGHTLY_BUNDLE_IDENTIFIER="com.ubercab.uChat.nightly"
NIGHTLY_BUNDLE_EXT_IDENTIFIER="com.ubercab.uChat.nightly.share"
NIGHTLY_BUNDLE_NOTIFICATION_SERVICE_IDENTIFIER="com.ubercab.uChat.nightly.NotificationService"
APP_PROFILE="9f27a9d0-eecc-4a36-a688-8392cfa2f113"
EXT_PROFILE="c2d315ff-d171-44a5-89e0-3c0627002e13"
NOTIFICATION_SERVICE_PROFILE="42dc987a-10d2-4e06-b63a-8967afae6b87"
NIGHTLY_APP_PROFILE="1d0929ea-deb0-4e93-8c5d-3b57fe863ae1"
NIGHTLY_EXT_PROFILE="9524d4cc-26cb-4b85-8e4c-630ca1f77361"
NIGHTLY_NOTIFICATION_SERVICE_PROFILE="bb811641-61ed-4396-83b0-542f27ed4f47"
DEVELOPMENT_TEAM="NW8WAZ2XUV"
METHOD="enterprise"

if [[ "${ENABLE_NIGHTLY_BUILD}" = "true" ]]; then
  PRODUCT_BUNDLE_IDENTIFIER=$NIGHTLY_BUNDLE_IDENTIFIER
  PRODUCT_BUNDLE_EXT_IDENTIFIER=$NIGHTLY_BUNDLE_EXT_IDENTIFIER
  PRODUCT_BUNDLE_NOTIFICATION_SERVICE_IDENTIFIER=$NIGHTLY_NOTIFICATION_SERVICE_IDENTIFIER
  APP_PROFILE=$NIGHTLY_APP_PROFILE
  EXT_PROFILE=$NIGHTLY_EXT_PROFILE
  NOTIFICATION_SERVICE_PROFILE=$NIGHTLY_NOTIFICATION_SERVICE_PROFILE
fi

PRODUCT_ROOT="${PWD}/ios"
PRODUCT_BUILDDIR="${PWD}/build"
PRODUCT_XARCHIVE="${PRODUCT_BUILDDIR}/Mattermost.xcarchive"
PRODUCT_WORKSPACE="${PRODUCT_ROOT}/Mattermost.xcworkspace"
PRODUCT_IPA_PATH="${PRODUCT_BUILDDIR}"
PRODUCT_EXPORT_OPTIONS="${PWD}/ios/exportOptions.plist"

xcodebuild -version

ls ~/Library/MobileDevice/Provisioning\ Profiles/

security -v unlock-keychain -p "${IOS_KEYCHAIN_PASSWORD}" "${HOME}/Library/Keychains/login.keychain"

cat << EOF > ${PRODUCT_EXPORT_OPTIONS}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>provisioningProfiles</key>
  <dict>
    <key>${PRODUCT_BUNDLE_IDENTIFIER}</key>
    <string>${APP_PROFILE}</string>
    <key>${PRODUCT_BUNDLE_EXT_IDENTIFIER}</key>
    <string>${EXT_PROFILE}</string>
    <key>${PRODUCT_BUNDLE_NOTIFICATION_SERVICE_IDENTIFIER}</key>
    <string>${NOTIFICATION_SERVICE_PROFILE}</string>
  </dict>
  <key>compileBitcode</key>
  <true/>
  <key>embedOnDemandResourcesAssetPacksInBundle</key>
  <true/>
  <key>iCloudContainerEnvironment</key>
  <string>Production</string>
  <key>method</key>
  <string>${METHOD}</string>
  <key>onDemandResourcesAssetPacksBaseURL</key>
  <string></string>
  <key>teamID</key>
  <string>${DEVELOPMENT_TEAM}</string>
  <key>uploadBitcode</key>
  <true/>
  <key>uploadSymbols</key>
  <true/>
</dict>
</plist>
EOF

pushd ${PRODUCT_ROOT}
xcodebuild \
  archive \
  -scheme Mattermost \
  -workspace "${PRODUCT_WORKSPACE}" \
  -configuration "Release" \
  -archivePath "${PRODUCT_XARCHIVE}" \
  APP_PROFILE="${APP_PROFILE}" \
  EXT_PROFILE="${EXT_PROFILE}" \
  NOTIFICATION_SERVICE_PROFILE="${NOTIFICATION_SERVICE_PROFILE}" \
  CODE_SIGN_STYLE=Manual

xcodebuild \
  -exportArchive \
  -archivePath "${PRODUCT_XARCHIVE}" \
  -exportPath "${PRODUCT_IPA_PATH}" \
  -exportOptionsPlist "${PRODUCT_EXPORT_OPTIONS}"
  CODE_SIGN_STYLE=Manual
popd