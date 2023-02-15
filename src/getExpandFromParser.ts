import type { ODataError, ODataExpand, ODataExpandQuery, ODataQuery } from './OData.types';

import { getSelectFromParser } from './getSelectFromParser';
import { atMostOnce } from './validators/atMostOnce';

const option = '$expand';

/**
 * Parses the {@link ODataExpand.$expand $expand} query
 * @returns Returns `false` when the parse has an error
 */
export const getExpandFromParser = (parser: URLSearchParams, result: ODataQuery): boolean => {
    const value = parser.getAll(option);
    if (value.length === 0) {
        return true;
    }
    if (!atMostOnce(option, value, result)) {
        return false;
    }

    result.$expand = {};
    if (!extractExpand(value[0], result)) {
        return false;
    }

    return true;
};

const extractExpand = (value: string, $expand: ODataExpand & ODataError) => {
    const match = value.match(/^\s*(\w(\w|\d|_)*)\s*(,|\(|\))?\s*/);
    if (
        match === null ||
        (match[0].length < value.length && match[3] === null) ||
        (match[0].length === value.length && match[3] !== undefined)
    ) {
        $expand.error = {
            code: '0x0',
            message: `Term '${value}' is not valid in a $select or $expand expression.`,
        };
        return false;
    }
    let matchSeparator = match[3];
    let matchLength = match[0].length;
    if (matchSeparator !== '(') {
        if ($expand.$expand !== undefined) {
            $expand.$expand[match[1]] = { $select: [] };
        }
    } else {
        const { index, error } = getClosingBracket(value.substring(matchLength));
        if (error) {
            $expand.error = {
                code: '0x0',
                message: error,
            };
            return false;
        }

        if ($expand.$expand !== undefined) {
            const innerExpand = {} as ODataExpandQuery & ODataError;
            const parser = new URLSearchParams('?' + value.substring(matchLength, matchLength + index));
            if (!getSelectFromParser(parser, innerExpand)) {
                $expand.error = innerExpand.error;
                return false;
            }
            if (!getExpandFromParser(parser, innerExpand)) {
                $expand.error = innerExpand.error;
                return false;
            }
            if (innerExpand.$expand === undefined && innerExpand.$select === undefined) {
                $expand.error = {
                    code: '0x0',
                    message: `Missing expand option on navigation property '${match[1]}'. If a parenthesis expression follows an expanded navigation property, then at least one expand option must be provided.`,
                };
                return false;
            }
            $expand.$expand[match[1]] = innerExpand;
        }

        matchLength = matchLength + index;
        const secondMatch = value.substring(matchLength + 1).match(/\s*(,?)\s*d/);
        if (secondMatch !== null) {
            matchLength = matchLength + secondMatch[0].length;
            if (secondMatch[1] !== null) {
                matchSeparator = ',';
            }
        }
    }

    if (matchSeparator === ',') {
        if (!extractExpand(value.substring(matchLength), $expand)) {
            return false;
        }
    }

    return true;
};

const getClosingBracket = (value: string): { index: number; error?: string } => {
    let depth = 1;
    let startAt = 0;
    while (depth > 0) {
        const match = value.substring(startAt).match(/\(|\)/);
        if (match === null) {
            return { error: 'Found an unbalanced bracket expression.', index: -1 };
        }
        if (match[0] === ')') {
            depth -= 1;
            if (depth === 0) {
                return { index: match.index || 0 };
            }
        } else {
            depth += 1;
        }
        startAt += (match.index || 0) + 1;
    }
    return { error: 'Found an unbalanced bracket expression.', index: -1 };
};
