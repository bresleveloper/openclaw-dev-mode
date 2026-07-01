/** Move legacy X search API key config into plugins.entries.xai.config.webSearch. */
export declare function migrateLegacyXSearchConfig<T>(raw: T): {
    config: T;
    changes: string[];
};
