import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { t as SkillLibraryError } from "./skill-library-error-z-Nwz4n5.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { c as prepareSessionSourceAuthority, f as sessionEntryCommitGuardOptions, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { _ as validateSkillsLibraryMutateParams, b as validateSkillsLibraryUploadParams, g as validateSkillsLibraryListParams, h as validateSkillsLibraryImportParams, m as validateSkillsLibraryActivateParams, r as SKILL_LIBRARY_MAX_FILE_BYTES, t as SKILL_LIBRARY_MAX_BUNDLE_BYTES, v as validateSkillsLibraryReadParams, y as validateSkillsLibrarySaveParams } from "./skill-library-Bgib5R_8.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { s as authorizeSessionSharingTarget } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as captureSessionSharingMemoryFacts } from "./session-sharing-incognito-DepuXzQy.mjs";
import { n as captureSessionMutationRouting, t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { c as prepareSessionSharingProfiles, o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { a as prepareSkillLibraryBundle, c as readSkillLibraryTree, l as skillLibraryRevisionDir, r as decodeSkillLibraryFile, s as readSkillLibraryManifestTree, t as SKILL_LIBRARY_MAX_TREE_ENTRIES, u as stageSkillLibraryBundle } from "./bundle-CsGYNL0a.mjs";
import { n as defineValidatedGatewayHandler } from "./validation--xIH1Pj-.mjs";
import { t as evaluateSkillInstallPolicy } from "./install-security-scan-w6F7ef4V.mjs";
import { t as captureSessionEntryCurrentCheckAsyncInternal } from "./session-entry-current-check-Df7ye0eB.mjs";
import { l as captureSkillLibraryAccess, r as changeSkillLibrarySelection, t as assertPreparedSkillLibrarySelection } from "./selection-B3qUGv_G.mjs";
import { i as projectSkillLibraryList, n as assertSkillLibraryRevision } from "./store-DmveTVM5.mjs";
import { n as scanSkillBundle, t as assertSkillBundleHasNoLiteralSecrets } from "./skill-bundle-scan-hOTbz-O6.mjs";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-D5Z0-DHb.mjs";
import { n as withExtractedArchiveRoot } from "./install-flow-BW-XNoSb.mjs";
import { t as installSkillFromClawHub } from "./clawhub-DjTGy1R4.mjs";
import { t as skillLibraryReceipt } from "./receipt-DmfbA7G3.mjs";
import { t as resolveSessionMutationAuthorizationAsync } from "./session-sharing-authorization-async-DhG3gR3C.mjs";
import { a as captureGatewayClientUploadCommitGuard } from "./upload-policy-Bd2Za3Ho.mjs";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
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
	const scan = scanSkillBundle(params.content, bundle.files.filter((file) => file.path !== "SKILL.md").map((file) => ({
		path: file.path,
		content: file.bytes.toString("utf8")
	})));
	assertSkillBundleHasNoLiteralSecrets(scan);
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
		assertCurrent: composeSessionSourceAssertion([
			assertFileMutationAllowed,
			options.sessionMutationCommitGuard,
			options.sessionMutationAuthorization?.assertCurrent
		], (assertSources) => {
			assertSources();
			if (client?.internal?.syntheticClient) throw new SkillLibraryError("IDENTITY_REQUIRED", "Synthetic calls cannot acquire personal ownership. Ask the person to send a fresh attributed message or use My skills.");
		})
	};
}
async function activateLibrarySelection(options, params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const { client, context } = options;
		const resolvedAuthorization = await resolveSessionMutationAuthorizationAsync({
			client,
			context,
			method: "skills.library.activate",
			requestParams: params
		});
		const authorization = _usingCtx$1.u({
			...resolvedAuthorization,
			[Symbol.dispose]: () => resolvedAuthorization.authorization?.release?.()
		});
		if (authorization.error) throw new SessionMutationAuthorizationChangedError(authorization.error);
		const selected = await selectedSession(options, params.sessionKey);
		try {
			const target = selected.target;
			const authority = libraryAuthority(options);
			let plannedSelections;
			const sessionChanged = () => new SkillLibraryError("CONFLICT", "Session changed before activation; refresh and retry.");
			const source = selected.source;
			const assertCurrent = composeSessionSourceAssertion([
				authority.assertCurrent,
				authorization.authorization?.assertCurrent,
				source
			], (assertSources) => {
				assertSources();
				assertPreparedSkillLibrarySelection(plannedSelections);
			});
			const entry = await patchSessionEntryCore({
				storePath: target.storePath,
				sessionKey: target.storeKey,
				agentId: target.agentId
			}, async (current) => {
				assertCurrent();
				plannedSelections = await changeSkillLibrarySelection(authority, current.skillLibrarySelections ?? [], params);
				assertCurrent();
				return {
					skillLibrarySelections: plannedSelections,
					updatedAt: Date.now()
				};
			}, sessionEntryCommitGuardOptions(assertCurrent));
			if (!entry) throw sessionChanged();
			return {
				sessionKey: target.canonicalKey,
				selections: entry.skillLibrarySelections ?? [],
				sessionActivation: "next-turn"
			};
		} finally {
			await selected.release();
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
async function selectedSession(options, sessionKey) {
	const sourceCfg = options.context.getRuntimeConfig();
	if (!isIncognitoSessionKey(sessionKey)) {
		const profiles = await prepareSessionSharingProfiles(options.client);
		const { agentId } = resolveSessionStoreIdentity({
			cfg: sourceCfg,
			sessionKey
		});
		const facts = await prepareSessionMutationFacts({
			cfg: sourceCfg,
			sessionKey,
			agentId
		});
		let entryRead;
		let pins;
		let entryAuthority;
		const release = async () => {
			try {
				await entryAuthority?.release?.();
			} finally {
				pins?.release();
				entryRead?.release();
				facts.release();
			}
		};
		try {
			const identity = facts.readCurrent(sourceCfg).target;
			entryRead = await captureSessionEntryCurrentCheckAsyncInternal({
				agentId: identity.agentId,
				sessionKey: identity.storeKey,
				storePath: identity.readSource?.path ?? identity.storePath,
				fields: ["pluginOwnerId"],
				errorMessage: "Session selection changed; refresh and retry."
			});
			entryAuthority = await prepareSessionSourceAuthority(entryRead.source);
			const entry = entryRead.entry;
			const readSource = identity.readSource;
			if (!entry || !readSource || typeof readSource.databaseIdentity !== "string") throw new SkillLibraryError("NOT_FOUND", "Session not found.");
			pins = retainPreparedSessionEntryPredicate({
				databaseIdentity: `file:${readSource.databaseIdentity}`,
				sessionKey: identity.storeKey,
				entry,
				matches: (_before, after) => isDeepStrictEqual(entry.skillLibrarySelections, after?.skillLibrarySelections)
			});
			const currentTarget = () => {
				entryAuthority.assertCurrent();
				const cfg = options.context.getRuntimeConfig();
				const current = facts.readCurrent(cfg);
				if (!current.target || current.target.entry.sessionId !== entry.sessionId || current.target.entry.lifecycleRevision !== entry.lifecycleRevision) throw new SkillLibraryError("CONFLICT", "Session selection changed; refresh and retry.");
				const error = prepareProjectedSessionSharing({
					cfg,
					client: options.client,
					profiles,
					isMember: (_target, id) => current.membership.has(id)
				}).authorizeTarget(current.target);
				if (error) throw new SessionMutationAuthorizationChangedError(error);
				return {
					...current.target,
					entry
				};
			};
			const target = currentTarget();
			const assertMutationCurrent = () => {
				const current = currentTarget();
				const error = resolvePluginSessionOwnershipError({
					action: "patch",
					entry: current.entry,
					key: current.canonicalKey,
					pluginOwnerId: options.client?.internal?.pluginRuntimeOwnerId
				});
				if (error) throw new SessionMutationAuthorizationChangedError(error);
			};
			return {
				target,
				source: composeSessionSourceAssertion([entryRead.source], (assertSources) => {
					assertSources();
					assertMutationCurrent();
				}),
				assertCurrent() {
					currentTarget();
					if (!pins.isCurrent()) throw new SkillLibraryError("CONFLICT", "Session selection changed; refresh and retry.");
				},
				release
			};
		} catch (error) {
			await release();
			throw error;
		}
	}
	const identity = resolveSessionStoreIdentity({
		cfg: sourceCfg,
		sessionKey
	});
	const profiles = await prepareSessionSharingProfiles(options.client);
	let active = true;
	const actorFacts = captureSessionSharingMemoryFacts({
		sessionKey: identity.canonicalKey,
		agentId: identity.agentId,
		resolved: { storePath: resolveSessionStorePathCore(sourceCfg.session?.store, { agentId: identity.agentId }) }
	}, () => {
		if (!active) throw new SkillLibraryError("CONFLICT", "Session selection was released.");
	});
	const assertRouting = captureSessionMutationRouting(sourceCfg);
	const resolve = (authorize = true) => {
		const cfg = options.context.getRuntimeConfig();
		assertRouting(cfg);
		const target = actorFacts?.readCurrent().target;
		if (!target) throw new SkillLibraryError("NOT_FOUND", "Session not found.");
		if (authorize) {
			const sharing = actorFacts && prepareProjectedSessionSharing({
				cfg,
				client: options.client,
				profiles,
				isMember: (_target, id) => actorFacts.readCurrent().membership.has(id)
			});
			const error = sharing ? sharing.authorizeTarget(target) : authorizeSessionSharingTarget({
				cfg,
				client: options.client,
				target
			});
			if (error) throw new SessionMutationAuthorizationChangedError(error);
		}
		return target;
	};
	const target = resolve();
	try {
		const currentTarget = () => {
			const current = resolve();
			if (current.entry.sessionId !== target.entry.sessionId || current.entry.lifecycleRevision !== target.entry.lifecycleRevision || current.entry.pluginOwnerId !== target.entry.pluginOwnerId) throw new SkillLibraryError("CONFLICT", "Session selection changed; refresh and retry.");
			return current;
		};
		const assertCurrent = () => {
			const current = currentTarget();
			if (JSON.stringify(current.entry.skillLibrarySelections) !== JSON.stringify(target.entry.skillLibrarySelections)) throw new SkillLibraryError("CONFLICT", "Session selection changed; refresh and retry.");
		};
		const assertMutationCurrent = () => {
			const current = currentTarget();
			const error = resolvePluginSessionOwnershipError({
				action: "patch",
				entry: current.entry,
				key: current.canonicalKey,
				pluginOwnerId: options.client?.internal?.pluginRuntimeOwnerId
			});
			if (error) throw new SessionMutationAuthorizationChangedError(error);
		};
		if (actorFacts) assertCurrent();
		return {
			target,
			assertCurrent,
			source: Object.assign(assertMutationCurrent, { async prepareSessionSource() {
				assertMutationCurrent();
				return {
					assertCurrent: assertMutationCurrent,
					checks: []
				};
			} }),
			release: () => {
				active = false;
			}
		};
	} catch (error) {
		active = false;
		throw error;
	}
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
		const session = params.sessionKey ? await selectedSession(options, params.sessionKey) : void 0;
		try {
			const access = captureSkillLibraryAccess(authority);
			const listed = await access.read("list", {});
			const result = projectSkillLibraryList(listed.value, params);
			if (session) {
				const pins = session.target.entry.skillLibrarySelections ?? [];
				const selected = await access.read("pins", pins);
				listed.assertCurrent();
				selected.assertCurrent();
				session.assertCurrent();
				result.session = {
					sessionKey: session.target.canonicalKey,
					selections: selected.value,
					attachable: listed.value.entries.filter((entry) => !pins.some((pin) => pin.skillId === entry.skillId))
				};
			}
			return result;
		} finally {
			await session?.release();
		}
	}),
	"skills.library.read": libraryHandler("skills.library.read", validateSkillsLibraryReadParams, async (authority, params, options) => {
		if (!params.sessionKey) return readSkillLibrary(authority, params.skillId, params.revision);
		const session = await selectedSession(options, params.sessionKey);
		try {
			const pin = session.target.entry.skillLibrarySelections?.find((selection) => selection.skillId === params.skillId && selection.revision === params.revision);
			if (!pin) {
				session.assertCurrent();
				throw new SkillLibraryError("FORBIDDEN", "Session reads require an exact selected skillId and revision.");
			}
			return await readSkillLibrary(authority, params.skillId, params.revision, {}, {
				revision: pin.revision,
				assertSessionAccess: session.assertCurrent
			});
		} finally {
			await session.release();
		}
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
