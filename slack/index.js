const { App } = require('@slack/bolt');
const Axios = require("axios");

const emojiRegex = /:[^:\s]*(?:::[^:\s]*)*:/g;
const ANY_WORD_REGEX = new RegExp(/(.+)/i);

function stripEmojis(text) {
  return text.replace(emojiRegex, '').trim();
}

// ボットトークンとソケットモードハンドラーを使ってアプリを初期化します
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const vfconfig = {
  apiKey: process.env.VF_API_KEY,
  versionId: process.env.VF_VERSION_ID
};

const axios = Axios.create({
  baseURL: 'https://general-runtime.voiceflow.com/state',
  timeout: 2000, 
  headers: { authorization: `${vfconfig.apiKey}` }
});

const response = async (context, userID, say) => {
  let reply = { text: "response from voiceflow", blocks: []};
  for (const trace of context){
    if (trace.type === "speak") {
      switch (trace.payload.type) {
        case "message":
          reply.blocks.push({
            type: "section",
            text: {
              type: "mrkdwn",
              text: trace.payload.message
            }
          });
      }
    }
    if (trace.type === "visual" && trace.payload.visualType === 'image') {
      reply.blocks.push({
        type: 'image',
        image_url: trace.payload.image,
        alt_text: 'image',
        title: {
          "type": "plain_text",
          "text": "image",
          "emoji": true
        },
      });
    }
  }
  console.log("===== REQUSET TO SLACK =====");
  console.log(JSON.stringify(reply, null, 2));
  await say(reply);
};

app.message(ANY_WORD_REGEX, async ({ message, say }) => {
  console.log("===== REQUSET FROM SLACK =====");
  console.log(JSON.stringify(message, null, 2));

  if (message.subtype === 'message_changed' || message.subtype === 'message_deleted' || message.subtype === 'message_replied') return;

  const utterance = stripEmojis(message.text);
  const req = { type: "text", payload: utterance };

  console.log("===== REQUSET TO VF =====");
  console.log(JSON.stringify(req, null, 2));

  const res = await axios.post(`/${vfconfig.versionId}/user/${message.user}/interact`, { request: req } );

  console.log("===== RESPONSE FROM VF =====");
  console.log(JSON.stringify(res.data, null, 2));

  await response(res.data, message.user, say);
});

(async () => {
  // アプリを起動します
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
