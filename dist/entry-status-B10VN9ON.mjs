import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as evaluateRequirementsFromMetadataWithRemote } from "./requirements-CAm97yK-.mjs";
//#region src/shared/entry-status.ts
/** Evaluates skill and hook presentation metadata and requirements on the current platform. */
function evaluateEntryRequirementsForCurrentPlatform(params) {
	const { metadata, frontmatter } = params.entry;
	const emoji = metadata?.emoji ?? frontmatter?.emoji;
	const homepage = normalizeOptionalString(metadata?.homepage ?? frontmatter?.homepage ?? frontmatter?.website ?? frontmatter?.url);
	const { required, missing, eligible, configChecks } = evaluateRequirementsFromMetadataWithRemote({
		...params,
		metadata: metadata ?? void 0,
		localPlatform: params.platform ?? process.platform
	});
	return {
		...emoji ? { emoji } : {},
		...homepage ? { homepage } : {},
		required,
		missing,
		requirementsSatisfied: eligible,
		configChecks
	};
}
//#endregion
export { evaluateEntryRequirementsForCurrentPlatform as t };
