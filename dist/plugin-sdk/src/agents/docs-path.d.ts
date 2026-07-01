export declare const OPENCLAW_DOCS_URL = "https://docs.openclaw.ai";
export declare const OPENCLAW_SOURCE_URL = "https://github.com/openclaw/openclaw";
type ResolveOpenClawReferencePathParams = {
    workspaceDir?: string;
    argv1?: string;
    cwd?: string;
    moduleUrl?: string;
};
/** Resolve docs and source roots concurrently for prompt/reference injection. */
export declare function resolveOpenClawReferencePaths(params: ResolveOpenClawReferencePathParams): Promise<{
    docsPath: string | null;
    sourcePath: string | null;
}>;
export {};
