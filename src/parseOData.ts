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
        result.$top = parseInt($top);
    }
    return result;
}

