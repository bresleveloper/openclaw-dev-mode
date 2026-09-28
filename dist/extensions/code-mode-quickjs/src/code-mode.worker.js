import { c as isRecord } from "../../../record-coerce-DItp3I4t.mjs";
import { t as _usingCtx } from "../../../usingCtx-CoYZqMqE.mjs";
import { n as serveWorkerTasks } from "../../../worker-task-server-CwtaNZgU.mjs";
import { a as normalizeSourceStack, i as buildUserSource, n as SOURCE_LOCATION_KEY, o as CODE_MODE_CONTROLLER_SOURCE, r as USER_SOURCE_FILE, t as prepareSource } from "../../../code-mode-source-Bw0nRM9I.mjs";
import { a as captureCodeModeValue, i as captureCodeModeOutput, n as EMPTY_CODE_MODE_OUTPUT, r as boundCodeModeError } from "../../../code-mode-json-Cek5lI0P.mjs";
import { n as ToolInputError } from "../../../tool-input-error-mjW74R8m.mjs";
import "../../../worker-task-server-WYdiFYES.mjs";
import "../../../string-coerce-runtime-C_MKhRVt.mjs";
import "../../../code-mode-executor-runtime-yvGkOpkE.mjs";
//#region node_modules/.pnpm/quickjs-wasi@3.6.0/node_modules/quickjs-wasi/dist/wasi-shim.js
/**
* Minimal WASI shim for running QuickJS in any WebAssembly environment.
*
* Implements the subset of WASI snapshot_preview1 that QuickJS needs:
*   - clock_time_get (for Date.now() and Math.random() PRNG seeding)
*   - fd_write (for QuickJS runtime internal logging)
*   - fd_close (stub)
*   - fd_fdstat_get (stub)
*   - fd_seek (stub)
*   - random_get (for crypto extension and WASI libc init)
*
* Users can override any of these by providing their own implementations
* in the `wasi` option when creating a VM. Overrides are applied to both
* the main module and all loaded extensions.
*/
/** Returns a wasi_snapshot_preview1 import object with built-in defaults. */
function createWasiShim(memoryAccessor) {
	const ERRNO_SUCCESS = 0;
	const ERRNO_BADF = 8;
	const ERRNO_NOSYS = 52;
	const CLOCK_REALTIME = 0;
	const CLOCK_MONOTONIC = 1;
	return {
		clock_time_get(clockId, _precision, resultPtr) {
			const mem = memoryAccessor();
			const view = new DataView(mem.buffer);
			if (clockId === CLOCK_REALTIME || clockId === CLOCK_MONOTONIC) {
				const timeNs = BigInt(Date.now()) * 1000000n;
				view.setBigUint64(resultPtr, timeNs, true);
				return ERRNO_SUCCESS;
			}
			return ERRNO_NOSYS;
		},
		fd_write(fd, iovsPtr, iovsLen, nwrittenPtr) {
			const mem = memoryAccessor();
			const view = new DataView(mem.buffer);
			const bytes = new Uint8Array(mem.buffer);
			let totalWritten = 0;
			if (fd !== 1 && fd !== 2) return ERRNO_BADF;
			for (let i = 0; i < iovsLen; i++) {
				const bufPtr = view.getUint32(iovsPtr + i * 8, true);
				const bufLen = view.getUint32(iovsPtr + i * 8 + 4, true);
				const chunk = bytes.slice(bufPtr, bufPtr + bufLen);
				const text = new TextDecoder().decode(chunk);
				if (fd === 1) {
					if (typeof process !== "undefined" && process.stdout) process.stdout.write(text);
					else console.log(text);
				} else if (typeof process !== "undefined" && process.stderr) process.stderr.write(text);
				else console.error(text);
				totalWritten += bufLen;
			}
			view.setUint32(nwrittenPtr, totalWritten, true);
			return ERRNO_SUCCESS;
		},
		fd_close(_fd) {
			return ERRNO_NOSYS;
		},
		fd_fdstat_get(fd, statPtr) {
			const mem = memoryAccessor();
			const view = new DataView(mem.buffer);
			if (fd === 1 || fd === 2) {
				view.setUint8(statPtr, 2);
				view.setUint16(statPtr + 2, 0, true);
				view.setBigUint64(statPtr + 8, 0n, true);
				view.setBigUint64(statPtr + 16, 0n, true);
				return ERRNO_SUCCESS;
			}
			return ERRNO_BADF;
		},
		fd_seek(_fd, _offset, _whence, _resultPtr) {
			return ERRNO_NOSYS;
		},
		random_get(bufPtr, bufLen) {
			const mem = memoryAccessor();
			const bytes = new Uint8Array(mem.buffer, bufPtr, bufLen);
			if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
			else for (let i = 0; i < bufLen; i++) bytes[i] = Math.floor(Math.random() * 256);
			return ERRNO_SUCCESS;
		}
	};
}
//#endregion
//#region node_modules/.pnpm/quickjs-wasi@3.6.0/node_modules/quickjs-wasi/dist/extensions.js
/**
* WASM Dynamic Linking - Extension Loader
*
* Loads WASM shared libraries (.so) compiled with wasi-sdk as extensions
* for the QuickJS WASM runtime. Extensions can call QuickJS C API functions
* directly through dynamic linking (shared memory + symbol resolution).
*
* Key concepts:
* - Extensions are WASM shared libraries with a `dylink.0` custom section
* - They share linear memory and the indirect function table with the main module
* - Symbol imports (env.*) are resolved against the main module's exports
* - Each extension gets a unique __memory_base and __table_base
* - Extensions export an init function (e.g., `qjs_ext_url_init`)
*/
const decoder = new TextDecoder();
/**
* Parse a null-terminated "key=value\nkey=value" string from WASM memory
* into a Record<string, string>. Used to read version info from extensions.
*/
function parseVersionString(memory, ptr) {
	const mem = new Uint8Array(memory.buffer);
	let end = ptr;
	while (mem[end] !== 0) end++;
	if (end === ptr) return {};
	const str = decoder.decode(mem.slice(ptr, end));
	const result = {};
	for (const line of str.split("\n")) {
		const eq = line.indexOf("=");
		if (eq > 0) result[line.slice(0, eq)] = line.slice(eq + 1);
	}
	return result;
}
/**
* Check if an extension exports a versions function and parse the result.
*/
function extractExtensionVersions(ext, memory) {
	const versionsFnName = `qjs_ext_${ext.name.replace(/-/g, "_")}_versions`;
	const versionsFn = ext.instance.exports[versionsFnName];
	if (typeof versionsFn !== "function") return void 0;
	const ptr = versionsFn();
	if (ptr === 0) return void 0;
	return parseVersionString(memory, ptr);
}
/** Read a ULEB128-encoded integer from a byte array */
function readULEB128(bytes, offset) {
	let result = 0;
	let shift = 0;
	while (offset.value < bytes.length) {
		const byte = bytes[offset.value++];
		result |= (byte & 127) << shift;
		if ((byte & 128) === 0) break;
		shift += 7;
	}
	return result;
}
/** Parse the dylink.0 custom section from a WASM module */
function parseDylink(module) {
	const sections = WebAssembly.Module.customSections(module, "dylink.0");
	if (sections.length === 0) return null;
	const bytes = new Uint8Array(sections[0]);
	const offset = { value: 0 };
	const info = {
		memorySize: 0,
		memoryAlignment: 0,
		tableSize: 0,
		tableAlignment: 0,
		needed: []
	};
	while (offset.value < bytes.length) {
		const subsectionType = readULEB128(bytes, offset);
		const subsectionSize = readULEB128(bytes, offset);
		const subsectionEnd = offset.value + subsectionSize;
		if (subsectionType === 1) {
			info.memorySize = readULEB128(bytes, offset);
			info.memoryAlignment = readULEB128(bytes, offset);
			info.tableSize = readULEB128(bytes, offset);
			info.tableAlignment = readULEB128(bytes, offset);
		} else if (subsectionType === 2) {
			const count = readULEB128(bytes, offset);
			for (let i = 0; i < count; i++) {
				const len = readULEB128(bytes, offset);
				const name = new TextDecoder().decode(bytes.slice(offset.value, offset.value + len));
				offset.value += len;
				info.needed.push(name);
			}
		}
		offset.value = subsectionEnd;
	}
	return info;
}
/**
* Load a WASM shared library extension and link it against the main module.
*
* @param descriptor - Extension description (name, wasm bytes, init function)
* @param mainExports - The main QuickJS WASM module's exports
* @param wasiBuiltins - Built-in WASI implementations (lowest priority)
* @param wasiUserOverrides - User-provided WASI overrides (highest priority)
* @param memoryProxy - A memory proxy for extension WASI factories
* @param allocBase - Optional fixed memory/table bases (for snapshot restore)
*/
async function loadExtension(descriptor, mainExports, wasiBuiltins, wasiUserOverrides, memoryProxy, allocBase) {
	let module;
	if (descriptor.wasm instanceof WebAssembly.Module) module = descriptor.wasm;
	else module = await WebAssembly.compile(descriptor.wasm);
	const dylink = parseDylink(module);
	if (!dylink) throw new Error(`Extension "${descriptor.name}" is not a WASM shared library (missing dylink.0 section)`);
	const memory = mainExports.memory;
	const table = mainExports.__indirect_function_table;
	const stackPointer = mainExports.__stack_pointer;
	const mallocFn = mainExports.malloc;
	if (!memory) throw new Error("Main module does not export memory");
	if (!table) throw new Error("Main module does not export __indirect_function_table");
	if (!mallocFn) throw new Error("Main module does not export malloc");
	let memoryBase;
	let tableBase;
	if (allocBase) {
		memoryBase = allocBase.memoryBase;
		tableBase = allocBase.tableBase;
	} else if (dylink.memorySize > 0) {
		memoryBase = mallocFn(dylink.memorySize);
		if (memoryBase === 0) throw new Error(`Failed to allocate ${dylink.memorySize} bytes for extension "${descriptor.name}"`);
		new Uint8Array(memory.buffer, memoryBase, dylink.memorySize).fill(0);
	} else memoryBase = 0;
	if (allocBase) {
		tableBase = allocBase.tableBase;
		if (tableBase + dylink.tableSize > table.length) table.grow(tableBase + dylink.tableSize - table.length);
	} else {
		tableBase = table.length;
		if (dylink.tableSize > 0) table.grow(dylink.tableSize);
	}
	const extImports = WebAssembly.Module.imports(module);
	const importObj = {
		env: {},
		"GOT.mem": {},
		"GOT.func": {}
	};
	if (extImports.some((imp) => imp.module === "wasi_snapshot_preview1")) {
		const extWasi = descriptor.wasi && memoryProxy ? descriptor.wasi(memoryProxy) : void 0;
		importObj["wasi_snapshot_preview1"] = {
			...wasiBuiltins,
			...extWasi,
			...wasiUserOverrides
		};
	}
	const extExportNames = new Set(WebAssembly.Module.exports(module).filter((e) => e.kind === "function").map((e) => e.name));
	const unresolvedFuncs = /* @__PURE__ */ new Set();
	for (const imp of extImports) if (imp.module === "env") {
		if (imp.name === "memory" && imp.kind === "memory") importObj.env.memory = memory;
		else if (imp.name === "__indirect_function_table" && imp.kind === "table") importObj.env.__indirect_function_table = table;
		else if (imp.name === "__memory_base" && imp.kind === "global") importObj.env.__memory_base = new WebAssembly.Global({
			value: "i32",
			mutable: false
		}, memoryBase);
		else if (imp.name === "__table_base" && imp.kind === "global") importObj.env.__table_base = new WebAssembly.Global({
			value: "i32",
			mutable: false
		}, tableBase);
		else if (imp.name === "__stack_pointer" && imp.kind === "global") importObj.env.__stack_pointer = stackPointer;
		else if (imp.kind === "function") {
			const resolved = mainExports[imp.name];
			if (resolved && typeof resolved === "function") importObj.env[imp.name] = resolved;
			else {
				unresolvedFuncs.add(imp.name);
				importObj.env[imp.name] = () => {
					throw new Error(`Extension "${descriptor.name}" called unresolved symbol: env.${imp.name}`);
				};
			}
		} else if (imp.kind === "global") {
			const resolved = mainExports[imp.name];
			if (resolved instanceof WebAssembly.Global) importObj.env[imp.name] = resolved;
			else importObj.env[imp.name] = new WebAssembly.Global({
				value: "i32",
				mutable: true
			}, 0);
		}
	} else if (imp.module === "GOT.mem" && imp.kind === "global") importObj["GOT.mem"][imp.name] = new WebAssembly.Global({
		value: "i32",
		mutable: true
	}, 0);
	else if (imp.module === "GOT.func" && imp.kind === "global") {
		const resolved = mainExports[imp.name];
		if (resolved && typeof resolved === "function") {
			const idx = table.length;
			table.grow(1);
			table.set(idx, resolved);
			importObj["GOT.func"][imp.name] = new WebAssembly.Global({
				value: "i32",
				mutable: true
			}, idx);
		} else importObj["GOT.func"][imp.name] = new WebAssembly.Global({
			value: "i32",
			mutable: true
		}, 0);
	}
	const selfResolvable = [...unresolvedFuncs].filter((name) => extExportNames.has(name));
	const wrappers = {};
	for (const name of selfResolvable) {
		const wrapper = { target: null };
		wrappers[name] = wrapper;
		importObj.env[name] = (...args) => {
			if (!wrapper.target) throw new Error(`Extension "${descriptor.name}" called unresolved symbol during init: env.${name}`);
			return wrapper.target(...args);
		};
	}
	const instance = await WebAssembly.instantiate(module, importObj);
	const extExports = instance.exports;
	for (const name of selfResolvable) {
		const selfExport = extExports[name];
		if (typeof selfExport === "function") wrappers[name].target = selfExport;
	}
	if (typeof extExports.__wasm_apply_data_relocs === "function") extExports.__wasm_apply_data_relocs();
	if (typeof extExports.__wasm_call_ctors === "function") extExports.__wasm_call_ctors();
	const initFn = descriptor.initFn ?? `qjs_ext_${descriptor.name.replace(/-/g, "_")}_init`;
	const ext = {
		name: descriptor.name,
		module,
		instance,
		dylink,
		memoryBase,
		tableBase,
		initFn
	};
	ext.versions = extractExtensionVersions(ext, memory);
	return ext;
}
/**
* Call the extension's init function, passing the JSContext and JSRuntime
* pointers from the main module.
*/
function initExtension(ext, mainExports) {
	const initFunc = ext.instance.exports[ext.initFn];
	if (typeof initFunc !== "function") throw new Error(`Extension "${ext.name}" does not export init function "${ext.initFn}"`);
	const result = initFunc(mainExports.qjs_get_context_ptr(), mainExports.qjs_get_runtime_ptr());
	if (result !== 0) throw new Error(`Extension "${ext.name}" init function returned error code ${result}`);
}
/**
* Re-instantiate extensions for snapshot restore.
*
* During restore, we need to:
* 1. Instantiate extension modules with the same memory/table bases
* 2. Let them populate the function table (via elem segments and __wasm_apply_data_relocs)
* 3. Do NOT call the init function (the state is already in the snapshot memory)
*
* This reconstructs the function table entries that extensions need, without
* modifying linear memory (which will be overwritten by the snapshot).
*/
async function restoreExtensions(descriptors, extensionMeta, mainExports, wasiBuiltins, wasiUserOverrides, memoryProxy) {
	const loaded = [];
	for (const meta of extensionMeta) {
		const descriptor = descriptors.find((d) => d.name === meta.name);
		if (!descriptor) throw new Error(`Extension "${meta.name}" required by snapshot but not provided`);
		const ext = await loadExtension(descriptor, mainExports, wasiBuiltins, wasiUserOverrides, memoryProxy, {
			memoryBase: meta.memoryBase,
			tableBase: meta.tableBase
		});
		ext.initFn = meta.initFn;
		loaded.push(ext);
	}
	return loaded;
}
//#endregion
//#region node_modules/.pnpm/quickjs-wasi@3.6.0/node_modules/quickjs-wasi/dist/version.js
const VERSION = "3.6.0";
//#endregion
//#region node_modules/.pnpm/quickjs-wasi@3.6.0/node_modules/quickjs-wasi/dist/index.js
/**
* QuickJS WASM - A snapshotable JavaScript runtime via WebAssembly.
*
* Provides a clean JavaScript API for running sandboxed JS code in a QuickJS
* VM compiled to WASM. The key differentiator is the ability to snapshot the
* entire VM state (including pending promises) and restore it in a fresh
* WASM instance.
*/
var __addDisposableResource = function(env, value, async) {
	if (value !== null && value !== void 0) {
		if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
		var dispose, inner;
		if (async) {
			if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
			dispose = value[Symbol.asyncDispose];
		}
		if (dispose === void 0) {
			if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
			dispose = value[Symbol.dispose];
			if (async) inner = dispose;
		}
		if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
		if (inner) dispose = function() {
			try {
				inner.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		};
		env.stack.push({
			value,
			dispose,
			async
		});
	} else if (async) env.stack.push({ async: true });
	return value;
};
var __disposeResources = (function(SuppressedError) {
	return function(env) {
		function fail(e) {
			env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
			env.hasError = true;
		}
		var r, s = 0;
		function next() {
			while (r = env.stack.pop()) try {
				if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
				if (r.dispose) {
					var result = r.dispose.call(r.value);
					if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
						fail(e);
						return next();
					});
				} else s |= 1;
			} catch (e) {
				fail(e);
			}
			if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
			if (env.hasError) throw env.error;
		}
		return next();
	};
})(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
	var e = new Error(message);
	return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
/**
* Largest supported QuickJS native stack limit for the shipped WASM binary.
*
* The binary has a 1 MiB linker-defined stack; reserving half of it leaves
* headroom for native frames and stack-overflow exception handling.
*/
const MAX_STACK_SIZE = 524288;
/**
* Flags for `evalCode()`, matching the QuickJS `JS_EVAL_*` constants.
*/
const EvalFlags = {
	/** Global script mode (default). */
	TYPE_GLOBAL: 0,
	/**
	* Module mode. `evalCode()` returns a handle to a Promise that resolves
	* to the module's namespace object (its exports), or rejects if module
	* evaluation throws. Use together with `executePendingJobs()` and
	* `resolvePromise()`.
	*/
	TYPE_MODULE: 1,
	/** Force strict mode. */
	STRICT: 8,
	/** Compile only; do not execute. */
	COMPILE_ONLY: 32,
	/** Omit stack frames before this eval from Error backtraces. */
	BACKTRACE_BARRIER: 64,
	/**
	* Allow top-level `await` in global scripts. When used, `evalCode()`
	* returns a handle to a Promise that resolves to the completion value.
	* Use together with `executePendingJobs()` and `resolvePromise()`.
	*/
	ASYNC: 128
};
/** Magic bytes: "QJSS" (QuickJS Snapshot) */
const SNAPSHOT_MAGIC = 1363825491;
/** Current serialization format version (2 = added extension metadata) */
const SNAPSHOT_VERSION = 2;
/**
* Header layout (version 2):
*   0-3:   Magic "QJSS" (u32 big-endian)
*   4:     Version (u8)
*   5-7:   Reserved (zero)
*   8-11:  Memory size in bytes (u32 little-endian)
*   12-15: Stack pointer (u32 little-endian)
*   16-19: Runtime pointer (u32 little-endian)
*   20-23: Context pointer (u32 little-endian)
*   24-27: Extension count (u32 little-endian)
*   28+:   Extension entries (variable length):
*          nameLen(u32) + name(utf8) + memoryBase(u32) + tableBase(u32) + initFnLen(u32) + initFn(utf8)
*   N+:    Memory data (N = memory size from offset 8)
*
* Version 1 (legacy): no extension metadata, memory starts at offset 24.
*/
const SNAPSHOT_HEADER_SIZE = 24;
var QuickJS = class QuickJS {
	exports;
	module;
	instance;
	encoder = new TextEncoder();
	decoder = new TextDecoder();
	disposed = false;
	/** Registry of host callbacks, keyed by function name */
	hostCallbacks = /* @__PURE__ */ new Map();
	/** Counter for internal-only callbacks (e.g. promise settle handlers) */
	nextInternalId = 1;
	interruptHandler = null;
	unhandledRejectionHandler = null;
	moduleNormalizeHandler = null;
	moduleLoadHandler = null;
	timezoneOffsetHandler = null;
	_global = null;
	_versions = null;
	_undefined = null;
	_null = null;
	_true = null;
	_false = null;
	_ownedHandles = /* @__PURE__ */ new Set();
	/**
	* The innermost active `withScope()` batch, if any. New non-singleton
	* handles register themselves here so they can be freed together.
	* @internal
	*/
	_activeScope = null;
	/** Loaded extensions in deterministic order */
	loadedExtensions = [];
	constructor(module) {
		this.module = module;
		this.instance = null;
		this.exports = null;
	}
	setInstance(instance) {
		this.instance = instance;
		this.exports = instance.exports;
	}
	/**
	* Version information for the runtime and loaded native libraries.
	* Always includes `"quickjs-wasi"` (the npm package version) and
	* `"quickjs"` (the QuickJS engine version). Extensions may contribute
	* additional entries for their native dependencies (e.g. `"ada"`, `"mbedtls"`).
	*/
	get versions() {
		this.assertNotDisposed();
		if (!this._versions) {
			const result = {
				"quickjs-wasi": VERSION,
				quickjs: this.readCString(this.exports.qjs_get_quickjs_version())
			};
			for (const ext of this.loadedExtensions) if (ext.versions) Object.assign(result, ext.versions);
			this._versions = result;
		}
		return this._versions;
	}
	/** The global object. Cached; do not dispose. */
	get global() {
		if (!this._global) this._global = new JSValueHandle(this, this.exports.qjs_get_global(), true);
		return this._global;
	}
	/** The undefined value. Cached; do not dispose. */
	get undefined() {
		if (!this._undefined) this._undefined = new JSValueHandle(this, this.exports.qjs_get_undefined(), true);
		return this._undefined;
	}
	/** The null value. Cached; do not dispose. */
	get null() {
		if (!this._null) this._null = new JSValueHandle(this, this.exports.qjs_get_null(), true);
		return this._null;
	}
	/** The true value. Cached; do not dispose. */
	get true() {
		if (!this._true) this._true = new JSValueHandle(this, this.exports.qjs_get_true(), true);
		return this._true;
	}
	/** The false value. Cached; do not dispose. */
	get false() {
		if (!this._false) this._false = new JSValueHandle(this, this.exports.qjs_get_false(), true);
		return this._false;
	}
	/**
	* Create a fresh QuickJS VM instance.
	*
	* @param options - Optional configuration. Can also pass raw WASM bytes
	*                  directly for backwards compatibility.
	*/
	static async create(options) {
		const opts = QuickJS.normalizeOptions(options);
		const module = await QuickJS.resolveModule(opts.wasm);
		const vm = new QuickJS(module);
		const { instance, wasiBuiltins, wasiUserOverrides, memoryProxy } = await QuickJS.instantiate(module, vm, opts.wasi);
		vm.setInstance(instance);
		vm.exports._initialize();
		if ((opts.intrinsics !== void 0 ? vm.exports.qjs_init2(opts.intrinsics) : vm.exports.qjs_init()) !== 0) throw new Error("Failed to initialize QuickJS runtime");
		if (opts.extensions) {
			const mainExports = instance.exports;
			for (const desc of opts.extensions) {
				const ext = await loadExtension(desc, mainExports, wasiBuiltins, wasiUserOverrides, memoryProxy);
				vm.loadedExtensions.push(ext);
				initExtension(ext, mainExports);
			}
		}
		QuickJS.applyLimits(vm, opts);
		return vm;
	}
	/**
	* Restore a QuickJS VM from a snapshot.
	*
	* @param snapshot - The snapshot to restore from.
	* @param options - Optional configuration. Can also pass raw WASM bytes
	*                  directly for backwards compatibility.
	*/
	static async restore(snapshot, options) {
		const opts = QuickJS.normalizeOptions(options);
		const module = await QuickJS.resolveModule(opts.wasm);
		const vm = new QuickJS(module);
		const { instance, wasiBuiltins, wasiUserOverrides, memoryProxy } = await QuickJS.instantiate(module, vm, opts.wasi);
		vm.setInstance(instance);
		const mainExports = instance.exports;
		const exportedMemory = vm.exports.memory;
		const currentPages = exportedMemory.buffer.byteLength / 65536;
		const neededPages = Math.ceil(snapshot.memory.byteLength / 65536);
		if (neededPages > currentPages) exportedMemory.grow(neededPages - currentPages);
		if (snapshot.extensions.length > 0) vm.loadedExtensions = await restoreExtensions(opts.extensions ?? [], snapshot.extensions, mainExports, wasiBuiltins, wasiUserOverrides, memoryProxy);
		new Uint8Array(exportedMemory.buffer).set(snapshot.memory);
		vm.exports.qjs_set_runtime_and_context(snapshot.runtimePtr, snapshot.contextPtr);
		vm.exports.__stack_pointer.value = snapshot.stackPointer;
		QuickJS.applyLimits(vm, opts);
		return vm;
	}
	/**
	* Serialize a snapshot to a binary buffer for persistent storage.
	*
	* The format includes a versioned header followed by the raw memory.
	* Apply your own compression (gzip, zstd, etc.) on top for smaller
	* storage. The memory compresses well due to its large zero regions.
	*
	* Format (version 1):
	* ```
	* Offset  Size  Field
	* 0       4     Magic: "QJSS" (0x514A5353, big-endian)
	* 4       1     Version: 1
	* 5       3     Reserved (zero)
	* 8       4     Memory size in bytes (u32 little-endian)
	* 12      4     Stack pointer (u32 little-endian)
	* 16      4     Runtime pointer (u32 little-endian)
	* 20      4     Context pointer (u32 little-endian)
	* 24      N     Memory data (N = memory size from offset 8)
	* ```
	*/
	static serializeSnapshot(snapshot) {
		const textEncoder = new TextEncoder();
		let extMetaSize = 4;
		const extEncodedNames = [];
		const extEncodedInitFns = [];
		for (const ext of snapshot.extensions) {
			const nameBytes = textEncoder.encode(ext.name);
			const initFnBytes = textEncoder.encode(ext.initFn);
			extEncodedNames.push(nameBytes);
			extEncodedInitFns.push(initFnBytes);
			extMetaSize += 4 + nameBytes.length + 4 + 4 + 4 + initFnBytes.length;
		}
		const totalSize = SNAPSHOT_HEADER_SIZE + extMetaSize + snapshot.memory.byteLength;
		const buffer = new ArrayBuffer(totalSize);
		const view = new DataView(buffer);
		const bytes = new Uint8Array(buffer);
		view.setUint32(0, SNAPSHOT_MAGIC, false);
		view.setUint8(4, SNAPSHOT_VERSION);
		view.setUint32(8, snapshot.memory.byteLength, true);
		view.setUint32(12, snapshot.stackPointer, true);
		view.setUint32(16, snapshot.runtimePtr, true);
		view.setUint32(20, snapshot.contextPtr, true);
		let offset = SNAPSHOT_HEADER_SIZE;
		view.setUint32(offset, snapshot.extensions.length, true);
		offset += 4;
		for (let i = 0; i < snapshot.extensions.length; i++) {
			const ext = snapshot.extensions[i];
			const nameBytes = extEncodedNames[i];
			const initFnBytes = extEncodedInitFns[i];
			view.setUint32(offset, nameBytes.length, true);
			offset += 4;
			bytes.set(nameBytes, offset);
			offset += nameBytes.length;
			view.setUint32(offset, ext.memoryBase, true);
			offset += 4;
			view.setUint32(offset, ext.tableBase, true);
			offset += 4;
			view.setUint32(offset, initFnBytes.length, true);
			offset += 4;
			bytes.set(initFnBytes, offset);
			offset += initFnBytes.length;
		}
		bytes.set(snapshot.memory, offset);
		return bytes;
	}
	/**
	* Deserialize a snapshot from a binary buffer produced by `serializeSnapshot()`.
	*/
	static deserializeSnapshot(data) {
		if (data.length < SNAPSHOT_HEADER_SIZE) throw new Error("Invalid snapshot: too small");
		const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
		const magic = view.getUint32(0, false);
		if (magic !== SNAPSHOT_MAGIC) throw new Error(`Invalid snapshot: bad magic (expected 0x${SNAPSHOT_MAGIC.toString(16)}, got 0x${magic.toString(16)})`);
		const version = view.getUint8(4);
		if (version !== SNAPSHOT_VERSION && version !== 1) throw new Error(`Unsupported snapshot version: ${version} (expected ${SNAPSHOT_VERSION})`);
		const memorySize = view.getUint32(8, true);
		const stackPointer = view.getUint32(12, true);
		const runtimePtr = view.getUint32(16, true);
		const contextPtr = view.getUint32(20, true);
		let extensions = [];
		let memoryOffset = SNAPSHOT_HEADER_SIZE;
		if (version >= 2) {
			const extCount = view.getUint32(24, true);
			let offset = 28;
			const textDecoder = new TextDecoder();
			for (let i = 0; i < extCount; i++) {
				const nameLen = view.getUint32(offset, true);
				offset += 4;
				const name = textDecoder.decode(data.slice(offset, offset + nameLen));
				offset += nameLen;
				const memBase = view.getUint32(offset, true);
				offset += 4;
				const tblBase = view.getUint32(offset, true);
				offset += 4;
				const initFnLen = view.getUint32(offset, true);
				offset += 4;
				const initFn = textDecoder.decode(data.slice(offset, offset + initFnLen));
				offset += initFnLen;
				extensions.push({
					name,
					memoryBase: memBase,
					tableBase: tblBase,
					initFn
				});
			}
			memoryOffset = offset;
		}
		const expectedSize = memoryOffset + memorySize;
		if (data.length < expectedSize) throw new Error(`Invalid snapshot: expected ${expectedSize} bytes, got ${data.length}`);
		return {
			memory: data.slice(memoryOffset, memoryOffset + memorySize),
			stackPointer,
			runtimePtr,
			contextPtr,
			extensions
		};
	}
	static normalizeOptions(options) {
		if (!options) return { wasm: void 0 };
		if (options instanceof WebAssembly.Module) return { wasm: options };
		if (typeof options === "object" && ("wasm" in options || "wasi" in options || "memoryLimit" in options || "maxStackSize" in options || "interruptHandler" in options || "onUnhandledRejection" in options || "moduleLoader" in options || "intrinsics" in options || "extensions" in options || "timezoneOffset" in options)) {
			const opts = options;
			if (opts.maxStackSize !== void 0 && (!Number.isInteger(opts.maxStackSize) || opts.maxStackSize < 0 || opts.maxStackSize > 524288)) throw new RangeError(`maxStackSize must be an integer between 0 and ${MAX_STACK_SIZE}`);
			return opts;
		}
		return { wasm: options };
	}
	static applyLimits(vm, opts) {
		if (opts.memoryLimit !== void 0) vm.exports.qjs_set_memory_limit(opts.memoryLimit);
		if (opts.maxStackSize !== void 0) vm.exports.qjs_set_max_stack_size(opts.maxStackSize);
		if (opts.interruptHandler) {
			vm.interruptHandler = opts.interruptHandler;
			vm.exports.qjs_set_interrupt_handler(1);
		}
		if (opts.onUnhandledRejection) {
			vm.unhandledRejectionHandler = opts.onUnhandledRejection;
			vm.exports.qjs_set_promise_rejection_handler(1);
		}
		if (opts.moduleLoader) {
			vm.moduleLoadHandler = opts.moduleLoader.load;
			vm.moduleNormalizeHandler = opts.moduleLoader.normalize ?? null;
			vm.exports.qjs_set_module_loader(1);
		}
		const tz = opts.timezoneOffset;
		if (typeof tz === "function") vm.timezoneOffsetHandler = (timeSecs) => -tz(timeSecs) * 60;
		else if (typeof tz === "number") {
			const offsetSecs = -tz * 60;
			vm.timezoneOffsetHandler = () => offsetSecs;
		} else vm.timezoneOffsetHandler = (timeSecs) => {
			return -(/* @__PURE__ */ new Date(timeSecs * 1e3)).getTimezoneOffset() * 60;
		};
	}
	static async resolveModule(wasmInput) {
		if (wasmInput instanceof WebAssembly.Module) return wasmInput;
		if (wasmInput) return WebAssembly.compile(wasmInput);
		throw new TypeError("QuickJS: `wasm` option is required. Provide WASM bytes or a compiled `WebAssembly.Module`. The binary is shipped at `quickjs-wasi/quickjs.wasm` and can be loaded via your environment's preferred mechanism (e.g. `fetch()`, `node:fs/promises`, or a bundler import like Vite's `?url`).");
	}
	static async instantiate(module, vm, wasiOptions) {
		let memory = null;
		const memoryProxy = new Proxy({}, { get(_target, prop) {
			return memory[prop];
		} });
		const wasiBuiltins = createWasiShim(() => memory);
		const wasiUserOverrides = wasiOptions ? wasiOptions(memoryProxy) : void 0;
		const wasiShim = {
			...wasiBuiltins,
			...wasiUserOverrides
		};
		const hostCall = (namePtr, nameLen, thisPtr, argc, argvPtr) => {
			return vm.handleHostCall(namePtr, nameLen, thisPtr, argc, argvPtr);
		};
		const hostInterrupt = () => {
			return vm.interruptHandler ? vm.interruptHandler() ? 1 : 0 : 0;
		};
		const hostPromiseRejection = (promisePtr, reasonPtr, isHandled) => {
			if (!vm.unhandledRejectionHandler) {
				vm.exports.qjs_free_value(promisePtr);
				vm.exports.qjs_free_value(reasonPtr);
				return;
			}
			const promise = new JSValueHandle(vm, promisePtr);
			const reason = new JSValueHandle(vm, reasonPtr);
			try {
				vm.unhandledRejectionHandler(promise, reason, isHandled !== 0);
			} finally {
				promise.dispose();
				reason.dispose();
			}
		};
		const throwIntoContext = (err) => {
			const errHandle = vm.newError(err instanceof Error ? err : String(err));
			vm.exports.qjs_throw(errHandle.ptr);
			errHandle.dispose();
		};
		const assertSyncString = (value, callbackName) => {
			if (typeof value === "string") return value;
			const got = value !== null && typeof value === "object" && typeof value.then === "function" ? "a Promise" : `type ${typeof value}`;
			throw new TypeError(`moduleLoader.${callbackName} must synchronously return a string (got ${got}). Async module loading is not supported. Pre-fetch module sources instead (see the "ES Modules" section of the quickjs-wasi README).`);
		};
		const hostModuleNormalize = (baseNamePtr, namePtr) => {
			if (!vm.moduleNormalizeHandler) {
				const name = vm.readCString(namePtr);
				return vm.writeString(name).ptr;
			}
			const baseName = vm.readCString(baseNamePtr);
			const specifier = vm.readCString(namePtr);
			try {
				const normalized = assertSyncString(vm.moduleNormalizeHandler(baseName, specifier), "normalize");
				return vm.writeString(normalized).ptr;
			} catch (err) {
				throwIntoContext(err);
				return 0;
			}
		};
		const hostModuleLoad = (namePtr, outLenPtr) => {
			if (!vm.moduleLoadHandler) return 0;
			const name = vm.readCString(namePtr);
			try {
				const source = assertSyncString(vm.moduleLoadHandler(name), "load");
				const { ptr, len } = vm.writeString(source);
				new Uint32Array(vm.exports.memory.buffer, outLenPtr, 1)[0] = len;
				return ptr;
			} catch (err) {
				throwIntoContext(err);
				return 0;
			}
		};
		const hostGetTimezoneOffset = (hi, lo) => {
			const timeSecs = Number(BigInt(hi) << 32n | BigInt(lo >>> 0));
			return vm.timezoneOffsetHandler ? vm.timezoneOffsetHandler(timeSecs) : 0;
		};
		const instance = await WebAssembly.instantiate(module, {
			env: {
				host_call: hostCall,
				host_interrupt: hostInterrupt,
				host_promise_rejection: hostPromiseRejection,
				host_module_normalize: hostModuleNormalize,
				host_module_load: hostModuleLoad,
				host_get_timezone_offset: hostGetTimezoneOffset
			},
			wasi_snapshot_preview1: wasiShim
		});
		memory = instance.exports.memory;
		return {
			instance,
			wasiBuiltins,
			wasiUserOverrides,
			memoryProxy
		};
	}
	/**
	* Called from WASM when a host function is invoked from QuickJS code.
	*/
	handleHostCall(namePtr, nameLen, thisPtr, argc, argvPtr) {
		const name = this.decoder.decode(new Uint8Array(this.exports.memory.buffer, namePtr, nameLen));
		const callback = this.hostCallbacks.get(name);
		if (!callback) {
			const errHandle = this.newError(`Host callback "${name}" is not registered: it was unregistered, its ephemeral function handle was disposed, or it was never re-registered after a snapshot restore.`);
			this.exports.qjs_throw(errHandle.ptr);
			errHandle.dispose();
			return 0;
		}
		const thisHandle = new JSValueHandle(this, thisPtr, false, true);
		const args = [];
		if (argc > 0 && argvPtr !== 0) {
			const view = new DataView(this.exports.memory.buffer);
			for (let i = 0; i < argc; i++) {
				const argPtr = view.getUint32(argvPtr + i * 4, true);
				args.push(new JSValueHandle(this, argPtr, false, true));
			}
		}
		try {
			const result = callback.call(thisHandle, ...args);
			return this.exports.qjs_dup_value(result.ptr);
		} catch (err) {
			const errHandle = this.newError(err instanceof Error ? err : String(err));
			this.exports.qjs_throw(errHandle.ptr);
			errHandle.dispose();
			return 0;
		}
	}
	/** Write a JS string into WASM memory, returning the pointer. Caller must free. */
	writeString(str) {
		const encoded = encodeWtf8(str);
		const ptr = this.exports.wasm_malloc(encoded.length + 1);
		if (ptr === 0) throw new Error("wasm_malloc failed");
		const mem = new Uint8Array(this.exports.memory.buffer);
		mem.set(encoded, ptr);
		mem[ptr + encoded.length] = 0;
		return {
			ptr,
			len: encoded.length
		};
	}
	/** Read a null-terminated C string from WASM memory */
	readCString(ptr) {
		const mem = new Uint8Array(this.exports.memory.buffer);
		let end = ptr;
		while (mem[end] !== 0) end++;
		return this.decoder.decode(mem.slice(ptr, end));
	}
	/**
	* Check if a result handle is an exception and throw a JSException if so.
	* Used internally by evalCode and callFunction.
	*/
	throwIfException(result) {
		if (this.exports.qjs_is_exception(result.ptr) !== 0) {
			const exc = this.getException();
			result.dispose();
			this._ownedHandles.add(exc);
			throw new JSException(exc);
		}
		return result;
	}
	/**
	* Evaluate JavaScript code and return the result as a handle.
	* If the code throws, a `JSException` (which extends `Error`) is thrown
	* on the host side, matching standard JavaScript semantics.
	*
	* @param code - The JavaScript source code to evaluate.
	* @param filename - Optional filename for error stack traces (default `'<eval>'`).
	* @param flags - Optional bitwise OR of `EvalFlags.*` constants.
	*   For example, pass `EvalFlags.ASYNC` to allow top-level `await`; the
	*   returned handle will be a Promise that resolves to the completion value.
	*   With `EvalFlags.TYPE_MODULE` the returned handle is a Promise that
	*   resolves to the module's namespace object (its exports).
	*/
	evalCode(code, filename = "<eval>", flags = 0) {
		this.assertNotDisposed();
		const codeStr = this.writeString(code);
		const fnStr = this.writeString(filename);
		const resultPtr = this.exports.qjs_eval(codeStr.ptr, codeStr.len, fnStr.ptr, flags);
		this.exports.wasm_free(codeStr.ptr);
		this.exports.wasm_free(fnStr.ptr);
		return this.throwIfException(new JSValueHandle(this, resultPtr));
	}
	/**
	* Compile JavaScript source code to bytecode without executing it.
	* The returned `Uint8Array` can be stored, transferred, or later executed
	* with `evalBytecode()`.
	*
	* @param code - The JavaScript source code to compile.
	* @param filename - Optional filename for error stack traces (default `'<compile>'`).
	* @param evalFlags - Optional bitwise OR of `EvalFlags.*` constants.
	*   Use `EvalFlags.TYPE_MODULE` to compile as a module.
	* @param compileFlags - Optional bitwise OR of `CompileFlags.*` constants.
	*   Use `CompileFlags.STRIP_SOURCE` and/or `CompileFlags.STRIP_DEBUG` to
	*   reduce bytecode size.
	*/
	compile(code, filename = "<compile>", evalFlags = 0, compileFlags = 0) {
		this.assertNotDisposed();
		const codeStr = this.writeString(code);
		const fnStr = this.writeString(filename);
		const outLenPtr = this.exports.wasm_malloc(4);
		const bufPtr = this.exports.qjs_compile(codeStr.ptr, codeStr.len, fnStr.ptr, evalFlags, compileFlags, outLenPtr);
		this.exports.wasm_free(codeStr.ptr);
		this.exports.wasm_free(fnStr.ptr);
		if (bufPtr === 0) {
			this.exports.wasm_free(outLenPtr);
			const exc = this.getException();
			throw new Error(`Compilation error: ${exc.toString()}`);
		}
		const outLen = new Uint32Array(this.exports.memory.buffer, outLenPtr, 1)[0];
		this.exports.wasm_free(outLenPtr);
		const bytecode = new Uint8Array(this.exports.memory.buffer, bufPtr, outLen).slice();
		this.exports.wasm_free(bufPtr);
		return bytecode;
	}
	/**
	* Execute previously compiled bytecode (from `compile()`).
	* Returns the evaluation result as a handle.
	*
	* For module bytecode (compiled with `EvalFlags.TYPE_MODULE`), the
	* returned handle is a Promise that resolves to the module's namespace
	* object (its exports).
	*
	* @param bytecode - The bytecode `Uint8Array` from `compile()`.
	*/
	evalBytecode(bytecode) {
		this.assertNotDisposed();
		const bufPtr = this.exports.wasm_malloc(bytecode.byteLength);
		new Uint8Array(this.exports.memory.buffer, bufPtr, bytecode.byteLength).set(bytecode);
		const resultPtr = this.exports.qjs_eval_bytecode(bufPtr, bytecode.byteLength);
		this.exports.wasm_free(bufPtr);
		return this.throwIfException(new JSValueHandle(this, resultPtr));
	}
	/**
	* Execute all pending microtask jobs (promise reactions, etc.)
	* Returns the number of jobs executed.
	*/
	executePendingJobs() {
		this.assertNotDisposed();
		let count = 0;
		while (this.exports.qjs_is_job_pending()) {
			if (this.exports.qjs_execute_pending_job() < 0) {
				const exc = this.getException();
				throw new Error(`Job execution error: ${exc.toString()}`);
			}
			count++;
		}
		return count;
	}
	/**
	* Explicitly trigger garbage collection. QuickJS runs GC automatically,
	* but this can be useful to reclaim memory at a known point or before
	* taking a snapshot.
	*/
	runGC() {
		this.assertNotDisposed();
		this.exports.qjs_run_gc();
	}
	/**
	* The GC threshold in bytes. When allocated memory exceeds this value,
	* garbage collection is triggered automatically. Set to 0 to disable
	* automatic GC.
	*/
	get gcThreshold() {
		this.assertNotDisposed();
		return this.exports.qjs_get_gc_threshold();
	}
	set gcThreshold(threshold) {
		this.assertNotDisposed();
		this.exports.qjs_set_gc_threshold(threshold);
	}
	/**
	* Get detailed memory usage statistics from the QuickJS runtime.
	* Returns counts and sizes for atoms, strings, objects, functions, etc.
	*/
	getMemoryUsage() {
		this.assertNotDisposed();
		const bufPtr = this.exports.wasm_malloc(208);
		this.exports.qjs_compute_memory_usage(bufPtr);
		const view = new BigInt64Array(this.exports.memory.buffer, bufPtr, 26);
		const result = {
			mallocSize: Number(view[0]),
			mallocLimit: Number(view[1]),
			memoryUsedSize: Number(view[2]),
			mallocCount: Number(view[3]),
			memoryUsedCount: Number(view[4]),
			atomCount: Number(view[5]),
			atomSize: Number(view[6]),
			strCount: Number(view[7]),
			strSize: Number(view[8]),
			objCount: Number(view[9]),
			objSize: Number(view[10]),
			propCount: Number(view[11]),
			propSize: Number(view[12]),
			shapeCount: Number(view[13]),
			shapeSize: Number(view[14]),
			jsFuncCount: Number(view[15]),
			jsFuncSize: Number(view[16]),
			jsFuncCodeSize: Number(view[17]),
			jsFuncPc2lineCount: Number(view[18]),
			jsFuncPc2lineSize: Number(view[19]),
			cFuncCount: Number(view[20]),
			arrayCount: Number(view[21]),
			fastArrayCount: Number(view[22]),
			fastArrayElements: Number(view[23]),
			binaryObjectCount: Number(view[24]),
			binaryObjectSize: Number(view[25])
		};
		this.exports.wasm_free(bufPtr);
		return result;
	}
	/**
	* Get the global object. Prefer the cached `vm.global` property.
	*/
	getGlobal() {
		this.assertNotDisposed();
		return new JSValueHandle(this, this.exports.qjs_get_global());
	}
	/**
	* Create a new QuickJS string value.
	*/
	newString(str) {
		this.assertNotDisposed();
		const { ptr, len } = this.writeString(str);
		const resultPtr = this.exports.qjs_new_string(ptr, len);
		this.exports.wasm_free(ptr);
		return new JSValueHandle(this, resultPtr);
	}
	/**
	* Create a new QuickJS number value.
	*/
	newNumber(num) {
		this.assertNotDisposed();
		return new JSValueHandle(this, this.exports.qjs_new_number(num));
	}
	/**
	* Create a new QuickJS BigInt value.
	*/
	newBigInt(val) {
		this.assertNotDisposed();
		const lo = Number(val & 4294967295n);
		const hi = Number(val >> 32n & 4294967295n);
		return new JSValueHandle(this, this.exports.qjs_new_big_int64(lo, hi));
	}
	/**
	* Create a new QuickJS object value.
	*/
	newObject() {
		this.assertNotDisposed();
		return new JSValueHandle(this, this.exports.qjs_new_object());
	}
	/**
	* Create a new QuickJS array value.
	*/
	newArray() {
		this.assertNotDisposed();
		return new JSValueHandle(this, this.exports.qjs_new_array());
	}
	/**
	* Create a global symbol (`Symbol.for(description)`).
	* Global symbols with the same description are always the same symbol,
	* even across snapshot/restore.
	*/
	newSymbolFor(description) {
		this.assertNotDisposed();
		const { ptr, len } = this.writeString(description);
		const result = new JSValueHandle(this, this.exports.qjs_new_symbol(ptr, len, 1));
		this.exports.wasm_free(ptr);
		return result;
	}
	/**
	* Create a new QuickJS ArrayBuffer by copying data from a host buffer.
	*/
	newArrayBuffer(data) {
		this.assertNotDisposed();
		const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
		const ptr = this.exports.wasm_malloc(bytes.length);
		if (ptr === 0) throw new Error("wasm_malloc failed");
		new Uint8Array(this.exports.memory.buffer).set(bytes, ptr);
		const result = new JSValueHandle(this, this.exports.qjs_new_array_buffer(ptr, bytes.length));
		this.exports.wasm_free(ptr);
		return result;
	}
	/**
	* Create a new QuickJS Uint8Array by copying data from a host buffer.
	*/
	newUint8Array(data) {
		this.assertNotDisposed();
		const ptr = this.exports.wasm_malloc(data.length);
		if (ptr === 0) throw new Error("wasm_malloc failed");
		new Uint8Array(this.exports.memory.buffer).set(data, ptr);
		const result = new JSValueHandle(this, this.exports.qjs_new_uint8_array(ptr, data.length));
		this.exports.wasm_free(ptr);
		return result;
	}
	/**
	* Get undefined. Prefer the cached `vm.undefined` property.
	*/
	getUndefined() {
		this.assertNotDisposed();
		return new JSValueHandle(this, this.exports.qjs_get_undefined());
	}
	/**
	* Get null. Prefer the cached `vm.null` property.
	*/
	getNull() {
		this.assertNotDisposed();
		return new JSValueHandle(this, this.exports.qjs_get_null());
	}
	/**
	* Get true. Prefer the cached `vm.true` property.
	*/
	getTrue() {
		this.assertNotDisposed();
		return new JSValueHandle(this, this.exports.qjs_get_true());
	}
	/**
	* Get false. Prefer the cached `vm.false` property.
	*/
	getFalse() {
		this.assertNotDisposed();
		return new JSValueHandle(this, this.exports.qjs_get_false());
	}
	/**
	* Create a new QuickJS function backed by a host callback.
	*
	* When the function is called inside QuickJS, the host callback is invoked
	* with the `this` value and arguments as JSValueHandles.
	*/
	newFunction(name, fn) {
		this.assertNotDisposed();
		if (this.hostCallbacks.has(name)) throw new Error(`Host callback with name "${name}" is already registered`);
		this.hostCallbacks.set(name, fn);
		const { ptr: namePtr, len: nameLen } = this.writeString(name);
		const resultPtr = this.exports.qjs_new_host_function(namePtr, nameLen, 0);
		this.exports.wasm_free(namePtr);
		return new JSValueHandle(this, resultPtr);
	}
	/**
	* Run `fn` with a handle scope: every handle created during the call is
	* disposed when it returns, except those passed to `scope.escape()`.
	*
	* This is the bulk alternative to disposing handles individually, for code
	* that creates many intermediates, such as walking a large value:
	*
	* ```ts
	* const name = vm.withScope((scope) => {
	*   const user = root.getProp('user');       // freed automatically
	*   const profile = user.getProp('profile'); // freed automatically
	*   return scope.escape(profile.getProp('name'));
	* });
	* ```
	*
	* Scopes nest: `escape()` transfers the handle to the enclosing scope when
	* there is one, so it is still cleaned up at the outer boundary.
	*
	* `fn` must be synchronous. Handles created after an `await` are outside
	* the scope, because it closes as soon as `fn` returns.
	*
	* Host callbacks are safe to trigger inside a scope: the `this`/argument
	* handles the trampoline passes to a callback wrap C-owned pointers and
	* are exempt from scope tracking (see `handleHostCall`), so the scope
	* frees only handles the host actually owns. Handles a callback CREATES
	* (including `dup()`s of its arguments) are tracked normally.
	*/
	withScope(fn) {
		this.assertNotDisposed();
		const enclosing = this._activeScope;
		const tracked = /* @__PURE__ */ new Set();
		this._activeScope = tracked;
		const scope = { escape: (handle) => {
			tracked.delete(handle);
			enclosing?.add(handle);
			return handle;
		} };
		try {
			return fn(scope);
		} finally {
			this._activeScope = enclosing;
			for (const handle of tracked) handle.dispose();
		}
	}
	/**
	* Export a handle as a snapshot-portable token.
	*
	* A handle's heap box lives in the VM's linear memory, so a
	* `snapshot()` taken while the handle is alive carries it, and a VM
	* restored from that snapshot has the identical box at the identical
	* offset. `importHandle(token)` on the restored VM (or on this VM)
	* re-materializes an owned handle for the same guest value without
	* evaluating any guest code.
	*
	* Contract:
	* - the handle must stay undisposed until after `snapshot()`; its
	*   box (and the reference it holds) must be part of the memory image;
	* - the token is only meaningful to THIS VM and VMs restored from a
	*   snapshot of it taken while the handle was alive;
	* - `importHandle` duplicates the underlying value (fresh reference,
	*   fresh box), so it can be called any number of times and each
	*   returned handle is independently owned and disposable. The
	*   exported box's own reference is intentionally never released on
	*   restored VMs (one retained reference per VM image, reclaimed
	*   with the VM).
	*
	* The intended use is boot-time capture: snapshot a VM after capturing
	* references to pristine intrinsics but BEFORE evaluating untrusted or
	* user code, then restore per task and import the captured handles,
	* guaranteeing the references predate anything user code patched,
	* without re-running capture code in the restored VM (where user-
	* patched globals could observe it). See vercel/workflow's host-side
	* serde for a worked example.
	*/
	exportHandle(handle) {
		this.assertNotDisposed();
		if (handle.vm !== this) throw new Error("exportHandle: handle belongs to a different VM");
		if (handle.disposed) throw new Error("exportHandle: handle is disposed");
		if (handle._isBorrowed) throw new Error("exportHandle: cannot export a borrowed handle (host-callback this/argument); its box is freed when the callback returns. dup() it and export the duplicate.");
		return handle.ptr;
	}
	/**
	* Re-materialize a handle from a token produced by `exportHandle`,
	* on this VM, or on a VM restored from a snapshot taken while the
	* exported handle was alive. Returns a NEW owned handle (the
	* underlying value's refcount is incremented); dispose it like any
	* other handle. See `exportHandle` for the full contract.
	*/
	importHandle(token) {
		this.assertNotDisposed();
		if (!Number.isInteger(token) || token <= 0 || token >= this.exports.memory.buffer.byteLength) throw new Error(`importHandle: invalid token ${token}`);
		return new JSValueHandle(this, this.exports.qjs_dup_value(token));
	}
	/**
	* Create a QuickJS function backed by a host callback whose registration is
	* tied to the returned handle: disposing the handle unregisters the
	* callback.
	*
	* Use this for short-lived callbacks (e.g. a visitor passed to
	* `Map.prototype.forEach`) where the name is an implementation detail.
	* `newFunction()` keeps its callback registered for the lifetime of the VM
	* (by design, so that names can be re-registered after a snapshot is
	* restored), which makes it unsuitable for callbacks created in a loop.
	*
	* The guest must not retain the function past disposal: calling it after
	* the handle is disposed throws, because the callback is gone. Ephemeral
	* functions do not survive snapshot/restore.
	*/
	newEphemeralFunction(fn) {
		this.assertNotDisposed();
		const name = `__ephemeral:${this.nextInternalId++}`;
		this.hostCallbacks.set(name, fn);
		const { ptr: namePtr, len: nameLen } = this.writeString(name);
		const resultPtr = this.exports.qjs_new_host_function(namePtr, nameLen, 0);
		this.exports.wasm_free(namePtr);
		const handle = new JSValueHandle(this, resultPtr);
		handle._onDispose = () => {
			this.hostCallbacks.delete(name);
		};
		return handle;
	}
	/**
	* Remove a host callback registered with `newFunction()` or
	* `registerHostCallback()`. Returns true if a callback was removed.
	*
	* Any QuickJS function still referencing the name will throw when called,
	* so only unregister once the guest can no longer reach it.
	*/
	unregisterHostCallback(name) {
		return this.hostCallbacks.delete(name);
	}
	/**
	* Create an internal host function that bypasses the duplicate-name check.
	* Used for ephemeral callbacks (promise settle handlers, resolvePromise, etc.)
	* that are not intended to survive snapshot/restore.
	*/
	newInternalFunction(name, fn) {
		this.hostCallbacks.set(name, fn);
		const { ptr: namePtr, len: nameLen } = this.writeString(name);
		const resultPtr = this.exports.qjs_new_host_function(namePtr, nameLen, 0);
		this.exports.wasm_free(namePtr);
		return new JSValueHandle(this, resultPtr);
	}
	/**
	* Create a new promise.
	*
	* Returns a Deferred with:
	* - `handle` - the QuickJS promise object
	* - `settled` - a host Promise that resolves when the QuickJS promise settles
	* - `resolve(value)` - resolve the promise with a QuickJS value
	* - `reject(value)` - reject the promise with a QuickJS value
	*/
	newPromise() {
		this.assertNotDisposed();
		const resolveOutPtr = this.exports.wasm_malloc(4);
		const rejectOutPtr = this.exports.wasm_malloc(4);
		const promisePtr = this.exports.qjs_new_promise(resolveOutPtr, rejectOutPtr);
		const view = new DataView(this.exports.memory.buffer);
		const resolvePtr = view.getUint32(resolveOutPtr, true);
		const rejectPtr = view.getUint32(rejectOutPtr, true);
		this.exports.wasm_free(resolveOutPtr);
		this.exports.wasm_free(rejectOutPtr);
		const promiseHandle = new JSValueHandle(this, promisePtr);
		const resolveHandle = new JSValueHandle(this, resolvePtr);
		const rejectHandle = new JSValueHandle(this, rejectPtr);
		const vm = this;
		vm._ownedHandles.add(resolveHandle);
		vm._ownedHandles.add(rejectHandle);
		let _settled = null;
		return {
			handle: promiseHandle,
			get settled() {
				if (!_settled) {
					let settledResolve;
					_settled = new Promise((res) => {
						settledResolve = res;
					});
					const settleName = `__settle:${vm.nextInternalId++}`;
					const onSettleFn = vm.newInternalFunction(settleName, () => {
						settledResolve();
						vm.hostCallbacks.delete(settleName);
						return vm.undefined;
					});
					vm.promiseThenRaw(promiseHandle, onSettleFn, onSettleFn).dispose();
					onSettleFn.dispose();
				}
				return _settled;
			},
			resolve(value) {
				vm.callFunctionRaw(resolveHandle, vm.undefined, value).dispose();
				vm._ownedHandles.delete(resolveHandle);
				resolveHandle.dispose();
			},
			reject(value) {
				vm.callFunctionRaw(rejectHandle, vm.undefined, value).dispose();
				vm._ownedHandles.delete(rejectHandle);
				rejectHandle.dispose();
			}
		};
	}
	/**
	* Resolve a promise handle. Returns a host-side Promise that resolves
	* with the settled value/error of the QuickJS promise.
	*
	* If the handle is not a promise, it is treated as an already-fulfilled value.
	*
	* The returned host Promise resolves to `{ value: JSValueHandle }` on
	* fulfillment or `{ error: JSValueHandle }` on rejection.
	*/
	resolvePromise(promiseHandle) {
		this.assertNotDisposed();
		if (!this.exports.qjs_is_promise(promiseHandle.ptr)) return Promise.resolve({ value: promiseHandle.dup() });
		const state = this.exports.qjs_promise_state(promiseHandle.ptr);
		if (state === 1) return Promise.resolve({ value: new JSValueHandle(this, this.exports.qjs_promise_result(promiseHandle.ptr)) });
		else if (state === 2) return Promise.resolve({ error: new JSValueHandle(this, this.exports.qjs_promise_result(promiseHandle.ptr)) });
		return new Promise((hostResolve) => {
			const id = this.nextInternalId++;
			const fulfilledName = `__onFulfilled:${id}`;
			const rejectedName = `__onRejected:${id}`;
			const onFulfilled = this.newInternalFunction(fulfilledName, (...args) => {
				const val = args[0]?.dup() ?? this.undefined;
				this.hostCallbacks.delete(fulfilledName);
				this.hostCallbacks.delete(rejectedName);
				hostResolve({ value: val });
				return this.undefined;
			});
			const onRejected = this.newInternalFunction(rejectedName, (...args) => {
				const val = args[0]?.dup() ?? this.undefined;
				this.hostCallbacks.delete(fulfilledName);
				this.hostCallbacks.delete(rejectedName);
				hostResolve({ error: val });
				return this.undefined;
			});
			this.promiseThenRaw(promiseHandle, onFulfilled, onRejected).dispose();
			onFulfilled.dispose();
			onRejected.dispose();
		});
	}
	/**
	* Subscribe to a promise without executing guest code, via quickjs-ng's
	* JS_PromiseThen: no Promise.prototype.then lookup, no Symbol.species.
	* Returns the chained promise. Handler handles are borrowed (caller
	* still owns and disposes them).
	* @internal
	*/
	promiseThenRaw(promise, onFulfilled, onRejected) {
		return new JSValueHandle(this, this.exports.qjs_promise_then(promise.ptr, onFulfilled.ptr, onRejected.ptr));
	}
	/**
	* Mark a promise as handled: an eventual (or already-recorded) rejection
	* will not be reported to `onUnhandledRejection`. Useful when the host
	* observes a rejection through other means (e.g. `resolvePromise()`) and
	* wants to suppress the unhandled-rejection callback for it.
	*
	* No-op if the handle is not a promise.
	*/
	markPromiseHandled(promise) {
		this.assertNotDisposed();
		this.exports.qjs_promise_mark_as_handled(promise.ptr);
	}
	/**
	* Call a QuickJS function. If the function throws, a `JSException`
	* is thrown on the host side.
	*/
	callFunction(func, thisVal, ...args) {
		return this.throwIfException(this.callFunctionRaw(func, thisVal, ...args));
	}
	/**
	* Invoke a QuickJS constructor with `new`, i.e. `new ctor(...args)`.
	* If the constructor throws (including when `ctor` is not a constructor),
	* a `JSException` is thrown on the host side.
	*
	* This is the counterpart to `callFunction` for building values inside
	* the VM from the host, e.g. `new Date(iso)` on a constructor captured
	* before any user code ran.
	*/
	construct(ctor, ...args) {
		this.assertNotDisposed();
		const argc = args.length;
		let argvPtr = 0;
		if (argc > 0) {
			argvPtr = this.exports.wasm_malloc(argc * 4);
			const view = new DataView(this.exports.memory.buffer);
			for (let i = 0; i < argc; i++) view.setUint32(argvPtr + i * 4, args[i].ptr, true);
		}
		const resultPtr = this.exports.qjs_call_constructor(ctor.ptr, argc, argvPtr);
		if (argvPtr) this.exports.wasm_free(argvPtr);
		return this.throwIfException(new JSValueHandle(this, resultPtr));
	}
	/**
	* Internal: call a QuickJS function without throwing on exception.
	* Used by promise plumbing where exceptions are handled differently.
	*/
	callFunctionRaw(func, thisVal, ...args) {
		this.assertNotDisposed();
		const argc = args.length;
		let argvPtr = 0;
		if (argc > 0) {
			argvPtr = this.exports.wasm_malloc(argc * 4);
			const view = new DataView(this.exports.memory.buffer);
			for (let i = 0; i < argc; i++) view.setUint32(argvPtr + i * 4, args[i].ptr, true);
		}
		const resultPtr = this.exports.qjs_call(func.ptr, thisVal.ptr, argc, argvPtr);
		if (argvPtr) this.exports.wasm_free(argvPtr);
		return new JSValueHandle(this, resultPtr);
	}
	/**
	* Set a property on an object. Accepts string or JSValueHandle as key.
	* JSValueHandle keys support symbols (including `Symbol.for()`).
	*/
	setProp(obj, key, value) {
		this.assertNotDisposed();
		if (typeof key === "string") {
			const { ptr: namePtr } = this.writeString(key);
			this.exports.qjs_set_prop_string(obj.ptr, namePtr, value.ptr);
			this.exports.wasm_free(namePtr);
		} else this.exports.qjs_set_prop_value(obj.ptr, key.ptr, value.ptr);
	}
	/**
	* Define a property on an object with explicit property descriptor flags.
	* Unlike `setProp`, this allows controlling `writable`, `enumerable`, and
	* `configurable` attributes, matching `Object.defineProperty()` semantics.
	* Accepts string or JSValueHandle as key (JSValueHandle keys support symbols).
	*
	* All flags default to `false` when not specified.
	*/
	defineProp(obj, key, value, descriptor) {
		this.assertNotDisposed();
		let flags = 0;
		if (descriptor?.configurable) flags |= 1;
		if (descriptor?.writable) flags |= 2;
		if (descriptor?.enumerable) flags |= 4;
		if (typeof key === "string") {
			const { ptr: namePtr } = this.writeString(key);
			this.exports.qjs_define_prop_string(obj.ptr, namePtr, value.ptr, flags);
			this.exports.wasm_free(namePtr);
		} else this.exports.qjs_define_prop_value(obj.ptr, key.ptr, value.ptr, flags);
	}
	/**
	* Get a property from an object using a JSValueHandle key.
	* Supports symbol keys (including `Symbol.for()`).
	*/
	getProp(obj, key) {
		this.assertNotDisposed();
		return new JSValueHandle(this, this.exports.qjs_get_prop_value(obj.ptr, key.ptr));
	}
	/**
	* Get the current exception, if any.
	*/
	getException() {
		this.assertNotDisposed();
		return new JSValueHandle(this, this.exports.qjs_get_exception());
	}
	/**
	* Create a new QuickJS Error object.
	* Accepts a string message or a native Error object.
	*/
	newError(messageOrError) {
		this.assertNotDisposed();
		const errPtr = this.exports.qjs_new_error();
		const errHandle = new JSValueHandle(this, errPtr);
		if (typeof messageOrError === "string") {
			const msgHandle = this.newString(messageOrError);
			errHandle.setProp("message", msgHandle);
			msgHandle.dispose();
		} else {
			const msgHandle = this.newString(messageOrError.message);
			errHandle.setProp("message", msgHandle);
			msgHandle.dispose();
			if (messageOrError.name) {
				const nameHandle = this.newString(messageOrError.name);
				errHandle.setProp("name", nameHandle);
				nameHandle.dispose();
			}
			if (messageOrError.stack) {
				const stackHandle = this.newString(messageOrError.stack);
				errHandle.setProp("stack", stackHandle);
				stackHandle.dispose();
			}
		}
		return errHandle;
	}
	/**
	* Get the typeof a handle as a string.
	*/
	typeof(handle) {
		this.assertNotDisposed();
		const e = this.exports;
		if (e.qjs_is_undefined(handle.ptr)) return "undefined";
		if (e.qjs_is_null(handle.ptr)) return "object";
		if (e.qjs_is_bool(handle.ptr)) return "boolean";
		if (e.qjs_is_number(handle.ptr)) return "number";
		if (e.qjs_is_big_int(handle.ptr)) return "bigint";
		if (e.qjs_is_string(handle.ptr)) return "string";
		if (e.qjs_is_symbol(handle.ptr)) return "symbol";
		if (e.qjs_is_function(handle.ptr)) return "function";
		if (e.qjs_is_object(handle.ptr)) return "object";
		return "unknown";
	}
	/**
	* Convert a QuickJS handle to a host JavaScript value.
	* Handles strings, numbers, booleans, null, undefined, bigint, arrays,
	* errors, functions, and plain objects. Circular references in objects
	* are returned as `undefined`.
	*/
	dump(handle) {
		this.assertNotDisposed();
		return this._dump(handle, /* @__PURE__ */ new Map());
	}
	_dump(handle, visited) {
		const e = this.exports;
		if (e.qjs_is_undefined(handle.ptr)) return void 0;
		if (e.qjs_is_null(handle.ptr)) return null;
		if (e.qjs_is_bool(handle.ptr)) return e.qjs_get_bool(handle.ptr) !== 0;
		if (e.qjs_is_number(handle.ptr)) return e.qjs_get_float64(handle.ptr);
		if (e.qjs_is_string(handle.ptr)) return handle.toString();
		if (e.qjs_is_big_int(handle.ptr)) return handle.toBigInt();
		if (e.qjs_is_symbol(handle.ptr)) {
			const descOutPtr = e.wasm_malloc(4);
			const kind = e.qjs_get_symbol_description(handle.ptr, descOutPtr);
			const descPtr = new DataView(e.memory.buffer).getUint32(descOutPtr, true);
			e.wasm_free(descOutPtr);
			if (kind === 1) {
				const descHandle = new JSValueHandle(this, descPtr);
				const description = descHandle.toString();
				descHandle.dispose();
				return Symbol.for(description);
			} else if (kind === 2) {
				new JSValueHandle(this, descPtr).dispose();
				return;
			}
			return;
		}
		if (e.qjs_is_array_buffer(handle.ptr)) return handle.toArrayBuffer();
		if (e.qjs_is_exception(handle.ptr)) {
			const exc = this.getException();
			const msg = exc.toString();
			exc.dispose();
			return new Error(msg);
		}
		if (e.qjs_is_function(handle.ptr)) return void 0;
		if (e.qjs_is_object(handle.ptr)) {
			const objPtr = e.qjs_get_value_ptr(handle.ptr);
			if (objPtr) {
				const existing = visited.get(objPtr);
				if (existing !== void 0) return existing;
			}
		}
		if (e.qjs_is_object(handle.ptr)) {
			const byteOffsetPtr = e.wasm_malloc(4);
			const byteLengthPtr = e.wasm_malloc(4);
			const bytesPerElemPtr = e.wasm_malloc(4);
			const abPtr = e.qjs_get_typed_array_buffer(handle.ptr, byteOffsetPtr, byteLengthPtr, bytesPerElemPtr);
			const abHandle = new JSValueHandle(this, abPtr);
			if (e.qjs_is_exception(abHandle.ptr) === 0) {
				const view = new DataView(e.memory.buffer);
				const byteOffset = view.getUint32(byteOffsetPtr, true);
				const byteLength = view.getUint32(byteLengthPtr, true);
				const bytesPerElement = view.getUint32(bytesPerElemPtr, true);
				e.wasm_free(byteOffsetPtr);
				e.wasm_free(byteLengthPtr);
				e.wasm_free(bytesPerElemPtr);
				const abLenPtr = e.wasm_malloc(4);
				const abDataPtr = e.qjs_get_array_buffer(abHandle.ptr, abLenPtr);
				e.wasm_free(abLenPtr);
				abHandle.dispose();
				if (abDataPtr !== 0) {
					const rawBytes = new Uint8Array(e.memory.buffer, abDataPtr + byteOffset, byteLength).slice();
					switch (bytesPerElement) {
						case 1: return rawBytes;
						case 2: return new Uint16Array(rawBytes.buffer);
						case 4: return new Uint32Array(rawBytes.buffer);
						case 8: return new Float64Array(rawBytes.buffer);
						default: return rawBytes;
					}
				}
			} else {
				abHandle.dispose();
				e.wasm_free(byteOffsetPtr);
				e.wasm_free(byteLengthPtr);
				e.wasm_free(bytesPerElemPtr);
			}
		}
		if (e.qjs_is_array(handle.ptr)) {
			const lenHandle = handle.getProp("length");
			const len = e.qjs_get_float64(lenHandle.ptr);
			lenHandle.dispose();
			const arr = [];
			const objPtr = e.qjs_get_value_ptr(handle.ptr);
			if (objPtr) visited.set(objPtr, arr);
			for (let i = 0; i < len; i++) {
				const elemPtr = e.qjs_get_prop_uint32(handle.ptr, i);
				const elemHandle = new JSValueHandle(this, elemPtr);
				arr.push(this._dump(elemHandle, visited));
				elemHandle.dispose();
			}
			return arr;
		}
		if (e.qjs_is_error(handle.ptr)) {
			const nameHandle = handle.getProp("name");
			const msgHandle = handle.getProp("message");
			const stackHandle = handle.getProp("stack");
			const name = nameHandle.isUndefined ? "Error" : nameHandle.toString();
			const message = msgHandle.isUndefined ? "" : msgHandle.toString();
			const stack = stackHandle.isUndefined ? void 0 : stackHandle.toString();
			nameHandle.dispose();
			msgHandle.dispose();
			stackHandle.dispose();
			const err = new Error(message);
			err.name = name;
			if (stack !== void 0) err.stack = stack;
			return err;
		}
		if (e.qjs_is_object(handle.ptr)) {
			const keysPtr = e.qjs_get_own_property_names(handle.ptr);
			const keysHandle = new JSValueHandle(this, keysPtr);
			if (e.qjs_is_exception(keysHandle.ptr) !== 0) {
				keysHandle.dispose();
				return {};
			}
			const lenHandle = keysHandle.getProp("length");
			const len = e.qjs_get_float64(lenHandle.ptr);
			lenHandle.dispose();
			const obj = {};
			const objPtr = e.qjs_get_value_ptr(handle.ptr);
			if (objPtr) visited.set(objPtr, obj);
			for (let i = 0; i < len; i++) {
				const keyPtr = e.qjs_get_prop_uint32(keysHandle.ptr, i);
				const keyHandle = new JSValueHandle(this, keyPtr);
				const key = keyHandle.toString();
				keyHandle.dispose();
				const valHandle = handle.getProp(key);
				obj[key] = this._dump(valHandle, visited);
				valHandle.dispose();
			}
			keysHandle.dispose();
			return obj;
		}
	}
	/**
	* Convert a host JavaScript value to a QuickJS handle.
	*/
	hostToHandle(value) {
		this.assertNotDisposed();
		if (value === void 0) return this.undefined;
		if (value === null) return this.null;
		if (value === true) return this.true;
		if (value === false) return this.false;
		if (typeof value === "number") return this.newNumber(value);
		if (typeof value === "string") return this.newString(value);
		if (typeof value === "bigint") return this.newBigInt(value);
		if (typeof value === "symbol") {
			const key = Symbol.keyFor(value);
			if (key !== void 0) return this.newSymbolFor(key);
			throw new Error(`Cannot convert local symbol to QuickJS handle. Use Symbol.for() for cross-boundary symbols.`);
		}
		if (value instanceof Promise) {
			const deferred = this.newPromise();
			value.then((r) => {
				deferred.resolve(this.hostToHandle(r));
				this.executePendingJobs();
			}, (err) => {
				deferred.reject(this.hostToHandle(err));
				this.executePendingJobs();
			});
			return deferred.handle;
		}
		if (value instanceof Error) return this.newError(value);
		if (value instanceof ArrayBuffer) return this.newArrayBuffer(value);
		if (value instanceof Uint8Array) return this.newUint8Array(value);
		if (ArrayBuffer.isView(value)) return this.newArrayBuffer(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
		if (Array.isArray(value)) {
			const arr = this.newArray();
			for (let i = 0; i < value.length; i++) {
				const elemHandle = this.hostToHandle(value[i]);
				this.exports.qjs_set_prop_uint32(arr.ptr, i, elemHandle.ptr);
				elemHandle.dispose();
			}
			return arr;
		}
		if (typeof value === "object" && value !== null) {
			const obj = this.newObject();
			for (const [key, val] of Object.entries(value)) {
				const valHandle = this.hostToHandle(val);
				obj.setProp(key, valHandle);
				valHandle.dispose();
			}
			return obj;
		}
		return this.undefined;
	}
	/**
	* Snapshot the entire VM state.
	*
	* Returns a snapshot containing the full WASM linear memory. Use
	* `QuickJS.serializeSnapshot()` to convert to a versioned binary
	* buffer for persistent storage.
	*/
	snapshot() {
		this.assertNotDisposed();
		return {
			memory: new Uint8Array(this.exports.memory.buffer).slice(),
			stackPointer: this.exports.__stack_pointer.value,
			runtimePtr: this.exports.qjs_get_runtime_ptr(),
			contextPtr: this.exports.qjs_get_context_ptr(),
			extensions: this.loadedExtensions.map((ext) => ({
				name: ext.name,
				memoryBase: ext.memoryBase,
				tableBase: ext.tableBase,
				initFn: ext.initFn
			}))
		};
	}
	/**
	* Re-register a host callback after restoring from a snapshot.
	* The name must match the name passed to `newFunction()` before the snapshot.
	*/
	registerHostCallback(name, fn) {
		this.hostCallbacks.set(name, fn);
	}
	/**
	* Dispose the VM, releasing all references to the WASM instance
	* so it can be garbage collected by the host JS engine.
	*/
	dispose() {
		if (!this.disposed) {
			this.disposed = true;
			this._global = null;
			this._undefined = null;
			this._null = null;
			this._true = null;
			this._false = null;
			this._ownedHandles.clear();
			this.hostCallbacks.clear();
			this._activeScope = null;
			this.exports = null;
			this.instance = null;
			this.module = null;
		}
	}
	/**
	* Support for `using` declarations (Explicit Resource Management).
	* Automatically disposes the VM when it goes out of scope.
	*
	* ```typescript
	* using vm = await QuickJS.create(wasmBytes);
	* vm.evalCode('1 + 2');
	* // vm is automatically disposed here
	* ```
	*/
	[Symbol.dispose]() {
		this.dispose();
	}
	assertNotDisposed() {
		if (this.disposed) throw new Error("QuickJS instance has been disposed");
	}
	/** @internal */
	_getExports() {
		return this.exports;
	}
	/** @internal */
	_getMemory() {
		return this.exports.memory;
	}
	/** @internal */
	_writeString(str) {
		return this.writeString(str);
	}
	/** @internal */
	_readCString(ptr) {
		return this.readCString(ptr);
	}
};
/**
* Whether a string-typed property key survives the NUL-terminated
* C-string key APIs: embedded U+0000 truncates the key, and an UNPAIRED
* surrogate cannot be UTF-8 encoded (paired surrogates, such as those
* that encode emoji, are fine). Keys that don't survive are routed through length-aware
* guest string values instead.
*/
function stringKeyNeedsValuePath(key) {
	return key.includes("\0") || LONE_SURROGATE_RE.test(key);
}
const wtf8Decoder = new TextDecoder();
const wtf8Encoder = new TextEncoder();
const LONE_SURROGATE_RE = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF]))|(?:(?<![\uD800-\uDBFF])[\uDC00-\uDFFF])/;
/**
* Encode a JS string to WTF-8 bytes. Well-formed strings (including
* paired surrogates, such as emoji) take the native TextEncoder; strings with
* LONE surrogates take a manual encode that writes each unpaired
* surrogate as the 3-byte sequence quickjs's tolerant UTF-8 decoder
* accepts; TextEncoder would replace them with U+FFFD, silently
* corrupting every host→guest string (sources, property keys,
* newString values).
*/
function encodeWtf8(str) {
	if (!LONE_SURROGATE_RE.test(str)) return wtf8Encoder.encode(str);
	const bytes = [];
	for (let i = 0; i < str.length; i++) {
		const code = str.charCodeAt(i);
		if (code < 128) bytes.push(code);
		else if (code < 2048) bytes.push(192 | code >> 6, 128 | code & 63);
		else if (code >= 55296 && code <= 56319 && i + 1 < str.length) {
			const next = str.charCodeAt(i + 1);
			if (next >= 56320 && next <= 57343) {
				const cp = 65536 + (code - 55296 << 10) + (next - 56320);
				bytes.push(240 | cp >> 18, 128 | cp >> 12 & 63, 128 | cp >> 6 & 63, 128 | cp & 63);
				i++;
				continue;
			}
			bytes.push(224 | code >> 12, 128 | code >> 6 & 63, 128 | code & 63);
		} else bytes.push(224 | code >> 12, 128 | code >> 6 & 63, 128 | code & 63);
	}
	return new Uint8Array(bytes);
}
/**
* Decode WTF-8 bytes to a JS string. WTF-8 is UTF-8 extended with 3-byte
* sequences for surrogate code points (0xED 0xA0-0xBF 0x80-0xBF), which
* is how quickjs's JS_ToCStringLen2 encodes lone surrogates ("keep
* unmatched surrogate code points"). TextDecoder replaces those
* sequences with U+FFFD, so they are detected first and the rare strings
* containing them take a manual decode; everything else (the
* overwhelming majority) uses the native decoder.
*/
function decodeWtf8(bytes) {
	let hasSurrogateSequence = false;
	for (let i = 0; i < bytes.length - 1; i++) if (bytes[i] === 237 && bytes[i + 1] >= 160 && bytes[i + 1] <= 191) {
		hasSurrogateSequence = true;
		break;
	}
	if (!hasSurrogateSequence) return wtf8Decoder.decode(bytes);
	let out = "";
	let i = 0;
	while (i < bytes.length) {
		const b0 = bytes[i];
		if (b0 < 128) {
			out += String.fromCharCode(b0);
			i += 1;
		} else if (b0 < 224) {
			out += String.fromCharCode((b0 & 31) << 6 | bytes[i + 1] & 63);
			i += 2;
		} else if (b0 < 240) {
			out += String.fromCharCode((b0 & 15) << 12 | (bytes[i + 1] & 63) << 6 | bytes[i + 2] & 63);
			i += 3;
		} else {
			const cp = (b0 & 7) << 18 | (bytes[i + 1] & 63) << 12 | (bytes[i + 2] & 63) << 6 | bytes[i + 3] & 63;
			out += String.fromCodePoint(cp);
			i += 4;
		}
	}
	return out;
}
/**
* An exception thrown from QuickJS code. Extends `Error` so it works with
* standard error handling (`instanceof Error`, `.message`, `.stack`), and
* also exposes a `handle` property, a live `JSValueHandle` to the QuickJS
* exception value, allowing direct inspection of custom properties.
*
* The `handle` must be disposed when you're done with it (or use `using`).
* If the error propagates uncaught, the handle will be cleaned up when the
* VM is disposed.
*/
var JSException = class extends Error {
	/**
	* A live handle to the QuickJS exception value. You can read custom
	* properties, call methods, etc. Must be disposed when done.
	*/
	handle;
	#name;
	#message;
	#stack;
	/** @internal */
	constructor(handle) {
		const env_1 = {
			stack: [],
			error: void 0,
			hasError: false
		};
		try {
			super();
			this.handle = handle;
			delete this.stack;
			const msgHandle = __addDisposableResource(env_1, handle.getProp("message"), false);
			this.#name = handle.getProp("name").consume((h) => h.isUndefined ? "Error" : h.toString());
			this.#message = msgHandle.isUndefined ? handle.toString() : msgHandle.toString();
			this.#stack = handle.getProp("stack").consume((h) => h.isUndefined ? void 0 : h.toString());
		} catch (e_1) {
			env_1.error = e_1;
			env_1.hasError = true;
		} finally {
			__disposeResources(env_1);
		}
	}
	get name() {
		return this.#name;
	}
	set name(v) {
		this.#name = v;
	}
	get message() {
		return this.#message;
	}
	set message(v) {
		this.#message = v;
	}
	get stack() {
		return this.#stack;
	}
	set stack(v) {
		this.#stack = v;
	}
	dispose() {
		this.handle.dispose();
	}
	[Symbol.dispose]() {
		this.handle.dispose();
	}
};
/**
* A handle to a JSValue inside the QuickJS WASM instance.
*/
var JSValueHandle = class JSValueHandle {
	/** The QuickJS VM instance this handle belongs to. */
	vm;
	/** @internal */
	ptr;
	disposed_ = false;
	/**
	* When true, this handle is a cached singleton (e.g. `undefined`, `null`,
	* `true`, `false`, the global object) and `dispose()` is a no-op. This
	* prevents code that routinely disposes handles (such as the object/array
	* branches of `hostToHandle`) from freeing the shared heap `JSValue*` that
	* the cached singleton still references, which would corrupt later reads.
	* @internal
	*/
	singleton;
	/**
	* When true, this handle wraps a `JSValue*` OWNED BY THE C CALLER: the
	* `this`/argument handles the host-call trampoline passes to a host
	* callback (`handleHostCall`). The C side frees those values after the
	* call returns, so `dispose()` is a no-op and the handle is never
	* registered with an active `withScope()` (either would double-free
	* the guest value and corrupt the heap). A callback that needs to
	* retain an argument past its own invocation must `dup()` it; the
	* duplicate takes a fresh reference and behaves like any owned handle.
	* @internal
	*/
	borrowed;
	/**
	* Extra cleanup to run when this handle is disposed. Used by
	* `newEphemeralFunction()` to unregister its host callback.
	* @internal
	*/
	_onDispose;
	constructor(vm, ptr, singleton = false, borrowed = false) {
		this.vm = vm;
		this.ptr = ptr;
		this.singleton = singleton;
		this.borrowed = borrowed;
		if (!singleton && !borrowed) vm._activeScope?.add(this);
	}
	/**
	* Whether this handle wraps a C-owned pointer (host-callback
	* `this`/arguments). Borrowed handles must never be exported as
	* snapshot tokens: the trampoline frees their boxes after the
	* callback returns. @internal
	*/
	get _isBorrowed() {
		return this.borrowed;
	}
	/**
	* Whether `dispose()` has been called on this handle.
	*
	* Note that handle methods do not currently guard against use after
	* disposal: reading from a disposed handle reads freed memory. Check this
	* when a handle's lifetime is managed elsewhere (e.g. by `withScope()`).
	*/
	get disposed() {
		return this.disposed_;
	}
	get isUndefined() {
		return this.vm._getExports().qjs_is_undefined(this.ptr) !== 0;
	}
	get isNull() {
		return this.vm._getExports().qjs_is_null(this.ptr) !== 0;
	}
	/**
	* Get the promise state: 0 = pending, 1 = fulfilled, 2 = rejected
	*/
	get isBool() {
		return this.vm._getExports().qjs_is_bool(this.ptr) !== 0;
	}
	get isNumber() {
		return this.vm._getExports().qjs_is_number(this.ptr) !== 0;
	}
	get isString() {
		return this.vm._getExports().qjs_is_string(this.ptr) !== 0;
	}
	get isSymbol() {
		return this.vm._getExports().qjs_is_symbol(this.ptr) !== 0;
	}
	get isBigInt() {
		return this.vm._getExports().qjs_is_big_int(this.ptr) !== 0;
	}
	get isObject() {
		return this.vm._getExports().qjs_is_object(this.ptr) !== 0;
	}
	get isArray() {
		return this.vm._getExports().qjs_is_array(this.ptr) !== 0;
	}
	get isFunction() {
		return this.vm._getExports().qjs_is_function(this.ptr) !== 0;
	}
	get isError() {
		return this.vm._getExports().qjs_is_error(this.ptr) !== 0;
	}
	get isPromise() {
		return this.vm._getExports().qjs_is_promise(this.ptr) !== 0;
	}
	get isArrayBuffer() {
		return this.vm._getExports().qjs_is_array_buffer(this.ptr) !== 0;
	}
	/**
	* Whether this value is a Proxy exotic object.
	*
	* This is an engine-level check: it never fires proxy traps and cannot
	* be determined (or spoofed) from within guest JavaScript. Use
	* {@link getProxyTarget} / {@link getProxyHandler} to introspect a
	* detected proxy without executing guest code.
	*/
	get isProxy() {
		return this.vm._getExports().qjs_is_proxy(this.ptr) !== 0;
	}
	/**
	* Whether this value is a Map (engine brand check: trap-free,
	* spoof-proof, and unaffected by prototype/constructor mutation).
	* A Proxy wrapping a Map returns false.
	*/
	get isMap() {
		return this.vm._getExports().qjs_is_map(this.ptr) !== 0;
	}
	/**
	* Whether this value is a Set (engine brand check: trap-free,
	* spoof-proof, and unaffected by prototype/constructor mutation).
	* A Proxy wrapping a Set returns false.
	*/
	get isSet() {
		return this.vm._getExports().qjs_is_set(this.ptr) !== 0;
	}
	/**
	* Whether this value is a Date (engine brand check: trap-free,
	* spoof-proof, and unaffected by prototype/constructor mutation).
	* A Proxy wrapping a Date returns false.
	*/
	get isDate() {
		return this.vm._getExports().qjs_is_date(this.ptr) !== 0;
	}
	/**
	* Whether this value is a RegExp (engine brand check: trap-free,
	* spoof-proof, and unaffected by prototype/constructor mutation).
	* A Proxy wrapping a RegExp returns false.
	*/
	get isRegExp() {
		return this.vm._getExports().qjs_is_regexp(this.ptr) !== 0;
	}
	/** Whether this value is a WeakRef (engine brand check). */
	get isWeakRef() {
		return this.vm._getExports().qjs_is_weak_ref(this.ptr) !== 0;
	}
	/** Whether this value is a WeakMap (engine brand check). */
	get isWeakMap() {
		return this.vm._getExports().qjs_is_weak_map(this.ptr) !== 0;
	}
	/** Whether this value is a WeakSet (engine brand check). */
	get isWeakSet() {
		return this.vm._getExports().qjs_is_weak_set(this.ptr) !== 0;
	}
	/** Whether this value is a DataView (engine brand check). */
	get isDataView() {
		return this.vm._getExports().qjs_is_data_view(this.ptr) !== 0;
	}
	/**
	* A numeric identity for the underlying heap value, or 0 for values that
	* are not heap-allocated (numbers, booleans, `null`, `undefined`).
	*
	* Two handles to the same underlying object always report the same
	* identity, and two live handles to different objects always report
	* different identities, so this is the value to key a `Map` on when
	* deduplicating or detecting cycles across handles (`dump()` uses it for
	* exactly that).
	*
	* The identity is only meaningful while the value is alive; it is an
	* address, so it may be reused after every handle to the value has been
	* disposed. Do not persist it, and do not treat it as unforgeable: a
	* number read out of the guest can trivially collide with one.
	*/
	get identity() {
		return this.vm._getExports().qjs_get_value_ptr(this.ptr);
	}
	/**
	* Extract the value as a boolean, applying JavaScript truthiness
	* (equivalent to `!!value` inside the VM).
	*/
	toBoolean() {
		return this.vm._getExports().qjs_get_bool(this.ptr) !== 0;
	}
	/**
	* The internal QuickJS class ID of this value, or 0 for non-objects.
	* Useful as a generic engine-level brand when no dedicated `is*`
	* getter exists. Class IDs are stable within a VM instance but are an
	* engine implementation detail, so prefer the dedicated getters.
	*/
	get classId() {
		return this.vm._getExports().qjs_get_class_id(this.ptr);
	}
	/**
	* The engine-level class name of this value, e.g. `"Object"`, `"Map"`,
	* `"Date"`, `"RegExp"`, or the registered name of an extension-defined
	* class like `"URL"`, or `undefined` for non-objects and unnamed
	* internal classes.
	*
	* Unlike `constructorName` (which reads the `constructor` and `name`
	* properties and can therefore fire getters/proxy traps and be spoofed),
	* this is trap-free: it reads the engine's class table directly, never
	* executes guest code, and cannot be forged by reassigning prototypes or
	* constructors. Note that the engine registers the Proxy class under the
	* name `"Object"` (mirroring `Object.prototype.toString`), so use `isProxy`
	* to detect proxies and `getProxyTarget()` to read the target's brand.
	*/
	get className() {
		const h = new JSValueHandle(this.vm, this.vm._getExports().qjs_get_class_name(this.ptr));
		if (this.vm._getExports().qjs_is_exception(h.ptr) !== 0) {
			h.dispose();
			throw new JSException(this.vm.getException());
		}
		try {
			return h.isUndefined ? void 0 : h.toString();
		} finally {
			h.dispose();
		}
	}
	get promiseState() {
		return this.vm._getExports().qjs_promise_state(this.ptr);
	}
	/**
	* Get the typeof this value as a string.
	* Returns the same values as the native `typeof` operator.
	*/
	get typeof() {
		return this.vm.typeof(this);
	}
	/**
	* Get the length property of this value (for arrays, strings, etc.).
	*/
	get length() {
		const h = this.getProp("length");
		const n = h.toNumber();
		h.dispose();
		return n;
	}
	/**
	* Get the constructor name of this object, or undefined if unavailable.
	*/
	get constructorName() {
		const ctor = this.getProp("constructor");
		if (ctor.isUndefined || ctor.isNull) {
			ctor.dispose();
			return;
		}
		const name = ctor.getProp("name");
		ctor.dispose();
		if (name.isUndefined || name.isNull) {
			name.dispose();
			return;
		}
		const result = name.toString();
		name.dispose();
		return result;
	}
	/**
	* Get the own enumerable string property names (equivalent to Object.keys()).
	*/
	keys() {
		const e = this.vm._getExports();
		const keysPtr = e.qjs_get_own_property_names(this.ptr);
		const keysHandle = new JSValueHandle(this.vm, keysPtr);
		if (e.qjs_is_exception(keysHandle.ptr) !== 0) {
			keysHandle.dispose();
			return [];
		}
		const lenHandle = keysHandle.getProp("length");
		const len = e.qjs_get_float64(lenHandle.ptr);
		lenHandle.dispose();
		const result = [];
		for (let i = 0; i < len; i++) {
			const keyPtr = e.qjs_get_prop_uint32(keysHandle.ptr, i);
			const keyHandle = new JSValueHandle(this.vm, keyPtr);
			result.push(keyHandle.toString());
			keyHandle.dispose();
		}
		keysHandle.dispose();
		return result;
	}
	/**
	* Get all own property names including non-enumerable ones
	* (equivalent to Object.getOwnPropertyNames()).
	*/
	getOwnPropertyNames() {
		const e = this.vm._getExports();
		const keysPtr = e.qjs_get_own_property_names_all(this.ptr);
		const keysHandle = new JSValueHandle(this.vm, keysPtr);
		if (e.qjs_is_exception(keysHandle.ptr) !== 0) {
			keysHandle.dispose();
			return [];
		}
		const lenHandle = keysHandle.getProp("length");
		const len = e.qjs_get_float64(lenHandle.ptr);
		lenHandle.dispose();
		const result = [];
		for (let i = 0; i < len; i++) {
			const keyPtr = e.qjs_get_prop_uint32(keysHandle.ptr, i);
			const keyHandle = new JSValueHandle(this.vm, keyPtr);
			result.push(keyHandle.toString());
			keyHandle.dispose();
		}
		keysHandle.dispose();
		return result;
	}
	/**
	* Get ALL own property keys (strings and symbols), including
	* non-enumerable (equivalent to Reflect.ownKeys()).
	*
	* String keys are returned as strings; symbol keys are returned as
	* JSValueHandles which the caller must dispose.
	*
	* Trap-free for ordinary objects; fires the `ownKeys` trap for a
	* Proxy (check {@link isProxy} first if that matters).
	*/
	getOwnPropertyKeys() {
		const e = this.vm._getExports();
		const keysPtr = e.qjs_get_own_property_keys(this.ptr);
		const keysHandle = new JSValueHandle(this.vm, keysPtr);
		if (e.qjs_is_exception(keysHandle.ptr) !== 0) {
			keysHandle.dispose();
			return [];
		}
		const lenHandle = keysHandle.getProp("length");
		const len = e.qjs_get_float64(lenHandle.ptr);
		lenHandle.dispose();
		const result = [];
		for (let i = 0; i < len; i++) {
			const keyPtr = e.qjs_get_prop_uint32(keysHandle.ptr, i);
			const keyHandle = new JSValueHandle(this.vm, keyPtr);
			if (keyHandle.isSymbol) result.push(keyHandle);
			else {
				result.push(keyHandle.toString());
				keyHandle.dispose();
			}
		}
		keysHandle.dispose();
		return result;
	}
	/**
	* Get the own property descriptor for a key WITHOUT invoking getters
	* (equivalent to Object.getOwnPropertyDescriptor()).
	*
	* This is the safe way to inspect a property that may be an accessor:
	* a data property yields `{ value, writable, enumerable, configurable }`,
	* an accessor property yields `{ get, set, enumerable, configurable }`
	* where `get`/`set` are handles to the accessor functions themselves
	* (never invoked). Returns undefined if there is no such own property.
	*
	* The `value`/`get`/`set` handles are owned by the caller and must be
	* disposed.
	*
	* Trap-free for ordinary objects; fires the `getOwnPropertyDescriptor`
	* trap for a Proxy (check {@link isProxy} first if that matters).
	*/
	getOwnPropertyDescriptor(key) {
		const env_2 = {
			stack: [],
			error: void 0,
			hasError: false
		};
		try {
			const e = this.vm._getExports();
			let keyHandle;
			let keyPtr;
			if (typeof key === "string") {
				keyHandle = this.vm.newString(key);
				keyPtr = keyHandle.ptr;
			} else keyPtr = key.ptr;
			const descPtr = e.qjs_get_own_property_descriptor(this.ptr, keyPtr);
			keyHandle?.dispose();
			if (descPtr === 0) return void 0;
			const descHandle = __addDisposableResource(env_2, new JSValueHandle(this.vm, descPtr), false);
			if (e.qjs_is_exception(descHandle.ptr) !== 0) throw new JSException(this.vm.getException());
			const enumerable = descHandle.getProp("enumerable").consume((h) => e.qjs_get_bool(h.ptr) !== 0);
			const configurable = descHandle.getProp("configurable").consume((h) => e.qjs_get_bool(h.ptr) !== 0);
			if (descHandle.hasOwnProperty("value")) return {
				value: descHandle.getProp("value"),
				writable: descHandle.getProp("writable").consume((h) => e.qjs_get_bool(h.ptr) !== 0),
				enumerable,
				configurable
			};
			return {
				get: descHandle.getProp("get"),
				set: descHandle.getProp("set"),
				enumerable,
				configurable
			};
		} catch (e_2) {
			env_2.error = e_2;
			env_2.hasError = true;
		} finally {
			__disposeResources(env_2);
		}
	}
	/**
	* Check if a property is an own property (equivalent to Object.prototype.hasOwnProperty).
	*/
	hasOwnProperty(name) {
		if (stringKeyNeedsValuePath(name)) {
			const env_3 = {
				stack: [],
				error: void 0,
				hasError: false
			};
			try {
				const keyHandle = __addDisposableResource(env_3, this.vm.newString(name), false);
				return this.vm._getExports().qjs_has_own_property_value(this.ptr, keyHandle.ptr) === 1;
			} catch (e_3) {
				env_3.error = e_3;
				env_3.hasError = true;
			} finally {
				__disposeResources(env_3);
			}
		}
		const { ptr: namePtr } = this.vm._writeString(name);
		const result = this.vm._getExports().qjs_has_own_property(this.ptr, namePtr);
		this.vm._getExports().wasm_free(namePtr);
		return result === 1;
	}
	/**
	* Check if a property is enumerable (equivalent to Object.prototype.propertyIsEnumerable).
	*/
	propertyIsEnumerable(name) {
		if (stringKeyNeedsValuePath(name)) {
			const env_4 = {
				stack: [],
				error: void 0,
				hasError: false
			};
			try {
				const keyHandle = __addDisposableResource(env_4, this.vm.newString(name), false);
				return this.vm._getExports().qjs_property_is_enumerable_value(this.ptr, keyHandle.ptr) === 1;
			} catch (e_4) {
				env_4.error = e_4;
				env_4.hasError = true;
			} finally {
				__disposeResources(env_4);
			}
		}
		const { ptr: namePtr } = this.vm._writeString(name);
		const result = this.vm._getExports().qjs_property_is_enumerable(this.ptr, namePtr);
		this.vm._getExports().wasm_free(namePtr);
		return result === 1;
	}
	/**
	* Get the prototype of this object (equivalent to Object.getPrototypeOf()).
	*/
	getPrototypeOf() {
		const protoPtr = this.vm._getExports().qjs_get_prototype_of(this.ptr);
		return new JSValueHandle(this.vm, protoPtr);
	}
	/**
	* Get the `[[ProxyTarget]]` of this Proxy without firing any traps.
	* Throws {@link JSException} if this value is not a Proxy; check
	* {@link isProxy} first. Note the target may itself be a Proxy.
	*/
	getProxyTarget() {
		const ptr = this.vm._getExports().qjs_get_proxy_target(this.ptr);
		const handle = new JSValueHandle(this.vm, ptr);
		if (this.vm._getExports().qjs_is_exception(handle.ptr) !== 0) {
			handle.dispose();
			throw new JSException(this.vm.getException());
		}
		return handle;
	}
	/**
	* Get the `[[ProxyHandler]]` of this Proxy without firing any traps.
	* Throws {@link JSException} if this value is not a Proxy; check
	* {@link isProxy} first.
	*/
	getProxyHandler() {
		const ptr = this.vm._getExports().qjs_get_proxy_handler(this.ptr);
		const handle = new JSValueHandle(this.vm, ptr);
		if (this.vm._getExports().qjs_is_exception(handle.ptr) !== 0) {
			handle.dispose();
			throw new JSException(this.vm.getException());
		}
		return handle;
	}
	/**
	* Get a property by name.
	*/
	getProp(name) {
		if (stringKeyNeedsValuePath(name)) {
			const env_5 = {
				stack: [],
				error: void 0,
				hasError: false
			};
			try {
				const keyHandle = __addDisposableResource(env_5, this.vm.newString(name), false);
				return this.vm.getProp(this, keyHandle);
			} catch (e_5) {
				env_5.error = e_5;
				env_5.hasError = true;
			} finally {
				__disposeResources(env_5);
			}
		}
		const { ptr: namePtr } = this.vm._writeString(name);
		const resultPtr = this.vm._getExports().qjs_get_prop_string(this.ptr, namePtr);
		this.vm._getExports().wasm_free(namePtr);
		return new JSValueHandle(this.vm, resultPtr);
	}
	/**
	* Set a property by name.
	*/
	setProp(name, value) {
		if (stringKeyNeedsValuePath(name)) {
			const env_6 = {
				stack: [],
				error: void 0,
				hasError: false
			};
			try {
				const keyHandle = __addDisposableResource(env_6, this.vm.newString(name), false);
				this.vm.setProp(this, keyHandle, value);
				return;
			} catch (e_6) {
				env_6.error = e_6;
				env_6.hasError = true;
			} finally {
				__disposeResources(env_6);
			}
		}
		const { ptr: namePtr } = this.vm._writeString(name);
		this.vm._getExports().qjs_set_prop_string(this.ptr, namePtr, value.ptr);
		this.vm._getExports().wasm_free(namePtr);
	}
	/**
	* Define a property with explicit property descriptor flags.
	* Unlike `setProp`, this allows controlling `writable`, `enumerable`, and
	* `configurable` attributes, matching `Object.defineProperty()` semantics.
	* Accepts string or JSValueHandle as key (JSValueHandle keys support symbols).
	*
	* All flags default to `false` when not specified.
	*/
	defineProp(key, value, descriptor) {
		let flags = 0;
		if (descriptor?.configurable) flags |= 1;
		if (descriptor?.writable) flags |= 2;
		if (descriptor?.enumerable) flags |= 4;
		if (typeof key === "string") {
			if (stringKeyNeedsValuePath(key)) {
				const env_7 = {
					stack: [],
					error: void 0,
					hasError: false
				};
				try {
					const keyHandle = __addDisposableResource(env_7, this.vm.newString(key), false);
					this.vm._getExports().qjs_define_prop_value(this.ptr, keyHandle.ptr, value.ptr, flags);
					return;
				} catch (e_7) {
					env_7.error = e_7;
					env_7.hasError = true;
				} finally {
					__disposeResources(env_7);
				}
			}
			const { ptr: namePtr } = this.vm._writeString(key);
			this.vm._getExports().qjs_define_prop_string(this.ptr, namePtr, value.ptr, flags);
			this.vm._getExports().wasm_free(namePtr);
		} else this.vm._getExports().qjs_define_prop_value(this.ptr, key.ptr, value.ptr, flags);
	}
	/**
	* Extract the value as a number.
	*/
	toNumber() {
		return this.vm._getExports().qjs_get_float64(this.ptr);
	}
	/**
	* Extract the value as a BigInt.
	*/
	toBigInt() {
		const e = this.vm._getExports();
		const loPtr = e.wasm_malloc(4);
		const hiPtr = e.wasm_malloc(4);
		if (e.qjs_get_big_int64(this.ptr, loPtr, hiPtr) !== 0) {
			e.wasm_free(loPtr);
			e.wasm_free(hiPtr);
			throw new Error("Failed to convert value to BigInt");
		}
		const view = new DataView(e.memory.buffer);
		const lo = view.getUint32(loPtr, true);
		const hi = view.getInt32(hiPtr, true);
		e.wasm_free(loPtr);
		e.wasm_free(hiPtr);
		return BigInt(hi) << 32n | BigInt(lo);
	}
	/**
	* Extract the value as an ArrayBuffer (copies from WASM memory).
	* Works on ArrayBuffer values. For typed arrays, gets the underlying buffer.
	*/
	toArrayBuffer() {
		const e = this.vm._getExports();
		const lenOutPtr = e.wasm_malloc(4);
		if (e.qjs_is_array_buffer(this.ptr)) {
			const dataPtr = e.qjs_get_array_buffer(this.ptr, lenOutPtr);
			if (dataPtr === 0) {
				e.wasm_free(lenOutPtr);
				throw new Error("Failed to get ArrayBuffer data");
			}
			const len = new DataView(e.memory.buffer).getUint32(lenOutPtr, true);
			e.wasm_free(lenOutPtr);
			return new Uint8Array(e.memory.buffer, dataPtr, len).slice().buffer;
		}
		e.wasm_free(lenOutPtr);
		const byteOffsetPtr = e.wasm_malloc(4);
		const byteLengthPtr = e.wasm_malloc(4);
		const bytesPerElemPtr = e.wasm_malloc(4);
		const abPtr = e.qjs_get_typed_array_buffer(this.ptr, byteOffsetPtr, byteLengthPtr, bytesPerElemPtr);
		const abHandle = new JSValueHandle(this.vm, abPtr);
		if (this.vm._getExports().qjs_is_exception(abHandle.ptr) !== 0) {
			abHandle.dispose();
			e.wasm_free(byteOffsetPtr);
			e.wasm_free(byteLengthPtr);
			e.wasm_free(bytesPerElemPtr);
			throw new Error("Value is not an ArrayBuffer or typed array");
		}
		const view = new DataView(e.memory.buffer);
		const byteOffset = view.getUint32(byteOffsetPtr, true);
		const byteLength = view.getUint32(byteLengthPtr, true);
		e.wasm_free(byteOffsetPtr);
		e.wasm_free(byteLengthPtr);
		e.wasm_free(bytesPerElemPtr);
		const abLenPtr = e.wasm_malloc(4);
		const abDataPtr = e.qjs_get_array_buffer(abHandle.ptr, abLenPtr);
		e.wasm_free(abLenPtr);
		abHandle.dispose();
		if (abDataPtr === 0) throw new Error("Failed to get ArrayBuffer data from typed array");
		return new Uint8Array(e.memory.buffer, abDataPtr + byteOffset, byteLength).slice().buffer;
	}
	/**
	* Extract the value as a Uint8Array (copies from WASM memory).
	* Works on Uint8Array, ArrayBuffer, and other typed array values.
	*/
	toUint8Array() {
		return new Uint8Array(this.toArrayBuffer());
	}
	/**
	* Extract the value as a string. Works on any value.
	*
	* For values that are not already strings this performs a JavaScript
	* string conversion, which **executes guest code**: `toString()` /
	* `valueOf()` / `Symbol.toPrimitive` on the value or its prototype chain,
	* and proxy traps. Guard with `isString` when the caller must not run guest
	* code, and call a captured intrinsic (e.g. `URL.prototype.toString` via
	* `vm.callFunction`) when a specific conversion is wanted.
	*/
	toString() {
		const e = this.vm._getExports();
		const lenPtr = e.wasm_malloc(4);
		if (lenPtr === 0) throw new Error("wasm_malloc failed");
		try {
			const cstrPtr = e.qjs_get_string_len(this.ptr, lenPtr);
			if (cstrPtr === 0) return "<null>";
			const len = new DataView(e.memory.buffer).getUint32(lenPtr, true);
			const str = decodeWtf8(new Uint8Array(e.memory.buffer, cstrPtr, len));
			e.qjs_free_cstring(cstrPtr);
			return str;
		} finally {
			e.wasm_free(lenPtr);
		}
	}
	/**
	* Use this handle, then dispose it. Returns the callback's return value.
	*/
	consume(fn) {
		try {
			return fn(this);
		} finally {
			this.dispose();
		}
	}
	/**
	* Duplicate this handle (increment refcount).
	*/
	dup() {
		return new JSValueHandle(this.vm, this.vm._getExports().qjs_dup_value(this.ptr));
	}
	/**
	* Dispose this handle, freeing the heap-allocated JSValue.
	* Safe to call after the VM has been disposed (becomes a no-op).
	*/
	dispose() {
		if (this.singleton || this.borrowed) return;
		if (!this.disposed_) {
			this.disposed_ = true;
			this._onDispose?.();
			this._onDispose = void 0;
			const exports = this.vm._getExports();
			if (exports) exports.qjs_free_value(this.ptr);
		}
	}
	/**
	* Support for `using` declarations (Explicit Resource Management).
	* Automatically disposes the handle when it goes out of scope.
	*
	* ```typescript
	* using result = vm.evalCode('1 + 2');
	* console.log(result.toNumber()); // 3
	* // result is automatically disposed here
	* ```
	*/
	[Symbol.dispose]() {
		this.dispose();
	}
};
//#endregion
//#region extensions/code-mode-quickjs/src/source-location.ts
function readSourceLocation(vm) {
	const descriptor = vm.global.getOwnPropertyDescriptor(SOURCE_LOCATION_KEY);
	if (!descriptor) return;
	try {
		if (descriptor.writable || descriptor.configurable || descriptor.enumerable || !descriptor.value?.isString) return;
		const value = JSON.parse(descriptor.value.toString());
		if (!isRecord(value)) return;
		const { file, lineOffset, lineCount, columnOffset, endColumn } = value;
		const isOffset = (offset) => typeof offset === "number" && Number.isSafeInteger(offset) && offset >= 0;
		if (file !== "openclaw-code-mode:user.js" || !isOffset(lineOffset) || !isOffset(lineCount) || lineCount === 0 || !isOffset(columnOffset) || !isOffset(endColumn) || endColumn === 0 || !Number.isSafeInteger(lineOffset + lineCount) || lineCount === 1 && endColumn <= columnOffset) return;
		return {
			file,
			lineOffset,
			lineCount,
			columnOffset,
			endColumn
		};
	} catch {
		return;
	} finally {
		descriptor.value?.dispose();
		descriptor.get?.dispose();
		descriptor.set?.dispose();
	}
}
//#endregion
//#region extensions/code-mode-quickjs/src/code-mode.worker.ts
/** QuickJS worker for Code Mode guest execution and suspended VM snapshots. */
var CodeModeWorkerFailure = class extends Error {
	constructor(code, message) {
		super(message);
		this.name = "CodeModeWorkerFailure";
		this.code = code;
	}
};
function isQuickJsInterruptedError(error) {
	return error instanceof JSException && error.message === "interrupted";
}
function formatQuickJsError(name, message, stack, location) {
	const header = message ? `${name}: ${message}` : name;
	const sourceStack = normalizeSourceStack(stack, location);
	if (!sourceStack || sourceStack.split(/\r?\n/, 1)[0] === header) return header;
	return `${header}\n${sourceStack}`;
}
function errorMessage(error, location) {
	if (error instanceof JSException) return formatQuickJsError(error.name, error.message, error.stack, location);
	if (error instanceof Error) return error.message || String(error);
	return String(error);
}
function trackPromiseRejection(promise, reason, handled) {
	const vm = promise.vm;
	vm.global.getProp("__openclawTrackRejection").consume((track) => vm.callFunction(track, vm.undefined, promise, reason, handled ? vm.true : vm.false).dispose());
}
function createHostRequestHandler(params) {
	return (methodHandle, argsHandle, bridgeIdHandle, callStackHandle) => {
		if (params.bridge.pendingRequests.length >= params.config.maxPendingToolCalls) {
			params.bridge.admissionFailure ??= new CodeModeWorkerFailure("invalid_input", "too many pending code mode tool calls");
			throw params.bridge.admissionFailure;
		}
		const method = methodHandle.toString();
		if (method !== "search" && method !== "describe" && method !== "callValue" && method !== "resultSave" && method !== "resultLoad" && method !== "resultDelete" && method !== "nodes" && method !== "yield" && method !== "namespace" && method !== "agentSpawn" && method !== "agentWait" && method !== "skillsList" && method !== "skillsRead" && method !== "sleep" && method !== "swarmNote") throw new Error("unsupported code mode bridge method");
		const args = JSON.parse(argsHandle.toString());
		if (!Array.isArray(args)) throw new Error("invalid code mode bridge arguments: expected an array");
		const id = bridgeIdHandle?.toString();
		if (!id?.startsWith(`bridge:${method}:`) || !/^bridge:[A-Za-z]+:[1-9]\d*$/u.test(id)) throw new Error("invalid code mode bridge id");
		if (params.bridge.pendingRequests.some((request) => request.id === id)) throw new Error("duplicate code mode bridge id");
		params.bridge.pendingRequests.push({
			id,
			method,
			args
		});
		const stack = callStackHandle?.isString ? callStackHandle.toString().slice(0, 8192) : "";
		return params.vm.newString(normalizeSourceStack(stack, readSourceLocation(params.vm)) ?? "");
	};
}
function createHostCancelRequestHandler(params) {
	return (idHandle) => {
		const id = idHandle.toString();
		const index = params.bridge.pendingRequests.findIndex((request) => request.id === id);
		if (index >= 0) {
			params.bridge.pendingRequests.splice(index, 1);
			params.bridge.canceledRequestIds.push(id);
		}
		return params.vm.undefined;
	};
}
async function createVm(input, bridge) {
	let deadlineMs = performance.now() + input.config.timeoutMs;
	let timedOut = false;
	let paused = false;
	const deadlineReached = () => !paused && performance.now() >= deadlineMs;
	const options = {
		wasm: input.wasmModule,
		extensions: input.wasmExtensions,
		memoryLimit: input.config.memoryLimitBytes,
		maxStackSize: MAX_STACK_SIZE,
		timezoneOffset: 0,
		onUnhandledRejection: trackPromiseRejection,
		interruptHandler: () => {
			timedOut = deadlineReached();
			return timedOut;
		}
	};
	const vm = input.kind === "resume" ? await QuickJS.restore(input.continuation, options) : await QuickJS.create(options);
	try {
		if (input.kind === "resume") input.continuation.memory = /* @__PURE__ */ new Uint8Array();
		const callbacks = [
			["__openclawHostRequest", createHostRequestHandler({
				vm,
				bridge,
				config: input.config
			})],
			["__openclawHostCancelRequest", createHostCancelRequestHandler({
				vm,
				bridge
			})],
			["__openclawHostObserveNetworkContent", () => {
				bridge.networkContentObserved = true;
				return vm.undefined;
			}]
		];
		for (const [name, callback] of callbacks) if (input.kind === "resume") vm.registerHostCallback(name, callback);
		else vm.newFunction(name, callback).consume((handle) => vm.global.setProp(name, handle));
		if (input.kind === "exec") {
			for (const [name, value] of [
				["__openclawCatalog", input.catalog],
				["__openclawNamespaces", input.namespaces],
				["__openclawApiFiles", input.apiFiles ?? []],
				["__openclawSwarmEnabled", input.swarmEnabled === true],
				["__openclawMaxPendingToolCalls", input.config.maxPendingToolCalls]
			]) vm.hostToHandle(value).consume((handle) => vm.global.setProp(name, handle));
			vm.evalCode(CODE_MODE_CONTROLLER_SOURCE, "openclaw-code-mode:controller.js").dispose();
		}
		return {
			vm,
			didTimeout: () => timedOut || deadlineReached(),
			pauseBudget: () => {
				timedOut ||= deadlineReached();
				paused = true;
			},
			setBudget: (timeoutMs) => {
				paused = false;
				timedOut = false;
				deadlineMs = performance.now() + timeoutMs;
			}
		};
	} catch (error) {
		vm.dispose();
		throw error;
	}
}
function takeOutput(vm) {
	return vm.global.getProp("__openclawTakeOutputJson").consume((take) => vm.callFunction(take, vm.undefined).consume((output) => {
		const parsed = JSON.parse(output.toString());
		return Array.isArray(parsed) ? parsed : [];
	}));
}
function takeOutputSafely(vm) {
	try {
		return takeOutput(vm);
	} catch {
		return [];
	}
}
function captureWorkerResult(result, config, retainFinalValue = false) {
	const output = captureCodeModeOutput(result.output, config.maxOutputBytes);
	if (result.status === "completed") return {
		...result,
		output,
		value: captureCodeModeValue(result.value, config.maxOutputBytes, retainFinalValue ? Math.min(config.memoryLimitBytes, config.maxSnapshotBytes) : config.maxOutputBytes)
	};
	return result.status === "failed" ? {
		...result,
		output,
		error: boundCodeModeError(result.error, config.maxOutputBytes)
	} : {
		...result,
		output
	};
}
function failedWorkerResult(code, error, output = []) {
	return {
		status: "failed",
		code,
		error,
		failurePhase: code === "invalid_input" ? "input" : "guest",
		bridgeDispatchStarted: false,
		output
	};
}
function workerFailureResult(params) {
	const timedOut = params.didTimeout() || isQuickJsInterruptedError(params.error);
	const output = params.output.length > 0 ? params.output : takeOutputSafely(params.vm);
	if (timedOut) return failedWorkerResult("timeout", "code mode timeout exceeded", output);
	if (params.error instanceof CodeModeWorkerFailure) return failedWorkerResult(params.error.code, params.error.message, output);
	return failedWorkerResult(params.error instanceof ToolInputError ? "invalid_input" : "internal_error", errorMessage(params.error, readSourceLocation(params.vm)), output);
}
async function readCompletedResult(vm, resultHandle) {
	const settled = await vm.resolvePromise(resultHandle);
	if ("error" in settled) return settled.error.consume((error) => {
		const dumped = vm.dump(error);
		if (dumped instanceof Error && dumped.name === "ReferenceError" && /^(?:require|module|process) is not defined$/u.test(dumped.message)) throw new CodeModeWorkerFailure("invalid_input", "code mode module access is disabled.");
		const text = dumped instanceof Error ? formatQuickJsError(dumped.name, dumped.message, dumped.stack, readSourceLocation(vm)) : errorMessage(dumped);
		throw new Error(text);
	});
	return settled.value.consume((value) => JSON.parse(value.toString()));
}
function waitingResult(params) {
	const snapshot = params.vm.snapshot();
	const metadata = QuickJS.serializeSnapshot({
		...snapshot,
		memory: /* @__PURE__ */ new Uint8Array()
	});
	if (snapshot.memory.byteLength + metadata.byteLength > params.config.maxSnapshotBytes) throw new CodeModeWorkerFailure("snapshot_limit_exceeded", "code mode snapshot limit exceeded");
	return {
		status: "waiting",
		continuation: snapshot,
		pendingRequests: params.bridge.pendingRequests,
		canceledRequestIds: params.bridge.canceledRequestIds,
		settlementMode: params.settlementMode,
		output: params.output
	};
}
async function runVmExecution(params) {
	let output = [];
	let prepare = params.prepare;
	let consumed = params.channel?.consumeInput;
	try {
		for (;;) {
			prepare();
			consumed?.();
			consumed = void 0;
			params.vm.executePendingJobs();
			if (params.bridge.admissionFailure) throw params.bridge.admissionFailure;
			const admissionError = params.vm.global.getProp("__openclawAdmissionError").consume((read) => params.vm.callFunction(read, params.vm.undefined).consume((error) => error.isString ? error.toString() : void 0));
			if (admissionError) throw new CodeModeWorkerFailure("invalid_input", admissionError);
			params.vm.global.getProp("__openclawDrainQueuedRequests").consume((drain) => params.vm.callFunction(drain, params.vm.undefined).dispose());
			output = takeOutput(params.vm);
			const resultHandle = params.vm.global.getProp("__openclawResult");
			try {
				try {
					var _usingCtx$1 = _usingCtx();
					const promisePending = resultHandle.isPromise && resultHandle.promiseState === 0;
					if (promisePending && params.bridge.pendingRequests.length === 0) throw new Error("code mode promise is pending without host work");
					const requiredPendingRequestIds = params.bridge.pendingRequests.map((request) => request.id);
					if (promisePending || requiredPendingRequestIds.length > 0) {
						const settlementMode = promisePending ? { kind: "awaiting" } : {
							kind: "draining",
							requiredRequestIds: requiredPendingRequestIds
						};
						if (params.channel) {
							params.pauseBudget();
							const response = await params.channel.request({
								status: "boundary",
								...params.bridge.networkContentObserved ? { networkContentObserved: true } : {},
								pendingRequests: params.bridge.pendingRequests,
								canceledRequestIds: params.bridge.canceledRequestIds,
								settlementMode,
								output: captureCodeModeOutput(output, params.config.maxOutputBytes),
								memoryUsedBytes: params.vm.getMemoryUsage().memoryUsedSize
							});
							output = [];
							consumed = response.consumed;
							const command = response.input;
							if (command.kind === "continue") {
								if (!Number.isFinite(command.timeoutMs) || command.timeoutMs <= 0 || command.timeoutMs > params.maxTimeoutMs) throw new CodeModeWorkerFailure("timeout", "invalid code mode continuation budget");
								params.setBudget(command.timeoutMs);
								params.bridge.pendingRequests = command.pendingRequests;
								params.bridge.canceledRequestIds = [];
								prepare = () => settleRequests(params.vm, command.settledRequests);
								continue;
							}
							if (command.kind !== "checkpoint") throw new Error("invalid code mode continuation");
							consumed();
							consumed = void 0;
						}
						return waitingResult({
							vm: params.vm,
							bridge: params.bridge,
							settlementMode,
							output,
							config: params.config
						});
					}
					const value = await readCompletedResult(params.vm, resultHandle);
					const rejection = _usingCtx$1.u(params.vm.global.getProp("__openclawUnhandledRejection").consume((read) => params.vm.callFunction(read, params.vm.undefined)));
					if (rejection.isPromise) await readCompletedResult(params.vm, rejection);
					return {
						status: "completed",
						value,
						output
					};
				} catch (_) {
					_usingCtx$1.e = _;
				} finally {
					_usingCtx$1.d();
				}
			} finally {
				resultHandle.dispose();
			}
		}
	} catch (error) {
		return workerFailureResult({
			error,
			didTimeout: params.didTimeout,
			output,
			vm: params.vm
		});
	} finally {
		params.vm.dispose();
	}
}
function settleRequests(vm, requests) {
	try {
		vm.global.getProp("__openclawSettleBridge").consume((settle) => {
			for (const request of requests) try {
				var _usingCtx3 = _usingCtx();
				const id = _usingCtx3.u(vm.newString(request.id));
				const payload = _usingCtx3.u(vm.newString(request.json));
				vm.callFunction(settle, vm.undefined, id, request.ok ? vm.true : vm.false, payload).dispose();
			} catch (_) {
				_usingCtx3.e = _;
			} finally {
				_usingCtx3.d();
			}
		});
	} finally {
		for (const request of requests) request.json = "";
		requests.length = 0;
	}
}
async function run(input, channel) {
	const startedAt = performance.now();
	const source = input.kind === "exec" ? prepareSource(input.source) : "";
	const config = {
		...input.config,
		timeoutMs: Math.min(input.config.timeoutMs - (performance.now() - startedAt), input.kind === "exec" ? input.executionTimeoutMs ?? Infinity : Infinity)
	};
	if (config.timeoutMs <= 0) throw new CodeModeWorkerFailure("timeout", "code mode timeout exceeded");
	const bridge = {
		pendingRequests: input.kind === "resume" ? [...input.pendingRequests ?? []] : [],
		canceledRequestIds: []
	};
	const { vm, didTimeout, setBudget, pauseBudget } = await createVm({
		...input,
		config
	}, bridge);
	const result = await runVmExecution({
		vm,
		didTimeout,
		setBudget,
		pauseBudget,
		channel,
		bridge,
		config,
		maxTimeoutMs: input.config.timeoutMs,
		prepare: () => {
			if (input.kind === "exec") {
				const program = buildUserSource(source, input.prelude);
				vm.newString(JSON.stringify(program.location)).consume((location) => vm.global.defineProp(SOURCE_LOCATION_KEY, location));
				vm.evalCode(program.source, USER_SOURCE_FILE, EvalFlags.ASYNC).dispose();
				return;
			}
			settleRequests(vm, input.settledRequests);
		}
	});
	return bridge.networkContentObserved ? {
		...result,
		networkContentObserved: true
	} : result;
}
function isQuickJsWasmModule(value) {
	return Object.prototype.toString.call(value) === "[object WebAssembly.Module]";
}
function isQuickJsWasmExtensions(value) {
	return Array.isArray(value) && value.every((extension) => isRecord(extension) && typeof extension.name === "string" && isQuickJsWasmModule(extension.wasm));
}
async function main(input, channel) {
	if (!isRecord(input) || !isRecord(input.config) || !isQuickJsWasmModule(input.wasmModule) || !isQuickJsWasmExtensions(input.wasmExtensions)) return {
		...failedWorkerResult("invalid_input", "invalid code mode worker input"),
		output: EMPTY_CODE_MODE_OUTPUT
	};
	const config = input.config;
	try {
		if (config.timeoutMs <= 0) throw new CodeModeWorkerFailure("timeout", "code mode timeout exceeded");
		if (input.kind === "exec" && typeof input.source === "string") return captureWorkerResult(await run({
			kind: "exec",
			wasmModule: input.wasmModule,
			wasmExtensions: input.wasmExtensions,
			source: input.source,
			prelude: typeof input.prelude === "string" ? input.prelude : void 0,
			executionTimeoutMs: typeof input.executionTimeoutMs === "number" ? input.executionTimeoutMs : void 0,
			config,
			catalog: Array.isArray(input.catalog) ? input.catalog : [],
			apiFiles: Array.isArray(input.apiFiles) ? input.apiFiles : [],
			namespaces: Array.isArray(input.namespaces) ? input.namespaces : [],
			swarmEnabled: input.swarmEnabled === true
		}, channel), config, input.retainFinalValue === true);
		const snapshot = input.continuation;
		if (input.kind === "resume" && snapshot?.memory instanceof Uint8Array) return captureWorkerResult(await run({
			kind: "resume",
			wasmModule: input.wasmModule,
			wasmExtensions: input.wasmExtensions,
			continuation: snapshot,
			config,
			settledRequests: Array.isArray(input.settledRequests) ? input.settledRequests : [],
			pendingRequests: Array.isArray(input.pendingRequests) ? input.pendingRequests : []
		}, channel), config, input.retainFinalValue === true);
		return {
			...failedWorkerResult("invalid_input", "invalid code mode worker input"),
			output: EMPTY_CODE_MODE_OUTPUT
		};
	} catch (error) {
		const timedOut = isQuickJsInterruptedError(error);
		return captureWorkerResult(failedWorkerResult(timedOut ? "timeout" : error instanceof CodeModeWorkerFailure ? error.code : error instanceof ToolInputError ? "invalid_input" : "internal_error", timedOut ? "code mode timeout exceeded" : errorMessage(error)), config);
	}
}
serveWorkerTasks(main, { transferList: (result) => result.status === "waiting" ? [result.continuation.memory.buffer] : [] });
//#endregion
export {};
