# voiceflow-dialog-management-api-sample-ja

CLIサンプル

## Prerequisite

- Node.js

## Usage

```
$ npm install
```

```
$ export VF_API_KEY="VF.XXX...XXX"
$ export VF_VERSION_ID="XXX...XXX"
```

```
$ npm start
```

```
$ npm start
> voiceflow-api-nodejs-example@1.0.0 start
> node index.js

セッションを開始します。
> ユーザーIDを入力してください。: 000001 // 適当に入力
...
あなたのお名前を言ってください。
> 入力: 太郎
...
太郎 さん、こんにちは。
あなたの年齢を言ってください。
> 入力: 20歳
...
太郎 さんの年齢は、20 歳です。
セッションを終了します。
```

同じユーザーIDを使ってもう一度実行すると、名前と年齢が永続情報としてVoiceflow側に保存されているのがわかる。
