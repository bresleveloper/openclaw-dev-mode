import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { a as publishFileExclusive, i as pinDirectory, s as requireDirectorySync } from "./directory-durability-CqSvP1tc.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { t as pathMayExistSync } from "./path-existence-O1bMV6vh.mjs";
import fs from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { readRegularFileSync } from "@openclaw/fs-safe/advanced";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { getFsSafeNativeConfig } from "@openclaw/fs-safe/config";
//#region src/infra/state-migrations.source-snapshot.ts
function isClaimLinkPair(source, claim) {
	return source.isFile() && claim.isFile() && source.nlink === 2n && claim.nlink === 2n && source.dev === claim.dev && source.ino === claim.ino;
}
function assertClaimLinkPair(sourcePath, claimPath, identity) {
	const source = fs.lstatSync(sourcePath, { bigint: true });
	if (!isClaimLinkPair(source, fs.lstatSync(claimPath, { bigint: true })) || source.dev !== identity.dev || source.ino !== identity.ino) throw new FsSafeError("path-mismatch", "legacy migration source/claim link pair changed");
}
/** Keep every claim operation bound to the same trusted owner root and source inode. */
var LegacyMigrationSourceClaim = class {
	constructor(params) {
		this.params = params;
		this.sourcePath = params.sourcePath;
		this.claimPath = `${params.sourcePath}${params.claimSuffix ?? ".doctor-importing"}`;
		this.sourceRelativePath = resolveLegacyMigrationRelativePath(params.stateDir, this.sourcePath, params.label, params.includeFilePath);
		this.claimRelativePath = resolveLegacyMigrationRelativePath(params.stateDir, this.claimPath, params.label, params.includeFilePath);
	}
	async exists(claimed = false) {
		return await this.params.stateRoot.exists(claimed ? this.claimRelativePath : this.sourceRelativePath);
	}
	async read(claimed = false) {
		return await this.params.readSnapshot(claimed ? this.claimPath : this.sourcePath);
	}
	async pinParent() {
		const relativePath = path.dirname(this.sourceRelativePath);
		const parent = await pinDirectory(await this.params.stateRoot.resolve(relativePath));
		try {
			const admitted = await this.params.stateRoot.stat(relativePath);
			if (!admitted.isDirectory || admitted.dev !== parent.receipt.identity.dev || admitted.ino !== parent.receipt.identity.ino) throw new FsSafeError("path-mismatch", "legacy migration source parent changed");
			return parent;
		} catch (error) {
			await parent.close();
			throw error;
		}
	}
	async move(from, to) {
		const root = this.params.stateRoot;
		try {
			await root.move(from, to);
			return;
		} catch (error) {
			if (!(error instanceof FsSafeError) || error.code !== "helper-unavailable" || getFsSafeNativeConfig().mode === "require" || path.dirname(from) !== path.dirname(to) || root.defaults.assertBeforeMutation || root.defaults.denyMutations || root.defaults.mutationSymlinks || error.cause !== void 0 && error.message !== "native fs-safe helper is unavailable" && ![
				"EINVAL",
				"ENOSYS",
				"ENOTSUP",
				"EOPNOTSUPP"
			].some((code) => hasErrnoCode(error.cause, code))) throw error;
		}
		const parent = await this.pinParent();
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
	/** Roll back a link publication interrupted before its source name was removed. */
	async recoverLinkedMove() {
		if (!await this.exists() || !await this.exists(true)) return;
		const root = this.params.stateRoot;
		const parent = await this.pinParent();
		try {
			let identity;
			try {
				var _usingCtx3 = _usingCtx();
				const source = _usingCtx3.a(await root.open(this.sourceRelativePath, {
					hardlinks: "allow",
					symlinks: "reject"
				}));
				const claim = _usingCtx3.a(await root.open(this.claimRelativePath, {
					hardlinks: "allow",
					symlinks: "reject"
				}));
				const sourceStat = fs.fstatSync(source.handle.fd, { bigint: true });
				if (isClaimLinkPair(sourceStat, fs.fstatSync(claim.handle.fd, { bigint: true }))) {
					await source.handle.sync();
					identity = sourceStat;
				}
			} catch (_) {
				_usingCtx3.e = _;
			} finally {
				await _usingCtx3.d();
			}
			if (!identity) return;
			requireDirectorySync(await parent.sync(), "Legacy migration recovery directory");
			const retainedIdentity = identity;
			await root.remove(this.claimRelativePath, { assertBeforeMutation: () => assertClaimLinkPair(path.join(parent.receipt.realPath, path.basename(this.sourceRelativePath)), path.join(parent.receipt.realPath, path.basename(this.claimRelativePath)), retainedIdentity) });
			requireDirectorySync(await parent.sync(), "Legacy migration recovery directory");
		} finally {
			await parent.close();
		}
	}
	async recover(conflictMessage) {
		await this.recoverLinkedMove();
		if (!await this.exists(true)) return;
		const claimed = await this.read(true);
		if (!await this.exists()) {
			await this.move(this.claimRelativePath, this.sourceRelativePath);
			return;
		}
		if (!legacyMigrationSourceContentMatches(claimed, await this.read())) throw new Error(conflictMessage);
		await this.params.stateRoot.remove(this.claimRelativePath);
	}
	async restore() {
		try {
			await this.recoverLinkedMove();
			if (!await this.exists(true)) return null;
			if (await this.exists()) return `source path already exists: ${this.sourcePath}`;
			await this.move(this.claimRelativePath, this.sourceRelativePath);
			return null;
		} catch (error) {
			return this.params.formatError?.(error) ?? String(error);
		}
	}
	async claim(params) {
		params.beforeClaim?.();
		await this.move(this.sourceRelativePath, this.claimRelativePath);
		const claimed = await this.read(true);
		if (!legacyMigrationSourceSnapshotsMatch(claimed, params.snapshot)) throw new Error(params.mismatchMessage);
		return claimed;
	}
	/** Drain both receipt-retired names through the caller's safe reader before removing them. */
	async removeRetiredSources(params) {
		let removed = 0;
		for (const claimed of [false, true]) {
			if (!await this.exists(claimed)) continue;
			const sourcePath = claimed ? this.claimPath : this.sourcePath;
			await (params.readSnapshot ?? this.params.readSnapshot)(sourcePath);
			if (params.removeSource) await params.removeSource(sourcePath);
			else await this.params.stateRoot.remove(claimed ? this.claimRelativePath : this.sourceRelativePath);
			removed += 1;
		}
		return removed;
	}
	async remove(params = {}) {
		if (!params.skipSourceCheck && await this.exists()) throw new Error(params.sourceReappearedMessage ?? `legacy source reappeared during import: ${this.sourcePath}`);
		if (params.removeSource) await params.removeSource(this.claimPath);
		else await this.params.stateRoot.remove(this.claimRelativePath);
		const sourceRemainingMessage = params.sourceRemainingMessage ?? params.remainingMessage;
		if (sourceRemainingMessage && await this.exists()) throw new Error(sourceRemainingMessage);
		const claimRemainingMessage = params.claimRemainingMessage ?? params.remainingMessage;
		if (claimRemainingMessage && await this.exists(true)) throw new Error(claimRemainingMessage);
	}
};
/** Restore claimed sources in reverse order so a failed multi-file import remains atomic. */
async function restoreLegacyMigrationSourceClaims(claims) {
	const errors = [];
	for (const claim of claims.toReversed()) {
		const error = await claim.restore();
		if (error) errors.push(error);
	}
	return errors;
}
/** Claim every source before SQLite writes; restore the full batch on the first mismatch. */
async function claimLegacyMigrationSourceClaims(claims, params) {
	params.beforeClaim?.();
	const claimed = [];
	try {
		for (const { claim, snapshot } of claims) {
			claimed.push(claim);
			await claim.claim({
				snapshot,
				mismatchMessage: params.mismatchMessage
			});
		}
	} catch (error) {
		const restoreErrors = await restoreLegacyMigrationSourceClaims(claimed);
		throw new Error(`${String(error)}${restoreErrors.length > 0 ? `; restore failures: ${restoreErrors.join("; ")}` : ""}`, { cause: error });
	}
}
function legacyMigrationSourceOrClaimMayExist(sourcePath, claimSuffix = ".doctor-importing") {
	return pathMayExistSync(sourcePath) || pathMayExistSync(`${sourcePath}${claimSuffix}`);
}
/** Constrain migration reads and moves to the original trusted state root. */
function resolveLegacyMigrationRelativePath(stateDir, filePath, label, includeFilePath = true) {
	const relativePath = path.relative(path.resolve(stateDir), path.resolve(filePath));
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) throw new Error(`legacy ${label} path is outside the state directory${includeFilePath ? `: ${filePath}` : ""}`);
	return relativePath;
}
/** Hash the exact bounded bytes returned by the symlink/hardlink-safe root. */
async function readLegacyMigrationSourceSnapshot(params) {
	const opened = await params.stateRoot.read(resolveLegacyMigrationRelativePath(params.stateDir, params.sourcePath, params.label), {
		hardlinks: "reject",
		maxBytes: params.maxBytes,
		symlinks: "reject"
	});
	const raw = opened.buffer.toString("utf8");
	return {
		buffer: opened.buffer,
		dev: opened.stat.dev,
		ino: opened.stat.ino,
		mtimeMs: opened.stat.mtimeMs,
		raw,
		sha256: createHash("sha256").update(params.hashDecodedText ? raw : opened.buffer).digest("hex"),
		size: opened.buffer.byteLength,
		sourcePath: params.sourcePath
	};
}
/** Read admitted legacy bytes; claim and cleanup owners verify the retained snapshot. */
function readLegacyMigrationSourceSnapshotSync(params) {
	const { buffer, stat } = readRegularFileSync({
		filePath: params.followSymlinks ? fs.realpathSync(params.sourcePath) : params.sourcePath,
		maxBytes: params.maxBytes
	});
	const raw = buffer.toString("utf8");
	return {
		buffer: Buffer.from(raw),
		dev: stat.dev,
		ino: stat.ino,
		mtimeMs: stat.mtimeMs,
		raw,
		sha256: createHash("sha256").update(raw).digest("hex"),
		size: buffer.byteLength,
		sourcePath: params.sourcePath
	};
}
/** Check source identity again before committing or deleting a verified import. */
function assertLegacyMigrationSourceUnchanged(params) {
	if (!legacyMigrationSourceSnapshotsMatch(readLegacyMigrationSourceSnapshotSync(params), params.snapshot)) throw new Error(`legacy ${params.label} source changed after doctor loaded it`);
}
/** Restore a claimed legacy source when verified cleanup cannot complete. */
function claimAndRemoveLegacyMigrationSource(params) {
	params.beforeClaim?.();
	const claimPath = `${params.sourcePath}.doctor-importing-${process.pid}-${randomUUID()}`;
	fs.renameSync(params.sourcePath, claimPath);
	try {
		if (!legacyMigrationSourceSnapshotsMatch(readLegacyMigrationSourceSnapshotSync({
			...params,
			sourcePath: claimPath
		}), params.snapshot)) throw new Error(`legacy ${params.label} source changed before doctor could claim it`);
		(params.removeSource ?? fs.unlinkSync)(claimPath);
	} catch (error) {
		let restoreFailure = "";
		try {
			params.beforeRestore?.();
			if (fs.existsSync(claimPath) && !fs.existsSync(params.sourcePath)) fs.renameSync(claimPath, params.sourcePath);
		} catch (restoreError) {
			restoreFailure = `; could not restore the claimed source at ${claimPath}: ${String(restoreError)}`;
		}
		throw new Error(`${String(error)}${restoreFailure}`, { cause: error });
	}
}
function legacyMigrationSourceSnapshotsMatch(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mtimeMs === right.mtimeMs && left.sha256 === right.sha256 && left.size === right.size;
}
function legacyMigrationSourceContentMatches(left, right) {
	return left.sha256 === right.sha256 && left.size === right.size;
}
//#endregion
export { legacyMigrationSourceOrClaimMayExist as a, readLegacyMigrationSourceSnapshotSync as c, claimLegacyMigrationSourceClaims as i, resolveLegacyMigrationRelativePath as l, assertLegacyMigrationSourceUnchanged as n, legacyMigrationSourceSnapshotsMatch as o, claimAndRemoveLegacyMigrationSource as r, readLegacyMigrationSourceSnapshot as s, LegacyMigrationSourceClaim as t, restoreLegacyMigrationSourceClaims as u };
