export default ({ query, store }) => {
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
};
