export default ({ query, store, $cookies }) => {
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
    const data = $cookies.get('data');

    if (data) {
        // Send datas to store
        store.dispatch('data/setFromCookies', data);
    } else {
        // Set initial datas
        $cookies.set('data', store.state.data, {
            // One month
            expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30),
            maxAge: 1000 * 3600 * 24 * 30,
        });
    }

    const stop = $cookies.get('stop');

    if (stop) {
        store.dispatch('stop/stop');
    }
};
