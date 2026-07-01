type CommandStatusRuntime = typeof import("./command-status.runtime.js");
export type { ResolveDirectStatusReplyForSessionParams } from "./command-status.runtime.js";
/** Resolves the direct status reply text for a session without eagerly loading runtime code. */
export declare const resolveDirectStatusReplyForSession: CommandStatusRuntime["resolveDirectStatusReplyForSession"];
