import type { ODataQuery, ODataSavedQuery, ODataUserQuery } from './OData.types';

const guidRegex = /[0-9A-F]{8}\-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/gi;

/**
 * Parses the {@link ODataSavedQuery.savedQuery savedQuery} or
 * {@link ODataUserQuery.userQuery userQuery} query
 * @returns Returns `false` when the parse has an error
 */
export const getXQueryFromParser = (
    X: 'savedQuery' | 'userQuery',
    parser: URLSearchParams,
    result: ODataQuery,
): boolean => {
    const xQuery = parser.get(X);
    if (xQuery !== null) {
        if (!xQuery.trim()) {
            result.error = {
                code: '0x0',
                message: 'Unrecognized Guid format.',
            };
            return false;
        }
        if (!xQuery.match(guidRegex)) {
            result.error = {
                code: '0x0',
                message: 'Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).',
            };
            return false;
        }
        result[X] = xQuery;
    }
    return true;
};
