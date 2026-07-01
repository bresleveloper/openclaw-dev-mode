type EnsureAuthProfileStore = typeof import("./auth-profiles/store.js").ensureAuthProfileStore;
/** Ensure an auth-profile store using the production store implementation. */
export declare function ensureAuthProfileStore(...args: Parameters<EnsureAuthProfileStore>): ReturnType<EnsureAuthProfileStore>;
export {};
