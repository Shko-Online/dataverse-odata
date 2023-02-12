import { describe, expect, test } from '@jest/globals';
import { parseOData } from '../src';

describe('parseOData $orderby', () => {
    test('should be specified at most once', () => {
        const result = parseOData('?$orderby=firstname&$orderby=lastname');
        expect(result.error).not.toBeNull();
        expect(result.error?.code).toEqual('0x0');
        expect(result.error?.message).toEqual(`Query option '$orderby' was specified more than once, but it must be specified at most once.`);
    });
});
