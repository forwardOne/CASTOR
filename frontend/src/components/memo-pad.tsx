// frontend/src/components/memo-pad.tsx
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

export function MemoPad() {
  const [memoText, setMemoText] = useState<string>("");

  // コンポーネントマウント時にlocalStorageからメモを読み込む
  useEffect(() => {
    const savedMemo = localStorage.getItem("memoPadContent");
    if (savedMemo) {
      setMemoText(savedMemo);
    }
  }, []);

  // memoTextが変更されるたびにlocalStorageに保存する
  useEffect(() => {
    localStorage.setItem("memoPadContent", memoText);
  }, [memoText]);

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemoText(e.target.value);
  };

  return (
    <>
      <Textarea
        value={memoText}
        onChange={handleMemoChange}
        placeholder="ここにメモを入力してください..."
        className="h-full min-h-[calc(100vh-14rem)] resize-none focus-visible:ring-0"
      />
    </>
  );
}
