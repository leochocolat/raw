
import { INLINES, HYPERLINK } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

export default {
    props: ['document'],

    computed: {
        richText() {
            const options = {
                renderNode: {
                    [INLINES.HYPERLINK]: (node, next) => {
                        let el = '';
                        if (node.data.uri.includes('@')) {
                            el = `<a href="mailto:${node.data.uri}">${next(node.content)}</a>`;
                        } else {
                            el = `<a href="${node.data.uri}" target="_blank" rel="noopener">${next(node.content)}</a>`;
                        }
                        return el;
                    },
                },
            };
            return documentToHtmlString(this.document, options);
        },
    },
};
