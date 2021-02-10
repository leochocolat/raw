const contentful = require('contentful');

const config = {
    space: process.env.CTF_SPACE_ID,
    accessToken: process.env.CTF_CDA_ACCESS_TOKEN,
};

export default function ({ i18n, error }) {
    const client = contentful.createClient(config);

    return {
        /**
         * Returns the list of entries
         * @returns {Array.<Object>} List of all entries
         */
        async getEntries() {
            let res;
            try {
                res = await client.getEntries({
                    locale: i18n.localeProperties.name,
                });
            } catch (err) {
                res = err.response;
                return error({
                    message: err.message,
                });
            }
            return res;
        },

        /**
         * Returns the list of entries by names
         * @param {String} name entry name
         * @returns {Array.<Object>} List of entries
         */
        async getEntriesByName(name) {
            let res;
            try {
                res = await client.getEntries({
                    content_type: name,
                    locale: i18n.localeProperties.name,
                });
            } catch (err) {
                res = err.response;
                if (res.status === 404) {
                    return error({
                        statusCode: 404,
                        message: `The page you're looking for doesn't exist`,
                    });
                }
            }
            return res;
        },

        /**
         * Returns the entry needed by its id
         * @param {String} id entry id
         * @returns {Object} return the entry
         */
        async getEntryById(id) {
            let res;
            try {
                res = await client.getEntry(id, {
                    locale: i18n.localeProperties.name,
                });
            } catch (err) {
                res = err.response;
                if (res.status === 404) {
                    return error({
                        statusCode: 404,
                        message: `The page you're looking for doesn't exist`,
                    });
                }
            }
            return res;
        },
    };
}
