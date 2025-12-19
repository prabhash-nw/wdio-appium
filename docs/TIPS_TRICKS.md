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

## Helpers
The following helpers can be found [here](../tests/helpers/)

- Gestures (static methods)
- Webview

There are also two components objects that can be useful:

- Native alerts (static methods)
- Picker (static methods)

and can be found [here](./tests/screenobjects/components/).

These helpers and component objects can be used to easily automate certain actions with native apps without reinventing the wheel again.
Just copy them in your project and use them.

## Is it wise to use XPATH?
The advice is to prevent using XPATH unless there is no other option. XPATH is a brittle locator strategy and will take some time to find
elements on a page.
More info about that can be found in the [Appium Pro News letters](https://appiumpro.com):
- [Making Your Appium Tests Fast and Reliable, Part 2: Finding Elements](https://appiumpro.com/editions/20)
- [How to Find Elements in iOS (Not) By XPath](https://appiumpro.com/editions/8)

### Example
A testcase can be found [here](../tests/specs/app.webview.xpath.spec.ts) that illustrates the difference between finding a webview by XPATH
and in a different way.
Checking if the WebView is loaded including the webpage can be done in **4 seconds** with this piece of JS

#### XPATH logs (17 seconds)

```log
[11:30:57]  COMMAND     POST     "/wd/hub/session/0516bba1-e64d-4873-bdd4-1f5e8070960f/element"
[11:30:57]  DATA                {"using":"accessibility id","value":"WebView"}
[11:30:57]  RESULT              {"ELEMENT":"18000000-0000-0000-0E20-000000000000"}
[11:30:57]  COMMAND     POST     "/wd/hub/session/0516bba1-e64d-4873-bdd4-1f5e8070960f/element/18000000-0000-0000-0E20-000000000000/click"
[11:30:57]  DATA                {}
[11:30:57]  COMMAND     POST     "/wd/hub/session/0516bba1-e64d-4873-bdd4-1f5e8070960f/elements"
[11:30:57]  DATA                {"using":"xpath","value":"*//XCUIElementTypeWebView"}
[11:30:58]  RESULT              []
[11:30:58]  COMMAND     POST     "/wd/hub/session/0516bba1-e64d-4873-bdd4-1f5e8070960f/elements"
[11:30:58]  DATA                {"using":"xpath","value":"*//XCUIElementTypeWebView"}
[11:30:58]  RESULT              []
[11:30:58]  COMMAND     POST     "/wd/hub/session/0516bba1-e64d-4873-bdd4-1f5e8070960f/elements"
[11:30:58]  DATA                {"using":"xpath","value":"*//XCUIElementTypeWebView"}
[11:30:59]  RESULT              []
[11:30:59]  COMMAND     POST     "/wd/hub/session/0516bba1-e64d-4873-bdd4-1f5e8070960f/elements"
[11:30:59]  DATA                {"using":"xpath","value":"*//XCUIElementTypeWebView"}
[11:30:59]  RESULT              []
[11:30:59]  COMMAND     POST     "/wd/hub/session/0516bba1-e64d-4873-bdd4-1f5e8070960f/elements"
[11:30:59]  DATA                {"using":"xpath","value":"*//XCUIElementTypeWebView"}
[11:31:00]  RESULT              []
[11:31:00]  COMMAND     POST     "/wd/hub/session/0516bba1-e64d-4873-bdd4-1f5e8070960f/elements"
[11:31:00]  DATA                {"using":"xpath","value":"*//XCUIElementTypeWebView"}
[11:31:11]  RESULT              [{"ELEMENT":"38000000-0000-0000-0E20-000000000000"}]
[11:31:11]  COMMAND     GET      "/wd/hub/session/0516bba1-e64d-4873-bdd4-1f5e8070960f/element/38000000-0000-0000-0E20-000000000000/displayed"
[11:31:11]  DATA                {}
[11:31:15]  RESULT              true
```

#### Smarter way logs (0.5 seconds)

```log
[11:31:20]  COMMAND     POST     "/wd/hub/session/0516bba1-e64d-4873-bdd4-1f5e8070960f/element"
[11:31:20]  DATA                {"using":"accessibility id","value":"WebView"}
[11:31:20]  RESULT              {"ELEMENT":"18000000-0000-0000-2420-000000000000"}
[11:31:20]  COMMAND     POST     "/wd/hub/session/0516bba1-e64d-4873-bdd4-1f5e8070960f/element/18000000-0000-0000-2420-000000000000/click"
[11:31:20]  DATA                {}
[11:31:21]  COMMAND     GET      "/wd/hub/session/0516bba1-e64d-4873-bdd4-1f5e8070960f/contexts"
[11:31:21]  DATA                {}
[11:31:21]  RESULT              ["NATIVE_APP","WEBVIEW_8228.2"]
```
