import{r as isWSLEnv}from"./wsl-_7IqvQi4.mjs";
//!src/infra/remote-env.ts
function isRemoteEnvironment(){return Boolean(process.env.SSH_CLIENT||process.env.SSH_TTY||process.env.SSH_CONNECTION||process.env.REMOTE_CONTAINERS||process.env.CODESPACES||process.platform===`linux`&&!process.env.DISPLAY&&!process.env.WAYLAND_DISPLAY&&!isWSLEnv())}export{isRemoteEnvironment as t};