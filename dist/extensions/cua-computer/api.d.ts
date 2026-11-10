import { c as HealthCheck } from "../../health-cYhdxqLA.js";
//#region extensions/cua-computer/src/doctor.d.ts
export declare const CUA_DRIVER_ARTIFACT_CHECK_ID = "cua-computer/driver-artifacts";
type CuaDriverDoctorRegistrationHost = {
  readonly registerHealthCheck: (check: HealthCheck) => void;
};
export declare function registerCuaDriverDoctorChecks(host?: CuaDriverDoctorRegistrationHost): void;
//#endregion