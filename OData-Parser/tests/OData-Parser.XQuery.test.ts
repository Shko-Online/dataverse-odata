import { describe, expect, test } from '@jest/globals';
import { parseOData } from '../src';

describe('parseOData XQuery', () => {
    test('parse savedQuery', () => {
        const result = parseOData('?savedQuery=00000000-0000-0000-00aa-000010001002');
        expect(result).toEqual({
            savedQuery: '00000000-0000-0000-00aa-000010001002'
        });
    });

    test('parse savedQuery validation', () => {
        const result = parseOData('?savedQuery=a');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x0');
        expect(result.error?.message).toEqual('Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).');
    });

    test('parse userQuery', () => {
        const result = parseOData('?userQuery=121c6fd8-1975-e511-80d4-00155d2a68d1');
        expect(result).toEqual({
            userQuery: '121c6fd8-1975-e511-80d4-00155d2a68d1'
        });
    });

    test('parse userQuery validation', () => {
        const result = parseOData('?userQuery=a');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x0');
        expect(result.error?.message).toEqual('Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).');
    });
});
