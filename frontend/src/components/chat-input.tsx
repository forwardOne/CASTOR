// frontend/src/components/chat-input.tsx
import React from 'react';

interface ChatInputProps {
  phase: string;
  setPhase: (value: string) => void;
  input: string; // messageの代わりにinputを導入
  setInput: (value: string) => void; // setMessageの代わりにsetInputを導入
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  phase,
  setPhase,
  input, // messageの代わりにinputを使用
  setInput, // setMessageの代わりにsetInputを使用
  isLoading,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          フェーズ選択:
          <select value={phase} onChange={(e) => setPhase(e.target.value)} disabled={isLoading}>
            <option value="default">Default (丁寧な応答)</option>
            <option value="creative">Creative (創造的な応答)</option>
            <option value="analyst_with_search">Analyst (JSON出力 + Google Search)</option>
          </select>
        </label>
      </div>
      <textarea
        value={input} // messageの代わりにinputを使用
        onChange={(e) => setInput(e.target.value)} // setMessageの代わりにsetInputを使用
        placeholder="メッセージを入力してください..."
        rows={4}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading || !input.trim()}> {/* messageの代わりにinputを使用 */}
        {isLoading ? '送信中...' : '送信'}
      </button>
    </form>
  );
};
