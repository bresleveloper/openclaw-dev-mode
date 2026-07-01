/** Import a module by URL relative to another module, preserving query-string cache busting. */
export declare function importFreshModule<TModule>(from: string, specifier: string): Promise<TModule>;
