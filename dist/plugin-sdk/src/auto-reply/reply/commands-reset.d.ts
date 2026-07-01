import type { CommandHandlerResult, HandleCommandsParams } from "./commands-types.js";
/** Handles reset/new commands or returns null when another command handler should continue. */
export declare function maybeHandleResetCommand(params: HandleCommandsParams): Promise<CommandHandlerResult | null>;
