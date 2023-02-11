import type { ODataQuery, ODataFetch } from './OData.types';

/**
 * Parses the {@link ODataFetch.fetchXml fetchXml} query
 * @returns Returns `false` when the parse has an error
 */
export const getFetchXmlFromParser = (parser: URLSearchParams, result: ODataQuery): boolean => {
    const fetchXml = parser.get('fetchXml');
    if (fetchXml !== null) {
        if (fetchXml === '') {
            result.error = {
                code: '0x80040203',
                message: 'Expected non-empty string.',
            };
            return false;
        }

        const serializer = new DOMParser();
        const fetchXmlDocument = serializer.parseFromString(fetchXml, 'text/xml');
        if (fetchXmlDocument.documentElement.tagName === 'parsererror') {
            result.error = {
                code: '0x80040201',
                message: 'Invalid XML.',
            };
            return false;
        }
        const entity = fetchXmlDocument
            .evaluate('fetch/entity', fetchXmlDocument, null, XPathResult.ANY_TYPE, null)
            .iterateNext() as Element;
        if (fetchXmlDocument.documentElement.children.length != 1 || !entity || !entity.getAttribute('name')) {
            result.error = {
                code: '0x80041102',
                message: 'Entity Name was not specified in FetchXml String.',
            };
            return false;
        }
        const invalidAttribute = fetchXmlDocument
            .evaluate(
                'fetch/entity/*[not(self::filter or self::order or self::link-entity or self::attribute or self::all-attributes or self::no-attrs)]',
                fetchXmlDocument,
                null,
                XPathResult.ANY_TYPE,
                null,
            )
            .iterateNext() as Element;
        if (invalidAttribute) {
            result.error = {
                code: '0x8004111c',
                message: `Invalid Child Node, valid nodes are filter, order, link-entity, attribute, all-attributes, no-attrs. NodeName = ${invalidAttribute.tagName} NodeXml = ${invalidAttribute.outerHTML}`,
            };
            return false;
        }
        result.fetchXml = fetchXmlDocument;
    }
    return true;
};
