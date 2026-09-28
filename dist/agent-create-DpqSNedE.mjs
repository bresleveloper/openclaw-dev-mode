import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, a as resolveAgentDir, l as resolveAgentWorkspaceDir, v as toAgentEntriesRecord } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { f as resolveSessionTranscriptsDirForAgent } from "./paths-CcMbq5NY.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { r as hasResolvedRosterBeforeMigrations } from "./agent-roster-provenance-BPJp3Uyw.mjs";
import { o as transformConfigFileWithRetry, s as withConfigMutationExclusive } from "./mutate-CdmDoEFy.mjs";
import "./config-DryArA1l.mjs";
import { o as resolveSharedAuthStoreOwnership } from "./path-resolve-Bm8Ih2d_.mjs";
import { g as isReservedSystemAgentId } from "./agent-database-admission-BFwcs62N.mjs";
import { m as recordAgentProvenance, o as readAgentDeletionJournal } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { r as DEFAULT_IDENTITY_FILENAME } from "./workspace-bootstrap-policy-DSEIbIS8.mjs";
import { i as isWorkspaceBootstrapPending, t as ensureAgentWorkspace } from "./workspace-mlzi3k1x.mjs";
import { i as claimCompletedAgentDeletion } from "./agent-lifecycle-registry-D47RUurT.mjs";
import { a as mergeIdentityMarkdownContent, n as createAgentIdentityConfig, s as sanitizeAgentIdentityLine } from "./identity-file-By55_88F.mjs";
import { r as findAgentEntryIndex, t as applyAgentConfig } from "./agents.config-BnlRDoFW.mjs";
import { n as loadAgentRole, t as listAgentRoles } from "./agent-roles-DYbzEdi7.mjs";
import { r as parseBindingSpecs, t as applyAgentBindings } from "./agents.bindings-BDLKxy0x.mjs";
import { t as migrateLegacyMainSessionKeys } from "./legacy-main-session-migration-C7F4XLva.mjs";
import fs from "node:fs/promises";
//#region src/agents/agent-create.ts
const BOOTSTRAP_AGENT_ID = "main";
var DuplicateAgentError = class extends Error {};
var InvalidAgentBindingsError = class extends Error {};
var UnfinishedRoleBootstrapError = class extends Error {};
function createError(reason, message, agentId) {
	return {
		status: "error",
		reason,
		message,
		...agentId ? { agentId } : {}
	};
}
function validateAgentIdInput(rawId, options = {}) {
	const displayName = options.displayName ?? rawId;
	const normalized = normalizeAgentIdStrict(rawId);
	if (!normalized.ok) return {
		ok: false,
		reason: "invalid-name",
		message: `Agent name "${displayName}" has no valid id characters. Use at least one letter a-z or digit.`
	};
	const agentId = normalized.value;
	if (isReservedSystemAgentId(agentId)) return {
		ok: false,
		reason: "reserved-id",
		message: `"${agentId}" is reserved`,
		agentId
	};
	return {
		ok: true,
		agentId
	};
}
function isInjectedBootstrapMainEntry(entry) {
	return entry?.id === BOOTSTRAP_AGENT_ID && Object.keys(entry).every((key) => key === "id");
}
function describeLegacySessionOutcome(outcome) {
	const claims = (outcome.sourceKeys ?? []).map((key, index) => `${outcome.paths?.[index] ?? outcome.paths?.[0] ?? "session store"}#${key}`);
	switch (outcome.kind) {
		case "divergent-aliases":
		case "divergent-canonical": return `${outcome.kind} for ${outcome.canonicalKey ?? "the canonical session"}; preserved claims ${claims.join(", ") || "could not be reconciled"} must be quarantined`;
		case "legacy-json-store": return `legacy JSON session store ${outcome.paths?.join(", ") ?? "requires import"}`;
		case "store-unreadable": return `unreadable session store ${outcome.paths?.join(", ") ?? "unknown"}${outcome.detail ? ` (${outcome.detail})` : ""}`;
		case "migrated-in-place":
		case "migrated-cross-store":
		case "canonical-exists-identical": return `legacy claim ${claims.join(", ") || outcome.canonicalKey || "requires migration"}`;
		case "not-armed": return outcome.detail === "owner-unresolved" ? "legacy main sessions have no unambiguous configured owner; set agents.defaults.sessionStore.agentId to the intended live owner" : `legacy main session migration is not armed (${outcome.detail ?? "unknown reason"})`;
		case "no-legacy-rows": return "the current session-store layout has no matching completed migration ledger";
	}
	return outcome.kind;
}
async function evaluateMainCreationGate(config, agentId) {
	const roster = listAgentEntries(config).map((entry) => normalizeAgentId(entry.id));
	if (agentId !== BOOTSTRAP_AGENT_ID || roster.includes(BOOTSTRAP_AGENT_ID) || !roster.some((id) => id !== BOOTSTRAP_AGENT_ID)) return;
	const migration = await migrateLegacyMainSessionKeys({
		cfg: config,
		forceScan: true,
		legacyAgentId: BOOTSTRAP_AGENT_ID,
		mode: "detect"
	});
	const provenClean = migration.outcomes.every((outcome) => outcome.kind === "no-legacy-rows");
	if (migration.armed ? !migration.ledgerComplete : !provenClean) return createError("legacy-session-migration-required", `Cannot create agent "main": ${migration.outcomes.map(describeLegacySessionOutcome).join("; ")}. Run openclaw doctor --fix, then retry.`, agentId);
	if (resolveSharedAuthStoreOwnership().location !== "state-db") return createError("shared-auth-store-owned-by-main", "Cannot create agent \"main\" while agents/main/agent owns the shared auth store. Run openclaw doctor --fix to relocate shared auth, then retry.", agentId);
}
/** Read-only early check for guided flows that stage side effects before their final create. */
async function checkAgentCreationGate(agentId) {
	return await withConfigMutationExclusive(async (lockedConfig) => await evaluateMainCreationGate(lockedConfig, normalizeAgentId(agentId)));
}
async function writeIdentityFile(params) {
	const workspaceRoot = await root(params.workspaceDir);
	let existing;
	try {
		existing = (await workspaceRoot.read(DEFAULT_IDENTITY_FILENAME, {
			hardlinks: "reject",
			nonBlockingRead: true
		})).buffer.toString("utf-8");
	} catch (error) {
		if (!(error instanceof FsSafeError && error.code === "not-found")) throw error;
	}
	const content = mergeIdentityMarkdownContent(existing, params.identity);
	params.beforePersistentApply?.();
	await workspaceRoot.write(DEFAULT_IDENTITY_FILENAME, content, { encoding: "utf8" });
}
async function createAgent(params) {
	const expectedConfigHash = params.stagedConfig ? params.stagedConfig.writeSnapshot.snapshot.hash ?? null : params.expectedConfigHash;
	const rawName = (params.entry?.name?.trim() || params.entry?.id || params.name || "").trim();
	if (!rawName) return createError("invalid-name", "agent name is required");
	const validation = validateAgentIdInput(params.entry?.id ?? rawName, { displayName: rawName });
	if (!validation.ok) return createError(validation.reason, validation.message, validation.agentId);
	const agentId = validation.agentId;
	const isBootstrapMain = agentId === BOOTSTRAP_AGENT_ID && params.bootstrapMain === true;
	const template = params.role ? await loadAgentRole(params.role) : void 0;
	const safeName = sanitizeAgentIdentityLine(rawName);
	const model = normalizeOptionalString(params.model);
	const identity = (template ? {
		...template.identity,
		...params.entry?.identity
	} : void 0) ?? params.entry?.identity ?? createAgentIdentityConfig({
		name: safeName,
		emoji: params.emoji,
		avatar: params.avatar
	}) ?? { name: safeName };
	const requestedWorkspace = params.entry?.workspace ?? params.workspace;
	const explicitWorkspace = requestedWorkspace?.trim() ? resolveUserPath(requestedWorkspace.trim()) : void 0;
	const requestedAgentDir = params.entry?.agentDir ?? params.agentDir;
	const explicitAgentDir = requestedAgentDir?.trim() ? resolveUserPath(requestedAgentDir.trim()) : void 0;
	const transformConfig = params.transformConfig ?? transformConfigFileWithRetry;
	let configCommitReceipt;
	try {
		return await withConfigMutationExclusive(async (lockedConfig) => {
			const gateError = await evaluateMainCreationGate(lockedConfig, agentId);
			if (gateError) return gateError;
			params.beforePersistentApply?.();
			const deletion = readAgentDeletionJournal(agentId);
			if (deletion && !deletion.cleanupCompleted) return createError("deletion-pending", `agent "${agentId}" deletion cleanup is still pending`, agentId);
			let tombstoneClaimed = false;
			if (deletion?.cleanupCompleted && findAgentEntryIndex(listAgentEntries(lockedConfig), agentId) >= 0) {
				if (!claimCompletedAgentDeletion(agentId, deletion.operationId)) throw new Error(`agent "${agentId}" deletion tombstone changed during creation`);
				tombstoneClaimed = true;
			}
			const committed = await transformConfig({
				afterWrite: { mode: "auto" },
				maxAttempts: 1,
				writeOptions: {
					...params.stagedConfig?.writeSnapshot.writeOptions,
					...params.bootstrapFirstAgent ? { allowedAgentRosterRemovals: [BOOTSTRAP_AGENT_ID] } : {},
					assertConfigPathForWrite: () => {
						params.stagedConfig?.writeSnapshot.writeOptions.assertConfigPathForWrite?.();
						params.beforePersistentApply?.();
					}
				},
				transform: async (currentConfig, context) => {
					if ((params.stagedConfig || Object.hasOwn(params, "expectedConfigHash")) && context.previousHash !== expectedConfigHash) throw new ConfigMutationConflictError("config changed before first-agent creation", { retryable: false });
					const hasAuthoredRoster = params.bootstrapFirstAgent === true && hasResolvedRosterBeforeMigrations(context.snapshot);
					if (params.bootstrapFirstAgent && hasAuthoredRoster) throw new DuplicateAgentError();
					const bootstrappingFirstAgent = params.bootstrapFirstAgent === true;
					const currentEntries = bootstrappingFirstAgent ? [] : listAgentEntries(currentConfig);
					const existingIndex = findAgentEntryIndex(currentEntries, agentId);
					const existingEntry = currentEntries[existingIndex];
					if (isBootstrapMain && currentEntries.length > 0 && !currentEntries.some((entry) => normalizeAgentId(entry.id) === BOOTSTRAP_AGENT_ID)) throw new DuplicateAgentError();
					if (existingIndex >= 0 && !isBootstrapMain) throw new DuplicateAgentError();
					if (existingIndex >= 0 && isBootstrapMain && (currentEntries.length !== 1 || !isInjectedBootstrapMainEntry(existingEntry) || context.snapshot.exists)) return {
						nextConfig: currentConfig,
						result: {
							status: "existing",
							agentId,
							name: existingEntry?.name ?? safeName,
							workspace: resolveAgentWorkspaceDir(currentConfig, agentId),
							agentDir: resolveAgentDir(currentConfig, agentId),
							bootstrapPending: false
						}
					};
					const workspaceDir = explicitWorkspace ?? resolveAgentWorkspaceDir(currentConfig, agentId);
					const agentDir = explicitAgentDir ?? resolveAgentDir(currentConfig, agentId);
					const materializeInjectedMain = existingIndex >= 0 && isBootstrapMain && isInjectedBootstrapMainEntry(existingEntry) && !context.snapshot.exists;
					const creationBase = bootstrappingFirstAgent ? {
						...currentConfig,
						agents: {
							...currentConfig.agents,
							entries: {},
							list: void 0
						}
					} : params.stagedConfig?.config ?? currentConfig;
					let nextConfig = existingIndex < 0 || materializeInjectedMain ? applyAgentConfig(creationBase, {
						agentId,
						name: safeName,
						workspace: workspaceDir,
						agentDir,
						model,
						identity
					}) : creationBase;
					if (params.entry || template) {
						const { default: _retiredDefault, ...stagedEntry } = params.entry ?? {};
						const list = listAgentEntries(nextConfig);
						const index = findAgentEntryIndex(list, agentId);
						list[index] = {
							...list[index],
							...template ? { subagents: params.role === "coordinator" ? {
								allowAgents: listAgentRoles().filter((role) => role !== "coordinator"),
								delegationMode: "prefer"
							} : { allowAgents: [] } } : {},
							...stagedEntry,
							id: agentId,
							name: safeName,
							workspace: workspaceDir,
							agentDir,
							identity
						};
						const { list: _legacyList, ...agentsConfig } = nextConfig.agents ?? {};
						nextConfig = {
							...nextConfig,
							agents: {
								...agentsConfig,
								entries: toAgentEntriesRecord(list)
							}
						};
					}
					const bindingParse = parseBindingSpecs({
						agentId,
						specs: params.bindingSpecs,
						config: nextConfig
					});
					if (bindingParse.errors.length > 0) throw new InvalidAgentBindingsError(bindingParse.errors.join("\n"));
					const bindingResult = bindingParse.bindings.length ? applyAgentBindings(nextConfig, bindingParse.bindings) : void 0;
					nextConfig = bindingResult?.config ?? nextConfig;
					const skipBootstrap = template ? false : params.skipBootstrap ?? nextConfig.agents?.defaults?.skipBootstrap;
					if (template && await isWorkspaceBootstrapPending(workspaceDir)) throw new UnfinishedRoleBootstrapError();
					params.beforePersistentApply?.();
					const workspace = await ensureAgentWorkspace({
						dir: workspaceDir,
						beforePersistentApply: params.beforePersistentApply,
						ensureBootstrapFiles: !skipBootstrap,
						purpose: params.purpose,
						...template ? { templates: params.entry?.identity ? {
							...template.files,
							[DEFAULT_IDENTITY_FILENAME]: mergeIdentityMarkdownContent(template.files[DEFAULT_IDENTITY_FILENAME], identity)
						} : template.files } : {},
						skipOptionalBootstrapFiles: template ? [] : params.skipOptionalBootstrapFiles ?? nextConfig.agents?.defaults?.skipOptionalBootstrapFiles
					});
					if (workspace.dir !== workspaceDir) {
						const entries = listAgentEntries(nextConfig);
						const entryIndex = findAgentEntryIndex(entries, agentId);
						const currentEntry = entries[entryIndex];
						if (entryIndex >= 0 && currentEntry) {
							entries[entryIndex] = {
								...currentEntry,
								id: agentId,
								workspace: workspace.dir
							};
							const { list: _legacyList, ...agentsConfig } = nextConfig.agents ?? {};
							nextConfig = {
								...nextConfig,
								agents: {
									...agentsConfig,
									entries: toAgentEntriesRecord(entries)
								}
							};
						}
					}
					params.beforePersistentApply?.();
					await fs.mkdir(resolveSessionTranscriptsDirForAgent(agentId), { recursive: true });
					if (!template && !workspace.bootstrapPending && !skipBootstrap) await writeIdentityFile({
						workspaceDir: workspace.dir,
						identity,
						beforePersistentApply: params.beforePersistentApply
					});
					params.beforePersistentApply?.();
					const preparedReceipt = await params.prepareConfigCommit?.();
					configCommitReceipt = preparedReceipt ? preparedReceipt : void 0;
					return {
						nextConfig,
						result: {
							status: existingIndex >= 0 ? "existing" : "created",
							agentId,
							name: safeName,
							workspace: workspace.dir,
							agentDir,
							...model ? { model } : {},
							bootstrapPending: workspace.bootstrapPending === true,
							...bindingResult ? { bindingResult } : {}
						}
					};
				}
			});
			const committedReceipt = configCommitReceipt;
			configCommitReceipt = void 0;
			const result = {
				...committed.result,
				config: committed.nextConfig,
				configPath: committed.path,
				...typeof committed.persistedHash === "string" ? { configHash: committed.persistedHash } : {}
			};
			params.onCommitted?.(result);
			await committedReceipt?.commit();
			if (deletion?.cleanupCompleted && !tombstoneClaimed && committed.result?.status === "created" && !claimCompletedAgentDeletion(agentId, deletion.operationId)) throw new Error(`agent "${agentId}" deletion tombstone changed during creation`);
			if (result.status === "created") recordAgentProvenance(agentId, params.provenance ?? { createdVia: "operator" });
			return result;
		});
	} catch (error) {
		if (configCommitReceipt) try {
			await configCommitReceipt.rollback();
		} catch (rollbackError) {
			throw new Error(`${String(error)}\nstaged config rollback failed: ${String(rollbackError)}`, { cause: rollbackError });
		}
		if (error instanceof DuplicateAgentError) return createError("already-exists", `agent "${agentId}" already exists`, agentId);
		if (error instanceof InvalidAgentBindingsError) return createError("invalid-bindings", error.message, agentId);
		if (error instanceof UnfinishedRoleBootstrapError) return createError("unfinished-bootstrap", "The workspace has an unfinished bootstrap. Complete it first or choose a new workspace for this role.", agentId);
		if (error instanceof FsSafeError) return createError("unsafe-identity-file", `unsafe workspace file "${DEFAULT_IDENTITY_FILENAME}"`, agentId);
		throw error;
	}
}
//#endregion
export { createAgent as n, validateAgentIdInput as r, checkAgentCreationGate as t };
