/** Host-owned Settings destinations with a packaged plugin presentation. */
type ControlUiSettingsPlacement = {
  section: "memory";
  panel: "overview" | "memories";
} | {
  section: "channels";
  panel: "detail";
  channelId: string;
};
export { ControlUiSettingsPlacement as t };