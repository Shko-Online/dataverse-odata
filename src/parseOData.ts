import { ODataQuery } from './OData.types';

export const parseOData = (query: string) => {
    const parser = new URLSearchParams(query);
    const result = {} as ODataQuery;
    const $select = parser.get('$select');
    if ($select !== null) {
        result.$select = $select.split(',');
    }
    const $expand = parser.get('$expand');
    if ($expand !== null) {
        result.$expand = { toDo: $expand };
    }
    const $top = parser.get('$top');
    if ($top !== null) {
        if (!$top.match(/^\d+$/) || parseInt($top) <= 0) {
            result.error = {
                code: '0x0',
                message: `Invalid value '${$top}' for $top query option found. The $top query option requires a non-negative integer value.`
            }
            return result;
        }
        result.$top = parseInt($top);
    }
    return result;
}

