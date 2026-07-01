import { t as CONFIG_DIR } from "./utils-CR2kVvQb.js";
import { t as formatDocsLink } from "./links-DFOTZJs1.js";
import { t as formatCliCommand } from "./command-format-CUz7-yqH.js";
import { t as detectBinary } from "./detect-binary-Drm6r9o4.js";
import { extractArchive } from "@openclaw/fs-safe/archive";

//#region src/infra/brew.d.ts
type BrewResolutionOptions = {
  homeDir?: string;
  /**
   * @deprecated No-op compatibility field for plugin SDK callers. Homebrew
   * env vars are ignored for resolution because workspace env can be untrusted.
   */
  env?: NodeJS.ProcessEnv;
};
/** Returns standard Homebrew bin directories suitable for PATH augmentation. */
/** Resolves an executable `brew` path from trusted PATH entries or standard install roots. */
declare function resolveBrewExecutable(opts?: BrewResolutionOptions): string | undefined;
//#endregion
export { CONFIG_DIR, detectBinary, extractArchive, formatCliCommand, formatDocsLink, resolveBrewExecutable };