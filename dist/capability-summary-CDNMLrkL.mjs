import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-DspuXlEe.mjs";
import { t as PLUGIN_MANIFEST_CONTRACT_KEYS } from "./manifest-contract-keys-BPOZyeOs.mjs";
import { t as PLUGIN_DECLARED_SURFACE_GROUPS } from "./plugin-declared-surface-groups-CaZZpMBC.mjs";
import { n as resolvePromptInjectionAllowed, t as resolveConversationAccessAllowed } from "./hook-policy-decisions-DL3kOjGW.mjs";
import { createHash } from "node:crypto";
//#region src/plugins/capability-summary.ts
function diffDeclaredSurfaceWidening(previous, next) {
	const widened = {};
	for (const group of PLUGIN_DECLARED_SURFACE_GROUPS) {
		const previousValues = new Set(previous[group]);
		const added = next[group].filter((value) => !previousValues.has(value)).toSorted();
		if (added.length > 0) widened[group] = added;
	}
	return {
		widened,
		hasWidening: Object.keys(widened).length > 0
	};
}
function mergePluginDeclaredSurfaces(surfaces) {
	const merged = {
		channels: [],
		providers: [],
		tools: [],
		contracts: [],
		hooks: [],
		mcpServers: [],
		cliCommands: [],
		cliBackends: [],
		skills: [],
		dangerousConfigFlags: []
	};
	for (const surface of surfaces) for (const group of PLUGIN_DECLARED_SURFACE_GROUPS) merged[group].push(...surface[group]);
	for (const group of PLUGIN_DECLARED_SURFACE_GROUPS) merged[group] = [...new Set(merged[group])].toSorted();
	return merged;
}
/** Acceptance belongs to the package; missing siblings must never shrink its review. */
function resolvePluginPackageDeclaredSurface(ownership, manifests) {
	const surfaces = [];
	for (const pluginId of ownership.pluginIds) {
		const manifest = manifests.get(pluginId);
		if (!manifest) return;
		surfaces.push(buildPluginCapabilitySummary({
			manifest,
			origin: manifest.origin
		}).declared);
	}
	return mergePluginDeclaredSurfaces(surfaces);
}
function computeDeclaredSurfaceHash(declared) {
	const canonical = Object.fromEntries(PLUGIN_DECLARED_SURFACE_GROUPS.map((group) => [group, declared[group].toSorted()]));
	return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}
