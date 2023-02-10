/**
 * Parses the $fetchXml query
 * @returns Returns true when the parse has an error
 */
export var getFetchXmlFromParser = function (parser, result) {
    var fetchXml = parser.get('fetchXml');
    if (fetchXml !== null) {
        var serializer = new DOMParser();
        var fetchXmlDocument = serializer.parseFromString(fetchXml, 'text/xml');
        if (fetchXmlDocument.documentElement.tagName === 'parsererror') {
            result.error = {
                code: '0x80040201',
                message: 'Invalid XML.',
            };
            return true;
        }
        var entity = fetchXmlDocument
            .evaluate('fetch/entity', fetchXmlDocument, null, XPathResult.ANY_TYPE, null)
            .iterateNext();
        if (fetchXmlDocument.documentElement.children.length != 1 || !entity || !entity.getAttribute('name')) {
            result.error = {
                code: '0x80041102',
                message: 'Entity Name was not specified in FetchXml String.',
            };
            return true;
        }
        var invalidAttribute = fetchXmlDocument
            .evaluate('fetch/entity/*[not(self::filter or self::order or self::link-entity or self::attribute or self::all-attributes or self::no-attrs)]', fetchXmlDocument, null, XPathResult.ANY_TYPE, null)
            .iterateNext();
        if (invalidAttribute) {
            result.error = {
                code: '0x8004111c',
                message: "Invalid Child Node, valid nodes are filter, order, link-entity, attribute, all-attributes, no-attrs. NodeName = ".concat(invalidAttribute.tagName, " NodeXml = ").concat(invalidAttribute.outerHTML),
            };
            return true;
        }
        result.fetchXml = fetchXmlDocument;
    }
    return false;
};
//# sourceMappingURL=getFetchXmlFromParser.js.map