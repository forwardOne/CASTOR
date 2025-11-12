import { useChat } from '@/hooks/useChat';
import { ChatHistory } from '@/components/chat-history';
import { ChatInput } from '@/components/chat-input';

function ChatPage() {
  const {
    phase,
    setPhase,
    input, // messageの代わりにinputを受け取る
    setInput, // setMessageの代わりにsetInputを受け取る
    messages,
    isLoading,
    handleSubmit,
  } = useChat();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        <ChatHistory messages={messages} isLoading={isLoading} />
      </div>
      <div className="p-4">
        <ChatInput
          phase={phase}
          setPhase={setPhase}
          input={input} // messageの代わりにinputを渡す
          setInput={setInput} // setMessageの代わりにsetInputを渡す
          isLoading={isLoading}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default ChatPage;