import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { s as ModelSelectionLockedError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { _ as resolveDefaultAgentId, a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { y as resolveModelRefFromString } from "./model-selection-shared-CVU_V2PQ.mjs";
import { a as SessionWorkStartInvalidatedError } from "./work-start-error-BI-UhSB2.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-pIK04Peo.mjs";
import { v as prepareAuthProfileProvider } from "./store-runtime-CwqGD12G.mjs";
import { r as publishReplySessionEntry } from "./session-entry-handle-CIZ4BgVt.mjs";
import { t as applyModelOverrideWithAuthProfileCompatibility } from "./auth-profile-preservation-UYIf2L8-.mjs";
import { a as sessionModelOverrideChangesApplied, n as adoptPersistedSessionSnapshot, t as SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS } from "./session-snapshot-merge-Dh-eJoIb.mjs";
import { n as isKnownModelSelectionProvider } from "./model-runtime-normalization-B2xB-s-G.mjs";
import { t as resolveModelDirectiveSelection } from "./model-selection-directive-By2HuKqh.mjs";
//#region src/auto-reply/reply/session-reset-model.ts
async function applyResetModelOverride(params) {
	if (!params.resetTriggered) return {};
	const rawBody = normalizeOptionalString(params.bodyStripped);
	if (!rawBody) return {};
	const tokens = rawBody.split(/\s+/);
	const [first, second] = tokens;
	if (!first) return {};
	let catalog = params.modelCatalog;
	if (!catalog) {
		const { readPreparedModelCatalog } = await import("./prepared-model-catalog-CCWmZ0HZ.mjs");
		catalog = await readPreparedModelCatalog({
			config: params.cfg,
			...params.agentId ? { agentId: params.agentId } : {},
			...params.agentDir ? { agentDir: params.agentDir } : {},
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
			readOnly: true
		});
	}
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
	let consumed = 1;
	if (providers.has(normalizeProviderId(first)) && second) {
		selection = resolveSelection(`${normalizeProviderId(first)}/${second}`);
		if (selection) consumed = 2;
	}
	if (!selection) selection = resolveSelection(first, first.includes("/"));
	if (!selection) return {};
	const cleanedBody = tokens.slice(consumed).join(" ");
	params.sessionCtx.commandText = cleanedBody;
	params.sessionCtx.agentText = cleanedBody;
	params.sessionCtx.BodyStripped = cleanedBody;
	params.sessionCtx.BodyForCommands = cleanedBody;
	const agentDir = params.agentDir ?? resolveAgentDir(params.cfg, params.agentId ?? resolveDefaultAgentId(params.cfg));
	const { sessionEntryHandle, sessionStore, sessionKey, storePath } = params;
	const sessionEntry = sessionEntryHandle?.getCurrent() ?? params.sessionEntry;
	if (!sessionEntry || !sessionKey) return {
		selection,
		cleanedBody
	};
	const pinnedProfile = sessionEntry.authProfileOverride?.trim();
	const recordedProvider = pinnedProfile ? await prepareAuthProfileProvider({
		agentDir,
		profileId: pinnedProfile
	}) : void 0;
	const initialSessionEntry = { ...sessionEntry };
	const nextSessionEntry = { ...sessionEntry };
	applyModelOverrideWithAuthProfileCompatibility({
		cfg: params.cfg,
		agentDir,
		entry: nextSessionEntry,
		currentProvider: sessionEntry.providerOverride?.trim() || sessionEntry.modelProvider?.trim() || params.defaultProvider,
		selection,
		explicitDefaultSelection: selection.isDefault,
		recordedProvider
	});
	let appliedEntry = nextSessionEntry;
	let selectionApplied = true;
	if (storePath) {
		const { persistReplySessionEntry } = await import("./session-entry-persistence-CIwqLyTR.mjs");
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
		appliedEntry = persistence.entry;
		selectionApplied = sessionModelOverrideChangesApplied({
			initial: initialSessionEntry,
			next: nextSessionEntry,
			current: appliedEntry
		});
	}
	adoptPersistedSessionSnapshot(sessionEntry, appliedEntry);
	publishReplySessionEntry({
		sessionEntryHandle,
		sessionStore,
		sessionKey
	}, sessionEntry);
	return {
		selection: selectionApplied ? selection : void 0,
		cleanedBody
	};
}
//#endregion
export { applyResetModelOverride };
