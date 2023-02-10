"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelectFromParser = void 0;
/**
 * Parses the $select query
 * @returns Returns true when the parse has an error
 */
const getSelectFromParser = (parser, result) => {
  const $select = parser.get('$select');
  if ($select !== null) {
    result.$select = $select.split(',');
  }
  return false;
};
exports.getSelectFromParser = getSelectFromParser;