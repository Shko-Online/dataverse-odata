import { describe, expect, test } from '@jest/globals';
import { parseOData } from '@albanian-xrm/dataverse-odata/parseOData';

describe('parse odata', () => {
    test('parse $top', () => {
        const result = parseOData('?$top=5');     
        expect(result.$top).toEqual(5);
    })

    test('parse $select', () => {
        const result =  parseOData('?$select=name,numberofemployees$top=5');           
        expect(result.$select).not.toBeNull();
        expect(result.$select).toContain('name');
    })

    test('$select and $expand', () => {
        const result = parseOData('?$select2=name,numberofemployees&$expand=Account_Leads($select=name)');
        expect(result.$select).not.toBeNull();
        expect(result.$expand).not.toBeNull();
    })
})