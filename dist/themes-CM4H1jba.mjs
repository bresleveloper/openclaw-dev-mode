import { C as isThemeId, _ as parseThemeDefinition, g as normalizeThemeDefinition, t as BUILTIN_THEMES, w as normalizeThemeMode, x as THEME_LOCAL_ID_PATTERN } from "./theme-_hQKgfH-.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Co as validateThemesImportParams, So as validateThemesGetParams, To as validateThemesSetParams, _g as normalizeUiAppearancePreference, gg as UI_APPEARANCE_PREFERENCE_KEYS, wo as validateThemesListParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { s as resolveUserProfileId } from "./user-profiles-CRttx6hj.mjs";
import { i as getGatewayToolCallerIdentity, t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-DvDb9xl2.mjs";
import { n as defineValidatedGatewayMethod } from "./validation-CFv_zneu.mjs";
import { t as listPluginThemes } from "./theme-catalog-DkVw-Sya.mjs";
import { r as setCanonicalUserPreferences, t as getCanonicalUserPreferences } from "./user-preferences-DdrP3G5o.mjs";
import { t as assertActiveAgentRuntimeAuthority } from "./agent-runtime-authority--ezHAh8Z.mjs";
import { t as publishUserPreferencesChanged } from "./user-preference-events-BPHGV40G.mjs";
//#region src/gateway/server-methods/themes.ts
const DEFINITION_PREFIX = "ui.themeDefinition.";
function requestOwner(options) {
	const { client, context } = options;
	const runtimeIdentity = client?.internal?.agentRuntimeIdentity;
	const caller = getGatewayToolCallerIdentity();
	const capturedProfile = runtimeIdentity ? runtimeIdentity.gatewayUiCommandTarget?.profileId : client?.internal?.syntheticClient ? caller?.gatewayUiCommandTarget?.profileId : client?.authenticatedUserProfile?.profileId;
	const assertCaller = captureGatewayToolCallerAssertion();
	const profileId = capturedProfile ? resolveUserProfileId(capturedProfile) : void 0;
	const assertCurrent = () => {
		options.signal?.throwIfAborted();
		options.sessionMutationCommitGuard?.();
		options.sessionMutationAuthorization?.assertCurrent();
		assertActiveAgentRuntimeAuthority(client, context, assertCaller);
		if (options.hasCurrentClientAuthority?.() === false || client?.invalidated) throw new Error("Theme request authority is no longer active.");
		if (capturedProfile && resolveUserProfileId(capturedProfile) !== profileId) throw new Error("The requesting profile changed. Ask again from your current profile.");
		if (!runtimeIdentity && !client?.internal?.syntheticClient && client?.authenticatedUserProfile?.profileId !== capturedProfile) throw new Error("The requesting profile changed. Ask again from your current profile.");
	};
	assertCurrent();
	return {
		profileId,
		assertCurrent
	};
}
function catalogForPreferences(entries) {
	const imported = [];
	for (const [key, value] of Object.entries(entries)) {
		if (!key.startsWith(DEFINITION_PREFIX)) continue;
		const localId = key.slice(19);
		const definition = parseThemeDefinition(value);
		if (!THEME_LOCAL_ID_PATTERN.test(localId) || !definition) continue;
		imported.push({
			id: `user/${localId}`,
			name: definition.name,
			description: definition.description,
			...definition.mascot !== void 0 ? { mascot: definition.mascot } : {},
			...definition.workingPhrases !== void 0 ? { workingPhrases: definition.workingPhrases } : {},
			...definition.critters !== void 0 ? { critters: definition.critters } : {},
			...definition.avatarHat !== void 0 ? { avatarHat: definition.avatarHat } : {},
			source: "user",
			modes: ["light", "dark"].filter((mode) => Boolean(definition[mode])),
			definition
		});
	}
	return [
		...BUILTIN_THEMES,
		...listPluginThemes(),
		...imported.toSorted((a, b) => a.id.localeCompare(b.id))
	];
}
function descriptor(entry) {
	const { definition: _definition, ...metadata } = entry;
	return metadata;
}
function selectionMode(modes, requested, retained, inherited) {
	const effective = requested === null ? inherited : requested ?? retained;
	if (effective === "system" || modes.includes(effective)) return requested;
	if (requested !== void 0) throw new Error(`This theme does not provide ${effective} mode. Choose system or ${modes.join(" or ")}.`);
	return modes.includes("dark") ? "dark" : "light";
}
function selection(entries, config, catalog, profileId) {
	const id = isThemeId(entries["ui.theme"]) ? entries["ui.theme"] : void 0;
	const mode = normalizeThemeMode(entries["ui.themeMode"]);
	const requestedId = id ?? config.ui?.prefs?.theme ?? "claw";
	const selected = catalog.find((theme) => theme.id === requestedId);
	const effectiveTheme = selected ?? BUILTIN_THEMES[0];
	const selectedMode = mode ?? normalizeThemeMode(config.ui?.prefs?.themeMode) ?? "system";
	const effectiveMode = effectiveTheme?.modes.length === 1 ? effectiveTheme.modes[0] : selectedMode === "system" ? void 0 : selectedMode;
	return {
		id: selected ? requestedId : "claw",
		mode: selectedMode,
		...effectiveMode ? { effectiveMode } : {},
		scope: profileId ? "profile" : "gateway",
		overrides: {
			...id ? { id } : {},
			...mode ? { mode } : {}
		},
		...!selected ? { requestedId } : {}
	};
}
async function readThemes(options, owner, inspectId) {
	const stored = owner.profileId ? await getCanonicalUserPreferences(owner.profileId) : void 0;
	owner.assertCurrent();
	if (owner.profileId && !stored) throw new Error("The requesting profile is unavailable.");
	const entries = stored?.entries ?? {};
	const catalog = catalogForPreferences(entries);
	const current = selection(entries, options.context.getRuntimeConfig(), catalog, owner.profileId);
	const theme = catalog.find((entry) => entry.id === (inspectId ?? current.id));
	if (!theme) throw new Error(`Theme ${inspectId} is unavailable. List themes to choose an installed theme.`);
	return {
		owner,
		entries,
		catalog,
		result: {
			current,
			theme: descriptor(theme),
			...theme.definition ? { definition: theme.definition } : {},
			...theme.artwork ? { artwork: theme.artwork } : {}
		}
	};
}
async function writeThemes(options, owner, entries, conditions) {
	if (!owner.profileId) throw new Error("Changing themes requires the requesting person's authenticated profile. Ask from your signed-in Control UI.");
	const written = await setCanonicalUserPreferences(owner.profileId, entries, {
		expectedEntries: conditions.expectedEntries,
		assertCurrent: () => {
			owner.assertCurrent();
			conditions.assertCatalog?.();
		}
	});
	if (!written) throw new Error("The requesting profile is unavailable.");
	if (!written.ok) {
		if (written.error.code === "conflict") throw new Error("Appearance changed while this request was being prepared. Read the current theme and try again.");
		throw new Error(`Theme could not be saved: ${written.error.code}.`);
	}
	publishUserPreferencesChanged(options.context, written.value.profileId, Object.keys(entries));
	return owner;
}
function failed(options, error) {
	options.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : String(error)));
}
const themeHandlers = {
	"themes.list": defineValidatedGatewayMethod("themes.list", validateThemesListParams, async (options) => {
		try {
			const { catalog, result } = await readThemes(options, requestOwner(options));
			options.respond(true, {
				...result,
				themes: catalog.map(descriptor)
			});
		} catch (error) {
			failed(options, error);
		}
	}),
	"themes.get": defineValidatedGatewayMethod("themes.get", validateThemesGetParams, async (options) => {
		try {
			options.respond(true, (await readThemes(options, requestOwner(options), options.params.id)).result);
		} catch (error) {
			failed(options, error);
		}
	}),
	"themes.set": defineValidatedGatewayMethod("themes.set", validateThemesSetParams, async (options) => {
		try {
			const { id, mode, appearance } = options.params;
			const appearanceEntries = {};
			for (const key of [
				"accent",
				"fontUi",
				"fontChat"
			]) {
				const value = appearance?.[key];
				if (value === void 0) continue;
				const prefKey = UI_APPEARANCE_PREFERENCE_KEYS[key];
				const normalized = value === null ? null : normalizeUiAppearancePreference(prefKey, value);
				if (normalized === void 0) throw new Error(`Unsupported appearance preference: ${key}.`);
				appearanceEntries[prefKey] = normalized;
			}
			if (id === void 0 && mode === void 0) throw new Error("Set a theme id or mode; use null to restore its default.");
			const owner = requestOwner(options);
			const { catalog, result, entries } = await readThemes(options, owner);
			const target = id == null ? void 0 : catalog.find((theme) => theme.id === id);
			if (id != null && !target) throw new Error(`Theme ${id} is unavailable. List themes to choose an installed theme.`);
			const resetId = options.context.getRuntimeConfig().ui?.prefs?.theme ?? "claw";
			const selected = target ?? catalog.find((theme) => theme.id === (id === null ? resetId : result.current.id));
			const nextMode = selected ? selectionMode(selected.modes, mode, result.current.mode, normalizeThemeMode(options.context.getRuntimeConfig().ui?.prefs?.themeMode) ?? "system") : mode;
			await writeThemes(options, owner, {
				...appearanceEntries,
				...id !== void 0 ? { "ui.theme": id } : {},
				...nextMode !== void 0 ? { "ui.themeMode": nextMode } : {}
			}, {
				expectedEntries: {
					"ui.theme": entries["ui.theme"] ?? null,
					"ui.themeMode": entries["ui.themeMode"] ?? null,
					...selected?.source === "user" ? { [`${DEFINITION_PREFIX}${selected.id.slice(5)}`]: entries[`${DEFINITION_PREFIX}${selected.id.slice(5)}`] ?? null } : {}
				},
				assertCatalog: selected?.source === "plugin" ? () => {
					const current = listPluginThemes().find((theme) => theme.id === selected.id);
					if (!current || current.definition !== selected.definition) throw new Error("The theme plugin changed before selection was saved. List themes and try again.");
				} : void 0
			});
			options.respond(true, {
				...(await readThemes(options, owner)).result,
				application: "saved"
			});
		} catch (error) {
			failed(options, error);
		}
	}),
	"themes.import": defineValidatedGatewayMethod("themes.import", validateThemesImportParams, async (options) => {
		try {
			const { id, apply, mode } = options.params;
			const owner = requestOwner(options);
			const definition = normalizeThemeDefinition(options.params.definition);
			if (mode && mode !== "system" && !definition[mode]) throw new Error(`The imported theme does not provide ${mode} mode.`);
			if (mode && !apply) throw new Error("Use apply: true when importing with a mode.");
			const snapshot = await readThemes(options, owner);
			const current = snapshot.result.current;
			const nextMode = apply || (current.requestedId ?? current.id) === `user/${id}` ? selectionMode(["light", "dark"].filter((palette) => Boolean(definition[palette])), mode, current.mode, normalizeThemeMode(options.context.getRuntimeConfig().ui?.prefs?.themeMode) ?? "system") : void 0;
			await writeThemes(options, owner, {
				[`${DEFINITION_PREFIX}${id}`]: definition,
				...apply ? { "ui.theme": `user/${id}` } : {},
				...nextMode !== void 0 ? { "ui.themeMode": nextMode } : {}
			}, { expectedEntries: {
				"ui.theme": snapshot.entries["ui.theme"] ?? null,
				"ui.themeMode": snapshot.entries["ui.themeMode"] ?? null
			} });
			options.respond(true, {
				...(await readThemes(options, owner, `user/${id}`)).result,
				application: "saved"
			});
		} catch (error) {
			failed(options, error);
		}
	})
};
//#endregion
export { themeHandlers };
