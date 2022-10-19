import { ODataQuery } from '@albanian-xrm/dataverse-odata/OData.types';

/**
 * Parses the $expand query
 * @returns Returns true when the parse has an error
 */
export const getExpandFromParser = (parser: URLSearchParams, result: ODataQuery): boolean => {
    const $expand = parser.get('$expand');
    if ($expand !== null) {
        const openBrackets = getIndexes($expand, '(');
        const closeBrackets = getIndexes($expand, ')');
        if (openBrackets.length === 0 || openBrackets.length != closeBrackets.length) {
            result.error = {
                code: '0x0',
                message: 'incorrect $expand'
            }
            return true;
        }

        result.$expand = {};
        const name = $expand.substring(0, openBrackets[0]).trim();
        result.$expand[name] = $expand.substring(openBrackets[0] + 1, closeBrackets[0]);
    }
    return false;
}

const getIndexes = (value: string, char: string): number[] => {
    const result = [] as number[];
    let index = value.indexOf(char);
    while (index > -1) {
        result.push(index);
        index = value.indexOf(char, index+1);
    }
    return result;
}
