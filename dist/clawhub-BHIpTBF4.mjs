import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { N as normalizeClawHubSha256Integrity } from "./official-external-plugin-catalog-DWheKC4x.mjs";
import { o as isDefaultClawHubBaseUrl, t as ClawHubRequestError, v as resolveClawHubBaseUrl } from "./clawhub-client-D-mEumEV.mjs";
import { i as downloadClawHubSkillArchiveUrl, r as downloadClawHubSkillArchive, t as downloadClawHubGitHubSkillArchive } from "./clawhub-artifacts-C0yya3OA.mjs";
import { r as checkClawHubPackageTrust } from "./clawhub-install-trust-C5PsdSzR.mjs";
import { a as fetchClawHubSkillDetail, c as fetchClawHubSkillVerification, l as reportClawHubSkillInstallTelemetry, n as CLAWHUB_SKILLS_SH_TRUST_LABEL, o as fetchClawHubSkillInstallResolution } from "./clawhub-skills-BFN100ff.mjs";
import { t as markClawPackageIndependentlyOwned } from "./claw-package-adoption-B-a8egsH.mjs";
import { n as withClawPackageLifecycleLease } from "./claw-package-lifecycle-lease-v-fevrKC.mjs";
import { t as normalizeTrackedSkillSlug } from "./install-paths-CdlkBGI2.mjs";
import { d as readClawHubSkillsLockfile, g as resolveWorkspaceClawHubSkills, h as recordClawHubSkillInstall, i as normalizeGitHubCommitSegment, n as formatClawHubSkillRef, p as readInstalledClawHubSkillFiles, s as parseRequestedClawHubSkillRef, t as assertClawHubSkillInstallState } from "./clawhub-store-CKsiNVqc.mjs";
import { o as resolveRequestedUpdateSlug, s as resolveTrackedUpdateTarget, t as preflightSkillOwnerState } from "./clawhub-status-Cf275ONq.mjs";
import { n as guardTrackedSkillLocalState } from "./clawhub-uninstall-CEtPgilV.mjs";
import { n as withExtractedArchiveRoot } from "./install-flow-3Ckr_bLy.mjs";
import { r as installExtractedSkillRoot, t as CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS } from "./archive-install-Dp-ho22C.mjs";
import path from "node:path";
//#region src/skills/lifecycle/clawhub-request-error.ts
function formatClawHubSkillRequestError(error, params) {
	if (!(error instanceof ClawHubRequestError)) return formatErrorMessage(error);
	const skillPath = `/api/v1/skills/${encodeURIComponent(params.slug)}`;
	if (error.status === 404 && (error.requestPath.endsWith(skillPath) || error.requestPath.endsWith(`${skillPath}/install`) || error.requestPath.endsWith(`${skillPath}/verify`))) return `Skill "${params.slug}" not found on ClawHub. Run \`${formatCliCommand(`openclaw skills search ${params.slug}`)}\` to find the right skill reference.`;
	const action = params.operation === "install" ? "installing" : "verifying";
	if (error.status === 401) return `ClawHub authentication failed while ${action} skill "${params.slug}". Authenticate with ClawHub and try again.`;
	if (error.status === 403) return `ClawHub denied access while ${action} skill "${params.slug}". Check your ClawHub access and try again.`;
	if (error.status === 429) return `ClawHub rate limit reached while ${action} skill "${params.slug}". Wait and try again later.`;
	if (error.status >= 500) return `ClawHub is temporarily unavailable while ${action} skill "${params.slug}". Try again later.`;
	return `ClawHub could not ${params.operation} skill "${params.slug}". Check the skill reference and try again.`;
}
//#endregion
//#region src/skills/lifecycle/clawhub-install-core.ts
function normalizeExpectedArtifactIntegrity(expectedIntegrity) {
	const normalized = normalizeClawHubSha256Integrity(expectedIntegrity);
	if (!normalized) throw new Error(`Invalid expected ClawHub archive integrity: ${expectedIntegrity}`);
	return normalized;
}
function hasOfficialClawHubFlag(value) {
	return value?.channel === "official" || value?.official === true || value?.isOfficial === true;
}
function isDefaultOfficialClawHubSkillSource(params) {
	if (!isDefaultClawHubBaseUrl(params.baseUrl)) return false;
	return hasOfficialClawHubFlag(params.detail?.skill) || hasOfficialClawHubFlag(params.detail?.owner) || hasOfficialClawHubFlag(params.resolution) || params.resolution?.installKind === "archive" && hasOfficialClawHubFlag(params.resolution.archive);
}
async function fetchDefaultClawHubSkillDetailIfOfficial(params) {
	if (!isDefaultClawHubBaseUrl(params.baseUrl)) return;
	try {
		const detail = await fetchClawHubSkillDetail({
			slug: params.slug,
			...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
			baseUrl: params.baseUrl
		});
		return isDefaultOfficialClawHubSkillSource({
			baseUrl: params.baseUrl,
			detail
		}) ? detail : void 0;
	} catch {
		return;
	}
}
async function resolveInstallVersion(params) {
	const detail = await fetchClawHubSkillDetail({
		slug: params.slug,
		...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
		baseUrl: params.baseUrl
	});
	if (!detail.skill) throw new Error(`Skill "${params.slug}" not found on ClawHub.`);
	const version = params.version ?? detail.latestVersion?.version;
	if (!version) throw new Error(`Skill "${params.slug}" has no installable version.`);
	return {
		detail,
		version
	};
}
function normalizeGitHubSourcePath(raw) {
	const parts = raw.replaceAll("\\", "/").split("/").filter(Boolean);
	if (parts.length === 0 || parts.some((part) => part === "." || part === "..")) throw new Error(`Invalid GitHub skill source path: ${raw}`);
	return parts.join("/");
}
function buildGitHubTreeUrl(params) {
	const [owner, name] = params.repo.split("/");
	return `https://github.com/${[
		owner,
		name,
		"tree",
		params.commit,
		...params.sourcePath ? params.sourcePath.split("/") : []
	].map(encodeURIComponent).join("/")}`;
}
function readVerifiedClawHubSkillSourceUrl(raw) {
	const provenance = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : void 0;
	if (provenance?.source !== "server-resolved-github-import") return;
	const repo = normalizeOptionalString(provenance.repo);
	const repoParts = repo?.split("/");
	const commit = normalizeGitHubCommitSegment(provenance.commit);
	if (!repo || repoParts?.length !== 2 || repoParts.some((part) => !/^[A-Za-z0-9._-]+$/.test(part)) || !commit) return;
	const pathValue = normalizeOptionalString(provenance.path);
	try {
		const sourcePath = pathValue ? normalizeGitHubSourcePath(pathValue) : void 0;
		return buildGitHubTreeUrl({
			repo,
			commit,
			...sourcePath ? { sourcePath } : {}
		});
	} catch {
		return;
	}
}
function snapshotClawHubSkillVerification(verification) {
	return {
		schema: verification.schema,
		ok: verification.ok,
		decision: verification.decision,
		reasons: [...verification.reasons],
		...verification.card !== void 0 ? { card: verification.card } : {},
		...verification.artifact !== void 0 ? { artifact: verification.artifact } : {},
		...verification.provenance !== void 0 ? { provenance: verification.provenance } : {},
		...verification.security !== void 0 ? { security: verification.security } : {},
		...verification.signature !== void 0 ? { signature: verification.signature } : {}
	};
}
async function fetchInstallVerificationLock(params) {
	try {
		return snapshotClawHubSkillVerification(await fetchClawHubSkillVerification({
			slug: params.slug,
			...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
			...params.requestedReference ? { requestedReference: params.requestedReference } : {},
			version: params.version,
			baseUrl: params.baseUrl
		}));
	} catch (err) {
		params.logger?.warn?.(`Skill verification for ${formatClawHubSkillRef(params)} failed: ${formatErrorMessage(err)}`);
		return;
	}
}
async function installDownloadedResolution(params) {
	const { github } = params;
	return await withExtractedArchiveRoot({
		archivePath: params.archivePath,
		tempDirPrefix: github ? "openclaw-skill-clawhub-github-" : "openclaw-skill-clawhub-",
		timeoutMs: 12e4,
		...github ? {} : { rootMarkers: CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS },
		onExtracted: async (rootDir) => await installExtractedSkillRoot({
			workspaceDir: params.workspaceDir,
			slug: params.slug,
			extractedRoot: github ? path.join(rootDir, ...normalizeGitHubSourcePath(github.path).split("/")) : rootDir,
			mode: params.force ? "update" : "install",
			logger: params.logger,
			expectedClawHubState: params.expectedClawHubState,
			policy: {
				config: params.config,
				onInstallPolicyWarning: params.onInstallPolicyWarning,
				installId: "clawhub",
				origin: {
					type: "clawhub",
					registry: params.registry,
					slug: params.slug,
					...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
					version: params.version,
					...github ? {
						repo: github.repo,
						path: github.path,
						commit: github.commit,
						...params.requestedReference ? { reference: params.requestedReference } : {},
						...params.trustState ? { trustState: params.trustState } : {}
					} : {}
				},
				source: {
					kind: github ? "git" : "clawhub",
					authority: params.authority,
					mutable: false,
					network: true
				},
				requestedSpecifier: (github ? params.requestedReference : void 0) ?? `clawhub:${formatClawHubSkillRef(params)}@${params.version}`
			},
			rootMarkers: CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS
		})
	});
}
function assertInstallResolutionAllowed(resolution) {
	if (!resolution.ok) {
		if (resolution.reason === "ambiguous_slug") {
			const message = resolution.message ? ` ${resolution.message}` : "";
			throw new Error(`Skill "${resolution.slug}" is ambiguous on ClawHub. Install an owner-qualified skill, for example: openclaw skills install @owner/${resolution.slug}.${message}`);
		}
		throw new Error(resolution.message || `Skill "${resolution.slug}" is not installable.`);
	}
	if (resolution.installKind !== "github") return resolution;
	const commit = normalizeGitHubCommitSegment(resolution.github.commit)?.toLowerCase();
	if (!commit) throw new Error(`Skill "${resolution.slug}" resolved to a mutable or invalid GitHub source ref; expected a full 40-character commit SHA.`);
	return {
		...resolution,
		github: {
			...resolution.github,
			commit
		}
	};
}
async function checkClawHubSkillTrust(params) {
	if (params.skipClawHubTrustCheck) return { ok: true };
	const result = await checkClawHubPackageTrust({
		subject: {
			kind: "skill",
			packageName: params.slug,
			workspaceDir: params.workspaceDir,
			...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}
		},
		version: params.version,
		baseUrl: params.baseUrl,
		logger: params.logger,
		mode: params.force ? "update" : "install",
		confirmInstall: params.confirmInstall
	});
	return result.ok ? {
		ok: true,
		...result.warning ? { warning: result.warning } : {}
	} : {
		ok: false,
		error: result.error,
		...result.code ? { code: result.code } : {},
		...result.warning ? { warning: result.warning } : {}
	};
}
async function performClawHubSkillInstall(params) {
	try {
		const expectedIntegrity = params.expectedIntegrity === void 0 ? void 0 : normalizeExpectedArtifactIntegrity(params.expectedIntegrity);
		const files = resolveWorkspaceClawHubSkills(params.workspaceDir);
		const registry = resolveClawHubBaseUrl(params.baseUrl);
		await (files?.assertClawHubSkillInstallState ?? assertClawHubSkillInstallState)({
			workspaceDir: params.workspaceDir,
			slug: params.slug,
			force: params.force
		});
		let version;
		let detail;
		let resolution;
		let trustWarning;
		let official = false;
		let archive;
		if (params.version) {
			const resolved = await resolveInstallVersion(params);
			detail = resolved.detail;
			version = resolved.version;
			official = isDefaultOfficialClawHubSkillSource({
				baseUrl: params.baseUrl,
				detail
			});
		} else {
			resolution = assertInstallResolutionAllowed(await fetchClawHubSkillInstallResolution({
				slug: params.slug,
				...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
				...params.requestedReference ? { requestedReference: params.requestedReference } : {},
				baseUrl: params.baseUrl,
				...params.forceInstall ? { forceInstall: true } : {}
			}));
			if (params.requestedReference) {
				if (resolution.installKind !== "github" || resolution.trust?.state !== "not-scanned-by-clawhub") throw new Error(`Skill "${params.slug}" did not resolve to an unscanned, commit-pinned GitHub source.`);
				trustWarning = CLAWHUB_SKILLS_SH_TRUST_LABEL;
				params.logger?.warn?.(CLAWHUB_SKILLS_SH_TRUST_LABEL);
			}
			detail = isDefaultOfficialClawHubSkillSource({
				baseUrl: params.baseUrl,
				resolution
			}) ? void 0 : await fetchDefaultClawHubSkillDetailIfOfficial({
				baseUrl: params.baseUrl,
				slug: params.slug,
				...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}
			});
			official = isDefaultOfficialClawHubSkillSource({
				baseUrl: params.baseUrl,
				detail,
				resolution
			});
			version = resolution.installKind === "github" ? resolution.github.commit : resolution.archive.version;
		}
		if (resolution?.installKind === "github") {
			params.logger?.info?.(`Downloading ${params.slug}@${version} from GitHub…`);
			archive = await downloadClawHubGitHubSkillArchive({
				repo: resolution.github.repo,
				commit: resolution.github.commit
			});
		} else {
			const trust = await checkClawHubSkillTrust({
				...params,
				version,
				skipClawHubTrustCheck: official
			});
			if (!trust.ok) return {
				...trust,
				version
			};
			trustWarning = trust.warning;
			params.logger?.info?.(`Downloading ${params.slug}@${version} from ClawHub…`);
			archive = resolution ? await downloadClawHubSkillArchiveUrl({
				url: resolution.archive.downloadUrl,
				baseUrl: params.baseUrl
			}) : await downloadClawHubSkillArchive({
				slug: params.slug,
				...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
				version,
				baseUrl: params.baseUrl
			});
		}
		try {
			if (expectedIntegrity && archive.integrity !== expectedIntegrity) throw new Error(`ClawHub archive integrity mismatch: expected ${expectedIntegrity}, got ${archive.integrity}.`);
			const github = resolution?.installKind === "github" ? resolution.github : void 0;
			const install = await installDownloadedResolution({
				...params,
				version,
				archivePath: archive.archivePath,
				registry,
				authority: official ? "official" : !github && isDefaultClawHubBaseUrl(params.baseUrl) ? "openclaw" : "third-party",
				github
			});
			if (!install.ok) return {
				ok: false,
				error: install.error,
				...install.replacementBlocked !== void 0 ? { replacementBlocked: install.replacementBlocked } : {}
			};
			const installedAt = Date.now();
			const artifact = {
				kind: archive.artifact,
				sha256: archive.sha256Hex,
				integrity: archive.integrity
			};
			const verificationVersion = github ? void 0 : version;
			const [{ skillFile, fileTreeSha256 }, verification] = await Promise.all([(files?.readInstalledClawHubSkillFiles ?? readInstalledClawHubSkillFiles)({ skillDir: install.targetDir }), fetchInstallVerificationLock({
				slug: params.slug,
				...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
				...params.requestedReference ? { requestedReference: params.requestedReference } : {},
				version: verificationVersion,
				baseUrl: params.baseUrl,
				logger: params.logger
			})]);
			const sourceUrl = (resolution?.installKind === "github" ? normalizeOptionalString(resolution.github.sourceUrl) : void 0) ?? readVerifiedClawHubSkillSourceUrl(verification?.provenance);
			const trackedMetadata = {
				...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
				...params.requestedReference ? { requestedReference: params.requestedReference } : {},
				...params.trustState ? { trustState: params.trustState } : {},
				installedAt,
				...sourceUrl ? { sourceUrl } : {},
				artifact,
				...skillFile ? { skillFile } : {},
				fileTreeSha256
			};
			await (files?.recordClawHubSkillInstall ?? recordClawHubSkillInstall)({
				workspaceDir: params.workspaceDir,
				skillDir: install.targetDir,
				origin: {
					version: 1,
					registry,
					slug: params.slug,
					...trackedMetadata,
					installedVersion: version
				},
				verification
			});
			if (!params.clawManaged) markClawPackageIndependentlyOwned({
				kind: "skill",
				source: "clawhub",
				ref: formatClawHubSkillRef(params),
				version,
				workspace: params.workspaceDir
			});
			await reportClawHubSkillInstallTelemetry({
				baseUrl: params.baseUrl,
				slug: params.slug,
				...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
				version,
				...params.requestedReference ? { requestedReference: params.requestedReference } : {},
				...params.trustState ? { trustState: params.trustState } : {}
			}).catch(() => void 0);
			return {
				ok: true,
				slug: params.slug,
				version,
				targetDir: install.targetDir,
				...detail ? { detail } : {},
				...trustWarning ? { warning: trustWarning } : {}
			};
		} finally {
			await archive.cleanup().catch(() => void 0);
		}
	} catch (err) {
		return {
			ok: false,
			error: formatClawHubSkillRequestError(err, {
				slug: params.slug,
				operation: "install"
			})
		};
	}
}
//#endregion
//#region src/skills/lifecycle/clawhub.ts
async function verifySkillWithClawHub(params) {
	try {
		return ok(await fetchClawHubSkillVerification(params));
	} catch (error) {
		return err(formatClawHubSkillRequestError(error, {
			slug: params.slug,
			operation: "verify"
		}));
	}
}
async function installRequestedSkillFromClawHub(params) {
	try {
		const ref = parseRequestedClawHubSkillRef(params.slug);
		if (ref.requestedReference && params.version) throw new Error("--version is not supported for skills-sh references.");
		return await performClawHubSkillInstall({
			...params,
			slug: ref.slug,
			...ref.ownerHandle ? { ownerHandle: ref.ownerHandle } : {},
			...ref.requestedReference ? { requestedReference: ref.requestedReference } : {},
			...ref.trustState ? { trustState: ref.trustState } : {}
		});
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
async function installTrackedSkillFromClawHub(params) {
	try {
		return await performClawHubSkillInstall({
			...params,
			slug: normalizeTrackedSkillSlug(params.slug)
		});
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
async function preflightSkillFromClawHub(params) {
	try {
		const preflightOwnerState = resolveWorkspaceClawHubSkills(params.workspaceDir)?.preflightSkillOwnerState ?? preflightSkillOwnerState;
		const requested = parseRequestedClawHubSkillRef(params.slug);
		const resolved = await resolveInstallVersion({
			slug: requested.slug,
			...requested.ownerHandle ? { ownerHandle: requested.ownerHandle } : {},
			version: params.version,
			baseUrl: params.baseUrl
		});
		if (resolved.version !== params.version) return {
			ok: false,
			code: "skill_version_resolution_mismatch",
			error: `Skill ${params.slug}@${params.version} resolved to ${resolved.version}.`
		};
		const trust = await checkClawHubSkillTrust({
			workspaceDir: params.workspaceDir,
			slug: requested.slug,
			...requested.ownerHandle ? { ownerHandle: requested.ownerHandle } : {},
			version: resolved.version,
			baseUrl: params.baseUrl,
			logger: params.logger,
			skipClawHubTrustCheck: isDefaultOfficialClawHubSkillSource({
				baseUrl: params.baseUrl,
				detail: resolved.detail
			})
		});
		if (!trust.ok) return {
			ok: false,
			code: trust.code ?? "skill_trust_required",
			error: trust.error
		};
		const preflightOwner = async (integrity) => {
			const owner = await preflightOwnerState({
				workspaceDir: params.workspaceDir,
				requested,
				requestedLabel: params.slug,
				version: resolved.version,
				integrity
			});
			return owner.ok && trust.warning ? {
				...owner,
				warning: trust.warning
			} : owner;
		};
		if (params.expectedIntegrity) return await preflightOwner(normalizeExpectedArtifactIntegrity(params.expectedIntegrity));
		const archive = await downloadClawHubSkillArchive({
			slug: requested.slug,
			...requested.ownerHandle ? { ownerHandle: requested.ownerHandle } : {},
			version: resolved.version,
			baseUrl: params.baseUrl
		});
		try {
			const integrity = normalizeClawHubSha256Integrity(archive.integrity);
			if (!integrity) return {
				ok: false,
				code: "skill_integrity_unavailable",
				error: `Skill ${params.slug}@${params.version} did not resolve a valid artifact integrity.`
			};
			return await preflightOwner(integrity);
		} finally {
			await archive.cleanup().catch(() => void 0);
		}
	} catch (err) {
		return {
			ok: false,
			code: "skill_preflight_failed",
			error: formatErrorMessage(err)
		};
	}
}
async function installSkillFromClawHub(params) {
	if (params.clawManaged) return await installRequestedSkillFromClawHub(params);
	return await withClawPackageLifecycleLease({
		kind: "skill",
		source: "clawhub",
		ref: params.slug,
		workspace: params.workspaceDir
	}, () => installRequestedSkillFromClawHub(params));
}
async function updateSkillsFromClawHub(params) {
	const tracking = resolveWorkspaceClawHubSkills(params.workspaceDir);
	const lock = await (tracking?.readClawHubSkillsLockfile ?? readClawHubSkillsLockfile)(params.workspaceDir);
	const slugs = params.slug ? [await (tracking?.resolveRequestedUpdateSlug ?? resolveRequestedUpdateSlug)({
		workspaceDir: params.workspaceDir,
		requestedSlug: params.slug,
		lock
	})] : Object.keys(lock.skills).map((slug) => normalizeTrackedSkillSlug(slug));
	const results = [];
	for (const slug of slugs) {
		const tracked = await (tracking?.resolveTrackedUpdateTarget ?? resolveTrackedUpdateTarget)({
			workspaceDir: params.workspaceDir,
			slug,
			lock,
			baseUrl: params.baseUrl
		});
		if (!tracked.ok) {
			results.push({
				ok: false,
				error: tracked.error
			});
			continue;
		}
		const install = await withClawPackageLifecycleLease({
			kind: "skill",
			source: "clawhub",
			ref: tracked.slug,
			workspace: params.workspaceDir
		}, async () => {
			let localPlan;
			if (!params.force) {
				const local = await (tracking?.guardTrackedSkillLocalState ?? guardTrackedSkillLocalState)({
					workspaceDir: params.workspaceDir,
					slug: tracked.slug,
					previousVersion: tracked.previousVersion
				});
				if (!local.ok) return {
					ok: false,
					code: "force_required",
					error: `${local.error} Updating replaces the installed skill directory.`
				};
				localPlan = local.plan;
			}
			const installed = await installTrackedSkillFromClawHub({
				workspaceDir: params.workspaceDir,
				slug: tracked.slug,
				...tracked.ownerHandle ? { ownerHandle: tracked.ownerHandle } : {},
				...tracked.requestedReference ? { requestedReference: tracked.requestedReference } : {},
				...tracked.trustState ? { trustState: tracked.trustState } : {},
				baseUrl: tracked.baseUrl,
				force: true,
				forceInstall: params.forceInstall,
				logger: params.logger,
				config: params.config,
				onInstallPolicyWarning: params.onInstallPolicyWarning,
				...params.force ? {} : { expectedClawHubState: localPlan ?? null }
			});
			if (!installed.ok && installed.replacementBlocked) return {
				ok: false,
				code: "force_required",
				error: installed.replacementBlocked
			};
			return installed;
		});
		results.push(install.ok ? {
			ok: true,
			slug: tracked.slug,
			previousVersion: tracked.previousVersion,
			version: install.version,
			changed: tracked.previousVersion !== install.version,
			targetDir: install.targetDir,
			...install.warning ? { warning: install.warning } : {}
		} : install);
	}
	return results;
}
//#endregion
export { readVerifiedClawHubSkillSourceUrl as a, verifySkillWithClawHub as i, preflightSkillFromClawHub as n, updateSkillsFromClawHub as r, installSkillFromClawHub as t };
