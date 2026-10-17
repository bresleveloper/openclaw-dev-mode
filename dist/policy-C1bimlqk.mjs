import { i as asOptionalObjectRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import { t as mutateConfigFile } from "./mutate-BkuP-9_H.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./config-mutation-DuvfZ3Hg.mjs";
import "./runtime-config-snapshot-DlrhEsA8.mjs";
import { t as FILE_TRANSFER_NODE_INVOKE_COMMANDS } from "./node-invoke-policy-commands-BEizdTVP.mjs";
import path from "node:path";
import os from "node:os";
import { minimatch } from "minimatch";
function asFilePolicyConfig(value) {
	return asNullableRecord(value);
}
function readFileTransferConfigFromPluginConfig(pluginConfig) {
	const pluginRecord = asNullableRecord(pluginConfig);
	if (!pluginRecord) return null;
	return {
		policyVersion: typeof pluginRecord.policyVersion === "number" ? pluginRecord.policyVersion : void 0,
		nodes: asFilePolicyConfig(pluginRecord.nodes) ?? void 0,
		literalGrants: pluginRecord.literalGrants,
		pendingReapprovals: pluginRecord.pendingReapprovals
	};
}
function readPendingReapprovals(config) {
	if (config.policyVersion !== 2 || !Array.isArray(config.pendingReapprovals)) return [];
	return config.pendingReapprovals.flatMap((value) => {
		const pending = asNullableRecord(value);
		if (!pending || typeof pending.selector !== "string" || pending.kind !== "read" && pending.kind !== "write" || typeof pending.path !== "string") return [];
		return [{
			selector: pending.selector,
			kind: pending.kind,
			path: pending.path
		}];
	});
}
function readPluginConfigFromRuntimeConfig() {
	const plugins = asOptionalObjectRecord(getRuntimeConfig().plugins);
	const entries = asOptionalObjectRecord(plugins?.entries);
	const entry = asOptionalObjectRecord(entries?.["file-transfer"]);
	return asNullableRecord(entry?.config);
}
function readFileTransferConfig(pluginConfig) {
	return readFileTransferConfigFromPluginConfig(readPluginConfigFromRuntimeConfig()) ?? readFileTransferConfigFromPluginConfig(pluginConfig);
}
function hasLegacyPositiveRules(config) {
	const nodes = asFilePolicyConfig(config.nodes);
	if (!nodes) return false;
	return Object.values(nodes).some((entry) => Array.isArray(entry.allowReadPaths) && entry.allowReadPaths.length > 0 || Array.isArray(entry.allowWritePaths) && entry.allowWritePaths.length > 0);
}
function readLiteralGrants(config) {
	if (config.policyVersion !== 2 || !Array.isArray(config.literalGrants)) return [];
	return config.literalGrants.flatMap((value) => {
		const grant = asNullableRecord(value);
		if (!grant || typeof grant.nodeId !== "string" || !isFileTransferCommand(grant.command) || typeof grant.requestedPath !== "string" || typeof grant.canonicalPath !== "string") return [];
		return [{
			nodeId: grant.nodeId,
			command: grant.command,
			requestedPath: grant.requestedPath,
			canonicalPath: grant.canonicalPath
		}];
	});
}
function isFileTransferCommand(value) {
	return typeof value === "string" && FILE_TRANSFER_NODE_INVOKE_COMMANDS.some((command) => command === value);
}
function expandTilde(p) {
	if (p.startsWith("~/") || p === "~") return path.join(os.homedir(), p.slice(p === "~" ? 1 : 2));
	return p;
}
function normalizeGlobs(patterns) {
	if (!Array.isArray(patterns)) return [];
	return patterns.filter((p) => typeof p === "string" && p.trim().length > 0).map((p) => expandTilde(p.trim()));
}
function matchesAny(target, patterns) {
	const normalizedTarget = target.replace(/\\/gu, "/");
	for (const pattern of patterns) {
		const normalizedPattern = pattern.replace(/\\/gu, "/");
		if (minimatch(target, pattern, { dot: true }) || minimatch(normalizedTarget, normalizedPattern, { dot: true })) return true;
	}
	return false;
}
function matchesAnyDeny(target, patterns) {
	if (matchesAny(target, patterns)) return true;
	return matchesAny(`${target.replace(/[\\/]+$/u, "")}/`, patterns);
}
function resolveNodePolicy(config, nodeId, nodeDisplayName) {
	const candidates = [nodeId, nodeDisplayName].filter((k) => typeof k === "string" && k.length > 0);
	for (const key of candidates) if (config[key]) return {
		key,
		entry: config[key]
	};
	if (config["*"]) return {
		key: "*",
		entry: config["*"]
	};
	return null;
}
function normalizeAskMode(value) {
	if (value === "on-miss" || value === "always" || value === "off") return value;
	return "off";
}
/**
* Check raw segments before glob matching: normalizing away '..' could authorize
* traversal through an allowed prefix. Both separators count for Windows nodes.
*/
function containsParentRefSegment(p) {
	return p.replace(/\\/gu, "/").split("/").includes("..");
}
function evaluateFilePolicyInternal(input, constraintsOnly, pluginPolicy = readFileTransferConfig(input.pluginConfig)) {
	if (containsParentRefSegment(input.path)) return {
		ok: false,
		code: "POLICY_DENIED",
		reason: "path contains '..' segments; reject before glob match",
		askable: false
	};
	const config = pluginPolicy ? asFilePolicyConfig(pluginPolicy.nodes) : null;
	if (!pluginPolicy || !config) return {
		ok: false,
		code: "NO_POLICY",
		reason: "no plugins.entries.file-transfer.config.nodes config; file-transfer is deny-by-default until configured",
		askable: false
	};
	if (pluginPolicy.policyVersion !== 2 && hasLegacyPositiveRules(pluginPolicy)) return {
		ok: false,
		code: "POLICY_MIGRATION_REQUIRED",
		reason: "older file-transfer permissions need review; run `openclaw file-transfer approvals migrate`",
		askable: false
	};
	const resolved = resolveNodePolicy(config, input.nodeId, input.nodeDisplayName);
	if (!resolved) return {
		ok: false,
		code: "NO_POLICY",
		reason: `no file-transfer policy entry for "${input.nodeDisplayName ?? input.nodeId}"; configure plugins.entries.file-transfer.config.nodes or "*"`,
		askable: false
	};
	const nodeConfig = resolved.entry;
	const askMode = normalizeAskMode(nodeConfig.ask);
	const maxBytes = typeof nodeConfig.maxBytes === "number" && Number.isFinite(nodeConfig.maxBytes) ? Math.max(1, Math.floor(nodeConfig.maxBytes)) : void 0;
	const followSymlinks = nodeConfig.followSymlinks === true;
	const denyPatterns = normalizeGlobs(nodeConfig.denyPaths);
	if (matchesAnyDeny(input.path, denyPatterns)) return {
		ok: false,
		code: "POLICY_DENIED",
		reason: "path matches a denyPaths pattern",
		askable: false,
		askMode,
		maxBytes,
		followSymlinks
	};
	if (constraintsOnly) return {
		ok: true,
		reason: "matched-allow",
		maxBytes,
		followSymlinks
	};
	const pendingReapproval = readPendingReapprovals(pluginPolicy).find((pending) => pending.kind === input.kind && pending.path === input.path && pending.selector === resolved.key);
	if (askMode === "always") return {
		ok: true,
		reason: "ask-always",
		askMode,
		maxBytes,
		followSymlinks,
		pendingReapprovalSelector: pendingReapproval?.selector
	};
	const allowPatterns = input.kind === "read" ? normalizeGlobs(nodeConfig.allowReadPaths) : normalizeGlobs(nodeConfig.allowWritePaths);
	if (allowPatterns.length > 0 && matchesAny(input.path, allowPatterns)) return {
		ok: true,
		reason: "matched-allow",
		maxBytes,
		followSymlinks
	};
	if (input.command) {
		const literal = readLiteralGrants(pluginPolicy).find((grant) => grant.nodeId === input.nodeId && grant.command === input.command && grant.requestedPath === input.path);
		if (literal) return {
			ok: true,
			reason: "matched-literal",
			expectedCanonicalPath: literal.canonicalPath,
			maxBytes,
			followSymlinks
		};
	}
	if (pendingReapproval) return {
		ok: false,
		code: "POLICY_DENIED",
		reason: "path requires exact reapproval",
		askable: true,
		askMode,
		maxBytes,
		followSymlinks,
		pendingReapprovalSelector: pendingReapproval.selector
	};
	return {
		ok: false,
		code: "POLICY_DENIED",
		reason: askMode !== "on-miss" && allowPatterns.length === 0 ? `no allow${input.kind === "read" ? "Read" : "Write"}Paths configured` : `path does not match any allow${input.kind === "read" ? "Read" : "Write"}Paths pattern`,
		askable: askMode === "on-miss",
		askMode,
		maxBytes,
		followSymlinks
	};
}
/** Carry only this node's read rules to the host that prepares a Skill bundle. */
function snapshotNodeFileReadPolicy(input) {
	const policy = readFileTransferConfig(input.pluginConfig);
	const nodes = policy && asFilePolicyConfig(policy.nodes);
	const resolved = nodes && resolveNodePolicy(nodes, input.nodeId, input.nodeDisplayName);
	if (!resolved) throw new Error("Node file read policy is unavailable");
	const { ask, allowReadPaths, denyPaths, maxBytes, followSymlinks } = resolved.entry;
	return {
		nodeId: input.nodeId,
		pluginConfig: {
			policyVersion: policy?.policyVersion,
			nodes: { [input.nodeId]: {
				ask,
				allowReadPaths: normalizeGlobs(allowReadPaths),
				denyPaths: normalizeGlobs(denyPaths),
				maxBytes,
				followSymlinks
			} }
		}
	};
}
/** A delegated read uses the Gateway snapshot, never the Node process's local policy. */
function evaluateFileReadPolicySnapshot(input) {
	return evaluateFilePolicyInternal({
		...input,
		kind: "read"
	}, false, readFileTransferConfigFromPluginConfig(input.pluginConfig));
}
function evaluateFilePolicy(input) {
	return evaluateFilePolicyInternal(input, false);
}
function evaluateFilePolicyConstraints(input) {
	return evaluateFilePolicyInternal(input, true);
}
/** Persist an exact standing grant only after node canonical-path validation. */
async function persistLiteralGrant(input) {
	if (!isFileTransferCommand(input.command)) throw new Error("unsupported file-transfer command");
	if (!input.nodeId || !input.requestedPath || !input.canonicalPath) throw new Error("file-transfer literal grant requires node, requested, and canonical paths");
	await mutateConfigFile({
		afterWrite: {
			mode: "none",
			reason: "file-transfer literal approval update"
		},
		mutate: (draft) => {
			const plugins = draft.plugins ??= {};
			const entries = plugins.entries ??= {};
			const pluginEntry = entries["file-transfer"] ??= {};
			const policyConfig = pluginEntry.config ??= {};
			if (policyConfig.policyVersion !== 2 && hasLegacyPositiveRules(policyConfig)) throw new Error("older file-transfer permissions need review; run `openclaw file-transfer approvals migrate`");
			policyConfig.policyVersion = 2;
			const grants = readLiteralGrants(policyConfig).filter((grant) => grant.nodeId !== input.nodeId || grant.command !== input.command || grant.requestedPath !== input.requestedPath);
			grants.push({
				nodeId: input.nodeId,
				command: input.command,
				requestedPath: input.requestedPath,
				canonicalPath: input.canonicalPath
			});
			policyConfig.literalGrants = grants;
			const kind = input.command === "file.write" || input.command === "file.create" ? "write" : "read";
			policyConfig.pendingReapprovals = readPendingReapprovals(policyConfig).filter((pending) => pending.kind !== kind || pending.path !== input.requestedPath || pending.selector !== input.pendingReapprovalSelector);
		}
	});
}
//#endregion
export { persistLiteralGrant as a, evaluateFileReadPolicySnapshot as i, evaluateFilePolicy as n, snapshotNodeFileReadPolicy as o, evaluateFilePolicyConstraints as r, containsParentRefSegment as t };
