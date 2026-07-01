/** Move legacy Firecrawl web-fetch config into plugins.entries.firecrawl.config.webFetch. */
export declare function migrateLegacyWebFetchConfig<T>(raw: T): {
    config: T;
    changes: string[];
};
