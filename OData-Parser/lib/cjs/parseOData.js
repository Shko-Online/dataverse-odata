"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseOData = void 0;
var _getTopFromParser = require("./getTopFromParser");
var _getSelectFromParser = require("./getSelectFromParser");
var _getExpandFromParser = require("./getExpandFromParser");
var _getFetchXmlFromParser = require("./getFetchXmlFromParser");
const parseOData = query => {
  const parser = new URLSearchParams(query);
  const result = {};
  if ((0, _getExpandFromParser.getExpandFromParser)(parser, result)) {
    return result;
  }
  if ((0, _getSelectFromParser.getSelectFromParser)(parser, result)) {
    return result;
  }
  if ((0, _getTopFromParser.getTopFromParser)(parser, result)) {
    return result;
  }
  if ((0, _getFetchXmlFromParser.getFetchXmlFromParser)(parser, result)) {
    return result;
  }
  return result;
};
exports.parseOData = parseOData;