import { describe, expect, test } from '@jest/globals';
import { parseOData } from '../src';

describe('parseOData $orderby', () => {
    test('should be specified at most once', () => {
        const result = parseOData('?$orderby=firstname&$orderby=lastname');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x0');
        expect(result.error?.message).toEqual(
            `Query option '$orderby' was specified more than once, but it must be specified at most once.`,
        );
    });

    test('should throw syntax error when more parameters are provided', () => {
        const result = parseOData('?$orderby= @p1 desc desc asc,@p2 desc');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x80060888');
        expect(result.error?.message).toEqual(`Syntax error at position 14 in ' @p1 desc desc asc,@p2 desc'.`);
    });

    test('should throw syntax error when the syntax is invalid', () => {
        const result = parseOData('?$orderby=*pp1 desc, lastname asc');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x80060888');
        expect(result.error?.message).toEqual(`Syntax error at position 4 in '*pp1 desc, lastname asc'.`);
    });

    test('should throw when parameter alias is not specified', () => {
        const result = parseOData('?$orderby=@p1 desc, lastname asc');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x80060888');
        expect(result.error?.message).toEqual(`Order By Property must be of type EdmProperty`);
    });

    test('should throw when parameter alias syntax is invalid', () => {
        const result = parseOData('?$orderby=@p1 desc, lastname asc&@p1=*name');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x80060888');
        expect(result.error?.message).toEqual(`Syntax error at position 5 in '*name'.`);
    });

    test('should throw when parameter alias is not specified recursively', () => {
        const result = parseOData('?$orderby=@p1 desc, lastname asc&@p1=@p2');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x80060888');
        expect(result.error?.message).toEqual(`Order By Property must be of type EdmProperty`);
    });

    test('should throw when parameter alias syntax is invalid recursively', () => {
        const result = parseOData('?$orderby=@p1 desc, lastname asc&@p1=@p2&@p2=*name');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x80060888');
        expect(result.error?.message).toEqual(`Syntax error at position 5 in '*name'.`);
    });

    test('should parse valid $orderby query with default ascending order', () => {
        const result = parseOData('?$orderby=firstname,lastname');
        expect(result.error).toBeUndefined();
        expect(result.$orderby).toEqual([
            { column: 'firstname', asc: true },
            { column: 'lastname', asc: true },
        ]);
    });

    test('should parse valid $orderby query with specified ascending and descending order', () => {
        const result = parseOData('?$orderby=firstname desc,lastname asc');
        expect(result.error).toBeUndefined();
        expect(result.$orderby).toEqual([
            { column: 'firstname', asc: false },
            { column: 'lastname', asc: true },
        ]);
    });

    test('should parse valid $orderby query with parameter alias', () => {
        const result = parseOData('?$orderby=@p1 desc,lastname asc&@p1=firstname');
        expect(result.error).toBeUndefined();
        expect(result.$orderby).toEqual([
            { column: 'firstname', asc: false },
            { column: 'lastname', asc: true },
        ]);
    });

    test('should parse valid $orderby query with parameter alias recursively', () => {
        const result = parseOData('?$orderby=@p1 desc,lastname asc&@p1=@p2&@p2=firstname');
        expect(result.error).toBeUndefined();
        expect(result.$orderby).toEqual([
            { column: 'firstname', asc: false },
            { column: 'lastname', asc: true },
        ]); 
    });
});
