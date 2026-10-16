//#region src/process/supervisor/service-child-windows-job-native.ts
const JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE = 8192;
const JOB_OBJECT_BASIC_PROCESS_ID_LIST = 3;
const MAX_JOB_PROCESS_IDS = 4096;
const PROC_THREAD_ATTRIBUTE_HANDLE_LIST = 131074;
const PROC_THREAD_ATTRIBUTE_JOB_LIST = 131085;
const HANDLE_FLAG_INHERIT = 1;
const GENERIC_READ = 2147483648;
const OPEN_EXISTING = 3;
const FILE_ATTRIBUTE_NORMAL = 128;
let retainedProcessJob;
/** The executable caller keeps this non-inheritable Job handle until OS exit. */
function retainWindowsProcessJobUntilExit(koffi) {
	if (retainedProcessJob !== void 0) return;
	const bindings = createWindowsJobBindings(koffi);
	bindings.assertLayouts();
	const job = bindings.requireHandle(bindings.CreateJobObjectW(null, null), "CreateJobObjectW");
	try {
		if (!bindings.SetExtendedLimits(job, 9, bindings.extendedLimits, bindings.extendedLimitsSize)) throw bindings.lastError("SetInformationJobObject(KILL_ON_JOB_CLOSE)");
		if (!bindings.AssignProcessToJobObject(job, bindings.GetCurrentProcess())) throw bindings.lastError("AssignProcessToJobObject(finalizer)");
	} catch (error) {
		bindings.CloseHandle(job);
		throw error;
	}
	retainedProcessJob = job;
}
/** The caller supplies a pinned live launcher process, which becomes the last Job handle owner. */
function bindWindowsProcessJobToOwner(bindings, owner) {
	const job = bindings.requireHandle(bindings.CreateJobObjectW(null, null), "CreateJobObjectW");
	try {
		if (!bindings.SetExtendedLimits(job, 9, bindings.extendedLimits, bindings.extendedLimitsSize)) throw bindings.lastError("SetInformationJobObject(KILL_ON_JOB_CLOSE)");
		const transferred = [null];
		if (!bindings.DuplicateHandle(bindings.GetCurrentProcess(), job, owner, transferred, 0, 0, 2)) throw bindings.lastError("DuplicateHandle(Job to task launcher)");
		bindings.requireHandle(transferred[0], "DuplicateHandle(task launcher Job)");
		if (!bindings.AssignProcessToJobObject(job, bindings.GetCurrentProcess())) throw bindings.lastError("AssignProcessToJobObject(task supervisor)");
	} catch (error) {
		bindings.CloseHandle(job);
		throw error;
	}
	if (!bindings.CloseHandle(job)) throw bindings.lastError("CloseHandle(local task Job)");
}
function createWindowsJobBindings(koffi) {
	if (process.arch !== "x64" && process.arch !== "arm64") throw new Error(`Windows Job command ownership requires x64 or arm64, got ${process.arch}`);
	const kernel32 = koffi.load("kernel32.dll");
	const HANDLE = koffi.pointer(koffi.opaque());
	const VOID_POINTER = koffi.pointer(koffi.opaque());
	const SECURITY_ATTRIBUTES = koffi.struct({
		nLength: "uint32_t",
		lpSecurityDescriptor: VOID_POINTER,
		bInheritHandle: "int32_t"
	});
	const BASIC_LIMITS = koffi.struct({
		PerProcessUserTimeLimit: "int64_t",
		PerJobUserTimeLimit: "int64_t",
		LimitFlags: "uint32_t",
		MinimumWorkingSetSize: "uintptr_t",
		MaximumWorkingSetSize: "uintptr_t",
		ActiveProcessLimit: "uint32_t",
		Affinity: "uintptr_t",
		PriorityClass: "uint32_t",
		SchedulingClass: "uint32_t"
	});
	const IO_COUNTERS = koffi.struct({
		ReadOperationCount: "uint64_t",
		WriteOperationCount: "uint64_t",
		OtherOperationCount: "uint64_t",
		ReadTransferCount: "uint64_t",
		WriteTransferCount: "uint64_t",
		OtherTransferCount: "uint64_t"
	});
	const EXTENDED_LIMITS = koffi.struct({
		BasicLimitInformation: BASIC_LIMITS,
		IoInfo: IO_COUNTERS,
		ProcessMemoryLimit: "uintptr_t",
		JobMemoryLimit: "uintptr_t",
		PeakProcessMemoryUsed: "uintptr_t",
		PeakJobMemoryUsed: "uintptr_t"
	});
	const BASIC_ACCOUNTING = koffi.struct({
		TotalUserTime: "int64_t",
		TotalKernelTime: "int64_t",
		ThisPeriodTotalUserTime: "int64_t",
		ThisPeriodTotalKernelTime: "int64_t",
		TotalPageFaultCount: "uint32_t",
		TotalProcesses: "uint32_t",
		ActiveProcesses: "uint32_t",
		TotalTerminatedProcesses: "uint32_t"
	});
	const STARTUPINFO = koffi.struct({
		cb: "uint32_t",
		lpReserved: VOID_POINTER,
		lpDesktop: VOID_POINTER,
		lpTitle: VOID_POINTER,
		dwX: "uint32_t",
		dwY: "uint32_t",
		dwXSize: "uint32_t",
		dwYSize: "uint32_t",
		dwXCountChars: "uint32_t",
		dwYCountChars: "uint32_t",
		dwFillAttribute: "uint32_t",
		dwFlags: "uint32_t",
		wShowWindow: "uint16_t",
		cbReserved2: "uint16_t",
		lpReserved2: VOID_POINTER,
		hStdInput: HANDLE,
		hStdOutput: HANDLE,
		hStdError: HANDLE
	});
	const STARTUPINFOEX = koffi.struct({
		StartupInfo: STARTUPINFO,
		lpAttributeList: VOID_POINTER
	});
	const PROCESS_INFORMATION = koffi.struct({
		hProcess: HANDLE,
		hThread: HANDLE,
		dwProcessId: "uint32_t",
		dwThreadId: "uint32_t"
	});
	const getLastErrorCode = kernel32.func("__stdcall", "GetLastError", "uint32_t", []);
	const CloseHandle = kernel32.func("__stdcall", "CloseHandle", "int32_t", [HANDLE]);
	const CreateJobObjectW = kernel32.func("__stdcall", "CreateJobObjectW", HANDLE, [VOID_POINTER, "str16"]);
	const OpenJobObjectW = kernel32.func("__stdcall", "OpenJobObjectW", HANDLE, [
		"uint32_t",
		"int32_t",
		"str16"
	]);
	const GetCurrentProcess = kernel32.func("__stdcall", "GetCurrentProcess", HANDLE, []);
	const DuplicateHandle = kernel32.func("__stdcall", "DuplicateHandle", "int32_t", [
		HANDLE,
		HANDLE,
		HANDLE,
		koffi.out(koffi.pointer(HANDLE)),
		"uint32_t",
		"int32_t",
		"uint32_t"
	]);
	const AssignProcessToJobObject = kernel32.func("__stdcall", "AssignProcessToJobObject", "int32_t", [HANDLE, HANDLE]);
	const SetExtendedLimits = kernel32.func("__stdcall", "SetInformationJobObject", "int32_t", [
		HANDLE,
		"int32_t",
		koffi.pointer(EXTENDED_LIMITS),
		"uint32_t"
	]);
	const CreatePipe = kernel32.func("__stdcall", "CreatePipe", "int32_t", [
		koffi.out(koffi.pointer(HANDLE)),
		koffi.out(koffi.pointer(HANDLE)),
		koffi.pointer(SECURITY_ATTRIBUTES),
		"uint32_t"
	]);
	const SetHandleInformation = kernel32.func("__stdcall", "SetHandleInformation", "int32_t", [
		HANDLE,
		"uint32_t",
		"uint32_t"
	]);
	const CreateFileW = kernel32.func("__stdcall", "CreateFileW", HANDLE, [
		"str16",
		"uint32_t",
		"uint32_t",
		koffi.pointer(SECURITY_ATTRIBUTES),
		"uint32_t",
		"uint32_t",
		HANDLE
	]);
	const InitializeProcThreadAttributeList = kernel32.func("__stdcall", "InitializeProcThreadAttributeList", "int32_t", [
		VOID_POINTER,
		"uint32_t",
		"uint32_t",
		koffi.inout(koffi.pointer("uintptr_t"))
	]);
	const UpdateProcThreadAttribute = kernel32.func("__stdcall", "UpdateProcThreadAttribute", "int32_t", [
		VOID_POINTER,
		"uint32_t",
		"uintptr_t",
		VOID_POINTER,
		"uintptr_t",
		VOID_POINTER,
		VOID_POINTER
	]);
	const DeleteProcThreadAttributeList = kernel32.func("__stdcall", "DeleteProcThreadAttributeList", "void", [VOID_POINTER]);
	const CreateProcessW = kernel32.func("__stdcall", "CreateProcessW", "int32_t", [
		"str16",
		koffi.pointer("uint16_t"),
		VOID_POINTER,
		VOID_POINTER,
		"int32_t",
		"uint32_t",
		VOID_POINTER,
		"str16",
		koffi.pointer(STARTUPINFOEX),
		koffi.out(koffi.pointer(PROCESS_INFORMATION))
	]);
	const WaitForSingleObject = kernel32.func("__stdcall", "WaitForSingleObject", "uint32_t", [HANDLE, "uint32_t"]);
	const GetExitCodeProcess = kernel32.func("__stdcall", "GetExitCodeProcess", "int32_t", [HANDLE, koffi.out(koffi.pointer("uint32_t"))]);
	const QueryInformationJobObject = kernel32.func("__stdcall", "QueryInformationJobObject", "int32_t", [
		HANDLE,
		"int32_t",
		koffi.out(koffi.pointer(BASIC_ACCOUNTING)),
		"uint32_t",
		VOID_POINTER
	]);
	const QueryJobProcessIds = kernel32.func("__stdcall", "QueryInformationJobObject", "int32_t", [
		HANDLE,
		"int32_t",
		VOID_POINTER,
		"uint32_t",
		koffi.out(koffi.pointer("uint32_t"))
	]);
	const PeekNamedPipe = kernel32.func("__stdcall", "PeekNamedPipe", "int32_t", [
		HANDLE,
		VOID_POINTER,
		"uint32_t",
		VOID_POINTER,
		koffi.out(koffi.pointer("uint32_t")),
		VOID_POINTER
	]);
	const ReadFile = kernel32.func("__stdcall", "ReadFile", "int32_t", [
		HANDLE,
		koffi.out(koffi.pointer("uint8_t")),
		"uint32_t",
		koffi.out(koffi.pointer("uint32_t")),
		VOID_POINTER
	]);
	const TerminateJobObject = kernel32.func("__stdcall", "TerminateJobObject", "int32_t", [HANDLE, "uint32_t"]);
	const lastError = (operation) => /* @__PURE__ */ new Error(`${operation} failed (Win32 error ${getLastErrorCode()})`);
	const requireHandle = (value, operation) => {
		if (typeof value !== "bigint" || value === 0n) throw lastError(operation);
		return value;
	};
	const readJobProcessIds = (job) => {
		const headerBytes = 8;
		const processIdBytes = 8;
		const buffer = Buffer.alloc(32776);
		const returnedBytes = [0];
		if (!QueryJobProcessIds(job, JOB_OBJECT_BASIC_PROCESS_ID_LIST, buffer, buffer.length, returnedBytes)) throw lastError("QueryInformationJobObject(ProcessIdList)");
		const assigned = buffer.readUInt32LE(0);
		const listed = buffer.readUInt32LE(4);
		const length = returnedBytes[0];
		if (assigned !== listed || listed > MAX_JOB_PROCESS_IDS || !Number.isInteger(length) || length === void 0 || length < headerBytes + listed * processIdBytes || length > buffer.length) throw new Error("QueryInformationJobObject returned an incomplete process ID list");
		const pids = /* @__PURE__ */ new Set();
		for (let index = 0; index < listed; index += 1) {
			const pid = buffer.readBigUInt64LE(headerBytes + index * processIdBytes);
			if (pid === 0n || pid > 4294967295n || pids.has(Number(pid))) throw new Error("QueryInformationJobObject returned an invalid process ID");
			pids.add(Number(pid));
		}
		return [...pids];
	};
	const createCommandStdio = () => {
		let stdinHandle;
		const outputPipes = {
			stdout: {},
			stderr: {}
		};
		const securityAttributes = {
			nLength: koffi.sizeof(SECURITY_ATTRIBUTES),
			lpSecurityDescriptor: null,
			bInheritHandle: 1
		};
		const closeChildHandles = () => {
			for (const handle of [
				stdinHandle,
				outputPipes.stdout.write,
				outputPipes.stderr.write
			]) if (handle !== void 0) CloseHandle(handle);
			stdinHandle = void 0;
			delete outputPipes.stdout.write;
			delete outputPipes.stderr.write;
		};
		const closeRawReadHandles = () => {
			for (const pipe of Object.values(outputPipes)) {
				const handle = pipe.read;
				if (handle !== void 0) CloseHandle(handle);
				delete pipe.read;
			}
		};
		try {
			for (const [streamName, pipe] of Object.entries(outputPipes)) {
				const read = [null];
				const write = [null];
				if (!CreatePipe(read, write, securityAttributes, 0)) throw lastError(`CreatePipe(${streamName})`);
				if (typeof write[0] === "bigint" && write[0] !== 0n) pipe.write = write[0];
				pipe.read = requireHandle(read[0], `CreatePipe(${streamName} read)`);
				pipe.write = requireHandle(write[0], `CreatePipe(${streamName} write)`);
				if (!SetHandleInformation(pipe.read, HANDLE_FLAG_INHERIT, 0)) throw lastError(`SetHandleInformation(${streamName} read)`);
			}
			const openedStdin = CreateFileW("NUL", GENERIC_READ, 3, securityAttributes, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, null);
			if (openedStdin === 18446744073709551615n) throw lastError("CreateFileW(NUL)");
			const childStdin = requireHandle(openedStdin, "CreateFileW(NUL)");
			stdinHandle = childStdin;
			const childStdout = outputPipes.stdout.write;
			const childStderr = outputPipes.stderr.write;
			if (childStdout === void 0 || childStderr === void 0) throw new Error("Windows command output handles were not initialized");
			return {
				inheritedHandles: [
					childStdin,
					childStdout,
					childStderr
				],
				stdinHandle: childStdin,
				stdoutWriteHandle: childStdout,
				stderrWriteHandle: childStderr,
				closeChildHandles,
				takeOutputReadHandles: () => {
					if (outputPipes.stdout.read === void 0 || outputPipes.stderr.read === void 0) throw new Error("Windows command output handles were already transferred");
					const output = {
						stdoutReadHandle: outputPipes.stdout.read,
						stderrReadHandle: outputPipes.stderr.read
					};
					delete outputPipes.stdout.read;
					delete outputPipes.stderr.read;
					return output;
				},
				close: () => {
					closeChildHandles();
					closeRawReadHandles();
				}
			};
		} catch (error) {
			closeChildHandles();
			closeRawReadHandles();
			throw error;
		}
	};
	const createProcessAttributeList = (handles, job) => {
		const size = [0n];
		InitializeProcThreadAttributeList(null, 2, 0, size);
		const attributeListSize = size[0] ?? 0n;
		if (attributeListSize <= 0n) throw lastError("InitializeProcThreadAttributeList(size)");
		const attributeList = Buffer.alloc(Number(attributeListSize));
		if (!InitializeProcThreadAttributeList(attributeList, 2, 0, size)) throw lastError("InitializeProcThreadAttributeList");
		const backingLists = [];
		const release = () => {
			DeleteProcThreadAttributeList(attributeList);
			backingLists.length = 0;
		};
		try {
			for (const { attribute, values, name } of [{
				attribute: PROC_THREAD_ATTRIBUTE_HANDLE_LIST,
				values: handles,
				name: "HANDLE_LIST"
			}, {
				attribute: PROC_THREAD_ATTRIBUTE_JOB_LIST,
				values: [job],
				name: "JOB_LIST"
			}]) {
				const backingList = Buffer.alloc(koffi.sizeof(HANDLE) * values.length);
				backingLists.push(backingList);
				koffi.encode(backingList, HANDLE, values, values.length);
				if (!UpdateProcThreadAttribute(attributeList, 0, attribute, backingList, koffi.sizeof(HANDLE) * values.length, null, null)) throw lastError(`UpdateProcThreadAttribute(${name})`);
			}
			return {
				attributeList,
				release
			};
		} catch (error) {
			release();
			throw error;
		}
	};
	return {
		CreateJobObjectW,
		OpenJobObjectW,
		GetCurrentProcess,
		DuplicateHandle,
		AssignProcessToJobObject,
		SetExtendedLimits,
		CreateProcessW,
		WaitForSingleObject,
		GetExitCodeProcess,
		QueryInformationJobObject,
		PeekNamedPipe,
		ReadFile,
		TerminateJobObject,
		CloseHandle,
		getLastErrorCode,
		lastError,
		requireHandle,
		readJobProcessIds,
		createCommandStdio,
		createProcessAttributeList,
		assertLayouts: () => {
			const actual = [
				koffi.sizeof(STARTUPINFO),
				koffi.sizeof(STARTUPINFOEX),
				koffi.sizeof(PROCESS_INFORMATION),
				koffi.sizeof(BASIC_LIMITS),
				koffi.sizeof(EXTENDED_LIMITS),
				koffi.sizeof(BASIC_ACCOUNTING),
				koffi.offsetof(BASIC_ACCOUNTING, "ActiveProcesses"),
				koffi.sizeof(SECURITY_ATTRIBUTES)
			];
			const expected = [
				104,
				112,
				24,
				64,
				144,
				48,
				40,
				24
			];
			if (actual.some((value, index) => value !== expected[index])) throw new Error(`Koffi Win32 layout mismatch: ${actual.join(",")}`);
		},
		extendedLimits: { BasicLimitInformation: { LimitFlags: JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE } },
		extendedLimitsSize: koffi.sizeof(EXTENDED_LIMITS),
		basicAccountingSize: koffi.sizeof(BASIC_ACCOUNTING),
		startupInfoExSize: koffi.sizeof(STARTUPINFOEX)
	};
}
//#endregion
export { createWindowsJobBindings as n, retainWindowsProcessJobUntilExit as r, bindWindowsProcessJobToOwner as t };
