import type { CommandContext } from "../auto-reply/reply/commands-types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type CrestodianCommandDeps } from "./operations.js";
/** Input required to process one possible `/crestodian` rescue message. */
export type CrestodianRescueMessageInput = {
    cfg: OpenClawConfig;
    command: CommandContext;
    commandBody: string;
    agentId?: string;
    isGroup: boolean;
    env?: NodeJS.ProcessEnv;
    deps?: CrestodianCommandDeps;
};
/** Extract the command body after `/crestodian`, or null when the message is not for rescue. */
export declare function extractCrestodianRescueMessage(commandBody: string): string | null;
/** Process one rescue message and return a reply, or null when not a rescue command. */
export declare function runCrestodianRescueMessage(input: CrestodianRescueMessageInput): Promise<string | null>;
