type ConfigUiHintTags = {
    tags?: string[];
};
/** Config UI hint tag for URL-like values that may embed credentials or tokens. */
export declare const SENSITIVE_URL_HINT_TAG = "url-secret";
/** True for auth-like URL query parameter names that should be redacted. */
export declare function isSensitiveUrlQueryParamName(name: string): boolean;
/** True for config paths whose URL values may contain credentials or secret query params. */
export declare function isSensitiveUrlConfigPath(path: string): boolean;
/** True when a config UI hint explicitly marks a URL-like value as secret-bearing. */
export declare function hasSensitiveUrlHintTag(hint: ConfigUiHintTags | undefined): boolean;
/** Redacts credentials and sensitive query params from parseable URLs. */
export declare function redactSensitiveUrl(value: string): string;
/** Redacts sensitive URL-looking substrings even when the full value is not a valid URL. */
export declare function redactSensitiveUrlLikeString(value: string): string;
export {};
