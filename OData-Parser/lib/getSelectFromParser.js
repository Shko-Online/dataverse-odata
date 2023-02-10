/**
 * Parses the $select query
 * @returns Returns true when the parse has an error
 */
export var getSelectFromParser = function (parser, result) {
    var $select = parser.get('$select');
    if ($select !== null) {
        result.$select = $select.split(',');
    }
    return false;
};
//# sourceMappingURL=getSelectFromParser.js.map