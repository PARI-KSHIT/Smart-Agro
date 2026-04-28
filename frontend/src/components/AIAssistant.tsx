import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import {
  Bot,
  X,
  Send,
  MessageSquare,
  Loader2,
  User,
  Sparkles,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your AI Farming Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Translate welcome message when language changes
  useEffect(() => {
    const welcomeMessages: Record<string, string> = {
      en: 'Hello! I am your AI Farming Assistant. How can I help you today?',
      hi: 'नमस्ते! मैं आपका एआई कृषि सहायक हूं। मैं आज आपकी कैसे मदद कर सकता हूं?',
      mr: 'नमस्कार! मी तुमचा AI शेती सहाय्यक आहे. मी तुम्हाला आज कशी मदत करू शकतो?'
    };

    setMessages(prev => [
      {
        ...prev[0],
        content: welcomeMessages[i18n.language] || welcomeMessages.en
      },
      ...prev.slice(1)
    ]);
  }, [i18n.language]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const langMap: Record<string, string> = {
        en: 'English',
        hi: 'Hindi',
        mr: 'Marathi'
      };
      const targetLang = langMap[i18n.language] || 'English';

      // Check for API Key with multiple fallback methods
      const apiKey = (window as any).GEMINI_API_KEY || (process.env as any).GEMINI_API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('Gemini API Key is missing. Please check your environment variables.');
      }

      const ai = new GoogleGenAI({ apiKey });

      // Use the prompt exactly as requested by the user
      const systemPrompt = `You are an agriculture expert. Provide simple and helpful answers for farmers. 
      Answer the following question dynamically using your latest knowledge. 
      Respond STRICTLY in ${targetLang}.`;

      // Build turn-based contents array for Gemini
      // messages[0] is always the assistant welcome message (role: 'assistant')
      const chatHistory = messages.slice(1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // To ensure valid turn order: systemPrompt(user) -> welcome(model) -> [history] -> input(user)
      const contents = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: messages[0].content }] },
        ...chatHistory,
        { role: 'user', parts: [{ text: input }] }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('No response from Gemini');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('AI Error:', error);
      // Inform the user about the connection issue while keeping the UI functional
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Trouble connecting to Gemini: ${error.message || 'Please check your API key and connection.'}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? '64px' : '500px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 w-[380px] max-w-[calc(100vw-48px)] flex flex-col overflow-hidden mb-4 transition-all duration-300`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest">Agro AI</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-emerald-100/80">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-gray-50/50">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`
                        max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed
                        ${msg.role === 'user'
                          ? 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-900/10'
                          : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm'}
                      `}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask about fertilizer, market, crop..."
                      className="w-full pl-5 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className={`
                        absolute right-2 p-2.5 rounded-xl transition-all
                        ${input.trim() && !isLoading
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 hover:scale-105 active:scale-95'
                          : 'bg-gray-200 text-gray-400'}
                      `}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 p-4 rounded-full shadow-2xl transition-all duration-300
          ${isOpen ? 'bg-white text-emerald-600 border border-emerald-100' : 'bg-emerald-600 text-white'}
        `}
      >
        <div className="relative">
          <Sparkles className="w-6 h-6 animate-pulse" />
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-emerald-600"></div>
          )}
        </div>
        {!isOpen && (
          <span className="font-black text-sm uppercase tracking-widest pr-2 border-l border-white/20 pl-3">
            AI Helper
          </span>
        )}
        {isOpen && <Minimize2 className="w-5 h-5" />}
      </motion.button>
    </div>
  );
}
