import { C as parseStrictNonNegativeInteger } from "./number-coercion-CkhMiRw8.mjs";
import { n as textResult } from "./tool-results-BCM3fdVS.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import { n as DIR_LIST_HARD_MAX_ENTRIES, r as DIR_LIST_TOOL_DESCRIPTOR } from "./descriptors-CuxGfPJm.mjs";
import { i as readClampedInt, n as readRequiredNodePath, t as invokeNodeToolPayload } from "./node-tool-invoke-BScviGCX.mjs";
import { t as renderDirectoryText } from "./directory-text-DYqhCquA.mjs";
//#region extensions/file-transfer/src/tools/dir-list-tool.ts
function directoryListingText(canonicalPath, entries, pageToken, nextPageToken, truncated) {
	const offset = parseStrictNonNegativeInteger(pageToken) ?? 0;
	const header = JSON.stringify({
		path: canonicalPath,
		returnedCount: entries.length
	}).slice(0, -1);
	return renderDirectoryText({
		entries,
		project: ({ name, isDir, size }) => ({
			name,
			isDir,
			size
		}),
		render: (visible) => {
			const limited = visible.length < entries.length;
			const continuation = limited ? visible.length > 0 ? String(offset + visible.length) : void 0 : nextPageToken;
			const tail = JSON.stringify({
				truncated: limited || truncated,
				nextPageToken: continuation
			});
			const listing = `${header},"displayedCount":${visible.length},"entries":[${visible.join(",")}],${tail.slice(1)}`;
			return {
				manifest: listing,
				text: `${listing}\n${limited && visible.length === 0 ? "No entries displayed: the next complete entry or directory metadata exceeds the text budget or contains reserved markers. Pagination cannot advance; use available node-local directory capabilities." : (limited || truncated) && !continuation ? "More entries available; the node supplied no continuation token." : "If present, pass nextPageToken as pageToken; keep node and path."}`
			};
		},
		fallback: "Directory listing omitted: the resolved path or continuation metadata cannot be represented safely within the 8192-byte text limit. No usable paths or continuation token are shown; use available node-local directory capabilities."
	});
}
function createDirListTool() {
	return {
		...DIR_LIST_TOOL_DESCRIPTOR,
		execute: async (_toolCallId, args) => {
			const params = args;
			const { node, requestedPath: dirPath } = readRequiredNodePath(params);
			const maxEntries = readClampedInt({
				input: params,
				key: "maxEntries",
				defaultValue: 200,
				hardMax: DIR_LIST_HARD_MAX_ENTRIES
			});
			const pageToken = typeof params.pageToken === "string" && params.pageToken.trim() ? params.pageToken.trim() : void 0;
			const { audit, payload } = await invokeNodeToolPayload({
				node,
				params,
				command: "dir.list",
				commandParams: {
					path: dirPath,
					pageToken,
					maxEntries
				},
				requestedPath: dirPath
			});
			const canonicalPath = typeof payload.path === "string" ? payload.path : dirPath;
			const entries = Array.isArray(payload.entries) ? payload.entries : [];
			const truncated = payload.truncated === true;
			const nextPageToken = typeof payload.nextPageToken === "string" ? payload.nextPageToken : void 0;
			await audit({
				canonicalPath,
				decision: "allowed"
			});
			return textResult(directoryListingText(canonicalPath, entries, pageToken, nextPageToken, truncated), {
				path: canonicalPath,
				entries,
				nextPageToken,
				truncated
			});
		}
	};
}
//#endregion
export { createDirListTool };
