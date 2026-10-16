import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-DI6biu8d.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as detectMime } from "./mime-CGDYrRzL.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./ssrf-runtime-BzkFo_VJ.mjs";
import "./media-mime-DLFR6fqC.mjs";
import { t as dispatchGatewayMethod } from "./gateway-method-runtime-BsuF0-5n.mjs";
import "./gateway-runtime-DMDKFL1_.mjs";
import { a as parseGitHubLinkParams, i as parseGitHubItemTarget, r as githubTargetUrl } from "./targets-RjAEePy1.mjs";
import { f as formatControlUiGitHubPreviewError, g as readBoundedResponse, l as discardResponse, n as githubPreviewView, r as ControlUiGitHubError } from "./view-model-BP_nLgQX.mjs";
//#region extensions/github/src/image.ts
const IMAGE_HOSTS = [
	"github.com",
	"user-images.githubusercontent.com",
	"private-user-images.githubusercontent.com",
	"github-production-user-asset-6210df.s3.amazonaws.com"
];
const ATTACHMENT_PATH = /^\/user-attachments\/assets\/[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i;
const RASTER_TYPES = /* @__PURE__ */ new Set([
	"image/png",
	"image/jpeg",
	"image/gif",
	"image/webp"
]);
const MAX_IMAGE_BYTES = 2097152;
function isImageUrl(url, initial) {
	return url.protocol === "https:" && !url.username && !url.password && !url.port && IMAGE_HOSTS.includes(url.hostname) && (url.hostname !== "github.com" || ATTACHMENT_PATH.test(url.pathname)) && (!initial || !url.hostname.endsWith(".s3.amazonaws.com"));
}
function parseGitHubImageParams(params) {
	if (!isRecord(params) || typeof params.url !== "string" || params.url.length > 8192) return;
	const url = URL.parse(params.url);
	return url && isImageUrl(url, true) ? url.href : void 0;
}
async function loadGitHubImage(url) {
	const { response, release } = await fetchWithSsrFGuard({
		url,
		requireHttps: true,
		timeoutMs: 15e3,
		maxRedirects: 3,
		capture: false,
		policy: { hostnameAllowlist: IMAGE_HOSTS },
		resolveDispatcherPolicy: (target) => {
			if (!isImageUrl(target, false)) throw new Error("GitHub image redirect is not permitted");
		},
		init: {
			credentials: "omit",
			headers: { Accept: [...RASTER_TYPES].join(",") }
		}
	});
	try {
		if (!response.ok) throw new Error("GitHub image is unavailable");
		const body = await readBoundedResponse(response, MAX_IMAGE_BYTES);
		const mime = await detectMime({ buffer: body });
		if (!mime || !RASTER_TYPES.has(mime)) throw new Error("GitHub attachment is not a supported image");
		return {
			url,
			dataUrl: `data:${mime};base64,${body.toString("base64")}`
		};
	} finally {
		await discardResponse(response);
		await release();
	}
}
//#endregion
//#region extensions/github/src/preview-contract.ts
/** Validate the untyped dispatch payload before projecting it into a generic reader. */
function isControlUiGitHubPreview(value) {
	if (!isRecord(value) || !parseGitHubItemTarget(value)) return false;
	return [
		"createdAt",
		"login",
		"state",
		"title",
		"updatedAt"
	].every((key) => typeof value[key] === "string") && [
		"avatarDataUrl",
		"closedAt",
		"mergedAt",
		"stateReason"
	].every((key) => value[key] === void 0 || typeof value[key] === "string") && [
		"additions",
		"changedFiles",
		"comments",
		"deletions",
		"coAuthorCount"
	].every((key) => value[key] === void 0 || typeof value[key] === "number" && Number.isFinite(value[key])) && (value.draft === void 0 || typeof value.draft === "boolean") && (value.coAuthors === void 0 || Array.isArray(value.coAuthors) && value.coAuthors.every((author) => isRecord(author) && typeof author.login === "string" && (author.avatarDataUrl === void 0 || typeof author.avatarDataUrl === "string")));
}
//#endregion
//#region extensions/github/src/handlers.ts
async function handleGitHubRequest(method, { params, respond }) {
	const parsed = parseGitHubLinkParams(params);
	if (!parsed || method === "github.preview" && parsed.target.kind === "commit") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid " + method + " params"));
		return;
	}
	try {
		const result = await dispatchGatewayMethod(method === "github.preview" ? "controlUi.githubPreview" : "controlUi.githubDetail", {
			...parsed.target,
			...parsed.agentId ? { agentId: parsed.agentId } : {},
			...parsed.refresh ? { refresh: true } : {}
		});
		if (!result.ok) {
			respond(false, result.payload, result.error, result.meta);
			return;
		}
		if (method === "github.preview" && parsed.target.kind !== "commit") {
			if (!isControlUiGitHubPreview(result.payload) || githubTargetUrl(result.payload).toLowerCase() !== githubTargetUrl(parsed.target).toLowerCase()) throw new ControlUiGitHubError(502, "GitHub preview returned an invalid response");
			respond(true, {
				...githubPreviewView(result.payload),
				url: parsed.url
			}, void 0, result.meta);
		} else {
			const document = result.payload;
			if (!isRecord(document) || typeof document.title !== "string" || typeof document.body !== "string" || typeof document.url !== "string" || document.url.toLowerCase() !== githubTargetUrl(parsed.target).toLowerCase()) throw new ControlUiGitHubError(502, "GitHub document returned a different resource");
			respond(true, {
				...document,
				url: parsed.url,
				filesExpanded: parsed.filesExpanded
			}, void 0, result.meta);
		}
	} catch (error) {
		const { message, ...details } = formatControlUiGitHubPreviewError(error);
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message, details));
	}
}
const githubHandlers = {
	"github.image": async ({ params, respond }) => {
		const url = parseGitHubImageParams(params);
		if (!url) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid github.image params"));
			return;
		}
		try {
			respond(true, await loadGitHubImage(url), void 0);
		} catch {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub image is unavailable"));
		}
	},
	"github.preview": (options) => handleGitHubRequest("github.preview", options),
	"github.detail": (options) => handleGitHubRequest("github.detail", options)
};
//#endregion
export { githubHandlers };
