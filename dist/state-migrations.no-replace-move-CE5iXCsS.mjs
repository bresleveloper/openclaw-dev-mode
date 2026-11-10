import { n as isErrno, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { a as publishFileExclusive, i as pinDirectory, s as requireDirectorySync } from "./directory-durability-B2RKADOj.mjs";
import fs from "node:fs";
import path from "node:path";
import { sameFileIdentity, statRegularFileSync } from "@openclaw/fs-safe/advanced";
import { FsSafeError, isNoReplaceUnsupported } from "@openclaw/fs-safe/errors";
import { getFsSafeNativeConfig } from "@openclaw/fs-safe/config";
//#region src/infra/state-migrations.no-replace-move.ts
var LegacyMigrationMoveUnavailableError = class extends Error {
	constructor(sourcePath, code, cause) {
		super(`Filesystem cannot publish a no-replace hard-link move for ${sourcePath} (${code})`, { cause });
		this.sourcePath = sourcePath;
		this.code = code;
		this.name = "LegacyMigrationMoveUnavailableError";
	}
};
function isClaimLinkPair(source, claim) {
	return source.isFile() && claim.isFile() && source.nlink === 2n && claim.nlink === 2n && source.dev === claim.dev && source.ino === claim.ino;
}
function assertClaimLinkPair(sourcePath, claimPath, identity) {
	const source = fs.lstatSync(sourcePath, { bigint: true });
	if (!isClaimLinkPair(source, fs.lstatSync(claimPath, { bigint: true })) || source.dev !== identity.dev || source.ino !== identity.ino) throw new FsSafeError("path-mismatch", "legacy migration source/claim link pair changed");
}
async function pinMoveParent(root, from) {
	const relativePath = path.dirname(from);
	const parent = await pinDirectory(await root.resolve(relativePath));
	try {
		const admitted = await root.stat(relativePath);
		if (!admitted.isDirectory || !admitted.exactIdentity || !sameFileIdentity(admitted.exactIdentity, parent.receipt.exactIdentity)) throw new FsSafeError("path-mismatch", "legacy migration source parent changed");
		return parent;
	} catch (error) {
		await parent.close();
		throw error;
	}
}
async function moveLegacyMigrationFileNoReplace(root, from, to) {
	try {
		await root.move(from, to, { assertBeforeMutation: () => {
			let source;
			try {
				source = statRegularFileSync(path.resolve(root.rootReal, from));
			} catch (cause) {
				if (isErrno(cause)) throw cause;
				throw new FsSafeError("invalid-path", "legacy migration move requires a regular file", { cause });
			}
			if (source.missing) throw new FsSafeError("not-found", "legacy migration source no longer exists");
		} });
		return;
	} catch (error) {
		if (getFsSafeNativeConfig().mode === "require") throw error;
		if (isNoReplaceUnsupported(error)) throw new LegacyMigrationMoveUnavailableError(path.resolve(root.rootReal, from), error.code, error);
		if (!(error instanceof FsSafeError) || error.code !== "helper-unavailable" || error.message !== "native fs-safe helper is unavailable" || path.dirname(from) !== path.dirname(to) || root.defaults.assertBeforeMutation || root.defaults.denyMutations || root.defaults.mutationSymlinks) throw error;
	}
	const parent = await pinMoveParent(root, from);
	try {
		const sourcePath = path.join(parent.receipt.realPath, path.basename(from));
		const targetPath = path.join(parent.receipt.realPath, path.basename(to));
		let identity;
		try {
			var _usingCtx$1 = _usingCtx();
			const opened = _usingCtx$1.a(await root.open(from, {
				hardlinks: "reject",
				symlinks: "reject"
			}));
			identity = fs.fstatSync(opened.handle.fd, { bigint: true });
			await opened.handle.sync();
			const published = await publishFileExclusive({
				sourcePath,
				targetPath,
				expectedSourceIdentity: identity,
				parentReceipt: parent.receipt,
				strategy: "link-required"
			}).catch((error) => {
				const code = !(error instanceof FsSafeError) && [
					"EPERM",
					"EXDEV",
					"EMLINK",
					"ENOTSUP",
					"EOPNOTSUPP",
					"ENOSYS"
				].find((candidate) => hasErrnoCode(error, candidate));
				if (code) throw new LegacyMigrationMoveUnavailableError(sourcePath, code, error);
				throw error;
			});
			requireDirectorySync(published.directorySync, "Legacy migration claim directory");
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
		await root.remove(from, { assertBeforeMutation: () => assertClaimLinkPair(sourcePath, targetPath, identity) });
		requireDirectorySync(await parent.sync(), "Legacy migration source directory");
	} finally {
		await parent.close();
	}
}
/** Recognize only an exact two-name regular-file publication, never arbitrary hardlinks. */
async function inspectLegacyMigrationLinkedMove(root, retained, removed) {
	try {
		var _usingCtx3 = _usingCtx();
		if (path.dirname(retained) !== path.dirname(removed) || path.resolve(root.rootReal, retained) === path.resolve(root.rootReal, removed)) throw new FsSafeError("invalid-path", "legacy migration link recovery requires distinct sibling names");
		if (!await root.exists(retained) || !await root.exists(removed)) return;
		const source = _usingCtx3.a(await root.open(retained, {
			hardlinks: "allow",
			symlinks: "reject"
		}));
		const target = _usingCtx3.a(await root.open(removed, {
			hardlinks: "allow",
			symlinks: "reject"
		}));
		const identity = fs.fstatSync(source.handle.fd, { bigint: true });
		return isClaimLinkPair(identity, fs.fstatSync(target.handle.fd, { bigint: true })) ? identity : void 0;
	} catch (_) {
		_usingCtx3.e = _;
	} finally {
		await _usingCtx3.d();
	}
}
/** Settle a known interrupted publication while retaining the caller-selected name. */
async function recoverLegacyMigrationLinkedMove(root, retained, removed) {
	const identity = await inspectLegacyMigrationLinkedMove(root, retained, removed);
	if (!identity) return false;
	const parent = await pinMoveParent(root, retained);
	try {
		try {
			var _usingCtx4 = _usingCtx();
			await _usingCtx4.a(await root.open(retained, {
				hardlinks: "allow",
				symlinks: "reject"
			})).handle.sync();
		} catch (_) {
			_usingCtx4.e = _;
		} finally {
			await _usingCtx4.d();
		}
		requireDirectorySync(await parent.sync(), "Legacy migration recovery directory");
		await root.remove(removed, { assertBeforeMutation: () => assertClaimLinkPair(path.join(parent.receipt.realPath, path.basename(retained)), path.join(parent.receipt.realPath, path.basename(removed)), identity) });
		requireDirectorySync(await parent.sync(), "Legacy migration recovery directory");
		return true;
	} finally {
		await parent.close();
	}
}
//#endregion
export { recoverLegacyMigrationLinkedMove as i, inspectLegacyMigrationLinkedMove as n, moveLegacyMigrationFileNoReplace as r, LegacyMigrationMoveUnavailableError as t };
