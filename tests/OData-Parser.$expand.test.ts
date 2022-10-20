import { describe, expect, test } from '@jest/globals';
import { parseOData } from '@albanian-xrm/dataverse-odata/parseOData';

describe('parseOData $expand', () => {
    test('parse $expand Account_Leads', () => {
        const result = parseOData('?$expand=Account_Leads');
        expect(result.error).toBeUndefined();
        expect(result.$expand).not.toBeNull();
        expect(result.$expand).not.toBeUndefined();
        expect(result.$expand?.Account_Leads.$select).toEqual([]);
    })

    test('parse $expand Account_Leads and business_unit_accounts', () => {
        const result = parseOData('?$expand=Account_Leads,business_unit_accounts');
        expect(result.error).toBeUndefined();
        expect(result.$expand).not.toBeNull();
        expect(result.$expand).not.toBeUndefined();
        expect(result.$expand?.Account_Leads.$select).toEqual([]);
        expect(result.$expand?.business_unit_accounts.$select).toEqual([]);
    })

    test('parse $expand throws on Account_Leads without details', () => {
        const result = parseOData('?$expand=Account_Leads()');
        expect(result.error).not.toBeUndefined();
        expect(result.error?.message).toEqual('Empty expand');
    })

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
    })
})