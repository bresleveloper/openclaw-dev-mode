import type { PathAliasPolicy } from "../../infra/path-alias-guards.js";
import { type RootFileOpenResult } from "./fs-bridge-path-safety.runtime.js";
import type { SandboxResolvedFsPath, SandboxFsMount } from "./fs-paths.js";
type BoundaryAllowedType = "file" | "directory";
/** Caller-provided path safety requirements for one fs bridge operation. */
type PathSafetyOptions = {
    action: string;
    aliasPolicy?: PathAliasPolicy;
    requireWritable?: boolean;
    allowedType?: BoundaryAllowedType;
};
/** Path plus operation constraints to validate before execution. */
export type PathSafetyCheck = {
    target: SandboxResolvedFsPath;
    options: PathSafetyOptions;
};
/** Container entry pinned by mount root plus lexical parent and basename. */
export type PinnedSandboxEntry = {
    mountRootPath: string;
    relativeParentPath: string;
    basename: string;
};
/** Entry anchored by canonical parent path after symlink resolution. */
export type AnchoredSandboxEntry = {
    canonicalParentPath: string;
    basename: string;
};
/** Directory entry pinned relative to a container mount root. */
export type PinnedSandboxDirectoryEntry = {
    mountRootPath: string;
    relativePath: string;
};
type RunCommand = (script: string, options?: {
    args?: string[];
    stdin?: Buffer | string;
    allowFailure?: boolean;
    signal?: AbortSignal;
}) => Promise<{
    stdout: Buffer;
}>;
/** Validates sandbox fs bridge paths against mount, symlink, and writability boundaries. */
export declare class SandboxFsPathGuard {
    private readonly mountsByContainer;
    private readonly runCommand;
    constructor(params: {
        mountsByContainer: SandboxFsMount[];
        runCommand: RunCommand;
    });
    assertPathChecks(checks: PathSafetyCheck[]): Promise<void>;
    assertPathSafety(target: SandboxResolvedFsPath, options: PathSafetyOptions): Promise<void>;
    openReadableFile(target: SandboxResolvedFsPath): Promise<RootFileOpenResult & {
        ok: true;
    }>;
    private resolveRequiredMount;
    private finalizePinnedEntry;
    private assertGuardedPathSafety;
    private openBoundaryWithinRequiredMount;
    resolvePinnedEntry(target: SandboxResolvedFsPath, action: string): PinnedSandboxEntry;
    resolveAnchoredSandboxEntry(target: SandboxResolvedFsPath, action: string): Promise<AnchoredSandboxEntry>;
    resolveAnchoredPinnedEntry(target: SandboxResolvedFsPath, action: string): Promise<PinnedSandboxEntry>;
    resolvePinnedDirectoryEntry(target: SandboxResolvedFsPath, action: string): PinnedSandboxDirectoryEntry;
    private pathIsExistingDirectory;
    private resolveMountByContainerPath;
    private resolveCanonicalContainerPath;
}
export {};
