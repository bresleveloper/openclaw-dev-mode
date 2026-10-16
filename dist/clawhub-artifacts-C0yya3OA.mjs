import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { M as normalizeClawHubSha256Hex } from "./official-external-plugin-catalog-DWheKC4x.mjs";
import { b as withClawHubResponse, l as readClawHubBytes, n as createClawHubError, v as resolveClawHubBaseUrl } from "./clawhub-client-D-mEumEV.mjs";
import { n as createTempDownloadTarget } from "./temp-download-DLutZExN.mjs";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/infra/clawhub-artifacts.ts
const DEFAULT_GITHUB_CODELOAD_URL = "https://codeload.github.com";
function normalizeGitHubCodeloadBaseUrl() {
	return (normalizeOptionalString(process.env.CLAWHUB_GITHUB_CODELOAD_BASE_URL) || DEFAULT_GITHUB_CODELOAD_URL).replace(/\/+$/, "") || DEFAULT_GITHUB_CODELOAD_URL;
}
function buildGitHubZipUrl(repo, commit) {
	const url = new URL(`${normalizeGitHubCodeloadBaseUrl()}/`);
	url.pathname = `${url.pathname.replace(/\/+$/, "")}/${repo.split("/").map((segment) => encodeURIComponent(segment)).join("/")}/zip/${encodeURIComponent(commit)}`;
	return url.toString();
}
function safePackageTarballName(name, version) {
	return `${name.replace(/^@/, "").replace(/[\\/]+/g, "-").replace(/[^A-Za-z0-9._-]/g, "-") || "package"}-${version}.tgz`;
}
async function stageClawHubArchive(params) {
	const sha256Digest = params.sha256Hex ?? sha256Hex(params.bytes);
	const target = await createTempDownloadTarget(params);
	try {
		await fs.writeFile(target.path, params.bytes);
		return {
			archivePath: target.path,
			integrity: `sha256-${Buffer.from(sha256Digest, "hex").toString("base64")}`,
			sha256Hex: sha256Digest,
			artifact: "archive",
			...params.result,
			cleanup: target.cleanup
		};
	} catch (error) {
		await target.cleanup().catch(() => void 0);
		throw error;
	}
}
async function fetchClawHubArchive(params, resourceLabel) {
	return await withClawHubResponse(params, async ({ response, url, hasToken, releaseDeadline }) => {
		if (!response.ok) throw await createClawHubError(response, url, hasToken, params.timeoutMs);
		releaseDeadline();
		return {
			bytes: await readClawHubBytes({
				response,
				timeoutMs: params.timeoutMs,
				resourceLabel
			}),
			headers: response.headers
		};
	});
}
async function downloadClawHubPackageArchive(params) {
	if (params.artifact === "clawpack") {
		if (!params.version) throw new Error("ClawPack package downloads require an explicit version.");
		const { bytes, headers } = await fetchClawHubArchive({
			baseUrl: params.baseUrl,
			path: `/api/v1/packages/${encodeURIComponent(params.name)}/versions/${encodeURIComponent(params.version)}/artifact/download`,
			token: params.token,
			timeoutMs: params.timeoutMs,
			fetchImpl: params.fetchImpl
		}, `ClawPack download for ${params.name}@${params.version}`);
		const sha256Digest = sha256Hex(bytes);
		const npmIntegrity = `sha512-${createHash("sha512").update(bytes).digest("base64")}`;
		const npmShasum = createHash("sha1").update(bytes).digest("hex");
		const headerSha256 = normalizeClawHubSha256Hex(headers.get("X-ClawHub-Artifact-Sha256") ?? headers.get("X-ClawHub-ClawPack-Sha256") ?? "");
		if (!headerSha256) throw new Error(`ClawHub ClawPack download for "${params.name}@${params.version}" is missing X-ClawHub-Artifact-Sha256.`);
		if (headerSha256 !== sha256Digest) throw new Error(`ClawHub ClawPack download for "${params.name}@${params.version}" declared sha256 ${headerSha256}, got ${sha256Digest}.`);
		const headerNpmIntegrity = normalizeOptionalString(headers.get("X-ClawHub-Npm-Integrity"));
		if (headerNpmIntegrity && headerNpmIntegrity !== npmIntegrity) throw new Error(`ClawHub ClawPack download for "${params.name}@${params.version}" declared npm integrity ${headerNpmIntegrity}, got ${npmIntegrity}.`);
		const headerNpmShasum = normalizeOptionalString(headers.get("X-ClawHub-Npm-Shasum"));
		if (headerNpmShasum && headerNpmShasum !== npmShasum) throw new Error(`ClawHub ClawPack download for "${params.name}@${params.version}" declared npm shasum ${headerNpmShasum}, got ${npmShasum}.`);
		const npmTarballName = normalizeOptionalString(headers.get("X-ClawHub-Npm-Tarball-Name")) ?? safePackageTarballName(params.name, params.version);
		const rawSpecVersion = headers.get("X-ClawHub-ClawPack-Spec-Version");
		const specVersion = parseStrictPositiveInteger(rawSpecVersion);
		return stageClawHubArchive({
			prefix: "openclaw-clawhub-clawpack",
			fileName: npmTarballName,
			bytes,
			sha256Hex: sha256Digest,
			result: {
				artifact: "clawpack",
				clawpackHeaderSha256: headerSha256,
				...specVersion !== void 0 ? { clawpackHeaderSpecVersion: specVersion } : {},
				npmIntegrity,
				npmShasum,
				npmTarballName
			}
		});
	}
	const search = params.version ? { version: params.version } : params.tag ? { tag: params.tag } : void 0;
	const { bytes } = await fetchClawHubArchive({
		baseUrl: params.baseUrl,
		path: `/api/v1/packages/${encodeURIComponent(params.name)}/download`,
		search,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	}, `package archive download for ${params.name}`);
	return stageClawHubArchive({
		prefix: "openclaw-clawhub-package",
		fileName: `${params.name}.zip`,
		bytes
	});
}
async function downloadClawHubSkillArchive(params) {
	const { bytes } = await fetchClawHubArchive({
		baseUrl: params.baseUrl,
		path: "/api/v1/download",
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: {
			slug: params.slug,
			ownerHandle: params.ownerHandle,
			version: params.version,
			tag: params.version ? void 0 : params.tag
		}
	}, `skill archive download for ${params.slug}`);
	return stageClawHubArchive({
		prefix: "openclaw-clawhub-skill",
		fileName: `${params.slug}.zip`,
		bytes
	});
}
async function downloadClawHubSkillArchiveUrl(params) {
	const providedToken = normalizeOptionalString(params.token);
	const requestUrl = new URL(params.url, `${resolveClawHubBaseUrl(params.baseUrl)}/`);
	const registryOrigin = new URL(`${resolveClawHubBaseUrl(params.baseUrl)}/`).origin;
	const skipAuth = providedToken == null && requestUrl.origin !== registryOrigin;
	const { bytes } = await fetchClawHubArchive({
		baseUrl: params.baseUrl,
		url: params.url,
		token: providedToken,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		skipAuth
	}, `skill archive download at ${requestUrl.pathname}`);
	return stageClawHubArchive({
		prefix: "openclaw-clawhub-skill",
		fileName: "skill.zip",
		bytes
	});
}
async function downloadClawHubGitHubSkillArchive(params) {
	const { bytes } = await fetchClawHubArchive({
		url: buildGitHubZipUrl(params.repo, params.commit),
		skipAuth: true,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	}, `GitHub source archive for ${params.repo}@${params.commit}`);
	return stageClawHubArchive({
		prefix: "openclaw-clawhub-github-skill",
		fileName: `${params.commit}.zip`,
		bytes
	});
}
//#endregion
export { downloadClawHubSkillArchiveUrl as i, downloadClawHubPackageArchive as n, downloadClawHubSkillArchive as r, downloadClawHubGitHubSkillArchive as t };
