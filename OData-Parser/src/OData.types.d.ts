export interface ODataError {
    error?: {
        code: string;
        message: string;
    };
}

export interface ODataExpand {
    /**
     * Use the {@link ODataExpand.$expand $expand} system query option in the navigation properties
     * to control what data from related entities is returned.
     * There are two types of navigation properties:
     * * Single-valued navigation properties correspond to Lookup attributes that support many-to-one
     * relationships and allow setting a reference to another entity.
     * * Collection-valued navigation properties correspond to one-to-many or many-to-many relationships.
     *
     * If you include only the name of the navigation property, you'll receive all the properties for
     * related records. You can limit the properties returned for related records using the
     * {@link ODataSelect.$select $select} system query option in parentheses after the navigation
     * property name. Use this for both single-valued and collection-valued navigation properties.
     *
     * * Microsoft Docs: {@link https://learn.microsoft.com/power-apps/developer/data-platform/webapi/retrieve-related-entities-query?WT.mc_id=DX-MVP-5004767 Retrieve related table records with a query }
     */
    $expand?: {
        [relationship: string]: ODataExpandQuery;
    };
}

export type ODataExpandQuery = ODataSelect & ODataExpand;

export interface ODataFilter {
    /**
     * Use the {@link ODataFilter.$filter $filter} system query option to set criteria for which rows will be returned.
     *
     * * Microsoft Docs: {@link https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query-data-web-api?WT.mc_id=DX-MVP-5004767#filter-results Filter results }
     */
    $filter?: StandardOperator;
}

export interface ODataFetch {
    /**
     * You can compose a FetchXML query for a specific table.
     * Then, URL-encode the XML and pass it to the entity set
     * using the {@link ODataFetch.fetchXml fetchXml} query string parameter.
     *
     * * Microsoft Docs: {@link https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/use-fetchxml-web-api?WT.mc_id=DX-MVP-5004767 Use FetchXml with Web API }
     */
    fetchXml?: XMLDocument;
}

export interface ODataOrderBy {
    /**
     * Specify the order in which items are returned using the {@link ODataOrderBy.$orderby $orderby}
     * system query option. Use the asc or desc suffix to specify ascending or descending order
     * respectively. The default is ascending if the suffix isn't applied.
     *
     * * Microsoft Docs: {@link https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/query-data-web-api?WT.mc_id=DX-MVP-5004767#order-results Order results }
     */
    $orderby?: { column: string; asc: boolean }[];
}

export interface ODataSavedQuery {
    /**
     * You can use the `savedqueryid` value and pass it as the value to the {@link ODataSavedQuery.savedQuery savedQuery}
     * parameter to the entity set that matches the corresponding `returnedtypecode` of the saved query.
     *
     * * Microsoft Docs: {@link https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/retrieve-and-execute-predefined-queries?WT.mc_id=DX-MVP-5004767#predefined-queries Retrieve and execute predefined queries }
     */
    savedQuery?: string;
}

export interface ODataSelect {
    /**
     * Use the {@link ODataSelect.$select $select} system query option to limit the properties returned.
     *
     * This is a performance best practice. If properties aren't specified using
     * {@link ODataSelect.$select $select}, all properties will be returned.
     *
     * * Microsoft Docs: {@link https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query-data-web-api?WT.mc_id=DX-MVP-5004767#request-specific-properties Request specific properties }
     */
    $select?: string[];
}

export interface ODataTop {
    /**
     * You can limit the number of results returned by using the {@link ODataTop.$top $top} system query option.
     *
     * * Microsoft Docs: {@link https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query-data-web-api?WT.mc_id=DX-MVP-5004767#use-top-query-option Use $top query option }
     */
    $top?: number;
}

export interface ODataUserQuery {
    /**
     * You can use the `userqueryid` value and pass it as the value to the {@link OdataUserQuery.userQuery userQuery}
     * parameter to the entity set that matches the corresponding `returnedtypecode` of the user query.
     *
     * * Microsoft Docs: {@link https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/retrieve-and-execute-predefined-queries?WT.mc_id=DX-MVP-5004767#predefined-queries Retrieve and execute predefined queries }
     */
    userQuery?: string;
}

export type StandardOperators = 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le';

export interface StandardOperator {
    operator: StandardOperators;
    /**
     * The left side of the 'X' operator must be a property of the entity.
     */
    left: string;
    /**
     * The right side of the 'X' operator must be a constant value.
     */
    right: string | number;
}

export interface UnaryOperator {
    operator: 'not';
    right: StandardOperator;
}

export interface BinaryOperator {
    operator: 'and' | 'or';
    left: StandardOperator;
    right: StandardOperator;
}

export type ODataQuery = ODataError &
    ODataExpand &
    ODataFetch &
    ODataFilter &
    ODataOrderBy &
    ODataSavedQuery &
    ODataSelect &
    ODataTop &
    ODataUserQuery;
