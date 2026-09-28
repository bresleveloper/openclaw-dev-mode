import { t as resolveManifestDeclaredProviderAuthChoices } from "./provider-auth-choices-CBoGKnJX.mjs";
import { t as compareProviderAuthChoiceGroups } from "./provider-auth-choice-order-BXPE9pfe.mjs";
//#region src/plugins/provider-login-options.ts
function supportsProviderAuthChoiceTextInference(scopes) {
	return !scopes || scopes.includes("text-inference");
}
function isEligible(choice) {
	return Boolean(choice.choiceId.trim()) && choice.assistantVisibility !== "manual-only" && choice.assistantVisibility !== "detected-only" && supportsProviderAuthChoiceTextInference(choice.onboardingScopes);
}
function loginKind(choice) {
	if (!isEligible(choice) || choice.credentialOnly !== true || choice.appGuidedDiscovery) return;
	return choice.appGuidedAuth ?? (choice.appGuidedSecret ? "secret" : void 0);
}
function isProviderLoginChoiceStartable(choice) {
	return loginKind(choice) !== void 0;
}
function listProviderLoginOptions(choices) {
	return choices.filter(isEligible).toSorted((a, b) => Number(b.onboardingFeatured === true) - Number(a.onboardingFeatured === true) || compareProviderAuthChoiceGroups({
		id: a.groupId ?? a.providerId,
		label: a.groupLabel ?? a.choiceLabel
	}, {
		id: b.groupId ?? b.providerId,
		label: b.groupLabel ?? b.choiceLabel
	}) || (a.assistantPriority ?? 0) - (b.assistantPriority ?? 0) || a.choiceLabel.localeCompare(b.choiceLabel, "en") || a.choiceId.localeCompare(b.choiceId)).flatMap((choice) => {
		const kind = loginKind(choice);
		if (!kind) return [];
		return [{
			id: formatProviderLoginChoiceRef(choice),
			brandId: choice.providerId,
			label: choice.choiceLabel,
			hint: choice.choiceHint,
			groupLabel: choice.groupLabel,
			icon: choice.icon,
			website: choice.website,
			kind,
			featured: choice.onboardingFeatured === true
		}];
	});
}
function formatProviderLoginChoiceRef(choice) {
	return `${encodeURIComponent(choice.pluginId)}/${encodeURIComponent(choice.choiceId)}`;
}
function formatProviderOAuthLoginRef(provider) {
	return `oauth/${encodeURIComponent(provider.pluginId)}/${encodeURIComponent(provider.providerId)}`;
}
function normalizeInput(value) {
	return (value ?? "").trim().toLowerCase().replace(/_/gu, "-");
}
function projectChannelChoice(choice) {
	const kind = loginKind(choice);
	return {
		choiceId: choice.choiceId,
		pluginId: choice.pluginId,
		providerId: choice.providerId,
		methodId: choice.methodId,
		label: choice.choiceLabel,
		providerLabel: choice.groupLabel ?? choice.choiceLabel,
		command: formatProviderLoginChoiceRef(choice),
		mode: choice.channelLogin && kind && choice.appGuidedAuth ? "chat" : kind === "secret" ? "secret" : kind ? "sign-in" : "setup"
	};
}
function readChoices(params) {
	return resolveManifestDeclaredProviderAuthChoices(params).filter(isEligible);
}
function resolveProviderChannelLoginChoice(input, params) {
	const metadata = readChoices(params);
	const choices = metadata.map(projectChannelChoice);
	const raw = input?.trim() ?? "";
	const normalized = normalizeInput(input);
	const select = (matches) => {
		const projected = matches.map(projectChannelChoice);
		return projected.length === 1 ? {
			status: "resolved",
			choice: projected[0]
		} : {
			status: "ambiguous",
			choices: projected
		};
	};
	const family = (choice) => ({
		pluginId: choice.pluginId,
		providerId: choice.groupId ?? choice.providerId,
		label: choice.groupLabel ?? choice.choiceLabel
	});
	if (!normalized) {
		const providers = /* @__PURE__ */ new Map();
		for (const choice of metadata) if (choice.appGuidedAuth) {
			const group = family(choice);
			providers.set(formatProviderOAuthLoginRef(group), group);
		}
		return {
			status: "providers",
			providers: [...providers.values()].toSorted((a, b) => a.label.localeCompare(b.label, "en") || formatProviderOAuthLoginRef(a).localeCompare(formatProviderOAuthLoginRef(b)))
		};
	}
	if (raw.includes("/")) {
		const matches = metadata.filter((choice) => formatProviderLoginChoiceRef(choice) === raw || choice.appGuidedAuth !== void 0 && formatProviderOAuthLoginRef(family(choice)) === raw);
		return matches.length ? select(matches) : {
			status: "unsupported",
			choices
		};
	}
	const groups = metadata.filter((choice) => normalizeInput(choice.groupId) === normalized || normalizeInput(choice.providerId) === normalized);
	if (groups.length > 1) {
		const chat = groups.filter((choice) => projectChannelChoice(choice).mode === "chat");
		if (chat.length === 1 && groups.every((choice) => choice.pluginId === chat[0].pluginId)) return select(chat);
		return select(groups);
	}
	const exact = metadata.filter((choice) => normalizeInput(choice.choiceId) === normalized);
	if (exact.length) return select(exact);
	if (groups.length) return select(groups);
	const aliases = metadata.filter((choice) => choice.channelLogin?.aliases?.some((alias) => normalizeInput(alias) === normalized));
	return aliases.length ? select(aliases) : {
		status: "unsupported",
		choices
	};
}
//#endregion
export { resolveProviderChannelLoginChoice as a, listProviderLoginOptions as i, formatProviderOAuthLoginRef as n, isProviderLoginChoiceStartable as r, formatProviderLoginChoiceRef as t };
