import fs from "node:fs";
import path from "node:path";
import { normalizeE164 } from "openclaw/plugin-sdk/account-resolution";
import { chunkMarkdownTextWithMode } from "openclaw/plugin-sdk/reply-chunking";
import { logVerbose, shouldLogVerbose } from "openclaw/plugin-sdk/runtime-env";
import { FormatCapabilityProfile, markdownToIRWithMeta, renderMarkdownIRChunksWithinLimit, renderMarkdownWithMarkers, sliceMarkdownIR } from "openclaw/plugin-sdk/text-chunking";
import { CONFIG_DIR, resolveUserPath as resolveUserPath$1 } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/whatsapp/src/targets-runtime.ts
const WHATSAPP_FORMAT_CAPABILITIES = FormatCapabilityProfile.define({
	mechanism: "markdown",
	constructs: {
		underline: "strip",
		spoiler: "fallback",
		codeLanguage: "fallback",
		linkLabel: "fallback",
		heading: "fallback",
		taskList: "fallback",
		table: "fallback",
		image: "fallback"
	},
	chunk: {
		limit: 4096,
		unit: "chars"
	}
});
const WHATSAPP_STYLE_MARKERS = {
	bold: {
		open: "*",
		close: "*"
	},
	italic: {
		open: "_",
		close: "_"
	},
	strikethrough: {
		open: "~",
		close: "~"
	},
	code: {
		open: "```",
		close: "```"
	},
	code_block: {
		open: "```\n",
		close: "```"
	}
};
const WHATSAPP_INDENT_GUARD = "⁠";
const WHATSAPP_MARKERS = [
	"*",
	"_",
	"~",
	"`"
];
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
		const phoneDigits = pnMatch[1];
		const pnDomain = pnMatch[2];
		if (!phoneDigits || !pnDomain) return candidates;
		const mappedLocalLid = readLidForwardMapping({
			phoneDigits,
			opts
		});
		const localLidDomain = pnDomain.toLowerCase() === "hosted" ? "hosted.lid" : "lid";
		addUniqueString(candidates, mappedLocalLid ? `${mappedLocalLid}@${localLidDomain}` : null);
		return candidates;
	}
	const lidMatch = normalized.match(DIRECT_LID_JID_RE);
	if (lidMatch) {
		addEquivalentDirectChatCandidate(candidates, await tryLookupMappedJid(() => opts?.lidLookup?.getPNForLID?.(normalized)));
		const lidDomain = lidMatch[2];
		if (!lidMatch[1] || !lidDomain) return candidates;
		const e164 = jidToE164(normalized, {
			...opts,
			logMissing: false
		});
		addUniqueString(candidates, e164 && lidDomain.toLowerCase() === "hosted.lid" ? `${e164.replace(/\D/g, "")}@hosted` : e164 ? toWhatsappJid(e164) : null);
	}
	return candidates;
}
function resolveLidMappingDirs(params) {
	const dirs = /* @__PURE__ */ new Set();
	const addDir = (dir) => {
		if (!dir) return;
		dirs.add(resolveUserPath$1(dir));
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
	const phoneDigits = jid.match(/^(\d+)(?::\d+)?@(s\.whatsapp\.net|hosted)$/)?.[1];
	if (phoneDigits) return `+${phoneDigits}`;
	const lidMatch = jid.match(/^(\d+)(?::\d+)?@(lid|hosted\.lid)$/);
	if (!lidMatch) return null;
	const lid = lidMatch[1];
	if (!lid) return null;
	const phone = readLidReverseMapping({
		lid,
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
function protectWhatsAppEscapedMarkers(text) {
	const placeholders = [];
	for (const [start, end] of [[57344, 63743], [983040, 1048573]]) for (let codePoint = start; codePoint <= end && placeholders.length < WHATSAPP_MARKERS.length; codePoint += 1) {
		const candidate = String.fromCodePoint(codePoint);
		if (!text.includes(candidate)) placeholders.push(candidate);
	}
	if (placeholders.length < WHATSAPP_MARKERS.length) throw new Error("Unable to reserve WhatsApp formatting placeholders");
	const markers = WHATSAPP_MARKERS.map((marker, index) => ({
		source: `\\${marker}`,
		placeholder: placeholders[index] ?? ""
	}));
	let protectedText = text;
	for (const { source, placeholder } of markers) protectedText = protectedText.replaceAll(source, placeholder);
	return {
		text: protectedText,
		markers
	};
}
function restoreWhatsAppEscapedMarkers(text, markers) {
	let restored = text;
	for (const { source, placeholder } of markers) restored = restored.replaceAll(placeholder, source);
	return restored;
}
function renderWhatsAppMarkdownIR(ir, escapedMarkers) {
	return renderMarkdownWithMarkers(ir, {
		styleMarkers: WHATSAPP_STYLE_MARKERS,
		escapeText: (value) => restoreWhatsAppEscapedMarkers(value, escapedMarkers)
	}, WHATSAPP_FORMAT_CAPABILITIES);
}
function prepareWhatsAppMarkdown(text, tableMode) {
	const guardedIndent = /^[\t ]/u.test(text);
	const escaped = protectWhatsAppEscapedMarkers(text);
	const markdown = guardedIndent ? `${WHATSAPP_INDENT_GUARD}${escaped.text}` : escaped.text;
	const trailingWhitespace = text.match(/\s+$/u)?.[0] ?? "";
	const { ir: parsedIr, hasTables } = markdownToIRWithMeta(markdown, {
		linkify: false,
		autolink: false,
		enableSpoilers: true,
		enableHtmlUnderline: true,
		enableTaskLists: true,
		headingStyle: "rich",
		blockquotePrefix: "> ",
		tableMode: tableMode === "block" ? "code" : tableMode,
		preserveSourceBlockSpacing: true
	});
	let ir = parsedIr;
	if (guardedIndent && ir.text.startsWith(WHATSAPP_INDENT_GUARD)) ir = sliceMarkdownIR(ir, 1, ir.text.length);
	if (!hasTables && trailingWhitespace) ir.text = `${ir.text.trimEnd()}${trailingWhitespace}`;
	return {
		ir,
		escapedMarkers: escaped.markers
	};
}
function splitWhatsAppIRForChunkMode(ir, limit, chunkMode) {
	if (chunkMode !== "newline") return [ir];
	const chunkTexts = chunkMarkdownTextWithMode(ir.text, limit, chunkMode);
	const chunks = [];
	let cursor = 0;
	for (const text of chunkTexts) {
		const start = ir.text.indexOf(text, cursor);
		if (start < 0) return [ir];
		const end = start + text.length;
		chunks.push(sliceMarkdownIR(ir, start, end));
		cursor = end;
	}
	return chunks;
}
function markdownToWhatsAppChunks(text, limit, tableMode = "bullets", chunkMode = "length") {
	if (!text) return [];
	if (!text.trim()) return chunkMarkdownTextWithMode(text, limit, chunkMode);
	const { ir, escapedMarkers } = prepareWhatsAppMarkdown(text, tableMode);
	const render = (chunk) => renderWhatsAppMarkdownIR(chunk, escapedMarkers);
	let chunks = ir.styles.length === 0 && ir.links.length === 0 ? chunkMarkdownTextWithMode(render(ir), limit, chunkMode) : splitWhatsAppIRForChunkMode(ir, limit, chunkMode).flatMap((source) => renderMarkdownIRChunksWithinLimit({
		ir: source,
		limit,
		renderChunk: render,
		measureRendered: (value) => value.length
	}).map((chunk) => chunk.rendered));
	if (chunkMode === "newline") chunks = chunks.map((chunk) => chunk.trimEnd()).filter(Boolean);
	return chunks;
}
function markdownToWhatsApp(text, tableMode = "bullets") {
	return markdownToWhatsAppChunks(text, Number.POSITIVE_INFINITY, tableMode).join("");
}
//#endregion
export { markdownToWhatsAppChunks as a, toWhatsappJid as c, markdownToWhatsApp as i, toWhatsappJidWithLid as l, isSelfChatMode as n, resolveEquivalentWhatsAppDirectChatJids as o, jidToE164 as r, resolveJidToE164 as s, assertWebChannel as t };
