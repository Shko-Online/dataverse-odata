import { describe, expect, test } from '@jest/globals';
import { parseOData } from '../src';

describe('parseOData fetchXml', () => {
    test('parse fetchXml account', () => {
        const result = parseOData(
            '?fetchXml=%3Cfetch%20mapping%3D%27logical%27%3E%3Centity%20name%3D%27account%27%3E%3Cattribute%20name%3D%27accountid%27%2F%3E%3Cattribute%20name%3D%27name%27%2F%3E%3Cattribute%20name%3D%27accountnumber%27%2F%3E%3C%2Fentity%3E%3C%2Ffetch%3E',
        );
        expect(result.fetchXml?.documentElement.outerHTML).toEqual(
            `<fetch mapping="logical"><entity name="account"><attribute name="accountid"/><attribute name="name"/><attribute name="accountnumber"/></entity></fetch>`,
        );
    });

    test('parse fetchXml fails if invalid XML', () => {
        const result = parseOData('?fetchXml=invalid');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x80040201');
        expect(result.error?.message).toEqual('Invalid XML.');
    });

    test('parse fetchXml fails if EntityName not specified', () => {
        const result = parseOData('?fetchXml=<fetch><entity name=""></entity></fetch>');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x80041102');
        expect(result.error?.message).toEqual('Entity Name was not specified in FetchXml String.');
    });

    test('parse fetchXml fails if EntityName not specified', () => {
        const result = parseOData('?fetchXml=<fetch><entity></entity></fetch>');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x80041102');
        expect(result.error?.message).toEqual('Entity Name was not specified in FetchXml String.');
    });

    test('parse fetchXml fails if EntityName not specified', () => {
        const result = parseOData('?fetchXml=<entity></entity>');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x80041102');
        expect(result.error?.message).toEqual('Entity Name was not specified in FetchXml String.');
    });

    test('parse fetchXml fails if EntityName not specified', () => {
        const result = parseOData('?fetchXml=<fetch></fetch>');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x80041102');
        expect(result.error?.message).toEqual('Entity Name was not specified in FetchXml String.');
    });

    test('parse fetchXml fails if invalid attribute specified', () => {
        const result = parseOData('?fetchXml=<fetch><entity%20name="systemuser"><n%20/></entity></fetch>');
        expect(result.error).not.toBeUndefined();
        expect(result.error?.code).toEqual('0x8004111c');
        expect(result.error?.message).toEqual('Invalid Child Node, valid nodes are filter, order, link-entity, attribute, all-attributes, no-attrs. NodeName = n NodeXml = <n/>');
    });
});
