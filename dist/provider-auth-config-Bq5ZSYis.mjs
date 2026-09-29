import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as formatInvalidConfigDetails, t as createInvalidConfigError } from "./io.invalid-config-Deld-wtR.mjs";
import { n as createMergePatch, r as mergePatchConflicts, t as applyMergePatch } from "./merge-patch-C1--BlNd.mjs";
import { s as transformConfigWithPendingPluginInstalls } from "./install-record-commit-DDMKSyro.mjs";
import { t as ProviderAuthConfigApplyError } from "./provider-auth-result-B4UlBTW7.mjs";
import { n as applyProviderAuthConfigPatch } from "./provider-auth-choice-helpers-BggS0fwD.mjs";
//#region src/plugins/provider-auth-config.ts
const patchOptions = { mergeObjectArraysById: true };
function createProviderAuthConfigPatch(base, next) {
	return createMergePatch(applyProviderAuthConfigPatch(base, {}), applyProviderAuthConfigPatch(next, {}), patchOptions);
}
/** Replay completed provider setup against current authored settings, without replaying login. */
async function writeProviderAuthConfig(params) {
	const loginConfig = applyProviderAuthConfigPatch(params.config, {});
	const sourceConfig = applyProviderAuthConfigPatch(params.configSnapshot.sourceConfig, {});
	const runtimeConfig = applyProviderAuthConfigPatch(params.configSnapshot.runtimeConfig, {});
	try {
		const written = await transformConfigWithPendingPluginInstalls({
			base: "source",
			writeOptions: {
				...params.writeOptions,
				beforeCommit: params.beforeCommit
			},
			transform: (current, { snapshot }) => {
				if (!snapshot.valid) throw createInvalidConfigError(snapshot.path, formatInvalidConfigDetails(snapshot.issues));
				params.beforeCommit?.();
				let next = applyProviderAuthConfigPatch(current, {});
				if (params.configPatch) {
					if (mergePatchConflicts(loginConfig, runtimeConfig, params.configPatch, patchOptions) && mergePatchConflicts(loginConfig, sourceConfig, params.configPatch, patchOptions) || mergePatchConflicts(sourceConfig, next, params.configPatch, patchOptions)) throw new Error("Provider settings changed during sign-in. Review the current settings and retry.");
					next = applyMergePatch(next, params.configPatch, patchOptions);
				}
				next = params.finalizeConfig ? params.finalizeConfig(next, current) : next;
				return {
					nextConfig: next,
					result: next
				};
			}
		});
		return expectDefined(written.result, "provider config mutation result");
	} catch (error) {
		if (!params.credentialsSaved) throw error;
		throw new ProviderAuthConfigApplyError(error);
	}
}
//#endregion
export { writeProviderAuthConfig as n, createProviderAuthConfigPatch as t };
