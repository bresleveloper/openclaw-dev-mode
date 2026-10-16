//#region src/auto-reply/reply/message-injection-authority.ts
/** A refused owner assertion is terminal for this input, not permission to redispatch it. */
var MessageInjectionAuthorityError = class extends Error {
	constructor(options) {
		super("Message injection authority is no longer current", options);
		this.name = "MessageInjectionAuthorityError";
	}
};
/** One injection stays revoked even if its source later appears current again. */
function createMessageInjectionAuthority(canInject) {
	let revoked;
	return () => {
		if (!revoked) {
			try {
				if (canInject()) return;
			} catch (cause) {
				revoked = new MessageInjectionAuthorityError({ cause });
			}
			revoked ??= new MessageInjectionAuthorityError();
		}
		throw revoked;
	};
}
//#endregion
export { createMessageInjectionAuthority as n, MessageInjectionAuthorityError as t };
