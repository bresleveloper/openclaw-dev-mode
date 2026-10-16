import { t as CONFIG_DIR } from "../utils-DhaCU8ER.js";
import { n as formatCliCommand, r as detectBinary, t as formatDocsLink } from "../links-BkD3xQjr.js";
import { s as extractArchive } from "../archive-DSpJVZFx.js";
//#region src/infra/brew.d.ts
type BrewResolutionOptions = {
  homeDir?: string;
  /**
   * @deprecated No-op compatibility field for plugin SDK callers. Homebrew
   * env vars are ignored for resolution because workspace env can be untrusted.
   */
  env?: NodeJS.ProcessEnv;
};
/** Resolves an executable `brew` path from trusted PATH entries or standard install roots. */
export declare function resolveBrewExecutable(opts?: BrewResolutionOptions): string | undefined;
//#endregion
export { CONFIG_DIR, detectBinary, extractArchive, formatCliCommand, formatDocsLink };