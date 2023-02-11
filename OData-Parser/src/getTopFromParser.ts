import type { ODataQuery, ODataTop } from './OData.types';
import { validateNotEmpty } from './validateNotEmpty';

/**
 * Parses the {@link ODataTop.$top $top} query
 * @returns Returns `false` when the parse has an error
 */
export const getTopFromParser = (parser: URLSearchParams, result: ODataQuery): boolean => {
    const $topValue = parser.get('$top');
    if ($topValue !== null) {
        if (!validateNotEmpty('$orderby', $topValue, result)) {
            return false;
        }
        let $top: number;
        if (!$topValue.match(/^\d+$/) || ($top = parseInt($topValue)) < 0) {
            result.error = {
                code: '0x0',
                message: `Invalid value '${$topValue}' for $top query option found. The $top query option requires a non-negative integer value.`,
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
    }
    return true;
};
