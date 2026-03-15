import { describe, expect, test } from '@jest/globals';
import { parseOData } from '../src';

describe('parseOData $select', () => {
    test('parse single column', () => {
        const result = parseOData(
            '?$select=title',
        );
        expect(result.$select).toContain(
           "title"
        );
    });

    test('parse multiple columns', () => {
        const result = parseOData(
            '?$select=title,description',
        );
        expect(result.$select).toContain(
           "title"
        );
        expect(result.$select).toContain(
           "description"
        );
    });
});
