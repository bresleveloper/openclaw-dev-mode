import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as mutateConfigFile } from "./mutate-BkuP-9_H.mjs";
import "./security-runtime-CpTHQYW2.mjs";
import "./config-mutation-DuvfZ3Hg.mjs";
import { i as resolveBrowserConfig, n as getOwnBrowserProfile } from "./config-DQZ6ubGi.mjs";
import { a as BrowserConflictError, p as BrowserValidationError, u as BrowserResourceExhaustedError } from "./errors-BqlAThZX.mjs";
import { n as assertCdpEndpointAllowed } from "./cdp.helpers-r6708sL2.mjs";
import { n as getUsedPorts, t as allocateCdpPort } from "./profiles-BP9ujR-L.mjs";
import { isDeepStrictEqual } from "node:util";
//#region extensions/browser/src/browser/config-mutations.ts
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
async function createBrowserProfileConfig(params) {
	return (await mutateConfigFile({
		afterWrite: { mode: "auto" },
		mutate: async (draft) => {
			const useRebasedPortRange = draft.gateway?.port !== void 0;
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
				const cdpPort = allocateCdpPort(usedPorts, {
					start: rangeSource.cdpPortRangeStart,
					end: rangeSource.cdpPortRangeEnd
				});
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
