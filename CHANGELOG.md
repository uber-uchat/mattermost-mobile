# Mattermost Mobile Apps Changelog

## v1.5.1 Release

- Release Date: December 7, 2017
- Server Versions Supported: Server v4.0+ is required, Self-Signed SSL Certificates are not supported

### Bug Fixes
- Fixed an issue with the upgrade app screen showing with a transparent background
- Fixed an issue with clearing or replying to notifications sometimes crashing the app on Android
- Fixed an issue with the app sometimes crashing due to a missing function in the swiping control

## v1.5 Release 

- Release Date: December 6, 2017
- Server Versions Supported: Server v4.0+ is required, Self-Signed SSL Certificates are not supported

### Highlights 

#### File Viewer
- Preview videos, RTF,  PDFs, Word, Excel, and Powerpoint files 

#### iPhone X Compatibility
- Added support for iPhone X

#### Slash Commands
- Added support for using custom slash commands
- Added support for built-in slash commands /away, /online, /offline, /dnd, /header, /purpose, /kick, /me, /shrug

### Improvements
- In iOS, 3D touch can now be used to peek into a channel to view the contents, and quickly mark it as read
- Markdown images in posts now render 
- Copy posts, URLs, and code blocks
- Opening a channel with Unread messages takes you to the "New Messages" indicator 
- Support for data retention, interactive message buttons, and viewing Do Not Disturb statuses depending on the server version
- (Edited) indicator now shows up beside edited posts 
- Added a "Recently Used" section for emoji reactions

### Bug Fixes 
- Android notifications now follow the default system setting for vibration 
- Fixed app crashing when opening notification settings on Android 
- Fixed an issue where the "Proceed" button on sign in screen stopped working after pressing logout multiple times
- HEIC images posted from iPhones now get converted to JPEG before uploading

## v1.4.1 Release

Release Date: Nov 15, 2017
Server Versions Supported: Server v4.0+ is required, Self-Signed SSL Certificates are not supported

### Bug Fixes

- Fixed network detection issue causing some people to be unable to access the app
- Fixed issue with lag when pressing send button 
- Fixed app crash when opening notification settings
- Fixed various other bugs to reduce app crashes

## v1.4 Release 

- Release Date: November 6, 2017
- Server Versions Supported: Server v4.0+ is required, Self-Signed SSL Certificates are not supported

### Highlights 

#### Performance improvements
- Various performance improvements to decrease channel load times 

### Bug Fixes
- Fixed issue with Android app sometimes showing a white screen when re-opening the app
- Fixed an issue with orientation lock not working on Android 

## v1.3 Release 

- Release Date: October 5, 2017
- Server Versions Supported: Server v4.0+ is required, Self-Signed SSL Certificates are not supported

### Highlights 

#### Tablet Support (Beta) 
- Added support for landscape view, so the app may be used on tablets
- Note: Tablet support is in beta, and further improvements are planned for a later date

#### Link Previews 
- Added support for image, GIF, and youtube link previews

#### Notifications
- Android: Added the ability to set light, vibrate, and sound settings
- Android: Improved notification stacking so most recent notification shows first 
- Updated the design for Notification settings to improve usability 
- Added the ability to reply from a push notification without opening the app (requires Android v7.0+, iOS 10+) 
- Increased speed when opening app from a push notification

#### Download Files 
- Added the ability to download all files on Android and images on iOS

### Improvements
- Using `+` shortcut for emoji reactions is now supported 
- Improved emoji formatting (alignment and rendering of non-square aspect ratios)
- Added support for error tracking with Sentry
- Only show the "Connecting..." bar after two connection attempts 

### Bug Fixes
- Fixed link rendering not working in certain cases
- Fixed theme color issue with status bar on Android

## v1.2 Release

- Release Date: September 5, 2017 
- Server Versions Supported: Server v4.0+ is required, Self-Signed SSL Certificates are not supported

### Highlights 

