def notifyMattermost(String buildStatus = 'STARTED', String version='', String changelog='', String links='') {
    buildStatus = buildStatus ?: 'SUCCESS'

    def color
    def title = "**Build ${buildStatus}**"
    def buildInfo = "*Job*\t${env.JOB_NAME}#${env.BUILD_NUMBER}\n*Version*\t${version}"
    if (env.ENABLE_NIGHTLY_BUILD == "true") {
      title = "**Build ${buildStatus} Nightly :moon: **"
      buildInfo = "*Job*\t${env.JOB_NAME}#${env.BUILD_NUMBER} Nightly\n*Version*\t${version}"
    }

    if (buildStatus == 'STARTED') {
        color = '#D4DADF'
        msg = "${title} :loudspeaker:\n${buildInfo}\n**Changelog**\n${changelog}"
    } else if (buildStatus == 'SUCCESS') {
        color = '#BDFFC3'
        msg = "${title} :tada:\n${buildInfo}\n*Links*\t${links}"
    } else if (buildStatus == 'UNSTABLE') {
        color = '#FFFE89'
        msg = "${title}\n${buildInfo}\n**Changelog**\n${changelog}"
    } else {
        color = '#FF9FA1'
        msg = "${title} :failboat:\n${buildInfo}\n#### Changelog\n${changelog}"
    }

    mattermostSend(color: color, message: msg, channel: 'uchat-releases')
}

def createIosPlist(String appLink, String bundle, String application, String version='1.0.0') {
  return """
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>items</key>
	<array>
		<dict>
			<key>assets</key>
			<array>
				<dict>
					<key>kind</key>
					<string>software-package</string>
					<key>url</key>
					<string>${appLink}</string>
				</dict>
			</array>
			<key>metadata</key>
			<dict>
				<key>bundle-identifier</key>
				<string>${bundle}</string>
				<key>bundle-version</key>
				<string>${version}</string>
				<key>kind</key>
				<string>software</string>
				<key>title</key>
				<string>${application}</string>
			</dict>
		</dict>
	</array>
</dict>
</plist>
  """
}

def createManifest(String version='', String build='', String androidUrl='', String iosUrl='', String plistUrl='', String changes="[]") {
  return "{\"latest\":{\"version\":\"${version}\",\"build\":\"${build}\",\"android\":\"${androidUrl}\",\"ios\":\"${iosUrl}\",\"plist\":\"${plistUrl}\",\"changes\":${changes}}}"
}

@NonCPS
def createChangelog(boolean asJson=false) {
  def changes = []
  def changeLogSets = currentBuild.changeSets
  echo "Gathering SCM changes"
  for (int i = 0; i < changeLogSets.size(); i++) {
    def entries = changeLogSets[i].items
    for (int j = 0; j < entries.length; j++) {
      def entry = entries[j]
      changes << "- ${entry.commitId.take(5)}(${entry.author})    ${entry.msg}"
    }
  }
  if (changes.size() < 1) {
      changes << "- No new changes"
  }
  if (asJson) {
    def jlist = []
    for (int k = 0; k < changes.size(); k++) {
      jlist << "\"${changes[k]}\""
    }
    jstring = "[${jlist.join(',')}]"
    return jstring
  }
  return changes.join('\n')
}

