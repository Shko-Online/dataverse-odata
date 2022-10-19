import { ODataQuery } from '@albanian-xrm/dataverse-odata/OData.types';
import { getTopFromParser } from '@albanian-xrm/dataverse-odata/getTopFromParser';
import { getSelectFromParser } from '@albanian-xrm/dataverse-odata/getSelectFromParser';
import { getExpandFromParser } from '@albanian-xrm/dataverse-odata/getExpandFromParser';

export const parseOData = (query: string) => {
    const parser = new URLSearchParams(query);
    const result = {} as ODataQuery;
    if (getExpandFromParser(parser, result)) {
        return result;
    }
    if (getSelectFromParser(parser, result)) {
        return result;
    }
    if (getTopFromParser(parser, result)) {
        return result;
    }
    return result;
}

