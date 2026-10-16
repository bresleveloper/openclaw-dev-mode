import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import { t as normalizeCloudRepo } from "./cloud-worker-project-profiles-DJ5jtY5M.mjs";
import { i as resolveConfiguredGitHubHost } from "./github-host-CaivEi-a.mjs";
import { t as parseProjectGitUrl } from "./project-git-url-D7qGDgRK.mjs";
//#region src/gateway/configured-default-repository.ts
/** Operator repository selection shared by the picker and prepared pool. */
function configuredDefaultRepository(config = getRuntimeConfigSnapshot()) {
	const selected = config?.gateway?.projects?.defaultRepository;
	if (!selected) return;
	const parsed = parseProjectGitUrl(selected.url, resolveConfiguredGitHubHost(config));
	if (!parsed) return;
	const identity = new URL(parsed.url).pathname.slice(1, -4);
	const key = normalizeCloudRepo(parsed.url);
	const profileId = key ? config?.cloudWorkers?.projectProfiles?.[key] : void 0;
	return {
		identity,
		url: parsed.url,
		...selected.ref ? { ref: selected.ref } : {},
		...profileId ? { profileId } : {}
	};
}
//#endregion
export { configuredDefaultRepository as t };
