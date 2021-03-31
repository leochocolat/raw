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

    /**
     * Get Entries
     */
    // const entries = await api.getEntries();

    // Get blur
    // const getBlurValueEntry = await api.getEntriesByName('blurValue');
    // store.dispatch('data/setBlurValue', getBlurValueEntry.items[0].fields.value);

    /**
     * Update Json Entry
     */
    // const entries = await api.updateEntry('4r4Hki14AsqrV4cNRf38IH', {
    //     testJson: {
    //         [i18n.localeProperties.name]: { test: 'test1' },
    //     },
    // });

    /**
     * Create Entrie
     */
    // const newPost = await api.createEntry('message', {
    //     message: {
    //         [i18n.localeProperties.name]: `Je m'appelle Léo`,
    //     },
    // });
};
