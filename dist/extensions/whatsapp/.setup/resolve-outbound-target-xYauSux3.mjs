import { c as normalizeWhatsAppTarget } from "./normalize-target-DouOWumF.mjs";
import { normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { missingTargetError } from "openclaw/plugin-sdk/channel-feedback";
// extensions/whatsapp/src/resolve-outbound-target.ts
function resolveWhatsAppOutboundTarget(params) {
	const normalizedTo = normalizeWhatsAppTarget(params.to ?? "");
	if (!normalizedTo) return {
		ok: false,
		error: missingTargetError("WhatsApp", "<E.164|group JID|newsletter JID>")
	};
	if (normalizedTo.endsWith("@g.us") || normalizedTo.endsWith("@newsletter")) return {
		ok: true,
		to: normalizedTo
	};
	const allowListRaw = normalizeStringEntries(params.allowFrom ?? []);
	const hasWildcard = allowListRaw.includes("*");
	const allowList = allowListRaw.filter((entry) => entry !== "*").map((entry) => normalizeWhatsAppTarget(entry)).filter((entry) => Boolean(entry));
	if (hasWildcard || allowList.length === 0 || allowList.includes(normalizedTo)) return {
		ok: true,
		to: normalizedTo
	};
	return {
		ok: false,
		error: /* @__PURE__ */ new Error(`Target "${normalizedTo}" is not listed in the configured WhatsApp allowFrom policy.`)
	};
}
export { resolveWhatsAppOutboundTarget as t };
