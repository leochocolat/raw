/**
 * Api plugin
 *
 * @plugin
 *
 * @example
 * $api.getPosts()
 */
import coreModule from './core';
import contentfulModule from './contentful';

const apiFactory = (i18n, error, store, req, route, redirect) => ({
    ...coreModule(),
    ...contentfulModule({ i18n, error }),
});

export default async (context, inject) => {
    const { app, error, store, route, req, redirect } = context;
    const i18n = app.i18n;
    const api = apiFactory(i18n, error, store, req, route, redirect);

    inject('api', api);
    inject('i18n', i18n);

    // Hello World
    const setup = await api.getSetup();
    store.dispatch('setup', setup);

    const entries = await api.getEntries();
    console.log(entries);
};
