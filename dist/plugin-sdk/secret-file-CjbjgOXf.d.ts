import { DEFAULT_SECRET_FILE_MAX_BYTES, PRIVATE_SECRET_DIR_MODE, PRIVATE_SECRET_FILE_MODE, SecretFileReadOptions, readSecretFileSync, readSecretFileSync as readSecretFileSync$1, tryReadSecretFileSync, writeSecretFileAtomic as writePrivateSecretFileAtomic } from "@openclaw/fs-safe/secret";

//#region src/infra/secret-file.d.ts
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
/** @deprecated Use readSecretFileSync() or tryReadSecretFileSync(). */
declare function loadSecretFileSync(filePath: string, label: string, options?: Parameters<typeof readSecretFileSync>[2]): SecretFileReadResult;
//#endregion
export { SecretFileReadResult as a, tryReadSecretFileSync as c, SecretFileReadOptions as i, writePrivateSecretFileAtomic as l, PRIVATE_SECRET_DIR_MODE as n, loadSecretFileSync as o, PRIVATE_SECRET_FILE_MODE as r, readSecretFileSync$1 as s, DEFAULT_SECRET_FILE_MAX_BYTES as t };