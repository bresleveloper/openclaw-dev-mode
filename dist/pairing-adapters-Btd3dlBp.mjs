//#region src/channels/plugins/pairing-adapters.ts
/**
* Creates an allowlist normalizer that strips a channel-specific target prefix.
*/
function createPairingPrefixStripper(prefixRe, map = (entry) => entry) {
	return (entry) => map(entry.trim().replace(prefixRe, "").trim());
}
/**
* Creates a pairing notifier that logs a formatted approval message.
*/
function createLoggedPairingApprovalNotifier(format, log = console.log) {
	return async (params) => {
		log(typeof format === "function" ? format(params) : format);
	};
}
/**
* Creates a text-message pairing adapter with optional allowlist normalization.
*/
function createTextPairingAdapter(params) {
	return {
		idLabel: params.idLabel,
		normalizeAllowEntry: params.normalizeAllowEntry,
		notifyApproval: async (ctx) => {
			await params.notify({
				...ctx,
				message: params.message
			});
		}
	};
}
//#endregion
export { createPairingPrefixStripper as n, createTextPairingAdapter as r, createLoggedPairingApprovalNotifier as t };
