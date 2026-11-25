declare function formatCliCommand(command: string, env?: Record<string, string | undefined>): string;
/** Return true when a safe executable name/path can be found on this host. */
declare function detectBinary(name: string): Promise<boolean>;
declare function formatDocsLink(path: string | undefined | null, label?: string, opts?: {
  fallback?: string;
  force?: boolean;
}): string;
export { detectBinary as n, formatCliCommand as r, formatDocsLink as t };