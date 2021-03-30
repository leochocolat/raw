import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

export default {
    props: ['document'],

    computed: {
        richText() {
            return documentToHtmlString(this.document);
        },
    },
};
