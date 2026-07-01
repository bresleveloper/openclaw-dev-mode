import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type CommandTurnContextInput } from "./command-turn-context.js";
/** Returns true when inbound metadata or command text identifies an explicit command turn. */
export declare function isExplicitCommandTurnContext(input: CommandTurnContextInput, cfg: OpenClawConfig): boolean;
