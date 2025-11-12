// frontend/src/components/chat-history.tsx
import React from 'react';
import type{ Message } from '../types/types';
import { MessageRole } from '../types/types';

interface ChatHistoryProps {
  messages: Message[]; // responseの代わりにmessages配列を受け取る
  isLoading: boolean;
}

const WelcomeScreen = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-500">
    <h2 className="text-2xl font-semibold mb-2">Castor AI</h2>
    <p className="text-lg">何かお手伝いできることはありますか？</p>
    {/* ここに機能の例などを表示しても良い */}
  </div>
);

export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading }) => {
  // メッセージが一つもなければウェルカム画面を表示
  if (messages.length === 0) {
    return <WelcomeScreen />;
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`} // enumを使用
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              msg.role === MessageRole.USER
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {msg.content}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-200 text-gray-800">
            AIが考え中です...
          </div>
        </div>
      )}
    </div>
  );
};
