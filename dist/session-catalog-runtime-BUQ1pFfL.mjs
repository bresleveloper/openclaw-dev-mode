import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { i as allowsProcessHomeSessionScan } from "./paths-orClZ-2Z.mjs";
import { i as getPluginRegistryForContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { B as normalizeControlUiBasePath, L as isControlUiReservedRouteSegment, R as controlUiSessionSlug } from "./session-key-CSDERtm3.mjs";
import { t as readFileRangeAsync } from "./file-range-jGKnMXJ2.mjs";
import { n as isExternalUserText, o as sessionCatalogAdoptedSessionKey, r as listAdoptedSessionCatalogSessions } from "./session-catalog-DwvpROmn.mjs";
import { n as importSessionCatalogHistory } from "./session-catalog-history-import-CEHddTXF.mjs";
import fs from "node:fs/promises";
//#region src/plugins/session-catalog-acp-adoption.ts
/** Adopt a native ACP catalog session while keeping its plugin-owned marker shape. */
function createAcpSessionCatalogAdoption(options) {
	const config = options.config;
	return {
		listAdopted: (agentId, sessionEntries) => {
			return listAdoptedSessionCatalogSessions({
				...agentId ? { agentId } : {},
				config: config(),
				pluginId: options.api.id,
				runtime: options.api.runtime,
				sessionEntries,
				sourceFromEntry: (entry) => {
					const extension = entry.pluginExtensions?.[options.markerPluginId];
					const marker = isRecord(extension) ? extension[options.markerKey] : void 0;
					return isRecord(marker) && typeof marker.sourceThreadId === "string" ? {
						hostId: options.hostId,
						threadId: marker.sourceThreadId
					} : void 0;
				}
			});
		},
		create: async (params) => {
			const cfg = config();
			const pluginExtensions = { [options.markerPluginId]: { [options.markerKey]: { sourceThreadId: params.threadId } } };
			return { sessionKey: (await options.api.runtime.agent.session.createSessionEntry({
				cfg,
				key: sessionCatalogAdoptedSessionKey(options.keyPrefix, params.threadId),
				agentId: params.agentId,
				recoverMatchingInitialEntry: true,
				...params.session.name ? { displayName: params.session.name } : {},
				...params.session.cwd ? { spawnedCwd: params.session.cwd } : {},
				initialEntry: {
					acpBackendId: "acpx",
					acpSessionBinding: {
						acpAgentId: options.catalogId,
						agentSessionId: params.threadId
					},
					pluginExtensions
				},
				afterCreate: async (entry) => {
					await importSessionCatalogHistory({
						catalogId: options.catalogId,
						threadId: params.threadId,
						read: ({ cursor, limit }) => options.read({
							threadId: params.threadId,
							limit,
							...cursor ? { cursor } : {}
						}),
						sessionId: entry.sessionId,
						sessionKey: entry.key,
						agentId: entry.agentId,
						...params.session.cwd ? { cwd: params.session.cwd } : {},
						config: cfg
					});
					return { pluginExtensions };
				}
			})).key };
		}
	};
}
//#endregion
//#region src/plugins/session-catalog-jsonl-activity.ts
const MAX_UPSTREAM_SCAN_BYTES = 1048576;
const log = createSubsystemLogger("plugins/session-catalog");
/** Read one bounded append window; each catalog owns its row and timestamp semantics. */
async function readSessionCatalogJsonlActivity(params) {
	const { probe, filePath, offset } = params;
	let handle;
	try {
		handle = await fs.open(filePath, "r");
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return {
			kind: "missing",
			sessionKey: probe.sessionKey
		};
		log.warn(`failed to read session catalog transcript ${filePath}: ${String(error)}. Check that the transcript path exists and the Gateway can read it; the probe will retry automatically.`);
		return;
	}
	try {
		const stat = await handle.stat();
		if (!stat.isFile()) return {
			kind: "missing",
			sessionKey: probe.sessionKey
		};
		if (stat.size <= offset) return;
		const tail = await readFileRangeAsync(handle, offset, Math.min(stat.size - offset, MAX_UPSTREAM_SCAN_BYTES));
		let classifiedBytes = 0;
		let lineStart = 0;
		let lineNumber = 0;
		let humanTurns = 0;
		let occurredAt;
		for (let index = 0; index < tail.length; index += 1) {
			if (tail[index] !== 10) continue;
			const line = tail.subarray(lineStart, index).toString("utf8");
			lineNumber += 1;
			const user = line.trim() ? params.classifyLine(line, lineNumber) : void 0;
			if (user === false) break;
			if (user && isExternalUserText(probe, user.userText)) {
				humanTurns += 1;
				occurredAt = Math.max(occurredAt ?? 0, user.occurredAt ?? stat.mtimeMs);
			}
			classifiedBytes = index + 1;
			lineStart = index + 1;
		}
		if (classifiedBytes === 0) return;
		const nextOffset = offset + classifiedBytes;
		return {
			kind: "activity",
			sessionKey: probe.sessionKey,
			humanTurns,
			nextMarker: { offset: nextOffset },
			...humanTurns > 0 ? {
				occurredAt: occurredAt ?? stat.mtimeMs,
				dedupeId: String(nextOffset)
			} : {}
		};
	} finally {
		await handle.close();
	}
}
//#endregion
//#region packages/session-url-contract/src/share-build.ts
const LOWERCASE_HEX_RE = /^[0-9a-f]+$/u;
const CATALOG_SHARE_ROUTE_SEGMENT_RE = /^[a-z][a-z0-9-]*$/u;
function isControlUiCatalogShareId(shareRoute, value) {
	return value.length >= shareRoute.minPrefixLength && value.length <= shareRoute.fullLength && LOWERCASE_HEX_RE.test(value);
}
function buildControlUiCatalogSharePath(params) {
	const threadId = normalizeNullableString(params.threadId);
	const shareRoute = params.shareRoute;
	if (!threadId || !CATALOG_SHARE_ROUTE_SEGMENT_RE.test(shareRoute.routeSegment) || isControlUiReservedRouteSegment(shareRoute.routeSegment) || threadId.length !== shareRoute.fullLength || !LOWERCASE_HEX_RE.test(threadId)) return null;
	const length = Math.min(shareRoute.fullLength, Math.max(shareRoute.minPrefixLength, Math.floor(params.prefixLength ?? shareRoute.minPrefixLength)));
	const slug = controlUiSessionSlug(params.displayName);
	return `${normalizeControlUiBasePath(params.basePath)}/${shareRoute.routeSegment}/${slug ? `${slug}-` : ""}${threadId.slice(0, length)}`;
}
//#endregion
//#region src/plugins/session-catalog-active.ts
/**
* Read-only list/read facade over the active registered session catalogs.
* Deliberately excludes continue/archive/terminal so consumers cannot gain
* session control through this seam; mutation stays on the gateway RPCs.
*/
function listActiveSessionCatalogs() {
	const registrations = getPluginRegistryForContext()?.sessionCatalogs ?? [];
	const allowProcessHomeFallback = allowsProcessHomeSessionScan();
	return registrations.map(({ pluginId, provider }) => ({
		pluginId,
		id: provider.id,
		label: provider.label,
		processHomeFallbackAllowed: allowProcessHomeFallback,
		list: (params) => provider.list({
			...params,
			allowProcessHomeFallback
		}),
		read: (params) => provider.read({
			...params,
			allowProcessHomeFallback
		})
	})).toSorted((left, right) => left.id.localeCompare(right.id));
}
//#endregion
export { createAcpSessionCatalogAdoption as a, readSessionCatalogJsonlActivity as i, buildControlUiCatalogSharePath as n, isControlUiCatalogShareId as r, listActiveSessionCatalogs as t };
