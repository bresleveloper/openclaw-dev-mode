import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import { type ResolverContext } from "./runtime-shared.js";
/** Collects SecretRef assignments from agent auth-profile stores for runtime materialization. */
export declare function collectAuthStoreAssignments(params: {
    store: AuthProfileStore;
    context: ResolverContext;
    agentDir: string;
}): void;
