import type { ODataQuery, ODataSelect } from './OData.types';
import { atMostOnce } from './validators/atMostOnce';

const option = '$select';

/**
 * Parses the {@link ODataSelect.$select $select} query
 * @returns {boolean} Returns `false` when the parse has an error
 */
export const getSelectFromParser = (parser: URLSearchParams, result: ODataQuery): boolean => {
    const value = parser.getAll(option);
    if (value.length === 0) {
        return true;
    }
    if (!atMostOnce(option, value, result)) {
        return false;
    }
    if (value.length > 0) {
        result.$select = value[0].split(',');
    }
    return true;
};
