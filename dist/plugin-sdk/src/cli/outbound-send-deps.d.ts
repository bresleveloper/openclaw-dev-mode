import type { OutboundSendDeps } from "../infra/outbound/send-deps.js";
import type { CliDeps } from "./deps.types.js";
export type { CliDeps } from "./deps.types.js";
/** Convert the broad CLI dependency bundle into the narrow outbound-send dependency shape. */
export declare function createOutboundSendDeps(deps: CliDeps): OutboundSendDeps;
