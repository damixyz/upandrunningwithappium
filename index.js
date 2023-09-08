const {remote} = require('webdriverio')


const capabilities = {
    "appium:platformName": "Android",
    "appium:automationName": "UiAutomator2",
    "appium:deviceName": "Android",
    "appium:appPackage": "com.android.settings",
    "appium:appActivity": ".Settings",
}

const wdOpts = {
    host: process.env.APPIUM_HOST || 'localhost',
    port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
    logLevel: 'info',
    capabilities
}

async function runTest() {
    const driver = await remote(wdOpts)

    await driver.startRecordingScreen({
        videoSize: '1280x720',
        timeLimit: '1800',
        // bitRate: '5000000'
    })

    try {
        console.log("✅ Hello world")
        const textViews = await driver.findElements('css selector', "android.widget.TextView")

        console.log("✅ Hello world " + textViews.length)

        textViews.forEach((callback) => {
            console.log("✅🎉 " + callback.toString())
            driver.getElementText(callback["element-6066-11e4-a52e-4f735466cecf"]).then(c => {
                console.log("☘️ " + c)
            })
        })

        const notificationItem = await driver.$('//*[@text="Notifications"]')

        await notificationItem.click()


    } finally {
        await driver.pause(1000)
        await driver.stopRecordingScreen()
            .then(function (res) {
                let binaryData = new Buffer.from(res, 'base64').toString('binary');
                require('fs')
                    .writeFile(
                        'notification.mp4',
                        binaryData,
                        'binary',
                        function (err) {
                        })

            })
        await driver.deleteSession()
    }
}

runTest().catch(console.error)
