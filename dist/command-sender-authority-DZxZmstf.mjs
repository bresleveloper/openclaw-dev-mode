//#region src/auto-reply/command-sender-authority.ts
const COMMAND_SENDER_AUTHORITY = Symbol("openclaw.commandSenderAuthority");
/** Keep the live authority owner through internal context and client copies. */
function withCommandSenderAuthority(context, authority) {
	return {
		...context,
		[COMMAND_SENDER_AUTHORITY]: authority
	};
}
function getCommandSenderAuthority(context) {
	return context?.[COMMAND_SENDER_AUTHORITY];
}
//#endregion
export { withCommandSenderAuthority as n, getCommandSenderAuthority as t };
