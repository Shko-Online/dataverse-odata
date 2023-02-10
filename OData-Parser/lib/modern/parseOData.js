import { getTopFromParser } from './getTopFromParser';
import { getSelectFromParser } from './getSelectFromParser';
import { getExpandFromParser } from './getExpandFromParser';
import { getFetchXmlFromParser } from './getFetchXmlFromParser';
export const parseOData = query => {
  const parser = new URLSearchParams(query);
  const result = {};
  if (getExpandFromParser(parser, result)) {
    return result;
  }
  if (getSelectFromParser(parser, result)) {
    return result;
  }
  if (getTopFromParser(parser, result)) {
    return result;
  }
  if (getFetchXmlFromParser(parser, result)) {
    return result;
  }
  return result;
};