import{t as formatDocsHelp}from"./help-format-DLfgiheF.mjs";import{t as registerQrCli}from"./qr-cli-DY0YVzFT.mjs";
//!src/cli/clawbot-cli.ts
function registerClawbotCli(e){const t=e.command(`clawbot`).description(`Legacy clawbot command aliases`).addHelpText(`after`,()=>formatDocsHelp(`/cli/clawbot`));registerQrCli(t)}export{registerClawbotCli};