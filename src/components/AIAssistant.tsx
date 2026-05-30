import React, { useState, useRef, useEffect } from "react";
import { UserInputs, CalculationResults, ChatMessage } from "../types";
import { MessageSquare, Send, Sparkles, HelpCircle, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Props {
  inputs: UserInputs;
  results: CalculationResults;
  averageInflation: number;
}

const SUGGESTED_QUESTIONS = [
  "如何在中国大陆配置资产，才能实现稳健安全的4%提取率？",
  "如果我打算把退休年限从10年缩短到8年，应该如何调整储蓄资产计划？",
  "考虑通胀与未来可能的社保医保支出，有什么隐形开支需要预防吗？",
];

export default function AIAssistant({ inputs, results, averageInflation }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setErrorText("");
    const userMsg: ChatMessage = {
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          context: {
            currentExpenses: inputs.currentExpenses,
            yearsToRetire: inputs.yearsToRetire,
            withdrawalRate: inputs.withdrawalRate,
            averageInflation: averageInflation,
            futureExpenses: results.futureExpenses,
            targetFund: results.targetFund,
            investmentReturn: inputs.investmentReturn,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const data = await response.json();
      
      const modelMsg: ChatMessage = {
        role: "model",
        text: data.reply || "无回复",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorText("发送请求失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-[#141414] border-2 border-[#141414] p-6 md:p-8 relative" id="ai-finance-coach-panel">
      <div className="absolute -top-3.5 left-4 bg-[#141414] text-[#E4E3E0] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-[#141414] font-mono">
        03 / SYSTEM COPILOT
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-[#141414] pb-4 mb-6 pt-2">
        <div className="flex items-center gap-3">
          <div className="bg-[#141414] p-2.5 text-[#E4E3E0] border border-[#141414]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase text-[#141414] flex items-center gap-2">
              AI 智能退休精算顾问
            </h2>
            <p className="text-xs text-slate-550">
              结合中国大陆复杂宏观周期，为您定制家庭资产安全提取方案与储蓄对冲机制。
            </p>
          </div>
        </div>
        <div className="hidden sm:inline-flex items-center gap-1 bg-[#141414] text-[#E4E3E0] border border-[#141414] text-[9px] font-mono font-bold uppercase py-1 px-2">
          MODEL: SECURE_GEMINI_ACTIVE
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 min-h-[300px] max-h-[460px] overflow-y-auto mb-6 pr-1 space-y-4 text-xs">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-slate-700 space-y-4">
            <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="max-w-md mx-auto text-xs leading-relaxed text-slate-900 font-sans">
              理财智脑已建立对话通道。当前核实参数：<strong>10年后退休、安全提取率 {inputs.withdrawalRate}%、基准通缩/通胀设防：{inputs.inflationRate}%</strong>。
              您可以根据当下沪深高股息大额资产配比或通胀防护损耗提出咨询。
            </p>

            {/* Quick Suggestions list */}
            <div className="pt-4 text-left">
              <span className="text-[10px] font-extrabold text-[#141414] uppercase tracking-wider block mb-2.5 px-0.5 font-mono">
                💡 SUGGESTED INQUIRIES
              </span>
              <div className="grid grid-cols-1 gap-2">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="text-left bg-white hover:bg-[#E4E3E0] border-2 border-[#141414] px-4 py-3 text-[#141414] transition-all text-xs font-bold cursor-pointer flex items-start gap-2.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#141414] shrink-0 mt-0.5" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-4 py-3 border border-[#141414] ${
                    isUser 
                      ? "bg-[#141414] text-[#E4E3E0] rounded-none" 
                      : "bg-[#E4E3E0] text-[#141414] rounded-none leading-relaxed font-sans"
                  }`}>
                    {isUser ? (
                      <div className="whitespace-pre-wrap font-bold">{msg.text}</div>
                    ) : (
                      <div className="markdown-body text-[#141414] text-xs leading-relaxed">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                    <div className="text-[9px] opacity-60 mt-1.5 text-right font-mono">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#E4E3E0] border border-[#141414]/40 text-[#141414] px-4 py-3 flex items-center gap-2 font-mono text-[10px]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#141414]" />
                  <span>AI 财富精算顾问正在深度分析中...</span>
                </div>
              </div>
            )}

            {errorText && (
              <div className="text-center text-xs text-red-700 bg-red-100 py-2.5 px-4 rounded-none border border-red-700 font-bold">
                {errorText}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="flex items-center gap-2 bg-white border-2 border-[#141414] p-1.5"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={loading ? "[ 顾问分析中... ]" : "输入关于4%提取法、沪深派息及避险资产配置的问题..."}
          disabled={loading}
          className="flex-1 bg-transparent px-3 py-2 text-xs text-[#141414] outline-none placeholder-slate-500 font-bold"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="bg-[#141414] hover:bg-slate-800 disabled:bg-slate-200 text-[#E4E3E0] disabled:text-slate-500 px-4 py-2 text-xs font-bold uppercase transition-all cursor-pointer"
        >
          发送 (Send)
        </button>
      </form>
    </div>
  );
}
export { SUGGESTED_QUESTIONS };
