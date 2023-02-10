/**
 * Parses the $select query
 * @returns Returns true when the parse has an error
 */
export const getSelectFromParser = (parser, result) => {
  const $select = parser.get('$select');
  if ($select !== null) {
    result.$select = $select.split(',');
  }
  return false;
};