'use strict';

const line    = require('@line/bot-sdk');
const express = require('express');
const Axios   = require("axios");

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const vfconfig = {
  apiKey: process.env.VF_API_KEY,
  versionId: process.env.VF_VERSION_ID
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
async function handleEvent(event) {
  console.log("===== REQUSET FROM LINE =====");
  console.log(JSON.stringify(event, null, 2));

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  
  const userId = event.source.userId;
  const userInput = event.message.text;

  const axios = Axios.create({
    baseURL: 'https://general-runtime.voiceflow.com/state',
    timeout: 2000, 
    headers: { authorization: `${vfconfig.apiKey}` }
  });

  let req = { type: "text", payload: userInput };
  console.log("===== REQUSET TO VF =====");
  console.log(JSON.stringify(req, null, 2));

  const res = await axios.post(`/${vfconfig.versionId}/user/${userId}/interact`, { request: req } );
  console.log("===== RESPONSE FROM VF =====");
  console.log(JSON.stringify(res.data, null, 2));

  let replyMessages = [];
  for (const trace of res.data){
    if (trace.type === "speak") {
      switch (trace.payload.type) {
        case "audio":
          replyMessages.push({
            type: 'audio',
            originalContentUrl: trace.payload.src,
            duration: 2740 // need to know the duration of audio in advanced...
          });
          break;
        default:
          replyMessages.push({
            type: 'text',
            text: trace.payload.message
          });
      }
    }
    if (trace.type === "visual" && trace.payload.visualType === 'image') {
      replyMessages.push({
        type: 'image',
        originalContentUrl: trace.payload.image,
        previewImageUrl: trace.payload.image
      });
    }
  }

  console.log("===== RESPONSE TO LINE =====");
  console.log(JSON.stringify(replyMessages, null, 2));

  // use reply API
  return client.replyMessage(event.replyToken, replyMessages);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
