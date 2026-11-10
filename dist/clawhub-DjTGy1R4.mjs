import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { n as normalizeClawHubSha256Integrity } from "./clawhub-integrity-BjGrym7l.mjs";
import { o as isDefaultClawHubBaseUrl, t as ClawHubRequestError, v as resolveClawHubBaseUrl } from "./clawhub-client-D1-XpvK5.mjs";
import { l as fetchClawHubSkillVerification, n as CLAWHUB_SKILLS_SH_TRUST_LABEL, o as fetchClawHubSkillDetail, s as fetchClawHubSkillInstallResolution, u as reportClawHubSkillInstallTelemetry } from "./clawhub-skills-D--udhAy.mjs";
import { t as normalizeTrackedSkillSlug } from "./install-paths-CdlkBGI2.mjs";
import { _ as recordClawHubSkillInstall, h as readInstalledClawHubSkillFiles, i as formatClawHubSkillRef, l as parseRequestedClawHubSkillRef, n as clawHubSkillLockEntry, o as normalizeGitHubCommitSegment, p as readClawHubSkillsLockfile, t as assertClawHubSkillInstallState, v as replaceClawHubSkillLockEntryExpected, y as resolveWorkspaceClawHubSkills } from "./clawhub-store-DrAcibyA.mjs";
import { o as resolveRequestedUpdateSlug, r as resolveClawHubSkillStatusLinkSync, s as resolveTrackedUpdateTarget, t as preflightSkillOwnerState } from "./clawhub-status-DjGpJ2Qf.mjs";
import { i as downloadClawHubSkillArchiveUrl, r as downloadClawHubSkillArchive, t as downloadClawHubGitHubSkillArchive } from "./clawhub-artifacts-BdAsKV4E.mjs";
import { r as checkClawHubPackageTrust } from "./clawhub-install-trust-BOwMNTuQ.mjs";
import { t as markClawPackageIndependentlyOwned } from "./claw-package-adoption-B3bRQHv3.mjs";
import { r as withClawPackageLifecycleLease } from "./claw-package-lifecycle-lease-B4yQpyhV.mjs";
import { n as guardTrackedSkillLocalState, r as planClawHubSkillUninstall } from "./clawhub-uninstall-BjVN6-tk.mjs";
import { n as withExtractedArchiveRoot } from "./install-flow-BW-XNoSb.mjs";
import { r as installExtractedSkillRoot, t as CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS } from "./archive-install-C2hZs-1d.mjs";
import path from "node:path";
//#region src/skills/lifecycle/clawhub-install-rollback.ts
async function rollbackDeferredSkillInstall(params) {
	if (!params.assertCurrent) throw new Error("Deferred skill rollback requires a live owner guard.");
	params.assertCurrent();
	const current = (await readClawHubSkillsLockfile(params.workspaceDir)).skills[params.slug];
	const hasInstalledEntry = params.installed && stableStringify(current) === stableStringify(params.installed);
	if (!hasInstalledEntry && stableStringify(current) !== stableStringify(params.previous)) throw new Error(`Skill ${JSON.stringify(params.slug)} tracking changed during rollback.`);
	if (params.verifyInstalled) {
		if (!hasInstalledEntry) throw new Error(`Skill ${JSON.stringify(params.slug)} tracking changed during rollback.`);
		const targetDir = path.join(params.workspaceDir, "skills", params.slug);
		const link = resolveClawHubSkillStatusLinkSync({
			workspaceDir: params.workspaceDir,
			skillDir: targetDir,
			skillKey: params.slug
		});
		const planned = await planClawHubSkillUninstall({
			workspaceDir: params.workspaceDir,
			slug: params.slug,
			expectedVersion: params.version
		});
		if (!link?.valid || link.artifact?.integrity !== params.integrity || !planned.ok) throw new Error(`Skill ${JSON.stringify(params.slug)} changed after its Claw upgrade.`);
	}
	await params.transaction.rollback(params.assertCurrent);
	if (hasInstalledEntry && params.installed) replaceClawHubSkillLockEntryExpected({
		workspaceDir: params.workspaceDir,
		slug: params.slug,
		expected: params.installed,
		replacement: params.previous,
		assertCurrent: params.assertCurrent
	});
}
//#endregion
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
const log = createSubsystemLogger("skills");
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
		return `https://github.com/${[
			...repoParts,
			"tree",
			commit,
			...sourcePath?.split("/") ?? []
		].map(encodeURIComponent).join("/")}`;
	} catch {
		return;
	}
}
async function fetchInstallVerificationLock(params) {
	try {
		const verification = await fetchClawHubSkillVerification({
			slug: params.slug,
			...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
			...params.requestedReference ? { requestedReference: params.requestedReference } : {},
			version: params.version,
			baseUrl: params.baseUrl
		});
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
	} catch (err) {
		params.logger?.warn?.(`Skill verification for ${formatClawHubSkillRef(params)} failed: ${formatErrorMessage(err)}`);
		return;
	}
}
var ClawHubSkillRecoveryError = class extends Error {};
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
		confirmOnUpdate: params.clawManaged === true,
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
		if (params.deferCommit && (!params.clawManaged || !params.force || !params.expectedClawHubState || !params.assertOwned)) throw new Error("Deferred skill replacement requires a guarded Claw-managed update.");
		const files = resolveWorkspaceClawHubSkills(params.workspaceDir);
		const registry = resolveClawHubBaseUrl(params.baseUrl);
		await (files?.assertClawHubSkillInstallState ?? assertClawHubSkillInstallState)({
			workspaceDir: params.workspaceDir,
			slug: params.slug,
			force: params.force
		});
		const previousLockEntry = params.deferCommit ? (await readClawHubSkillsLockfile(params.workspaceDir)).skills[params.slug] : void 0;
		if (params.deferCommit && !previousLockEntry) throw new Error(`Skill ${JSON.stringify(params.slug)} has no tracked ClawHub lock entry.`);
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
			const resolved = await fetchClawHubSkillInstallResolution({
				slug: params.slug,
				...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
				...params.requestedReference ? { requestedReference: params.requestedReference } : {},
				baseUrl: params.baseUrl,
				...params.forceInstall ? { forceInstall: true } : {}
			});
			if (!resolved.ok) {
				if (resolved.reason === "ambiguous_slug") {
					const message = resolved.message ? ` ${resolved.message}` : "";
					throw new Error(`Skill "${resolved.slug}" is ambiguous on ClawHub. Install an owner-qualified skill, for example: openclaw skills install @owner/${resolved.slug}.${message}`);
				}
				throw new Error(resolved.message || `Skill "${resolved.slug}" is not installable.`);
			}
			resolution = resolved;
			if (resolution.installKind === "github") {
				const commit = normalizeGitHubCommitSegment(resolution.github.commit)?.toLowerCase();
				if (!commit) throw new Error(`Skill "${resolution.slug}" resolved to a mutable or invalid GitHub source ref; expected a full 40-character commit SHA.`);
				resolution = {
					...resolution,
					github: {
						...resolution.github,
						commit
					}
				};
			}
			if (params.requestedReference) {
				if (resolution.installKind !== "github" || resolution.trust?.state !== "not-scanned-by-clawhub") throw new Error(`Skill "${params.slug}" did not resolve to an unscanned, commit-pinned GitHub source.`);
				trustWarning = CLAWHUB_SKILLS_SH_TRUST_LABEL;
				params.logger?.warn?.(CLAWHUB_SKILLS_SH_TRUST_LABEL);
			}
			if (!isDefaultOfficialClawHubSkillSource({
				baseUrl: params.baseUrl,
				resolution
			}) && isDefaultClawHubBaseUrl(params.baseUrl)) {
				const request = {
					baseUrl: params.baseUrl,
					slug: params.slug,
					...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}
				};
				try {
					const candidate = await fetchClawHubSkillDetail(request);
					detail = isDefaultOfficialClawHubSkillSource({
						baseUrl: request.baseUrl,
						detail: candidate
					}) ? candidate : void 0;
				} catch {
					detail = void 0;
				}
			}
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
			const authority = official ? "official" : !github && isDefaultClawHubBaseUrl(params.baseUrl) ? "openclaw" : "third-party";
			const installParams = { ...params };
			const install = await withExtractedArchiveRoot({
				archivePath: archive.archivePath,
				tempDirPrefix: github ? "openclaw-skill-clawhub-github-" : "openclaw-skill-clawhub-",
				timeoutMs: 12e4,
				...github ? {} : { rootMarkers: CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS },
				onExtracted: async (rootDir) => {
					const result = await installExtractedSkillRoot({
						workspaceDir: installParams.workspaceDir,
						slug: installParams.slug,
						extractedRoot: github ? path.join(rootDir, ...normalizeGitHubSourcePath(github.path).split("/")) : rootDir,
						mode: installParams.force ? "update" : "install",
						beforePersistentApply: installParams.beforePersistentApply,
						assertOwned: installParams.assertOwned,
						deferCommit: installParams.deferCommit,
						logger: installParams.logger,
						expectedClawHubState: installParams.expectedClawHubState,
						policy: {
							config: installParams.config,
							onInstallPolicyWarning: installParams.onInstallPolicyWarning,
							installId: "clawhub",
							origin: {
								type: "clawhub",
								registry,
								slug: installParams.slug,
								...installParams.ownerHandle ? { ownerHandle: installParams.ownerHandle } : {},
								version,
								...github ? {
									repo: github.repo,
									path: github.path,
									commit: github.commit,
									...installParams.requestedReference ? { reference: installParams.requestedReference } : {},
									...installParams.trustState ? { trustState: installParams.trustState } : {}
								} : {}
							},
							source: {
								kind: github ? "git" : "clawhub",
								authority,
								mutable: false,
								network: true
							},
							requestedSpecifier: (github ? installParams.requestedReference : void 0) ?? `clawhub:${formatClawHubSkillRef(installParams)}@${version}`
						},
						rootMarkers: CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS
					});
					return result.ok ? result : {
						ok: false,
						error: result.error,
						...result.replacementBlocked !== void 0 ? { replacementBlocked: result.replacementBlocked } : {}
					};
				}
			});
			if (!install.ok) return {
				ok: false,
				error: install.error,
				..."replacementBlocked" in install && typeof install.replacementBlocked === "string" ? { replacementBlocked: install.replacementBlocked } : {},
				..."recoveryIncomplete" in install && install.recoveryIncomplete ? { recoveryIncomplete: true } : {}
			};
			const directoryTransaction = install.transaction;
			if (params.deferCommit && !directoryTransaction) return {
				ok: false,
				error: "Transactional skill replacement did not return a receipt.",
				recoveryIncomplete: true
			};
			let installedLockEntry;
			try {
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
				const origin = {
					version: 1,
					registry,
					slug: params.slug,
					...trackedMetadata,
					installedVersion: version
				};
				installedLockEntry = clawHubSkillLockEntry(origin, verification);
				await (files?.recordClawHubSkillInstall ?? recordClawHubSkillInstall)({
					workspaceDir: params.workspaceDir,
					skillDir: install.targetDir,
					origin,
					verification,
					beforePersistentApply: params.beforePersistentApply
				});
				const refreshDiscovery = async () => {
					try {
						const { refreshSkillsDiscovery } = await import("./refresh-C3a1Ipyv.mjs");
						await refreshSkillsDiscovery({
							workspaceDir: params.workspaceDir,
							config: params.config
						});
					} catch (error) {
						log.warn(`Skill metadata saved, but discovery refresh failed: ${formatErrorMessage(error)}`);
					}
				};
				if (!directoryTransaction) await refreshDiscovery();
				if (!params.clawManaged) await markClawPackageIndependentlyOwned({
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
					...trustWarning ? { warning: trustWarning } : {},
					...directoryTransaction && previousLockEntry && installedLockEntry ? { transaction: {
						commit: async (assertCurrent) => {
							await directoryTransaction.commit(assertCurrent);
							await refreshDiscovery();
						},
						rollback: (assertCurrent) => rollbackDeferredSkillInstall({
							workspaceDir: params.workspaceDir,
							slug: params.slug,
							version,
							integrity: archive.integrity,
							previous: previousLockEntry,
							installed: installedLockEntry,
							transaction: directoryTransaction,
							verifyInstalled: true,
							assertCurrent: assertCurrent ?? params.assertOwned
						})
					} } : {}
				};
			} catch (error) {
				if (directoryTransaction && previousLockEntry) try {
					await rollbackDeferredSkillInstall({
						workspaceDir: params.workspaceDir,
						slug: params.slug,
						version,
						integrity: archive.integrity,
						previous: previousLockEntry,
						installed: installedLockEntry,
						transaction: directoryTransaction,
						verifyInstalled: false,
						assertCurrent: params.assertOwned
					});
				} catch (recoveryError) {
					throw new ClawHubSkillRecoveryError(`${formatErrorMessage(error)}; rollback incomplete: ${formatErrorMessage(recoveryError)}`, { cause: new AggregateError([error, recoveryError]) });
				}
				throw error;
			}
		} finally {
			await archive.cleanup().catch(() => void 0);
		}
	} catch (err) {
		return {
			ok: false,
			error: formatClawHubSkillRequestError(err, {
				slug: params.slug,
				operation: "install"
			}),
			...err instanceof ClawHubSkillRecoveryError ? { recoveryIncomplete: true } : {}
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
async function installClawHubSkillReference(params, referenceKind) {
	try {
		const ref = referenceKind === "tracked" ? { slug: normalizeTrackedSkillSlug(params.slug) } : parseRequestedClawHubSkillRef(params.slug);
		if (ref.requestedReference && params.version) throw new Error("--version is not supported for skills-sh references.");
		return await performClawHubSkillInstall({
			...params,
			...ref
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
			return {
				...await preflightOwnerState({
					workspaceDir: params.workspaceDir,
					requested,
					requestedLabel: params.slug,
					version: resolved.version,
					integrity
				}),
				integrity,
				...trust.warning ? { warning: trust.warning } : {}
			};
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
	if (params.clawManaged) return await installClawHubSkillReference(params, "requested");
	return await withClawPackageLifecycleLease({
		kind: "skill",
		source: "clawhub",
		ref: params.slug,
		workspace: params.workspaceDir
	}, () => installClawHubSkillReference(params, "requested"));
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
			const installed = await installClawHubSkillReference({
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
			}, "tracked");
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
