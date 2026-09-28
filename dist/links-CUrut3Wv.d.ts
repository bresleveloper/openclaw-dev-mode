//#region src/cli/command-format.d.ts
/** Add active root options to a displayed command without duplicating explicit flags. */
declare function formatCliCommand(command: string, env?: Record<string, string | undefined>): string;
//#endregion
//#region src/infra/detect-binary.d.ts
/** Return true when a safe executable name/path can be found on this host. */
declare function detectBinary(name: string): Promise<boolean>;
//#endregion
//#region packages/terminal-core/src/links.d.ts
declare function formatDocsLink(path: string | undefined | null, label?: string, opts?: {
  fallback?: string;
  force?: boolean;
}): string;
//#endregion
export { detectBinary as n, formatCliCommand as r, formatDocsLink as t };