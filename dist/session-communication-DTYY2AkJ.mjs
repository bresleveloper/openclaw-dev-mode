//#region packages/gateway-protocol/src/session-communication.ts
/** Human-selected policy for initiating messages between sessions. */
const SESSION_COMMUNICATION_MODES = [
	"always",
	"ask",
	"never"
];
//#endregion
export { SESSION_COMMUNICATION_MODES as t };
