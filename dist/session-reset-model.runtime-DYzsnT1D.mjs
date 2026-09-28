import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as resolveAgentDir, m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import { v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { i as ModelSelectionLockedError } from "./model-overrides-FXSJttoI.mjs";
import { i as SessionWorkStartInvalidatedError } from "./lifecycle-CQXOIBZ7.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-Doz1rFpm.mjs";
import { t as applyModelOverrideWithAuthProfileCompatibility } from "./auth-profile-preservation-jhjED_s9.mjs";
import { a as sessionModelOverrideChangesApplied, n as adoptPersistedSessionSnapshot, t as SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS } from "./session-snapshot-merge-Br9OMCio.mjs";
import { n as isKnownModelSelectionProvider } from "./model-runtime-normalization-BT-27PHw.mjs";
import { t as resolveModelDirectiveSelection } from "./model-selection-directive-a95HzxiM.mjs";
//#region src/auto-reply/reply/session-reset-model.ts
/** Applies model override tokens embedded in reset/new command text. */
async function loadResetModelCatalog(params) {
	const { readPreparedModelCatalog } = await import("./prepared-model-catalog-CHKgcpJj.mjs");
	return readPreparedModelCatalog({
		config: params.cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.agentDir ? { agentDir: params.agentDir } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		readOnly: true
	});
}
async function applySelectionToSession(params) {
	const { selection, sessionEntryHandle, sessionStore, sessionKey, storePath } = params;
	const sessionEntry = sessionEntryHandle?.getCurrent() ?? params.sessionEntry;
	if (!sessionEntry || !sessionKey) return true;
	const initialSessionEntry = { ...sessionEntry };
	const nextSessionEntry = { ...sessionEntry };
	applyModelOverrideWithAuthProfileCompatibility({
		cfg: params.cfg,
		agentDir: params.agentDir,
		entry: nextSessionEntry,
		currentProvider: sessionEntry.providerOverride?.trim() || sessionEntry.modelProvider?.trim() || params.defaultProvider,
		selection,
		explicitDefaultSelection: selection.isDefault
	});
	let appliedEntry = nextSessionEntry;
	let selectionApplied = true;
	if (storePath) {
		const { persistReplySessionEntry } = await import("./session-entry-persistence-B5u2eS7v.mjs");
		const persistence = await persistReplySessionEntry({
			storePath,
			sessionKey,
			initialEntry: initialSessionEntry,
			entry: nextSessionEntry,
			touchedFields: SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS,
			requireModelSelectionUnlocked: true
		});
		if (persistence.status === "lifecycle-invalidated") throw new SessionWorkStartInvalidatedError(persistence.error);
		if (persistence.status === "model-selection-locked") throw new ModelSelectionLockedError();
		const persistedEntry = persistence.entry;
		appliedEntry = persistedEntry;
		selectionApplied = sessionModelOverrideChangesApplied({
			initial: initialSessionEntry,
			next: nextSessionEntry,
			current: persistedEntry
		});
	}
	adoptPersistedSessionSnapshot(sessionEntry, appliedEntry);
	if (sessionEntryHandle) sessionEntryHandle.replaceCurrent(sessionEntry);
	else if (sessionStore) sessionStore[sessionKey] = sessionEntry;
	return selectionApplied;
}
/** Applies a valid reset model override to session state and returns the cleaned body. */
async function applyResetModelOverride(params) {
	if (!params.resetTriggered) return {};
	const rawBody = normalizeOptionalString(params.bodyStripped);
	if (!rawBody) return {};
	const tokens = rawBody.split(/\s+/).filter(Boolean);
	const [first, second] = tokens;
	if (!first) return {};
	const catalog = params.modelCatalog ?? await loadResetModelCatalog({
		cfg: params.cfg,
		agentId: params.agentId,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	});
	const modelPolicy = createModelVisibilityPolicy({
		cfg: params.cfg,
		catalog,
		defaultProvider: params.defaultProvider,
		defaultModel: {
			provider: params.defaultProvider,
			model: params.defaultModel
		},
		agentId: params.agentId
	});
	const allowedModelKeys = modelPolicy.allowedKeys;
	const providers = new Set([...allowedModelKeys].map((key) => key.split("/", 1)[0]));
	const resolveSelection = (raw, explicitRef = false) => {
		const parsed = resolveModelRefFromString({
			cfg: params.cfg,
			agentId: params.agentId,
			raw,
			defaultProvider: params.defaultProvider,
			aliasIndex: params.aliasIndex
		});
		if (!parsed) return;
		const exact = explicitRef || parsed.alias || allowedModelKeys.has(modelKey(parsed.ref.provider, parsed.ref.model));
		if (exact && !modelPolicy.allows(parsed.ref) || !exact && !providers.has(normalizeProviderId(raw)) && raw.length < 6) return;
		const resolved = resolveModelDirectiveSelection({
			raw,
			defaultProvider: params.defaultProvider,
			defaultModel: params.defaultModel,
			aliasIndex: params.aliasIndex,
			allowedModelKeys,
			modelPolicy,
			cfg: params.cfg,
			agentId: params.agentId
		}).selection;
		return resolved && (exact || allowedModelKeys.has(modelKey(resolved.provider, resolved.model))) && isKnownModelSelectionProvider({
			cfg: params.cfg,
			catalog,
			provider: resolved.provider
		}) ? resolved : void 0;
	};
	let selection;
	let consumed = 0;
	if (providers.has(normalizeProviderId(first)) && second) {
		selection = resolveSelection(`${normalizeProviderId(first)}/${second}`);
		if (selection) consumed = 2;
	}
	if (!selection) {
		selection = resolveSelection(first, first.includes("/"));
		if (selection) consumed = 1;
	}
	if (!selection) return {};
	const cleanedBody = tokens.slice(consumed).join(" ").trim();
	params.sessionCtx.commandText = cleanedBody;
	params.sessionCtx.agentText = cleanedBody;
	params.sessionCtx.BodyStripped = cleanedBody;
	params.sessionCtx.BodyForCommands = cleanedBody;
	return {
		selection: await applySelectionToSession({
			cfg: params.cfg,
			agentDir: params.agentDir ?? resolveAgentDir(params.cfg, params.agentId ?? resolveDefaultAgentId(params.cfg)),
			defaultProvider: params.defaultProvider,
			selection,
			sessionEntry: params.sessionEntry,
			sessionEntryHandle: params.sessionEntryHandle,
			sessionStore: params.sessionStore,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}) ? selection : void 0,
		cleanedBody
	};
}
//#endregion
export { applyResetModelOverride };
