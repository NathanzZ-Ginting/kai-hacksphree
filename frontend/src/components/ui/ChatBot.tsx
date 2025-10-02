import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, Clock, X } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface QuickQuestion {
  question: string;
  answer: string;
}

interface ChatBotProps {
  quickQuestions: QuickQuestion[];
  onContactSupport: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const ChatBot = ({
  quickQuestions,
  onContactSupport,
  isOpen,
  onClose,
}: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatBotRef = useRef<HTMLDivElement>(null);

  const initialBotMessage: Message = {
    id: 1,
    text: "Halo! Saya KAI Assistant 🤖\nSaya di sini untuk membantu menjawab pertanyaan Anda tentang layanan KAI. Silakan pilih pertanyaan cepat di bawah atau ketik pertanyaan Anda!",
    isUser: false,
    timestamp: new Date(),
  };

  // Check mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize messages
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([initialBotMessage]);
    }
  }, [isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Prevent body scroll when chatbot is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Click outside to close (desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isMobile &&
        chatBotRef.current &&
        !chatBotRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMobile, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  const handleQuickQuestion = (question: string, answer: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: question,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: answer,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!userInput.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      text: userInput,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsTyping(true);

    // Simple pattern matching for common questions
    const input = userInput.toLowerCase();
    let botResponse = "";

    setTimeout(() => {
      if (input.includes("tiket") && input.includes("batal")) {
        botResponse = quickQuestions[2].answer;
      } else if (input.includes("pembayaran") || input.includes("bayar")) {
        botResponse = quickQuestions[1].answer;
      } else if (input.includes("pesan") || input.includes("beli")) {
        botResponse = quickQuestions[0].answer;
      } else if (input.includes("aplikasi") || input.includes("download")) {
        botResponse = quickQuestions[5].answer;
      } else if (input.includes("barang") || input.includes("bawa")) {
        botResponse = quickQuestions[4].answer;
      } else if (input.includes("waktu") || input.includes("datang")) {
        botResponse = quickQuestions[3].answer;
      } else {
        botResponse = `Maaf, saya belum bisa menjawab pertanyaan spesifik tentang "${userInput}".\n\nUntuk pertanyaan yang lebih detail, silakan hubungi customer service kami:\n\n📞 Call Center: 121 (24/7)\n💬 Live Chat: Tersedia 08.00-22.00 WIB\n✉️ Email: customer@kai.id\n\nAtau Anda bisa memilih pertanyaan dari daftar cepat di bawah.`;
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clearChat = () => {
    setMessages([initialBotMessage]);
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Fullscreen Overlay */}
      {isMobile && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 border-b border-purple-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-gray-700" />
                </div>
                <div>
                  <div className="font-semibold">KAI Assistant</div>
                  <div className="text-purple-200 text-sm flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Online • Siap membantu
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearChat}
                  className="text-purple-200 hover:text-white transition-colors text-sm px-3 py-1 rounded cursor-pointer"
                  title="Bersihkan percakapan"
                >
                  Clear
                </button>
                <button
                  onClick={onClose}
                  className="text-purple-200 hover:text-white transition-colors p-2 rounded-full hover:bg-opacity-10 cursor-pointer"
                  title="Tutup chatbot"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Messages - Mobile */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 chatbot-scrollbar"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 ${
                    message.isUser
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-white border border-gray-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {message.isUser ? (
                      <User className="h-3 w-3" />
                    ) : (
                      <Bot className="h-3 w-3 text-gray-600" />
                    )}
                    <span
                      className={`text-xs ${
                        message.isUser ? "text-purple-200" : "text-gray-600"
                      }`}
                    >
                      {message.isUser ? "Anda" : "KAI Assistant"}
                    </span>
                    <span
                      className={`text-xs flex items-center ${
                        message.isUser ? "text-purple-200" : "text-gray-500"
                      }`}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div
                    className={`whitespace-pre-line text-sm ${
                      message.isUser ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-3 w-3 text-gray-400" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions - Mobile */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="mb-3">
              <div className="text-sm text-gray-600 mb-2 font-medium">
                Pertanyaan Cepat:
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar">
                {quickQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(q.question, q.answer)}
                    disabled={isTyping}
                    className="w-full text-left p-3 text-sm border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm text-gray-700"
                  >
                    {q.question}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area - Mobile */}
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik pertanyaan Anda..."
                  disabled={isTyping}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
                  rows={1}
                  style={{ minHeight: "50px", maxHeight: "100px" }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isTyping}
                className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-sm"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>

            {/* Support CTA - Mobile */}
            <div className="mt-3 text-center">
              <button
                onClick={onContactSupport}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors underline"
              >
                Butuh bantuan manusia? Hubungi Customer Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Floating Chat */}
      {!isMobile && (
        <div
          ref={chatBotRef}
          className="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col max-h-[600px] animate-in slide-in-from-bottom-10 duration-300"
        >
          {/* Chat Header - Desktop */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">KAI Assistant</div>
                  <div className="text-purple-200 text-sm flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Online • Siap membantu
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearChat}
                  className="text-purple-200 hover:text-white transition-colors text-sm px-2 py-1 rounded cursor-pointer"
                  title="Bersihkan percakapan"
                >
                  Clear
                </button>
                <button
                  onClick={onClose}
                  className="text-purple-200 hover:text-white transition-colors p-1 rounded-full hover:bg-white hover:bg-opacity-10 cursor-pointer"
                  title="Tutup chatbot"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Messages - Desktop */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 max-h-[300px] chatbot-scrollbar"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 ${
                    message.isUser
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-white border border-gray-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {message.isUser ? (
                      <User className="h-3 w-3" />
                    ) : (
                      <Bot className="h-3 w-3 text-gray-600" />
                    )}
                    <span
                      className={`text-xs ${
                        message.isUser ? "text-purple-200" : "text-gray-600"
                      }`}
                    >
                      {message.isUser ? "Anda" : "KAI Assistant"}
                    </span>
                    <span
                      className={`text-xs flex items-center ${
                        message.isUser ? "text-purple-200" : "text-gray-500"
                      }`}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div
                    className={`whitespace-pre-line text-sm ${
                      message.isUser ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-3 w-3 text-gray-400" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions - Desktop */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="mb-3">
              <div className="text-sm text-gray-600 mb-2 font-medium">
                Pertanyaan Cepat:
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {quickQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(q.question, q.answer)}
                    disabled={isTyping}
                    className="w-full text-left p-3 text-sm border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm"
                  >
                    {q.question}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area - Desktop */}
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik pertanyaan Anda..."
                  disabled={isTyping}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
                  rows={1}
                  style={{ minHeight: "50px", maxHeight: "100px" }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isTyping}
                className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-sm"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>

            {/* Support CTA - Desktop */}
            <div className="mt-3 text-center">
              <button
                onClick={onContactSupport}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors underline"
              >
                Butuh bantuan manusia? Hubungi Customer Service
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
