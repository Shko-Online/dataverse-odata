import type { ODataQuery } from '../OData.types';

/**
 * 
 * @param value The result of {@link URLSearchParams.getAll getAll}
 * @param result The {@link ODataQuery} to append the error to
 * @returns {boolean} Returns `false` when the parse has an error
 */
export const differentFromEmptyString = (value: string[], result: ODataQuery) => {
    if (value[0] === '') {
        result.error = {
            code: '0x80040203',
            message: 'Expected non-empty string.',
        };
        return false;
    }
    return true;
};
