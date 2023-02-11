import type { ODataQuery } from './OData.types';

export const validateNotEmpty = (query: string, value: string, result: ODataQuery) => {
    if (!value.trim()) {
        result.error = {
            code: '0x0',
            message: `The value for OData query '${query}' cannot be empty.`,
        };
        return false;
    }
    return true;
};
