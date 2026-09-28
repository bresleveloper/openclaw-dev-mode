import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { n as parsePackageOpenClawSchemaVersions } from "./openclaw-schema-versions-PVhojTxP.mjs";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-BOG6Do5a.mjs";
import "./npm-install-env-D6spEEnI.mjs";
//#region src/infra/update-check-package-target.ts
function parseNpmPackageTargetMetadata(raw, packageName) {
	let parsed;
	try {
		parsed = JSON.parse(raw.trim());
	} catch (err) {
		throw new Error(`npm view returned invalid JSON: ${String(err)}`, { cause: err });
	}
	const entry = Array.isArray(parsed) && parsed.length === 1 ? parsed[0] : parsed;
	if (!entry || typeof entry !== "object" || Array.isArray(entry)) return {
		version: null,
		nodeEngine: null
	};
	const rec = entry;
	const engines = rec.engines && typeof rec.engines === "object" ? rec.engines : null;
	const nodeEngine = normalizeNullableString(rec["engines.node"]) ?? (engines ? normalizeNullableString(engines.node) : null);
	const schemaVersions = parsePackageOpenClawSchemaVersions({
		name: packageName,
		version: rec.version,
		openclaw: Object.hasOwn(rec, "openclaw.schemaVersions") ? { schemaVersions: rec["openclaw.schemaVersions"] } : rec.openclaw
	});
	return {
		version: normalizeNullableString(rec.version),
		nodeEngine,
		...schemaVersions ? { schemaVersions } : {}
	};
}
function formatNpmViewError(res) {
	const raw = (res.stderr.trim() || res.stdout.trim()).split("\n").slice(-3).join("\n");
	return raw ? `npm view failed: ${raw}` : "npm view failed";
}
function packageTargetSpec(params) {
	return params.spec?.trim() || `openclaw@${params.target.trim() || "latest"}`;
}
const PUBLIC_NPM_REGISTRY_URL = "https://registry.npmjs.org/";
const PUBLIC_NPM_PACKAGE_NAME = "openclaw";
function npmRegistryTargetUrl(params) {
	const baseUrl = params.registryUrl.endsWith("/") ? params.registryUrl : `${params.registryUrl}/`;
	return new URL(`${encodeURIComponent(params.packageName)}/${encodeURIComponent(params.target)}`, baseUrl).toString();
}
async function fetchNpmPackageTargetStatusFromRegistry(params) {
	const url = npmRegistryTargetUrl({
		registryUrl: params.registryUrl ?? PUBLIC_NPM_REGISTRY_URL,
		packageName: params.packageName ?? PUBLIC_NPM_PACKAGE_NAME,
		target: params.target
	});
	const { signal, cleanup } = buildTimeoutAbortSignal({
		timeoutMs: Math.max(1, params.timeoutMs),
		operation: "npm-registry-update-check",
		url
	});
	let res;
	try {
		res = await fetch(url, { signal });
		if (!res.ok) return {
			target: params.target,
			version: null,
			nodeEngine: null,
			error: `HTTP ${res.status}`
		};
		const json = await readProviderJsonResponse(res, "npm package target status");
		const schemaVersions = parsePackageOpenClawSchemaVersions({
			...json,
			name: params.packageName ?? PUBLIC_NPM_PACKAGE_NAME
		});
		return {
			target: params.target,
			version: normalizeNullableString(json.version),
			nodeEngine: normalizeNullableString(json.engines?.node),
			...schemaVersions ? { schemaVersions } : {}
		};
	} catch (err) {
		return {
			target: params.target,
			version: null,
			nodeEngine: null,
			error: String(err)
		};
	} finally {
		await cancelUnreadResponseBody(res);
		cleanup();
	}
}
async function fetchNpmPackageTargetStatus(params) {
	const timeoutMs = params.timeoutMs ?? 3e5;
	const target = params.target;
	if (!params.command && !params.runCommand) return await fetchNpmPackageTargetStatusFromRegistry({
		target,
		timeoutMs,
		registryUrl: params.registryUrl,
		packageName: params.packageName
	});
	const runCommand = params.runCommand ?? runCommandWithTimeout;
	const spec = packageTargetSpec(params);
	try {
		const res = await runCommand([
			params.command ?? "npm",
			"view",
			spec,
			"version",
			"engines.node",
			"openclaw.schemaVersions",
			"--json",
			"--global"
		], {
			timeoutMs: Math.max(1, timeoutMs),
			cwd: params.cwd,
			env: params.env,
			maxOutputBytes: 1048576
		});
		if (res.code !== 0) return {
			target,
			version: null,
			nodeEngine: null,
			error: formatNpmViewError(res)
		};
		const { version, nodeEngine, schemaVersions } = parseNpmPackageTargetMetadata(res.stdout, spec === "openclaw" || /^openclaw@[^:/]+$/.test(spec) ? "openclaw" : "");
		return {
			target,
			version,
			nodeEngine,
			...schemaVersions ? { schemaVersions } : {}
		};
	} catch (err) {
		return {
			target,
			version: null,
			nodeEngine: null,
			error: String(err)
		};
	}
}
//#endregion
export { fetchNpmPackageTargetStatus as t };
