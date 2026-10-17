import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { d as normalizeStringEntries, h as normalizeUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { d as sleepWithAbort } from "./src-D1BHGNTj.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import "./backoff-BrzXG7iD.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-CRa-OKC_.mjs";
import { a as removeRemoteNodeSkills, i as remoteConnectionKey, r as recordRemoteSkillNodeInfo, s as setRemoteSkillConnectionReconciler } from "./remote-skills-CVJsA9ab.mjs";
import { n as executeDevicePairingMutation, t as DevicePairingAuthorityRefusedError } from "./device-pairing-worker-CI-Kr0jq.mjs";
import { a as listNodePairing } from "./device-pairing-node-HEhf89hA.mjs";
//#region src/infra/device-pairing-node-facts.ts
/** Update remote skill bins while the probe still owns the durable node generation. */
async function updatePairedNodeBins(nodeId, bins, expectedPairingGeneration, baseDir, isProbeCurrent) {
	return await executeDevicePairingMutation({
		type: "node.updateBins",
		input: {
			nodeId,
			bins,
			expectedPairingGeneration
		}
	}, {
		baseDir,
		onAuthorityRefused: () => false,
		assertCurrent: () => {
			if (isProbeCurrent?.() === false) throw new DevicePairingAuthorityRefusedError("node bin probe ownership changed");
		}
	});
}
/** Persist runner-host consent only while its connection still owns the durable generation. */
async function updatePairedNodeSessionHost(params) {
	const { baseDir, isConnectionCurrent, ...input } = params;
	return await executeDevicePairingMutation({
		type: "node.updateSessionHost",
		input
	}, {
		baseDir,
		onAuthorityRefused: () => false,
		assertCurrent: () => {
			if (!isConnectionCurrent()) throw new DevicePairingAuthorityRefusedError("node session connection changed");
		}
	});
}
//#endregion
//#region src/skills/runtime/remote-probe-utils.ts
function extractErrorMessage(err) {
	if (!err) return;
	if (typeof err === "string") return err;
	if (err instanceof Error) return err.message;
	if (typeof err === "object" && "message" in err && typeof err.message === "string") return err.message;
	if (typeof err === "number" || typeof err === "boolean" || typeof err === "bigint") return String(err);
	if (typeof err === "symbol") return err.toString();
	if (typeof err === "object") try {
		return JSON.stringify(err);
	} catch {
		return;
	}
}
function isMacPlatform(platform, deviceFamily) {
	const platformNorm = normalizeLowercaseStringOrEmpty(platform);
	const familyNorm = normalizeLowercaseStringOrEmpty(deviceFamily);
	return platformNorm.includes("mac") || platformNorm.includes("darwin") || familyNorm === "mac";
}
function supportsSystemRun(commands) {
	return Array.isArray(commands) && commands.includes("system.run");
}
function isRemoteSkillEligibilityNode(node) {
	return Boolean(node?.connected && isMacPlatform(node.platform, node.deviceFamily) && supportsSystemRun(node.commands));
}
function collectRequiredBins(entries, targetPlatform) {
	return normalizeUniqueStringEntries(entries.flatMap(({ metadata }) => metadata?.os?.length && !metadata.os.includes(targetPlatform) ? [] : [...metadata?.requires?.bins ?? [], ...metadata?.requires?.anyBins ?? []]));
}
function buildBinProbeScript(bins) {
	return `for b in ${bins.map((bin) => `'${bin.replace(/'/g, `'\\''`)}'`).join(" ")}; do if command -v "$b" >/dev/null 2>&1; then echo "$b"; fi; done`;
}
function parseBinProbePayload(payloadJSON, payload) {
	if (!payloadJSON && !payload) return [];
	try {
		const parsed = payloadJSON ? JSON.parse(payloadJSON) : payload;
		if (Array.isArray(parsed.bins)) return normalizeStringEntries(parsed.bins);
		if (parsed.bins && typeof parsed.bins === "object") return Object.entries(parsed.bins).filter(([, resolvedPath]) => normalizeOptionalString(resolvedPath) !== void 0).map(([bin]) => normalizeOptionalString(bin) ?? "").filter(Boolean);
		if (typeof parsed.stdout === "string") return normalizeStringEntries(parsed.stdout.split(/\r?\n/));
	} catch {
		return [];
	}
	return [];
}
function areBinSetsEqual(a, b) {
	if (!a || a.size !== b.size) return false;
	for (const bin of b) if (!a.has(bin)) return false;
	return true;
}
//#endregion
//#region src/skills/runtime/remote.ts
const log = createSubsystemLogger("gateway/skills-remote");
const remoteNodes = /* @__PURE__ */ new Map();
const remoteNodeProbeStates = /* @__PURE__ */ new Map();
const remoteBinProbeInflight = /* @__PURE__ */ new Map();
let remoteRegistry = null;
const REMOTE_BIN_PROBE_SUCCESS_TTL_MS = 18e5;
const REMOTE_BIN_PROBE_FAILURE_BASE_BACKOFF_MS = 15e3;
const REMOTE_BIN_PROBE_FAILURE_MAX_BACKOFF_MS = 3e5;
function describeNode(nodeId) {
	const record = remoteNodes.get(nodeId);
	const name = record?.displayName?.trim();
	const base = name && name !== nodeId ? `${name} (${nodeId})` : nodeId;
	const ip = record?.remoteIp?.trim();
	return ip ? `${base} @ ${ip}` : base;
}
function logRemoteBinProbeFailure(nodeId, err, context, phase = "probe") {
	const message = extractErrorMessage(err);
	const label = describeNode(nodeId);
	const details = `command=${context.command} timeoutMs=${context.timeoutMs} requiredBins=${context.requiredBinCount} connected=${remoteNodes.get(nodeId)?.connected === true ? "yes" : "no"}`;
	if (phase === "preflight") {
		log.info(`remote bin probe skipped: node connectivity unavailable (${label}; ${details}): ${message ?? "unknown"}`);
		return;
	}
	if (message?.includes("node not connected") || message?.includes("node disconnected")) {
		log.info(`remote bin probe skipped: node unavailable (${label}; ${details})`);
		return;
	}
	if (message?.includes("invoke timed out") || message?.includes("timeout")) {
		log.warn(`remote bin probe timed out (${label}; ${details}); check node connectivity for ${label}`);
		return;
	}
	log.warn(`remote bin probe error (${label}; ${details}): ${message ?? "unknown"}`);
}
function upsertNode(record, options) {
	const existing = remoteNodes.get(record.nodeId);
	const pairingGeneration = options?.pairingGenerationAuthoritative ? record.pairingGeneration : record.pairingGeneration ?? existing?.pairingGeneration;
	const pairingGenerationChanged = Boolean(options?.pairingGenerationAuthoritative && existing && existing.pairingGeneration !== record.pairingGeneration);
	const bins = new Set(record.bins ?? (pairingGenerationChanged ? [] : existing?.bins ?? []));
	remoteNodes.set(record.nodeId, {
		nodeId: record.nodeId,
		connId: record.connId ?? existing?.connId,
		displayName: record.displayName ?? existing?.displayName,
		platform: record.platform ?? existing?.platform,
		deviceFamily: record.deviceFamily ?? existing?.deviceFamily,
		commands: record.commands ?? existing?.commands,
		remoteIp: record.remoteIp ?? existing?.remoteIp,
		bins,
		...pairingGeneration ? { pairingGeneration } : {},
		connected: record.connected ?? existing?.connected ?? false
	});
}
function clearRemoteNodeBins(nodeId) {
	const existing = remoteNodes.get(nodeId);
	if (!existing || existing.bins.size === 0) return false;
	existing.bins = /* @__PURE__ */ new Set();
	return true;
}
function buildRemoteProbeSignature(params) {
	return JSON.stringify([
		params.command,
		normalizeLowercaseStringOrEmpty(params.platform),
		normalizeLowercaseStringOrEmpty(params.deviceFamily),
		(params.commands ?? []).toSorted(),
		params.bins.toSorted()
	]);
}
function restoreCachedRemoteNodeBins(nodeId) {
	const node = remoteNodes.get(nodeId);
	const state = remoteNodeProbeStates.get(nodeId);
	const cachedBins = state?.bins;
	if (!node || state?.pairingGeneration !== node.pairingGeneration || !cachedBins || areBinSetsEqual(node.bins, cachedBins)) return false;
	node.bins = new Set(cachedBins);
	return true;
}
function sameRemoteNodeOwner(left, right) {
	return left.connId === right.connId && left.pairingGeneration === right.pairingGeneration;
}
function isCurrentRemoteNodeOwner(nodeId, owner) {
	const current = remoteNodes.get(nodeId);
	return Boolean(current && current.pairingGeneration === owner.pairingGeneration && (!owner.connId || !current.connId || current.connId === owner.connId));
}
function recordRemoteNodeProbeFailure(params, err, context, phase) {
	if (!isCurrentRemoteNodeOwner(params.nodeId, params.owner)) return;
	const existing = remoteNodeProbeStates.get(params.nodeId);
	const failedProbeCount = existing?.signature === params.signature ? existing.failedProbeCount + 1 : 1;
	const backoffMs = Math.min(REMOTE_BIN_PROBE_FAILURE_MAX_BACKOFF_MS, REMOTE_BIN_PROBE_FAILURE_BASE_BACKOFF_MS * 2 ** (failedProbeCount - 1));
	remoteNodeProbeStates.set(params.nodeId, {
		signature: params.signature,
		pairingGeneration: params.owner.pairingGeneration,
		nextProbeAfterMs: params.nowMs + backoffMs,
		failedProbeCount
	});
	const cleared = clearRemoteNodeBins(params.nodeId);
	logRemoteBinProbeFailure(params.nodeId, err, context, phase);
	if (cleared) bumpSkillsSnapshotVersion({ reason: "remote-node" });
}
function listCurrentRemoteConnectionKeys() {
	if (!remoteRegistry) return;
	return new Set(remoteRegistry.listCurrentConnectedSync().map((node) => remoteConnectionKey(node.nodeId, node.connId)));
}
function setSkillsRemoteRegistry(registry) {
	remoteRegistry = registry;
	setRemoteSkillConnectionReconciler(registry ? listCurrentRemoteConnectionKeys : null, registry ? () => registry.listCurrentConnected() : void 0);
	if (!registry) remoteNodeProbeStates.clear();
}
async function primeRemoteSkillsCache() {
	try {
		const { paired } = await listNodePairing(void 0, { includePairingGeneration: true });
		let sawMac = false;
		for (const node of paired) {
			if (!node.pairingGeneration) continue;
			upsertNode({
				nodeId: node.nodeId,
				displayName: node.displayName,
				platform: node.platform,
				deviceFamily: node.deviceFamily,
				commands: node.commands,
				remoteIp: node.remoteIp,
				bins: node.bins,
				pairingGeneration: node.pairingGeneration,
				connected: false
			}, { pairingGenerationAuthoritative: true });
			if (node.bins?.length && isMacPlatform(node.platform, node.deviceFamily) && supportsSystemRun(node.commands)) sawMac = true;
		}
		if (sawMac) bumpSkillsSnapshotVersion({ reason: "remote-node" });
	} catch (err) {
		log.warn(`failed to prime remote skills cache: ${String(err)}`);
	}
}
function recordRemoteNodeInfo(node) {
	const existing = remoteNodes.get(node.nodeId);
	const wasEligible = isRemoteSkillEligibilityNode(existing);
	if (Boolean(existing && existing.pairingGeneration !== node.pairingGeneration) || node.connId && existing?.connId !== node.connId && !remoteNodeProbeStates.get(node.nodeId)?.bins) remoteNodeProbeStates.delete(node.nodeId);
	upsertNode({
		...node,
		connected: true
	}, { pairingGenerationAuthoritative: true });
	if (wasEligible !== isRemoteSkillEligibilityNode(remoteNodes.get(node.nodeId))) bumpSkillsSnapshotVersion({ reason: "remote-node" });
	recordRemoteSkillNodeInfo(node);
}
function recordRemoteNodeBins(nodeId, bins, pairingGeneration) {
	upsertNode({
		nodeId,
		bins,
		pairingGeneration
	});
}
function removeRemoteNodeInfo(nodeId) {
	const existing = remoteNodes.get(nodeId);
	remoteNodes.delete(nodeId);
	removeRemoteNodeSkills(nodeId);
	const probeState = remoteNodeProbeStates.get(nodeId);
	if (probeState && !probeState.bins) remoteNodeProbeStates.delete(nodeId);
	if (existing && isMacPlatform(existing.platform, existing.deviceFamily) && supportsSystemRun(existing.commands)) bumpSkillsSnapshotVersion({ reason: "remote-node" });
}
/** Remove remote projections only while they still belong to the invalidated connection. */
function removeRemoteNodeInfoForConnection(nodeId, connId) {
	if (remoteNodes.get(nodeId)?.connId !== connId) return false;
	removeRemoteNodeInfo(nodeId);
	return true;
}
async function refreshRemoteNodeBins(params) {
	for (;;) {
		const session = remoteRegistry?.get(params.nodeId);
		if (!session?.pairingGeneration) return;
		const owner = {
			connId: session.connId,
			pairingGeneration: session.pairingGeneration
		};
		const existing = remoteBinProbeInflight.get(params.nodeId);
		if (existing) {
			await existing.promise;
			if (sameRemoteNodeOwner(existing, owner)) return;
			continue;
		}
		const inflight = {
			...owner,
			promise: Promise.resolve()
		};
		const run = refreshRemoteNodeBinsUncoalesced(params).finally(() => {
			if (remoteBinProbeInflight.get(params.nodeId) === inflight) remoteBinProbeInflight.delete(params.nodeId);
		});
		inflight.promise = run;
		remoteBinProbeInflight.set(params.nodeId, inflight);
		await run;
		return;
	}
}
async function refreshRemoteNodeBinsUncoalesced(params) {
	const readinessDelayMs = params.readinessDelayMs ?? 0;
	if (readinessDelayMs > 0) try {
		await sleepWithAbort(readinessDelayMs, params.readinessSignal);
	} catch (error) {
		if (!params.readinessSignal?.aborted) throw error;
	}
	if (params.readinessSignal?.aborted) return;
	if (!remoteRegistry) return;
	const { loadWorkspaceSkills } = await import("./workspace-skill-loader-Di6_DPep.mjs");
	const liveSession = remoteRegistry?.get(params.nodeId);
	if (params.readinessSignal?.aborted || !liveSession?.pairingGeneration) return;
	const probeOwner = {
		connId: liveSession.connId,
		pairingGeneration: liveSession.pairingGeneration
	};
	const platform = liveSession.platform ?? params.platform;
	const deviceFamily = liveSession.deviceFamily ?? params.deviceFamily;
	const commands = liveSession.commands ?? params.commands;
	if (!isMacPlatform(platform, deviceFamily)) return;
	const canWhich = commands?.includes("system.which") ?? false;
	const canRun = supportsSystemRun(commands);
	if (!canWhich && !canRun) return;
	const requiredBins = /* @__PURE__ */ new Set();
	for (const agentId of listAgentIds(params.cfg)) {
		const entries = loadWorkspaceSkills(resolveAgentWorkspaceDir(params.cfg, agentId), {
			config: params.cfg,
			agentId,
			agentSkillFilter: "ignore"
		});
		for (const bin of collectRequiredBins(entries, "darwin")) requiredBins.add(bin);
	}
	if (requiredBins.size === 0) return;
	const binsList = [...requiredBins];
	const timeoutMs = params.timeoutMs ?? 15e3;
	const command = canWhich ? "system.which" : "system.run";
	const probeSignature = buildRemoteProbeSignature({
		command,
		platform,
		deviceFamily,
		commands,
		bins: binsList
	});
	const cachedProbe = remoteNodeProbeStates.get(params.nodeId);
	if (cachedProbe?.pairingGeneration === probeOwner.pairingGeneration && cachedProbe.signature === probeSignature && Date.now() < cachedProbe.nextProbeAfterMs) {
		if (restoreCachedRemoteNodeBins(params.nodeId)) bumpSkillsSnapshotVersion({ reason: "remote-node" });
		return;
	}
	const logContext = {
		command,
		timeoutMs,
		requiredBinCount: binsList.length
	};
	const recordFailure = (error, context = logContext, phase) => recordRemoteNodeProbeFailure({
		nodeId: params.nodeId,
		owner: probeOwner,
		signature: probeSignature,
		nowMs: Date.now()
	}, error, context, phase);
	const connectivityTimeoutMs = Math.min(timeoutMs, 2e3);
	if (typeof remoteRegistry.checkConnectivity === "function") {
		const preflightContext = {
			command: "websocket.ping",
			timeoutMs: connectivityTimeoutMs,
			requiredBinCount: binsList.length
		};
		const preflightConnId = remoteRegistry.get(params.nodeId)?.connId;
		let connectivity;
		try {
			connectivity = await remoteRegistry.checkConnectivity(params.nodeId, connectivityTimeoutMs);
		} catch (err) {
			recordFailure(err, preflightContext, "preflight");
			return;
		}
		if (!connectivity.ok) {
			const latestSession = remoteRegistry.get(params.nodeId);
			if (preflightConnId && latestSession && latestSession.connId !== preflightConnId) {
				await refreshRemoteNodeBinsUncoalesced({
					nodeId: latestSession.nodeId,
					platform: latestSession.platform,
					deviceFamily: latestSession.deviceFamily,
					commands: latestSession.commands,
					cfg: params.cfg,
					timeoutMs: params.timeoutMs
				});
				return;
			}
			recordFailure(connectivity.error.message, preflightContext, "preflight");
			return;
		}
	}
	try {
		const res = await remoteRegistry.invoke({
			nodeId: params.nodeId,
			expectedPairingGeneration: probeOwner.pairingGeneration,
			command,
			params: canWhich ? { bins: binsList } : { command: [
				"/bin/sh",
				"-lc",
				buildBinProbeScript(binsList)
			] },
			timeoutMs
		});
		if (!res.ok) {
			recordFailure(res.error?.message ?? "unknown");
			return;
		}
		const bins = parseBinProbePayload(res.payloadJSON, res.payload);
		if (!isCurrentRemoteNodeOwner(params.nodeId, probeOwner)) return;
		const existingBins = remoteNodes.get(params.nodeId)?.bins;
		const nextBins = new Set(bins);
		const hasChanged = !areBinSetsEqual(existingBins, nextBins);
		if (hasChanged) {
			if (!await updatePairedNodeBins(params.nodeId, bins, {
				nodeId: params.nodeId,
				key: probeOwner.pairingGeneration
			}, void 0, () => isCurrentRemoteNodeOwner(params.nodeId, probeOwner))) return;
		}
		if (!isCurrentRemoteNodeOwner(params.nodeId, probeOwner)) return;
		remoteNodeProbeStates.set(params.nodeId, {
			signature: probeSignature,
			pairingGeneration: probeOwner.pairingGeneration,
			nextProbeAfterMs: Date.now() + REMOTE_BIN_PROBE_SUCCESS_TTL_MS,
			failedProbeCount: 0,
			bins: nextBins
		});
		recordRemoteNodeBins(params.nodeId, bins, probeOwner.pairingGeneration);
		if (hasChanged) bumpSkillsSnapshotVersion({ reason: "remote-node" });
	} catch (err) {
		recordFailure(err);
	}
}
function getRemoteSkillEligibility(options) {
	const currentConnections = listCurrentRemoteConnectionKeys();
	const macNodes = [...remoteNodes.values()].filter((node) => isRemoteSkillEligibilityNode(node) && (!currentConnections || node.connId !== void 0 && currentConnections.has(remoteConnectionKey(node.nodeId, node.connId))));
	if (macNodes.length === 0) return;
	const bins = /* @__PURE__ */ new Set();
	for (const node of macNodes) for (const bin of node.bins) bins.add(bin);
	const labels = macNodes.map((node) => node.displayName ?? node.nodeId).filter(Boolean);
	const note = options?.advertiseExecNode === false ? void 0 : labels.length > 0 ? `Remote macOS node available (${labels.join(", ")}). Run macOS-only skills via exec host=node on that node.` : "Remote macOS node available. Run macOS-only skills via exec host=node on that node.";
	return {
		platforms: ["darwin"],
		hasBin: (bin) => bins.has(bin),
		hasAnyBin: (required) => required.some((bin) => bins.has(bin)),
		...note ? { note } : {}
	};
}
async function refreshRemoteBinsForConnectedNodes(cfg) {
	if (!remoteRegistry) return;
	const connected = await remoteRegistry.listCurrentConnected();
	for (const node of connected) try {
		await refreshRemoteNodeBins({
			nodeId: node.nodeId,
			platform: node.platform,
			deviceFamily: node.deviceFamily,
			commands: node.commands,
			cfg
		});
	} catch (err) {
		log.warn(`failed to refresh remote bins for ${describeNode(node.nodeId)}: ${String(err)}`);
	}
}
//#endregion
export { refreshRemoteBinsForConnectedNodes as a, removeRemoteNodeInfoForConnection as c, recordRemoteNodeInfo as i, setSkillsRemoteRegistry as l, primeRemoteSkillsCache as n, refreshRemoteNodeBins as o, recordRemoteNodeBins as r, removeRemoteNodeInfo as s, getRemoteSkillEligibility as t, updatePairedNodeSessionHost as u };
