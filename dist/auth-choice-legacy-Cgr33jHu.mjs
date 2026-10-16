import { n as resolveManifestDeprecatedProviderAuthChoice } from "./provider-auth-choices-BWz3K_lG.mjs";
//#region src/commands/auth-choice-legacy.ts
/** Resolve a legacy choice and its diagnostics from one manifest generation. */
function resolveLegacyOnboardAuthChoice(authChoice, params) {
	if (authChoice === "oauth") return { authChoice: "setup-token" };
	if (authChoice !== "claude-cli") return { authChoice };
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
