import "./fs-safe-D1a5zN4L.js";
//#region src/media/staged-inputs.d.ts
declare const { stagedInputPathDirectory, isStagedInputPath, stagedInputDirectoriesFromEntries }: {
  stagedInputPathDirectory: (relativePath: string) => string | undefined;
  isStagedInputPath: (relativePath: string, directories: ReadonlySet<string>) => boolean;
  stagedInputDirectoriesFromEntries: (entries: readonly {
    path: string;
    type: string;
    size?: number;
    sha256?: string;
  }[]) => Set<string>;
};
//#endregion