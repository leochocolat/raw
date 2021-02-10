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
        scss: ['@/assets/styles/resources/_variables.scss', '@/assets/styles/resources/_mixins.scss', '@/assets/styles/resources/_functions.scss', '@/assets/styles/resources/_breakpoints.scss'],
    },
    /*
     ** Global CSS
     */
    css: ['@/assets/styles/app.scss'],
    /*
     ** Plugins to load before mounting the App
     ** https://nuxtjs.org/guide/plugins
     */
    plugins: ['@/plugins/listeners.client.js'],
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
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        // Doc: https://github.com/nuxt-community/dotenv-module
        '@nuxtjs/dotenv',
        '@nuxtjs/style-resources',
        '@nuxtjs/svg',
    ],
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {},
    /*
     ** Build configuration
     ** See https://nuxtjs.org/api/configuration-build/
     */
    build: {},

    server: {
        port: 3000,
        host: '0.0.0.0',
    },
};
