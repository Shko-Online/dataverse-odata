import type { ODataQuery, ODataSavedQuery, ODataUserQuery } from './OData.types';
import { isGuid } from './validators/isGuid';
import { recognizedGuid } from './validators/recognizedGuid';

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
    const value = parser.getAll(X);
    if (value.length === 0) {
        return true;
    }
    if (!recognizedGuid(value, result) || !isGuid(value, result)) {
        return false;
    }

    result[X] = value[0];
    return true;
};
