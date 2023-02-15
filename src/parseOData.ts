import type { ODataQuery } from './OData.types';

import { getTopFromParser } from './getTopFromParser';
import { getSelectFromParser } from './getSelectFromParser';
import { getExpandFromParser } from './getExpandFromParser';
import { getFetchXmlFromParser } from './getFetchXmlFromParser';
import { getXQueryFromParser } from './getXQueryFromParser';
import { getOrderByFromParser } from './getOrderByFromParser';

/**
 * parses the OData query and applies some Dataverse validations
 * @param query The OData query
 * @returns The parsed OData query
 */
export const parseOData = (query: string) => {
    const parser = new URLSearchParams(query);
    const result = {} as ODataQuery;

    getExpandFromParser(parser, result) &&
        getSelectFromParser(parser, result) &&
        getTopFromParser(parser, result) &&
        getFetchXmlFromParser(parser, result) &&
        getXQueryFromParser('savedQuery', parser, result) &&
        getXQueryFromParser('userQuery', parser, result) &&
        getOrderByFromParser(parser, result);

    return result;
};
