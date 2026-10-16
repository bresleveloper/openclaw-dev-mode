import { pathExists } from "@openclaw/fs-safe/advanced";
//#region src/utils.d.ts
/** Normalizes phone-like input into the loose E.164 shape used by channel helpers. */
declare function normalizeE164(number: string): string;
declare let CONFIG_DIR: string;
//#endregion
export { normalizeE164 as n, pathExists as r, CONFIG_DIR as t };