# Tips and Tricks

## Appium Inspector & Debugging

### Using Appium Inspector Plugin (Appium 3.x)

The Appium Inspector plugin provides a web-based UI for inspecting elements during test execution.

#### Setup

1. **Install the plugin:**
   ```bash
   appium plugin install inspector
   ```

2. **Enable in config** (already configured in `wdio.shared.local.appium.conf.ts`):
   ```typescript
   args: {
       usePlugins: 'inspector',
       allowInsecure: '*:session_discovery',  // Required for session listing
   }
   ```

#### Accessing the Inspector

While a test is running or paused:
- **Web UI:** http://localhost:4723/inspector
- **Sessions API:** http://localhost:4723/appium/sessions

#### Debugging with Breakpoints

Add `await browser.debug()` in your test to pause execution and inspect elements:

```typescript
it('should debug login', async () => {
    await LoginScreen.tapOnLoginContainerButton();
    
    // Pause here - open http://localhost:4723/inspector in browser
    await browser.debug();
    
    await LoginScreen.submitLoginForm();
});
```

Press `Enter` in the terminal to continue execution after debugging.

#### Appium 3.x Session Discovery

In Appium 3.x, the session endpoint changed:
- **Old (Appium 2.x):** `GET /sessions`
- **New (Appium 3.x):** `GET /appium/sessions`

To verify active sessions:
```bash
curl http://localhost:4723/appium/sessions
```

#### Using Desktop Appium Inspector

If using the desktop Appium Inspector app (download from [GitHub releases](https://github.com/appium/appium-inspector/releases)):
- Requires version **2025.3.1 or later** for Appium 3.x compatibility
- Set Remote Path to `/` (not `/wd/hub`)

---

## Useful information
Check the following sites for more information about WebdriverIO/Appium
- [WebdriverIO](http://webdriver.io)
- [Appium Docs](http://appium.io/docs/en/about-appium/intro/)
- [Appium Pro Newsletter](http://appiumpro.com)

## Allure Reporting

### Required Packages

Install the following packages to enable Allure reporting:

```sh
# NPM packages
npm install --save-dev @wdio/allure-reporter allure-commandline

# FFmpeg (required for video recording attachments)
brew install ffmpeg
```

| Package | Description |
|---------|-------------|
| `@wdio/allure-reporter` | WebdriverIO plugin that generates Allure-compatible test results |
| `allure-commandline` | CLI tool to generate HTML reports and serve them locally |
| `ffmpeg` | Required for video recording and processing (macOS: `brew install ffmpeg`) |

### Configuration

Allure reporter is configured in [`wdio.shared.conf.ts`](../config/wdio.shared.conf.ts) with the following features:

```typescript
['allure', {
    outputDir: 'allure-results',
    disableWebdriverStepsReporting: true,
    disableWebdriverScreenshotsReporting: false,
}]
```

### Automatic Attachments on Test Failure

The framework automatically captures and attaches the following on test failures:

1. **Screenshot** - Full screen capture at the moment of failure
2. **Video Recording** - Screen recording of the entire test execution
3. **Appium Server Logs** - Last 500 lines from `./logs/appium.log`

### Video Recording Settings

Video recording is configured differently for each platform:

**Android:**
```typescript
await driver.startRecordingScreen({
    videoSize: '720x1280',
    bitRate: 3000000,  // 3 Mbps
});
```

**iOS:**
```typescript
await driver.startRecordingScreen({
    videoType: 'mpeg4',
    videoQuality: 'medium',
});
```

### Viewing Reports

```sh
# Quick view - generates and opens
npm run allure:report

# Or step by step
npm run allure:generate  # Creates allure-report/
npm run allure:open      # Opens in browser
```

### Combined Reports (Android + iOS)

To generate a report containing results from both platforms:

```sh
# 1. Clean previous results
npm run allure:clean

# 2. Run Android tests (results accumulate)
npm run android.app -- --spec=tests/specs/app.login.spec.ts

# 3. Run iOS tests (results accumulate)
npm run ios.app -- --spec=tests/specs/app.login.spec.ts

# 4. Generate combined report
npm run allure:report
```

> **Note:** Don't run `npm run allure:clean` between test runs if you want combined results.

### Troubleshooting

**Report shows no data:**
- Ensure `allure-results/` directory exists and contains `.json` files
- Run `npm run allure:generate` before `npm run allure:open`

**Video not attached:**
- Video recording requires the test to run long enough
- Check if `driver.startRecordingScreen()` is supported on your device/emulator

**Appium logs not attached:**
- Ensure Appium is writing logs to `./logs/appium.log`
- Check the `outputDir` setting in `wdio.shared.local.appium.conf.ts`
