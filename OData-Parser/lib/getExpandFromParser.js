import { getSelectFromParser } from './getSelectFromParser';
/**
 * Parses the $expand query
 * @returns Returns true when the parse has an error
 */
export var getExpandFromParser = function (parser, result) {
    var $expand = parser.get('$expand');
    if ($expand !== null) {
        result.$expand = {};
        if (extractExpand($expand, result)) {
            return true;
        }
    }
    return false;
};
var extractExpand = function (value, $expand) {
    var match = value.match(/^\s*(\w(\w|\d|_)*)\s*(,|\()?\s*/);
    if (match === null ||
        (match[0].length < value.length && match[3] === null) ||
        (match[0].length === value.length && match[3] !== undefined)) {
        $expand.error = {
            code: '0x0',
            message: 'invalid expand expression',
        };
        return true;
    }
    var matchSeparator = match[3];
    var matchLength = match[0].length;
    if (matchSeparator !== '(') {
        if ($expand.$expand !== undefined) {
            $expand.$expand[match[1]] = { $select: [] };
        }
    }
    else {
        var _a = getClosingBracket(value.substring(matchLength)), index = _a.index, error = _a.error;
        if (error) {
            $expand.error = {
                code: '0x0',
                message: error,
            };
            return true;
        }
        if ($expand.$expand !== undefined) {
            var innerExpand = {};
            var parser = new URLSearchParams('?' + value.substring(matchLength, matchLength + index));
            if (getSelectFromParser(parser, innerExpand)) {
                $expand.error = innerExpand.error;
                return true;
            }
            if (getExpandFromParser(parser, innerExpand)) {
                $expand.error = innerExpand.error;
                return true;
            }
            if (innerExpand.$expand === undefined && innerExpand.$select === undefined) {
                $expand.error = { code: '0x0', message: 'Empty expand' };
                return true;
            }
            $expand.$expand[match[1]] = innerExpand;
        }
        matchLength = matchLength + index;
        var secondMatch = value.substring(matchLength + 1).match(/\s*(,?)\s*d/);
        if (secondMatch !== null) {
            matchLength = matchLength + secondMatch[0].length;
            if (secondMatch[1] !== null) {
                matchSeparator = ',';
            }
        }
    }
    if (matchSeparator === ',') {
        if (extractExpand(value.substring(matchLength), $expand)) {
            return true;
        }
    }
    return false;
};
var getClosingBracket = function (value) {
    var depth = 1;
    var startAt = 0;
    while (depth > 0) {
        var match = value.substring(startAt).match(/\(|\)/);
        if (match === null) {
            return { error: 'no closing bracket found', index: -1 };
        }
        if (match[0] === ')') {
            depth -= 1;
            if (depth === 0) {
                return { index: match.index || 0 };
            }
        }
        else {
            depth += 1;
        }
        startAt = (match.index || 0) + 1;
    }
    return { error: 'no closing bracket found', index: -1 };
};
//# sourceMappingURL=getExpandFromParser.js.map