// Utils
import device from '@/utils/device';
import Browser from '@/utils/Browser';

export default ({ store }) => {
    /**
     * Browser
     */
    const browser = Browser.getClassName();
    store.dispatch('browser/setName', browser);
    store.dispatch('browser/setSafari', Browser.isSafari());
    store.dispatch('browser/setEdge', Browser.isEdge());
    store.dispatch('browser/setIE', Browser.isInternetExplorer());
    store.dispatch('browser/setFirefox', Browser.isFirefox());

    /**
     * Device
     */
    const isTouch = device.isTouch();
    store.dispatch('device/setTouch', isTouch);
};
