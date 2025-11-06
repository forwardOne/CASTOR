# Project Overview
このプロジェクトはサイバーセキュリティ学習プラットフォームやBoot2Rootでの学習を手助けするためのAIエージェントアプリケーションです。

# Project Structure
- `Article/`: 記事投稿コンテンツ管理
- `backend/`: FastAPIバックエンド
- `frontend/`:Reactフロントエンド
- `tests/`: テストテストコード
- `.env`: 環境変数

# Required
- 横断的で大幅な編集を行う場合は事前に復元可能なチェックポイントの作成を提案すること
    - タイミングが分かりやすいチェックポイントID名も併せて提案する
- コマンド実行をした際にGemini CLI上でうまく実行できない場合は以下の確認をすること
    - 回避策や代替案を実行する前にユーザーが手動で行うことを検討する
    - それがインストールコマンドの場合はユーザーの手動実行を補助するような解説をする
- 以下の技術スタックとライブラリに関して正確に認識し厳守すること
    - FastAPI Python3.10+ Pydantic Pathlib を使用し型ヒントは積極的に利用する
    - Google GenAI SDK (google-genai) を使用する
    - 非推奨となった google-generativeai の使用を禁止
    - React SPA構成を前提としReact Routerを使用する

# Key Commands
- backend: uvicorn app.main:app --reload
- frontend: npm run dev

# Coding Convention
- いきなり編集せず必ず作業内容のプレビュー抜粋と作業範囲を確認する
- 他ファイルに影響を与える場合は影響範囲を確認し作業内容プレビューに加える
- 最終的なエラーハンドリングはエンドポイント側で処理する
- テストコードは必ず書く ユニットテスト結合テスト 簡易で構わない
- Pydantic による入出力スキーマ定義を徹底する
- Pydantic による定義をする際にフロントから送られるオブジェクト数を考慮しリクエストに用いるクラスを使い分ける
- React の要件としてルーターライブラリの使用を前提としブラウザリロードを回避してGeminiとのセッション維持を優先する
- 現状 FastAPI のルーティング分割はしない前提で設計する
- UIに関する提案は Tailwind CSS と shadcn/ui および shadcn-chatbot-kit の導入を見越した構成で考慮する