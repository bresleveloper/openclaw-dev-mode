import { c as HealthCheck } from "../../health-BiFk88ye.js";
export declare const CUA_DRIVER_ARTIFACT_CHECK_ID = "cua-computer/driver-artifacts";
type CuaDriverDoctorRegistrationHost = {
  readonly registerHealthCheck: (check: HealthCheck) => void;
};
export declare function registerCuaDriverDoctorChecks(host?: CuaDriverDoctorRegistrationHost): void;
export {};