node('xcode101') {

  // Transfer Nightly Param to Environment Variable
  env.ENABLE_NIGHTLY_BUILD = params.ENABLE_NIGHTLY_BUILD

  def project     = "ucMobile"
  def gitUrl      = "git@github.com:csduarte/${project}.git"
  def osProject   = "mattermost-mobile"
  def osGitUrl    = "git@github.com:uber-uchat/${osProject}.git"
  def osRoot      = "repo"
  def artifacts   = "artifacts"
  def subsVersion = "1.0.0"

  deleteDir()
  git([url: gitUrl, branch: env.BRANCH_NAME, credentialsId: 'uchat-mobile-key'])

  checkout([$class: 'GitSCM',
		branches: [[name: "*/${env.BRANCH_NAME}"]],
		doGenerateSubmoduleConfigurations: false,
		extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: osRoot]],
		submoduleCfg: [],
    pipelineTriggers: [[$class:"SCMTrigger", scmpoll_spec:"*/1 * * * *"]],
		userRemoteConfigs: [[credentialsId: 'uchat-mobile-key',url: osGitUrl]]])

  def props       = readProperties  file: "overrides/1.0.0/android/gradle.properties"
  def buildCode   = props['version']
  def changelog   = createChangelog(true)
  def changelognl = createChangelog(false)
  def version     = "${props['versionMajor']}.${props['versionMinor']}.${props['versionPatch']}"
  def fullVersion = "${version}-${buildCode}"
  def app         = "uChat"
  def bundle      = env.ENABLE_NIGHTLY_BUILD == 'true' ? "com.ubercab.uChat.nightly" : "com.ubercab.uChat.Enterprise"
  def manifest    = "manifest.json"
  def bucket      = "uchat-releases-public"
  def date        = new Date().format( 'yyMMdd' )
  def filename    = "${app.toLowerCase()}-${fullVersion}-${date}-${env.BUILD_NUMBER}"
  def ipaPath     = "${project}/${env.BRANCH_NAME}/ios/${filename}.ipa"
  def plistPath   = "${project}/${env.BRANCH_NAME}/ios/${filename}.plist"
  def apkPath     = "${project}/${env.BRANCH_NAME}/android/${filename}.apk"
  def manPath     = "${project}/${env.BRANCH_NAME}/${manifest}"
  // def bucketUrl   = "https://${bucket}.s3.amazonaws.com/"
  def bucketUrl   = "https://uchatapp.awscorp.uberinternal.com/"
  def ipaUrl      = "${bucketUrl}${ipaPath}"
  def apkUrl      = "${bucketUrl}${apkPath}"
  def plistUrl    = "${bucketUrl}${plistPath}"
  def manUrl      = "${bucketUrl}${manPath}"
  def iosDlUrl    = "itms-services://?action=download-manifest&url=${plistUrl}"
  def links       = "[Android DL](${apkUrl}) | [iOS DL](${iosDlUrl}) | [iOS IPA](${ipaUrl})"

  def latestFn          = "uchat-${env.BRANCH_NAME}-latest"
  def ipaLatestPath     = "${project}/${env.BRANCH_NAME}/ios/${latestFn}.ipa"
  def plistLatestPath   = "${project}/${env.BRANCH_NAME}/ios/${latestFn}.plist"
  def apkLatestPath     = "${project}/${env.BRANCH_NAME}/android/${latestFn}.apk"
  def ipaLatestUrl      = "${bucketUrl}${ipaLatestPath}"

  environment {
    ANDROID_HOME  = '/Users/jenkins/Library/Android/sdk'
    PATH          = '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Users/jenkins/Library/Android/sdk/platform-tools'
  }

  parameters {
    string(name: 'ENABLE_NIGHTLY_BUILD', defaultValue: 'false', description: 'Use Nightly Enterprise Certs')
  }

  try {
    notifyMattermost('STARTED', fullVersion, changelognl)

    stage('setup') {
      sh "rsync -av overrides/${subsVersion}/ ${osRoot}/"
      sh ". substitutions/${subsVersion}/main.sh"
      sh "cat ${osRoot}/android/gradle.properties"

      if (env.ENABLE_NIGHTLY_BUILD == "true") {
        echo "Running Nightly Build. ${env.ENABLE_NIGHTLY_BUILD}"
      } else {
        echo "Running Standard Build. ${env.ENABLE_NIGHTLY_BUILD}"
      }
    }

    stage('prebuild') {
      sh 'echo "Pre-Build starting..."'
      sh 'mkdir -p build'
      sh 'mkdir -p android/app/build/outputs/apk'
      sh "cd $WORKSPACE/${osRoot} && ../build_prep.sh"
    }

    stage('android'){
      withCredentials([
        string( credentialsId: 'KEYSTORES_RELEASE_ANDROID_UCHAT',
                variable: 'KEYSTORES_RELEASE_ANDROID_UCHAT'),
        string( credentialsId: 'ANDROID_UCHAT_STORE_PASSWORD',
                variable: 'ANDROID_UCHAT_STORE_PASSWORD'),
        string( credentialsId: 'ANDROID_UCHAT_KEY_ALIAS',
                variable: 'ANDROID_UCHAT_KEY_ALIAS'),
        string( credentialsId: 'ANDROID_UCHAT_KEY_PASSWORD',
                variable: 'ANDROID_UCHAT_KEY_PASSWORD')
      ]) {
        sh 'echo "Building android..."'
        sh "cd $WORKSPACE/${osRoot} && ../build_android.sh"
      }
    }

    stage('ios') {
      withCredentials([
        string( credentialsId: 'IOS_KEYCHAIN_PASSWORD',
                variable: 'IOS_KEYCHAIN_PASSWORD')
      ]) {
        sh 'echo Building ios...'
        sh "cd $WORKSPACE/${osRoot} && ../build_ios.sh"
      }
    }

    stage('postbuild') {
      sh 'mkdir artifacts'

      sh "cp ${osRoot}/android/app/build/outputs/apk/release/app-release.apk artifacts/${filename}.apk"
      sh "cp ${osRoot}/android/app/build/outputs/apk/release/app-release.apk artifacts/${latestFn}.apk"

      sh "cp ${osRoot}/build/Mattermost.ipa artifacts/${filename}.ipa"
      sh "cp ${osRoot}/build/Mattermost.ipa artifacts/${latestFn}.ipa"

      def plistContent = createIosPlist(ipaUrl, bundle, app, version)
      writeFile file: "artifacts/${filename}.plist", text: plistContent

      def plistLatestContent = createIosPlist(ipaLatestUrl, bundle, app, version)
      writeFile file: "artifacts/${latestFn}.plist", text: plistLatestContent

      def manifestContent = createManifest(version, buildCode, apkUrl, ipaUrl, plistUrl, changelog)
      writeFile file: "artifacts/${manifest}", text: manifestContent
    }

    stage('publish') {

      archiveArtifacts artifacts: "artifacts/${filename}.apk, artifacts/${filename}.ipa, artifacts/${filename}.plist, artifacts/${manifest}", fingerprint: true

      withAWS(credentials: 'aws-uchat-releases', region: 'us-west-2') {
        s3Upload  bucket: bucket,
                  file: "artifacts/${filename}.ipa",
                  path: ipaPath

        s3Upload  bucket: bucket,
                  file: "artifacts/${filename}.plist",
                  path: plistPath

        s3Upload  bucket: bucket,
                  file: "artifacts/${filename}.apk",
                  path: apkPath

        s3Upload  bucket: bucket,
                  file: "artifacts/${latestFn}.ipa",
                  path: ipaLatestPath

        s3Upload  bucket: bucket,
                  file: "artifacts/${latestFn}.plist",
                  path: plistLatestPath

        s3Upload  bucket: bucket,
                  file: "artifacts/${latestFn}.apk",
                  path: apkLatestPath

        s3Upload  bucket: bucket,
                  file: "artifacts/${manifest}",
                  path: manPath
      }
    }

  } catch (e) {
      currentBuild.result = 'FAILURE'
      throw e
  } finally {
      notifyMattermost(currentBuild.result, fullVersion, changelognl, links)
  }
}
