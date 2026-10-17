import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import "./utils-DgZn2dLu.mjs";
import { f as DuplicateAgentError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import { d as withExistingOpenClawStateDatabaseCurrentReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir, k as normalizeAgentDirRegistryPath, x as toAgentEntriesRecord } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { r as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { p as resolveSessionTranscriptsDirForAgent } from "./paths-dpReqUI8.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { r as hasResolvedRosterBeforeMigrations } from "./agent-roster-provenance-CHtmWQjc.mjs";
import { o as transformConfigFileWithRetry, s as withConfigMutationExclusive } from "./mutate-BkuP-9_H.mjs";
import "./config-9720xhC5.mjs";
import { o as resolveSharedAuthStoreOwnership } from "./path-resolve-CIRhdX6A.mjs";
import { c as readAgentDeletionJournal, g as resolveAgentDeletionRecoveryHolds, k as runWithAgentCreationClaim } from "./agent-deletion-journal-CDljXcnp.mjs";
import { x as isReservedSystemAgentId } from "./agent-database-admission-dWNS6Rcs.mjs";
import { i as readAgentDeletionRecoveryHolds, n as assertAgentDeletionRecoveryHoldPredicate } from "./agent-deletion-journal-recovery.kernel-NYQbfJsi.mjs";
import { a as recordAgentProvenance } from "./agent-provenance-H6O0H8k6.mjs";
import { r as DEFAULT_IDENTITY_FILENAME } from "./workspace-bootstrap-policy-CPdXB_so.mjs";
import { a as isWorkspaceBootstrapPending, f as createWorkspaceFileMutationGuard, t as ensureAgentWorkspace } from "./workspace-C0xiByg0.mjs";
import { a as claimCompletedAgentDeletion } from "./agent-lifecycle-registry-kGv3atS9.mjs";
import { l as sanitizeAgentIdentityLine, n as createAgentIdentityConfig, o as mergeIdentityMarkdownContent } from "./identity-file-DQ9_U4uO.mjs";
import { s as resolveConfiguredAgentDatabaseTargets } from "./targets-BbcRkdUC.mjs";
import { r as findAgentEntryIndex, t as applyAgentConfig } from "./agents.config-CEaxMlw1.mjs";
import { n as loadAgentRole, t as listAgentRoles } from "./agent-roles-DcAkXaUx.mjs";
import { r as parseBindingSpecs, t as applyAgentBindings } from "./agents.bindings-D6z5L43d.mjs";
import { t as migrateLegacyMainSessionKeys } from "./legacy-main-session-migration-BRfLXqhE.mjs";
import { statSync } from "node:fs";
import fs$1 from "node:fs/promises";
//#region src/agents/agent-create.ts
const BOOTSTRAP_AGENT_ID = "main";
var InvalidAgentBindingsError = class extends Error {};
var UnfinishedRoleBootstrapError = class extends Error {};
function selectedRecoveryPaths(config, agentId, held, samePath, explicitAgentDir) {
	if (!held.some((entry) => entry.agentId === agentId)) return [];
	const currentDir = resolveAgentDir(config, agentId);
	if (explicitAgentDir !== void 0 && normalizeAgentDirRegistryPath(explicitAgentDir) !== normalizeAgentDirRegistryPath(currentDir) && findAgentEntryIndex(listAgentEntries(config), agentId) >= 0) return [];
	const targets = resolveConfiguredAgentDatabaseTargets(applyAgentConfig(config, {
		agentId,
		agentDir: explicitAgentDir ?? currentDir
	}), {
		env: process.env,
		registeredDatabases: held
	});
	return held.filter((entry) => entry.agentId === agentId && statSync(entry.path, { throwIfNoEntry: false })?.isFile() && targets.some((target) => target.agentId === agentId && samePath(target.path, entry.path))).map((entry) => entry.path);
}
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
	const beforeFileMutation = createWorkspaceFileMutationGuard(params.guard);
	const workspaceRoot = await root(params.workspaceDir);
	let existing;
	try {
		existing = (await workspaceRoot.read(DEFAULT_IDENTITY_FILENAME, { hardlinks: "reject" })).buffer.toString("utf-8");
	} catch (error) {
		if (!(error instanceof FsSafeError && error.code === "not-found")) throw error;
	}
	const content = mergeIdentityMarkdownContent(existing, params.identity);
	beforeFileMutation?.();
	await workspaceRoot.write(DEFAULT_IDENTITY_FILENAME, content, {
		encoding: "utf8",
		assertBeforeMutation: beforeFileMutation
	});
}
async function createAgent(params) {
	const expectedConfigHash = params.stagedConfig ? params.stagedConfig.writeSnapshot.snapshot.hash ?? null : params.expectedConfigHash;
	const rawName = (params.entry?.name?.trim() || params.entry?.id || params.name || "").trim();
	if (!rawName) return createError("invalid-name", "agent name is required");
	const validation = validateAgentIdInput(params.entry?.id ?? rawName, { displayName: rawName });
	if (!validation.ok) return createError(validation.reason, validation.message, validation.agentId);
	const agentId = validation.agentId;
	const isBootstrapMain = agentId === BOOTSTRAP_AGENT_ID && params.bootstrapMain === true;
	const automaticBootstrap = params.bootstrapMain === true || params.bootstrapFirstAgent === true;
	const withCreationClaim = (run) => runWithAgentCreationClaim({ agentId }, run);
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
	let creating = false;
	let identityPublished = false;
	let held = [];
	const readCurrentHolds = () => withExistingOpenClawStateDatabaseCurrentReadOnly(readAgentDeletionRecoveryHolds, { allowNativeRead: true }) ?? [];
	const recoveryPathMatcher = createOpenClawAgentDatabasePathMatcher();
	const recoveryHoldPredicate = () => ({
		agentId,
		held,
		applies: creating || !automaticBootstrap
	});
	const assertRecoveryPathCurrent = () => {
		if (!recoveryPathMatcher.isCurrent()) throw new DuplicateAgentError(`Agent ${agentId} preserved database changed during restoration; its hold remains. Restore the original database and retry agents add.`);
	};
	const assertRecoveryCurrent = () => {
		assertRecoveryPathCurrent();
		const predicate = recoveryHoldPredicate();
		if (predicate.applies) withExistingOpenClawStateDatabaseCurrentReadOnly((database) => assertAgentDeletionRecoveryHoldPredicate(database, predicate), { allowNativeRead: true });
	};
	const hasBootstrapHold = () => automaticBootstrap && readCurrentHolds().some((entry) => entry.agentId === agentId);
	const assertHost = () => {
		params.beforePersistentApply?.();
		if (!identityPublished) params.assertIdentityInputAllowed?.();
		assertRecoveryPathCurrent();
	};
	const beforePersistentApply = () => {
		assertHost();
		assertRecoveryCurrent();
	};
	try {
		return await withConfigMutationExclusive(async (lockedConfig) => {
			held = automaticBootstrap ? [] : readCurrentHolds();
			const recoveryPaths = selectedRecoveryPaths(lockedConfig, agentId, held, recoveryPathMatcher, explicitAgentDir);
			if (recoveryPaths.length === 0 && held.some((entry) => entry.agentId === agentId)) return createError("already-exists", `Agent ${agentId} has held databases. Restore its original agentDir and session.store configuration, then rerun agents add to restore the preserved store.`, agentId);
			const gateError = recoveryPaths.length > 0 || hasBootstrapHold() ? void 0 : await evaluateMainCreationGate(lockedConfig, agentId);
			if (gateError) return gateError;
			beforePersistentApply();
			const deletion = hasBootstrapHold() ? void 0 : readAgentDeletionJournal(agentId, {}, "runtime");
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
						beforePersistentApply();
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
					if (existingIndex >= 0 && !isBootstrapMain && recoveryPaths.length === 0) throw new DuplicateAgentError();
					if (existingIndex >= 0 && (recoveryPaths.length > 0 || isBootstrapMain && (currentEntries.length !== 1 || !isInjectedBootstrapMainEntry(existingEntry) || context.snapshot.exists))) return {
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
					creating = true;
					const workspaceDir = explicitWorkspace ?? resolveAgentWorkspaceDir(currentConfig, agentId);
					const agentDir = explicitAgentDir ?? resolveAgentDir(currentConfig, agentId);
					const materializeInjectedMain = existingIndex >= 0 && isBootstrapMain && isInjectedBootstrapMainEntry(existingEntry) && !context.snapshot.exists;
					const creationBase = bootstrappingFirstAgent ? {
						...currentConfig,
						agents: {
							...currentConfig.agents,
							entries: {}
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
						const list = listAgentEntries(nextConfig);
						const index = findAgentEntryIndex(list, agentId);
						list[index] = {
							...list[index],
							...template ? { subagents: params.role === "coordinator" ? {
								allowAgents: listAgentRoles().filter((role) => role !== "coordinator"),
								delegationMode: "prefer"
							} : { allowAgents: [] } } : {},
							...params.entry,
							id: agentId,
							name: safeName,
							workspace: workspaceDir,
							agentDir,
							identity
						};
						nextConfig = {
							...nextConfig,
							agents: {
								...nextConfig.agents,
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
					beforePersistentApply();
					const workspace = await ensureAgentWorkspace({
						dir: workspaceDir,
						guard: {
							assertHost,
							recoveryHoldPredicate: recoveryHoldPredicate()
						},
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
							nextConfig = {
								...nextConfig,
								agents: {
									...nextConfig.agents,
									entries: toAgentEntriesRecord(entries)
								}
							};
						}
					}
					beforePersistentApply();
					await fs$1.mkdir(resolveSessionTranscriptsDirForAgent(agentId), { recursive: true });
					if (!template && !workspace.bootstrapPending && !skipBootstrap) {
						await writeIdentityFile({
							workspaceDir: workspace.dir,
							identity,
							guard: {
								assertHost,
								recoveryHoldPredicate: recoveryHoldPredicate()
							}
						});
						identityPublished = true;
					}
					beforePersistentApply();
					if (params.prepareConfigCommit) {
						const prepareConfigCommit = params.prepareConfigCommit;
						await withCreationClaim(async () => {
							configCommitReceipt = await prepareConfigCommit() ?? void 0;
						});
					}
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
			if (committedReceipt) await withCreationClaim(async () => await committedReceipt.commit());
			if (deletion?.cleanupCompleted && !tombstoneClaimed && committed.result?.status === "created" && !claimCompletedAgentDeletion(agentId, deletion.operationId)) throw new Error(`agent "${agentId}" deletion tombstone changed during creation`);
			if (result.status === "created") recordAgentProvenance(agentId, params.provenance ?? { createdVia: "operator" });
			if (recoveryPaths.length > 0) {
				assertRecoveryCurrent();
				const confirmedPaths = selectedRecoveryPaths(result.config, agentId, held, recoveryPathMatcher);
				const selectedPaths = recoveryPaths.filter((pathname) => confirmedPaths.includes(pathname));
				runOpenClawStateWriteTransaction((database) => {
					assertRecoveryCurrent();
					resolveAgentDeletionRecoveryHolds(database, agentId, selectedPaths);
				});
			}
			return result;
		});
	} catch (error) {
		if (configCommitReceipt) {
			const stagedReceipt = configCommitReceipt;
			try {
				await withCreationClaim(async () => await stagedReceipt.rollback());
			} catch (rollbackError) {
				throw new Error(`${String(error)}\nstaged config rollback failed: ${String(rollbackError)}`, { cause: rollbackError });
			}
		}
		if (error instanceof DuplicateAgentError) return createError("already-exists", error.message || `agent "${agentId}" already exists`, agentId);
		if (error instanceof InvalidAgentBindingsError) return createError("invalid-bindings", error.message, agentId);
		if (error instanceof UnfinishedRoleBootstrapError) return createError("unfinished-bootstrap", "The workspace has an unfinished bootstrap. Complete it first or choose a new workspace for this role.", agentId);
		if (error instanceof FsSafeError) return createError("unsafe-identity-file", `unsafe workspace file "${DEFAULT_IDENTITY_FILENAME}"`, agentId);
		throw error;
	}
}
//#endregion
export { createAgent as n, validateAgentIdInput as r, checkAgentCreationGate as t };
