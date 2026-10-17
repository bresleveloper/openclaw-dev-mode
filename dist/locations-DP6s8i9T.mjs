import { h as parseSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
import { r as isMissingPathError, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { Fn as object, Jn as string, Pn as number, or as union, xn as literal } from "./schemas-BOYIvvln.mjs";
import { i as pinDirectory, o as publishFileNoClobber, s as requireDirectorySync, t as ensureDurableDirectory } from "./directory-durability-CqSvP1tc.mjs";
import { t as validateProviderSettings } from "./provider-settings-CR-jdYHV.mjs";
import { t as resolveStorageProvider } from "./storage-provider-registry-DusKBTCi.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createCipheriv, createDecipheriv, createHmac, hkdfSync, randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { root } from "@openclaw/fs-safe/root";
//#region src/storage/encryption.ts
const MAGIC = Buffer.from("OCSTOR1\n");
const STORAGE_SEGMENT_BYTES = 1048576;
const TAG_BYTES = 16;
const MAX_HEADER_BYTES = 1024;
/** Reads only the requested bounded window, even when the upstream chunks are uneven. */
var StreamReader = class {
	constructor(body) {
		this.chunk = /* @__PURE__ */ new Uint8Array();
		this.offset = 0;
		this.iterator = body[Symbol.asyncIterator]();
	}
	async read(maxBytes) {
		const result = Buffer.allocUnsafe(maxBytes);
		let used = 0;
		while (used < maxBytes) {
			if (this.offset === this.chunk.length) {
				const next = await this.iterator.next();
				if (next.done) break;
				this.chunk = next.value;
				this.offset = 0;
				if (this.chunk.length === 0) continue;
			}
			const count = Math.min(maxBytes - used, this.chunk.length - this.offset);
			result.set(this.chunk.subarray(this.offset, this.offset + count), used);
			used += count;
			this.offset += count;
		}
		return result.subarray(0, used);
	}
	async close() {
		await this.iterator.return?.();
	}
};
function headerBytes(objSalt, noncePrefix) {
	const json = Buffer.from(JSON.stringify({
		v: 1,
		objSalt: objSalt.toString("base64"),
		noncePrefix: noncePrefix.toString("base64"),
		segmentBytes: STORAGE_SEGMENT_BYTES
	}));
	const length = Buffer.alloc(4);
	length.writeUInt32BE(json.length);
	return Buffer.concat([
		MAGIC,
		length,
		json
	]);
}
const HEADER_BYTES = headerBytes(Buffer.alloc(32), Buffer.alloc(7)).length;
function encryptedStorageSize(plaintextBytes) {
	if (!Number.isSafeInteger(plaintextBytes) || plaintextBytes < 0) throw new Error("Storage size must be a nonnegative safe integer.");
	const segments = Math.floor(plaintextBytes / STORAGE_SEGMENT_BYTES) + 1;
	if (segments > 4294967296) throw new Error("Storage object exceeds the encryption segment limit.");
	return HEADER_BYTES + plaintextBytes + segments * TAG_BYTES;
}
function nonce(prefix, index, last) {
	if (index > 4294967295) throw new Error("Storage object exceeds the encryption segment limit.");
	const value = Buffer.alloc(12);
	prefix.copy(value);
	value.writeUInt32BE(index, 7);
	value[11] = last ? 1 : 0;
	return value;
}
async function* encryptStorageObject(body, masterKey) {
	const salt = randomBytes(32);
	const prefix = randomBytes(7);
	const header = headerBytes(salt, prefix);
	const key = Buffer.from(hkdfSync("sha256", masterKey, salt, "openclaw-storage v1 object", 32));
	const reader = new StreamReader(body);
	try {
		yield header;
		for (let index = 0;; index++) {
			const plaintext = await reader.read(STORAGE_SEGMENT_BYTES);
			const last = plaintext.length < STORAGE_SEGMENT_BYTES;
			const cipher = createCipheriv("aes-256-gcm", key, nonce(prefix, index, last));
			cipher.setAAD(header);
			yield Buffer.concat([
				cipher.update(plaintext),
				cipher.final(),
				cipher.getAuthTag()
			]);
			if (last) break;
		}
	} finally {
		key.fill(0);
		await reader.close();
	}
}
function decodeBase64(value, size) {
	if (typeof value !== "string") throw new Error("Invalid storage encryption header.");
	const decoded = Buffer.from(value, "base64");
	if (decoded.length !== size || decoded.toString("base64") !== value) throw new Error("Invalid storage encryption header.");
	return decoded;
}
async function readHeader(reader) {
	const preamble = await reader.read(MAGIC.length + 4);
	if (preamble.length !== MAGIC.length + 4 || !preamble.subarray(0, MAGIC.length).equals(MAGIC)) throw new Error("Invalid storage encryption magic.");
	const length = preamble.readUInt32BE(MAGIC.length);
	if (length === 0 || length > MAX_HEADER_BYTES) throw new Error("Invalid storage encryption header length.");
	const json = await reader.read(length);
	if (json.length !== length) throw new Error("Truncated storage encryption header.");
	const value = JSON.parse(json.toString("utf8"));
	if (!value || typeof value !== "object" || !("v" in value) || value.v !== 1 || !("segmentBytes" in value) || value.segmentBytes !== STORAGE_SEGMENT_BYTES || !("objSalt" in value) || !("noncePrefix" in value)) throw new Error("Unsupported storage encryption header.");
	return {
		header: Buffer.concat([preamble, json]),
		salt: decodeBase64(value.objSalt, 32),
		prefix: decodeBase64(value.noncePrefix, 7)
	};
}
async function* decryptStorageObject(body, masterKey) {
	const reader = new StreamReader(body);
	let key;
	try {
		const { header, salt, prefix } = await readHeader(reader);
		key = Buffer.from(hkdfSync("sha256", masterKey, salt, "openclaw-storage v1 object", 32));
		for (let index = 0;; index++) {
			const segment = await reader.read(1048592);
			if (segment.length < TAG_BYTES) throw new Error("Truncated storage object: missing final segment.");
			const last = segment.length < 1048592;
			const decipher = createDecipheriv("aes-256-gcm", key, nonce(prefix, index, last));
			decipher.setAAD(header);
			decipher.setAuthTag(segment.subarray(-16));
			const plaintext = Buffer.concat([decipher.update(segment.subarray(0, -16)), decipher.final()]);
			if (plaintext.length > 0) yield plaintext;
			if (last) return;
		}
	} finally {
		key?.fill(0);
		await reader.close();
	}
}
/** The fixed v1 header and segment tags make plaintext size a metadata-only calculation. */
function plaintextStorageSize(storedBytes) {
	if (!Number.isSafeInteger(storedBytes) || storedBytes < 0) throw new Error("Storage size must be a nonnegative safe integer.");
	const payloadBytes = storedBytes - HEADER_BYTES;
	const complete = Math.floor(payloadBytes / 1048592);
	const finalBytes = payloadBytes % 1048592;
	if (payloadBytes < TAG_BYTES || finalBytes < TAG_BYTES) throw new Error("Truncated storage object: missing final segment.");
	if (complete + 1 > 4294967296) throw new Error("Storage object exceeds the encryption segment limit.");
	return payloadBytes - (complete + 1) * TAG_BYTES;
}
//#endregion
//#region src/storage/keys.ts
/** Object keys stay portable across local filesystems and object stores. */
function validateStorageKey(key) {
	if (Buffer.byteLength(key) > 512 || !key.split("/").every((segment) => /^[A-Za-z0-9._-]+$/.test(segment) && segment !== "." && segment !== "..")) throw new Error("Storage keys must contain nonempty /-separated letters, digits, dots, underscores or hyphens, without . or .. segments, and be at most 512 bytes.");
}
function validateStoragePrefix(prefix) {
	if (prefix !== "") {
		validateStorageKey(prefix.endsWith("/") ? prefix.slice(0, -1) : prefix);
		if (Buffer.byteLength(prefix) > 512) throw new Error("Storage prefixes must be at most 512 bytes.");
	}
}
//#endregion
//#region src/storage/filesystem.ts
function validateSettings(settings) {
	if (typeof settings.path !== "string" || !path.isAbsolute(settings.path)) return "Filesystem storage settings.path must be an absolute directory path.";
	if (Object.keys(settings).some((key) => key !== "path")) return "Filesystem storage only accepts the path setting.";
}
function ignoreMissingPath(error) {
	if (!isMissingPathError(error)) throw error;
}
const filesystemStorageProvider = {
	id: "filesystem",
	label: "Filesystem",
	validateSettings,
	describeTarget: (settings) => typeof settings.path === "string" ? settings.path : void 0,
	async open({ settings, signal }) {
		const settingsError = validateSettings(settings);
		if (settingsError || typeof settings.path !== "string") throw new Error(settingsError ?? "Filesystem storage requires a path.");
		signal?.throwIfAborted();
		const directory = await pinDirectory(settings.path, { label: "Storage root directory" });
		try {
			const files = await root(directory.receipt.realPath, {
				symlinks: "reject",
				mutationSymlinks: "reject",
				hardlinks: "reject",
				mkdir: false
			});
			await directory.assertCurrent();
			const readers = /* @__PURE__ */ new Set();
			async function assertCurrent(operationSignal) {
				operationSignal?.throwIfAborted();
				await directory.assertCurrent();
			}
			const backend = {
				displayTarget: settings.path,
				async probe(opts) {
					await assertCurrent(opts?.signal);
					const stats = await fs.statfs(directory.receipt.realPath);
					await assertCurrent(opts?.signal);
					return {
						freeBytes: stats.bavail * stats.bsize,
						totalBytes: stats.blocks * stats.bsize
					};
				},
				async putObject(key, body, opts) {
					await assertCurrent(opts.signal);
					const parentKey = path.posix.dirname(key);
					const parentPath = path.join(files.rootReal, parentKey);
					if (parentKey !== ".") {
						const created = await ensureDurableDirectory({
							directoryPath: parentPath,
							label: "Storage object directory",
							create: async () => {
								await assertCurrent(opts.signal);
								await files.mkdir(parentKey);
							}
						});
						requireDirectorySync(created.parentSync, "Storage object directory");
					}
					await assertCurrent(opts.signal);
					const parent = await pinDirectory(parentPath, { label: "Storage object directory" });
					const temporaryKey = path.posix.join(parentKey, `.openclaw-put-${randomUUID()}.tmp~`);
					let temporaryCreated = false;
					let sizeBytes = 0;
					async function* measuredBody() {
						for await (const chunk of body) {
							opts.signal?.throwIfAborted();
							sizeBytes += chunk.byteLength;
							if (opts.sizeBytes !== void 0 && sizeBytes > opts.sizeBytes) throw new Error(`Storage object ${key} exceeds its declared size.`);
							yield chunk;
						}
						if (opts.sizeBytes !== void 0 && sizeBytes !== opts.sizeBytes) throw new Error(`Storage object ${key} does not match its declared size.`);
					}
					try {
						await files.create(temporaryKey, measuredBody(), {
							durable: "file",
							mkdir: false,
							mode: 384,
							maxBytes: opts.sizeBytes ?? Number.MAX_SAFE_INTEGER,
							signal: opts.signal
						});
						temporaryCreated = true;
						await parent.assertCurrent();
						await assertCurrent(opts.signal);
						await publishFileNoClobber(path.join(files.rootReal, temporaryKey), path.join(files.rootReal, key), {
							strategy: "link-required",
							moveSource: true,
							durability: "fail-closed"
						});
						temporaryCreated = false;
						requireDirectorySync(await parent.sync(), "Storage object directory");
						await assertCurrent(opts.signal);
						return { sizeBytes };
					} finally {
						try {
							if (temporaryCreated) {
								await directory.assertCurrent();
								await parent.assertCurrent();
								await files.remove(temporaryKey, { force: true });
								requireDirectorySync(await parent.sync(), "Storage object directory");
							}
						} finally {
							await parent.close();
						}
					}
				},
				async getObject(key, opts) {
					await assertCurrent(opts?.signal);
					const opened = await files.open(key).catch(ignoreMissingPath);
					if (!opened) return;
					const handle = opened.handle;
					readers.add(handle);
					return (async function* () {
						try {
							await assertCurrent(opts?.signal);
							while (true) {
								opts?.signal?.throwIfAborted();
								const buffer = Buffer.allocUnsafe(65536);
								const { bytesRead } = await handle.read(buffer, 0, buffer.length, null);
								if (bytesRead === 0) break;
								yield buffer.subarray(0, bytesRead);
							}
						} finally {
							readers.delete(handle);
							await handle.close();
						}
					})();
				},
				async statObject(key, opts) {
					await assertCurrent(opts?.signal);
					const stat = await files.stat(key).catch(ignoreMissingPath);
					await assertCurrent(opts?.signal);
					return stat?.isFile ? {
						key,
						sizeBytes: stat.size,
						modifiedAt: stat.mtimeMs
					} : void 0;
				},
				async *listObjects(prefix, opts) {
					await assertCurrent(opts?.signal);
					const parentKey = prefix.slice(0, prefix.lastIndexOf("/") + 1).replace(/\/$/u, "");
					if (!(await files.stat(parentKey || ".").catch(ignoreMissingPath))?.isDirectory) return;
					for await (const entry of files.walk(parentKey, {
						symlinkPolicy: "skip",
						signal: opts?.signal,
						order: "filesystem",
						entryFilter(candidate) {
							try {
								validateStorageKey(candidate.relativePath);
							} catch {
								return "skip-subtree";
							}
							return "include";
						}
					})) {
						if (entry.kind !== "file" || !entry.relativePath.startsWith(prefix)) continue;
						const stat = await backend.statObject(entry.relativePath, opts);
						if (stat) yield stat;
					}
				},
				async deleteObject(key, opts) {
					await assertCurrent(opts?.signal);
					if (!await backend.statObject(key, opts)) return;
					const parent = await pinDirectory(path.dirname(path.join(files.rootReal, key)));
					try {
						await assertCurrent(opts?.signal);
						await files.remove(key, {
							force: true,
							signal: opts?.signal
						});
						requireDirectorySync(await parent.sync(), "Storage object directory");
					} finally {
						await parent.close();
					}
				},
				async close() {
					try {
						await Promise.all([...readers].map((handle) => handle.close()));
					} finally {
						readers.clear();
						await directory.close();
					}
				}
			};
			return backend;
		} catch (error) {
			await directory.close();
			throw error;
		}
	}
};
//#endregion
//#region src/storage/marker.ts
const STORAGE_MARKER_KEY = "openclaw-storage.json";
const KEY_CHECK = "openclaw-storage key check v1";
const base64 = (bytes) => string().refine((value) => {
	const decoded = Buffer.from(value, "base64");
	return decoded.length === bytes && decoded.toString("base64") === value;
});
const markerSchema = object({
	version: literal(1),
	locationId: string().uuid(),
	createdAt: number().int().nonnegative(),
	encryption: union([literal("none"), object({
		kdf: literal("scrypt"),
		salt: base64(16),
		N: literal(32768),
		r: literal(8),
		p: literal(1),
		keyCheck: base64(32)
	}).strict()])
}).strict();
var StorageLocationError = class extends Error {
	constructor(state, message) {
		super(message);
		this.name = "StorageLocationError";
		this.state = state;
	}
};
const cacheFingerprintKey = randomBytes(32);
const masterKeys = /* @__PURE__ */ new Map();
function deriveMasterKey(locationName, passphrase, salt) {
	const fingerprint = createHmac("sha256", cacheFingerprintKey).update(salt).update("\0").update(passphrase).digest("hex");
	const cached = masterKeys.get(locationName);
	if (cached?.fingerprint === fingerprint) return cached.key;
	const key = new Promise((resolve, reject) => {
		scrypt(passphrase, Buffer.from(salt, "base64"), 32, {
			N: 32768,
			r: 8,
			p: 1,
			maxmem: 67108864
		}, (error, derived) => {
			if (error) reject(error);
			else resolve(derived);
		});
	});
	masterKeys.set(locationName, {
		fingerprint,
		key
	});
	key.catch(() => {
		if (masterKeys.get(locationName)?.key === key) masterKeys.delete(locationName);
	});
	return key;
}
async function readStorageMarker(backend, signal) {
	const body = await backend.getObject(STORAGE_MARKER_KEY, { signal });
	if (!body) return;
	const chunks = [];
	let size = 0;
	for await (const chunk of body) {
		size += chunk.byteLength;
		if (size > 4096) throw new StorageLocationError("error", "Storage marker exceeds 4096 bytes.");
		chunks.push(Buffer.from(chunk));
	}
	try {
		return markerSchema.parse(JSON.parse(Buffer.concat(chunks).toString("utf8")));
	} catch {
		throw new StorageLocationError("error", "Invalid storage location marker.");
	}
}
async function verifyStorageMarker(name, marker, passphrase) {
	if (marker.encryption === "none") {
		if (passphrase !== void 0) throw new StorageLocationError("wrong-key", `Storage location "${name}" was initialized without encryption; restore its original encryption configuration.`);
		return;
	}
	if (passphrase === void 0) throw new StorageLocationError("wrong-key", `Storage location "${name}" requires its original encryption passphrase.`);
	const masterKey = await deriveMasterKey(name, passphrase, marker.encryption.salt);
	const expected = Buffer.from(marker.encryption.keyCheck, "base64");
	const actual = createHmac("sha256", masterKey).update(KEY_CHECK).digest();
	if (!timingSafeEqual(expected, actual)) throw new StorageLocationError("wrong-key", `Wrong encryption passphrase for storage location "${name}".`);
	return masterKey;
}
async function createStorageMarker(name, passphrase) {
	const marker = {
		version: 1,
		locationId: randomUUID(),
		createdAt: Date.now(),
		encryption: "none"
	};
	if (passphrase !== void 0) {
		const salt = randomBytes(16).toString("base64");
		const key = await deriveMasterKey(name, passphrase, salt);
		marker.encryption = {
			kdf: "scrypt",
			salt,
			N: 32768,
			r: 8,
			p: 1,
			keyCheck: createHmac("sha256", key).update(KEY_CHECK).digest("base64")
		};
	}
	return marker;
}
//#endregion
//#region src/storage/provider.ts
async function acquireStorageProvider(params) {
	if (params.providerId === "filesystem") return {
		provider: filesystemStorageProvider,
		release: async () => {}
	};
	if (params.registry) {
		const provider = resolveStorageProvider(params.registry, params.providerId);
		if (!provider) throw new Error(`Storage provider "${params.providerId}" is not loaded; check its plugin configuration.`);
		return {
			provider,
			registry: params.registry,
			release: async () => {}
		};
	}
	const { applyPluginAutoEnable } = await import("./plugin-auto-enable-mg-NiK4N.mjs");
	const enabled = applyPluginAutoEnable({
		config: params.config,
		env: params.env ?? process.env
	});
	const { resolveManifestContractRuntimePluginResolution } = await import("./manifest-contract-runtime-BzEF6Gnk.mjs");
	const resolution = resolveManifestContractRuntimePluginResolution({
		cfg: enabled.config,
		contract: "storageProviders",
		value: params.providerId
	});
	if (resolution.pluginIds.length === 0) throw new Error(`Storage provider "${params.providerId}" is unavailable; install and enable its plugin.`);
	const { acquirePluginRegistryForInspection } = await import("./plugins/loader.js");
	const acquisition = await acquirePluginRegistryForInspection({
		config: enabled.config,
		autoEnabledReasons: enabled.autoEnabledReasons,
		onlyPluginIds: resolution.pluginIds
	});
	try {
		const provider = resolveStorageProvider(acquisition.registry, params.providerId);
		if (!provider) throw new Error(`Plugin did not register storage provider "${params.providerId}".`);
		return {
			provider,
			registry: acquisition.registry,
			release: acquisition.release
		};
	} catch (error) {
		await acquisition.release();
		throw error;
	}
}
//#endregion
//#region src/storage/locations.ts
function configuredLocation(params) {
	if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(params.name)) throw new StorageLocationError("error", "Invalid storage location name.");
	const location = params.config.storage?.locations?.[params.name];
	if (!location) throw new StorageLocationError("error", `Storage location "${params.name}" is not configured.`);
	return location;
}
function unavailable(name, displayTarget) {
	return new StorageLocationError("unavailable", `Storage location "${name}"${displayTarget ? ` (${displayTarget})` : ""} has no initialization marker. If this is a new location, run \`openclaw storage init ${name}\`; otherwise reconnect the disk or check the bucket and prefix.`);
}
function storageLocationError(error) {
	if (error instanceof StorageLocationError) return error;
	if (isMissingPathError(error) || hasErrnoCode(error, "path-mismatch")) return new StorageLocationError("unavailable", "Storage directory is unavailable. Reconnect the disk and check the configured path; storage init requires an existing directory.");
	return new StorageLocationError("error", "Storage could not be accessed. Check its provider settings, credentials, and connection.");
}
function probeFailure(error) {
	const { state, message } = storageLocationError(error);
	return {
		state,
		message
	};
}
async function prepare(params) {
	params.signal?.throwIfAborted();
	const location = configuredLocation(params);
	const invalid = validateProviderSettings(location.settings, "Storage location");
	if (invalid) throw new StorageLocationError("error", invalid);
	const acquired = await acquireStorageProvider({
		providerId: location.provider,
		config: params.config,
		registry: params.registry,
		env: params.env
	}).catch((error) => {
		throw storageLocationError(error);
	});
	try {
		const message = acquired.provider.validateSettings?.(location.settings);
		if (message) throw new StorageLocationError("error", message);
		const env = params.env ?? process.env;
		let passphrase;
		if (location.encryption !== "none") {
			const { materializeSecretInput } = await import("./resolve-secret-input-string-QXAP01HZ.mjs");
			passphrase = await materializeSecretInput({
				config: params.config,
				value: location.encryption.passphrase,
				env,
				normalize: (value) => typeof value === "string" && value.length > 0 ? value : void 0
			});
		}
		if (location.encryption !== "none" && passphrase === void 0) throw new StorageLocationError("wrong-key", `Storage location "${params.name}" requires a nonempty encryption passphrase.`);
		const backend = await acquired.provider.open({
			locationName: params.name,
			settings: location.settings,
			signal: params.signal,
			resolveSecret: async (value) => {
				const ref = parseSecretRef(value, params.config.secrets?.defaults);
				if (!ref) throw new Error("Storage provider credentials must use SecretRefs.");
				const { resolveSecretRefString } = await import("./resolve-DEBHb_eE.mjs");
				return await resolveSecretRefString(ref, {
					config: params.config,
					env
				});
			}
		});
		let closed = false;
		const close = async () => {
			if (closed) return;
			closed = true;
			try {
				try {
					await backend.close?.();
				} finally {
					await acquired.release();
				}
			} catch (error) {
				throw storageLocationError(error);
			}
		};
		return {
			backend,
			passphrase,
			provider: location.provider,
			close
		};
	} catch (error) {
		await acquired.release().catch((releaseError) => {
			throw storageLocationError(releaseError);
		});
		throw storageLocationError(error);
	}
}
async function makeLocation(params, prepared, marker) {
	const { backend, passphrase } = prepared;
	const masterKey = await verifyStorageMarker(params.name, marker, passphrase);
	let closed = false;
	const markerIdentity = JSON.stringify(marker);
	const assertOpen = (signal) => {
		signal?.throwIfAborted();
		if (closed) throw new StorageLocationError("unavailable", "Storage location is closed.");
	};
	const check = async (signal) => {
		assertOpen(signal);
		const current = await readStorageMarker(backend, signal).catch((error) => {
			throw storageLocationError(error);
		});
		if (!current) throw unavailable(params.name, backend.displayTarget);
		if (JSON.stringify(current) !== markerIdentity) throw new StorageLocationError("unavailable", `Storage location "${params.name}" identity changed; reopen the location before using it.`);
		assertOpen(signal);
	};
	const info = (object) => ({
		...object,
		storedBytes: object.sizeBytes,
		sizeBytes: masterKey ? plaintextStorageSize(object.sizeBytes) : object.sizeBytes
	});
	const scoped = (namespace) => {
		const keyFor = (key) => {
			validateStorageKey(key);
			const fullKey = namespace + key;
			validateStorageKey(fullKey);
			if (fullKey === "openclaw-storage.json") throw new Error("The storage marker is reserved for the storage owner.");
			return fullKey;
		};
		const options = (opts) => ({ signal: opts?.signal ?? params.signal });
		return {
			describe: () => ({
				name: params.name,
				provider: prepared.provider,
				displayTarget: backend.displayTarget,
				locationId: marker.locationId,
				encrypted: masterKey !== void 0
			}),
			probe: async (opts) => {
				try {
					const operation = options(opts);
					await check(operation.signal);
					return {
						state: "ok",
						...await backend.probe(operation)
					};
				} catch (error) {
					return probeFailure(error);
				}
			},
			putObject: async (key, body, opts) => {
				const fullKey = keyFor(key);
				const operation = options(opts);
				if (opts.sizeBytes !== void 0) encryptedStorageSize(opts.sizeBytes);
				await check(operation.signal);
				let plaintextBytes = 0;
				let preconditionFailure;
				async function* counted() {
					for await (const chunk of body) {
						operation.signal?.throwIfAborted();
						plaintextBytes += chunk.byteLength;
						if (opts.sizeBytes !== void 0 && plaintextBytes > opts.sizeBytes) throw new Error("Storage object is larger than its declared size.");
						yield chunk;
					}
					if (opts.sizeBytes !== void 0 && plaintextBytes !== opts.sizeBytes) throw new Error("Storage object does not match its declared size.");
					await check(operation.signal);
					try {
						await opts.precondition?.(operation.signal);
						assertOpen(operation.signal);
					} catch (error) {
						preconditionFailure = { error };
						throw error;
					}
				}
				const stored = await backend.putObject(fullKey, masterKey ? encryptStorageObject(counted(), masterKey) : counted(), {
					...operation,
					sizeBytes: opts.sizeBytes === void 0 ? void 0 : masterKey ? encryptedStorageSize(opts.sizeBytes) : opts.sizeBytes
				}).catch((error) => {
					if (!preconditionFailure || error === preconditionFailure.error) throw error;
					throw new Error(`${formatErrorMessage(preconditionFailure.error)}\n${formatErrorMessage(error)}`, { cause: error });
				});
				return {
					sizeBytes: plaintextBytes,
					storedBytes: stored.sizeBytes
				};
			},
			getObject: async (key, opts) => {
				const fullKey = keyFor(key);
				const operation = options(opts);
				await check(operation.signal);
				const body = await backend.getObject(fullKey, operation);
				return body && masterKey ? decryptStorageObject(body, masterKey) : body;
			},
			stat: async (key, opts) => {
				const fullKey = keyFor(key);
				const operation = options(opts);
				assertOpen(operation.signal);
				const object = await backend.statObject(fullKey, operation);
				assertOpen(operation.signal);
				return object ? {
					...info(object),
					key
				} : void 0;
			},
			async *list(prefix, opts) {
				const requestedPrefix = prefix ?? "";
				validateStoragePrefix(requestedPrefix);
				const fullPrefix = namespace + requestedPrefix;
				validateStoragePrefix(fullPrefix);
				const operation = options(opts);
				assertOpen(operation.signal);
				for await (const object of backend.listObjects(fullPrefix, operation)) {
					assertOpen(operation.signal);
					if (!object.key.startsWith(fullPrefix)) throw new Error("Storage provider returned an object outside the requested prefix.");
					try {
						validateStorageKey(object.key);
					} catch {
						continue;
					}
					const key = object.key.slice(namespace.length);
					if (object.key !== "openclaw-storage.json" && (!opts?.acceptKey || opts.acceptKey(key))) yield {
						...info(object),
						key
					};
				}
			},
			delete: async (key, opts) => {
				const fullKey = keyFor(key);
				const operation = options(opts);
				await check(operation.signal);
				await opts?.precondition?.(operation.signal);
				assertOpen(operation.signal);
				await backend.deleteObject(fullKey, operation);
			},
			scope: (prefix) => {
				const next = keyFor(prefix) + "/";
				validateStoragePrefix(next);
				return scoped(next);
			},
			close: async () => {
				closed = true;
				await prepared.close();
			}
		};
	};
	return scoped("");
}
async function openStorageLocation(params) {
	const prepared = await prepare(params);
	try {
		const marker = await readStorageMarker(prepared.backend, params.signal);
		if (!marker) throw unavailable(params.name, prepared.backend.displayTarget);
		return await makeLocation(params, prepared, marker);
	} catch (error) {
		await prepared.close();
		throw storageLocationError(error);
	}
}
async function initStorageLocation(params) {
	const prepared = await prepare(params);
	try {
		let marker = await readStorageMarker(prepared.backend, params.signal);
		if (!marker) {
			const candidate = await createStorageMarker(params.name, prepared.passphrase);
			const bytes = Buffer.from(JSON.stringify(candidate) + "\n");
			try {
				await prepared.backend.putObject(STORAGE_MARKER_KEY, (async function* () {
					yield bytes;
				})(), {
					sizeBytes: bytes.length,
					signal: params.signal
				});
				marker = candidate;
			} catch (error) {
				marker = await readStorageMarker(prepared.backend, params.signal);
				if (!marker || marker.locationId === candidate.locationId) throw error;
			}
		}
		return await makeLocation(params, prepared, marker);
	} catch (error) {
		await prepared.close();
		throw storageLocationError(error);
	}
}
async function probeStorageLocation(params) {
	try {
		const location = await openStorageLocation(params);
		try {
			return await location.probe();
		} finally {
			await location.close();
		}
	} catch (error) {
		return probeFailure(error);
	}
}
/** Configuration projection only; no provider activation or destination I/O. */
function listStorageLocations(config, registry) {
	return Object.entries(config.storage?.locations ?? {}).toSorted(([a], [b]) => a.localeCompare(b)).map(([name, location]) => {
		const displayTarget = (location.provider === "filesystem" ? filesystemStorageProvider : registry ? resolveStorageProvider(registry, location.provider) : void 0)?.describeTarget?.(location.settings);
		const description = {
			name,
			provider: location.provider,
			encrypted: location.encryption !== "none"
		};
		return displayTarget === void 0 ? description : Object.assign(description, { displayTarget });
	});
}
//#endregion
export { storageLocationError as a, probeStorageLocation as i, listStorageLocations as n, acquireStorageProvider as o, openStorageLocation as r, initStorageLocation as t };
