import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { n as isManagedGitHubProfileId } from "./github-identity-profile-id-BJzGq1wi.mjs";
import { T as listGitHubOAuthRecords, _ as resolveManagedGitHubProfileRoot, h as resolveManagedGitHubAgentKey } from "./github-tool-identity-2S4ost1l.mjs";
import path from "node:path";
import { assertDirectoryIdentitySync, readDirectoryIdentity } from "@openclaw/fs-safe/advanced";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { root } from "@openclaw/fs-safe/root";
//#region src/agents/github-tool-profile-cleanup.ts
const MAX_CLEANUP_WARNINGS = 20;
const STAGING_PROFILE_PREFIX = ".github-profile.staging-";
const MANAGED_AGENT_KEY_PATTERN = /^[a-f0-9]{64}$/u;
async function readCleanupDirectory(candidate, label, warnings) {
	let identity;
	try {
		identity = await readDirectoryIdentity(candidate);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		if (error instanceof FsSafeError && error.code === "not-file") {
			warnings.push(`refused unsafe ${label}: ${candidate}`);
			return;
		}
		throw error;
	}
	if (identity.realPath !== path.resolve(candidate)) {
		warnings.push(`refused escaped ${label}: ${candidate}`);
		return;
	}
	return identity;
}
async function openCleanupRoot(candidate, label, warnings) {
	const identity = await readCleanupDirectory(candidate, label, warnings);
	if (!identity) return;
	const root$1 = await root(candidate, { assertBeforeMutation: () => assertDirectoryIdentitySync(candidate, identity) });
	if (root$1.rootReal !== identity.realPath) throw new FsSafeError("path-mismatch", "managed GitHub profile root changed during cleanup");
	return root$1;
}
async function cleanupProfileRoot(params) {
	const orphanAgent = params.preservedProfileIds === void 0;
	const label = orphanAgent ? "managed GitHub agent profile" : "managed GitHub profile";
	const directory = path.join(params.root.rootReal, params.directory);
	const identity = await readCleanupDirectory(directory, `${label} root`, params.warnings);
	if (!identity) return 0;
	const candidates = [];
	for (const entry of await params.root.list(params.directory, { withFileTypes: true })) {
		const candidate = path.join(directory, entry.name);
		if (!isManagedGitHubProfileId(entry.name) && !entry.name.startsWith(STAGING_PROFILE_PREFIX)) params.warnings.push(`ignored unexpected ${label} entry: ${candidate}`);
		else if (!entry.isDirectory || entry.isSymbolicLink) params.warnings.push(`refused unsafe ${label} cleanup candidate: ${candidate}`);
		else {
			if (!params.preservedProfileIds?.has(entry.name)) candidates.push(path.join(params.directory, entry.name));
			continue;
		}
		if (orphanAgent) return 0;
	}
	let removed = 0;
	for (const relativePath of orphanAgent ? [params.directory] : candidates) {
		const candidate = path.join(params.root.rootReal, relativePath);
		const candidateIdentity = orphanAgent ? identity : await readCleanupDirectory(candidate, `${label} cleanup candidate`, params.warnings);
		if (!candidateIdentity) continue;
		await params.root.remove(relativePath, {
			recursive: true,
			maxEntries: Infinity,
			maxDepth: Infinity,
			assertBeforeMutation: () => {
				assertDirectoryIdentitySync(directory, identity);
				if (!orphanAgent) assertDirectoryIdentitySync(candidate, candidateIdentity);
			}
		});
		removed += 1;
	}
	return removed;
}
/** Retires only generations unreferenced by the immutable startup config snapshot. */
async function cleanupRetiredManagedGitHubProfiles(params) {
	const warnings = [];
	const systemRoot = resolveManagedGitHubProfileRoot({
		agentId: "system",
		scope: "system",
		env: params.env
	});
	const systemProfiles = new Set(params.config.tools?.github?.profileId ? [params.config.tools.github.profileId] : []);
	const agentProfiles = new Map(listAgentIds(params.config).map((agentId) => {
		const profileId = resolveAgentConfig(params.config, agentId)?.tools?.github?.profileId;
		return [resolveManagedGitHubAgentKey(agentId), new Set(profileId ? [profileId] : [])];
	}));
	for (const { record } of listGitHubOAuthRecords()) {
		if (!record) continue;
		if (record.scope === "system") {
			systemProfiles.add(record.profileId);
			continue;
		}
		const agentKey = resolveManagedGitHubAgentKey(record.agentId);
		const profiles = agentProfiles.get(agentKey) ?? /* @__PURE__ */ new Set();
		profiles.add(record.profileId);
		agentProfiles.set(agentKey, profiles);
	}
	let removed = 0;
	const system = await openCleanupRoot(systemRoot, "managed GitHub profile root", warnings);
	if (system) removed += await cleanupProfileRoot({
		root: system,
		directory: ".",
		preservedProfileIds: systemProfiles,
		warnings
	});
	const registry = await openCleanupRoot(path.join(path.dirname(systemRoot), "agents"), "managed GitHub agent registry", warnings);
	if (registry) for (const entry of await registry.list(".", { withFileTypes: true })) {
		if (!MANAGED_AGENT_KEY_PATTERN.test(entry.name)) {
			warnings.push(`ignored unexpected managed GitHub agent entry: ${path.join(registry.rootReal, entry.name)}`);
			continue;
		}
		removed += await cleanupProfileRoot({
			root: registry,
			directory: entry.name,
			preservedProfileIds: agentProfiles.get(entry.name),
			warnings
		});
	}
	if (warnings.length <= MAX_CLEANUP_WARNINGS) return {
		removed,
		warnings
	};
	const omitted = warnings.length - MAX_CLEANUP_WARNINGS;
	return {
		removed,
		warnings: [...warnings.slice(0, MAX_CLEANUP_WARNINGS), `omitted ${omitted} additional managed GitHub profile cleanup warnings`]
	};
}
//#endregion
export { cleanupRetiredManagedGitHubProfiles };