#### AppConfig Support for EMM solutions
- Added [AppConfig](https://www.appconfig.org/) support, to make it easier to integrate with a variety of EMM solutions

#### Code block viewer
- Tap on a code block to open a viewer for easier reading 

### Improvements
- Updated formatting for markdown lists and code blocks
- Updated formatting for `in:` and `from:` search autocomplete 

### Emoji Picker for Emoji Reactions
- Added an emoji picker for selecting a reaction 

### Bug Fixes
- Fixed issue where if only LDAP and GitLab login were enabled, LDAP did not show up on the login page
- Fixed issue with 3 digit mention count UI in channel drawer

### Known Issues
- Using `+:emoji:` to react to a message is not yet supported 

## v1.1 Release

- Release Date: August 2017 
- Server Versions Supported: Server v3.10+ is required, Self-Signed SSL Certificates are not supported

### Highlights 

#### Search
- Search posts and tap to preview the result
- Click "Jump" to open the channel the search result is from 

#### Emoji Reactions
- View Emoji Reactions on a post

#### Group Messages
- Start Direct and Group Messages from the same screen

#### Improved Performance on Poor Connections
- Added auto-retry to automatically reattempt to get posts if the network connection is intermittent
- Added manual loading option if auto-retry fails to retrieve new posts

### Improvements
- Android: Added Big Text support for Android notifications, so they expand to show more details
- Added a Reset Cache option
- Improved "Jump to conversation" filter so it matches on nickname, full name, or username 
- Tapping on an @username mention opens the user's profile
- Disabled the send button while attachments upload
- Adjusted margins on icons and elsewhere to make spacing more consistent
- iOS URL scheme: mattermost:// links now open the new app
- About Mattermost page now includes a link to NOTICES.txt for platform and the mobile app
- Various UI improvements

### Bug Fixes
- Fixed an issue where sometimes an unmounted badge caused app to crash on start up 
- Group Direct Messages now show the correct member count 
- Hamburger icon does not break after swiping to close sidebar
- Fixed an issue with some image thumbnails appearing out of focus
- Uploading a file and then leaving the channel no longer shows the file in a perpetual loading state
- For private channels, the last member can no longer delete the channel if the EE server permissions do not allow it
- Error messages are now shown when SSO login fails
- Android: Leaving a channel now redirects to Town Square instead of the Town Square info page
- Fixed create new public channel screen shown twice when trying to create a channel
- Tapping on a post will no longer close the keyboard

## v1.0.1 Release 

- Release Date: July 20, 2017 
- Server Versions Supported: Server v3.8+ is required, Self-Signed SSL Certificates are not yet supported

### Bug Fixes
- Huawei devices can now load messages
- GitLab SSO now works if there is a trailing `/` in the server URL
- Unsupported server versions now show a prompt clarifying that a server upgrade is necessary

## v1.0 Release 

- Release Date: July 10, 2017 
- Server Versions Supported: Server v3.8+ is required, Self-Signed SSL Certificates are not supported

### Highlights 

#### Authentication (Requires v3.10+ [Mattermost server](https://github.com/mattermost/platform))
- GitLab login 

#### Offline Support
- Added offline support, so already loaded portions of the app are accessible without a connection
- Retry mechanism for posts sent while offline 
- See [FAQ](https://github.com/mattermost/mattermost-mobile#frequently-asked-questions) for information on how data is handled for deactivated users

#### Notifications (Requires v3.10+ [push proxy server](https://github.com/mattermost/mattermost-push-proxy)) 
- Notifications are cleared when read on another device
- Notification sent just before session expires to let people know login is required to continue receiving notifications

#### Channel and Team Sidebar
- Unreads section to easily access channels with new messages
- Search filter to jump to conversations quickly 
- Improved team switching design for better cross-team notifications 
- Added ability to join open teams on the server 

#### Posts
- Emojis now render
- Integration attachments now render 
- ~channel links now render 

#### Navigation
- Updated navigation to have smoother transitions 

### Known Issues
- [Android: Swipe to close in-app notifications does not work](https://mattermost.atlassian.net/browse/RN-45)
- Apps are not yet at feature parity for desktop, so features not mentioned in the changelog are not yet supported

### Contributors

Many thanks to all our contributors. In alphabetical order:
- asaadmahmood, cpanato, csduarte, enahum, hmhealey, jarredwitt, JeffSchering, jasonblais, lfbrock, omar-dev, rthill

## Beta Release

- Release Date: March 29, 2017
- Server Versions Supported: Server v3.7+ is required, Self-Signed SSL Certificates are not yet supported

Note: If you need an SSL certificate, consider using [Let's Encrypt](https://docs.mattermost.com/install/config-ssl-http2-nginx.html) instead of a self-signed one.

### Highlights

The Beta apps are a work in progress, supported features are listed below. You can become a beta tester by [downloading the Android app](https://play.google.com/store/apps/details?id=com.mattermost.react.native&hl=en) or [signing up to test iOS](https://mattermost-fastlane.herokuapp.com/). 

#### Authentication
- Email login
- LDAP/AD login
- Multi-factor authentication 
- Logout

#### Messaging
- View and send posts in the center channel
- Automatically load more posts in the center channel when scrolling
- View and send replies in thread view
- "New messages" line in center channel (app does not yet scroll to the line)
- Date separators 
- @mention autocomplete
- ~channel autocomplete
- "User is typing" message
- Edit and delete posts
- Flag/Unflag posts
- Basic markdown (lists, headers, bold, italics, links)

#### Notifications
- Push notifications
- In-app notifications when you receive a message in another channel while the app is open
- Clicking on a push notification takes you to the channel

#### User profiles
- Status indicators
- View profile information by clicking on someone's username or profile picture

#### Files
- File thumbnails for posts with attachments
- Upload up to 5 images
- Image previewer to view images when clicked on

#### Channels
- Channel drawer for selecting channels
- Bolded channel names for Unreads, and mention jewel for Mentions
- (iOS only) Unread posts above/below indicator
- Favorite channels (Section in sidebar, and ability to favorite/unfavorite from channel menu)
- Create new public or private channels
- Create new Direct Messages (Group Direct Messages are not yet supported) 
- View channel info (name, header, purpose) 
- Join public channels
- Leave channel
- Delete channel
- View people in a channel
- Add/remove people from a channel
- Loading screen when opening channels 

#### Settings
- Account Settings > Notifications page
- About Mattermost info dialog
- Report a problem link that opens an email for bug reports

#### Teams
- Switch between teams using "Team Selection" in the main menu (viewing which teams have notifications is not yet supported) 

### Contributors

Many thanks to all our contributors. In alphabetical order:
- csduarte, dmeza, enahum, hmhealey, it33, jarredwitt, jasonblais, lfbrock, mfpiccolo, saturninoabril, thomchop
