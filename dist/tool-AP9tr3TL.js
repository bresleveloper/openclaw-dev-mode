import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DOKojISm.js";
import { b as readStringParam, c as imageResultFromFile, g as readPositiveIntegerParam, l as jsonResult, p as readFiniteNumberParam } from "./common-B2QjWqqG.js";
import { t as callGatewayTool } from "./gateway-BHJLRjIg.js";
import { i as resolveNodeIdFromList, t as listNodes } from "./nodes-utils-B5ynlPJm.js";
import "./temp-path-BbDdjtr4.js";
import "./agent-harness-runtime-BE2UC9cJ.js";
import "./channel-actions-CdLhqkfP.js";
import "./param-readers-Cip642Vm.js";
import { t as CanvasToolSchema } from "./tool-schema-CFGO4x4D.js";
import { n as normalizeCanvasSnapshotFileExtension, r as parseCanvasSnapshotPayload } from "./cli-helpers-Do6MR1IV.js";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region extensions/canvas/src/tool.ts
/**
* Agent-facing Canvas tool implementation for node canvas commands and
* snapshots.
*/
function readGatewayCallOptions(params) {
	return {
		gatewayUrl: readStringParam(params, "gatewayUrl", { trim: false }),
		gatewayToken: readStringParam(params, "gatewayToken", { trim: false }),
		timeoutMs: readPositiveIntegerParam(params, "timeoutMs")
	};
}
async function resolveNodeId(opts, query, allowDefault = false) {
	return resolveNodeIdFromList(await listNodes(opts), query, allowDefault);
}
async function writeBase64ToTempFile(params) {
	const dir = resolvePreferredOpenClawTmpDir();
	await fs.mkdir(dir, {
		recursive: true,
		mode: 448
	});
	const ext = `.${normalizeCanvasSnapshotFileExtension(params.ext)}`;
	const filePath = path.join(dir, `openclaw-canvas-snapshot-${randomUUID()}${ext}`);
	await fs.writeFile(filePath, Buffer.from(params.base64, "base64"));
	return filePath;
}
function isPathInsideRoot(root, candidate) {
	const relative = path.relative(root, candidate);
	return relative === "" || relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}
async function readJsonlFromPath(jsonlPath, workspaceDir) {
	const trimmed = jsonlPath.trim();
	if (!trimmed) return "";
	const workspaceRoot = path.resolve(workspaceDir ?? process.cwd());
	const resolved = path.resolve(workspaceRoot, trimmed);
	const [workspaceReal, resolvedReal] = await Promise.all([fs.realpath(workspaceRoot), fs.realpath(resolved)]);
	if (!isPathInsideRoot(workspaceReal, resolvedReal)) throw new Error("jsonlPath outside workspace");
	return await fs.readFile(resolvedReal, "utf8");
}
function resolveCanvasImageSanitizationLimits(config) {
	const configured = config?.agents?.defaults?.imageMaxDimensionPx;
	if (typeof configured !== "number" || !Number.isFinite(configured)) return {};
	return { maxDimensionPx: Math.max(1, Math.floor(configured)) };
}
/** Creates the model-facing Canvas tool used to invoke paired node canvas commands. */
function createCanvasTool(options) {
	const imageSanitization = resolveCanvasImageSanitizationLimits(options?.config);
	return {
		label: "Canvas",
		name: "canvas",
		description: "Control node canvases (present/hide/navigate/eval/snapshot/A2UI). Use snapshot to capture the rendered UI.",
		parameters: CanvasToolSchema,
		execute: async (_toolCallId, args) => {
			const params = args;
			const action = readStringParam(params, "action", { required: true });
			const gatewayOpts = readGatewayCallOptions(params);
			const nodeId = await resolveNodeId(gatewayOpts, readStringParam(params, "node", { trim: true }), true);
			const invoke = async (command, invokeParams) => await callGatewayTool("node.invoke", gatewayOpts, {
				nodeId,
				command,
				params: invokeParams,
				idempotencyKey: randomUUID()
			});
			switch (action) {
				case "present": {
					const placement = {
						x: readFiniteNumberParam(params, "x"),
						y: readFiniteNumberParam(params, "y"),
						width: readFiniteNumberParam(params, "width"),
						height: readFiniteNumberParam(params, "height")
					};
					const invokeParams = {};
					const presentTarget = readStringParam(params, "target", { trim: true }) ?? readStringParam(params, "url", { trim: true });
					if (presentTarget) invokeParams.url = presentTarget;
					if (Number.isFinite(placement.x) || Number.isFinite(placement.y) || Number.isFinite(placement.width) || Number.isFinite(placement.height)) invokeParams.placement = placement;
					await invoke("canvas.present", invokeParams);
					return jsonResult({ ok: true });
				}
				case "hide":
					await invoke("canvas.hide", void 0);
					return jsonResult({ ok: true });
				case "navigate":
					await invoke("canvas.navigate", { url: readStringParam(params, "url", { trim: true }) ?? readStringParam(params, "target", {
						required: true,
						trim: true,
						label: "url"
					}) });
					return jsonResult({ ok: true });
				case "eval": {
					const result = (await invoke("canvas.eval", { javaScript: readStringParam(params, "javaScript", { required: true }) }))?.payload?.result;
					if (result) return {
						content: [{
							type: "text",
							text: result
						}],
						details: { result }
					};
					return jsonResult({ ok: true });
				}
				case "snapshot": {
					const formatRaw = typeof params.outputFormat === "string" && params.outputFormat.trim() ? params.outputFormat.trim().toLowerCase() : "png";
					const payload = parseCanvasSnapshotPayload((await invoke("canvas.snapshot", {
						format: formatRaw === "jpg" || formatRaw === "jpeg" ? "jpeg" : "png",
						maxWidth: readPositiveIntegerParam(params, "maxWidth"),
						quality: readFiniteNumberParam(params, "quality", {
							min: 0,
							max: 1
						})
					}))?.payload);
					return await imageResultFromFile({
						label: "canvas:snapshot",
						path: await writeBase64ToTempFile({
							base64: payload.base64,
							ext: payload.format === "jpeg" ? "jpg" : payload.format
						}),
						details: { format: payload.format },
						imageSanitization
					});
				}
				case "a2ui_push": {
					const jsonl = typeof params.jsonl === "string" && params.jsonl.trim() ? params.jsonl : typeof params.jsonlPath === "string" && params.jsonlPath.trim() ? await readJsonlFromPath(params.jsonlPath, options?.workspaceDir) : "";
					if (!jsonl.trim()) throw new Error("jsonl or jsonlPath required");
					await invoke("canvas.a2ui.pushJSONL", { jsonl });
					return jsonResult({ ok: true });
				}
				case "a2ui_reset":
					await invoke("canvas.a2ui.reset", void 0);
					return jsonResult({ ok: true });
				default: throw new Error(`Unknown action: ${action}`);
			}
		}
	};
}
//#endregion
export { createCanvasTool };
