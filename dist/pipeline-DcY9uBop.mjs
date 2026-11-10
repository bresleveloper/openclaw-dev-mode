import { C as utf8ToBytes, a as decodeUtf8, n as sha256Hex, o as fromBase64, r as base64, s as fromBase64url, t as canonicalBytes } from "./canonical-C1hv0IfI.mjs";
import { r as admitVerdict } from "./guard-AJ321bgO.mjs";
import { D as parseHandleEpoch, k as ed25519 } from "./state-format-A6jMVTqv.mjs";
import { a as openClaimed, c as validateMessageBody, i as bodyHash, r as ReplayedError, s as validateEnvelopeMetadata } from "./envelope-DloG17gM.mjs";
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
	if (hasHighEntropyToken(maskGitHubCommitIds(text))) findings.push({
		code: "high_entropy_token",
		decision: "deny"
	});
	return {
		allowed: findings.length === 0,
		text,
		findings
	};
}
function maskGitHubCommitIds(text) {
	return text.replace(/(?<![a-z0-9+.-])[a-z0-9+.-]+:[^\s<>"`]+/gi, (url) => url.replace(/^(https:\/\/github\.com\/[A-Za-z0-9-]+\/(?!\.{1,2}\/)[A-Za-z0-9_.-]+\/(?:commit|blob|tree)\/)[A-Fa-f0-9]{40}(?=[/?#]|[)\]}.,;']*$)/, "$1<git-object-id>"));
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
	return audit.appendEvent("confirm_delivery", {
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
function prepareOutboundProposal(options, senderSigningKeyLength) {
	validateEnvelopeMetadata(options.id, options.from, options.to, options.ts ?? Math.floor(Date.now() / 1e3));
	validateMessageBody(options.body);
	if (senderSigningKeyLength !== 32 || fromBase64url(options.recipientEncryptionPublicKey).length !== 32) throw new Error("invalid outbound key material");
	const checks = deterministicChecks(options.body.text);
	if (checks.findings.some((finding) => finding.code === "invalid_utf8" || finding.code === "too_large")) throw new PipelineError("deterministic", "invalid outbound message");
	const proposalHash = bodyHash(options.body);
	return {
		checks,
		proposalHash,
		approvalDigest: computeApprovalDigest(options.id, options.from, options.to, "outbound", proposalHash, options.policyVersion)
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
			await options.audit.appendEvent("deterministic_verdict", {
				id: options.envelope.id,
				approvalDigest,
				decision: "deny",
				findings: checks.findings
			});
			const receipt = await completeRejection(options, peer, proposalHash, approvalDigest, "deterministic_deny");
			finalized = true;
			throw new PipelineError("deterministic", "rule-based checks denied message", void 0, receipt);
		}
		let verdict;
		try {
			verdict = await classifyWithReview(options, "inbound", options.envelope.id, proposalHash, approvalDigest, options.envelope.from, options.self, opened.body.text);
		} catch (error) {
			if (!(error instanceof PipelineError)) throw error;
			const reviewDenied = error.stage === "review" && error.reviewOutcome === "denied";
			const guardDenied = error.stage === "guard" && error.verdict?.decision === "deny" && error.verdict.category !== "guard_failure";
			if (!reviewDenied && !guardDenied) throw error;
			await refreshClaim();
			const receipt = await completeRejection(options, peer, proposalHash, approvalDigest, reviewDenied ? "review_denied" : "guard_deny");
			finalized = true;
			throw new PipelineError(error.stage, error.message, error.verdict, receipt, reviewDenied ? "denied" : void 0, reviewDenied ? approvalDigest : void 0);
		}
		await refreshClaim();
		const inboxEntry = await options.audit.appendEvent("inbox", {
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
		await options.audit.appendEvent("receipt", {
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
	const rejectionEntry = await options.audit.appendEvent("inbox_rejected", {
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
	await options.audit.appendEvent("receipt", {
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
	const binding = {
		id,
		from: source,
		to: destination,
		direction,
		bodyHash: proposalHash,
		approvalDigest
	};
	const classify = async (afterApproval = false) => {
		const verdict = admitVerdict(await options.guard.classify(request), options.guard.pinnedModel, request.policyVersion);
		await options.audit.appendEvent("guard_verdict", {
			...binding,
			...afterApproval ? { afterApproval: true } : {},
			...verdict
		});
		if (verdict.decision === "deny") throw new PipelineError("guard", afterApproval ? "guard denied approved message" : direction === "outbound" ? "Reef outbound guard denied the message. Do not retry or rephrase it automatically; ask the owner before sending related content." : "guard denied message", verdict);
		return verdict;
	};
	const existingDecision = await options.reviewGate?.lookup(approvalDigest) ?? "none";
	let verdict;
	let approval;
	if (existingDecision === "none") {
		verdict = await classify();
		if (verdict.decision !== "review") return verdict;
		approval = await options.reviewGate?.request({
			...binding,
			verdict
		});
	} else if (existingDecision !== "pending") approval = {
		...existingDecision,
		approvalDigest
	};
	if (!approval || approval.approvalDigest !== approvalDigest) throw new PipelineError("review", approval ? "approval digest mismatch" : "review approval pending", verdict, void 0, "pending", approvalDigest);
	if (!approval.approved) throw new PipelineError("review", "review explicitly denied", verdict, void 0, "denied", approvalDigest);
	await options.audit.appendEvent("review_approval", {
		...binding,
		approved: true
	});
	return classify(true);
}
function computeApprovalDigest(id, from, to, direction, proposalHash, policyVersion) {
	return sha256Hex(canonicalBytes({
		id,
		from,
		to,
		direction,
		bodyHash: proposalHash,
		policyVersion
	}));
}
//#endregion
export { confirmDelivery as a, InvalidDeliveryReceiptError as i, composeInbound as n, prepareOutboundProposal as r, PipelineError as t };
