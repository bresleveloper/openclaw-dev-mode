import "./fs-safe-defaults-ypw0M2Xi.js";
import { DEFAULT_SECRET_FILE_MAX_BYTES, PRIVATE_SECRET_DIR_MODE, PRIVATE_SECRET_FILE_MODE, SecretFileReadOptions, SecretFileReadOptions as SecretFileReadOptions$1, readSecretFile, readSecretFileSync, readSecretFileSync as readSecretFileSync$1, writeSecretFileAtomic } from "@openclaw/fs-safe/secret";
import { FsSafeErrorCode } from "@openclaw/fs-safe";
//#region src/infra/secret-file.d.ts
type SecretFileWriteParams = Parameters<typeof writeSecretFileAtomic>[0];
declare function writePrivateSecretFileAtomic(params: SecretFileWriteParams): Promise<void>;
declare function createSecretFileAtomic(params: SecretFileWriteParams): Promise<void>;
type SecretFileReadResult = {
  ok: true;
  secret: string;
  resolvedPath: string;
} | {
  ok: false;
  message: string;
  resolvedPath?: string;
  error?: unknown;
};
type CredentialUnavailableDiagnostic = {
  code: "CREDENTIAL_FILE_UNAVAILABLE";
  path: string;
  reason: FsSafeErrorCode;
};
/** Closed credential state used by channel account resolvers. */
type CredentialResult<T> = {
  status: "available";
  value: T;
} | {
  status: "configured_unavailable";
  diagnostic: CredentialUnavailableDiagnostic;
} | {
  status: "missing";
};
type ConfiguredCredentialResult<T> = Exclude<CredentialResult<T>, {
  status: "missing";
}>;
type CredentialFileReadOptions = SecretFileReadOptions & {
  credentialDiagnostic: {
    configPath: string;
    report: (diagnostic: CredentialUnavailableDiagnostic) => void;
  };
};
declare function tryReadSecretFileSync(filePath: string | undefined, label: string, options: CredentialFileReadOptions): string | undefined;
declare function tryReadSecretFileSync(filePath: string | undefined, label: string, options?: SecretFileReadOptions): string | undefined;
/** Reads an explicitly configured credential file without exposing its filesystem path. */
declare function tryReadSecretFileSync(filePath: string, label: string, options: SecretFileReadOptions | undefined, diagnostic: {
  configPath: string;
}): ConfiguredCredentialResult<string>;
declare function tryReadSecretFileSync(filePath: string | undefined, label: string, options: SecretFileReadOptions | undefined, diagnostic: {
  configPath: string;
}): CredentialResult<string>;
/** @deprecated Use readSecretFileSync() or tryReadSecretFileSync(). */
declare function loadSecretFileSync(filePath: string, label: string, options?: Parameters<typeof readSecretFileSync>[2]): SecretFileReadResult;
//#endregion
export { SecretFileReadResult as a, readSecretFile as c, writePrivateSecretFileAtomic as d, SecretFileReadOptions$1 as i, readSecretFileSync$1 as l, PRIVATE_SECRET_DIR_MODE as n, createSecretFileAtomic as o, PRIVATE_SECRET_FILE_MODE as r, loadSecretFileSync as s, DEFAULT_SECRET_FILE_MAX_BYTES as t, tryReadSecretFileSync as u };