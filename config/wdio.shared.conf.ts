import type { Options } from '@wdio/types';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import allure from '@wdio/allure-reporter';

/**
 * All not needed configurations, for this boilerplate, are removed.
 * If you want to know which configuration options you have then you can
 * check https://webdriver.io/docs/configurationfile
 */
export const config: Options.Testrunner = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    // ==================
    // Specify Test Files
    // ==================
    // The test-files are specified in:
    // - wdio.android.browser.conf.ts
    // - wdio.android.app.conf.ts
    // - wdio.ios.browser.conf.ts
    // - wdio.ios.app.conf.ts
    //
    /**
     * NOTE: This is just a place holder and will be overwritten by each specific configuration
     */
    specs: [],
    //
    // ============
    // Capabilities
    // ============
    // The capabilities are specified in:
    // - wdio.android.browser.conf.ts
    // - wdio.android.app.conf.ts
    // - wdio.ios.browser.conf.ts
    // - wdio.ios.app.conf.ts
    //
    /**
     * NOTE: This is just a place holder and will be overwritten by each specific configuration
     */
    capabilities: [],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'debug',
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/applitools-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    baseUrl: 'http://the-internet.herokuapp.com',
    // Default timeout for all waitFor* commands.
    /**
     * NOTE: This has been increased for more stable Appium Native app
     * tests because they can take a bit longer.
     */
    waitforTimeout: 45000,
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    // Default request retries count
    connectionRetryCount: 3,
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    //
    // Services are empty here but will be defined in the
    // - wdio.shared.browserstack.conf.ts
    // - wdio.shared.local.appium.conf.ts
    // - wdio.shared.sauce.conf.ts
    // configuration files
    services: [],
    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'mocha',
    // The number of times to retry the entire spec file when it fails as a whole
    // specFileRetries: 1,
    //
    // Delay in seconds between the spec file retry attempts
    // specFileRetriesDelay: 0,
    //
    // Whether or not retried spec files should be retried immediately or deferred to the end of the queue
    // specFileRetriesDeferred: false,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            // Disable auto screenshot attachment - we manually attach with descriptive names in afterTest hook
            disableWebdriverScreenshotsReporting: true,
        }],
    ],
    // Options to be passed to Mocha.
    mochaOpts: {
        ui: 'bdd',
        /**
         * NOTE: This has been increased for debugging with Appium Inspector.
         * Set to 10 minutes to allow time for element inspection.
         */
        timeout: 10 * 60 * 1000, // 10min for debugging
    },
    //
    // Debug timeout for browser.debug() command
    // Increased to allow sufficient time for Appium Inspector usage
    debug: true,
    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    //
    /**
     * NOTE: No Hooks are used in this project, but feel free to add them if you need them.
     */

    /**
     * Start video recording before each test
     */
    beforeTest: async function(test, context) {
        // Start screen recording for video capture
        try {
            if (driver.isAndroid) {
                await driver.startRecordingScreen({
                    videoSize: '720x1280',
                    timeLimit: 180, // 3 minutes max
                    bitRate: 3000000,
                });
            } else if (driver.isIOS) {
                await driver.startRecordingScreen({
                    videoType: 'mpeg4',
                    videoQuality: 'medium',
                    timeLimit: 180,
                });
            }
        } catch (e) {
            console.log('Could not start screen recording:', e);
        }
    },

    /**
     * Take screenshot and video on test failure, attach Appium logs
     */
    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        // Stop screen recording and attach video
        let videoBuffer: string | undefined;
        try {
            videoBuffer = await driver.stopRecordingScreen();
        } catch (e) {
            console.log('Could not stop screen recording:', e);
        }

        if (!passed) {
            // Take screenshot on failure
            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Screenshot on Failure', Buffer.from(screenshot, 'base64'), 'image/png');

            // Attach video recording if available
            if (videoBuffer) {
                allure.addAttachment('Video Recording', Buffer.from(videoBuffer, 'base64'), 'video/mp4');
            }

            // Attach Appium server logs
            const appiumLogPath = join(process.cwd(), 'logs', 'appium.log');
            if (existsSync(appiumLogPath)) {
                try {
                    const logContent = readFileSync(appiumLogPath, 'utf-8');
                    // Get last 500 lines of log for the attachment
                    const logLines = logContent.split('\n');
                    const recentLogs = logLines.slice(-500).join('\n');
                    allure.addAttachment('Appium Server Logs (last 500 lines)', recentLogs, 'text/plain');
                } catch (e) {
                    console.log('Could not read Appium logs:', e);
                }
            }
        }
    },
};
