import { Root } from "@openclaw/fs-safe/root";
import { FileStore } from "@openclaw/fs-safe/store";
import { TempWorkspace, tempWorkspace } from "@openclaw/fs-safe/temp";
//#region src/infra/fs-safe-compat.d.ts
type LegacyNonBlockingReadOption = {
  /** @deprecated Omit this hint; safe reads always use nonblocking admission where supported. */
  nonBlockingRead?: boolean;
};
type WithLegacyReadHint<Method> = Method extends ((path: infer Path, options?: infer Options) => infer Result) ? (path: Path, options?: NonNullable<Options> & LegacyNonBlockingReadOption) => Result : never;
type CompatibleRootReadMethods = { [Method in "open" | "read" | "readBytes" | "readText" | "readAbsolute"]: WithLegacyReadHint<Root[Method]>; };
type CompatibleFsSafeRoot = Omit<Root, keyof CompatibleRootReadMethods | "defaults" | "readJson" | "reader"> & CompatibleRootReadMethods & {
  readonly defaults: Root["defaults"] & LegacyNonBlockingReadOption;
  readJson<T = unknown>(path: Parameters<Root["readJson"]>[0], options?: NonNullable<Parameters<Root["readJson"]>[1]> & LegacyNonBlockingReadOption): Promise<T>;
  reader(options?: NonNullable<Parameters<Root["reader"]>[0]> & LegacyNonBlockingReadOption): ReturnType<Root["reader"]>;
};
type CompatibleStoreReadMethods = { [Method in "open" | "read" | "readBytes" | "readText" | "readTextIfExists"]: WithLegacyReadHint<FileStore[Method]>; };
type CompatibleFileStore = Omit<FileStore, keyof CompatibleStoreReadMethods | "root" | "readJson" | "readJsonIfExists"> & CompatibleStoreReadMethods & {
  root(): Promise<CompatibleFsSafeRoot>;
  readJson<T = unknown>(path: Parameters<FileStore["readJson"]>[0], options?: NonNullable<Parameters<FileStore["readJson"]>[1]> & LegacyNonBlockingReadOption): Promise<T>;
  readJsonIfExists<T = unknown>(path: Parameters<FileStore["readJsonIfExists"]>[0], options?: NonNullable<Parameters<FileStore["readJsonIfExists"]>[1]> & LegacyNonBlockingReadOption): Promise<T | null>;
};
type CompatibleTempWorkspace = Omit<TempWorkspace, "store"> & {
  store: CompatibleFileStore;
};
declare const tempWorkspace$1: (options: Parameters<typeof tempWorkspace>[0]) => Promise<CompatibleTempWorkspace>;
declare const withTempWorkspace: <T>(options: Parameters<typeof tempWorkspace>[0], run: (workspace: CompatibleTempWorkspace) => Promise<T>) => Promise<T>;
//#endregion
export { withTempWorkspace as a, tempWorkspace$1 as i, CompatibleTempWorkspace as n, LegacyNonBlockingReadOption as r, CompatibleFsSafeRoot as t };