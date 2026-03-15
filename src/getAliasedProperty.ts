import { ODataQuery } from "./OData.types";

/**
 * Recursively gets the value of an aliased property. For example, if the query is `$orderby=@p1` and `@p1=name`, this function will return `name`
 * @param parser The URLSearchParams object containing the query parameters
 * @param result Will contain the error details in case there is any
 * @param property The property to expand
 * @returns The expanded property or null when there is an error
 */
export const getAliasedProperty = (parser: URLSearchParams, result: ODataQuery, property: string): string => {
    let propertyName = parser.get(property);
    if (!propertyName) {
        result.error = {
            code: '0x80060888',
            message: 'Order By Property must be of type EdmProperty',
        };

        return null;
    }

    if (!/^[@a-zA-Z]\w+/gi.test(propertyName)) {
        const position = propertyName.length;
        result.error = {
            code: '0x80060888',
            message: `Syntax error at position ${position} in '${propertyName}'.`,
        };
        return null;
    }

    if (propertyName.startsWith('@')) {
        return getAliasedProperty(parser, result, propertyName);
    }
    return propertyName;
};
