import type { ODataQuery } from '../OData.types';

/**
 * Options of this type must be specified at most once.
 * @param option The option being validated (ex. $top)
 * @param value The result of {@link URLSearchParams.getAll getAll}
 * @param result The {@link ODataQuery} to append the error to
 * @returns {boolean} Returns `false` when the parse has an error
 */
export const atMostOnce = (option: string, value: string[], result: ODataQuery) => {
    if (value.length > 1) {
        result.error = {
            code: '0x0',
            message: `Query option '${option}' was specified more than once, but it must be specified at most once.`,
        };
        return false;
    }
    return true;
};
