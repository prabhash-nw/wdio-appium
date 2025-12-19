# Mobile App Test Automation

Appium tests with WebdriverIO for:

- iOS/Android Native Apps
- iOS/Android Hybrid Apps

## Tech Stack

- **WebdriverIO:** `9.x`
- **Appium:** `3.x`
- **TypeScript** with `async`/`await`
- **Node.js:** `^20.19.0 || ^22.12.0 || >=24.0.0`

## Prerequisites

> [!TIP]
> Use the [appium-installer](https://github.com/AppiumTestDistribution/appium-installer) package to setup Appium on your local machine. This will also help you configure Android Emulators/ iOS Simulators.

### macOS - iOS Simulator Setup

1. Ensure Xcode is configured to use the full installation (not just Command Line Tools):

```sh
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

2. Accept the Xcode license:

```sh
sudo xcodebuild -license accept
```

3. Create a simulator (if none exist):

```sh
# List available device types
xcrun simctl list devicetypes | grep iPhone

# Create a simulator (example: iPhone 16 Pro with iOS 26.1)
xcrun simctl create "iPhone 16 Pro" "com.apple.CoreSimulator.SimDeviceType.iPhone-16-Pro" "com.apple.CoreSimulator.SimRuntime.iOS-26-1"
```

4. Verify simulators are available:

```sh
xcrun simctl list devices available
```

### macOS - Android Emulator Setup

1. Install Android Studio:

```sh
brew install --cask android-studio
```

2. Add Android SDK to your shell profile (`~/.zshrc` or `~/.bashrc`):

```sh
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

3. Reload your shell:

```sh
source ~/.zshrc
```

4. Open Android Studio and complete the setup wizard:
   - Install SDK Platform (e.g., Android 16 API 36)
   - Install SDK Tools: Android SDK Build-Tools, Android Emulator, Android SDK Platform-Tools

5. Create an Android Emulator via **Tools → Device Manager** in Android Studio

6. Verify the emulator is available:

```sh
emulator -list-avds
```

### Install Appium Globally

```sh
npm install -g appium
```

### Install Appium Drivers

```sh
# For iOS
appium driver install xcuitest

# For Android
appium driver install uiautomator2
```

Verify installation:
```sh
appium driver list
```

## Installation

1. Install all dependencies

```sh
npm install
```


2. Create a `./apps` directory at the root of this project and place your app files (`.zip` / `.apk`) into the `./apps` folder.

3. List available simulators/emulators:

```sh
# For iOS
xcrun simctl list devices available

# For Android
emulator -list-avds
```

4. Update the configuration file(s) for [Android](./config/wdio.android.app.conf.ts) and [iOS](./config/wdio.ios.app.conf.ts) with the correct:
   - `appium:deviceName` - must match your simulator/emulator name exactly
   - `appium:platformVersion` - must match the OS version (e.g., `26.1` for iOS)

5. Running tests locally
    - **iOS App:** `npm run ios.app`
    - **Android App:** `npm run android.app`
    - **Android App with cucumber:** `npm run android.app.cucumber`

## Configuration Files

This project uses a specific config for iOS and Android, see [configs](./config). The configs are based on a shared config
[`wdio.shared.conf.ts`](./config/wdio.shared.conf.ts).
This shared config holds **all the defaults** so the iOS and Android configs only need to hold the capabilities and specs that are needed for running on iOS and or Android.

Please check the [`wdio.shared.conf.ts`](./config/wdio.shared.conf.ts)-file for the minimal configuration options.

Since we do not have Appium installed as part of this package we are going to use the globally installed version of Appium. This is configured in [`wdio.shared.local.appium.conf.ts`](./config/wdio.shared.local.appium.conf.ts).

## Using Appium Inspector

The Appium Inspector is a powerful tool that allows you to inspect and interact with your mobile app's elements during development and debugging.

### Available Scripts

```sh
npm run appium:inspector
```

### Prerequisites

- Node modules must be installed (`npm install`)
- Chrome browser (recommended for best compatibility)

### Usage

```sh
# Use default port 4723
npm run appium:inspector

# Use custom port
npm run appium:inspector -- 4725
```

> [!WARNING]
> The default Appium port is **4723**. If you use a different port, you **must** also update the "Remote Port" field in the Appium Inspector interface to match.

### Capabilities Configuration

#### Android Capabilities Example
```json
{
  "platformName": "Android",
  "appium:deviceName": "Pixel_8_Pro_Android_15_API_35",
  "appium:platformVersion": "15.0",
  "appium:orientation": "PORTRAIT",
  "appium:automationName": "UiAutomator2",
  "appium:app": "/path/to/your/app.apk",
  "appium:appWaitActivity": "com.wdiodemoapp.MainActivity",
  "appium:newCommandTimeout": 240
}
```

#### iOS Capabilities Example
```json
{
  "platformName": "iOS",
  "appium:deviceName": "iPhone 16 Pro",
  "appium:platformVersion": "18.5",
  "appium:orientation": "PORTRAIT",
  "appium:automationName": "XCUITest",
  "appium:app": "/path/to/your/app.zip",
  "appium:newCommandTimeout": 240,
  "appium:webviewConnectTimeout": 5000
}
```

### Inspector URL

- **Inspector URL**: https://inspector.appiumpro.com/
- **Appium Server**: http://localhost:4723 (or your custom port)

## Locator Strategy

The locator strategy is to use `accessibilityID`s, see also the [WebdriverIO docs](https://webdriver.io/docs/selectors#accessibility-id).
`accessibilityID`s makes it easy to script once and run on iOS and Android because most of the apps already have some `accessibilityID`s.

If `accessibilityID`'s can't be used, and for example only XPATH is available, then the following setup could be used to make cross-platform selectors:

```js
const SELECTORS = {
    WEB_VIEW_SCREEN: browser.isAndroid
        ? '*//android.webkit.WebView'
        : '*//XCUIElementTypeWebView',
};
```

> [!NOTE]
> Selectors in screen/page-objects are made private to enforce implementing interactions in the page objects rather than spec files. This makes it easier to maintain and refactor.

## Running Tests

All tests can be executed on the devices as configured in [`wdio.android.app.conf.ts`](./config/wdio.android.app.conf.ts) or [`wdio.ios.app.conf.ts`](./config/wdio.ios.app.conf.ts).

```sh
# For Android local execution
npm run android.app

# For iOS local execution
npm run ios.app
```

### Drag And Drop

Test: [app.drag.and.drop.spec.ts](./tests/specs/app.drag.and.drop.spec.ts)

Uses the [`driver.dragAndDrop()`](https://webdriver.io/docs/api/mobile/dragAndDrop) method.

```sh
npm run android.app -- --spec=tests/specs/app.drag.and.drop.spec.ts
npm run ios.app -- --spec=tests/specs/app.drag.and.drop.spec.ts
```

### Form Components

Test: [app.forms.spec.ts](./tests/specs/app.forms.spec.ts)

Covers:
- Input fields
- Switches
- Dropdowns / Pickers
- Native alerts

```sh
npm run android.app -- --spec=tests/specs/app.forms.spec.ts
npm run ios.app -- --spec=tests/specs/app.forms.spec.ts
```

### Login with Biometric Support

Tests:
- [app.login.spec.ts](./tests/specs/app.login.spec.ts) - Default Login/Sign Up
- [app.biometric.login.spec.ts](./tests/specs/app.biometric.login.spec.ts) - Login through Touch-/FaceID or FingerPrint

The biometric test will enable Touch-/FaceID automatically for **Android Emulators** or **iOS Simulators**.

> [!NOTE]
> The methods rely on English as the default language on the emulator/simulator.

```sh
npm run android.app -- --spec=tests/specs/app.login.spec.ts
npm run android.app -- --spec=tests/specs/app.biometric.login.spec.ts
npm run ios.app -- --spec=tests/specs/app.login.spec.ts
npm run ios.app -- --spec=tests/specs/app.biometric.login.spec.ts
```

### Navigation

Tests:
- [app.tab.bar.navigation.spec.ts](./tests/specs/app.tab.bar.navigation.spec.ts) - Tab Bar navigation
- [app.deep.link.navigation.spec.ts](./tests/specs/app.deep.link.navigation.spec.ts) - Deep Links

Deep Links can speed up your tests. Check the `openDeepLinkUrl()` method in [`Utils.ts`](./tests/helpers/Utils.ts).

> [!TIP]
> For iOS apps with Deep Links, try adding the capability `autoAcceptAlerts:true` to automatically accept alerts.

```sh
npm run android.app -- --spec=tests/specs/app.tab.bar.navigation.spec.ts
npm run android.app -- --spec=tests/specs/app.deep.link.navigation.spec.ts
npm run ios.app -- --spec=tests/specs/app.tab.bar.navigation.spec.ts
npm run ios.app -- --spec=tests/specs/app.deep.link.navigation.spec.ts
```

### Swiping

Test: [app.swipe.spec.ts](./tests/specs/app.swipe.spec.ts)

Uses the [`driver.swipe()`](https://webdriver.io/docs/api/mobile/swipe) command.

```sh
npm run android.app -- --spec=tests/specs/app.swipe.spec.ts
npm run ios.app -- --spec=tests/specs/app.swipe.spec.ts
```

### WebViews

Tests:
- [app.webview.spec.ts](./tests/specs/app.webview.spec.ts) - Interact within a WebView with CSS Selectors
- [app.webview.xpath.spec.ts](./tests/specs/app.webview.xpath.spec.ts) - Automate a WebView based on Native Selectors

Helper: [WebView.ts](./tests/helpers/WebView.ts)

```sh
npm run android.app -- --spec=tests/specs/app.webview.spec.ts
npm run android.app -- --spec=tests/specs/app.webview.xpath.spec.ts
npm run ios.app -- --spec=tests/specs/app.webview.spec.ts
npm run ios.app -- --spec=tests/specs/app.webview.xpath.spec.ts
```

## Cloud Vendors

Configuration files for cloud testing are available in the [config](./config) folder:

- **Sauce Labs**: [config/saucelabs](./config/saucelabs)
- **BrowserStack**: [config/browserstack](./config/browserstack)
- **TestingBot**: [config/testingbot](./config/testingbot)
- **LambdaTest**: [config/lambdatest](./config/lambdatest)

See [`package.json`](./package.json) for available npm scripts.

## Documentation

- [FAQ](./docs/FAQ.md)
- [Tips and Tricks](./docs/TIPS_TRICKS.md)
