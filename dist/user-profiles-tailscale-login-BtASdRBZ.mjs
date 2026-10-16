//#region src/state/user-profiles-tailscale-login.ts
/** Classify Tailscale's documented email or email-ish LoginName representation. */
function classifyTailscaleLogin(login) {
	const normalized = login.trim();
	const separator = normalized.lastIndexOf("@");
	if (separator <= 0 || separator === normalized.length - 1) return { kind: "invalid" };
	const subject = normalized.slice(0, separator);
	const suffix = normalized.slice(separator + 1);
	return suffix.includes(".") ? {
		kind: "email",
		email: normalized
	} : {
		kind: "provider",
		provider: suffix.toLowerCase(),
		subject: subject.toLowerCase()
	};
}
//#endregion
export { classifyTailscaleLogin as t };
