"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFetchXmlFromParser = void 0;
/**
 * Parses the $fetchXml query
 * @returns Returns true when the parse has an error
 */
const getFetchXmlFromParser = (parser, result) => {
  const fetchXml = parser.get('fetchXml');
  if (fetchXml !== null) {
    const serializer = new DOMParser();
    const fetchXmlDocument = serializer.parseFromString(fetchXml, 'text/xml');
    if (fetchXmlDocument.documentElement.tagName === 'parsererror') {
      result.error = {
        code: '0x80040201',
        message: 'Invalid XML.'
      };
      return true;
    }
    const entity = fetchXmlDocument.evaluate('fetch/entity', fetchXmlDocument, null, XPathResult.ANY_TYPE, null).iterateNext();
    if (fetchXmlDocument.documentElement.children.length != 1 || !entity || !entity.getAttribute('name')) {
      result.error = {
        code: '0x80041102',
        message: 'Entity Name was not specified in FetchXml String.'
      };
      return true;
    }
    const invalidAttribute = fetchXmlDocument.evaluate('fetch/entity/*[not(self::filter or self::order or self::link-entity or self::attribute or self::all-attributes or self::no-attrs)]', fetchXmlDocument, null, XPathResult.ANY_TYPE, null).iterateNext();
    if (invalidAttribute) {
      result.error = {
        code: '0x8004111c',
        message: `Invalid Child Node, valid nodes are filter, order, link-entity, attribute, all-attributes, no-attrs. NodeName = ${invalidAttribute.tagName} NodeXml = ${invalidAttribute.outerHTML}`
      };
      return true;
    }
    result.fetchXml = fetchXmlDocument;
  }
  return false;
};
exports.getFetchXmlFromParser = getFetchXmlFromParser;