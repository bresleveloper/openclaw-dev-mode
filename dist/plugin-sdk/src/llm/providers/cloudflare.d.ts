import type { Model } from "../types.js";
export declare function isCloudflareProvider(provider: string): boolean;
/** Substitute `{VAR}` placeholders in a Cloudflare baseUrl from process.env. */
export declare function resolveCloudflareBaseUrl(model: Model): string;
