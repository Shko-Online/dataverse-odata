import type { ODataQuery, ODataSelect } from './OData.types';

/**
 * Parses the {@link ODataSelect.$select $select} query
 * @returns Returns `false` when the parse has an error
 */
export const getSelectFromParser = (parser: URLSearchParams, result: ODataQuery): boolean => {
    const $select = parser.get('$select');
    if ($select !== null) {
        result.$select = $select.split(',');
    }
    return true;
};
