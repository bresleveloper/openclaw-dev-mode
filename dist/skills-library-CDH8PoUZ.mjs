import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { r as withTempWorkspace } from "./private-temp-workspace-DQFTMfun.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { _ as validateSkillsLibraryMutateParams, b as validateSkillsLibraryUploadParams, g as validateSkillsLibraryListParams, h as validateSkillsLibraryImportParams, m as validateSkillsLibraryActivateParams, r as SKILL_LIBRARY_MAX_FILE_BYTES, t as SKILL_LIBRARY_MAX_BUNDLE_BYTES, v as validateSkillsLibraryReadParams, y as validateSkillsLibrarySaveParams } from "./skill-library-C7RO5Y8q.mjs";
import { p as hasMultipleSessionSharingIdentities } from "./user-profile-list-B5pNqyXa.mjs";
import { t as evaluateSkillInstallPolicy } from "./install-security-scan-D-EfiJK1.mjs";
import { d as patchSessionEntryCore } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { I as authorizeSessionSharingTarget, K as resolveSessionSharingTarget, t as resolveSessionMutationAuthorization } from "./session-sharing-C_5FkkwM.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { C as skillLibraryDb, S as selectSkillLibraryRow, _ as requireSkillLibraryUploadMetadata, b as selectSkillLibraryRevision, c as assertSkillLibraryNameAvailable, d as projectSkillLibraryEntry, f as readSkillLibraryStore, g as requireSkillLibraryUpload, h as requireSkillLibraryProfile, l as assertSkillLibraryRevision, m as requireSkillLibraryEntry, p as recordSkillLibraryEvent, r as changeSkillLibrarySelection, u as ensureSkillLibrarySchema, v as resolveSkillLibraryActor, x as selectSkillLibraryRevisionMetadata, y as selectSkillLibraryOwner } from "./selection-DRWWbX7-.mjs";
import { a as prepareSkillLibraryBundle, c as readSkillLibraryTree, f as SkillLibraryError, l as skillLibraryRevisionDir, r as decodeSkillLibraryFile, s as readSkillLibraryManifestTree, t as SKILL_LIBRARY_MAX_TREE_ENTRIES, u as stageSkillLibraryBundle } from "./bundle-rcLpsHEc.mjs";
import { n as scanProposalBundle, t as assertProposalContainsNoLiteralSecrets } from "./proposal-scan-BQNS8RJy.mjs";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-BAwSgzgQ.mjs";
import { n as withExtractedArchiveRoot } from "./install-flow-C5F-D6Ey.mjs";
import { t as installSkillFromClawHub } from "./clawhub-BGD8Bvto.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
//#region src/skills/library/service.ts
/** Prepared once at human ingress; no library catalog or feature schema work. */
function resolveSkillLibraryPresentation(authority, options = {}) {
	authority.assertCurrent();
	const multipleProfiles = hasMultipleSessionSharingIdentities(options);
	const actor = resolveSkillLibraryActor(openOpenClawStateDatabase(options).db, authority);
	return {
		profileId: actor.profileId ?? null,
		multipleProfiles,
		defaultTarget: actor.profileId && (multipleProfiles || !actor.admin) ? "personal" : actor.admin ? "workspace" : "unavailable",
		canManageWorkspace: actor.admin
	};
}
function listSkillLibrary(authority, params = {}, options = {}) {
	authority.assertCurrent();
	const presentation = resolveSkillLibraryPresentation(authority, options);
	const entries = readSkillLibraryStore((db) => executeSqliteQuerySync(db, skillLibraryDb(db).selectFrom("skill_library_entries").selectAll().where("removed", "=", 0).orderBy("slug").orderBy("skill_id")).rows.flatMap((row) => {
		const entry = projectSkillLibraryEntry(db, row, authority);
		if (!entry || params.scope === "mine" && (!presentation.profileId || entry.ownerProfileId !== presentation.profileId) || params.scope === "team" && !entry.shared && entry.ownerProfileId !== null) return [];
		return [entry];
	}), options) ?? [];
	return {
		entries,
		...presentation,
		defaultSelectionLimit: 64,
		...presentation.profileId && entries.filter((entry) => entry.enabled && (entry.ownerProfileId === presentation.profileId || entry.ownerProfileId === null || entry.shared)).length > 64 ? { defaultSelectionNotice: "New sessions select up to 64 enabled skills, personal skills first and then stable ID order. In a session, detach a selected skill to make room and attach another from the library." } : {}
	};
}
function skillLibraryReceipt(entry, state = "published") {
	return {
		state,
		target: entry.ownerProfileId === null ? "team" : "personal",
		entry,
		sessionActivation: "new-sessions",
		nextAction: state === "removed" ? "Existing sessions retain their pinned revision. Create a new skill to add it to future sessions." : !entry.enabled ? "Disabled for new-session defaults. Existing sessions retain their selected revision; explicit attachment remains available." : entry.ownerProfileId !== null && !entry.shared ? "Enabled for your new sessions, subject to agent policy and prerequisites. Existing session pins remain. Use skills.library.activate to attach or refresh it." : "Enabled for new team sessions, subject to agent policy and prerequisites. Existing session pins remain. Use skills.library.activate to attach or refresh it."
	};
}
async function readSkillLibrary(authority, skillId, revision, options = {}, selected) {
	const authorize = (db) => {
		if (!selected) return requireSkillLibraryEntry(db, skillId, authority);
		selected.assertSessionAccess();
		if (revision !== selected.revision) throw new SkillLibraryError("FORBIDDEN", "Only the session's exact selected revision can be read.");
		const row = selectSkillLibraryRow(db, skillId);
		const entry = row && projectSkillLibraryEntry(db, row, authority, selected.revision, true);
		if (!entry) throw new SkillLibraryError("NOT_FOUND", "Selected revision is unavailable.");
		return {
			...entry,
			canEdit: false
		};
	};
	const result = readSkillLibraryStore((db) => {
		const entry = authorize(db);
		const selectedRevision = revision ?? entry.revision;
		const metadata = selectSkillLibraryRevision(db, skillId, selectedRevision);
		if (!metadata) throw new SkillLibraryError("NOT_FOUND", "Skill revision not found.");
		return {
			manifestJson: metadata.files_json,
			entry: {
				...entry,
				revision: selectedRevision,
				description: metadata.description
			},
			revisions: selected ? [{
				revision: selected.revision,
				createdAt: metadata.created_at
			}] : executeSqliteQuerySync(db, skillLibraryDb(db).selectFrom("skill_library_revisions").select(["revision", "created_at"]).where("skill_id", "=", skillId).orderBy("created_at", "desc")).rows.map((row) => ({
				revision: row.revision,
				createdAt: row.created_at
			}))
		};
	}, options);
	if (!result) throw new SkillLibraryError("NOT_FOUND", "Skill not found in your accessible library.");
	const files = await readSkillLibraryManifestTree(skillLibraryRevisionDir(skillId, result.entry.revision, options.env), result.manifestJson, result.entry.revision);
	if (!readSkillLibraryStore(authorize, options)) throw new SkillLibraryError("NOT_FOUND", "Selected revision is unavailable.");
	return {
		entry: result.entry,
		revisions: result.revisions,
		content: decodeSkillLibraryFile(files.find((file) => file.path === "SKILL.md")).toString("utf8"),
		files: files.filter((file) => file.path !== "SKILL.md")
	};
}
async function saveSkillLibrary(authority, params, options = {}, uploadId) {
	if (!validateSkillsLibrarySaveParams(params)) throw new SkillLibraryError("INVALID_BUNDLE", "Invalid skill save parameters.");
	requireSkillLibraryProfile(openOpenClawStateDatabase(options).db, authority);
	const previous = params.skillId ? readSkillLibraryStore((db) => requireSkillLibraryEntry(db, params.skillId, authority, true), options) : void 0;
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
	const staged = await stageSkillLibraryBundle(skillId, bundle, options.env);
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
		authority.assertCurrent();
		await staged.publish();
		ensureSkillLibrarySchema(options);
		return runOpenClawStateWriteTransaction(({ db }) => {
			const actor = requireSkillLibraryProfile(db, authority);
			if (uploadId) {
				const upload = requireSkillLibraryUploadMetadata(db, uploadId, authority);
				if (upload.slug !== params.slug) throw new SkillLibraryError("NOT_FOUND", "Upload slug changed; start the import again.");
				if (upload.published_skill_id) return skillLibraryReceipt(requireSkillLibraryEntry(db, upload.published_skill_id, authority), "unchanged");
			}
			const current = params.skillId ? requireSkillLibraryEntry(db, skillId, authority, true) : void 0;
			if (current) assertSkillLibraryRevision(current, params.expectedRevision);
			const owner = current ? current.ownerProfileId : actor;
			assertSkillLibraryNameAvailable(db, owner, params.slug, skillId);
			if (current?.revision === bundle.revision && current.slug === params.slug) return skillLibraryReceipt(current, "unchanged");
			const now = Date.now();
			const kysely = skillLibraryDb(db);
			executeSqliteQuerySync(db, kysely.insertInto("skill_library_revisions").values({
				skill_id: skillId,
				revision: bundle.revision,
				description: bundle.description,
				files_json: JSON.stringify(bundle.files.map(({ bytes: _bytes, ...file }) => file)),
				created_at: now
			}).onConflict((conflict) => conflict.columns(["skill_id", "revision"]).doNothing()));
			if (current) executeSqliteQuerySync(db, kysely.updateTable("skill_library_entries").set({
				slug: params.slug,
				current_revision: bundle.revision,
				updated_at: now
			}).where("skill_id", "=", skillId));
			else executeSqliteQuerySync(db, kysely.insertInto("skill_library_entries").values({
				skill_id: skillId,
				owner_profile_id: actor,
				author_profile_id: actor,
				slug: params.slug,
				current_revision: bundle.revision,
				shared: 0,
				enabled: 1,
				removed: 0,
				created_at: now,
				updated_at: now
			}));
			recordSkillLibraryEvent(db, skillId, bundle.revision, current ? "save" : "create", actor);
			if (uploadId) executeSqliteQuerySync(db, kysely.updateTable("skill_library_uploads").set({ published_skill_id: skillId }).where("upload_id", "=", uploadId));
			return skillLibraryReceipt(requireSkillLibraryEntry(db, skillId, authority));
		}, options, { operationLabel: "skills.library.publish" });
	} finally {
		await staged.cleanup();
	}
}
function mutateSkillLibrary(authority, params, options = {}) {
	if (!readSkillLibraryStore((db) => requireSkillLibraryEntry(db, params.skillId, authority, true), options)) throw new SkillLibraryError("NOT_FOUND", "Skill not found.");
	return runOpenClawStateWriteTransaction(({ db }) => {
		const actor = requireSkillLibraryProfile(db, authority);
		const current = requireSkillLibraryEntry(db, params.skillId, authority, true);
		assertSkillLibraryRevision(current, params.expectedRevision);
		const changes = {};
		switch (params.action) {
			case "share":
			case "unshare":
				if (params.action === "unshare" && current.ownerProfileId === null) throw new SkillLibraryError("FORBIDDEN", "Team-owned skills cannot become personal through unshare.");
				changes.shared = Number(params.action === "share");
				break;
			case "transfer":
				if (!resolveSkillLibraryActor(db, authority).admin) throw new SkillLibraryError("FORBIDDEN", "Transfer to team ownership requires a Gateway administrator.");
				assertSkillLibraryNameAvailable(db, null, current.slug, current.skillId);
				changes.owner_profile_id = null;
				changes.shared = 1;
				break;
			case "enable":
			case "disable":
				changes.enabled = Number(params.action === "enable");
				break;
			case "remove":
				changes.removed = 1;
				break;
			case "rollback":
				if (!params.revision || !selectSkillLibraryRevisionMetadata(db, current.skillId, params.revision)) throw new SkillLibraryError("NOT_FOUND", "Choose a published revision from this skill's history.");
				changes.current_revision = params.revision;
		}
		executeSqliteQuerySync(db, skillLibraryDb(db).updateTable("skill_library_entries").set({
			...changes,
			updated_at: Date.now()
		}).where("skill_id", "=", current.skillId));
		recordSkillLibraryEvent(db, current.skillId, changes.current_revision ?? current.revision, params.action, actor);
		return skillLibraryReceipt(requireSkillLibraryEntry(db, current.skillId, authority), params.action === "remove" ? "removed" : "published");
	}, options, { operationLabel: "skills.library.mutate" });
}
//#endregion
//#region src/skills/library/import.ts
const MAX_CHUNK_BYTES = 262144;
const MAX_ACTIVE_UPLOADS = 32;
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
	requireSkillLibraryProfile(openOpenClawStateDatabase(options).db, authority);
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
		authority.assertCurrent();
		if (!installed.ok) throw new SkillLibraryError("POLICY_BLOCKED", installed.error);
		return publishDirectory(authority, params.slug, installed.targetDir, options);
	});
}
/** Upload bytes never enter the admin upload store; every stage resolves the durable profile anew. */
async function uploadSkillLibrary(authority, params, options = {}) {
	if (!validateSkillsLibraryUploadParams(params)) throw new SkillLibraryError("INVALID_BUNDLE", "Invalid library upload parameters.");
	requireSkillLibraryProfile(openOpenClawStateDatabase(options).db, authority);
	ensureSkillLibrarySchema(options);
	if (params.action === "begin") return runOpenClawStateWriteTransaction(({ db }) => {
		const actor = requireSkillLibraryProfile(db, authority);
		const kysely = skillLibraryDb(db);
		executeSqliteQuerySync(db, kysely.deleteFrom("skill_library_uploads").where("expires_at", "<=", Date.now()));
		const activeUploads = executeSqliteQuerySync(db, kysely.selectFrom("skill_library_uploads").select("owner_profile_id").where("published_skill_id", "is", null).limit(MAX_ACTIVE_UPLOADS)).rows;
		if (activeUploads.length >= MAX_ACTIVE_UPLOADS || activeUploads.filter((upload) => selectSkillLibraryOwner(db, upload.owner_profile_id)?.id === actor).length >= MAX_ACTIVE_UPLOADS / 2) throw new SkillLibraryError("LIMIT", "Active import limit reached for your profile or the Gateway. Finish an existing import or retry after it expires.");
		const uploadId = randomUUID();
		executeSqliteQuerySync(db, kysely.insertInto("skill_library_uploads").values({
			upload_id: uploadId,
			owner_profile_id: actor,
			slug: params.slug,
			size_bytes: params.sizeBytes,
			sha256: params.sha256,
			archive_blob: Buffer.alloc(0),
			expires_at: Date.now() + 36e5,
			published_skill_id: null
		}));
		return {
			uploadId,
			offset: 0,
			maxChunkBytes: MAX_CHUNK_BYTES
		};
	}, options);
	const readOwned = () => requireSkillLibraryUpload(openOpenClawStateDatabase(options).db, params.uploadId, authority);
	if (params.action === "chunk") {
		const bytes = Buffer.from(params.data, "base64");
		if (!bytes.length || bytes.length > MAX_CHUNK_BYTES || bytes.toString("base64") !== params.data) throw new SkillLibraryError("INVALID_BUNDLE", "Invalid upload chunk; send canonical base64, at most 256 KiB decoded.");
		return runOpenClawStateWriteTransaction(({ db }) => {
			const upload = readOwned();
			const current = Buffer.from(upload.archive_blob);
			if (upload.published_skill_id || params.offset !== current.length || current.length + bytes.length > upload.size_bytes) throw new SkillLibraryError("CONFLICT", "Upload offset changed or upload completed. Start a new import.");
			const next = Buffer.concat([current, bytes]);
			executeSqliteQuerySync(db, skillLibraryDb(db).updateTable("skill_library_uploads").set({ archive_blob: next }).where("upload_id", "=", params.uploadId));
			return {
				uploadId: params.uploadId,
				offset: next.length,
				maxChunkBytes: MAX_CHUNK_BYTES
			};
		}, options);
	}
	const upload = readOwned();
	if (upload.published_skill_id) return skillLibraryReceipt(requireSkillLibraryEntry(openOpenClawStateDatabase(options).db, upload.published_skill_id, authority), "unchanged");
	const bytes = Buffer.from(upload.archive_blob);
	if (bytes.length !== upload.size_bytes || createHash("sha256").update(bytes).digest("hex") !== upload.sha256) throw new SkillLibraryError("INVALID_BUNDLE", "Upload is incomplete or its SHA-256 does not match.");
	return withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-library-import-"
	}, async ({ dir }) => {
		const archivePath = path.join(dir, "skill.zip");
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
					assertCurrent: () => requireSkillLibraryUploadMetadata(openOpenClawStateDatabase(options).db, params.uploadId, authority)
				}, upload.slug, rootDir, options, upload.upload_id)
			})
		});
		if (!result.ok) throw new SkillLibraryError("INVALID_BUNDLE", result.error);
		return result.receipt;
	});
}
//#endregion
//#region src/gateway/server-methods/skills-library.ts
function libraryAuthority(options) {
	const { client, context } = options;
	return {
		profileId: client?.authenticatedUserProfile?.profileId,
		scopes: client?.connect.scopes ?? [],
		getConfig: context.getRuntimeConfig,
		assertCurrent: () => {
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
		if (plannedSelections && params.action !== "detach") {
			if (!readSkillLibraryStore((db) => {
				for (const pin of plannedSelections) {
					if (params.skillId && pin.skillId !== params.skillId) continue;
					if (requireSkillLibraryEntry(db, pin.skillId, authority).removed || !selectSkillLibraryRevisionMetadata(db, pin.skillId, pin.revision)) throw new SkillLibraryError("CONFLICT", "Skill access changed during activation. Refresh the library and retry.");
				}
				return true;
			}, {})) throw new SkillLibraryError("CONFLICT", "Skill library changed during activation.");
		}
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
	}, (current) => {
		assertCurrent();
		const selections = changeSkillLibrarySelection(authority, current.skillLibrarySelections ?? [], params);
		plannedSelections = selections;
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
	return async (options) => {
		if (!assertValidParams(options.params, validate, name, options.respond)) return;
		try {
			options.respond(true, await run(libraryAuthority(options), options.params, options), void 0);
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) {
				options.respond(false, void 0, error.error);
				return;
			}
			options.respond(false, void 0, error instanceof SkillLibraryError ? errorShape(ErrorCodes.INVALID_REQUEST, error.message, { details: {
				code: `SKILL_LIBRARY_${error.code}`,
				...error.currentRevision ? { currentRevision: error.currentRevision } : {}
			} }) : errorShape(ErrorCodes.UNAVAILABLE, "Unable to complete the skill library operation. Review the bundle or retry the request."));
		}
	};
}
const skillsLibraryHandlers = {
	"skills.library.list": libraryHandler("skills.library.list", validateSkillsLibraryListParams, (authority, params, options) => {
		const session = params.sessionKey ? selectedSession(options, params.sessionKey) : void 0;
		const result = listSkillLibrary(authority, params);
		if (session) {
			const pins = session.target.entry.skillLibrarySelections ?? [];
			const selections = readSkillLibraryStore((db) => pins.map((pin) => {
				const row = selectSkillLibraryRow(db, pin.skillId);
				const entry = row && projectSkillLibraryEntry(db, row, authority, pin.revision, true);
				if (!entry) throw new SkillLibraryError("NOT_FOUND", "A pinned skill revision is unavailable. Restore the library or detach it explicitly.");
				return {
					...pin,
					slug: entry.slug,
					description: entry.description,
					ownerLabel: entry.ownerLabel
				};
			}), {}) ?? [];
			if (selections.length !== pins.length) throw new SkillLibraryError("NOT_FOUND", "Pinned skill library is unavailable. Restore it or detach the selected skills explicitly.");
			session.assertCurrent();
			result.session = {
				sessionKey: session.target.canonicalKey,
				selections,
				attachable: listSkillLibrary(authority).entries.filter((entry) => !pins.some((pin) => pin.skillId === entry.skillId))
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
	"skills.library.save": libraryHandler("skills.library.save", validateSkillsLibrarySaveParams, (authority, params) => saveSkillLibrary(authority, params)),
	"skills.library.mutate": libraryHandler("skills.library.mutate", validateSkillsLibraryMutateParams, (authority, params) => mutateSkillLibrary(authority, params)),
	"skills.library.activate": libraryHandler("skills.library.activate", validateSkillsLibraryActivateParams, (_authority, params, options) => activateLibrarySelection(options, params)),
	"skills.library.import": libraryHandler("skills.library.import", validateSkillsLibraryImportParams, (authority, params) => importSkillLibrary(authority, params)),
	"skills.library.upload": libraryHandler("skills.library.upload", validateSkillsLibraryUploadParams, (authority, params) => uploadSkillLibrary(authority, params))
};
//#endregion
export { mutateSkillLibrary as a, saveSkillLibrary as c, listSkillLibrary as i, libraryAuthority as n, readSkillLibrary as o, skillsLibraryHandlers as r, resolveSkillLibraryPresentation as s, activateLibrarySelection as t };
