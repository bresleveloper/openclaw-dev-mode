import { type RuntimeEnv } from "../runtime.js";
type RuntimeKind = "node" | "unknown";
type Semver = {
    major: number;
    minor: number;
    patch: number;
};
/** Runtime facts included in startup/runtime-version diagnostics. */
export type RuntimeDetails = {
    kind: RuntimeKind;
    version: string | null;
    execPath: string | null;
    pathEnv: string;
};
/** Parses the first major/minor/patch triple from a runtime or package version label. */
export declare function parseSemver(version: string | null): Semver | null;
/** Compares parsed semver triples against an inclusive minimum version. */
export declare function isAtLeast(version: Semver | null, minimum: Semver): boolean;
/** Reads current process runtime metadata for startup support checks. */
export declare function detectRuntime(): RuntimeDetails;
/** Returns whether a detected runtime meets OpenClaw's minimum runtime contract. */
export declare function runtimeSatisfies(details: RuntimeDetails): boolean;
/** Checks a Node version label against OpenClaw's current minimum Node version. */
export declare function isSupportedNodeVersion(version: string | null): boolean;
/** Parses simple package `engines.node` ranges of the form `>=x.y.z`. */
export declare function parseMinimumNodeEngine(engine: string | null): Semver | null;
/** Returns whether a Node version satisfies a simple minimum engine range, or null if unsupported. */
export declare function nodeVersionSatisfiesEngine(version: string | null, engine: string | null): boolean | null;
/** Exits through the provided runtime when the current Node runtime is unsupported. */
export declare function assertSupportedRuntime(runtime?: RuntimeEnv, details?: RuntimeDetails): void;
export {};
