/** List legacy tools.web.search provider config paths present in raw config. */
export declare function listLegacyWebSearchConfigPaths(raw: unknown): string[];
/** Move legacy web-search provider config into provider plugin entries. */
export declare function migrateLegacyWebSearchConfig<T>(raw: T): {
    config: T;
    changes: string[];
};
