type ShouldSuppressBuiltInModel = typeof import("./model-suppression.js").shouldSuppressBuiltInModel;
type BuildShouldSuppressBuiltInModel = typeof import("./model-suppression.js").buildShouldSuppressBuiltInModel;
/** Runtime-forwarded predicate for hiding bundled models. */
export declare function shouldSuppressBuiltInModel(...args: Parameters<ShouldSuppressBuiltInModel>): ReturnType<ShouldSuppressBuiltInModel>;
/** Build a provider-aware predicate for hiding bundled models. */
export declare function buildShouldSuppressBuiltInModel(...args: Parameters<BuildShouldSuppressBuiltInModel>): ReturnType<BuildShouldSuppressBuiltInModel>;
export {};
