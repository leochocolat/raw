export default {
    /*
     ** Nuxt rendering mode
     ** See https://nuxtjs.org/api/configuration-mode
     */
    mode: 'universal',
    /*
     ** Nuxt target
     ** See https://nuxtjs.org/api/configuration-target
     */
    target: 'server',
    /*
     ** Headers of the page
     ** See https://nuxtjs.org/api/configuration-head
     */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || '',
            },
        ],
        // link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
    /*
     ** CSS Style Resources
     */
    styleResources: {
        scss: [
            '@/assets/styles/resources/_variables.scss',
            '@/assets/styles/resources/_mixins.scss',
            '@/assets/styles/resources/_functions.scss',
            '@/assets/styles/resources/_breakpoints.scss',
        ],
    },
    /*
     ** Global CSS
     */
    css: ['@/assets/styles/app.scss'],
    /*
     ** Plugins to load before mounting the App
     ** https://nuxtjs.org/guide/plugins
     */
    plugins: [
        '@/plugins/listeners.client.js',
        '@/plugins/init.client.js',
        '@/plugins/init.js',
        '@/plugins/api/index',
    ],

    /*
     * Middleware
     */
    router: {
        // middleware: 'user',
    },

    /*
     ** Auto import components
     ** See https://nuxtjs.org/api/configuration-components
     */
    components: [
        {
            path: '@/components/',
            extensions: ['vue'],
        },
        {
            path: '@/sections/',
            extensions: ['vue'],
        },
    ],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [
        // Doc: https://github.com/nuxt-community/stylelint-module
        '@nuxtjs/stylelint-module',
        '@nuxt/components',
    ],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://github.com/nuxt-community/dotenv-module
        '@nuxtjs/dotenv',
        '@nuxtjs/style-resources',
        '@nuxtjs/svg',
        // Doc: https://i18n.nuxtjs.org/
        'nuxt-i18n',
        // Doc: https://github.com/microcipcip/cookie-universal/tree/master/packages/cookie-universal-nuxt#readme
        'cookie-universal-nuxt',
    ],
    /*
     ** i18n
     */
    i18n: {
        locales: [
            { code: 'fr', name: 'fr-FR' },
            { code: 'en', name: 'en-US' },
        ],
        defaultLocale: 'fr',
        strategy: 'prefix',
        vueI18n: {
            fallbackLocale: 'fr',
            messages: {
                fr: require('./locales/fr'),
                en: require('./locales/en'),
            },
        },
    },
    /*
     ** Build configuration
     ** See https://nuxtjs.org/api/configuration-build/
     */
    build: {
        babel: {
            plugins: ['@babel/plugin-proposal-optional-chaining'],
        },

        extend(config, ctx) {
            /**
             * GLSL loader
             */
            config.module.rules.push({
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: ['raw-loader', 'glslify-loader'],
            });
        },

        transpile: ['three'],
    },

    server: {
        port: 3000,
        host: '0.0.0.0',
    },

    env: {
        NODE_ENV: process.env.NODE_ENV,
        CTF_SPACE_ID: process.env.CTF_SPACE_ID,
        CTF_CDA_ACCESS_TOKEN_DELIVERY: process.env.CTF_CDA_ACCESS_TOKEN_DELIVERY,
        CTF_CDA_ACCESS_TOKEN_MANAGMENT: process.env.CTF_CDA_ACCESS_TOKEN_MANAGMENT,
    },
};
