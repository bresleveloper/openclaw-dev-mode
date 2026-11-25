import { FsSafeErrorCode } from "@openclaw/fs-safe";
import { DEFAULT_SECRET_FILE_MAX_BYTES, SecretFileReadOptions, SecretFileReadOptions as SecretFileReadOptions$1, readSecretFileSync, readSecretFileSync as readSecretFileSync$1, writeSecretFileAtomic } from "@openclaw/fs-safe/secret";
/** Filesystem validation belongs to the external-file owner, outside the caller's event loop. */
declare function readSecretFile(filePath: string, label: string, options?: SecretFileReadOptions): Promise<string>;
type SecretFileWriteParams = Omit<Parameters<typeof writeSecretFileAtomic>[0], "dirMode"> & {
  dirMode?: number;
};
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
export { loadSecretFileSync as a, tryReadSecretFileSync as c, createSecretFileAtomic as i, SecretFileReadOptions$1 as n, readSecretFile as o, SecretFileReadResult as r, readSecretFileSync$1 as s, DEFAULT_SECRET_FILE_MAX_BYTES as t };