export default (context) => {
    const { query, store, $cookies, $api } = context;

    /**
     * Context
     */
    const isProduction = query.production || query.production === null || process.env.NODE_ENV === 'production';
    store.dispatch('context/setProduction', isProduction);

    const isDevelopment = process.env.NODE_ENV === 'development' && !isProduction;
    store.dispatch('context/setDevelopment', isDevelopment);

    // Unquote this line on project launch to disable debug mode
    // const isDebug = (query.debug || query.debug === null) && isDevelopment;
    const isDebug = query.debug || query.debug === null;
    store.dispatch('context/setDebug', isDebug);

    // console.log({ isProduction, isDevelopment, isDebug });

    /**
     * User
     */
    const stop = $cookies.get('stop');

    if (stop) {
        store.dispatch('stop/stop');
    }

    const promise = new Promise((resolve) => {
        /**
         * If Cookies are already provided,
         * dispatch into the store and resolve promise
         */
        if ($cookies.get('data')) {
            store.dispatch('data/setFromCookies', $cookies.get('data'));
            resolve();
        } else {
            // Fetch Scene entries
            $api.getScenesEntries().then((response) => {
                // Dispatch data into the store
                for (const key in response) {
                    const scene = response[key];
                    store.dispatch('data/setSceneCensorshipInitialFactor', { id: key, value: scene.censorshipFactor });
                }

                console.log(store.state.data);

                $cookies.set('data', store.state.data, {
                    // One month
                    expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30),
                    maxAge: 1000 * 3600 * 24 * 30,
                });

                resolve();
            });
        }
    });

    return promise;
};
