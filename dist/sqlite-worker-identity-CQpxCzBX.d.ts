import { BigIntStats } from "node:fs";
type DatabaseFileIdentity = Readonly<{
  key: string;
  birthtime?: string;
}>;
type DatabasePathIdentity = DatabaseFileIdentity & Readonly<{
  canonicalPath: string;
}>;
export { DatabasePathIdentity as n, DatabaseFileIdentity as t };