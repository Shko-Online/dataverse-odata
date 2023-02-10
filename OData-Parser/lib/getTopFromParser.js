/**
 * Parses the $top query
 * @returns Returns true when the parse has an error
 */
export var getTopFromParser = function (parser, result) {
    var $topValue = parser.get('$top');
    if ($topValue !== null) {
        var $top = void 0;
        if (!$topValue.match(/^\d+$/) || ($top = parseInt($topValue)) < 0) {
            result.error = {
                code: '0x0',
                message: "Invalid value '".concat($topValue, "' for $top query option found. The $top query option requires a non-negative integer value."),
            };
            return true;
        }
        else if ($top === 0) {
            result.error = {
                code: '0x0',
                message: "Invalid value for $top query option.",
            };
            return true;
        }
        result.$top = $top;
    }
    return false;
};
//# sourceMappingURL=getTopFromParser.js.map