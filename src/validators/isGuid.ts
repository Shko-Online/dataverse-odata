import type { ODataQuery } from '../OData.types';

const guidRegex = /[0-9A-F]{8}\-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/gi;

/**
 * 
 * @param value The result of {@link URLSearchParams.getAll getAll}
 * @param result The {@link ODataQuery} to append the error to
 * @returns {boolean} Returns `false` when the parse has an error
 */
export const isGuid = (value: string[], result: ODataQuery) => {
    if (!value[0].match(guidRegex)) {
        result.error = {
            code: '0x0',
            message: 'Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).',
        };
        return false;
    }
    return true;
};
