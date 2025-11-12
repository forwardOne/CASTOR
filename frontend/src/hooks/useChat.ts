import { useState } from 'react';
import type{ Message } from '../types/types';
import { MessageRole } from '../types/types';

export const useChat = () => {
  const [phase, setPhase] = useState('default');
  const [input, setInput] = useState(''); // messageの代わりにinputを導入
  const [messages, setMessages] = useState<Message[]>([]); // responseの代わりにmessages配列を導入
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return; // messageの代わりにinputを使用

    const userMessage: Message = {
      id: crypto.randomUUID(), // ユニークなIDを生成
      role: MessageRole.USER, // 'user'の代わりにenumを使用
      content: input, // messageの代わりにinputを使用
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]); // ユーザーメッセージを追加
    setInput(''); // 入力フィールドをクリア

    setIsLoading(true);
    // setResponse('AIが考え中です...'); // 不要になる

    try {
      const backendUrl = 'http://localhost:8000/chat'; // FastAPIのエンドポイント
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content, phase }), // userMessage.contentを使用
      });

      const data = await res.json();

      if (res.ok) {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: MessageRole.MODEL, // 'model'の代わりにenumを使用
          content: data.response,
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]); // AI応答を追加
      } else {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: MessageRole.MODEL, // 'model'の代わりにenumを使用
          content: `エラー: ${data.detail || 'バックエンド接続に失敗しました'}`,
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]); // エラーメッセージを追加
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: MessageRole.MODEL, // 'model'の代わりにenumを使用
        content: `通信エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]); // エラーメッセージを追加
    } finally {
      setIsLoading(false);
    }
  };

  return {
    phase,
    setPhase,
    input, // messageの代わりにinputを返す
    setInput, // setMessageの代わりにsetInputを返す
    messages, // responseの代わりにmessagesを返す
    isLoading,
    handleSubmit,
  };
};
