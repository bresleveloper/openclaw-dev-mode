//#region src/agents/sessions/source-info.d.ts
/**
 * Source metadata helpers for session resources.
 *
 * Tracks where prompts, skills, and extension-provided assets came from for diagnostics and UI.
 */
type SourceScope = "user" | "project" | "temporary";
type SourceOrigin = "package" | "top-level";
interface PathMetadata {
  source: string;
  scope: SourceScope;
  origin: SourceOrigin;
  baseDir?: string;
}
interface SourceInfo extends PathMetadata {
  path: string;
}
//#endregion
//#region src/skills/loading/skill-contract.d.ts
interface Skill {
  name: string;
  /** Human-readable title from the first Markdown H1, falling back to the identifier. */
  displayName?: string;
  description: string;
  /** Additional loading guidance rendered with the location in full and compact catalogs. */
  locationNote?: string;
  /** Prepared instructions for transferred bundles or non-filesystem locators such as node://. */
  readContent?: string;
  /** Prepared runtime identity of instruction bytes, or the complete delivered bundle tree. */
  contentHash?: string;
  filePath: string;
  baseDir: string;
  /** Assigned by Gateway discovery, never accepted from the workspace provider. */
  fileHost?: "gateway" | "workspace";
  /** @deprecated Ignored; retained for API compatibility until the next Plugin SDK major. */
  promptVersion?: string;
  sourceInfo: SourceInfo;
  disableModelInvocation: boolean;
  source: string;
}
//#endregion
export { PathMetadata as n, SourceInfo as r, Skill as t };