import type { ODataQuery, ODataTop } from './OData.types';
import { atMostOnce } from './validators/atMostOnce';
import { hasContent } from './validators/hasContent';

const option = '$top';

/**
 * Parses the {@link ODataTop.$top $top} query
 * @returns Returns `false` when the parse has an error
 */
export const getTopFromParser = (parser: URLSearchParams, result: ODataQuery): boolean => {
    const value = parser.getAll(option);
    if (value.length === 0) {
        return true;
    }
    if (!atMostOnce(option, value, result) || !hasContent(option, value, result)) {
        return false;
    }
    let $top: number;
    if (!value[0].match(/^\d+$/) || ($top = parseInt(value[0])) < 0) {
        result.error = {
            code: '0x0',
            message: `Invalid value '${value}' for $top query option found. The $top query option requires a non-negative integer value.`,
        };
        return false;
    } else if ($top === 0) {
        result.error = {
            code: '0x0',
            message: `Invalid value for $top query option.`,
        };
        return false;
    }
    result.$top = $top;
    return true;
};
