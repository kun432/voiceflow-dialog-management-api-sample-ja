# voiceflow-dialog-management-api-sample-ja

LINE連携サンプル

## Prerequisite

- Node.js
- ngrok
- あらかじめLINE　DevelopersコンソールでMessaging APIチャネルを作成しておくこと

## Usage

```
$ npm install
```

```
$ export LINE_CHANNEL_ACCESS_TOKEN="XXX...XXX"
$ export LINE_CHANNEL_SECRET="XXX...XXX"
$ export VF_API_KEY="VF.XXX...XXX"
$ export VF_VERSION_ID="XXX...XXX"
```

```
$ npm start
```

```
$ ngrok http 3000
```

ngrokのURLをLINE Messaging APIのWebhook URLに設定(ex: http://xxx.ngrok.io/callback)

LINEアプリで友だち追加して話しかけてみてください

## etc

繰り返しテストするためにVoiceflow側のセッションを消したい場合

npm start後にコンソールに表示されるLINEからのリクエストに含まれるuserIdを探す

```
(...snip...)
===== REQUSET FROM LINE =====
{
(...snip...)
  "source": {
    "type": "user",
    "userId": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  },
(...snip...)
```

以下を実行

```
$ USER_ID="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
$ curl -s -X DELETE "https://general-runtime.voiceflow.com/state/$VF_VERSION_ID/user/$USER_ID" -H "Authorization: $VF_API_KEY"
```
