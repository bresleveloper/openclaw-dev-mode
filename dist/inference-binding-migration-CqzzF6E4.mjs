import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-wdC9jpCz.mjs";
import { a as resolveAgentDir, f as resolveAgentWorkspaceDir, r as resolveAgentConfig, w as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { W as isUserModelAuthProfileId } from "./user-model-account-authority-DFFjC5J5.mjs";
import { i as resolveSessionAuthProfileOverrideSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { d as isConfiguredKeyAuthSource } from "./provider-model-route-auth-C7odu5x8.mjs";
import { o as resolveProviderModelAuthPolicy, r as resolveModelRuntimePolicy } from "./model-runtime-policy-DSkspt0X.mjs";
import { n as isStoredCredentialCompatibleWithAuthProvider, o as resolveAuthProfileOrderWithMetadata } from "./order-CElLtwMu.mjs";
import { a as isCliRuntimeProvider, c as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-BQN27lQg.mjs";
import { i as hasSyntheticLocalProviderAuthConfig, v as resolveProviderEntryApiKeyProfileReference } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { g as loadAuthProfileStoreWithoutExternalProfilesAsync } from "./store-runtime-CwqGD12G.mjs";
import { r as tryResolveCronJobEffectiveAgentId } from "./agent-id-C6uS-TyD.mjs";
import { t as resolveCronAgentSessionKey } from "./session-key-CWEGpfa5.mjs";
import { n as isDetachedCronSessionTarget, r as isInvalidCronSessionTargetIdError, s as resolveCronSessionTargetSessionKey } from "./session-target-d98pYOqN.mjs";
import { o as resolveProviderAuthProfileId } from "./provider-hook-runtime-DHSjZAkW.mjs";
import "./provider-runtime-DZ8luukj.mjs";
import { t as normalizeCronJobCreate } from "./normalize-D_B-pqo1.mjs";
import { r as prepareAgentRuntimeAuth } from "./prepare-auth-B180a1GD.mjs";
import { t as resolveCronModelSelection } from "./model-selection-CMyRXv1q.mjs";
import { t as captureAuthProfileAuthorization } from "./authorization-B3JnDROQ.mjs";
import { i as repairCronInferenceBindingsForDoctor, r as inspectCronJobsForDoctor } from "./store-repair-CESfdSN7.mjs";
import { n as prepareCronSession } from "./session-MNiALRV_.mjs";
//#region src/commands/doctor/cron/inference-binding-migration.ts
/** Adopt the planned eligible account once; never reinterpret run telemetry as authority. */
async function maybeRepairCronInferenceBindings(params) {
	const env = params.env ?? process.env;
	const warnings = [];
	const retained = [];
	const changes = [];
	const descriptions = [];
	try {
		const maintenance = getOpenClawDatabaseMaintenanceScope();
		if (params.shouldRepair && !maintenance?.ownsSchemaMaintenance) throw new Error("Inference account migration requires offline Doctor maintenance.");
		const inventory = await inspectCronJobsForDoctor({ env });
		for (const stored of inventory.jobs) {
			const definition = stored.definition;
			if (!definition || stored.invalidReason || definition.inferenceBinding !== void 0 || definition.runtimeAuthority !== void 0 || definition.runtimeAuthorityRecoveryRequired) continue;
			let modelRef;
			const label = `${normalizeOptionalString(definition.name) ?? stored.id} (${stored.id})`;
			try {
				const job = normalizeCronJobCreate(definition);
				if (!job || job.payload.kind !== "agentTurn" || job.sessionTarget === "main") continue;
				modelRef = job.payload.model;
				const agentId = tryResolveCronJobEffectiveAgentId(job, tryResolveAmbientOwnerAgentId(params.cfg));
				if (!agentId || !resolveAgentConfig(params.cfg, agentId)) throw new Error("Select the job's execution agent before adopting an inference account.");
				const baseKey = resolveCronSessionTargetSessionKey(job.sessionTarget) ?? `cron:${stored.id}`;
				const sessionKey = resolveCronAgentSessionKey({
					cfg: params.cfg,
					agentId,
					sessionKey: baseKey
				});
				const sourceSessionKey = job.sessionTarget === "current" && job.sessionKey ? resolveCronAgentSessionKey({
					cfg: params.cfg,
					agentId,
					sessionKey: job.sessionKey
				}) : void 0;
				const session = await prepareCronSession({
					cfg: params.cfg,
					agentId,
					sessionKey,
					sourceSessionKey,
					forceNew: isDetachedCronSessionTarget(job.sessionTarget),
					exactRunSession: true,
					nowMs: Date.now()
				});
				if (session.initialSessionEntry?.modelSelectionLocked === true) {
					warnings.push(`Automation ${label}: its session is owned by a native runtime; no host inference account was adopted. Recover ownership through that runtime before changing this job.`);
					continue;
				}
				const selected = await resolveCronModelSelection({
					cfg: params.cfg,
					agentId,
					agentDir: resolveAgentDir(params.cfg, agentId),
					workspaceDir: resolveAgentWorkspaceDir(params.cfg, agentId),
					agentConfigOverride: resolveAgentConfig(params.cfg, agentId),
					sessionEntry: session.sessionEntry,
					payload: job.payload,
					isGmailHook: job.payload.externalContentSource === "gmail"
				});
				if (!selected.ok) throw new Error(selected.error);
				modelRef = `${selected.provider}/${selected.model}`;
				const cfg = selected.owner.config;
				if (isCliRuntimeProvider(selected.provider, { config: cfg }) || resolveCliRuntimeExecutionProvider({
					cfg,
					agentId,
					provider: selected.provider,
					modelId: selected.model
				})) continue;
				const runtime = resolveSessionRuntimeOverrideForProvider({
					cfg,
					provider: selected.provider,
					entry: session.sessionEntry
				}) ?? resolveModelRuntimePolicy({
					config: cfg,
					agentId,
					provider: selected.provider,
					modelId: selected.model
				}).policy?.id;
				if (runtime && runtime !== "openclaw" && runtime !== "auto") {
					warnings.push(`Automation ${label}: runtime ${runtime} inference ownership was left unchanged; no host account was adopted. Use that runtime's account/recovery flow if this job needs adoption.`);
					continue;
				}
				const store = await loadAuthProfileStoreWithoutExternalProfilesAsync(selected.owner.agentDir);
				const sessionPin = resolveSessionAuthProfileOverrideSource(session.sessionEntry);
				const sessionProfileId = session.sessionEntry.authProfileOverride;
				const sessionCredential = sessionProfileId ? store.profiles[sessionProfileId] : void 0;
				const compatibleSessionPin = !sessionCredential || isStoredCredentialCompatibleWithAuthProvider({
					cfg,
					provider: selected.provider,
					credential: sessionCredential
				});
				let explicitProfileId = selected.configuredProfileId ?? ((sessionPin === "user" || sessionPin === "user-link") && compatibleSessionPin ? sessionProfileId : void 0);
				const explicitUserSelection = Boolean(explicitProfileId);
				const currentAuth = prepareAgentRuntimeAuth({
					config: cfg,
					provider: selected.provider,
					modelId: selected.model,
					agentId,
					agentDir: selected.owner.agentDir,
					workspaceDir: selected.owner.workspaceDir,
					authProfileStore: store,
					sessionAuthProfileId: explicitProfileId,
					sessionAuthProfileSource: explicitProfileId ? "user" : void 0,
					...explicitProfileId ? {
						requiredAuthProfileId: explicitProfileId,
						allowAuthProfileFallback: false
					} : {},
					resolveProviderPreferredProfileId: (context) => resolveProviderAuthProfileId({
						provider: selected.provider,
						config: cfg,
						workspaceDir: selected.owner.workspaceDir,
						env,
						context
					})
				});
				const firstSource = currentAuth.attempts[0]?.plan.credentialSource;
				if (isConfiguredKeyAuthSource(firstSource)) continue;
				if (firstSource?.kind === "direct") throw new Error("The current route uses an ambient credential, not a durable stored account.");
				if (!explicitProfileId) {
					const providerPin = resolveProviderEntryApiKeyProfileReference({
						cfg,
						provider: selected.provider,
						store
					});
					const firstAttempt = currentAuth.attempts[0];
					if (providerPin.kind === "profile" && firstAttempt?.kind === "profile" && firstAttempt.profileId === providerPin.profileId) explicitProfileId = providerPin.profileId;
				}
				const order = explicitProfileId ? [explicitProfileId] : resolveAuthProfileOrderWithMetadata({
					cfg,
					store,
					provider: selected.provider,
					forModel: selected.model,
					readinessMode: "read-only",
					includePendingOAuthRefresh: true
				}).profileIds;
				const candidates = [];
				for (const profileId of order) try {
					const [attempt] = prepareAgentRuntimeAuth({
						config: cfg,
						provider: selected.provider,
						modelId: selected.model,
						agentId,
						agentDir: selected.owner.agentDir,
						workspaceDir: selected.owner.workspaceDir,
						authProfileStore: store,
						requiredAuthProfileId: profileId,
						allowAuthProfileFallback: false
					}).attempts;
					const credential = store.profiles[profileId];
					const authRequirement = attempt?.plan.modelRoute?.authRequirement ?? (credential && resolveProviderModelAuthPolicy({
						provider: selected.provider,
						mode: credential.type,
						authFlow: credential.type === "oauth" ? credential.authFlow : void 0
					}).authRequirement);
					if (attempt?.kind === "profile" && attempt.profileId === profileId && authRequirement) candidates.push({
						profileId,
						authRequirement
					});
				} catch (error) {
					if (explicitProfileId) throw error;
				}
				if (candidates.length === 0 && !explicitProfileId) {
					if (prepareAgentRuntimeAuth({
						config: cfg,
						provider: selected.provider,
						modelId: selected.model,
						agentId,
						agentDir: selected.owner.agentDir,
						authProfileStore: store
					}).attempts.every(({ plan }) => plan.credentialSource?.kind === "direct" && plan.credentialSource.evidence === "synthetic") || hasSyntheticLocalProviderAuthConfig({
						cfg,
						provider: selected.provider,
						route: resolveMergedModelProviderConfig(cfg, selected.provider)
					})) continue;
				}
				const plannedProfileId = currentAuth.attempts[0]?.kind === "profile" ? currentAuth.attempts[0].profileId : void 0;
				const candidate = candidates.length === 1 ? candidates[0] : explicitProfileId ? void 0 : candidates.find((c) => c.profileId === plannedProfileId);
				if (!candidate) throw new Error(candidates.length > 1 ? `More than one inference account is eligible: ${candidates.map((c) => c.profileId).join(", ")}.` : "No available stored inference account can be retained.");
				const alternatives = candidates.filter((c) => c.profileId !== candidate.profileId).map((c) => c.profileId);
				if (isUserModelAuthProfileId(candidate.profileId)) throw new Error("A personal inference account requires explicit adoption by its authorized owner.");
				const description = `Automation ${label}: retain ${candidate.profileId} for ${modelRef}; model/default/fallback selections stay unchanged.${alternatives.length > 0 ? ` Also eligible: ${alternatives.join(", ")}; to change, run openclaw automations edit ${quoteCliArg(stored.id)} --model ${quoteCliArg(`${modelRef}@<profileId>`)}.` : ""}`;
				if (!params.shouldRepair) {
					warnings.push(`${description} Run openclaw doctor --fix to record its inference account.`);
					continue;
				}
				const authority = await captureAuthProfileAuthorization({
					profileId: candidate.profileId,
					agentDir: selected.owner.agentDir,
					cfg,
					assertCurrent() {}
				});
				retained.push(authority);
				authority.assertCurrent();
				changes.push({
					job: stored,
					binding: {
						version: 1,
						provider: selected.provider,
						profileId: candidate.profileId,
						authorizationId: authority.authorizationId,
						authRequirement: candidate.authRequirement,
						source: explicitUserSelection ? "user" : currentAuth.plan.forwardedAuthProfileSource ?? "auto"
					}
				});
				descriptions.push(description);
			} catch (error) {
				const recovery = isInvalidCronSessionTargetIdError(error) ? `Repair its session target with openclaw automations edit ${quoteCliArg(stored.id)} --session <target>, then retry Doctor.` : `Explicitly adopt the intended stored account with openclaw automations edit ${quoteCliArg(stored.id)} --model ${quoteCliArg(`${modelRef ?? "<provider/model>"}@<profileId>`)}.`;
				warnings.push(`Automation ${label}: inference account was not migrated: ${formatErrorMessage(error)} ${recovery}`);
			}
		}
		if (changes.length === 0) return {
			changes: [],
			warnings
		};
		if (!maintenance?.ownsSchemaMaintenance) throw new Error("Inference account migration requires offline Doctor maintenance.");
		const assertCurrent = () => {
			maintenance.assertDatabaseAccess(resolveOpenClawStateSqlitePath(env));
			for (const authority of retained) authority.assertCurrent();
		};
		const result = await repairCronInferenceBindingsForDoctor({ env }, {
			assertCurrent,
			assertOwnedInTransaction: assertCurrent
		}, inventory, changes);
		return {
			changes: [...descriptions, `Saved pre-repair cron backup: ${result.backupPath}`],
			warnings
		};
	} catch (error) {
		return {
			changes: [],
			warnings: [...warnings, `Cron inference account migration was not committed: ${formatErrorMessage(error)}`]
		};
	} finally {
		for (const authority of retained) authority.dispose();
	}
}
//#endregion
export { maybeRepairCronInferenceBindings };
