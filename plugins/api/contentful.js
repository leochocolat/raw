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

const FIELD_CENSORSHIP_DATA = 'censorshipData';
const FIELD_CENSORSHIP_FACTOR = 'censorshipFactor';

export default function ({ i18n, error, store }) {
    const clientDelivery = contentfulDelivery.createClient(configDelivery);
    const clientManagment = contentfulManagment.createClient(configManagment);

    /**
     * Basics
     */

    /**
     * Returns the list of entries
     * @returns {Array.<Object>} List of all entries
     */
    async function getEntries() {
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
    }

    /**
     * Returns the list of entries by names
     * @param {String} name entry name
     * @returns {Array.<Object>} List of entries
     */
    async function getEntriesByName(name) {
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
    }

    /**
     * Returns the entry needed by its id
     * @param {String} id entry id
     * @returns {Object} return the entry
     */
    async function getEntryById(id) {
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
    }

    /**
     * Create an entry
     * @param {String} contentTypeId content type id
     * @param {Object} data content type data
     */
    async function createEntry(contentTypeId, fields) {
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
    }

    /**
     * Update an entry
     * @param {String} entryId entry id
     * @param {Object} fields fields to update
     */
    async function updateEntry(entryId, fields) {
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
    }

    /**
     * Custom
     * Specific methods for .RAW project
     */
    const scenesEntries = {};

    async function getScenesEntries() {
        const entries = await getEntriesByName('scene');

        for (let i = 0; i < entries.items.length; i++) {
            const entry = entries.items[i];
            const sysId = entry.sys.id;
            const { id } = entry.fields;

            scenesEntries[id] = { sysId, ...entry.fields };
        }

        return scenesEntries;
    }

    /**
     * Update censorship for a specific scene entry
     * @param {String} name
     * @param {Number} value
     * @return {Promise}
     */
    function updateSceneCensorship(id, value) {
        if (!store.state.data.sceneEntries[id]) throw new Error(`Could not find scene entry with id /${id}/`);

        const sysId = store.state.data.sceneEntries[id].sysId;

        getEntryById(sysId).then((response) => {
            const data = response.fields[FIELD_CENSORSHIP_DATA];

            const newData = data && data.inputs ? data.inputs : [];
            newData.push(value);

            // Compute newFactor
            let sumFactor = 0;
            for (let i = 0; i < newData.length; i++) {
                const input = newData[i];
                sumFactor += input;
            }
            const newFactor = sumFactor / newData.length;

            // Update censorship data
            updateEntry(sysId, {
                [FIELD_CENSORSHIP_DATA]: {
                    'fr-FR': {
                        inputs: newData,
                    },
                },
                [FIELD_CENSORSHIP_FACTOR]: {
                    'fr-FR': newFactor,
                },
            }).then((response) => {
                response.publish();
            });
        });
    }

    return {
        // Basis
        getEntries,
        getEntriesByName,
        getEntryById,
        createEntry,
        updateEntry,
        // Custom
        getScenesEntries,
        updateSceneCensorship,
    };
}
