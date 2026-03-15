import { getAliasedProperty } from './getAliasedProperty';
import type { ODataQuery, ODataOrderBy } from './OData.types';
import { atMostOnce } from './validators/atMostOnce';
import { hasContent } from './validators/hasContent';

const option = '$orderby';

/**
 * Parses the {@link ODataOrderBy.$orderby $orderby} query
 * @returns Returns `false` when the parse has an error
 */
export const getOrderByFromParser = (parser: URLSearchParams, result: ODataQuery): boolean => {
    let value = parser.getAll(option);
    if (value.length === 0) {
        return true;
    }
    if (!atMostOnce(option, value, result) || !hasContent(option, value, result)) {
        return false;
    }
    let $orderby = value[0].trimEnd();
    let $orderbyParts = $orderby.split(',');
    const orderByArray: ODataOrderBy['$orderby'] = [];
    let position = 0;
    for (const element of $orderbyParts) {
        const parts = Array.from(element.matchAll(/\s*(\S+)/gi));

        if (parts.length > 2) {
            position = position + parts[0][0].length + parts[1][0].length + parts[2][0].length;
            result.error = {
                code: '0x80060888',
                message: `Syntax error at position ${position} in '${$orderby}'.`,
            };

            return false;
        }

        if (!/^[@a-zA-Z]\w+/gi.test(parts[0][1])) {
            position = position + parts[0][0].length;
            result.error = {
                code: '0x80060888',
                message: `Syntax error at position ${position} in '${$orderby}'.`,
            };
            return false;
        }

        const orderBy: ODataOrderBy['$orderby'][0] = {
            column: parts[0][1],
            asc: true, // default is ascending
        };

        if (parts[0][1].startsWith('@')) {
            orderBy.column = getAliasedProperty(parser, result, parts[0][1]);
            if (!orderBy.column) {
                return false;
            }
        }

        if (parts.length === 1) {
            orderByArray.push(orderBy);
            continue;
        }

        if (parts[1][1].toLowerCase() === 'asc') {
            orderBy.asc = true;
            orderByArray.push(orderBy);
        } else if (parts[1][1].toLowerCase() === 'desc') {
            orderBy.asc = false;
            orderByArray.push(orderBy);
        } else {
            position = position + parts[0][0].length + parts[1][0].length;
            result.error = {
                code: '0x80060888',
                message: `Syntax error at position ${position} in '${$orderby}'.`,
            };
            return false;
        }
    }

    result.$orderby = orderByArray;

    return true;
};
