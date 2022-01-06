# voiceflow-dialog-management-api-sample-ja

Slack連携サンプル

## Prerequisite

- Node.js
- ngrok
- あらかじめslackでbotを作成しておくこと
  - 参考: https://kun432.hatenablog.com/entry/voiceflow-dialog-management-api-with-slack

## Usage

以下のサンプルプロジェクトをダウンロードし、Voiceflowでインポート

```
https://raw.githubusercontent.com/kun432/voiceflow-samples/main/dialog-managment-api/dialog-management-api-sample-line.vf
```

インポート後、

- テストを実行して、トレーニングさせる
- APIキー、バージョンIDを取得する

```
$ npm install
```

```
$ export SLACK_BOT_TOKEN="xoxb-XXX...XXX"
$ export SLACK_SIGNING_SECRET="XXX...XXX"
$ export VF_API_KEY="VF.XXX...XXX"
$ export VF_VERSION_ID="XXX...XXX"
```

```
$ npm start
```

```
$ ngrok http 3000
```

ngrokのURLをslackのに設定(ex: http://xxx.ngrok.io/callback)

slackでボットをチャネルに参加させて話しかけてみてください

## etc

繰り返しテストするためにVoiceflow側のセッションを消したい場合

npm start後にコンソールに表示されるLINEからのリクエストに含まれるuserIdを探す

```
(...snip...)
===== REQUSET FROM SLACK =====
{
  "client_msg_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "type": "message",
  "text": "メッセージ",
  "user": "XXXXXXXXX",
(...snip...)
```

以下を実行

```
$ USER_ID="XXXXXXXX"
$ curl -s -X DELETE "https://general-runtime.voiceflow.com/state/$VF_VERSION_ID/user/$USER_ID" -H "Authorization: $VF_API_KEY"
```
