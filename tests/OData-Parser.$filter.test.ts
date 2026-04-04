import { describe, expect, test } from '@jest/globals';
import { parseOData } from '../src';

describe('parseOData $filter', () => {
    test('should be specified at most once', () => {
        const result = parseOData('?$filter=name eq \'Contoso\'&$filter=name eq \'Fabrikam\'');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x0');
        expect(result.error?.message).toEqual(
            `Query option '$filter' was specified more than once, but it must be specified at most once.`,
        );
    });

    test('should error when $filter is empty', () => {
        const result = parseOData('?$filter=');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x0');
        expect(result.error?.message).toEqual(`The value for OData query '$filter' cannot be empty.`);
    });

    describe('Standard comparison operators', () => {
        test('eq operator with string value', () => {
            const result = parseOData("?$filter=name eq 'Contoso'");
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({ operator: 'eq', left: 'name', right: 'Contoso' });
        });

        test('eq operator with integer value', () => {
            const result = parseOData('?$filter=statecode eq 0');
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({ operator: 'eq', left: 'statecode', right: 0 });
        });

        test('eq operator with null value', () => {
            const result = parseOData('?$filter=middlename eq null');
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({ operator: 'eq', left: 'middlename', right: 'null' });
        });

        test('ne operator with string value', () => {
            const result = parseOData("?$filter=name ne 'Contoso'");
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({ operator: 'ne', left: 'name', right: 'Contoso' });
        });

        test('ne operator with integer value', () => {
            const result = parseOData('?$filter=statecode ne 1');
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({ operator: 'ne', left: 'statecode', right: 1 });
        });

        test('gt operator', () => {
            const result = parseOData('?$filter=revenue gt 100000');
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({ operator: 'gt', left: 'revenue', right: 100000 });
        });

        test('ge operator', () => {
            const result = parseOData('?$filter=revenue ge 100000');
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({ operator: 'ge', left: 'revenue', right: 100000 });
        });

        test('lt operator', () => {
            const result = parseOData('?$filter=revenue lt 200000');
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({ operator: 'lt', left: 'revenue', right: 200000 });
        });

        test('le operator', () => {
            const result = parseOData('?$filter=revenue le 200000');
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({ operator: 'le', left: 'revenue', right: 200000 });
        });

        test('eq operator with GUID value', () => {
            const result = parseOData('?$filter=accountid eq 00000000-0000-0000-0000-000000000000');
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({
                operator: 'eq',
                left: 'accountid',
                right: '00000000-0000-0000-0000-000000000000',
            });
        });
    });

    describe('String query functions', () => {
        test('contains function', () => {
            const result = parseOData("?$filter=contains(name,'contoso')");
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({ operator: 'contains', left: 'name', right: 'contoso' });
        });

        test('startswith function', () => {
            const result = parseOData("?$filter=startswith(name,'a')");
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({ operator: 'startswith', left: 'name', right: 'a' });
        });

        test('endswith function', () => {
            const result = parseOData("?$filter=endswith(name,'Inc')");
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({ operator: 'endswith', left: 'name', right: 'Inc' });
        });
    });

    describe('Logical operators', () => {
        test('and operator', () => {
            const result = parseOData("?$filter=contains(name,'contoso') and revenue gt 100000");
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({
                operator: 'and',
                left: { operator: 'contains', left: 'name', right: 'contoso' },
                right: { operator: 'gt', left: 'revenue', right: 100000 },
            });
        });

        test('or operator', () => {
            const result = parseOData("?$filter=contains(name,'contoso') or contains(name,'fabrikam')");
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({
                operator: 'or',
                left: { operator: 'contains', left: 'name', right: 'contoso' },
                right: { operator: 'contains', left: 'name', right: 'fabrikam' },
            });
        });

        test('not operator', () => {
            const result = parseOData("?$filter=not contains(name,'contoso')");
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({
                operator: 'not',
                right: { operator: 'contains', left: 'name', right: 'contoso' },
            });
        });

        test('and has higher precedence than or', () => {
            const result = parseOData("?$filter=statecode eq 0 or statecode eq 1 and name eq 'Contoso'");
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({
                operator: 'or',
                left: { operator: 'eq', left: 'statecode', right: 0 },
                right: {
                    operator: 'and',
                    left: { operator: 'eq', left: 'statecode', right: 1 },
                    right: { operator: 'eq', left: 'name', right: 'Contoso' },
                },
            });
        });
    });

    describe('Column comparison', () => {
        test('column eq comparison', () => {
            const result = parseOData('?$filter=column firstname eq lastname');
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({ column: 'firstname', operator: 'eq', otherColumn: 'lastname' });
        });

        test('column ne comparison', () => {
            const result = parseOData('?$filter=column firstname ne lastname');
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({ column: 'firstname', operator: 'ne', otherColumn: 'lastname' });
        });
    });

    describe('Grouped (parenthesized) expressions', () => {
        test('parenthesized or within and', () => {
            const result = parseOData(
                "?$filter=(contains(name,'contoso') or contains(name,'fabrikam')) and revenue gt 100000",
            );
            expect(result.error).toBeUndefined();
            expect(result.$filter).toEqual({
                operator: 'and',
                left: {
                    operator: 'or',
                    left: { operator: 'contains', left: 'name', right: 'contoso' },
                    right: { operator: 'contains', left: 'name', right: 'fabrikam' },
                },
                right: { operator: 'gt', left: 'revenue', right: 100000 },
            });
        });
    });

    describe('Syntax errors', () => {
        test('should error on invalid filter expression', () => {
            const result = parseOData('?$filter=!!!');
            expect(result.error).not.toBeNull();
            expect(result.error?.code).toEqual('0x80060888');
        });
    });
});
