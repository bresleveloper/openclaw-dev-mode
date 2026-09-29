import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as mutateConfigFile } from "./mutate-CDIHLSip.mjs";
import { c as deriveDefaultBrowserCdpPortRange, i as resolveBrowserConfig, n as getOwnBrowserProfile } from "./config-fMVye_Fl.mjs";
import { a as BrowserConflictError, p as BrowserValidationError, u as BrowserResourceExhaustedError } from "./errors-CXz-2iKA.mjs";
import "./errors-DS4y5mrd.mjs";
import { n as assertCdpEndpointAllowed } from "./cdp.helpers-C-PCz6N7.mjs";
import "./config-Dk-reqA4.mjs";
import { n as getUsedPorts, t as allocateCdpPort } from "./profiles-CQrkMz7M.mjs";
import { isDeepStrictEqual } from "node:util";
//#region extensions/browser/src/browser/config-mutations.ts
/**
* Browser config mutation helpers.
*
* Persists browser-control credentials and profile config changes through the
* canonical config writer while preserving port allocation rules.
*/
const cdpPortRange = (resolved) => {
	const start = resolved.cdpPortRangeStart;
	const end = resolved.cdpPortRangeEnd;
	if (typeof start === "number" && Number.isFinite(start) && Number.isInteger(start) && typeof end === "number" && Number.isFinite(end) && Number.isInteger(end) && start > 0 && end >= start && end <= 65535) return {
		start,
		end
	};
	return deriveDefaultBrowserCdpPortRange(resolved.controlPort);
};
/** Persist the generated browser-control token or password in gateway auth config. */
async function persistBrowserControlCredential(credential) {
	await mutateConfigFile({
		afterWrite: { mode: "auto" },
		mutate: (draft) => {
			draft.gateway = {
				...draft.gateway,
				auth: {
					...draft.gateway?.auth,
					[credential.kind]: credential.value
				}
			};
		}
	});
}
/** Create and persist a browser profile config with allocated color and CDP port. */
async function createBrowserProfileConfig(params) {
	return (await mutateConfigFile({
		afterWrite: { mode: "auto" },
		mutate: async (draft) => {
			const rawDraftBrowser = draft.browser;
			const draftCdpPortRangeEnd = typeof rawDraftBrowser?.cdpPortRangeEnd === "number" ? rawDraftBrowser.cdpPortRangeEnd : void 0;
			const useRebasedPortRange = draft.gateway?.port !== void 0 || draftCdpPortRangeEnd !== void 0;
			const latestResolved = resolveBrowserConfig({
				...params.resolved,
				...draft.browser,
				profiles: draft.browser?.profiles ?? params.resolved.profiles
			}, draft);
			const latestRootResolved = resolveBrowserConfig(draft.browser, draft);
			const latestProfileSource = useRebasedPortRange ? latestRootResolved : latestResolved;
			const latestProfiles = draft.browser?.profiles ?? {};
			if (getOwnBrowserProfile(latestProfiles, params.name) || getOwnBrowserProfile(latestProfileSource.profiles, params.name)) throw new BrowserConflictError(`profile "${params.name}" already exists`);
			let nextProfileConfig;
			if (params.parsedCdpUrl) {
				try {
					await assertCdpEndpointAllowed(params.parsedCdpUrl, latestResolved.ssrfPolicy);
				} catch (err) {
					throw new BrowserValidationError(formatErrorMessage(err));
				}
				nextProfileConfig = {
					cdpUrl: params.parsedCdpUrl,
					...params.driver ? { driver: params.driver } : {},
					...params.driver === "existing-session" ? { attachOnly: true } : {}
				};
			} else if (params.driver === "existing-session") nextProfileConfig = {
				driver: params.driver,
				attachOnly: true,
				...params.userDataDir ? { userDataDir: params.userDataDir } : {}
			};
			else {
				const usedPorts = getUsedPorts(latestProfileSource.profiles);
				const rangeSource = useRebasedPortRange ? latestRootResolved : params.resolved;
				const range = cdpPortRange({
					controlPort: rangeSource.controlPort,
					cdpPortRangeStart: rangeSource.cdpPortRangeStart,
					cdpPortRangeEnd: draftCdpPortRangeEnd ?? rangeSource.cdpPortRangeEnd
				});
				const cdpPort = allocateCdpPort(usedPorts, range);
				if (cdpPort === null) throw new BrowserResourceExhaustedError("no available CDP ports in range");
				nextProfileConfig = {
					cdpPort,
					...params.driver ? { driver: params.driver } : {}
				};
			}
			draft.browser = {
				...draft.browser,
				profiles: {
					...draft.browser?.profiles,
					[params.name]: nextProfileConfig
				}
			};
			return nextProfileConfig;
		}
	})).result;
}
/** Delete the exact persisted browser profile definition captured by the caller. */
async function deleteBrowserProfileConfig(params) {
	await mutateConfigFile({
		afterWrite: { mode: "auto" },
		mutate: (draft) => {
			if (draft.browser?.defaultProfile === params.name) throw new BrowserValidationError(`cannot delete the default profile "${params.name}"; change browser.defaultProfile first`);
			const currentProfile = getOwnBrowserProfile(draft.browser?.profiles, params.name);
			if (!isDeepStrictEqual(currentProfile, params.expected)) throw new BrowserConflictError(`profile "${params.name}" changed while deletion was pending; retry the delete request`);
			const { [params.name]: _removed, ...remainingProfiles } = draft.browser?.profiles ?? {};
			draft.browser = {
				...draft.browser,
				profiles: remainingProfiles
			};
		}
	});
}
/** Make one persisted managed profile the default for future browser calls. */
async function setDefaultBrowserProfile(name) {
	await mutateConfigFile({
		afterWrite: { mode: "auto" },
		mutate: (draft) => {
			if (!getOwnBrowserProfile(draft.browser?.profiles, name)) throw new BrowserValidationError(`profile "${name}" does not exist`);
			draft.browser = {
				...draft.browser,
				defaultProfile: name
			};
		}
	});
}
//#endregion
export { setDefaultBrowserProfile as i, deleteBrowserProfileConfig as n, persistBrowserControlCredential as r, createBrowserProfileConfig as t };
