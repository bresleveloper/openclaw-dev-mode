import { n as resolveManifestDeprecatedProviderAuthChoice } from "./provider-auth-choices-CBoGKnJX.mjs";
//#region src/commands/auth-choice-legacy.ts
const LEGACY_REPLACEMENT_AUTH_CHOICES = /* @__PURE__ */ new Set(["claude-cli"]);
/** Resolve a legacy choice and its diagnostics from one manifest generation. */
function resolveLegacyOnboardAuthChoice(authChoice, params) {
	if (authChoice === "oauth") return { authChoice: "setup-token" };
	if (typeof authChoice !== "string" || !LEGACY_REPLACEMENT_AUTH_CHOICES.has(authChoice)) return { authChoice };
	const deprecatedChoice = resolveManifestDeprecatedProviderAuthChoice(authChoice, params);
	if (!deprecatedChoice) return { authChoice };
	const replacementLabel = deprecatedChoice.choiceLabel.trim() || "the replacement auth choice";
	return {
		authChoice: deprecatedChoice.choiceId,
		deprecated: {
			message: `Auth choice "${authChoice}" is deprecated; using ${replacementLabel} setup instead.`,
			nonInteractiveError: [`Auth choice "${authChoice}" is deprecated.`, `Use "--auth-choice ${deprecatedChoice.choiceId}".`].join("\n")
		}
	};
}
//#endregion
export { resolveLegacyOnboardAuthChoice as t };
