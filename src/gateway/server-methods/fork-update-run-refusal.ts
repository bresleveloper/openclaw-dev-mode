// FIX-09 (openclaw-dev-mode fork): the update.run refusal. It lives here, not in update.ts, so that
// upstream file stays within its max-lines cap (700, blank and comment lines not counted).
// The block itself and its regression checklist: src/infra/fork-update-block.ts.
import { ErrorCodes, errorShape } from "../../../packages/gateway-protocol/src/index.js";
import { FORK_UPDATE_BLOCKED_MESSAGE, isForkUpdateBlocked } from "../../infra/fork-update-block.js";
import type { RespondFn } from "./response-types.js";

/** Answers with the FIX-09 refusal while updates are blocked; true means the handler must return. */
export function respondIfForkUpdateBlocked(respond: RespondFn): boolean {
  if (!isForkUpdateBlocked()) {
    return false;
  }
  respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, FORK_UPDATE_BLOCKED_MESSAGE));
  return true;
}
