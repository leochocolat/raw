class DevicePerformance {
    constructor() {
        if (!process.client) {
            return;
        }

        const userAgent = window.navigator.userAgent;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        this._deviceParams = {
            userAgent,
            winWidth,
            winHeight,
            pixelsCount: window.innerWidth * window.innerHeight,
            isIOs: /iPad|iPhone|iPod/i.test(userAgent) && !window.MSStream,
            isAndroid: /android/i.test(userAgent),
            isWindowsPhone: /Windows Phone OS|Windows CE|Windows Mobile|IEMobile|Windows Phone OS 7|Windows Phone 8/i.test(userAgent),
            CPUCoresCount: window.navigator.hardwareConcurrency || 2,
        };

        this._deviceQuality = 'high';
        this._setQuality();
    }

    /**
     * Getters
     */
    deviceQuality() {
        return this._deviceQuality;
    }

    /**
     * Private
     */
    _setQuality() {
        // Medium quality
        if (this._deviceParams.isIOs || this._deviceParams.isAndroid || this._deviceParams.isWindowsPhone || this._deviceParams.pixelsCount <= 1024 * 1366 || this._deviceParams.CPUCoresCount < 4) {
            this._deviceQuality = 'medium';
        }

        // Low quality
        if (((this._deviceParams.isIOs || this._deviceParams.isAndroid || this._deviceParams.isWindowsPhone) && this._deviceParams.pixelsCount <= 768 * 1024) || this._deviceParams.CPUCoresCount < 2) {
            this._deviceQuality = 'low';
        }

        console.groupCollapsed('Quality');
        console.info('userAgent', this._deviceParams.userAgent);
        console.info('isIOs', this._deviceParams.isIOs);
        console.info('isAndroid', this._deviceParams.isAndroid);
        console.info('isWindowsPhone', this._deviceParams.isWindowsPhone);
        console.info('winWidth', this._deviceParams.winWidth);
        console.info('winHeight', this._deviceParams.winHeight);
        console.info('pixelsCount', this._deviceParams.pixelsCount);
        console.info('CPUCoresCount', this._deviceParams.CPUCoresCount);
        console.info('quality', this._deviceQuality);
        console.groupEnd();
    }
};

export default new DevicePerformance();
