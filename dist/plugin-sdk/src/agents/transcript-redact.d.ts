import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { AgentMessage } from "./runtime/index.js";
/** Return a redacted transcript message according to logging config. */
export declare function redactTranscriptMessage(message: AgentMessage, cfg?: OpenClawConfig): AgentMessage;
