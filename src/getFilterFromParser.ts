import type { ODataQuery, FilterOperator } from './OData.types';
import { atMostOnce } from './validators/atMostOnce';
import { hasContent } from './validators/hasContent';

const option = '$filter';

const STANDARD_OPERATORS = ['eq', 'ne', 'gt', 'ge', 'lt', 'le'] as const;
const QUERY_FUNCTION_OPERATORS = ['contains', 'endswith', 'startswith'] as const;

type StandardOp = (typeof STANDARD_OPERATORS)[number];
type QueryFunctionOp = (typeof QUERY_FUNCTION_OPERATORS)[number];

function isStandardOperator(s: string): s is StandardOp {
    return (STANDARD_OPERATORS as readonly string[]).includes(s);
}

function isQueryFunctionOperator(s: string): s is QueryFunctionOp {
    return (QUERY_FUNCTION_OPERATORS as readonly string[]).includes(s);
}

type TokenType = 'lparen' | 'rparen' | 'comma' | 'word' | 'string' | 'number';

interface Token {
    type: TokenType;
    value: string;
}

const GUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

function tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    while (i < input.length) {
        if (/\s/.test(input[i])) {
            i++;
            continue;
        }
        if (input[i] === '(') {
            tokens.push({ type: 'lparen', value: '(' });
            i++;
        } else if (input[i] === ')') {
            tokens.push({ type: 'rparen', value: ')' });
            i++;
        } else if (input[i] === ',') {
            tokens.push({ type: 'comma', value: ',' });
            i++;
        } else if (input[i] === "'") {
            let j = i + 1;
            let str = '';
            while (j < input.length) {
                if (input[j] === "'" && j + 1 < input.length && input[j + 1] === "'") {
                    str += "'";
                    j += 2;
                } else if (input[j] === "'") {
                    break;
                } else {
                    str += input[j];
                    j++;
                }
            }
            tokens.push({ type: 'string', value: str });
            i = j + 1;
        } else if (/[0-9a-fA-F]/.test(input[i]) && GUID_REGEX.test(input.slice(i))) {
            tokens.push({ type: 'string', value: input.slice(i, i + 36) });
            i += 36;
        } else if (/\d/.test(input[i]) || (input[i] === '-' && /\d/.test(input[i + 1] ?? ''))) {
            let j = i;
            if (input[j] === '-') j++;
            while (j < input.length && /[0-9.]/.test(input[j])) j++;
            tokens.push({ type: 'number', value: input.slice(i, j) });
            i = j;
        } else if (/[a-zA-Z_]/.test(input[i])) {
            let j = i;
            while (j < input.length && /\w/.test(input[j])) j++;
            tokens.push({ type: 'word', value: input.slice(i, j) });
            i = j;
        } else {
            i++;
        }
    }
    return tokens;
}

class FilterParser {
    private readonly tokens: Token[];
    private pos = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    private peek(): Token | null {
        return this.tokens[this.pos] ?? null;
    }

    private consume(expected?: string): Token {
        const token = this.tokens[this.pos++];
        const expectedString = expected ? `, expected ${expected}` : '';
        if (!token) throw new Error(`Unexpected end of filter expression${expectedString}`);
        return token;
    }

    private expect(type: TokenType, value?: string): Token {
      const valueString = value ? ` '${value}'` : '';
        const token = this.consume(`${type}${valueString}`);
        if (token.type !== type || (value !== undefined && token.value !== value)) {
            throw new Error(
                `Expected ${type}${valueString} but got ${token.type} '${token.value}'`,
            );
        }
        return token;
    }

    parse(): FilterOperator {
        const expr = this.parseOr();
        if (this.pos < this.tokens.length) {
            throw new Error(`Unexpected token '${this.tokens[this.pos].value}'`);
        }
        return expr;
    }

    private parseOr(): FilterOperator {
        let left = this.parseAnd();
        while (this.peek()?.value === 'or') {
            this.consume();
            const right = this.parseAnd();
            left = { operator: 'or', left, right };
        }
        return left;
    }

    private parseAnd(): FilterOperator {
        let left = this.parseNot();
        while (this.peek()?.value === 'and') {
            this.consume();
            const right = this.parseNot();
            left = { operator: 'and', left, right };
        }
        return left;
    }

    private parseNot(): FilterOperator {
        if (this.peek()?.value === 'not') {
            this.consume();
            const right = this.parseNot();
            return { operator: 'not', right };
        }
        return this.parsePrimary();
    }

    private parsePrimary(): FilterOperator {
        const token = this.peek();
        if (!token) throw new Error('Unexpected end of filter expression');

        if (token.type === 'lparen') {
            this.consume();
            const expr = this.parseOr();
            this.expect('rparen');
            return expr;
        }

        if (token.type === 'word' && isQueryFunctionOperator(token.value.toLowerCase())) {
            const func = this.consume().value.toLowerCase() as QueryFunctionOp;
            this.expect('lparen');
            const left = this.expect('word').value;
            this.expect('comma');
            const right = this.expect('string').value;
            this.expect('rparen');
            return { operator: func, left, right };
        }

        if (token.type === 'word') {
            const left = this.consume().value;
            const opToken = this.consume(`a comparison operator`);
            if (!isStandardOperator(opToken.value.toLowerCase())) {
                throw new Error(`Invalid operator '${opToken.value}'`);
            }
            const operator = opToken.value.toLowerCase() as StandardOp;
            const right = this.consume(`a value or column name`);
            if (right.type === 'string') {
                return { operator, left, right: right.value };
            } else if (right.type === 'number') {
                return { operator, left, right: Number(right.value) };
            } else if (right.type === 'word') {
                // Constant keywords stay as StandardOperator; bare identifiers are column comparisons
                const BOOL_CONSTANTS = ['true', 'false'];
                if (BOOL_CONSTANTS.includes(right.value.toLowerCase())) {
                    return { operator, left, isBooleanOperation: true, right: right.value === 'true' };
                }else if (right.value.toLowerCase() === 'null') {
                    return { operator, left, isNullOperation: true, right: null };
                }
                return { left, operator, isColumnOperation: true, right: right.value };
            } else {
                throw new Error(`Invalid right-hand side value of type '${right.type}' in filter expression`);
            }
        }

        throw new Error(`Unexpected token '${token.value}'`);
    }
}

/**
 * Parses the {@link ODataFilter.$filter $filter} query
 * @returns {boolean} Returns `false` when the parse has an error
 */
export const getFilterFromParser = (parser: URLSearchParams, result: ODataQuery): boolean => {
    const value = parser.getAll(option);
    if (value.length === 0) {
        return true;
    }
    if (!atMostOnce(option, value, result) || !hasContent(option, value, result)) {
        return false;
    }
    try {
        const tokens = tokenize(value[0]);
        const p = new FilterParser(tokens);
        result.$filter = p.parse();
    } catch (e) {
        result.error = {
            code: '0x80060888',
            message: `Syntax error in '$filter': ${(e as Error).message}`,
        };
        return false;
    }
    return true;
};
