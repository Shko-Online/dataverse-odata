import type { ODataQuery } from './OData.types';

/**
 * Parses the $select query
 * @returns Returns true when the parse has an error
 */
export const getSelectFromParser = (parser: URLSearchParams, result: ODataQuery): boolean => {
    const $select = parser.get('$select');
    if ($select !== null) {
        result.$select = $select.split(',');
    }
    return false;
};
