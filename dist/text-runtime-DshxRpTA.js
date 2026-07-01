import { l as normalizeE164, m as resolveUserPath, t as CONFIG_DIR } from "./utils-BApvfmPs.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { i as logVerbose, o as shouldLogVerbose } from "./globals-BWmHKFNH.js";
import "./runtime-env-oOti2yy7.js";
import "./text-chunking-nijjGL3g.js";
import "./text-utility-runtime-hurZUKRN.js";
import "./account-resolution-DTzMrP_G.js";
import fs from "node:fs";
import path from "node:path";
//#region extensions/whatsapp/src/targets-runtime.ts
const WHATSAPP_FENCE_PLACEHOLDER = "\0FENCE";
const WHATSAPP_INLINE_CODE_PLACEHOLDER = "\0CODE";
const WHATSAPP_PLACEHOLDER_TERMINATOR = "\0";
function assertWebChannel(input) {
	if (input !== "web") throw new Error("Web channel must be 'web'");
}
function isSelfChatMode(selfE164, allowFrom) {
	if (!selfE164) return false;
	if (!Array.isArray(allowFrom) || allowFrom.length === 0) return false;
	const normalizedSelf = normalizeE164(selfE164);
	return allowFrom.some((n) => {
		if (n === "*") return false;
		try {
			return normalizeE164(String(n)) === normalizedSelf;
		} catch {
			return false;
		}
	});
}
function toWhatsappJid(number) {
	const withoutPrefix = number.replace(/^whatsapp:/i, "").trim();
	if (withoutPrefix.includes("@")) return withoutPrefix;
	return `${normalizeE164(withoutPrefix).replace(/\D/g, "")}@s.whatsapp.net`;
}
function toWhatsappJidWithLid(number, opts) {
	const stripped = number.replace(/^whatsapp:/i, "").trim();
	if (stripped.includes("@")) return stripped;
	const phoneDigits = normalizeE164(stripped).replace(/\D/g, "");
	const lid = readLidForwardMapping({
		phoneDigits,
		opts
	});
	return lid ? `${lid}@lid` : `${phoneDigits}@s.whatsapp.net`;
}
function addUniqueString(target, value) {
	const normalized = value?.trim();
	if (normalized && !target.includes(normalized)) target.push(normalized);
}
async function tryLookupMappedJid(lookup) {
	if (!lookup) return null;
	try {
		return await lookup() ?? null;
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`LID mapping lookup failed: ${String(err)}`);
		return null;
	}
}
const DIRECT_PN_JID_RE = /^(\d+)(?::\d+)?@(s\.whatsapp\.net|hosted)$/i;
const DIRECT_LID_JID_RE = /^(\d+)(?::\d+)?@(lid|hosted\.lid)$/i;
function addEquivalentDirectChatCandidate(target, jid) {
	addUniqueString(target, jid);
	const pnMatch = jid?.match(DIRECT_PN_JID_RE);
	if (pnMatch) {
		addUniqueString(target, `${pnMatch[1]}@${pnMatch[2]}`);
		return;
	}
	const lidMatch = jid?.match(DIRECT_LID_JID_RE);
	if (lidMatch) addUniqueString(target, `${lidMatch[1]}@${lidMatch[2]}`);
}
async function resolveEquivalentWhatsAppDirectChatJids(jid, opts) {
	const normalized = jid?.trim();
	if (!normalized) return [];
	const candidates = [];
	addEquivalentDirectChatCandidate(candidates, normalized);
	const pnMatch = normalized.match(DIRECT_PN_JID_RE);
	if (pnMatch) {
		addEquivalentDirectChatCandidate(candidates, await tryLookupMappedJid(() => opts?.lidLookup?.getLIDForPN?.(normalized)));
		const mappedLocalLid = readLidForwardMapping({
			phoneDigits: pnMatch[1],
			opts
		});
		const localLidDomain = pnMatch[2].toLowerCase() === "hosted" ? "hosted.lid" : "lid";
		addUniqueString(candidates, mappedLocalLid ? `${mappedLocalLid}@${localLidDomain}` : null);
		return candidates;
	}
	const lidMatch = normalized.match(DIRECT_LID_JID_RE);
	if (lidMatch) {
		addEquivalentDirectChatCandidate(candidates, await tryLookupMappedJid(() => opts?.lidLookup?.getPNForLID?.(normalized)));
		const e164 = jidToE164(normalized, {
			...opts,
			logMissing: false
		});
		addUniqueString(candidates, e164 && lidMatch[2].toLowerCase() === "hosted.lid" ? `${e164.replace(/\D/g, "")}@hosted` : e164 ? toWhatsappJid(e164) : null);
	}
	return candidates;
}
function resolveLidMappingDirs(params) {
	const dirs = /* @__PURE__ */ new Set();
	const addDir = (dir) => {
		if (!dir) return;
		dirs.add(resolveUserPath(dir));
	};
	addDir(params.opts?.authDir);
	for (const dir of params.opts?.lidMappingDirs ?? []) addDir(dir);
	addDir(CONFIG_DIR);
	addDir(path.join(CONFIG_DIR, "credentials"));
	return [...dirs];
}
function readLidReverseMapping(params) {
	const mappingFilename = `lid-mapping-${params.lid}_reverse.json`;
	const mappingDirs = resolveLidMappingDirs({ opts: params.opts });
	for (const dir of mappingDirs) {
		const mappingPath = path.join(dir, mappingFilename);
		try {
			const data = fs.readFileSync(mappingPath, "utf8");
			const phone = JSON.parse(data);
			if (phone === null || phone === void 0) continue;
			return normalizeE164(String(phone));
		} catch {}
	}
	return null;
}
function readLidForwardMapping(params) {
	const mappingFilename = `lid-mapping-${params.phoneDigits}.json`;
	const mappingDirs = resolveLidMappingDirs({ opts: params.opts });
	for (const dir of mappingDirs) {
		const mappingPath = path.join(dir, mappingFilename);
		try {
			const data = fs.readFileSync(mappingPath, "utf8");
			const lid = JSON.parse(data);
			if (lid === null || lid === void 0) continue;
			const digits = String(lid).replace(/\D/g, "");
			if (digits) return digits;
		} catch {}
	}
	return null;
}
function jidToE164(jid, opts) {
	const match = jid.match(/^(\d+)(?::\d+)?@(s\.whatsapp\.net|hosted)$/);
	if (match) return `+${match[1]}`;
	const lidMatch = jid.match(/^(\d+)(?::\d+)?@(lid|hosted\.lid)$/);
	if (!lidMatch) return null;
	const phone = readLidReverseMapping({
		lid: lidMatch[1],
		opts
	});
	if (phone) return phone;
	if (opts?.logMissing ?? shouldLogVerbose()) logVerbose(`LID mapping not found for ${lidMatch[1]}; skipping inbound message`);
	return null;
}
async function resolveJidToE164(jid, opts) {
	if (!jid) return null;
	const direct = jidToE164(jid, opts);
	if (direct) return direct;
	if (!/(@lid|@hosted\.lid)$/.test(jid) || !opts?.lidLookup?.getPNForLID) return null;
	try {
		const pnJid = await opts.lidLookup.getPNForLID(jid);
		if (!pnJid) return null;
		return jidToE164(pnJid, opts);
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`LID mapping lookup failed for ${jid}: ${String(err)}`);
		return null;
	}
}
function markdownToWhatsApp(text) {
	if (!text) return text;
	const fences = [];
	let result = text.replace(/```[\s\S]*?```/g, (match) => {
		fences.push(match);
		return `${WHATSAPP_FENCE_PLACEHOLDER}${fences.length - 1}${WHATSAPP_PLACEHOLDER_TERMINATOR}`;
	});
	const inlineCodes = [];
	result = result.replace(/`[^`\n]+`/g, (match) => {
		inlineCodes.push(match);
		return `${WHATSAPP_INLINE_CODE_PLACEHOLDER}${inlineCodes.length - 1}${WHATSAPP_PLACEHOLDER_TERMINATOR}`;
	});
	result = result.replace(/\*\*(.+?)\*\*/g, "*$1*");
	result = result.replace(/__(.+?)__/g, "*$1*");
	result = result.replace(/~~(.+?)~~/g, "~$1~");
	const terminator = escapeRegExp(WHATSAPP_PLACEHOLDER_TERMINATOR);
	result = result.replace(new RegExp(`${escapeRegExp(WHATSAPP_INLINE_CODE_PLACEHOLDER)}(\\d+)${terminator}`, "g"), (_, idx) => inlineCodes[Number(idx)] ?? "");
	result = result.replace(new RegExp(`${escapeRegExp(WHATSAPP_FENCE_PLACEHOLDER)}(\\d+)${terminator}`, "g"), (_, idx) => fences[Number(idx)] ?? "");
	return result;
}
//#endregion
export { resolveEquivalentWhatsAppDirectChatJids as a, toWhatsappJidWithLid as c, markdownToWhatsApp as i, isSelfChatMode as n, resolveJidToE164 as o, jidToE164 as r, toWhatsappJid as s, assertWebChannel as t };
