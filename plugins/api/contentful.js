const contentfulDelivery = require('contentful');
const contentfulManagment = require('contentful-management');

const configDelivery = {
    space: process.env.CTF_SPACE_ID,
    accessToken: process.env.CTF_CDA_ACCESS_TOKEN_DELIVERY,
};

const configManagment = {
    space: process.env.CTF_SPACE_ID,
    accessToken: process.env.CTF_CDA_ACCESS_TOKEN_MANAGMENT,
};

export default function ({ i18n, error }) {
    const clientDelivery = contentfulDelivery.createClient(configDelivery);
    const clientManagment = contentfulManagment.createClient(configManagment);

    return {
        /**
         * Returns the list of entries
         * @returns {Array.<Object>} List of all entries
         */
        async getEntries() {
            let res;
            try {
                res = await clientDelivery.getEntries({
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
                res = await clientDelivery.getEntries({
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
                res = await clientDelivery.getEntry(id, {
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
         * Create an entry
         * @param {String} contentTypeId content type id
         * @param {Object} data content type data
         */
        async createEntry(contentTypeId, fields) {
            const data = { fields };
            let res;
            try {
                res = await clientManagment
                    .getSpace(configManagment.space)
                    .then((space) => space.getEnvironment('master'))
                    .then((environment) => environment.createEntry(contentTypeId, data));
            } catch (err) {
                return error(err);
            }
            return res;
        },

        /**
         * Update an entry
         * @param {String} entryId entry id
         * @param {Object} fields fields to update
         */
        async updateEntry(entryId, fields) {
            let res;
            try {
                res = await clientManagment
                    .getSpace(configManagment.space)
                    .then((space) => space.getEnvironment('master'))
                    .then((environment) => environment.getEntry(entryId))
                    .then((entry) => {
                        for (const property in fields) {
                            if (!entry.fields[property]) {
                                console.error(`Property /${property}/ does not exist in entry : /${entryId}/`);
                                continue;
                            }
                            entry.fields[property] = fields[property];
                        }
                        return entry.update();
                    });
            } catch (err) {
                return error(err);
            }
            return res;
        },
    };
}
