import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-hMJcajDi.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { p as resolveConfigSnapshotHash } from "./io.read-helpers-N26RjV2V.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { r as hasResolvedRosterBeforeMigrations } from "./agent-roster-provenance-BPJp3Uyw.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import { o as transformConfigFileWithRetry, s as withConfigMutationExclusive } from "./mutate-CdmDoEFy.mjs";
import "./config-DryArA1l.mjs";
import { o as readAgentDeletionJournal } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { i as validateAgentTeamMemberIds, n as loadAgentRole, r as loadAgentTeamPreset } from "./agent-roles-DYbzEdi7.mjs";
import { t as isUnconfiguredConfigSource } from "./fresh-install-config-Bi-9QLEM.mjs";
import { n as createAgent, r as validateAgentIdInput } from "./agent-create-DpqSNedE.mjs";
import path from "node:path";
//#region src/agents/agent-team.ts
/** Create a directed fleet through the same lifecycle owner as individual agents. */
async function createAgentTeam(params = {}) {
	const preset = await loadAgentTeamPreset(params.preset);
	const members = [preset.coordinator, ...preset.specialists].map((member, index) => {
		const id = index === 0 ? params.coordinator ?? member.id : member.id;
		const validation = validateAgentIdInput(params.prefix ? `${params.prefix}-${id}` : id);
		if (!validation.ok) throw new Error(validation.message);
		return {
			role: member.role,
			id: validation.agentId
		};
	});
	const ids = members.map(({ id }) => id);
	const memberIdsError = validateAgentTeamMemberIds(ids);
	if (memberIdsError) return {
		status: "error",
		message: memberIdsError
	};
	await Promise.all(members.map(({ role }) => loadAgentRole(role)));
	const coordinatorId = ids[0];
	return await withConfigMutationExclusive(async (lockedConfig) => {
		const snapshot = await readConfigFileSnapshot();
		if (!snapshot.valid) return {
			status: "error",
			message: "Cannot create a team from an invalid OpenClaw config."
		};
		if (Object.hasOwn(params, "expectedConfigHash") && (resolveConfigSnapshotHash(snapshot) ?? null) !== params.expectedConfigHash) throw new ConfigMutationConflictError("config changed before team creation", { retryable: false });
		const authoredRoster = hasResolvedRosterBeforeMigrations(snapshot);
		if (params.bootstrapFirstAgent && authoredRoster) return {
			status: "error",
			message: "Cannot create the first team: an agent roster already exists."
		};
		const bootstrapFirstAgent = !authoredRoster && (params.bootstrapFirstAgent === true || !snapshot.exists || isUnconfiguredConfigSource(snapshot.sourceConfigBeforeMigrations ?? lockedConfig));
		const existingIds = new Set(bootstrapFirstAgent ? [] : listAgentEntries(lockedConfig).map(({ id }) => normalizeAgentId(id)));
		const collisions = ids.filter((id) => existingIds.has(id));
		if (collisions.length) return {
			status: "error",
			message: `Agents already exist: ${collisions.join(", ")}. Choose another coordinator or --prefix.`
		};
		const pending = ids.filter((id) => {
			const deletion = readAgentDeletionJournal(id);
			return deletion && !deletion.cleanupCompleted;
		});
		if (pending.length) return {
			status: "error",
			message: `Agent deletion cleanup is pending: ${pending.join(", ")}.`
		};
		const workspaceRoot = resolveUserPath(params.workspaceRoot?.trim() || lockedConfig.agents?.defaults?.workspace || resolveDefaultAgentWorkspaceDir());
		const existingAmbientOwnerId = lockedConfig.agents?.defaults?.systemAgent?.agentId?.trim();
		const ambientOwnerId = existingAmbientOwnerId || coordinatorId;
		const agents = [];
		const fail = (message) => ({
			status: "error",
			message: `${message}${agents.length ? ` Created agents retained: ${agents.map(({ agentId }) => agentId).join(", ")}.` : ""}`,
			...agents.length ? { retainedAgents: agents } : {}
		});
		let config = lockedConfig;
		let configHash;
		try {
			for (const [index, member] of members.entries()) {
				const created = await createAgent({
					role: member.role,
					entry: {
						id: member.id,
						workspace: path.join(workspaceRoot, member.id),
						subagents: index === 0 ? {
							allowAgents: ids.slice(1),
							delegationMode: "prefer"
						} : { allowAgents: [] }
					},
					bootstrapFirstAgent: index === 0 && bootstrapFirstAgent,
					...index === 0 && Object.hasOwn(params, "expectedConfigHash") ? { expectedConfigHash: params.expectedConfigHash } : {},
					beforePersistentApply: params.beforePersistentApply,
					provenance: params.provenance,
					onCommitted: ({ config: createdConfig, ...summary }) => {
						config = createdConfig;
						configHash = summary.configHash;
						agents.push(summary);
					}
				});
				if (created.status === "error") return fail(created.message);
			}
			if (!existingAmbientOwnerId) {
				const committed = await transformConfigFileWithRetry({
					maxAttempts: 1,
					writeOptions: params.beforePersistentApply ? { assertConfigPathForWrite: params.beforePersistentApply } : void 0,
					transform: (currentConfig) => ({ nextConfig: {
						...currentConfig,
						agents: {
							...currentConfig.agents,
							defaults: {
								...currentConfig.agents?.defaults,
								systemAgent: {
									...currentConfig.agents?.defaults?.systemAgent,
									agentId: coordinatorId
								}
							}
						}
					} })
				});
				config = committed.nextConfig;
				configHash = committed.persistedHash ?? void 0;
			}
		} catch (error) {
			if (!agents.length) throw error;
			return fail(formatErrorMessage(error));
		}
		return {
			status: "created",
			coordinatorId,
			ambientOwnerId,
			agents,
			config,
			...configHash ? { configHash } : {}
		};
	});
}
//#endregion
export { createAgentTeam as t };
