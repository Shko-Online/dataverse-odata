import type { ODataQuery } from '../OData.types';

/**
 * Options of this type must be specified at most once.
 * @param option The option being validated (ex. $top)
 * @param value The result of {@link URLSearchParams.getAll getAll}
 * @param result The {@link ODataQuery} to append the error to
 * @returns {boolean} Returns `false` when the parse has an error
 */
export const hasContent = (query: string, value: string[], result: ODataQuery) => {
    if (!value[0].trim()) {
        result.error = {
            code: '0x0',
            message: `The value for OData query '${query}' cannot be empty.`,
        };
        return false;
    }
    return true;
};
