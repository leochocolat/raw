// Utils
import device from '@/utils/device';
import Browser from '@/utils/Browser';

export default ({ query, store }) => {
    /**
     * Context
     */
    // const isDebug = (query.debug || query.debug === null) && process.env.NODE_ENV === 'development';
    const isDebug = query.debug || query.debug === null;
    store.dispatch('context/setDebug', isDebug);

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
