const axios = require("axios");
const { cli } = require("cli-ux");

const API_KEY = process.env.VF_API_KEY;
const VERSION_ID = process.env.VF_VERSION_ID;

async function interact(userID, request) {
  console.log("...");

  const response = await axios({
    method: "POST",
    url: `https://general-runtime.voiceflow.com/state/${VERSION_ID}/user/${userID}/interact`,
    headers: { Authorization: API_KEY },
    data: { request },
  });

  for (const trace of response.data) {
    switch (trace.type) {
      case "text":
      case "speak": {
        console.log(trace.payload.message);
        break;
      }
      case "end": {
        // an end trace means the the Voiceflow dialog has ended
        return false;
      }
    }
  }

  return true;
}

async function main() {
  console.log("セッションを開始します。");

  const userID = await cli.prompt("> ユーザーIDを入力してください。");
  let isRunning = await interact(userID, { type: "launch" });

  while (isRunning) {
    const nextInput = await cli.prompt("> 入力");
    isRunning = await interact(userID, { type: "text", payload: nextInput });
  }
  console.log("セッションを終了します。");
}

main();
