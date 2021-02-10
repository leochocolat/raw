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

const apiFactory = (error, store, req, route, redirect) => ({
    ...coreModule(),
    ...contentfulModule({ error }),
});

export default async (context, inject) => {
    const { error, store, route, req, redirect } = context;
    const api = apiFactory(error, store, req, route, redirect);

    // inject api into nuxt
    inject('api', api);

    // Hello World
    const setup = await api.getSetup();
    store.dispatch('setup', setup);

    const entries = await api.getEntries();
};
