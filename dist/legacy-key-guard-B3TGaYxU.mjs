import { d as toStringifiedError } from "./error-coercion-C787aVxk.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { t as WebSocket } from "./websocket-CGHaToS5.mjs";
import { h as readProviderTextResponse, m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-BOG6Do5a.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./channel-secret-basic-runtime-jo9e3YPL.mjs";
import "./logging-core-CUJDGfv-.mjs";
import "./extension-shared-N0S3ppSB.mjs";
import "./provider-http-Dn9NddwC.mjs";
import "./state-paths-Bk2vDLZh.mjs";
import { L as bytesToHex, X as utf8ToBytes, b as fromBase64url, c as admitVerdict, f as guardInstructions, g as base64, h as sha256Hex, i as normalizeReefTarget, l as assertGuardRules, m as canonicalBytes, s as admitGuardAdapter, u as assertPinnedModel, v as decodeUtf8, x as sha256, y as fromBase64 } from "./config-schema-CDfLULtN.mjs";
import { at as validateMessageBody, ct as parseHandleEpoch, et as ReplayedError, it as validateEnvelopeMetadata, lt as signDeviceRequest, mt as ed25519, nt as openClaimed, ot as fingerprint, r as resolveLegacyReefStateDir, rt as seal, tt as bodyHash, ut as appendAudit } from "./doctor-state-paths-DpN9dGtt.mjs";
import fs from "node:fs/promises";
import os from "node:os";
//#region extensions/reef/protocol/checks.ts
const MAX_BYTES = 32768;
const rules = [
	["private_key", /-----BEGIN (?:[A-Z0-9 ]+ )?PRIVATE KEY-----/],
	["openai_key", /\bsk-[A-Za-z0-9_-]{16,}\b/],
	["github_token", /\b(?:ghp|gho)_[A-Za-z0-9]{20,}\b/],
	["aws_access_key", /\bAKIA[0-9A-Z]{16}\b/],
	["slack_token", /\bxox[bap]-[A-Za-z0-9-]{12,}\b/],
	["jwt", /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/]
];
function deterministicChecks(input) {
	let text;
	let bytes;
	try {
		if (typeof input === "string") {
			text = input;
			bytes = utf8ToBytes(input);
			if (decodeUtf8(bytes) !== input) throw new Error();
		} else {
			bytes = input;
			text = decodeUtf8(input);
		}
	} catch {
		return {
			allowed: false,
			findings: [{
				code: "invalid_utf8",
				decision: "deny"
			}]
		};
	}
	if (bytes.length > MAX_BYTES) return {
		allowed: false,
		text,
		findings: [{
			code: "too_large",
			decision: "deny"
		}]
	};
	const findings = [];
	for (const [code, pattern] of rules) if (pattern.test(text)) findings.push({
		code,
		decision: "deny"
	});
	if (hasHighEntropyToken(text)) findings.push({
		code: "high_entropy_token",
		decision: "deny"
	});
	return {
		allowed: findings.length === 0,
		text,
		findings
	};
}
function hasHighEntropyToken(text) {
	if ((text.match(/\b[A-Fa-f0-9]{32,}\b/g) ?? []).some((candidate) => {
		if (/^(?:[0-9]+|[a-f]+)$/i.test(candidate) && new Set(candidate.toLowerCase()).size < 8) return false;
		return shannonEntropy(candidate) >= 3.5;
	})) return true;
	return (text.match(/\b[A-Za-z0-9+_=]{32,}\b/g) ?? []).some((candidate) => /[A-Za-z]/.test(candidate) && /[0-9]/.test(candidate) && shannonEntropy(candidate) >= 4);
}
function shannonEntropy(value) {
	const counts = /* @__PURE__ */ new Map();
	for (const character of value) counts.set(character, (counts.get(character) ?? 0) + 1);
	let entropy = 0;
	for (const count of counts.values()) {
		const probability = count / value.length;
		entropy -= probability * Math.log2(probability);
	}
	return entropy;
}
//#endregion
//#region extensions/reef/protocol/guard-adapters.ts
const verdictSchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		decision: {
			type: "string",
			enum: [
				"allow",
				"deny",
				"review"
			]
		},
		category: { type: "string" },
		reason: { type: "string" },
		policyVersion: { type: "string" }
	},
	required: [
		"decision",
		"category",
		"reason",
		"policyVersion"
	]
};
const OPENAI_DATED_MODEL_ID = /-(?:\d{8}|\d{4}-\d{2}-\d{2})$/;
const OPENAI_DATED_MODEL_SUFFIX = /^-(?:\d{8}|\d{4}-\d{2}-\d{2})$/;
function matchesOpenAiPinnedModel(responseModel, pinnedModel) {
	if (responseModel === void 0) return false;
	if (responseModel === pinnedModel) return true;
	return !OPENAI_DATED_MODEL_ID.test(pinnedModel) && responseModel.startsWith(pinnedModel) && OPENAI_DATED_MODEL_SUFFIX.test(responseModel.slice(pinnedModel.length));
}
function createOpenAiGuard(options) {
	assertPinnedModel(options.pinnedModel);
	assertGuardRules(options.rules);
	const raw = {
		providerId: "openai",
		pinnedModel: options.pinnedModel,
		async classifyRaw(request, signal) {
			const response = await options.fetch("https://api.openai.com/v1/responses", {
				method: "POST",
				signal,
				headers: {
					"content-type": "application/json",
					authorization: `Bearer ${options.apiKey}`
				},
				body: JSON.stringify({
					model: options.pinnedModel,
					instructions: instructionFor(request, options.rules),
					input: JSON.stringify(request),
					store: false,
					background: false,
					tools: [],
					text: { format: {
						type: "json_schema",
						name: "reef_guard_verdict",
						strict: true,
						schema: verdictSchema
					} }
				})
			});
			if (!response.ok) {
				await response.body?.cancel().catch(() => void 0);
				throw new Error(`guard HTTP ${response.status}`);
			}
			const envelope = await parseJsonResponse(response);
			if (!isRecord(envelope) || typeof envelope.model !== "string" || envelope.model !== options.pinnedModel || envelope.status !== "completed" || !Array.isArray(envelope.output)) throw new Error("invalid OpenAI guard response");
			const outputTexts = [];
			for (const item of envelope.output) {
				if (!isRecord(item) || item.type !== "message" || !Array.isArray(item.content)) continue;
				for (const part of item.content) if (isRecord(part) && part.type === "output_text" && typeof part.text === "string") outputTexts.push(part.text);
			}
			if (outputTexts.length !== 1) throw new Error("guard must return one OpenAI output object");
			return attachProviderModel(parseStrictJson(outputTexts[0], true), envelope.model);
		}
	};
	return admitGuardAdapter(raw, options.timeoutMs);
}
function createHostOpenAiGuard(options) {
	assertPinnedModel(options.pinnedModel);
	assertGuardRules(options.rules);
	const raw = {
		providerId: "openai",
		pinnedModel: options.pinnedModel,
		async classifyRaw(request, signal) {
			const result = await options.complete({
				systemPrompt: `${instructionFor(request, options.rules)} The object must exactly match this schema: ${JSON.stringify(verdictSchema)}`,
				input: JSON.stringify(request),
				maxTokens: 512,
				responseFormat: {
					type: "json_schema",
					json_schema: {
						name: "reef_guard_verdict",
						strict: true,
						schema: verdictSchema
					}
				},
				signal
			});
			if (result.provider !== "openai" || result.model !== options.pinnedModel || !matchesOpenAiPinnedModel(result.responseModel, options.pinnedModel) || result.stopReason !== "stop") throw new Error("invalid host OpenAI guard response");
			return attachProviderModel(parseStrictJson(result.text, true), options.pinnedModel);
		}
	};
	return admitGuardAdapter(raw, options.timeoutMs);
}
function createAnthropicGuard(options) {
	assertPinnedModel(options.pinnedModel);
	assertGuardRules(options.rules);
	const raw = {
		providerId: "anthropic",
		pinnedModel: options.pinnedModel,
		async classifyRaw(request, signal) {
			const response = await options.fetch("https://api.anthropic.com/v1/messages", {
				method: "POST",
				signal,
				headers: {
					"content-type": "application/json",
					"x-api-key": options.apiKey,
					"anthropic-version": "2023-06-01"
				},
				body: JSON.stringify({
					model: options.pinnedModel,
					max_tokens: 512,
					system: `${instructionFor(request, options.rules)} The object must exactly match this schema: ${JSON.stringify(verdictSchema)}`,
					output_config: { format: {
						type: "json_schema",
						schema: verdictSchema
					} },
					messages: [{
						role: "user",
						content: JSON.stringify(request)
					}]
				})
			});
			if (!response.ok) {
				await response.body?.cancel().catch(() => void 0);
				throw new Error(`guard HTTP ${response.status}`);
			}
			const envelope = await parseJsonResponse(response);
			if (!isRecord(envelope) || typeof envelope.model !== "string" || envelope.model !== options.pinnedModel || !Array.isArray(envelope.content) || envelope.stop_reason !== "end_turn") throw new Error("invalid Anthropic guard response");
			if (envelope.content.length !== 1) throw new Error("invalid Anthropic guard content");
			const part = envelope.content[0];
			if (!isRecord(part) || part.type !== "text" || typeof part.text !== "string") throw new Error("missing Anthropic guard output");
			return attachProviderModel(parseStrictJson(part.text, true), envelope.model);
		}
	};
	return admitGuardAdapter(raw, options.timeoutMs);
}
function instructionFor(request, rules) {
	return `${guardInstructions(request.direction, rules)} Set policyVersion to exactly ${JSON.stringify(request.policyVersion)}.`;
}
function attachProviderModel(value, model) {
	if (!isRecord(value) || Object.hasOwn(value, "model")) throw new Error("invalid model guard verdict");
	return {
		...value,
		model
	};
}
async function parseJsonResponse(response) {
	return parseStrictJson(await readProviderTextResponse(response, "Reef guard response", { maxBytes: 262144 }));
}
function parseStrictJson(text, rejectDuplicateKeys = false) {
	const trimmed = text.trim();
	if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) throw new Error("guard returned non-object JSON");
	if (rejectDuplicateKeys && hasDuplicateKeys(trimmed)) throw new Error("guard returned duplicate JSON keys");
	return JSON.parse(trimmed);
}
function hasDuplicateKeys(text) {
	const keys = /* @__PURE__ */ new Set();
	for (let index = 0; index < text.length; index++) {
		if (text[index] !== "\"") continue;
		const start = index;
		for (index++; index < text.length; index++) if (text[index] === "\\") index++;
		else if (text[index] === "\"") break;
		let next = index + 1;
		while (/\s/.test(text[next] ?? "")) next++;
		if (text[next] !== ":") continue;
		const key = JSON.parse(text.slice(start, index + 1));
		if (keys.has(key)) return true;
		keys.add(key);
	}
	return false;
}
//#endregion
//#region extensions/reef/protocol/receipts.ts
var InvalidDeliveryReceiptError = class extends Error {
	constructor() {
		super("invalid delivery receipt");
		this.name = "InvalidDeliveryReceiptError";
	}
};
function signReceipt(body, recipientSigningSecretKey) {
	validateReceiptBody(body);
	return {
		...body,
		signature: base64(ed25519.sign(canonicalBytes(body), fromBase64url(recipientSigningSecretKey)))
	};
}
function verifyReceipt(receipt, recipientSigningPublicKey) {
	try {
		validateSignedReceipt(receipt);
		const { signature, ...body } = receipt;
		return ed25519.verify(fromBase64(signature), canonicalBytes(body), fromBase64url(recipientSigningPublicKey));
	} catch {
		return false;
	}
}
async function confirmDelivery(receipt, recipientSigningPublicKey, audit, expected) {
	if (!verifyReceipt(receipt, recipientSigningPublicKey) || expected?.id !== void 0 && receipt.id !== expected.id || expected?.bodyHash !== void 0 && receipt.bodyHash !== expected.bodyHash || expected?.status !== void 0 && receipt.status !== expected.status) throw new InvalidDeliveryReceiptError();
	return appendAudit(audit, "confirm_delivery", {
		receipt,
		status: receipt.status,
		...receipt.category ? { category: receipt.category } : {}
	});
}
function validateReceiptBody(value) {
	if (!isExactReceiptObject(value, false) || typeof value.id !== "string" || !/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(value.id) || typeof value.bodyHash !== "string" || !/^[0-9a-f]{64}$/.test(value.bodyHash) || typeof value.auditHead !== "string" || !/^[0-9a-f]{64}$/.test(value.auditHead) || value.status !== "accepted" && value.status !== "rejected" || Object.hasOwn(value, "category") && (typeof value.category !== "string" || value.category.length < 1 || value.category.length > 64)) throw new Error("invalid receipt");
}
function validateSignedReceipt(value) {
	if (!isExactReceiptObject(value, true) || typeof value.signature !== "string" || value.signature.length !== 88) throw new Error("invalid receipt");
	const { signature, ...body } = value;
	validateReceiptBody(body);
	if (fromBase64(signature).length !== 64) throw new Error("invalid receipt");
}
function isExactReceiptObject(value, signed) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
	const required = signed ? [
		"id",
		"bodyHash",
		"auditHead",
		"status",
		"signature"
	] : [
		"id",
		"bodyHash",
		"auditHead",
		"status"
	];
	const allowed = /* @__PURE__ */ new Set([...required, "category"]);
	const keys = Object.keys(value);
	return required.every((key) => Object.hasOwn(value, key)) && keys.every((key) => allowed.has(key));
}
//#endregion
//#region extensions/reef/protocol/pipeline.ts
var PipelineError = class extends Error {
	constructor(stage, message, verdict, receipt, reviewOutcome, approvalDigest) {
		super(message);
		this.stage = stage;
		this.verdict = verdict;
		this.receipt = receipt;
		this.reviewOutcome = reviewOutcome;
		this.approvalDigest = approvalDigest;
		this.name = "PipelineError";
	}
};
async function composeOutbound(options) {
	validateEnvelopeMetadata(options.id, options.from, options.to, options.ts ?? Math.floor(Date.now() / 1e3));
	validateMessageBody(options.body);
	if (fromBase64url(options.senderSigningSecretKey).length !== 32 || fromBase64url(options.recipientEncryptionPublicKey).length !== 32) throw new Error("invalid outbound key material");
	const checks = deterministicChecks(options.body.text);
	if (checks.findings.some((finding) => finding.code === "invalid_utf8" || finding.code === "too_large")) throw new PipelineError("deterministic", "invalid outbound message");
	const proposalHash = bodyHash(options.body);
	const approvalDigest = computeApprovalDigest(options.id, options.from, options.to, "outbound", proposalHash, options.policyVersion);
	await appendAudit(options.audit, "proposal", {
		id: options.id,
		from: options.from,
		to: options.to,
		bodyHash: proposalHash,
		approvalDigest,
		body: options.body
	});
	if (!checks.allowed) {
		await appendAudit(options.audit, "deterministic_verdict", {
			id: options.id,
			approvalDigest,
			decision: "deny",
			findings: checks.findings
		});
		throw new PipelineError("deterministic", "deterministic checks denied message");
	}
	const verdict = await classifyWithReview(options, "outbound", options.id, proposalHash, approvalDigest, options.from, options.to, options.body.text);
	const envelope = seal(options);
	await appendAudit(options.audit, "envelope", {
		id: options.id,
		approvalDigest,
		envelope
	});
	return {
		envelope,
		verdict
	};
}
const REPLAY_CLAIM_HEARTBEAT_MS = 6e4;
async function composeInbound(options) {
	const opened = await openClaimed(options);
	if (opened.claim === "duplicate") {
		if (opened.receipt === void 0) throw new ReplayedError("duplicate envelope");
		return opened.body === void 0 ? {
			disposition: "duplicate",
			receipt: opened.receipt
		} : {
			disposition: "duplicate",
			body: opened.body,
			receipt: opened.receipt
		};
	}
	let finalized = false;
	const peer = parseHandleEpoch(options.envelope.from).handle;
	const refreshClaim = async () => {
		await options.replayStore.refresh?.(peer, options.envelope.id);
	};
	const pendingRefreshes = /* @__PURE__ */ new Set();
	const heartbeat = options.replayStore.refresh ? setInterval(() => {
		const pending = refreshClaim().catch(() => void 0);
		pendingRefreshes.add(pending);
		pending.then(() => pendingRefreshes.delete(pending));
	}, REPLAY_CLAIM_HEARTBEAT_MS) : void 0;
	heartbeat?.unref?.();
	try {
		const proposalHash = bodyHash(opened.body);
		const approvalDigest = computeApprovalDigest(options.envelope.id, options.envelope.from, options.self, "inbound", proposalHash, options.policyVersion);
		const checks = deterministicChecks(opened.body.text);
		if (!checks.allowed) {
			await refreshClaim();
			await appendAudit(options.audit, "deterministic_verdict", {
				id: options.envelope.id,
				approvalDigest,
				decision: "deny",
				findings: checks.findings
			});
			const receipt = await completeRejection(options, peer, proposalHash, approvalDigest, "deterministic_deny");
			finalized = true;
			throw new PipelineError("deterministic", "deterministic checks denied message", void 0, receipt);
		}
		let verdict;
		try {
			verdict = await classifyWithReview(options, "inbound", options.envelope.id, proposalHash, approvalDigest, options.envelope.from, options.self, opened.body.text);
		} catch (error) {
			if (error instanceof PipelineError && error.stage === "guard" && error.verdict?.decision === "deny") {
				if (error.verdict.category === "guard_failure") throw error;
				await refreshClaim();
				const receipt = await completeRejection(options, peer, proposalHash, approvalDigest, "guard_deny");
				finalized = true;
				throw new PipelineError("guard", error.message, error.verdict, receipt);
			}
			if (error instanceof PipelineError && error.stage === "review" && error.reviewOutcome === "denied") {
				await refreshClaim();
				const receipt = await completeRejection(options, peer, proposalHash, approvalDigest, "review_denied");
				finalized = true;
				throw new PipelineError("review", error.message, error.verdict, receipt, "denied", approvalDigest);
			}
			throw error;
		}
		await refreshClaim();
		const inboxEntry = await appendAudit(options.audit, "inbox", {
			id: options.envelope.id,
			bodyHash: proposalHash,
			approvalDigest,
			text: opened.body.text,
			verdict
		});
		const receipt = signReceipt({
			id: options.envelope.id,
			bodyHash: proposalHash,
			auditHead: inboxEntry.entryHash,
			status: "accepted"
		}, options.recipientSigningSecretKey);
		await appendAudit(options.audit, "receipt", {
			id: options.envelope.id,
			approvalDigest,
			receipt
		});
		await options.replayStore.complete(peer, options.envelope.id, receipt, opened.body);
		finalized = true;
		return {
			disposition: "accepted",
			body: opened.body,
			verdict,
			receipt
		};
	} catch (error) {
		if (!finalized) await options.replayStore.release(peer, options.envelope.id);
		throw error;
	} finally {
		if (heartbeat) clearInterval(heartbeat);
		await Promise.all(pendingRefreshes);
	}
}
async function completeRejection(options, peer, proposalHash, approvalDigest, category) {
	const rejectionEntry = await appendAudit(options.audit, "inbox_rejected", {
		id: options.envelope.id,
		bodyHash: proposalHash,
		approvalDigest,
		decision: "deny",
		category
	});
	const receipt = signReceipt({
		id: options.envelope.id,
		bodyHash: proposalHash,
		auditHead: rejectionEntry.entryHash,
		status: "rejected",
		category
	}, options.recipientSigningSecretKey);
	await appendAudit(options.audit, "receipt", {
		id: options.envelope.id,
		approvalDigest,
		receipt
	});
	await options.replayStore.complete(peer, options.envelope.id, receipt);
	return receipt;
}
async function classifyWithReview(options, direction, id, proposalHash, approvalDigest, source, destination, text) {
	const request = {
		direction,
		source,
		destination,
		text,
		policyVersion: options.policyVersion
	};
	const existingDecision = await options.reviewGate?.lookup(approvalDigest) ?? "none";
	if (existingDecision === "pending") throw new PipelineError("review", "review approval pending", void 0, void 0, "pending", approvalDigest);
	if (existingDecision !== "none" && !existingDecision.approved) throw new PipelineError("review", "review explicitly denied", void 0, void 0, "denied", approvalDigest);
	if (existingDecision !== "none") return classifyApprovedDelivery(options, request, {
		id,
		direction,
		source,
		destination,
		proposalHash,
		approvalDigest
	});
	const verdict = admitVerdict(await options.guard.classify(request), options.guard.pinnedModel, request.policyVersion);
	await appendAudit(options.audit, "guard_verdict", {
		id,
		from: source,
		to: destination,
		direction,
		bodyHash: proposalHash,
		approvalDigest,
		...verdict
	});
	if (verdict.decision === "deny") throw new PipelineError("guard", direction === "outbound" ? "Reef outbound guard denied the message. Do not retry or rephrase it automatically; ask the owner before sending related content." : "guard denied message", verdict);
	if (verdict.decision === "review") {
		const approval = await options.reviewGate?.request({
			id,
			from: source,
			to: destination,
			direction,
			bodyHash: proposalHash,
			approvalDigest,
			verdict
		});
		if (approval === void 0) throw new PipelineError("review", "review approval pending", verdict, void 0, "pending", approvalDigest);
		if (approval.approvalDigest !== approvalDigest) throw new PipelineError("review", "approval digest mismatch", verdict, void 0, "pending", approvalDigest);
		if (!approval.approved) throw new PipelineError("review", "review explicitly denied", verdict, void 0, "denied", approvalDigest);
		return classifyApprovedDelivery(options, request, {
			id,
			direction,
			source,
			destination,
			proposalHash,
			approvalDigest
		});
	}
	return verdict;
}
async function classifyApprovedDelivery(options, request, context) {
	await appendAudit(options.audit, "review_approval", {
		id: context.id,
		from: context.source,
		to: context.destination,
		direction: context.direction,
		bodyHash: context.proposalHash,
		approvalDigest: context.approvalDigest,
		approved: true
	});
	const verdict = admitVerdict(await options.guard.classify(request), options.guard.pinnedModel, request.policyVersion);
	await appendAudit(options.audit, "guard_verdict", {
		id: context.id,
		from: context.source,
		to: context.destination,
		direction: context.direction,
		bodyHash: context.proposalHash,
		approvalDigest: context.approvalDigest,
		afterApproval: true,
		...verdict
	});
	if (verdict.decision === "deny") throw new PipelineError("guard", "guard denied approved message", verdict);
	return verdict;
}
function computeApprovalDigest(id, from, to, direction, proposalHash, policyVersion) {
	return bytesToHex(sha256(canonicalBytes({
		id,
		from,
		to,
		direction,
		bodyHash: proposalHash,
		policyVersion
	})));
}
//#endregion
//#region extensions/reef/src/transport.ts
const REEF_RELAY_JSON_MAX_BYTES = 16777216;
const REEF_RELAY_ERROR_JSON_MAX_BYTES = 65536;
const REEF_RELAY_ERROR_CODE_PATTERN = /^[a-z][a-z0-9_]{0,127}$/;
const REEF_RELAY_WEBSOCKET_MAX_PAYLOAD_BYTES = 65536;
const REEF_INBOX_LIVE_BUFFER_MAX_ENTRIES = 256;
const REEF_INBOX_REST_PAGE_SIZE = 200;
const REEF_WS_HANDSHAKE_MS = 3e4;
const REEF_INBOX_KEEPALIVE_MS = 45e3;
const REEF_RELAY_REQUEST_TIMEOUT_MS = 15e3;
function redactReefRelayErrorMessage(message, secrets) {
	let redacted = message;
	for (const secret of secrets) if (secret.length > 0) redacted = redacted.replaceAll(secret, "<redacted>");
	return redactSensitiveText(redacted, { mode: "tools" });
}
var ReefRelayError = class extends Error {
	constructor(status, message, code) {
		super(message);
		this.status = status;
		this.code = code;
		this.name = "ReefRelayError";
	}
};
var ReefProtocolCompatibilityError = class extends ReefRelayError {
	constructor(status, code, upgradeRequired, message) {
		super(status, message, code);
		this.upgradeRequired = upgradeRequired;
		this.name = "ReefProtocolCompatibilityError";
	}
};
var ReefRelayUnavailableError = class extends Error {
	constructor(cause) {
		super(cause instanceof Error ? cause.message : String(cause), { cause });
		this.name = "ReefRelayUnavailableError";
	}
};
function isDefinitiveReefRegistrationFailure(error) {
	return error instanceof ReefRelayError && error.status >= 400 && error.status < 500 && error.status !== 408 && error.status !== 429;
}
function isRetryableReefRelayFailure(error) {
	if (error instanceof ReefRelayError) return error.status === 408 || error.status === 429 || error.status >= 500;
	return error instanceof ReefRelayUnavailableError || error instanceof Error && error.name === "TimeoutError";
}
function isReefOwnershipRejection(error) {
	return error instanceof ReefRelayError && error.message === "unknown_handle";
}
async function readReefRelaySuccessJson(response, signal) {
	try {
		return await readProviderJsonResponse(response, "reef.relay", { maxBytes: REEF_RELAY_JSON_MAX_BYTES });
	} catch (error) {
		if (signal?.aborted) throw signal.reason;
		if (error instanceof TypeError) throw new ReefRelayUnavailableError(error);
		throw error;
	}
}
var ReefTransportClient = class {
	constructor(relayUrl, handle, keys, fetcher = fetch, clock = () => Math.floor(Date.now() / 1e3), requestTimeoutMs = REEF_RELAY_REQUEST_TIMEOUT_MS) {
		this.relayUrl = relayUrl;
		this.handle = handle;
		this.keys = keys;
		this.fetcher = fetcher;
		this.clock = clock;
		this.requestTimeoutMs = requestTimeoutMs;
		this.lastTs = 0;
	}
	async authStart(email) {
		return await this.unsigned("POST", "/v1/auth/start", { email });
	}
	async authComplete(token) {
		return await this.unsigned("POST", "/v1/auth/complete", { token }, {}, [token]);
	}
	async createHandle(session, requestPolicy) {
		return await this.unsigned("POST", "/v1/handles", {
			handle: this.handle,
			ed25519_pub: this.keys.signing.publicKey,
			x25519_pub: this.keys.encryption.publicKey,
			request_policy: requestPolicy
		}, { authorization: `Bearer ${session}` }, [session]);
	}
	listOwnHandles(session) {
		return this.unsigned("GET", "/v1/handles", void 0, { authorization: `Bearer ${session}` }, [session]);
	}
	mintFriendCode(signal) {
		return this.signed("POST", "/v1/friend-codes", void 0, signal);
	}
	requestFriend(to, code, signal) {
		return this.signed("POST", "/v1/friends/request", code ? {
			to,
			code
		} : { to }, signal, code ? [code] : []);
	}
	async respondFriend(friend, accept, signal) {
		const request = {
			peer: friend.peer,
			accept,
			expected_key_epoch: friend.key_epoch,
			expected_ed25519_pub: friend.ed25519_pub,
			expected_x25519_pub: friend.x25519_pub
		};
		let result;
		try {
			result = await this.signed("POST", "/v1/friends/respond", request, signal);
		} catch (error) {
			if (error instanceof ReefRelayError && error.status === 400 && error.code === "invalid_request") throw new ReefProtocolCompatibilityError(400, error.code, "reef-relay", "The Reef relay is likely incompatible or outdated. Update OpenClaw and the Reef relay together, then approve the fresh pairing challenge again.");
			if (error instanceof ReefRelayError && error.status === 409 && error.code === "client_upgrade_required") throw new ReefProtocolCompatibilityError(409, error.code, "openclaw-client", "OpenClaw is outdated for this Reef relay. Update OpenClaw, then approve the fresh pairing challenge again.");
			throw error;
		}
		const status = accept ? "active" : "blocked";
		if (!isRecord(result) || result.peer !== friend.peer || result.status !== status) throw new Error("invalid Reef relay friendship response");
		return {
			peer: friend.peer,
			status
		};
	}
	listFriends(signal) {
		return this.signed("GET", "/v1/friends", void 0, signal);
	}
	removeFriend(peer, signal) {
		return this.signed("DELETE", `/v1/friends/${encodeURIComponent(peer)}`, void 0, signal);
	}
	sendEnvelope(peer, envelope, signal) {
		return this.signed("POST", `/v1/mail/${encodeURIComponent(peer)}`, envelope, signal);
	}
	acknowledge(peer, id, receipt) {
		return this.signed("POST", `/v1/mail/${encodeURIComponent(peer)}/ack`, {
			id,
			receipt
		});
	}
	pull(after, signal) {
		return this.signed("GET", `/v1/mail?after=${after}`, void 0, signal);
	}
	websocketUrl() {
		const path = "/v1/mail/ws";
		const auth = this.auth(path, /* @__PURE__ */ new Uint8Array(), "GET");
		const url = new URL(path, this.relayUrl);
		url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
		url.searchParams.set("handle", this.handle);
		url.searchParams.set("ts", String(auth.ts));
		url.searchParams.set("sig", auth.signature);
		return url.toString();
	}
	async signed(method, path, body, signal, secrets = []) {
		const bytes = body === void 0 ? /* @__PURE__ */ new Uint8Array() : utf8ToBytes(JSON.stringify(body));
		const auth = this.auth(path, bytes, method);
		return await this.request(method, path, bytes, {
			"x-reef-handle": this.handle,
			"x-reef-ts": String(auth.ts),
			"x-reef-sig": auth.signature
		}, signal, [auth.signature, ...secrets]);
	}
	auth(path, bytes, method) {
		const ts = Math.max(this.clock(), this.lastTs + 1);
		this.lastTs = ts;
		return {
			ts,
			signature: signDeviceRequest({
				method: method.toUpperCase(),
				path,
				ts,
				bodySha256: sha256Hex(bytes)
			}, this.keys.signing.secretKey)
		};
	}
	async unsigned(method, path, body, headers = {}, secrets = []) {
		const bytes = body === void 0 ? /* @__PURE__ */ new Uint8Array() : utf8ToBytes(JSON.stringify(body));
		return await this.request(method, path, bytes, headers, void 0, secrets);
	}
	async request(method, path, bytes, headers, signal, secrets = []) {
		const url = new URL(path, this.relayUrl).toString();
		const timeout = buildTimeoutAbortSignal({
			timeoutMs: this.requestTimeoutMs,
			signal,
			operation: "reef.relay",
			url
		});
		try {
			let response;
			try {
				response = await this.fetcher(url, {
					method,
					headers: {
						...headers,
						...bytes.length ? { "content-type": "application/json" } : {}
					},
					...bytes.length ? { body: bytes } : {},
					signal: timeout.signal
				});
			} catch (error) {
				if (timeout.signal?.aborted) throw timeout.signal.reason;
				throw new ReefRelayUnavailableError(error);
			}
			if (!response.ok) {
				let message = `relay HTTP ${response.status}`;
				let code;
				try {
					const parsed = await readProviderJsonResponse(response, "reef.relay.error", { maxBytes: REEF_RELAY_ERROR_JSON_MAX_BYTES });
					if (isRecord(parsed) && typeof parsed.error === "string" && parsed.error) {
						message = redactReefRelayErrorMessage(parsed.error, secrets);
						if (REEF_RELAY_ERROR_CODE_PATTERN.test(parsed.error)) code = parsed.error;
					}
				} catch {
					if (timeout.signal?.aborted) throw timeout.signal.reason;
				}
				throw new ReefRelayError(response.status, message, code);
			}
			if (response.status === 204) return;
			return await readReefRelaySuccessJson(response, timeout.signal);
		} finally {
			timeout.cleanup();
		}
	}
};
/**
* An inbox entry whose processing parked instead of completing: a pending owner
* review, or a transient guard failure. The entry stays un-acked at the relay,
* the durable cursor holds before it, and the next poll re-attempts it. The
* socket stays up and no error surfaces — this is a waiting state, not a fault.
*/
var ReefInboxEntryParkedError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ReefInboxEntryParkedError";
	}
};
function createReefWebSocket(url, options = {}) {
	return new WebSocket(url, {
		maxPayload: REEF_RELAY_WEBSOCKET_MAX_PAYLOAD_BYTES,
		handshakeTimeout: options.handshakeTimeoutMs ?? REEF_WS_HANDSHAKE_MS
	});
}
function abortableSleep(ms, signal) {
	return new Promise((resolve) => {
		if (signal?.aborted) {
			resolve();
			return;
		}
		const timer = setTimeout(done, ms);
		function done() {
			clearTimeout(timer);
			signal?.removeEventListener("abort", done);
			resolve();
		}
		signal?.addEventListener("abort", done, { once: true });
	});
}
var ReefInboxConnection = class {
	constructor(client, onEntries, webSocketFactory, options = {}) {
		this.client = client;
		this.onEntries = onEntries;
		this.webSocketFactory = webSocketFactory;
		this.options = options;
		this.processing = Promise.resolve();
		this.stopped = false;
		this.parked = false;
		this.reconciledThrough = 0;
		this.processedAboveCursor = /* @__PURE__ */ new Set();
		const initialCursor = options.initialCursor ?? 0;
		if (!Number.isSafeInteger(initialCursor) || initialCursor < 0) throw new Error("invalid Reef inbox cursor");
		this.cursor = initialCursor;
	}
	async start(signal) {
		let delay = 250;
		for (;;) {
			if (this.stopped || signal?.aborted) {
				await this.processing;
				return;
			}
			try {
				await this.live(signal, () => {
					delay = 250;
				});
			} catch (error) {
				this.options.onError?.(toStringifiedError(error));
				await abortableSleep(delay, signal);
				delay = Math.min(delay * 2, 3e4);
			}
		}
	}
	stop() {
		this.stopped = true;
	}
	async drain(signal) {
		while (true) {
			signal?.throwIfAborted();
			const page = await this.client.pull(this.cursor, signal);
			signal?.throwIfAborted();
			if (!Number.isSafeInteger(page.cursor) || page.cursor < this.cursor) throw new Error("invalid Reef relay inbox cursor");
			const previous = this.cursor;
			const parked = await this.processEntries(page.entries, page.cursor, signal);
			signal?.throwIfAborted();
			if (!page.entries.length || this.cursor === previous) {
				this.parked = parked;
				return;
			}
		}
	}
	async processEntries(entries, cursor, signal) {
		let highestSequence = 0;
		for (const entry of entries) {
			if (!Number.isSafeInteger(entry.seq) || entry.seq < 1) throw new Error("invalid Reef relay inbox sequence");
			highestSequence = Math.max(highestSequence, entry.seq);
		}
		if (cursor !== void 0 && entries.length > 0 && cursor !== highestSequence) throw new Error("Reef relay inbox cursor does not match its entries");
		const fresh = entries.toSorted((left, right) => left.seq - right.seq);
		let parked = cursor === void 0 && this.parked;
		for (const entry of fresh) {
			if (entry.seq <= this.cursor || cursor === void 0 && entry.seq <= this.reconciledThrough) continue;
			signal?.throwIfAborted();
			if (!this.processedAboveCursor.has(entry.seq)) try {
				await this.onEntries([entry]);
			} catch (error) {
				if (error instanceof ReefInboxEntryParkedError) {
					this.parked = parked = true;
					continue;
				}
				throw error;
			}
			if (parked) this.processedAboveCursor.add(entry.seq);
			else await this.advanceCursor(entry.seq);
		}
		if (cursor !== void 0) {
			const retained = new Set(fresh.map((entry) => entry.seq));
			this.reconciledThrough = Math.max(this.reconciledThrough, cursor);
			for (const seq of this.processedAboveCursor) if ((seq <= cursor || fresh.length < REEF_INBOX_REST_PAGE_SIZE) && !retained.has(seq)) {
				this.processedAboveCursor.delete(seq);
				this.reconciledThrough = Math.max(this.reconciledThrough, seq);
			}
			if (fresh.length === 0) await this.advanceCursor(this.reconciledThrough);
		}
		return parked;
	}
	/**
	* Re-attempts parked entries over REST while the live socket stays up. The
	* reconcile loop calls this; after an owner decides a review (or a guard
	* outage ends) the next poll completes the delivery.
	*/
	async poll(signal) {
		if (this.stopped || signal?.aborted) return;
		await this.serialize(() => this.drain(signal));
	}
	async advanceCursor(cursor) {
		if (cursor <= this.cursor) return;
		await this.options.persistCursor?.(cursor);
		if (cursor <= this.cursor) return;
		this.cursor = cursor;
		for (const seq of this.processedAboveCursor) if (seq <= cursor) this.processedAboveCursor.delete(seq);
	}
	serialize(task) {
		const scheduled = this.processing.then(task);
		this.processing = scheduled.catch(() => {});
		return scheduled;
	}
	live(signal, onReady) {
		return new Promise((resolve, reject) => {
			const url = this.client.websocketUrl();
			const signature = new URL(url).searchParams.get("sig") ?? "";
			const socket = this.webSocketFactory(url);
			const workAbort = new AbortController();
			let finished = false;
			let disconnected = false;
			let aborting = false;
			let opened = false;
			let catchUpPending = false;
			let pumpScheduled = false;
			let awaitingPong = false;
			let keepalive;
			const bufferedEntries = [];
			const abortListener = () => {
				if (finished) return;
				aborting = true;
				markDisconnected();
				socket.close();
				this.processing.then(() => finish(), () => finish());
			};
			const finish = (error) => {
				if (finished) return;
				finished = true;
				if (keepalive !== void 0) clearInterval(keepalive);
				signal?.removeEventListener("abort", abortListener);
				if (error) reject(error);
				else resolve();
			};
			const markDisconnected = () => {
				if (disconnected) return;
				disconnected = true;
				bufferedEntries.length = 0;
				workAbort.abort();
				this.options.onState?.("disconnected");
			};
			const disconnect = (error) => {
				if (finished) return;
				markDisconnected();
				if (aborting) return;
				finish(error);
				if (error) socket.close();
			};
			const pump = () => {
				if (disconnected || !opened || pumpScheduled || !catchUpPending && bufferedEntries.length === 0) return;
				pumpScheduled = true;
				this.serialize(async () => {
					if (disconnected) return;
					if (catchUpPending) {
						catchUpPending = false;
						await this.drain(workAbort.signal);
						onReady?.();
					}
					while (bufferedEntries.length > 0) {
						if (disconnected) return;
						const entry = bufferedEntries.shift();
						if (!entry) return;
						await this.processEntries([entry], void 0, workAbort.signal);
					}
				}).then(() => {
					pumpScheduled = false;
					pump();
				}, (error) => {
					pumpScheduled = false;
					if (!disconnected) disconnect(toStringifiedError(error));
				});
			};
			signal?.addEventListener("abort", abortListener, { once: true });
			socket.addEventListener("open", () => {
				if (disconnected) return;
				opened = true;
				catchUpPending = true;
				keepalive = setInterval(() => {
					if (disconnected || finished) return;
					if (awaitingPong) {
						disconnect(/* @__PURE__ */ new Error("reef inbox keepalive timed out"));
						return;
					}
					awaitingPong = true;
					try {
						socket.send("ping");
					} catch (error) {
						disconnect(toStringifiedError(error));
					}
				}, REEF_INBOX_KEEPALIVE_MS);
				keepalive.unref?.();
				this.options.onState?.("connected");
				pump();
			});
			socket.addEventListener("message", (event) => {
				if (String(event.data) === "pong") {
					awaitingPong = false;
					return;
				}
				try {
					const frame = JSON.parse(String(event.data));
					if (frame.type !== "entry" || !frame.entry) return;
					if (bufferedEntries.length >= REEF_INBOX_LIVE_BUFFER_MAX_ENTRIES) {
						disconnect(/* @__PURE__ */ new Error("Reef inbox live buffer overflow; reconnecting for REST recovery"));
						return;
					}
					bufferedEntries.push(frame.entry);
					pump();
				} catch (error) {
					disconnect(toStringifiedError(error));
				}
			});
			socket.addEventListener("close", (event) => {
				if (aborting || finished) return;
				disconnect(reefInboxCloseError(event, [signature]));
			});
			socket.addEventListener("error", (event) => disconnect(new Error(event.message?.trim() || "reef inbox socket error")));
			if (signal?.aborted) abortListener();
		});
	}
};
function reefInboxCloseError(event, secrets = []) {
	const code = Number.isInteger(event.code) ? ` code=${event.code}` : "";
	const reason = event.reason?.trim() ? ` reason=${redactReefRelayErrorMessage(event.reason.trim(), secrets)}` : "";
	return /* @__PURE__ */ new Error(`reef inbox socket closed unexpectedly${code}${reason}`);
}
//#endregion
//#region extensions/reef/src/friends.ts
function keysChanged(local, remote) {
	return local.keyEpoch !== remote.key_epoch || local.ed25519PublicKey !== remote.ed25519_pub || local.x25519PublicKey !== remote.x25519_pub;
}
var ReefFriendManager = class {
	#mutations = Promise.resolve();
	constructor(transport, trust, pairing, authoritySignal) {
		this.transport = transport;
		this.trust = trust;
		this.pairing = pairing;
		this.authoritySignal = authoritySignal;
	}
	mintCode(assertOwnerCurrent) {
		return this.#serialize((signal) => {
			assertOwnerCurrent?.();
			return this.transport.mintFriendCode(signal);
		});
	}
	request(peer, code, assertOwnerCurrent) {
		return this.#serialize(async (signal) => {
			const normalized = normalizeReefTarget(peer);
			if (!normalized) throw new Error(`Invalid Reef peer handle: ${peer}`);
			assertOwnerCurrent?.();
			const requestId = this.trust.recordOutboundRequest(normalized);
			let result;
			try {
				result = await this.transport.requestFriend(normalized, code, signal);
			} catch (error) {
				if (error instanceof ReefRelayError && error.status >= 400 && error.status < 500 && error.status !== 409) this.trust.removeOutboundRequest(normalized, requestId);
				else if (this.trust.outboundRequestStatus(normalized, requestId) === "revoked") try {
					await this.transport.removeFriend(normalized);
				} catch (cleanupError) {
					throw new AggregateError([error, cleanupError], `Reef friend request to @${normalized} failed after concurrent revocation`, { cause: cleanupError });
				}
				throw error;
			}
			if (this.trust.outboundRequestStatus(normalized, requestId) === "revoked") {
				await this.transport.removeFriend(normalized);
				throw new Error(`Reef friend request to @${normalized} was concurrently revoked`);
			}
			return result;
		});
	}
	remove(peer, assertOwnerCurrent) {
		return this.#serialize(async () => {
			const normalized = normalizeReefTarget(peer);
			if (!normalized) throw new Error(`Invalid Reef peer handle: ${peer}`);
			assertOwnerCurrent?.();
			this.trust.remove(normalized);
			const failures = (await Promise.allSettled([this.#removePairingApprovalsForPeer(normalized), this.#removeRelayAndRefence(normalized)])).flatMap((result) => result.status === "rejected" ? [result.reason instanceof Error ? result.reason : new Error("Reef friendship removal failed", { cause: result.reason })] : []);
			if (failures.length === 1) throw failures[0];
			if (failures.length > 1) throw new AggregateError(failures, "Reef friendship removal failed");
		});
	}
	setAutonomy(peer, autonomy, assertOwnerCurrent) {
		return this.#serialize(() => {
			assertOwnerCurrent?.();
			this.trust.setAutonomy(peer, autonomy);
		});
	}
	async list() {
		const signal = this.authoritySignal;
		signal?.throwIfAborted();
		const local = new Map(this.trust.list().map((entry) => [entry.peer, entry.trust]));
		const { friendships } = await this.transport.listFriends(signal);
		signal?.throwIfAborted();
		const listed = [];
		for (const friend of friendships) {
			const autonomy = local.get(friend.peer)?.autonomy;
			listed.push({
				...friend,
				fingerprint: fingerprint(friend.ed25519_pub, friend.x25519_pub),
				...autonomy ? { autonomy } : {}
			});
		}
		return listed;
	}
	surfacePairingCandidates(issue, lifecycleSignal) {
		return this.#serialize(async (signal) => {
			const { friendships } = await this.transport.listFriends(signal);
			signal?.throwIfAborted();
			const approvals = await this.#loadPairingApprovals(friendships);
			for (const friend of friendships) {
				if (friend.status === "blocked") continue;
				const snapshot = this.trust.snapshot(friend.peer);
				const approval = approvals.get(friend.peer);
				if (approval?.trustRevision === snapshot.revision) continue;
				if (approval) await this.pairing.remove(approval.entry);
				const local = snapshot.trust;
				const changed = local ? keysChanged(local, friend) : false;
				const inboundPending = friend.status === "pending" && friend.initiated_by !== this.transport.handle;
				const missingLocalApproval = (friend.status === "active" || friend.status === "reapprove_required") && !local && Object.keys(snapshot.outboundRequests ?? {}).length === 0;
				const needsReapproval = friend.status === "reapprove_required" || friend.status === "active" && Boolean(local && (changed || local.safetyNumberChanged));
				if (!inboundPending && !missingLocalApproval && !needsReapproval) continue;
				signal?.throwIfAborted();
				await issue({
					peer: friend.peer,
					fingerprint: fingerprint(friend.ed25519_pub, friend.x25519_pub),
					code: friend.peer,
					approvalToken: this.trust.createPairingApproval(friend, snapshot.revision)
				});
			}
		}, lifecycleSignal);
	}
	reconcile(lifecycleSignal) {
		return this.#serialize(async (signal) => {
			const { friendships } = await this.transport.listFriends(signal);
			signal?.throwIfAborted();
			const approvals = await this.#loadPairingApprovals(friendships);
			const changed = /* @__PURE__ */ new Set();
			for (const friend of friendships) {
				signal?.throwIfAborted();
				if (friend.status === "blocked") continue;
				const snapshot = this.trust.snapshot(friend.peer);
				const local = snapshot.trust;
				const loadedApproval = approvals.get(friend.peer);
				const approval = loadedApproval?.trustRevision === snapshot.revision ? loadedApproval : void 0;
				if (loadedApproval && !approval) await this.pairing.remove(loadedApproval.entry);
				const approvalEntry = approval?.entry;
				const approved = approval !== void 0;
				const outboundRequestId = Object.keys(snapshot.outboundRequests ?? {}).toSorted()[0];
				const changedKeys = local ? keysChanged(local, friend) : false;
				if (changedKeys && local && !approved) {
					if (!local.safetyNumberChanged && this.trust.markSafetyNumberChanged(friend.peer, snapshot.revision)) changed.add(friend.peer);
					continue;
				}
				const selfInitiated = friend.status === "active" && !local && outboundRequestId !== void 0;
				if (!(selfInitiated || approved && (!local || changedKeys || local.safetyNumberChanged || friend.status === "pending" || friend.status === "reapprove_required"))) {
					if (friend.status === "active" && local && outboundRequestId !== void 0) this.trust.removeOutboundRequest(friend.peer);
					if (approvalEntry !== void 0 && local && !changedKeys && !local.safetyNumberChanged) await this.pairing.remove(approvalEntry);
					continue;
				}
				if (friend.status === "pending" || friend.status === "reapprove_required") {
					if (!approved) continue;
				} else if (friend.status !== "active") continue;
				if (approvalEntry && !await this.pairing.remove(approvalEntry)) continue;
				signal?.throwIfAborted();
				if (friend.status === "pending" || friend.status === "reapprove_required") {
					await this.transport.respondFriend(friend, true, signal);
					signal?.throwIfAborted();
				}
				if (this.trust.commitPeerTrust(friend, {
					expectedRevision: snapshot.revision,
					...selfInitiated && outboundRequestId !== void 0 ? { expectedOutboundRequestId: outboundRequestId } : {}
				})) {
					changed.add(friend.peer);
					continue;
				}
				const current = this.trust.snapshot(friend.peer);
				if (current.revision > snapshot.revision && !current.trust && Object.keys(current.outboundRequests ?? {}).length === 0) await this.transport.removeFriend(friend.peer);
			}
			return [...changed].toSorted();
		}, lifecycleSignal);
	}
	async #loadPairingApprovals(friendships) {
		const relayPeers = new Map(friendships.map((friend) => [friend.peer, friend]));
		const approvals = /* @__PURE__ */ new Map();
		for (const entry of await this.pairing.list()) {
			const parsed = this.trust.parsePairingApproval(entry);
			if (!parsed) {
				await this.pairing.remove(entry);
				continue;
			}
			const remote = relayPeers.get(parsed.peer);
			if (!remote || remote.status === "blocked" || !this.trust.matchesPairingApproval(entry, remote)) {
				await this.pairing.remove(entry);
				continue;
			}
			approvals.set(parsed.peer, {
				entry,
				trustRevision: parsed.trustRevision
			});
		}
		return approvals;
	}
	async #removePairingApprovalsForPeer(peer) {
		for (const entry of await this.pairing.list()) if (this.trust.parsePairingApproval(entry)?.peer === peer || normalizeReefTarget(entry) === peer) await this.pairing.remove(entry);
	}
	async #removeRelayAndRefence(peer) {
		await this.transport.removeFriend(peer);
		this.trust.remove(peer);
	}
	#serialize(operation, lifecycleSignal) {
		const signal = lifecycleSignal && this.authoritySignal ? AbortSignal.any([lifecycleSignal, this.authoritySignal]) : lifecycleSignal ?? this.authoritySignal;
		const result = this.#mutations.then(async () => {
			signal?.throwIfAborted();
			const value = await operation(signal);
			signal?.throwIfAborted();
			return value;
		});
		this.#mutations = result.then(() => void 0, () => void 0);
		return result;
	}
};
//#endregion
//#region extensions/reef/src/legacy-key-guard.ts
const REEF_LEGACY_KEYS_PENDING_CODE = "REEF_LEGACY_KEYS_PENDING";
async function assertLegacyReefKeysMigrated(configuredStateDir, env = process.env, homeDir = os.homedir()) {
	const filePath = `${resolveLegacyReefStateDir({
		config: configuredStateDir ? { channels: { reef: { stateDir: configuredStateDir } } } : {},
		env,
		stateDir: resolveStateDir(env, () => homeDir),
		homeDir
	})}/keys.json`;
	try {
		await fs.stat(filePath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	throw Object.assign(/* @__PURE__ */ new Error("Legacy Reef identity keys must be imported before registration. Run `openclaw doctor --fix`, then retry."), { code: REEF_LEGACY_KEYS_PENDING_CODE });
}
//#endregion
export { confirmDelivery as _, ReefInboxEntryParkedError as a, createHostOpenAiGuard as b, abortableSleep as c, isReefOwnershipRejection as d, isRetryableReefRelayFailure as f, InvalidDeliveryReceiptError as g, composeOutbound as h, ReefInboxConnection as i, createReefWebSocket as l, composeInbound as m, assertLegacyReefKeysMigrated as n, ReefProtocolCompatibilityError as o, PipelineError as p, ReefFriendManager as r, ReefTransportClient as s, REEF_LEGACY_KEYS_PENDING_CODE as t, isDefinitiveReefRegistrationFailure as u, verifyReceipt as v, createOpenAiGuard as x, createAnthropicGuard as y };
