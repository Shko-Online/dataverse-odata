import type { ODataQuery, ODataFilter } from './OData.types';
import { atMostOnce } from './validators/atMostOnce';

const option = '$filter';

/**
 * Parses the {@link ODataFilter.$filter $filter} query
 * @returns {boolean} Returns `false` when the parse has an error
 */
export const getFilterFromParser = (parser: URLSearchParams, result: ODataQuery): boolean => {
    const value = parser.getAll(option);
    if (value.length === 0) {
        return true;
    }
    if (!atMostOnce(option, value, result)) {
        return false;
    }
    if (value.length > 0) {
        
        result.$filter = {operator: 'eq', left: '', right: ''};
    }
    return true;
};
