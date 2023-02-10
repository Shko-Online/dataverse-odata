import { describe, expect, test } from '@jest/globals';
import { parseOData } from '../src';

describe('parseOData $top', () => {
    test('parse $top 5', () => {
        const result = parseOData('?$top=5');
        console.log(result);
        expect(result.$top).toEqual(5);
    });

    test('parse $top errors for 1,0', () => {
        const result = parseOData('?$select=name,numberofemployees&$top=1,0');
        expect(result.error).not.toBeNull();
        console.log(result.error);
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
});
