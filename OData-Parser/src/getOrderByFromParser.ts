import type { ODataQuery, ODataOrderBy } from './OData.types';
import { atMostOnce } from './validators/atMostOnce';
import { hasContent } from './validators/hasContent';

const option = '$orderby';
const edmProperty = /\w{1-255}/gi;

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
    const orderByArray: ODataOrderBy['$orderby'] = [];
    for (let i = 0; i < $orderby.length; i++) {
        if (false /* syntax error */) {
            result.error = {
                code: '0x0',
                message: `Syntax error at position ${i} in '${$orderby}'.`,
            };

            return false;
        }
    }

    orderByArray.forEach((orderBy) => {
        if (!orderBy.column?.match(edmProperty)) {
            result.error = {
                code: '0x80060888',
                message: 'Order By Property must be of type EdmProperty',
            };
            return false;
        }
    });

    result.$orderby = orderByArray;

    return true;
};
