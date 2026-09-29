import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { a as wrapExternalContent } from "./external-content-CLufk6dK.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { n as DIR_LIST_HARD_MAX_ENTRIES, r as DIR_LIST_TOOL_DESCRIPTOR } from "./descriptors-kcLNZgGx.mjs";
import { t as appendFileTransferAudit } from "./audit-Dh3xo0Ly.mjs";
import { i as readClampedInt, n as readRequiredNodePath, t as invokeNodeToolPayload } from "./node-tool-invoke-ciavJVdg.mjs";
//#region extensions/file-transfer/src/tools/dir-list-tool.ts
const DIRECTORY_TEXT_MAX_BYTES = 8192;
function directoryListingText(canonicalPath, entries, pageToken, nextPageToken, truncated) {
	const offset = parseStrictNonNegativeInteger(pageToken) ?? 0;
	const header = JSON.stringify({
		path: canonicalPath,
		returnedCount: entries.length
	}).slice(0, -1);
	const visible = [];
	const render = () => {
		const limited = visible.length < entries.length;
		const continuation = limited ? visible.length > 0 ? String(offset + visible.length) : void 0 : nextPageToken;
		const tail = JSON.stringify({
			truncated: limited || truncated,
			nextPageToken: continuation
		});
		const listing = `${header},"displayedCount":${visible.length},"entries":[${visible.join(",")}],${tail.slice(1)}`;
		const note = limited && visible.length === 0 ? "No entries displayed: the next complete entry or directory metadata exceeds the text budget or contains reserved markers. Pagination cannot advance; use available node-local directory capabilities." : (limited || truncated) && !continuation ? "More entries available; the node supplied no continuation token." : "If present, pass nextPageToken as pageToken; keep node and path.";
		const wrapped = wrapExternalContent(`${listing}\n${note}`, { source: "unknown" });
		return wrapped.includes(listing) && Buffer.byteLength(wrapped, "utf8") <= DIRECTORY_TEXT_MAX_BYTES ? wrapped : void 0;
	};
	let text = render();
	for (const { name, isDir, size } of entries) {
		visible.push(JSON.stringify({
			name,
			isDir,
			size
		}));
		const candidate = render();
		if (!candidate) break;
		text = candidate;
	}
	return text ?? wrapExternalContent("Directory listing omitted: the canonical path or continuation metadata cannot be represented safely within the 8192-byte text limit. No usable paths or continuation token are shown; use available node-local directory capabilities.", { source: "unknown" });
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
				hardMin: 1,
				hardMax: DIR_LIST_HARD_MAX_ENTRIES
			});
			const pageToken = typeof params.pageToken === "string" && params.pageToken.trim() ? params.pageToken.trim() : void 0;
			const { nodeId, nodeDisplayName, payload, startedAt } = await invokeNodeToolPayload({
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
			await appendFileTransferAudit({
				op: "dir.list",
				nodeId,
				nodeDisplayName,
				requestedPath: dirPath,
				canonicalPath,
				decision: "allowed",
				durationMs: Date.now() - startedAt
			});
			return {
				content: [{
					type: "text",
					text: directoryListingText(canonicalPath, entries, pageToken, nextPageToken, truncated)
				}],
				details: {
					path: canonicalPath,
					entries,
					nextPageToken,
					truncated
				}
			};
		}
	};
}
//#endregion
export { createDirListTool };
