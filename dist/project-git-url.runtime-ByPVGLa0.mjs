import { n as resolveGitHubHost } from "./github-host-runtime-D306-ub0.mjs";
import { t as parseProjectGitUrl } from "./project-git-url-BUjq6Sa-.mjs";
//#region src/projects/project-git-url.runtime.ts
/** Gateway admission binds repository URLs to the selected GitHub host. */
function parseConfiguredProjectGitUrl(raw) {
	return parseProjectGitUrl(raw, resolveGitHubHost());
}
//#endregion
export { parseConfiguredProjectGitUrl as t };
