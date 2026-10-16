import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { t as SkillLibraryError } from "./skill-library-error-z-Nwz4n5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { _ as validateSkillsLibraryMutateParams, b as validateSkillsLibraryUploadParams, g as validateSkillsLibraryListParams, h as validateSkillsLibraryImportParams, m as validateSkillsLibraryActivateParams, r as SKILL_LIBRARY_MAX_FILE_BYTES, t as SKILL_LIBRARY_MAX_BUNDLE_BYTES, v as validateSkillsLibraryReadParams, y as validateSkillsLibrarySaveParams } from "./skill-library-Bgib5R_8.mjs";
import { t as evaluateSkillInstallPolicy } from "./install-security-scan-BOi6d7N8.mjs";
import { s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { a as prepareSkillLibraryBundle, c as readSkillLibraryTree, l as skillLibraryRevisionDir, r as decodeSkillLibraryFile, s as readSkillLibraryManifestTree, t as SKILL_LIBRARY_MAX_TREE_ENTRIES, u as stageSkillLibraryBundle } from "./bundle-Cu4zt9nj.mjs";
import { c as captureSkillLibraryAccess, r as changeSkillLibrarySelection, t as assertPreparedSkillLibrarySelection } from "./selection-Cr4O9thc.mjs";
import { n as assertSkillLibraryRevision } from "./store-BeSK43aH.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { _ as resolveSessionSharingTarget, s as authorizeSessionSharingTarget } from "./session-sharing-policy-4QkIpHi4.mjs";
import { t as resolveSessionMutationAuthorization } from "./session-sharing-t7UPtrZq.mjs";
import { n as scanProposalBundle, t as assertProposalContainsNoLiteralSecrets } from "./proposal-scan-DES6jber.mjs";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-BbxQNnS-.mjs";
import { n as withExtractedArchiveRoot } from "./install-flow-3Ckr_bLy.mjs";
import { t as installSkillFromClawHub } from "./clawhub-BHIpTBF4.mjs";
import { t as skillLibraryReceipt } from "./receipt-DmfbA7G3.mjs";
import { a as captureGatewayClientUploadCommitGuard } from "./upload-policy-B7cW3IFl.mjs";
import { n as defineValidatedGatewayHandler } from "./validation-Bu27N0nv.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { withTempWorkspace } from "@openclaw/fs-safe/temp";
//#region src/skills/library/service.ts
/** Prepared at human ingress without host database access. */
async function resolveSkillLibraryPresentation(authority, options = {}) {
	return (await captureSkillLibraryAccess(authority, options).read("presentation", void 0)).value;
}
async function listSkillLibrary(authority, params = {}, options = {}) {
	return (await captureSkillLibraryAccess(authority, options).read("list", params)).value;
}
async function readSkillLibrary(authority, skillId, revision, options = {}, selected) {
	const access = captureSkillLibraryAccess(authority, options);
	selected?.assertSessionAccess();
	const prepared = await access.read("read", {
		skillId,
		revision,
		selectedRevision: selected?.revision
	});
	selected?.assertSessionAccess();
	const result = prepared.value;
	const files = await readSkillLibraryManifestTree(skillLibraryRevisionDir(skillId, result.entry.revision, access.options.env), result.manifestJson, result.entry.revision);
	prepared.assertCurrent();
	selected?.assertSessionAccess();
	return {
		entry: result.entry,
		revisions: result.revisions,
		content: decodeSkillLibraryFile(files.find((file) => file.path === "SKILL.md")).toString("utf8"),
		files: files.filter((file) => file.path !== "SKILL.md")
	};
}
async function saveSkillLibrary(authority, params, options = {}, uploadId) {
	if (!validateSkillsLibrarySaveParams(params)) throw new SkillLibraryError("INVALID_BUNDLE", "Invalid skill save parameters.");
	const access = captureSkillLibraryAccess(authority, options);
	await access.read("profile", void 0);
	const previous = params.skillId ? (await access.read("entry", {
		skillId: params.skillId,
		write: true
	})).value : void 0;
	if (params.skillId && !previous) throw new SkillLibraryError("NOT_FOUND", "Skill not found.");
	if (previous) assertSkillLibraryRevision(previous, params.expectedRevision);
	else if (params.expectedRevision !== null) throw new SkillLibraryError("CONFLICT", "A new skill requires expectedRevision: null.");
	const bundle = prepareSkillLibraryBundle([{
		path: "SKILL.md",
		content: params.content
	}, ...params.files ?? []]);
	const skillId = params.skillId ?? uploadId ?? randomUUID();
	const scan = scanProposalBundle(params.content, bundle.files.filter((file) => file.path !== "SKILL.md").map((file) => ({
		path: file.path,
		content: file.bytes.toString("utf8"),
		sizeBytes: file.sizeBytes,
		hash: file.sha256
	})));
	assertProposalContainsNoLiteralSecrets(scan);
	if (scan.critical > 0) throw new SkillLibraryError("POLICY_BLOCKED", "Skill security scan found critical issues. Review the instructions and support files before publishing.");
	const staged = await stageSkillLibraryBundle(skillId, bundle, access.options.env, authority.assertFileMutationAllowed);
	try {
		const policy = await evaluateSkillInstallPolicy({
			config: authority.getConfig(),
			installId: "library",
			logger: {},
			origin: { type: "skill-library" },
			source: {
				kind: "local-path",
				authority: "user",
				mutable: false,
				network: false
			},
			skillName: params.slug,
			sourceDir: staged.staging,
			mode: previous ? "update" : "install"
		});
		if (policy?.blocked) throw new SkillLibraryError("POLICY_BLOCKED", policy.blocked.reason);
		access.assertCurrent();
		await staged.publish();
		return await access.write("skillLibrary.publish", {
			params: {
				skillId: params.skillId,
				slug: params.slug,
				expectedRevision: params.expectedRevision
			},
			skillId,
			uploadId,
			bundle: {
				revision: bundle.revision,
				description: bundle.description,
				filesJson: JSON.stringify(bundle.files.map(({ bytes: _bytes, ...file }) => file))
			}
		});
	} finally {
		await staged.cleanup();
	}
}
async function mutateSkillLibrary(authority, params, options = {}) {
	return captureSkillLibraryAccess(authority, options).write("skillLibrary.mutate", { params });
}
//#endregion
//#region src/skills/library/import.ts
async function publishDirectory(authority, slug, directory, options, uploadId) {
	const files = await readSkillLibraryTree(directory);
	prepareSkillLibraryBundle(files);
	const markdown = files.find((file) => file.path === "SKILL.md");
	return saveSkillLibrary(authority, {
		slug,
		expectedRevision: null,
		content: Buffer.from(markdown.content, "base64").toString("utf8"),
		files: files.filter((file) => file !== markdown && !/^\.(?:clawhub|clawdhub)\//u.test(file.path))
	}, options, uploadId);
}
/** Imports through the existing source policy/verification flow into private temporary artifacts. */
async function importSkillLibrary(authority, params, options = {}) {
	const access = captureSkillLibraryAccess(authority, options);
	await access.read("profile", void 0);
	return withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-library-source-"
	}, async ({ dir }) => {
		const installed = await installSkillFromClawHub({
			workspaceDir: dir,
			slug: params.source.slug,
			version: params.source.version,
			config: authority.getConfig()
		});
		access.assertCurrent();
		if (!installed.ok) throw new SkillLibraryError("POLICY_BLOCKED", installed.error);
		return publishDirectory({
			...authority,
			assertCurrent: access.assertCurrent
		}, params.slug, installed.targetDir, access.options);
	});
}
/** Upload bytes never enter the admin upload store; every stage resolves the durable profile anew. */
async function uploadSkillLibrary(authority, params, options = {}) {
	if (!validateSkillsLibraryUploadParams(params)) throw new SkillLibraryError("INVALID_BUNDLE", "Invalid library upload parameters.");
	const access = captureSkillLibraryAccess(authority, options);
	if (params.action !== "commit") return access.write("skillLibrary.upload", { params });
	const prepared = await access.read("upload", { uploadId: params.uploadId });
	const upload = prepared.value;
	if (upload.published_skill_id) return skillLibraryReceipt((await access.read("entry", { skillId: upload.published_skill_id })).value, "unchanged");
	const bytes = Buffer.from(upload.archive_blob);
	if (bytes.length !== upload.size_bytes || createHash("sha256").update(bytes).digest("hex") !== upload.sha256) throw new SkillLibraryError("INVALID_BUNDLE", "Upload is incomplete or its SHA-256 does not match.");
	return withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-library-import-"
	}, async ({ dir }) => {
		const archivePath = path.join(dir, "skill.zip");
		authority.assertFileMutationAllowed?.();
		await fs.writeFile(archivePath, bytes, {
			mode: 384,
			flag: "wx"
		});
		const result = await withExtractedArchiveRoot({
			archivePath,
			tempDirPrefix: "openclaw-library-extract-",
			timeoutMs: 12e4,
			rootMarkers: ["SKILL.md"],
			limits: {
				maxArchiveBytes: SKILL_LIBRARY_MAX_BUNDLE_BYTES,
				maxExtractedBytes: SKILL_LIBRARY_MAX_BUNDLE_BYTES,
				maxEntryBytes: SKILL_LIBRARY_MAX_FILE_BYTES,
				maxEntries: SKILL_LIBRARY_MAX_TREE_ENTRIES + 1,
				maxEntryPathComponents: 17
			},
			onExtracted: async (rootDir) => ({
				ok: true,
				receipt: await publishDirectory({
					...authority,
					assertCurrent: () => {
						prepared.assertCurrent();
						if (upload.expires_at <= Date.now()) throw new SkillLibraryError("NOT_FOUND", "Upload expired. Start a new import.");
					}
				}, upload.slug, rootDir, access.options, upload.upload_id)
			})
		});
		if (!result.ok) throw new SkillLibraryError("INVALID_BUNDLE", result.error);
		return result.receipt;
	});
}
//#endregion
//#region src/gateway/server-methods/skills-library.ts
function libraryAuthority(options, assertFileMutationAllowed) {
	const { client, context } = options;
	return {
		profileId: client?.authenticatedUserProfile?.profileId,
		scopes: client?.connect.scopes ?? [],
		getConfig: context.getRuntimeConfig,
		assertFileMutationAllowed,
		assertCurrent: () => {
			assertFileMutationAllowed?.();
			options.sessionMutationCommitGuard?.();
			options.sessionMutationAuthorization?.assertCurrent();
			if (client?.internal?.syntheticClient) throw new SkillLibraryError("IDENTITY_REQUIRED", "Synthetic calls cannot acquire personal ownership. Ask the person to send a fresh attributed message or use My skills.");
		}
	};
}
async function activateLibrarySelection(options, params) {
	const { client, context } = options;
	const authorization = resolveSessionMutationAuthorization({
		client,
		context,
		method: "skills.library.activate",
		requestParams: params
	});
	if (authorization.error) throw new SessionMutationAuthorizationChangedError(authorization.error);
	const target = resolveSessionSharingTarget({
		cfg: context.getRuntimeConfig(),
		sessionKey: params.sessionKey
	});
	if (!target) throw new SkillLibraryError("NOT_FOUND", "Session not found.");
	const authority = libraryAuthority(options);
	let plannedSelections;
	const assertCurrent = () => {
		authority.assertCurrent();
		authorization.authorization?.assertCurrent();
		assertPreparedSkillLibrarySelection(plannedSelections);
		const current = resolveSessionSharingTarget({
			cfg: context.getRuntimeConfig(),
			sessionKey: params.sessionKey
		});
		if (!current || current.entry.sessionId !== target.entry.sessionId || current.entry.lifecycleRevision !== target.entry.lifecycleRevision || current.storePath !== target.storePath || current.storeKey !== target.storeKey) throw new SkillLibraryError("CONFLICT", "Session changed before activation; refresh and retry.");
		const ownershipError = resolvePluginSessionOwnershipError({
			action: "patch",
			entry: current.entry,
			key: current.canonicalKey,
			pluginOwnerId: client?.internal?.pluginRuntimeOwnerId
		});
		if (ownershipError) throw new SessionMutationAuthorizationChangedError(ownershipError);
	};
	const entry = await patchSessionEntryCore({
		storePath: target.storePath,
		sessionKey: target.storeKey,
		agentId: target.agentId
	}, async (current) => {
		assertCurrent();
		const selections = await changeSkillLibrarySelection(authority, current.skillLibrarySelections ?? [], params);
		plannedSelections = selections;
		assertCurrent();
		return {
			skillLibrarySelections: selections,
			updatedAt: Date.now()
		};
	}, { assertCommitAllowed: assertCurrent });
	if (!entry) throw new SkillLibraryError("CONFLICT", "Session changed before activation; refresh and retry.");
	return {
		sessionKey: target.canonicalKey,
		selections: entry.skillLibrarySelections ?? [],
		sessionActivation: "next-turn"
	};
}
function selectedSession(options, sessionKey) {
	const resolve = () => {
		const cfg = options.context.getRuntimeConfig();
		const target = resolveSessionSharingTarget({
			cfg,
			sessionKey
		});
		if (!target) throw new SkillLibraryError("NOT_FOUND", "Session not found.");
		const error = authorizeSessionSharingTarget({
			cfg,
			client: options.client,
			target
		});
		if (error) throw new SessionMutationAuthorizationChangedError(error);
		return target;
	};
	const target = resolve();
	return {
		target,
		assertCurrent: () => {
			const current = resolve();
			if (current.entry.sessionId !== target.entry.sessionId || current.entry.lifecycleRevision !== target.entry.lifecycleRevision || JSON.stringify(current.entry.skillLibrarySelections) !== JSON.stringify(target.entry.skillLibrarySelections)) throw new SkillLibraryError("CONFLICT", "Session selection changed; refresh and retry.");
		}
	};
}
function libraryHandler(name, validate, run) {
	return defineValidatedGatewayHandler(name, validate, async (options) => {
		options.respond(true, await run(libraryAuthority(options, captureGatewayClientUploadCommitGuard({
			method: name,
			requestParams: options.params,
			client: options.client,
			context: options.context
		})), options.params, options), void 0);
	}, (error) => {
		if (error instanceof SessionMutationAuthorizationChangedError) return error.error;
		return error instanceof SkillLibraryError ? errorShape(ErrorCodes.INVALID_REQUEST, error.message, { details: {
			code: `SKILL_LIBRARY_${error.code}`,
			...error.currentRevision ? { currentRevision: error.currentRevision } : {}
		} }) : errorShape(ErrorCodes.UNAVAILABLE, "Unable to complete the skill library operation. Review the bundle or retry the request.");
	});
}
const skillsLibraryHandlers = {
	"skills.library.list": libraryHandler("skills.library.list", validateSkillsLibraryListParams, async (authority, params, options) => {
		const session = params.sessionKey ? selectedSession(options, params.sessionKey) : void 0;
		const access = captureSkillLibraryAccess(authority);
		const listed = await access.read("list", params);
		const result = listed.value;
		if (session) {
			const pins = session.target.entry.skillLibrarySelections ?? [];
			const selected = await access.read("pins", pins);
			const all = params.scope ? await access.read("list", {}) : listed;
			listed.assertCurrent();
			selected.assertCurrent();
			all.assertCurrent();
			session.assertCurrent();
			result.session = {
				sessionKey: session.target.canonicalKey,
				selections: selected.value,
				attachable: all.value.entries.filter((entry) => !pins.some((pin) => pin.skillId === entry.skillId))
			};
		}
		return result;
	}),
	"skills.library.read": libraryHandler("skills.library.read", validateSkillsLibraryReadParams, (authority, params, options) => {
		if (!params.sessionKey) return readSkillLibrary(authority, params.skillId, params.revision);
		const session = selectedSession(options, params.sessionKey);
		const pin = session.target.entry.skillLibrarySelections?.find((selection) => selection.skillId === params.skillId && selection.revision === params.revision);
		if (!pin) throw new SkillLibraryError("FORBIDDEN", "Session reads require an exact selected skillId and revision.");
		return readSkillLibrary(authority, params.skillId, params.revision, {}, {
			revision: pin.revision,
			assertSessionAccess: session.assertCurrent
		});
	}),
	"skills.library.save": libraryHandler("skills.library.save", validateSkillsLibrarySaveParams, async (authority, { retainFiles, ...params }) => {
		if (!retainFiles?.length) return saveSkillLibrary(authority, params);
		if (!params.skillId || !params.expectedRevision) throw new SkillLibraryError("INVALID_BUNDLE", "Retaining skill files requires skillId and expectedRevision.");
		const existing = await readSkillLibrary(authority, params.skillId, params.expectedRevision);
		const filesByPath = new Map(existing.files.map((file) => [file.path, file]));
		const retained = retainFiles.map((path) => {
			const file = filesByPath.get(path);
			if (!file) throw new SkillLibraryError("INVALID_BUNDLE", "Retained skill files must name distinct support files in expectedRevision.");
			filesByPath.delete(path);
			return file;
		});
		return saveSkillLibrary(authority, {
			...params,
			files: [...retained, ...params.files ?? []]
		});
	}),
	"skills.library.mutate": libraryHandler("skills.library.mutate", validateSkillsLibraryMutateParams, (authority, params) => mutateSkillLibrary(authority, params)),
	"skills.library.activate": libraryHandler("skills.library.activate", validateSkillsLibraryActivateParams, (_authority, params, options) => activateLibrarySelection(options, params)),
	"skills.library.import": libraryHandler("skills.library.import", validateSkillsLibraryImportParams, (authority, params) => importSkillLibrary(authority, params)),
	"skills.library.upload": libraryHandler("skills.library.upload", validateSkillsLibraryUploadParams, (authority, params) => uploadSkillLibrary(authority, params))
};
//#endregion
export { mutateSkillLibrary as a, saveSkillLibrary as c, listSkillLibrary as i, libraryAuthority as n, readSkillLibrary as o, skillsLibraryHandlers as r, resolveSkillLibraryPresentation as s, activateLibrarySelection as t };
