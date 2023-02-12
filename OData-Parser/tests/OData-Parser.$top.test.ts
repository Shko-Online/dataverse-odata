import { describe, expect, test } from '@jest/globals';
import { parseOData } from '../src';

describe('parseOData $top', () => {
    test('parse $top 5', () => {
        const result = parseOData('?$top=5');
        expect(result).toEqual({ $top: 5 });
    });
    
    test('parse $top errors for empty', () => {
        const result = parseOData('?$top=');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x0');
        expect(result.error?.message).toEqual(
            `The value for OData query '$top' cannot be empty.`,
        );
    });

    test('parse $top errors for 1,0', () => {
        const result = parseOData('?$select=name,numberofemployees&$top=1,0');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x0');
        expect(result.error?.message).toEqual(
            `Invalid value '1,0' for $top query option found. The $top query option requires a non-negative integer value.`,
        );
    });

    test('parse $top errors for negative value', () => {
        const result = parseOData('?$select=name,numberofemployees&$top=-2');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x0');
        expect(result.error?.message).toEqual(
            `Invalid value '-2' for $top query option found. The $top query option requires a non-negative integer value.`,
        );
    });

    test('parse $top errors for 0', () => {
        const result = parseOData('?$select=name,numberofemployees&$top=0');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x0');
        expect(result.error?.message).toEqual(`Invalid value for $top query option.`);
    });

    test('should be specified at most once', () => {
        const result = parseOData('?$top=2&$top=3');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x0');
        expect(result.error?.message).toEqual(`Query option '$top' was specified more than once, but it must be specified at most once.`);
    });
});
