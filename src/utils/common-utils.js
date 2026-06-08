class CommonUtils {
    async waitForSomeTime(timeInSeconds) {
        console.log('Additional Wait for ' + timeInSeconds + ' seconds.');
        await new Promise(resolve => setTimeout(resolve, (timeInSeconds * 1000)));
    }
}

module.exports = { CommonUtils };