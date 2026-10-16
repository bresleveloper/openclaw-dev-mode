//#region src/config/sessions/session-pending-input-custody-error.ts
/** Custody refusal must not release already accepted input for another dispatch. */
var SessionPendingInputCustodyError = class extends Error {};
//#endregion
export { SessionPendingInputCustodyError as t };
