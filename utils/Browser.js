import Bowser from 'bowser';

class Browser {
    constructor() {
        if (process.client) {
            this._browser = Bowser.getParser(window.navigator.userAgent);
        }
    }

    isFirefox() {
        return this._browser.isBrowser('Firefox');
    }

    isSafari() {
        return this._browser.isBrowser('Safari');
    }

    isEdge() {
        return this._browser.isBrowser('Microsoft Edge');
    }

    isInternetExplorer() {
        return this._browser.isBrowser('Internet explorer');
    }

    getClassName() {
        switch (this._browser.getBrowserName()) {
            case 'Firefox':
                return 'firefox';
            case 'Chrome':
                return 'chrome';
            case 'Safari':
                return 'safari';
            case 'Internet Explorer':
                return 'ie';
        }
    }
}

export default new Browser();
