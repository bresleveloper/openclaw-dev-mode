import { nip19 } from "nostr-tools";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { Buffer } from "node:buffer";
const BUZZ_AMBIGUITY_CANDIDATE_LIMIT = 5;
const HEX_PUBLIC_KEY_PATTERN$1 = /^[0-9a-f]{64}$/u;
const NIP_27_PREFIX = "nostr:npub1";
const NPUB_LENGTH = 63;
function asciiLowercase(value) {
	return value.replace(/[A-Z]/gu, (character) => character.toLowerCase());
}
function isAsciiWhitespace(character) {
	return character !== void 0 && /^[\t-\r ]$/u.test(character);
}
function isOnlyAsciiWhitespace(value) {
	return /^[\t-\r ]*$/u.test(value);
}
function isMentionBoundary(value) {
	const character = value[0];
	return character === void 0 || isAsciiWhitespace(character) || ",;.!?:)]}".includes(character);
}
function stripCodeRegions(content) {
	let output = "";
	let index = 0;
	while (index < content.length) {
		if (content.startsWith("```", index)) {
			const lineStart = content.lastIndexOf("\n", index - 1) + 1;
			if (isOnlyAsciiWhitespace(content.slice(lineStart, index))) {
				const openingLineEnd = content.indexOf("\n", index + 3);
				let searchFrom = openingLineEnd === -1 ? content.length : openingLineEnd + 1;
				let closeEnd = content.length;
				while (searchFrom < content.length) {
					const closingFence = content.indexOf("```", searchFrom);
					if (closingFence === -1) break;
					const closingLineStart = content.lastIndexOf("\n", closingFence - 1) + 1;
					if (isOnlyAsciiWhitespace(content.slice(closingLineStart, closingFence))) {
						const closingLineEnd = content.indexOf("\n", closingFence + 3);
						closeEnd = closingLineEnd === -1 ? content.length : closingLineEnd + 1;
						break;
					}
					searchFrom = closingFence + 3;
				}
				output += " ";
				index = closeEnd;
				continue;
			}
		}
		if (content[index] === "`") {
			const closingTick = content.indexOf("`", index + 1);
			if (closingTick !== -1 && !content.slice(index + 1, closingTick).includes("\n")) {
				output += " ";
				index = closingTick + 1;
				continue;
			}
		}
		output += content[index];
		index += 1;
	}
	return output;
}
function extractNostrPubkeys(content) {
	const publicKeys = [];
	const seen = /* @__PURE__ */ new Set();
	let searchFrom = 0;
	while (searchFrom < content.length) {
		const start = content.indexOf(NIP_27_PREFIX, searchFrom);
		if (start === -1) break;
		const npubStart = start + 6;
		const candidate = content.slice(npubStart, npubStart + NPUB_LENGTH);
		searchFrom = start + 11;
		if (candidate.length !== NPUB_LENGTH || !/^[0-9a-z]+$/iu.test(candidate)) continue;
		try {
			const decoded = nip19.decode(asciiLowercase(candidate));
			if (decoded.type !== "npub" || typeof decoded.data !== "string") continue;
			const publicKey = decoded.data.toLowerCase();
			if (HEX_PUBLIC_KEY_PATTERN$1.test(publicKey) && !seen.has(publicKey)) {
				seen.add(publicKey);
				publicKeys.push(publicKey);
			}
		} catch {}
	}
	return publicKeys;
}
function extractMentionNames(content, knownNames) {
	if (!content.includes("@")) return [];
	const sortedNames = knownNames.map((name) => name.trim()).filter(Boolean).toSorted((left, right) => right.length - left.length);
	const names = [];
	const seen = /* @__PURE__ */ new Set();
	for (let index = 0; index < content.length; index += 1) {
		if (content[index] !== "@" || index > 0 && !isAsciiWhitespace(content[index - 1]) || index + 1 >= content.length) continue;
		const rest = content.slice(index + 1);
		let name = sortedNames.find((name) => {
			const candidate = rest.slice(0, name.length);
			return candidate.length === name.length && asciiLowercase(candidate) === asciiLowercase(name) && isMentionBoundary(rest.slice(name.length));
		});
		if (!name) name = /^[a-z0-9._-]+/iu.exec(rest)?.[0];
		if (!name) continue;
		const normalized = asciiLowercase(name);
		if (!seen.has(normalized)) {
			seen.add(normalized);
			names.push(normalized);
		}
	}
	return names;
}
function hasAtMentionCandidate(content) {
	for (let index = 0; index < content.length; index += 1) if (content[index] === "@" && (index === 0 || isAsciiWhitespace(content[index - 1])) && index + 1 < content.length && !isAsciiWhitespace(content[index + 1])) return true;
	return false;
}
function normalizeMembers(members) {
	const normalized = /* @__PURE__ */ new Map();
	for (const member of members) {
		const publicKey = member.publicKey.trim().toLowerCase();
		if (!HEX_PUBLIC_KEY_PATTERN$1.test(publicKey)) continue;
		normalized.set(publicKey, {
			publicKey,
			displayName: member.displayName?.trim() || void 0
		});
	}
	return normalized;
}
function inspectBuzzMentionSyntax(text) {
	const stripped = stripCodeRegions(text);
	return {
		hasAtMention: hasAtMentionCandidate(stripped),
		hasExplicitIdentity: extractNostrPubkeys(stripped).length > 0
	};
}
function resolveBuzzMessageMentions(params) {
	const stripped = stripCodeRegions(params.text);
	const explicitPublicKeys = extractNostrPubkeys(stripped);
	if (!(hasAtMentionCandidate(stripped) || explicitPublicKeys.length > 0)) return [];
	if (!params.members) throw new Error("Buzz room membership is unavailable; retry after the room directory loads");
	const members = normalizeMembers(params.members);
	const senderPublicKey = params.senderPublicKey.trim().toLowerCase();
	const mentions = [];
	for (const publicKey of explicitPublicKeys) if (publicKey !== senderPublicKey && !mentions.includes(publicKey)) mentions.push(publicKey);
	if (mentions.length > 50) throw new Error(`Buzz messages support at most 50 mentions`);
	const missingPublicKeys = mentions.filter((publicKey) => !members.has(publicKey));
	if (missingPublicKeys.length > 0) throw new Error(`Buzz mentioned public key is not a current room member: ${missingPublicKeys.join(", ")}`);
	const namesToPublicKeys = /* @__PURE__ */ new Map();
	for (const member of members.values()) {
		if (!member.displayName) continue;
		const name = asciiLowercase(member.displayName);
		const matches = namesToPublicKeys.get(name) ?? [];
		matches.push(member.publicKey);
		namesToPublicKeys.set(name, matches);
	}
	const names = extractMentionNames(stripped, [...members.values()].map((member) => member.displayName).filter((name) => Boolean(name)));
	if (hasAtMentionCandidate(stripped) && names.length === 0 && explicitPublicKeys.length === 0) throw new Error("Buzz mention does not match a current room member; use nostr:npub... for an explicit identity");
	for (const name of names) {
		const matches = namesToPublicKeys.get(name) ?? [];
		if (matches.length === 0) {
			if (explicitPublicKeys.length > 0) continue;
			throw new Error(`Buzz mention "@${name}" does not match a current room member; use nostr:npub... for an explicit identity`);
		}
		if (matches.length > 1) {
			if (explicitPublicKeys.length > 0) continue;
			const visibleCandidates = matches.slice(0, BUZZ_AMBIGUITY_CANDIDATE_LIMIT).map((publicKey) => nip19.npubEncode(publicKey)).join(", ");
			const hiddenCandidateCount = matches.length - BUZZ_AMBIGUITY_CANDIDATE_LIMIT;
			const candidateSuffix = hiddenCandidateCount > 0 ? `, and ${hiddenCandidateCount} more` : "";
			throw new Error(`Buzz mention "@${name}" is ambiguous; candidates: ${visibleCandidates}${candidateSuffix}. Use nostr:npub... for an explicit identity`);
		}
		const publicKey = matches[0];
		if (!publicKey) throw new Error("Buzz mention resolution lost its unique room member");
		if (publicKey !== senderPublicKey && !mentions.includes(publicKey)) {
			if (mentions.length >= 50) throw new Error(`Buzz messages support at most 50 mentions`);
			mentions.push(publicKey);
		}
	}
	return mentions;
}
const BUZZ_TYPING_INDICATOR_KIND = 20002;
const BUZZ_RICH_MESSAGE_KIND = 40002;
const BUZZ_DIFF_MESSAGE_KIND = 40008;
const BUZZ_INBOUND_MESSAGE_KINDS = [
	9,
	BUZZ_RICH_MESSAGE_KIND,
	BUZZ_DIFF_MESSAGE_KIND
];
const BUZZ_MESSAGE_CONTENT_MAX_BYTES = 262144;
const BUZZ_DIFF_CONTENT_MAX_BYTES = 61440;
const HEX_PUBLIC_KEY_PATTERN = /^[0-9a-f]{64}$/u;
const BUZZ_DIFF_CONTEXT_FIELD_MAX_CHARS = 256;
const BUZZ_DIFF_AGENT_CONTEXT_MAX_CHARS = 4e3;
const BUZZ_DIFF_AGENT_CONTEXT_TRUNCATED_SUFFIX = "\n...[Buzz diff truncated for model context]";
const BUZZ_INBOUND_MESSAGE_KIND_SET = new Set(BUZZ_INBOUND_MESSAGE_KINDS);
function isBuzzInboundMessageKind(kind) {
	return BUZZ_INBOUND_MESSAGE_KIND_SET.has(kind);
}
function tagValue(event, name) {
	const value = event.tags.find((tag) => tag[0] === name)?.[1]?.trim();
	return value ? value : void 0;
}
function markerTagValue(event, marker) {
	const value = event.tags.find((tag) => tag[0] === "e" && tag[3] === marker)?.[1]?.trim();
	return value ? value : void 0;
}
function isHexAtLeast(value, minimumLength) {
	return value.length >= minimumLength && /^[a-f0-9]+$/iu.test(value);
}
function parseBuzzDiffMetadata(event) {
	let repoUrl;
	let commitSha;
	let filePath;
	let parentCommitSha;
	let sourceBranch;
	let targetBranch;
	let pullRequestNumber;
	let language;
	let description;
	let truncated = false;
	let altText;
	for (const tag of event.tags) {
		const name = tag[0];
		const value = tag[1];
		if (!name || value === void 0) continue;
		switch (name) {
			case "repo":
				if (!value.startsWith("http://") && !value.startsWith("https://")) return null;
				repoUrl ??= value;
				break;
			case "commit":
				if (!isHexAtLeast(value, 7)) return null;
				commitSha ??= value;
				break;
			case "file":
				filePath ??= value;
				break;
			case "parent-commit":
				if (!isHexAtLeast(value, 7)) return null;
				parentCommitSha ??= value;
				break;
			case "branch":
				if (!value || !tag[2]) return null;
				sourceBranch ??= value;
				targetBranch ??= tag[2];
				break;
			case "pr": {
				if (!/^[0-9]+$/u.test(value)) return null;
				const parsed = Number(value);
				if (!Number.isSafeInteger(parsed) || parsed <= 0 || parsed > 4294967295) return null;
				pullRequestNumber ??= parsed;
				break;
			}
			case "l":
				language ??= value;
				break;
			case "description":
				description ??= value;
				break;
			case "truncated":
				truncated ||= value === "true";
				break;
			case "alt": altText ??= value;
		}
	}
	if (!repoUrl || !commitSha) return null;
	return {
		repoUrl,
		commitSha,
		filePath,
		parentCommitSha,
		sourceBranch,
		targetBranch,
		pullRequestNumber,
		language,
		description,
		truncated,
		altText
	};
}
function boundedDiffContextValue(value) {
	const singleLine = value.replace(/\s+/gu, " ").trim();
	if (singleLine.length <= BUZZ_DIFF_CONTEXT_FIELD_MAX_CHARS) return singleLine;
	return `${truncateUtf16Safe(singleLine, 253)}...`;
}
function formatBuzzMessageForAgent(message) {
	if (message.kind !== 40008 || !message.diff) return message.text;
	const { diff } = message;
	const prefix = [
		`[Buzz structured diff]`,
		...[
			`Repository: ${boundedDiffContextValue(diff.repoUrl)}`,
			`Commit: ${boundedDiffContextValue(diff.commitSha)}`,
			diff.parentCommitSha ? `Parent commit: ${boundedDiffContextValue(diff.parentCommitSha)}` : void 0,
			diff.filePath ? `File: ${boundedDiffContextValue(diff.filePath)}` : void 0,
			diff.sourceBranch && diff.targetBranch ? `Branches: ${boundedDiffContextValue(diff.sourceBranch)} -> ${boundedDiffContextValue(diff.targetBranch)}` : void 0,
			diff.pullRequestNumber ? `Pull request: #${diff.pullRequestNumber}` : void 0,
			diff.language ? `Language: ${boundedDiffContextValue(diff.language)}` : void 0,
			diff.description ? `Description: ${boundedDiffContextValue(diff.description)}` : void 0,
			diff.altText ? `Alt text: ${boundedDiffContextValue(diff.altText)}` : void 0,
			diff.truncated ? "Truncated: yes" : void 0
		].filter((line) => Boolean(line)),
		"",
		"Unified diff:"
	].join("\n");
	const fullContext = `${prefix}\n${message.text}`;
	if (fullContext.length <= BUZZ_DIFF_AGENT_CONTEXT_MAX_CHARS) return fullContext;
	const bodyBudget = BUZZ_DIFF_AGENT_CONTEXT_MAX_CHARS - prefix.length - 1 - 43;
	if (bodyBudget <= 0) return `${truncateUtf16Safe(prefix, 3957).trimEnd()}${BUZZ_DIFF_AGENT_CONTEXT_TRUNCATED_SUFFIX}`;
	return `${prefix}\n${truncateUtf16Safe(message.text, bodyBudget).trimEnd()}${BUZZ_DIFF_AGENT_CONTEXT_TRUNCATED_SUFFIX}`;
}
function parseBuzzMessageEvent(event) {
	if (!isBuzzInboundMessageKind(event.kind) || !event.content.trim() || Buffer.byteLength(event.content, "utf8") > (event.kind === 40008 ? BUZZ_DIFF_CONTENT_MAX_BYTES : BUZZ_MESSAGE_CONTENT_MAX_BYTES)) return null;
	const channelId = tagValue(event, "h");
	if (!channelId) return null;
	const rootId = markerTagValue(event, "root");
	const replyToId = markerTagValue(event, "reply");
	const kind = event.kind;
	const diff = kind === 40008 ? parseBuzzDiffMetadata(event) : void 0;
	if (kind === 40008 && !diff) return null;
	const mentionTagValues = event.tags.filter((tag) => tag[0] === "p" && Boolean(tag[1])).map((tag) => tag[1].trim().toLowerCase()).filter(Boolean);
	if (mentionTagValues.length > 50) return null;
	const mentionedPubkeys = [...new Set(mentionTagValues)];
	return {
		id: event.id,
		kind,
		senderPubkey: event.pubkey,
		text: event.content,
		channelId,
		createdAt: event.created_at,
		threadId: rootId ?? replyToId,
		replyToId,
		mentionedPubkeys,
		...diff ? { diff } : {}
	};
}
function buildBuzzMessageTags(params) {
	const tags = [["h", params.channelId]];
	const parentId = params.replyToId ?? params.threadId;
	if (params.threadId && parentId !== params.threadId) tags.push([
		"e",
		params.threadId,
		"",
		"root"
	]);
	if (parentId) tags.push([
		"e",
		parentId,
		"",
		"reply"
	]);
	const mentionedPubkeys = [...new Set((params.mentionedPubkeys ?? []).map((publicKey) => publicKey.trim().toLowerCase()))];
	if (mentionedPubkeys.length > 50) throw new Error(`Buzz messages support at most 50 mentions`);
	for (const publicKey of mentionedPubkeys) {
		if (!HEX_PUBLIC_KEY_PATTERN.test(publicKey)) throw new Error("Buzz mentions require 64-character hex public keys");
		tags.push(["p", publicKey]);
	}
	return tags;
}
//#endregion
export { formatBuzzMessageForAgent as a, inspectBuzzMentionSyntax as c, buildBuzzMessageTags as i, resolveBuzzMessageMentions as l, BUZZ_INBOUND_MESSAGE_KINDS as n, isBuzzInboundMessageKind as o, BUZZ_TYPING_INDICATOR_KIND as r, parseBuzzMessageEvent as s, BUZZ_DIFF_MESSAGE_KIND as t };
