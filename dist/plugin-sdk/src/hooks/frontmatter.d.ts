import type { OpenClawHookMetadata, HookEntry, HookInvocationPolicy, ParsedHookFrontmatter } from "./types.js";
/** Parse HOOK.md frontmatter into the generic hook frontmatter record. */
export declare function parseFrontmatter(content: string): ParsedHookFrontmatter;
/** Resolve OpenClaw hook metadata from the manifest block in HOOK.md frontmatter. */
export declare function resolveOpenClawMetadata(frontmatter: ParsedHookFrontmatter): OpenClawHookMetadata | undefined;
/** Resolve invocation policy from top-level hook frontmatter flags. */
export declare function resolveHookInvocationPolicy(frontmatter: ParsedHookFrontmatter): HookInvocationPolicy;
/** Resolve the config key for a hook, honoring metadata hookKey overrides. */
export declare function resolveHookKey(hookName: string, entry?: HookEntry): string;
