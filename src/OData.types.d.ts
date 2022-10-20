export interface ODataError {
    error?: {
        code: string;
        message: string;
    }
}

export interface ODataExpand {
    $expand?: {
        [relationship: string]: ODataExpandQuery;
    };
}

export type ODataExpandQuery = ODataSelect & ODataExpand;

export interface ODataFilter {
    $filter?: StandardOperator
}

export interface ODataSelect {
    /**
     * Attributes to select.
     * Empty array equals to all Attributes. 
     */
    $select?: string[];
}

export interface ODataTop {
    $top?: number;
}

export type StandardOperators = 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le';

export interface StandardOperator {
    operator: StandardOperators,
    /**
     * The left side of the 'X' operator must be a property of the entity.
     */
    left: string,
    /**
     * The right side of the 'X' operator must be a constant value.
     */
    right: string | number
}

export interface UnaryOperator {
    operator: 'not',
    right: StandardOperator
}

export interface BinaryOperator {
    operator: 'and' | 'or';
    left: StandardOperator;
    right: StandardOperator;
}

export type ODataQuery = ODataError & ODataExpand & ODataFilter & ODataSelect & ODataTop;