import { t as CONFIG_DIR } from "../utils-B6YNl4JK.js";
import { n as detectBinary, r as formatCliCommand, t as formatDocsLink } from "../links-DFoSOaCI.js";
import { s as extractArchive } from "../archive-CYdLYJm9.js";
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
export { CONFIG_DIR, detectBinary, extractArchive, formatCliCommand, formatDocsLink };