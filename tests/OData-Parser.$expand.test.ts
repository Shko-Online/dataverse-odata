import { describe, expect, test } from '@jest/globals';
import { parseOData } from '../src';

describe('parseOData $expand', () => {
    test('parse $expand Account_Leads', () => {
        const result = parseOData('?$expand=Account_Leads');
        expect(result.error).toBeUndefined();
        expect(result.$expand).not.toBeNull();
        expect(result.$expand).not.toBeUndefined();
        expect(result.$expand?.Account_Leads.$select).toEqual([]);
    });

    test('parse $expand Account_Leads and business_unit_accounts', () => {
        const result = parseOData('?$expand=Account_Leads,business_unit_accounts');
        expect(result.error).toBeUndefined();
        expect(result.$expand).not.toBeNull();
        expect(result.$expand).not.toBeUndefined();
        expect(result.$expand?.Account_Leads.$select).toEqual([]);
        expect(result.$expand?.business_unit_accounts.$select).toEqual([]);
    });

    test('parse $expand Account_Leads with $select', () => {
        const result = parseOData('?$expand=Account_Leads($select=name)');
        expect(result.error).toBeUndefined();
        expect(result.$expand).not.toBeNull();
        expect(result.$expand).not.toBeUndefined();
        expect(result.$expand?.Account_Leads).not.toBeNull();
        expect(result.$expand?.Account_Leads).not.toBeUndefined();
        expect(result.$expand?.Account_Leads.$select).not.toBeNull();
        expect(result.$expand?.Account_Leads.$select).not.toBeUndefined();
        expect(result.$expand?.Account_Leads.$select).toContain('name');
    });

    test('parse $expand throws on Account_Leads without expand options', () => {
        const result = parseOData('?$expand=Account_Leads()');
        expect(result.error).not.toBeUndefined();
        expect(result.error?.code).toEqual('0x0');
        expect(result.error?.message).toEqual(
            `Missing expand option on navigation property 'Account_Leads'. If a parenthesis expression follows an expanded navigation property, then at least one expand option must be provided.`,
        );
    });

    test('parse $expand throws on unbalanced brackets', () => {
        const result = parseOData('?$expand=Account_Leads(,contacts()');
        expect(result.error).not.toBeUndefined();
        expect(result.error?.code).toEqual('0x0');
        expect(result.error?.message).toEqual('Found an unbalanced bracket expression.');
    });

    test('parse $expand throws on invalid expression', () => {
        const result = parseOData('?$expand=Account_Leads)');
        expect(result.error).not.toBeUndefined();
        expect(result.error?.code).toEqual('0x0');
        expect(result.error?.message).toEqual(`Term 'Account_Leads)' is not valid in a $select or $expand expression.`);
    });

    test('should be specified at most once', () => {
        const result = parseOData('?$expand=firstname&$expand=lastname');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x0');
        expect(result.error?.message).toEqual(`Query option '$expand' was specified more than once, but it must be specified at most once.`);
    });
});
