import type { ODataQuery } from '../OData.types';

/**
 * 
 * @param value The result of {@link URLSearchParams.getAll getAll}
 * @param result The {@link ODataQuery} to append the error to
 * @returns {boolean} Returns `false` when the parse has an error
 */
export const recognizedGuid = (value: string[], result: ODataQuery) => {
    if (!value[0].trim()) {
        result.error = {
            code: '0x0',
            message: 'Unrecognized Guid format.',
        };
        return false;
    }
    return true;
};
