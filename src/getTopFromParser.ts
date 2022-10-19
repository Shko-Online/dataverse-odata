import { ODataQuery } from '@albanian-xrm/dataverse-odata/OData.types';

/**
 * Parses the $top query
 * @returns Returns true when the parse has an error
 */
export const getTopFromParser = (parser: URLSearchParams, result: ODataQuery): boolean => {
    const $topValue = parser.get('$top');
    if ($topValue !== null) {
        let $top;
        if (!$topValue.match(/^\d+$/) || ($top = parseInt($topValue)) < 0) {
            result.error = {
                code: '0x0',
                message: `Invalid value '${$topValue}' for $top query option found. The $top query option requires a non-negative integer value.`
            }
            return true;
        } else if ($top === 0) {
            result.error = {
                code: '0x0',
                message: `Invalid value for $top query option.`
            }
            return true;
        }
        result.$top = $top;
    }
    return false;
}
