'use strict';

const {
  ClassicRunner,
  Eyes,
  Target,
  Configuration,
  BatchInfo,
} = require('@applitools/eyes-webdriverio');


describe('ACME Bank', function () {
  // This WebdriverIO test case class contains everything needed to run a full visual test against the ACME bank site.
  // It runs the test locally against Google Chrome using the Applitools classic runner.
  // If you want to run cross-browser visual tests, consider using the Ultrafast Grid.

  // Test control inputs to read once and share for all tests
  var applitoolsApiKey;

  // Applitools objects to share for all tests
  let batch;
  let config;
  let runner;

  // Test-specific objects
  let eyes;


  before(async () => {
    // This method sets up the configuration for running visual tests locally using the classic runner.
    // The configuration is shared by all tests in a test suite, so it belongs in a `before` method.
    // If you have more than one test class, then you should abstract this configuration to avoid duplication. 

    // Read the Applitools API key from an environment variable.
    // To find your Applitools API key:
    // https://applitools.com/tutorials/getting-started/setting-up-your-environment.html
    applitoolsApiKey = process.env.APPLITOOLS_API_KEY;

    // Create the classic runner.
    runner = new ClassicRunner();

    // Create a new batch for tests.
    // A batch is the collection of visual checkpoints for a test suite.
    // Batches are displayed in the dashboard, so use meaningful names.
    batch = new BatchInfo('Applitools Example: WebdriverIO 6 JavaScript with the Classic Runner');

    // Create a configuration for Applitools Eyes.
    config = new Configuration();
    
    // Set the Applitools API key so test results are uploaded to your account.
    // If you don't explicitly set the API key with this call,
    // then the SDK will automatically read the `APPLITOOLS_API_KEY` environment variable to fetch it.
    config.setApiKey(applitoolsApiKey);

    // Set the batch for the config.
    config.setBatch(batch);
  });


  beforeEach(async function () {
    //This method sets up each test with its own ChromeDriver and Applitools Eyes objects.
    
    // Create the Applitools Eyes object connected to the ClassicRunner and set its configuration.
    eyes = new Eyes(runner);
    eyes.setConfiguration(config);

    // Open Eyes to start visual testing.
    // It is a recommended practice to set all four inputs:
    await eyes.open(
        browser,                            // WebDriver to "watch"
        'ACME Bank',                        // The name of the app under test
        this.currentTest.fullTitle()        // The name of the test case
    );

    // Set the log handler.
    if (browser.config.enableEyesLogs) {
      eyes.setLogHandler(new ConsoleLogHandler(true));
    }
  });


  it('should log into a bank account', async () => {
    // This test covers login for the Applitools demo site, which is a dummy banking app.
    // The interactions use typical Selenium calls,
    // but the verifications use one-line snapshot calls with Applitools Eyes.
    // If the page ever changes, then Applitools will detect the changes and highlight them in the dashboard.
    // Traditional assertions that scrape the page for text values are not needed here.

    // Load the login page.
    await browser.url('https://demo.applitools.com');

    // Verify the full login page loaded correctly.
    await eyes.check(Target.window().fully().withName("Login page"));
    
    // Perform login.
    const usernameField = await browser.$('#username');
    await usernameField.setValue("andy");
    const passwordField = await browser.$('#password');
    await passwordField.setValue("i<3pandas");
    const loginButton = await browser.$('#log-in');
    await loginButton.click();

    // Verify the full main page loaded correctly.
    // This snapshot uses LAYOUT match level to avoid differences in closing time text.
    await eyes.check(Target.window().fully().withName("Main page").layout());
  });


  afterEach(async () => {

    // Quit the WebdriverIO instance
    await browser.closeWindow();

    // Close Eyes to tell the server it should display the results.
    await eyes.closeAsync();

    // Warning: `eyes.closeAsync()` will NOT wait for visual checkpoints to complete.
    // You will need to check the Applitools dashboard for visual results per checkpoint.
    // Note that "unresolved" and "failed" visual checkpoints will not cause the Mocha test to fail.

    // If you want the ACME demo app test to wait synchronously for all checkpoints to complete, then use `eyes.close()`.
    // If any checkpoints are unresolved or failed, then `eyes.close()` will make the ACME demo app test fail.
  });


  after(async () => {
    // Close the batch and report visual differences to the console.
    // Note that it forces Mocha to wait synchronously for all visual checkpoints to complete.
    const allTestResults = await runner.getAllTestResults();
    console.log(allTestResults);
  });

});