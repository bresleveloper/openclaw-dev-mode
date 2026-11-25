import { RootWalkEntry, RootWalkEntry as RootWalkEntry$1, RootWalkOptions, RootWalkOptions as RootWalkOptions$1 } from "@openclaw/fs-safe/root";
export declare function walkRootDirectory(rootDir: string, relativePath: string, options: RootWalkOptions$1): AsyncGenerator<RootWalkEntry$1>;
export type { RootWalkEntry, RootWalkOptions };