function resolvePluginInstallRecordIntegrity(record) {
	const npmIntegrity = record.integrity ?? record.npmIntegrity;
	if (npmIntegrity) return {
		integrity: npmIntegrity,
		integrityKind: "ssri"
	};
	if (record.clawpackSha256) return {
		integrity: record.clawpackSha256,
		integrityKind: "sha256"
	};
	return record.gitCommit ? {
		integrity: record.gitCommit,
		integrityKind: "git-commit"
	} : void 0;
}
function resolveAcceptedSurfaceCurrent(record, declared) {
	return record.acceptedSurface !== void 0 && record.acceptedSurfaceHash !== void 0 && record.acceptedSurfaceHash === computeDeclaredSurfaceHash(record.acceptedSurface) && record.acceptedSurfaceHash === computeDeclaredSurfaceHash(declared) && record.acceptedSurfaceIntegrity === resolvePluginInstallRecordIntegrity(record)?.integrity;
}
function formatPluginCapabilityConsentRequired(pluginId) {
	return `Plugin "${pluginId}" requires capability consent; disable and re-enable it or run \`openclaw plugins enable ${pluginId} --accept-capabilities\`.`;
}
function buildHookGrant(effective, configured) {
	return {
		effective,
		...typeof configured === "boolean" ? { configured } : {}
	};
}
function buildPluginCapabilitySummary(params) {
	const { manifest, entryConfig } = params;
	const hooks = entryConfig?.hooks;
	const llm = entryConfig?.llm;
	const subagent = entryConfig?.subagent;
	return {
		declared: {
			channels: (manifest.channels ?? (manifest.channel?.id ? [manifest.channel.id] : [])).toSorted(),
			providers: (manifest.providers ?? []).flatMap((provider) => typeof provider === "string" ? [provider] : provider.id ? [provider.id] : []).toSorted(),
			tools: [.../* @__PURE__ */ new Set([...manifest.contracts?.tools ?? [], ...Object.keys(manifest.toolMetadata ?? {})])].toSorted(),
			contracts: [...new Set(PLUGIN_MANIFEST_CONTRACT_KEYS.flatMap((family) => (manifest.contracts?.[family] ?? []).map((id) => `${family}: ${id}`)))].toSorted(),
			hooks: (manifest.hooks ?? []).toSorted(),
			mcpServers: Object.keys(manifest.mcpServers ?? {}).toSorted(),
			cliCommands: (manifest.cliCommands ?? []).map((command) => command.name).toSorted(),
			cliBackends: (manifest.cliBackends ?? []).toSorted(),
			skills: (manifest.skills ?? []).toSorted(),
			dangerousConfigFlags: (manifest.configContracts?.dangerousFlags ?? []).map((flag) => flag.path).toSorted()
		},
		grants: {
			hooks: {
				allowPromptInjection: buildHookGrant(resolvePromptInjectionAllowed(hooks), hooks?.allowPromptInjection),
				allowConversationAccess: buildHookGrant(resolveConversationAccessAllowed(params.origin, hooks), hooks?.allowConversationAccess)
			},
			...llm ? { llm: {
				...llm.allowModelOverride !== void 0 ? { allowModelOverride: llm.allowModelOverride } : {},
				...llm.allowedModels ? { allowedModels: llm.allowedModels.toSorted() } : {},
				...llm.allowedCompletionModels ? { allowedCompletionModels: llm.allowedCompletionModels.toSorted() } : {},
				...llm.allowAuthProfileOverride !== void 0 ? { allowAuthProfileOverride: llm.allowAuthProfileOverride } : {},
				...llm.allowAgentIdOverride !== void 0 ? { allowAgentIdOverride: llm.allowAgentIdOverride } : {}
			} } : {},
			...subagent ? { subagent: {
				...subagent.allowModelOverride !== void 0 ? { allowModelOverride: subagent.allowModelOverride } : {},
				...subagent.allowedModels ? { allowedModels: subagent.allowedModels.toSorted() } : {}
			} } : {}
		}
	};
}
function resolvePluginInstallRecordTrust(record) {
	if (!record?.clawhubTrustDisposition) return;
	return {
		disposition: record.clawhubTrustDisposition,
		...record.clawhubTrustReasons ? { reasons: [...record.clawhubTrustReasons] } : {},
		...record.clawhubTrustCheckedAt ? { checkedAt: record.clawhubTrustCheckedAt } : {},
		...record.clawhubTrustAcknowledgedAt ? { acknowledgedAt: record.clawhubTrustAcknowledgedAt } : {},
		...record.clawhubTrustPending !== void 0 ? { pending: record.clawhubTrustPending } : {},
		...record.clawhubTrustStale !== void 0 ? { stale: record.clawhubTrustStale } : {}
	};
}
function buildPluginCapabilityConsentReview(params) {
	const { pluginId, manifest, record } = params;
	const summary = buildPluginCapabilitySummary({
		manifest,
		origin: "global",
		entryConfig: params.config.plugins?.entries?.[pluginId]
	});
	const declared = params.declared ?? summary.declared;
	const spec = record.resolvedSpec ?? record.spec;
	const packageName = record.clawhubPackage ?? record.resolvedName;
	const previousDeclared = params.previousDeclared ?? record.acceptedSurface;
	const widened = params.widened ?? (previousDeclared ? diffDeclaredSurfaceWidening(previousDeclared, declared).widened : void 0);
	const trust = resolvePluginInstallRecordTrust(record);
	return {
		pluginId,
		name: manifest.name ?? pluginId,
		...manifest.version ?? record.version ? { version: manifest.version ?? record.version } : {},
		...summary,
		declared,
		reviewToken: computeDeclaredSurfaceHash(declared),
		source: {
			kind: record.source,
			...spec ? { spec: redactSensitiveUrlLikeString(spec) } : {},
			...packageName ? { packageName } : {},
			...resolvePluginInstallRecordIntegrity(record)
		},
		...trust ? { trust } : {},
		...widened && Object.keys(widened).length > 0 ? { widened } : {},
		...record.acceptedSurfaceAt ? { acceptedAt: record.acceptedSurfaceAt } : {}
	};
}
//#endregion
export { formatPluginCapabilityConsentRequired as a, resolvePluginInstallRecordIntegrity as c, diffDeclaredSurfaceWidening as i, resolvePluginInstallRecordTrust as l, buildPluginCapabilitySummary as n, mergePluginDeclaredSurfaces as o, computeDeclaredSurfaceHash as r, resolveAcceptedSurfaceCurrent as s, buildPluginCapabilityConsentReview as t, resolvePluginPackageDeclaredSurface as u };
