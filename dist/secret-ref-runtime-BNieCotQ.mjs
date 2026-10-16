import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as parseConcreteConfigPathTokens, n as formatConcreteConfigPath } from "./dot-path-CVD5Jolm.mjs";
import { f as isValidSecretProviderAlias } from "./ref-contract-D0kWy5jy.mjs";
import "./types.secrets-DsPRn9Dz.mjs";
import { n as runExec } from "./exec-DJvyCA0D.mjs";
import { t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./runtime-shared-7qI1DEx4.mjs";
import { u as resolveSecretPlanTargetByPathCore } from "./target-registry-query-f56MMhmb.mjs";
import { t as resolveSystemBin } from "./resolve-system-bin-DzBc-jWt.mjs";
import { n as buildEncodedPowerShellArgs, r as buildPowerShellFailureCause, t as WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS } from "./windows-powershell-spawn-DDmi3G9M.mjs";
import "./resolve-DDYPuZjk.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { readOwnerAndDaclBatch } from "@openclaw/fs-safe/permissions";
import { createInterface } from "node:readline/promises";
import { createSecretFileAtomic } from "@openclaw/fs-safe/secret";
//#region src/secrets/plugin-setup-plan.ts
/** Shared plan construction for plugin-owned SecretRef setup commands. */
const MODEL_PROVIDER_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
function assertValidPluginSecretProviderAlias(value) {
	if (!isValidSecretProviderAlias(value)) throw new Error(`Invalid provider alias "${value}". Use lowercase letters, numbers, underscores, or hyphens.`);
}
function assertValidPluginModelProviderId(label, value) {
	if (!MODEL_PROVIDER_ID_PATTERN.test(value)) throw new Error(`Invalid ${label} model provider id: ${value}`);
}
function parsePluginSecretTargetSpecifier(productName, value) {
	if (!value.startsWith("auth-profiles:")) return { path: value.startsWith("openclaw:") ? value.slice(9) : value };
	const remainder = value.slice(14);
	const separatorIndex = remainder.indexOf(":");
	const agentId = separatorIndex >= 0 ? remainder.slice(0, separatorIndex) : "";
	const targetPath = separatorIndex >= 0 ? remainder.slice(separatorIndex + 1) : "";
	if (!isValidAgentId(agentId) || !targetPath) throw new Error(`Invalid --target auth-profiles target for ${productName}: ${value}`);
	return {
		agentId,
		path: targetPath
	};
}
function createPluginModelApiKeyTarget(params) {
	assertValidPluginModelProviderId("target", params.providerId);
	const pathSegments = [
		"models",
		"providers",
		params.providerId,
		"apiKey"
	];
	return {
		type: "models.providers.apiKey",
		path: formatConcreteConfigPath(pathSegments),
		pathSegments,
		providerId: params.providerId,
		ref: {
			source: "exec",
			provider: params.providerAlias,
			id: params.secretId
		}
	};
}
function createPluginConfigSecretTarget(params) {
	if (params.agentId && !isValidAgentId(params.agentId)) throw new Error(`Invalid ${params.productName} setup agent id: ${params.agentId}`);
	let parsedPath;
	try {
		parsedPath = parseConcreteConfigPathTokens(params.path);
	} catch {
		throw new Error(`Invalid --target config path: ${params.path}`);
	}
	const pathSegments = parsedPath.map(String);
	const normalizedPath = formatConcreteConfigPath(parsedPath);
	if (normalizedPath !== params.path) throw new Error(`Invalid --target config path: ${params.path}`);
	const resolved = resolveSecretPlanTargetByPathCore({
		configFile: params.agentId ? "auth-profile-store" : "openclaw.json",
		pathSegments,
		pathTokens: parsedPath
	});
	if (!resolved) throw new Error(`Unknown or unsupported ${params.productName} setup target path: ${params.path}`);
	const ref = {
		source: "exec",
		provider: params.providerAlias,
		id: params.secretId
	};
	return {
		type: resolved.entry.targetType,
		path: normalizedPath,
		pathSegments,
		...params.agentId ? { agentId: params.agentId } : {},
		...resolved.providerId ? { providerId: resolved.providerId } : {},
		...resolved.accountId ? { accountId: resolved.accountId } : {},
		ref
	};
}
function buildPluginSecretRefSetupPlan(params) {
	assertValidPluginSecretProviderAlias(params.providerAlias);
	const targets = [...params.providerSecrets.map((entry) => createPluginModelApiKeyTarget({
		providerAlias: params.providerAlias,
		providerId: entry.providerId,
		secretId: entry.secretId
	})), ...(params.configTargetSecrets ?? []).map((entry) => createPluginConfigSecretTarget({
		productName: params.productName,
		providerAlias: params.providerAlias,
		path: entry.path,
		...entry.agentId ? { agentId: entry.agentId } : {},
		secretId: entry.secretId
	}))];
	const seen = /* @__PURE__ */ new Set();
	for (const target of targets) {
		const key = target.agentId ? `auth-profiles:${target.agentId}:${target.path}` : `openclaw:${target.path}`;
		if (seen.has(key)) throw new Error(`Duplicate secret target path in ${params.productName} setup: ${target.path}`);
		seen.add(key);
	}
	return {
		version: 1,
		protocolVersion: 1,
		generatedAt: params.generatedAt ?? (/* @__PURE__ */ new Date()).toISOString(),
		generatedBy: "manual",
		providerUpserts: { [params.providerAlias]: params.providerConfig },
		targets
	};
}
//#endregion
//#region src/secrets/trusted-plan-path-policy.ts
const TRUSTED_INSTALLER = "s-1-5-80-956008885-3418522649-1831038044-1853292631-2271478464";
const TRUSTED_OWNERS = /* @__PURE__ */ new Set(["s-1-5-18", "s-1-5-32-544"]);
const WRITE_RIGHTS = 1343029590;
const KNOWN_RIGHTS = 4028563967;
const SAFE_DIRECTORY_RIGHTS = 2685534383;
function trustedWindowsPlanPathFailure(facts, options) {
	if (facts.status !== "supported" || !facts.complete) return "permissions could not be verified";
	const owner = facts.ownerSid.toLowerCase();
	const user = facts.currentUserSid.toLowerCase();
	if (!(facts.isLocal && (owner === user || TRUSTED_OWNERS.has(owner))) && !(options.allowTrustedInstaller && owner === TRUSTED_INSTALLER)) return "path is not owned by the current user or root";
	const grants = facts.aces.filter((ace) => {
		const sid = ace.sid.toLowerCase();
		return ace.aceType === "allow" && !ace.flags.inheritOnly && sid !== user && !TRUSTED_OWNERS.has(sid) && sid !== TRUSTED_INSTALLER;
	});
	if (!facts.daclPresent) return "path is writable by another user";
	if (!grants.some((ace) => (ace.mask & WRITE_RIGHTS) !== 0)) return;
	const safeRights = options.allowChildCreation ? SAFE_DIRECTORY_RIGHTS : -1609432919;
	if (options.directory && grants.every((ace) => {
		const rights = ace.mask & KNOWN_RIGHTS;
		return rights !== 0 && (rights & ~safeRights) === 0;
	})) return;
	return "path is writable by another user";
}
//#endregion
//#region src/secrets/trusted-plan-path.ts
async function readShebangInterpreter(targetPath) {
	const handle = await fs$1.open(targetPath, "r");
	try {
		const buffer = Buffer.alloc(4096);
		const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
		if (bytesRead < 2 || buffer[0] !== 35 || buffer[1] !== 33) return;
		const newline = buffer.indexOf(10, 2);
		if (newline < 0) throw new Error(`script interpreter line is too long: ${targetPath}`);
		const interpreter = buffer.subarray(2, newline).toString("utf8").trim().split(/\s+/u, 1)[0];
		if (!interpreter || !path.isAbsolute(interpreter)) throw new Error(`script interpreter must be an absolute path: ${targetPath}`);
		return interpreter;
	} finally {
		await handle.close();
	}
}
async function assertTrustedPathChain(resolvedPath, targetType, options = {}) {
	const entries = [];
	let cursor = resolvedPath;
	for (;;) {
		entries.push({
			path: cursor,
			before: await fs$1.lstat(cursor)
		});
		const parentPath = path.dirname(cursor);
		if (parentPath === cursor) break;
		cursor = parentPath;
	}
	let windows;
	if (process.platform === "win32") try {
		windows = await readOwnerAndDaclBatch(entries.map((entry) => entry.path));
	} catch (cause) {
		throw new Error(`permissions could not be verified for path chain: ${resolvedPath}`, { cause });
	}
	for (const [index, entry] of entries.entries()) {
		const { before, path: currentPath } = entry;
		const after = await fs$1.lstat(currentPath);
		if (before.isSymbolicLink() || after.isSymbolicLink() || before.dev !== after.dev || before.ino !== after.ino) throw new Error(`path changed during permission verification: ${currentPath}`);
		const directory = index > 0 || targetType === "directory";
		if (after.isDirectory() !== directory) throw new Error(`unexpected path type: ${currentPath}`);
		let failure;
		if (windows) failure = trustedWindowsPlanPathFailure(windows[index], {
			directory,
			allowChildCreation: targetType === "directory" || index !== 1,
			allowTrustedInstaller: index > 0 || options.allowWindowsTargetTrustedInstaller === true
		});
		else {
			const uid = typeof process.getuid === "function" ? process.getuid() : void 0;
			if (uid === void 0 || after.uid !== uid && after.uid !== 0) failure = "path is not owned by the current user or root";
			else if ((after.mode & 18) !== 0 && !(directory && (after.mode & 512) !== 0)) failure = "path is writable by another user";
		}
		if (failure) throw new Error(`${failure}: ${currentPath}`);
	}
	for (const entry of entries.toReversed()) {
		const current = await fs$1.lstat(entry.path);
		if (current.isSymbolicLink() || current.dev !== entry.before.dev || current.ino !== entry.before.ino) throw new Error(`path changed after permission verification: ${entry.path}`);
	}
}
async function assertTrustedPath(targetPath, validatedScripts = /* @__PURE__ */ new Set(), options = {}) {
	const resolvedPath = await fs$1.realpath(targetPath);
	if (!(await fs$1.stat(resolvedPath)).isFile()) throw new Error(`path is not a regular file: ${resolvedPath}`);
	await fs$1.access(resolvedPath, fs.constants.X_OK);
	await assertTrustedPathChain(resolvedPath, "file", options);
	if (process.platform === "win32" && path.extname(resolvedPath).toLowerCase() !== ".exe") throw new Error(`Windows executable must be an .exe file: ${resolvedPath}`);
	const interpreter = await readShebangInterpreter(resolvedPath);
	if (interpreter) {
		if (validatedScripts.has(resolvedPath)) throw new Error(`script interpreter cycle detected: ${resolvedPath}`);
		validatedScripts.add(resolvedPath);
		if (path.basename(interpreter).toLowerCase() === "env") throw new Error(`script interpreter may not use env indirection: ${resolvedPath}`);
		if (await assertTrustedPath(interpreter, validatedScripts) !== interpreter) throw new Error(`script interpreter path must be canonical: ${interpreter}`);
	}
	return resolvedPath;
}
async function resolveTrustedExecutablePath(targetPath) {
	if (!path.isAbsolute(targetPath)) throw new Error(`Executable path must be absolute: ${targetPath}`);
	return await assertTrustedPath(targetPath);
}
async function resolveTrustedWindowsSystemExecutablePath(targetPath) {
	if (!path.isAbsolute(targetPath)) throw new Error(`Executable path must be absolute: ${targetPath}`);
	return await assertTrustedPath(targetPath, /* @__PURE__ */ new Set(), { allowWindowsTargetTrustedInstaller: true });
}
async function resolveTrustedPlanDirectoryPath(targetPath) {
	if (!path.isAbsolute(targetPath)) throw new Error(`Directory path must be absolute: ${targetPath}`);
	const resolvedPath = await fs$1.realpath(targetPath);
	await assertTrustedPathChain(resolvedPath, "directory");
	return resolvedPath;
}
//#endregion
//#region src/secrets/private-plan-file.ts
const WINDOWS_PLAN_FILE_EXISTS_MARKER = "PRIVATE_PLAN_FILE_EXISTS";
const WINDOWS_PRIVATE_PLAN_FILE_NATIVE_SOURCE = `
using System;
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;

public sealed class OpenClawPrivatePlanFile : IDisposable
{
    [StructLayout(LayoutKind.Sequential)]
    private struct SecurityAttributes
    {
        public int Length;
        public IntPtr SecurityDescriptor;
        public int InheritHandle;
    }

    [DllImport("advapi32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool ConvertStringSecurityDescriptorToSecurityDescriptorW(
        string securityDescriptor,
        uint revision,
        out IntPtr convertedSecurityDescriptor,
        out uint convertedSecurityDescriptorSize);

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern SafeFileHandle CreateFileW(
        string fileName,
        uint desiredAccess,
        uint shareMode,
        ref SecurityAttributes securityAttributes,
        uint creationDisposition,
        uint flagsAndAttributes,
        IntPtr templateFile);

    [DllImport("kernel32.dll")]
    private static extern IntPtr LocalFree(IntPtr memory);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool WriteFile(
        SafeFileHandle file,
        byte[] buffer,
        uint bytesToWrite,
        out uint bytesWritten,
        IntPtr overlapped);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool FlushFileBuffers(SafeFileHandle file);

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool MoveFileExW(
        string existingFileName,
        string newFileName,
        uint flags);

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool DeleteFileW(string fileName);

    [StructLayout(LayoutKind.Sequential)]
    private struct FileDispositionInfo
    {
        [MarshalAs(UnmanagedType.Bool)]
        public bool DeleteFile;
    }

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool SetFileInformationByHandle(
        SafeFileHandle file,
        int fileInformationClass,
        ref FileDispositionInfo fileInformation,
        uint bufferSize);

    private readonly string stagingPath;
    private readonly string finalPath;
    private SafeFileHandle handle;

    private OpenClawPrivatePlanFile(
        string stagingPath,
        string finalPath,
        SafeFileHandle handle)
    {
        this.stagingPath = stagingPath;
        this.finalPath = finalPath;
        this.handle = handle;
    }

    private static bool SetDeleteOnClose(SafeFileHandle handle, bool enabled)
    {
        var disposition = new FileDispositionInfo { DeleteFile = enabled };
        return SetFileInformationByHandle(
            handle,
            4,
            ref disposition,
            (uint)Marshal.SizeOf(typeof(FileDispositionInfo)));
    }

    public static OpenClawPrivatePlanFile Open(
        string stagingPath,
        string finalPath,
        string securityDescriptor,
        out int errorCode)
    {
        errorCode = 0;
        IntPtr descriptor;
        uint descriptorSize;
        if (!ConvertStringSecurityDescriptorToSecurityDescriptorW(
                securityDescriptor,
                1,
                out descriptor,
                out descriptorSize))
        {
            errorCode = Marshal.GetLastWin32Error();
            return null;
        }

        try
        {
            var attributes = new SecurityAttributes
            {
                Length = Marshal.SizeOf(typeof(SecurityAttributes)),
                SecurityDescriptor = descriptor,
                InheritHandle = 0,
            };
            var handle = CreateFileW(stagingPath, 0x40010000, 0, ref attributes, 1, 0x80, IntPtr.Zero);
            if (handle.IsInvalid)
            {
                errorCode = Marshal.GetLastWin32Error();
                handle.Dispose();
                return null;
            }
            return new OpenClawPrivatePlanFile(stagingPath, finalPath, handle);
        }
        finally
        {
            LocalFree(descriptor);
        }
    }

    public int ArmDeleteOnClose()
    {
        if (handle == null || handle.IsInvalid || handle.IsClosed)
        {
            return 6;
        }
        if (SetDeleteOnClose(handle, true))
        {
            return 0;
        }
        var dispositionError = Marshal.GetLastWin32Error();
        handle.Dispose();
        handle = null;
        DeleteFileW(stagingPath);
        return dispositionError == 0 ? 29 : dispositionError;
    }

    public int WriteAndPublish(byte[] content)
    {
        if (handle == null || handle.IsInvalid || handle.IsClosed)
        {
            return 6;
        }
        uint written;
        if (content.Length > 0 &&
            (!WriteFile(handle, content, (uint)content.Length, out written, IntPtr.Zero) ||
             written != (uint)content.Length))
        {
            var writeError = Marshal.GetLastWin32Error();
            return writeError == 0 ? 29 : writeError;
        }
        if (!FlushFileBuffers(handle))
        {
            var flushError = Marshal.GetLastWin32Error();
            return flushError == 0 ? 29 : flushError;
        }
        if (!SetDeleteOnClose(handle, false))
        {
            var dispositionError = Marshal.GetLastWin32Error();
            return dispositionError == 0 ? 29 : dispositionError;
        }
        handle.Dispose();
        handle = null;
        if (MoveFileExW(stagingPath, finalPath, 0x8))
        {
            return 0;
        }
        var moveError = Marshal.GetLastWin32Error();
        DeleteFileW(stagingPath);
        return moveError == 0 ? 29 : moveError;
    }

    public void Dispose()
    {
        if (handle != null)
        {
            var openHandle = handle;
            handle = null;
            var deletePending = SetDeleteOnClose(openHandle, true);
            openHandle.Dispose();
            if (!deletePending)
            {
                DeleteFileW(stagingPath);
            }
        }
    }
}
`;
function readWindowsEnv(env, name) {
	const lower = name.toLowerCase();
	return Object.entries(env).find(([key]) => key.toLowerCase() === lower)?.[1];
}
async function resolvePrivateWindowsCompilerTempDir(env) {
	const candidate = readWindowsEnv(env, "TEMP") ?? readWindowsEnv(env, "TMP");
	if (!candidate || !path.win32.isAbsolute(candidate)) throw new Error("Unable to resolve an absolute Windows temp directory for private plan creation.");
	return await resolveTrustedPlanDirectoryPath(candidate);
}
async function resolveTrustedPowerShell(targetPath) {
	const powershell = resolveSystemBin("powershell");
	if (!powershell || powershell.toLowerCase() !== targetPath.toLowerCase()) throw new Error("Unable to resolve trusted Windows PowerShell for private plan creation.");
	return await resolveTrustedWindowsSystemExecutablePath(targetPath);
}
async function createPrivateWindowsPlanFile(filePath, content, env = process.env) {
	const systemRoot = readWindowsEnv(env, "SYSTEMROOT") ?? readWindowsEnv(env, "WINDIR") ?? "C:\\Windows";
	if (!path.win32.isAbsolute(systemRoot)) throw new Error("Unable to resolve the Windows system directory for private plan creation.");
	const resolvedPath = path.resolve(filePath);
	const stagingPath = path.join(path.dirname(resolvedPath), `.openclaw-plan-${randomUUID()}.tmp`);
	const command = [
		"$ErrorActionPreference = 'Stop'",
		"$payloadJson = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String([Console]::In.ReadToEnd()))",
		"$payload = $payloadJson | ConvertFrom-Json",
		"Add-Type -TypeDefinition $payload.nativeSource -Language CSharp",
		"$finalPath = $payload.finalPath",
		"$stagingPath = $payload.stagingPath",
		"$current = [System.Security.Principal.WindowsIdentity]::GetCurrent().User",
		"$security = New-Object System.Security.AccessControl.FileSecurity",
		"$security.SetAccessRuleProtection($true, $false)",
		"$security.SetOwner($current)",
		"$expected = @($current.Value, 'S-1-5-18') | Sort-Object -Unique",
		"foreach ($sidValue in $expected) { $sid = New-Object System.Security.Principal.SecurityIdentifier($sidValue); $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($sid, [System.Security.AccessControl.FileSystemRights]::FullControl, [System.Security.AccessControl.AccessControlType]::Allow); [void]$security.AddAccessRule($rule) }",
		"$sections = [System.Security.AccessControl.AccessControlSections]::Owner -bor [System.Security.AccessControl.AccessControlSections]::Access",
		"$sddl = $security.GetSecurityDescriptorSddlForm($sections)",
		"$content = [Convert]::FromBase64String($payload.content)",
		"$openError = 0",
		"$native = [OpenClawPrivatePlanFile]::Open($stagingPath, $finalPath, $sddl, [ref]$openError)",
		"$errorCode = $openError",
		"if ($null -ne $native) { try { $actual = Get-Acl -LiteralPath $stagingPath; $rules = @($actual.GetAccessRules($true, $true, [System.Security.Principal.SecurityIdentifier])); if (!$actual.AreAccessRulesProtected -or $rules.Count -ne $expected.Count) { throw 'private plan ACL verification failed' }; foreach ($rule in $rules) { if ($rule.AccessControlType -ne [System.Security.AccessControl.AccessControlType]::Allow -or $expected -notcontains $rule.IdentityReference.Value -or ($rule.FileSystemRights -band [System.Security.AccessControl.FileSystemRights]::FullControl) -ne [System.Security.AccessControl.FileSystemRights]::FullControl) { throw 'private plan ACL verification failed' } }; $errorCode = $native.ArmDeleteOnClose(); if ($errorCode -eq 0) { $errorCode = $native.WriteAndPublish($content) } } finally { $native.Dispose() } }",
		`if ($errorCode -eq 80 -or $errorCode -eq 183) { throw '${WINDOWS_PLAN_FILE_EXISTS_MARKER}' }`,
		"if ($errorCode -ne 0) { $exception = New-Object System.ComponentModel.Win32Exception($errorCode); throw $exception }"
	].join("; ");
	const powershell = await resolveTrustedPowerShell(path.win32.join(systemRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe"));
	const compilerTempDir = await resolvePrivateWindowsCompilerTempDir(env);
	const input = Buffer.from(JSON.stringify({
		content: Buffer.from(content, "utf8").toString("base64"),
		finalPath: path.toNamespacedPath(resolvedPath),
		nativeSource: WINDOWS_PRIVATE_PLAN_FILE_NATIVE_SOURCE,
		stagingPath: path.toNamespacedPath(stagingPath)
	}), "utf8").toString("base64");
	try {
		await runExec(powershell, buildEncodedPowerShellArgs(command), {
			baseEnv: {},
			env: {
				SYSTEMROOT: systemRoot,
				TEMP: compilerTempDir,
				TMP: compilerTempDir,
				WINDIR: systemRoot
			},
			input,
			logOutput: false,
			maxBuffer: 65536,
			timeoutMs: WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS
		});
	} catch (error) {
		if (String(error).includes(WINDOWS_PLAN_FILE_EXISTS_MARKER)) {
			const existsError = /* @__PURE__ */ new Error(`Private plan file already exists: ${filePath}`);
			existsError.code = "EEXIST";
			throw existsError;
		}
		throw new Error(`Unable to create private Windows plan file: ${filePath}`, { cause: buildPowerShellFailureCause(error) });
	}
}
//#endregion
//#region src/plugin-sdk/secret-ref-runtime.ts
function throwPlanFileError(error, planPath) {
	if (error?.code === "EEXIST" || error instanceof FsSafeError && error.code === "secret-exists") throw new Error(`Plan path already exists; choose a new --plan-out path: ${planPath}`, { cause: error });
	throw error;
}
async function writeSecretPlanFile(params) {
	if ((params.platform ?? process.platform) === "win32") {
		await (params.createPrivateWindowsFile ?? createPrivateWindowsPlanFile)(params.planPath, params.content).catch((error) => throwPlanFileError(error, params.planPath));
		return;
	}
	try {
		const rootDir = await fs$1.realpath(path.dirname(params.planPath));
		await createSecretFileAtomic({
			rootDir,
			filePath: path.join(rootDir, path.basename(params.planPath)),
			content: params.content,
			dirMode: (await fs$1.stat(rootDir)).mode & 4095,
			durable: "file"
		});
	} catch (error) {
		throwPlanFileError(error, params.planPath);
	}
}
function quoteSecretRefCliArg(value, shell) {
	if (/\r|\n/u.test(value)) throw new Error("Command argument cannot contain CR or LF");
	if (shell === "cmd") {
		if (/[%!]/u.test(value)) throw new Error("Interactive Command Prompt cannot safely quote paths containing % or !");
		const escaped = value.replaceAll("\"", "\\\"");
		return /[ \t"&|<>^()]/u.test(value) ? `"${escaped}"` : escaped || "\"\"";
	}
	if (shell === "powershell") return `'${value.replaceAll("'", "''")}'`;
	if (/^[A-Za-z0-9_/:=.,@%+-]+$/.test(value)) return value;
	return `'${value.replaceAll("'", "'\\''")}'`;
}
function renderSecretRefApplyCommands(planPath, platform = process.platform) {
	const render = (shell, indent = "") => {
		const quotedPlanPath = quoteSecretRefCliArg(planPath, shell);
		return [`${indent}openclaw secrets apply --from ${quotedPlanPath} --dry-run --allow-exec`, `${indent}openclaw secrets apply --from ${quotedPlanPath} --allow-exec`];
	};
	if (platform !== "win32") return render("posix");
	const powershellCommands = ["PowerShell:", ...render("powershell", "  ")];
	if (/[%!]/u.test(planPath)) return [...powershellCommands, "Command Prompt: unavailable for paths containing % or !; use PowerShell."];
	return [
		...powershellCommands,
		"Command Prompt:",
		...render("cmd", "  ")
	];
}
function readSecretRefProviderStatus(config, providerAlias) {
	const provider = config.secrets?.providers?.[providerAlias];
	if (!isRecord(provider)) return { configured: false };
	const base = {
		configured: true,
		source: normalizeOptionalString(provider.source)
	};
	if (provider.source !== "exec") return base;
	if ("pluginIntegration" in provider) return {
		...base,
		pluginIntegration: provider.pluginIntegration
	};
	return {
		...base,
		command: normalizeOptionalString(provider.command)
	};
}
function writeSecretRefCliLine(message = "") {
	process.stdout.write(`${message}\n`);
}
/** Build the canonical setup/status adapter shared by plugin-owned SecretRef CLIs. */
function createPluginSecretRefSetupCli(params) {
	const isIntegrationProvider = (value) => isRecord(value) && value.source === "exec" && isRecord(value.pluginIntegration) && value.pluginIntegration.pluginId === params.pluginIntegration.pluginId && value.pluginIntegration.integrationId === params.pluginIntegration.integrationId;
	const inspectProvider = (config, requestedAlias) => {
		const explicitAlias = normalizeOptionalString(requestedAlias);
		let providerAlias;
		if (explicitAlias) {
			assertValidPluginSecretProviderAlias(explicitAlias);
			providerAlias = explicitAlias;
		} else {
			const configuredAliases = Object.entries(config.secrets?.providers ?? {}).filter(([, provider]) => isIntegrationProvider(provider)).map(([alias]) => alias).toSorted();
			if (configuredAliases.length > 1) throw new Error(`Multiple ${params.productName} provider aliases are configured (${configuredAliases.join(", ")}). Use --provider-alias <alias>.`);
			providerAlias = configuredAliases[0] ?? params.defaultProviderAlias;
		}
		return {
			providerAlias,
			provider: readSecretRefProviderStatus(config, providerAlias),
			providerReady: isIntegrationProvider(config.secrets?.providers?.[providerAlias])
		};
	};
	const parseMapping = (value, flag, targetPlaceholder) => {
		const separator = value.indexOf("=");
		if (separator <= 0 || separator === value.length - 1) throw new Error(`Invalid ${flag} value "${value}". Use <${targetPlaceholder}>=<${params.secretIdPlaceholder}>.`);
		return [value.slice(0, separator).trim(), value.slice(separator + 1).trim()];
	};
	const parseProviderKeyMappings = (values) => (values ?? []).map((value) => {
		const [providerId, secretId] = parseMapping(value, "--provider-key", "model-provider-id");
		assertValidPluginModelProviderId("--provider-key", providerId);
		return {
			providerId,
			secretId: params.normalizeSecretId(`--provider-key ${providerId}`, secretId)
		};
	});
	const parseConfigTargetMappings = (values) => (values ?? []).map((value) => {
		const [targetPath, valueId] = parseMapping(value, "--target", "openclaw-config-path");
		const target = parsePluginSecretTargetSpecifier(params.productName, targetPath);
		const secretId = params.normalizeSecretId(`--target ${target.path}`, valueId);
		return Object.assign({
			path: target.path,
			secretId
		}, target.agentId ? { agentId: target.agentId } : {});
	});
	const promptOptionalSecretId = async (label) => {
		if (!process.stdin.isTTY || !process.stdout.isTTY) return;
		const readline = createInterface({
			input: process.stdin,
			output: process.stdout
		});
		try {
			return normalizeOptionalString(await readline.question(`${label} ${params.secretIdLabel} (blank to skip): `));
		} finally {
			readline.close();
		}
	};
	const collectProviderSecrets = async (options) => {
		const commonProviders = [
			{
				providerId: "openai",
				label: "OpenAI",
				value: options.openaiId
			},
			{
				providerId: "anthropic",
				label: "Anthropic",
				value: options.anthropicId
			},
			{
				providerId: "openrouter",
				label: "OpenRouter",
				value: options.openrouterId
			}
		];
		const providerSecrets = [];
		for (const provider of commonProviders) {
			const value = normalizeOptionalString(provider.value) ?? await promptOptionalSecretId(provider.label);
			if (value) providerSecrets.push({
				providerId: provider.providerId,
				secretId: params.normalizeSecretId(provider.label, value)
			});
		}
		providerSecrets.push(...parseProviderKeyMappings(options.providerKey));
		const seen = /* @__PURE__ */ new Set();
		for (const entry of providerSecrets) {
			const normalized = entry.providerId.toLowerCase();
			if (seen.has(normalized)) throw new Error(`Duplicate model provider id in ${params.productName} setup: ${entry.providerId}`);
			seen.add(normalized);
		}
		return providerSecrets;
	};
	const runSetup = async (options) => {
		const providerAlias = normalizeOptionalString(options.providerAlias) ?? params.defaultProviderAlias;
		assertValidPluginSecretProviderAlias(providerAlias);
		const providerConfig = {
			source: "exec",
			pluginIntegration: params.pluginIntegration
		};
		const plan = buildPluginSecretRefSetupPlan({
			productName: params.productName,
			providerAlias,
			providerConfig,
			providerSecrets: await collectProviderSecrets(options),
			configTargetSecrets: parseConfigTargetMappings(options.target)
		});
		if (plan.targets.length === 0) throw new Error("No SecretRef targets selected. Pass --openai-id, --anthropic-id, --openrouter-id, --provider-key, or --target.");
		const requestedPlanPath = normalizeOptionalString(options.planOut) ?? params.defaultPlanPath();
		const absolutePlanPath = path.resolve(requestedPlanPath);
		const planDirectory = await resolveTrustedPlanDirectoryPath(path.dirname(absolutePlanPath));
		const planPath = path.join(planDirectory, path.basename(absolutePlanPath));
		const applyCommands = renderSecretRefApplyCommands(planPath);
		await writeSecretPlanFile({
			planPath,
			content: `${JSON.stringify(plan, null, 2)}\n`
		});
		writeSecretRefCliLine(`Plan written to ${planPath}`);
		writeSecretRefCliLine(`Targets: ${plan.targets.length}`);
		writeSecretRefCliLine();
		writeSecretRefCliLine("Next steps:");
		for (const command of params.beforeApplyCommands ?? []) writeSecretRefCliLine(`  ${command}`);
		for (const command of applyCommands) writeSecretRefCliLine(`  ${command}`);
		writeSecretRefCliLine("  openclaw secrets audit --check --allow-exec");
		writeSecretRefCliLine("  openclaw secrets reload");
	};
	const registerSetupCommand = (command) => {
		command.command("setup").description(`Create a ${params.productName} SecretRef setup plan`).option("--plan-out <path>", "Write the generated secrets apply plan to a path").option("--provider-alias <alias>", "Secret provider alias to configure", params.defaultProviderAlias).option("--openai-id <id>", `${params.secretIdLabel} for models.providers.openai.apiKey`).option("--anthropic-id <id>", `${params.secretIdLabel} for models.providers.anthropic.apiKey`).option("--openrouter-id <id>", `${params.secretIdLabel} for models.providers.openrouter.apiKey`).option("--provider-key <provider=id>", `${params.secretIdLabel} for any models.providers.<provider>.apiKey target`, (value, previous = []) => [...previous, value], []).option("--target <path=id>", `${params.secretIdLabel} for any known SecretRef target path`, (value, previous = []) => [...previous, value], []).action((options) => runSetup(options));
	};
	return {
		inspectProvider,
		registerSetupCommand
	};
}
/** Shared validation and apply-plan construction for plugin-owned SecretRef setup CLIs. */
const pluginSecretRefSetup = {
	assertValidModelProviderId: assertValidPluginModelProviderId,
	assertValidProviderAlias: assertValidPluginSecretProviderAlias,
	buildPlan: buildPluginSecretRefSetupPlan,
	parseTargetSpecifier: parsePluginSecretTargetSpecifier,
	resolveTrustedDirectoryPath: resolveTrustedPlanDirectoryPath,
	resolveTrustedExecutablePath,
	writePlanFile: writeSecretPlanFile
};
//#endregion
export { pluginSecretRefSetup as n, createPluginSecretRefSetupCli as t };
