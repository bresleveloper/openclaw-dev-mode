import { a as asOptionalRecord } from "../../record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.mjs";
import { t as findCrabboxBinary } from "../../crabbox-binary-BMI8aWfR.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { i as resolveManagedCrabboxBinaryPath, n as ensureManagedCrabboxBinary, r as probeCrabboxVersion, t as CRABBOX_MIN_VERSION } from "../../crabbox-managed-binary-B98pQW90.mjs";
import { m as resolveOpenClawRoot, r as CRABBOX_WORKER_PROVIDER_ID } from "../../crabbox-worker-profile-JlLsFEvg.mjs";
import "../../crabbox-worker-warm-image-records-CKlhPK62.mjs";
import { f as projectCrabboxWarmImage, o as crabboxWarmImageRecoveryHint, s as isCrabboxWarmImageCaptureUncertain, t as CRABBOX_WARM_IMAGE_WAIT_HINT } from "../../crabbox-worker-warm-image-store-mBNWdk8P.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region extensions/crabbox/src/doctor.ts
const CRABBOX_CLOUD_WORKER_PROFILE_CHECK_ID = "crabbox/cloud-worker-profiles";
const CRABBOX_WARM_IMAGES_CHECK_ID = "crabbox/warm-images";
function createCrabboxCloudWorkerProfileCheck(openclawRoot) {
	return {
		id: CRABBOX_CLOUD_WORKER_PROFILE_CHECK_ID,
		kind: "plugin",
		description: "Verify configured Crabbox cloud worker profiles before dispatch.",
		source: "crabbox",
		async detect(ctx) {
			const profiles = Object.entries(ctx.cfg.cloudWorkers?.profiles ?? {}).filter(([, profile]) => profile.provider.trim().toLowerCase() === CRABBOX_WORKER_PROVIDER_ID);
			if (profiles.length === 0) return [];
			const probes = /* @__PURE__ */ new Map();
			const probe = (binary) => {
				let pending = probes.get(binary);
				if (!pending) {
					pending = probeCrabboxVersion(binary);
					probes.set(binary, pending);
				}
				return pending;
			};
			const findings = [];
			for (const [profileId, profile] of profiles) {
				const explicitBinary = normalizeOptionalString(asOptionalRecord(profile.settings)?.binary);
				const binary = findCrabboxBinary({
					...explicitBinary ? { explicit: explicitBinary } : {},
					openclawRoot,
					pathEnv: ctx.env?.PATH ?? process.env.PATH
				});
				const result = binary ? await probe(binary) : void 0;
				if (result?.status === "supported") continue;
				let managedPath;
				try {
					managedPath = resolveManagedCrabboxBinaryPath(ctx.env);
				} catch (error) {
					findings.push({
						checkId: CRABBOX_CLOUD_WORKER_PROFILE_CHECK_ID,
						severity: "warning",
						source: "crabbox",
						target: profileId,
						message: error instanceof Error ? error.message : "Crabbox host is unsupported"
					});
					continue;
				}
				const installed = findCrabboxBinary({
					explicit: managedPath,
					openclawRoot
				});
				if (installed && (await probe(installed)).status === "supported") continue;
				const reason = !result ? "has no executable Crabbox binary" : result.status === "outdated" ? `uses outdated Crabbox ${result.version}` : `could not determine its Crabbox version: ${result.reason}`;
				findings.push({
					checkId: CRABBOX_CLOUD_WORKER_PROFILE_CHECK_ID,
					severity: "warning",
					source: "crabbox",
					message: `Cloud worker profile "${profileId}" ${reason}. OpenClaw will install its managed Crabbox before use.`,
					...binary ?? explicitBinary ? { path: binary ?? explicitBinary } : {},
					ocPath: `cloudWorkers.profiles.${profileId}.settings.binary`,
					target: profileId,
					requirement: `Crabbox ${CRABBOX_MIN_VERSION} or newer`,
					fixHint: `Run \`openclaw doctor --fix\` to install the managed Crabbox now, or provision Crabbox ${CRABBOX_MIN_VERSION} or newer using \`cloudWorkers.profiles.${profileId}.settings.binary\`. The existing executable and profile configuration are preserved.`
				});
			}
			return findings;
		},
		async repair(ctx, findings) {
			if (findings.length === 0 || ctx.dryRun) return {
				status: "skipped",
				changes: []
			};
			try {
				const { binary } = await ensureManagedCrabboxBinary({
					binary: resolveManagedCrabboxBinaryPath(ctx.env),
					env: ctx.env
				});
				return {
					status: "repaired",
					changes: [`Installed managed Crabbox at ${binary}`],
					effects: [{
						kind: "package",
						action: "install",
						target: binary
					}]
				};
			} catch (error) {
				return {
					status: "failed",
					changes: [],
					warnings: [error instanceof Error ? error.message : "Managed Crabbox installation failed"]
				};
			}
		}
	};
}
function registerCrabboxWorkerProviderDoctorChecks(host) {
	if (!host.getHealthCheck("crabbox/cloud-worker-profiles")) host.registerHealthCheck(createCrabboxCloudWorkerProfileCheck(host.openclawRoot));
	if (!host.getHealthCheck(CRABBOX_WARM_IMAGES_CHECK_ID)) host.registerHealthCheck({
		id: CRABBOX_WARM_IMAGES_CHECK_ID,
		kind: "plugin",
		description: "Report paused Crabbox warm-image captures and retained cleanup obligations.",
		source: "crabbox",
		async detect(ctx) {
			const findings = [];
			const entries = await host.listPluginStateEntries({
				namespace: "warm-images",
				maxEntries: 128,
				overflowPolicy: "reject-new",
				...ctx.env ? { env: ctx.env } : {}
			});
			for (const { key, value } of entries) {
				const image = projectCrabboxWarmImage(key, value);
				const facts = [
					image.profileId,
					image.backend,
					image.machineClass,
					image.os,
					image.projectLabel
				].filter(Boolean);
				const display = facts.length ? ` (${facts.join(" · ")})` : "";
				const details = {
					checkId: CRABBOX_WARM_IMAGES_CHECK_ID,
					severity: "warning",
					source: "crabbox",
					target: image.profileKey
				};
				if (image.capture) {
					const uncertain = isCrabboxWarmImageCaptureUncertain(image.capture);
					findings.push({
						...details,
						severity: uncertain || image.capture.stale ? "warning" : "info",
						message: uncertain ? `Warm-image capture ${image.capture.selector}${display} is paused; its provider outcome requires manual reconciliation.` : image.capture.stale ? `Warm-image capture ${image.capture.selector}${display} is taking longer than usual.` : `Warm-image capture ${image.capture.selector}${display} is in progress.`,
						fixHint: uncertain ? crabboxWarmImageRecoveryHint(image.capture.selector) : CRABBOX_WARM_IMAGE_WAIT_HINT
					});
				}
				if (image.retirement) findings.push({
					...details,
					message: `Warm-image checkpoint ${image.retirement.checkpointId}${display} is still awaiting deletion.`,
					fixHint: "Cleanup retries during the next warm-image capture or worker teardown. Inspect `openclaw crabbox warm-images --json` and resolve provider deletion errors if it remains pending."
				});
			}
			return findings;
		}
	});
}
//#endregion
//#region extensions/crabbox/doctor-health-api.ts
const CRABBOX_PLUGIN_ROOT = path.dirname(fileURLToPath(import.meta.url));
function registerWorkerProviderDoctorChecks(host) {
	registerCrabboxWorkerProviderDoctorChecks({
		...host,
		openclawRoot: resolveOpenClawRoot(CRABBOX_PLUGIN_ROOT)
	});
}
//#endregion
export { CRABBOX_CLOUD_WORKER_PROFILE_CHECK_ID, registerWorkerProviderDoctorChecks };
