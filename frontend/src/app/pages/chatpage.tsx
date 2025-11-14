import { useChat } from '@/hooks/useChat';
import { ChatHistory } from '@/components/chat-history';
import { ChatInput } from '@/components/chat-input';

function ChatPage() {
  const {
    phase,
    setPhase,
    input,
    setInput,
    messages,
    isLoading,
    handleSubmit,
  } = useChat();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ChatHistory messages={messages} isLoading={isLoading} />
        </div>
      </div>
      <div className="">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ChatInput
            phase={phase}
            setPhase={setPhase}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;