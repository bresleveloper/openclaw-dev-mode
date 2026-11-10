import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as readFileDescriptorBoundedSync, o as openRootFileSync } from "./boundary-file-read-CCth2Hwg.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { d as pathExists } from "./fs-safe-6Z4UiMS4.mjs";
import { v as resolveClawHubBaseUrl } from "./clawhub-client-D1-XpvK5.mjs";
import { d as searchClawHubSkills, r as CLAWHUB_SKILLS_SH_TRUST_STATE } from "./clawhub-skills-D--udhAy.mjs";
import { n as resolveWorkspaceSkillInstallDir, r as validateRequestedSkillSlug, t as normalizeTrackedSkillSlug } from "./install-paths-CdlkBGI2.mjs";
import { a as normalizeDownloadedArtifactLock, c as normalizeStoredRegistry, d as readClawHubSkillOriginStatusSync, f as readClawHubSkillOriginStrict, l as parseRequestedClawHubSkillRef, m as readClawHubSkillsLockfileStatusSync, p as readClawHubSkillsLockfile, r as describeClawHubSkillRefMismatch, s as normalizeSkillFileLock, u as readClawHubSkillOrigin, y as resolveWorkspaceClawHubSkills } from "./clawhub-store-DrAcibyA.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/skills/lifecycle/clawhub-status.ts
const LOCAL_SKILL_CARD_FILENAME = "skill-card.md";
const LOCAL_SKILL_CARD_MAX_BYTES = 262144;
function readRealPathSync(candidate) {
	try {
		return fs.realpathSync.native(candidate);
	} catch {
		return;
	}
}
function invalidLink(reason, details) {
	return {
		status: "invalid",
		valid: false,
		reason,
		...details
	};
}
function resolveClawHubSkillStatusLinkSync(params) {
	const originRead = readClawHubSkillOriginStatusSync(params.skillDir);
	const lockRead = params.lockRead ?? readClawHubSkillsLockfileStatusSync(params.workspaceDir);
	const lockfileLabel = `${params.lockfileScope ?? "workspace"} ClawHub lockfile`;
	if (originRead.kind === "missing") {
		let trackedSlug;
		try {
			trackedSlug = normalizeTrackedSkillSlug(params.skillKey);
		} catch {
			return;
		}
		const locked = lockRead.kind === "found" ? lockRead.lock.skills[trackedSlug] : void 0;
		if (!locked) return;
		return invalidLink(`Skill "${trackedSlug}" is tracked by the ${lockfileLabel} but is missing local ClawHub origin metadata.`, {
			slug: trackedSlug,
			installedVersion: locked.version,
			installedAt: locked.installedAt,
			registry: normalizeStoredRegistry(locked.registry ?? resolveClawHubBaseUrl()),
			lockPath: lockRead.kind === "found" ? lockRead.path : void 0
		});
	}
	if (originRead.kind === "malformed") return invalidLink(`Malformed ClawHub origin metadata at ${originRead.path}: ${originRead.error}`, {
		originPath: originRead.path,
		lockPath: lockRead.kind === "found" ? lockRead.path : void 0
	});
	const originDetails = {
		registry: originRead.origin.registry,
		installedVersion: originRead.origin.installedVersion,
		installedAt: originRead.origin.installedAt,
		originPath: originRead.path
	};
	let trackedSlug;
	try {
		trackedSlug = normalizeTrackedSkillSlug(originRead.origin.slug);
	} catch (err) {
		return invalidLink(`Invalid ClawHub origin slug "${originRead.origin.slug}": ${formatErrorMessage(err)}`, {
			...originDetails,
			slug: originRead.origin.slug,
			lockPath: lockRead.kind === "found" ? lockRead.path : void 0
		});
	}
	const invalid = (reason, registry = originDetails.registry) => invalidLink(reason, {
		...originDetails,
		registry,
		slug: trackedSlug,
		...lockRead.kind === "missing" ? {} : { lockPath: lockRead.path }
	});
	if (lockRead.kind === "missing") return invalid(`Skill "${trackedSlug}" has ClawHub origin metadata but is not tracked by the ${lockfileLabel}.`);
	if (lockRead.kind === "malformed") return invalid(`Malformed ${lockfileLabel} at ${lockRead.path}: ${lockRead.error}`);
	const locked = lockRead.lock.skills[trackedSlug];
	if (!locked) return invalid(`Skill "${trackedSlug}" has ClawHub origin metadata but is not tracked by the ${lockfileLabel}.`);
	const expectedSkillDir = readRealPathSync(resolveWorkspaceSkillInstallDir(params.workspaceDir, trackedSlug));
	if (!expectedSkillDir || readRealPathSync(params.skillDir) !== expectedSkillDir) return invalid(`Skill "${trackedSlug}" ClawHub origin metadata is not in the expected ClawHub install directory.`);
	const originRegistry = originRead.origin.registry;
	const lockedRegistry = locked.registry === void 0 ? originRegistry : normalizeStoredRegistry(locked.registry);
	const sourceUrl = normalizeOptionalString(locked.sourceUrl);
	const ownerHandle = normalizeOptionalString(locked.ownerHandle);
	const requestedReference = normalizeOptionalString(locked.requestedReference);
	const trustState = locked.trustState === "not-scanned-by-clawhub" ? CLAWHUB_SKILLS_SH_TRUST_STATE : void 0;
	const artifact = normalizeDownloadedArtifactLock(locked.artifact);
	const skillFile = normalizeSkillFileLock(locked.skillFile);
	const fileTreeSha256 = normalizeOptionalString(locked.fileTreeSha256);
	const provenanceMatches = originRead.origin.ownerHandle === ownerHandle && originRead.origin.requestedReference === requestedReference && originRead.origin.trustState === trustState && originRead.origin.sourceUrl === sourceUrl && originRead.origin.artifact?.kind === artifact?.kind && originRead.origin.artifact?.sha256 === artifact?.sha256 && originRead.origin.artifact?.integrity === artifact?.integrity && originRead.origin.skillFile?.path === skillFile?.path && originRead.origin.skillFile?.sha256 === skillFile?.sha256 && originRead.origin.fileTreeSha256 === fileTreeSha256;
	if (locked.version !== originRead.origin.installedVersion || locked.installedAt !== originRead.origin.installedAt || lockedRegistry !== originRegistry || !provenanceMatches) return invalid(`Skill "${trackedSlug}" ClawHub origin metadata does not match the ${lockfileLabel}.`, lockedRegistry);
	const { version: _version, ...origin } = originRead.origin;
	return {
		...origin,
		status: "linked",
		valid: true,
		registry: lockedRegistry,
		slug: trackedSlug,
		originPath: originRead.path,
		lockPath: lockRead.path
	};
}
function readLocalSkillCardSync(skillDir, includeContent = false) {
	const cardPath = path.join(skillDir, LOCAL_SKILL_CARD_FILENAME);
	let fd;
	try {
		const opened = openRootFileSync({
			absolutePath: cardPath,
			rootPath: skillDir,
			boundaryLabel: "skill directory",
			maxBytes: LOCAL_SKILL_CARD_MAX_BYTES,
			rejectHardlinks: false
		});
		if (!opened.ok) return;
		fd = opened.fd;
		const result = {
			present: true,
			path: cardPath,
			sizeBytes: opened.stat.size
		};
		if (includeContent) result.content = readFileDescriptorBoundedSync(fd, LOCAL_SKILL_CARD_MAX_BYTES).toString("utf8");
		return result;
	} catch {
		return;
	} finally {
		if (fd !== void 0) try {
			fs.closeSync(fd);
		} catch {}
	}
}
function resolveLocalSkillCardStatusSync(skillDir) {
	return readLocalSkillCardSync(skillDir);
}
function readLocalSkillCardContentSync(skillDir) {
	return readLocalSkillCardSync(skillDir, true)?.content;
}
async function searchSkillsFromClawHub(params) {
	return await searchClawHubSkills({
		query: params.query?.trim() ?? "",
		limit: params.limit,
		baseUrl: params.baseUrl
	});
}
async function resolveClawHubSkillVerificationTarget(params) {
	try {
		const tracking = resolveWorkspaceClawHubSkills(params.workspaceDir);
		if (tracking) return await tracking.resolveClawHubSkillVerificationTarget({
			...params,
			baseUrl: resolveClawHubBaseUrl(params.baseUrl)
		});
		const version = normalizeOptionalString(params.version);
		const tag = normalizeOptionalString(params.tag);
		if (version && tag) return {
			ok: false,
			error: "Use either --version or --tag."
		};
		const requestedRef = parseRequestedClawHubSkillRef(params.slug);
		if (requestedRef.requestedReference && (version || tag)) return {
			ok: false,
			error: "--version and --tag are not supported for skills-sh references."
		};
		const trackedSlug = requestedRef.slug;
		const skillDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, trackedSlug);
		const originRead = await readClawHubSkillOriginStrict(skillDir);
		if (originRead.kind === "malformed") return {
			ok: false,
			error: `Malformed ClawHub origin metadata at ${originRead.path}: ${originRead.error}`
		};
		if (originRead.kind === "found") {
			const locked = (await readClawHubSkillsLockfile(params.workspaceDir)).skills[trackedSlug];
			if (!locked) return {
				ok: false,
				error: `Skill "${trackedSlug}" has ClawHub origin metadata but is not tracked by the workspace ClawHub lockfile. Reinstall it from ClawHub before verifying it as an installed ClawHub skill.`
			};
			if (normalizeTrackedSkillSlug(originRead.origin.slug) !== trackedSlug) return {
				ok: false,
				error: `Skill "${trackedSlug}" has ClawHub origin metadata for "${originRead.origin.slug}". Reinstall it from ClawHub before verifying it as an installed ClawHub skill.`
			};
			const originRegistry = originRead.origin.registry;
			const lockedRegistry = locked.registry === void 0 ? originRegistry : normalizeStoredRegistry(locked.registry);
			const ownerHandle = normalizeOptionalString(locked.ownerHandle);
			const requestedReference = normalizeOptionalString(locked.requestedReference);
			const trustState = locked.trustState === "not-scanned-by-clawhub" ? CLAWHUB_SKILLS_SH_TRUST_STATE : void 0;
			if (locked.version !== originRead.origin.installedVersion || locked.installedAt !== originRead.origin.installedAt || lockedRegistry !== originRegistry || originRead.origin.ownerHandle !== ownerHandle || originRead.origin.requestedReference !== requestedReference || originRead.origin.trustState !== trustState) return {
				ok: false,
				error: `Skill "${trackedSlug}" ClawHub origin metadata does not match the workspace ClawHub lockfile. Reinstall it from ClawHub before verifying it as an installed ClawHub skill.`
			};
			if (requestedReference && (version || tag)) return {
				ok: false,
				error: "--version and --tag are not supported for skills-sh references."
			};
			const mismatch = describeClawHubSkillRefMismatch(requestedRef, {
				ownerHandle,
				requestedReference
			});
			if (mismatch) return {
				ok: false,
				error: mismatch
			};
			const selector = version ? "version" : tag ? "tag" : "installed-version";
			const verificationVersion = requestedReference ? void 0 : version ?? (tag ? void 0 : locked.version);
			return {
				ok: true,
				slug: trackedSlug,
				...ownerHandle ? { ownerHandle } : {},
				...requestedReference ? { requestedReference } : {},
				...trustState ? { trustState } : {},
				baseUrl: lockedRegistry,
				version: verificationVersion,
				tag: requestedReference ? void 0 : tag,
				resolution: {
					source: "installed",
					selector,
					registry: lockedRegistry,
					skillDir,
					installedVersion: locked.version
				}
			};
		}
		const lockRead = readClawHubSkillsLockfileStatusSync(params.workspaceDir);
		if (lockRead.kind === "malformed") return {
			ok: false,
			error: `Malformed workspace ClawHub lockfile at ${lockRead.path}: ${lockRead.error}`
		};
		if (lockRead.kind === "found" && lockRead.lock.skills[trackedSlug]) return {
			ok: false,
			error: `Skill "${trackedSlug}" is tracked by the workspace ClawHub lockfile but is missing ClawHub origin metadata. Reinstall it from ClawHub before verifying it as an installed ClawHub skill.`
		};
		const registry = resolveClawHubBaseUrl(params.baseUrl);
		const selector = version ? "version" : tag ? "tag" : "latest";
		return {
			ok: true,
			...requestedRef,
			baseUrl: registry,
			version,
			tag,
			resolution: {
				source: "registry",
				selector,
				registry,
				skillDir: void 0,
				installedVersion: void 0
			}
		};
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
async function preflightSkillOwnerState(params) {
	const targetDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, params.requested.slug);
	if (!await pathExists(targetDir)) return {
		ok: true,
		action: "install",
		integrity: params.integrity
	};
	const status = resolveClawHubSkillStatusLinkSync({
		workspaceDir: params.workspaceDir,
		skillDir: targetDir,
		skillKey: params.requested.slug
	});
	if (status?.status === "linked" && status.installedVersion === params.version && status.ownerHandle === params.requested.ownerHandle && status.artifact?.integrity === params.integrity) return {
		ok: true,
		action: "reuse",
		integrity: params.integrity
	};
	return {
		ok: false,
		code: "skill_version_conflict",
		error: `Skill ${params.requestedLabel}@${params.version} conflicts with the existing workspace skill at ${targetDir}.`
	};
}
async function resolveRequestedUpdateSlug(params) {
	const requested = params.requestedSlug.trim();
	const requestedRef = requested.startsWith("@") || requested.startsWith("skills-sh:") ? parseRequestedClawHubSkillRef(requested) : { slug: normalizeTrackedSkillSlug(requested) };
	const trackedSlug = requestedRef.slug;
	const trackedOrigin = await readClawHubSkillOrigin(resolveWorkspaceSkillInstallDir(params.workspaceDir, trackedSlug));
	const trackedLockEntry = params.lock.skills[trackedSlug];
	if (!trackedOrigin && !trackedLockEntry) return validateRequestedSkillSlug(requestedRef.slug);
	const mismatch = describeClawHubSkillRefMismatch(requestedRef, {
		ownerHandle: trackedOrigin?.ownerHandle ?? trackedLockEntry?.ownerHandle,
		requestedReference: trackedOrigin?.requestedReference ?? trackedLockEntry?.requestedReference
	});
	if (mismatch) throw new Error(mismatch);
	return trackedSlug;
}
async function resolveTrackedUpdateTarget(params) {
	const origin = await readClawHubSkillOrigin(resolveWorkspaceSkillInstallDir(params.workspaceDir, params.slug));
	const lockEntry = params.lock.skills[params.slug];
	if (!origin && !lockEntry) return {
		ok: false,
		slug: params.slug,
		error: `Skill "${params.slug}" is not tracked as a ClawHub install.`
	};
	const ownerHandle = origin?.ownerHandle ?? lockEntry?.ownerHandle;
	const requestedReference = origin?.requestedReference ?? lockEntry?.requestedReference;
	const trustState = origin?.trustState ?? lockEntry?.trustState;
	return {
		ok: true,
		slug: params.slug,
		...ownerHandle ? { ownerHandle } : {},
		...requestedReference ? { requestedReference } : {},
		...trustState ? { trustState } : {},
		baseUrl: origin?.registry ?? params.baseUrl,
		previousVersion: origin?.installedVersion ?? lockEntry?.version ?? null
	};
}
//#endregion
export { resolveLocalSkillCardStatusSync as a, searchSkillsFromClawHub as c, resolveClawHubSkillVerificationTarget as i, readLocalSkillCardContentSync as n, resolveRequestedUpdateSlug as o, resolveClawHubSkillStatusLinkSync as r, resolveTrackedUpdateTarget as s, preflightSkillOwnerState as t };
