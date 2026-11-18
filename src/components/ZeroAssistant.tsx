"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Send,
  Square,
  Volume2,
  VolumeX,
  Trash2,
  Mic,
  MicOff,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { AllowedAction, ChatMessage } from "@/lib/ai/types";
import { validateAction } from "@/lib/ai/actions";
import { profile } from "@/data/profile";

interface DisplayMessage extends ChatMessage {
  id: string;
  isStreaming?: boolean;
}

const QUICK_PROMPTS = [
  "Who is Chethan?",
  "Show me NO ENTRY",
  "Download CV",
  "Tell me a security joke"
];

// Helper to strip markdown and code before SpeechSynthesis
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " code block omitted ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[#*_~>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ZeroAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Audio waveform & recognition refs
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Load chat & mute state from storage
  useEffect(() => {
    try {
      const savedMute = localStorage.getItem("zero_muted");
      if (savedMute !== null) {
        setIsMuted(savedMute === "true");
      }

      const savedChat = sessionStorage.getItem("zero_messages");
      if (savedChat) {
        setMessages(JSON.parse(savedChat));
      } else {
        // Initial greeting
        setMessages([
          {
            id: "init",
            role: "assistant",
            content:
              "Greetings. I am ZERO AI — Chethan's white-hat AI companion. Ask me about his cyber ranges, red-team experience, or request a system tour."
          }
        ]);
      }
    } catch {
      // Storage unavailable fallback
    }

    // Check Speech Recognition support
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      setSpeechSupported(true);
    }
  }, []);

  // Persist messages to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem("zero_messages", JSON.stringify(messages.slice(-16)));
      } catch {
        // Ignore
      }
    }
  }, [messages]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, scrollToBottom]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      stopSpeaking();
      stopListening();
    }
  }, [isOpen, stopSpeaking, stopListening]);

  // Esc key closes panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Handle SpeechSynthesis
  const speakText = (text: string) => {
    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const clean = cleanTextForSpeech(text);
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

    // Pick English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find((v) => v.lang.startsWith("en") && v.name.includes("Natural")) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    try {
      localStorage.setItem("zero_muted", String(nextMute));
    } catch {}
    if (nextMute) {
      stopSpeaking();
    }
  };

  const clearChat = () => {
    stopSpeaking();
    const initialMsg: DisplayMessage = {
      id: "clear-" + Date.now(),
      role: "assistant",
      content:
        "Terminal memory cleared. Ready for your instructions."
    };
    setMessages([initialMsg]);
    sessionStorage.removeItem("zero_messages");
  };

  // Execute client action
  const handleClientAction = (action: AllowedAction | null) => {
    if (!action) return;
    const validated = validateAction(action);
    if (!validated) return;

    if (validated.type === "scroll") {
      const targetEl = document.getElementById(validated.target);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    } else if (validated.type === "project") {
      window.dispatchEvent(
        new CustomEvent("zero:open-project", {
          detail: { slug: validated.slug }
        })
      );
    } else if (validated.type === "download_cv") {
      const link = document.createElement("a");
      link.href = profile.cvPath;
      link.download = "ChethanKumar.CV.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Send message flow
  const handleSend = async (messageToSend?: string) => {
    const query = (messageToSend ?? input).trim();
    if (!query || isStreaming) return;

    stopSpeaking();
    setInput("");

    const userMsg: DisplayMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: query
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    setIsStreaming(true);
    const assistantId = "assistant-" + Date.now();

    // Prepare assistant message bubble
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", isStreaming: true }
    ]);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const apiPayload = newMessages
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiPayload }),
        signal: abortController.signal
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const failText =
          errorData.error ||
          "ZER0 encountered a connection anomaly. Please try again shortly.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: failText, isStreaming: false }
              : m
          )
        );
        speakText(failText);
        setIsStreaming(false);
        return;
      }

      // Check if fallback json returned directly
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const jsonData = await res.json();
        const reply =
          jsonData.fallbackMessage ||
          jsonData.error ||
          "ZER0 is rebooting. Try again in a minute, or email Chethan directly.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: reply, isStreaming: false }
              : m
          )
        );
        speakText(reply);
        setIsStreaming(false);
        return;
      }

      // Read SSE stream
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response reader");

      const decoder = new TextDecoder();
      let streamedContent = "";
      let pendingBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        pendingBuffer += decoder.decode(value, { stream: true });
        const lines = pendingBuffer.split("\n\n");
        pendingBuffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          try {
            const data = JSON.parse(trimmed.slice(5).trim());

            if (data.text) {
              streamedContent += data.text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: streamedContent }
                    : m
                )
              );
            }

            if (data.done) {
              if (data.action) {
                handleClientAction(data.action);
              }
              break;
            }
          } catch {
            // Ignore malformed chunk
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, isStreaming: false } : m
        )
      );
      speakText(streamedContent);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "System alert: Connection reset. ZER0 is still operational.",
                  isStreaming: false
                }
              : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      stopSpeaking();
    }
  };

  // Voice Input with Web Speech API & Web Audio Waveform
  const startListening = async () => {
    if (!speechSupported) {
      setVoiceNotice("Voice input not supported in this browser.");
      setTimeout(() => setVoiceNotice(null), 3000);
      return;
    }

    try {
      const SpeechRec =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        setInput(final || interim);

        if (final) {
          stopListening();
          handleSend(final);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn("Speech recognition error:", e.error);
        if (e.error === "not-allowed") {
          setVoiceNotice("Microphone permission denied.");
          setTimeout(() => setVoiceNotice(null), 3500);
        }
        stopListening();
      };

      recognition.onend = () => {
        stopListening();
      };

      // Set up Web Audio Analyser for live waveform
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      drawWaveform();

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Microphone access error:", err);
      setVoiceNotice("Unable to access microphone.");
      setTimeout(() => setVoiceNotice(null), 3500);
      stopListening();
    }
  };

  const drawWaveform = () => {
    const canvas = waveformCanvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      animationFrameRef.current = requestAnimationFrame(renderFrame);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = "#00FF9C";
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    };

    renderFrame();
  };

  return (
    <>
      {/* Floating Orb trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 bg-[#090E13] border border-[#00FF9C]/60 hover:border-[#00FF9C] rounded-full shadow-[0_0_25px_rgba(0,255,156,0.35)] hover:shadow-[0_0_35px_rgba(0,255,156,0.6)] transition-all duration-300 group cursor-pointer"
          aria-label="Open ZERO AI Assistant"
        >
          {/* Pulsing neon ring */}
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF9C] opacity-80" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#00FF9C]" />
          </span>

          <span className="font-mono text-sm font-bold text-[#00FF9C] tracking-wider">
            ZERO AI
          </span>
          <Sparkles className="w-4 h-4 text-[#00E5FF] group-hover:rotate-45 transition-transform" />
        </button>
      )}

      {/* Chat Panel / Mobile Bottom Sheet */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="ZERO AI Assistant Chat"
          aria-modal="true"
          className="fixed inset-x-0 bottom-0 md:inset-auto md:bottom-6 md:right-6 md:w-[440px] md:h-[620px] h-[90vh] z-50 flex flex-col bg-[#05080A]/95 backdrop-blur-xl border border-[#00FF9C]/50 shadow-[0_0_40px_rgba(0,255,156,0.25)] cut-corner-tr-bl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#090E13] border-b border-[#00FF9C]/30 font-mono">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF9C] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF9C]" />
              </span>
              <span className="text-sm font-bold text-[#00FF9C]">
                ZERO AI // white-hat sidekick
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* Mute toggle */}
              <button
                onClick={toggleMute}
                className="p-1.5 text-[#6B8A7D] hover:text-[#00FF9C] rounded hover:bg-[#00FF9C]/10 transition-colors"
                title={isMuted ? "Unmute voice response" : "Mute voice response"}
                aria-label={isMuted ? "Unmute voice" : "Mute voice"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#00FF9C]" />}
              </button>

              {/* Clear chat */}
              <button
                onClick={clearChat}
                className="p-1.5 text-[#6B8A7D] hover:text-[#FF3B6B] rounded hover:bg-[#FF3B6B]/10 transition-colors"
                title="Clear chat history"
                aria-label="Clear chat history"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#6B8A7D] hover:text-[#D7FFE9] rounded hover:bg-[#00FF9C]/10 transition-colors"
                title="Close ZERO AI (Esc)"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Voice notification toast */}
          {voiceNotice && (
            <div className="px-3 py-1.5 bg-[#FF3B6B]/15 border-b border-[#FF3B6B]/30 text-xs font-mono text-[#FF3B6B] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{voiceNotice}</span>
            </div>
          )}

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-[#05080A] border-b border-[#00FF9C]/15 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                disabled={isStreaming}
                className="px-2.5 py-1 text-[11px] font-mono whitespace-nowrap bg-[#090E13] text-[#00E5FF] border border-[#00E5FF]/30 hover:border-[#00FF9C] hover:text-[#00FF9C] rounded-sm transition-colors shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div
            className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs sm:text-sm"
            aria-live="polite"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="text-[10px] text-[#6B8A7D] mb-1 font-mono">
                  {m.role === "user" ? "user@client" : "ZERO@kali"}
                </div>
                <div
                  className={`p-3 rounded-sm max-w-[90%] whitespace-pre-wrap leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#090E13] text-[#00E5FF] border border-[#00E5FF]/40 cut-corner-sm"
                      : "bg-[#090E13]/90 text-[#D7FFE9] border border-[#00FF9C]/30 cut-corner-sm shadow-[0_0_12px_rgba(0,255,156,0.08)]"
                  }`}
                >
                  {m.content}
                  {m.isStreaming && (
                    <span className="inline-block w-2 h-3.5 ml-1 bg-[#00FF9C] animate-pulse" />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Waveform visualizer when microphone is listening */}
          {isListening && (
            <div className="px-4 py-2 bg-[#090E13] border-t border-[#00FF9C]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#FF3B6B] animate-ping" />
                <span className="text-xs font-mono text-[#00FF9C]">
                  Listening... speak now
                </span>
              </div>
              <canvas
                ref={waveformCanvasRef}
                width={120}
                height={20}
                className="rounded-sm bg-[#05080A]"
              />
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-[#090E13] border-t border-[#00FF9C]/30 flex flex-col gap-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isListening ? "Listening to your voice..." : "Ask ZERO AI about Chethan or security..."
                  }
                  disabled={isStreaming}
                  className="w-full bg-[#05080A] text-[#D7FFE9] placeholder-[#6B8A7D] text-xs sm:text-sm font-mono px-3 py-2 border border-[#00FF9C]/30 focus:border-[#00FF9C] focus:outline-none rounded-sm"
                  maxLength={800}
                />
              </div>

              {/* Mic button */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isStreaming}
                  className={`p-2 rounded-sm border transition-colors ${
                    isListening
                      ? "bg-[#FF3B6B]/20 border-[#FF3B6B] text-[#FF3B6B] animate-pulse"
                      : "bg-[#05080A] border-[#00FF9C]/30 text-[#6B8A7D] hover:text-[#00FF9C]"
                  }`}
                  title={isListening ? "Stop listening" : "Voice input"}
                  aria-label={isListening ? "Stop listening" : "Voice input"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              {/* Send / Stop button */}
              {isStreaming ? (
                <button
                  type="button"
                  onClick={handleStopGenerating}
                  className="p-2 bg-[#FF3B6B]/20 border border-[#FF3B6B] text-[#FF3B6B] hover:bg-[#FF3B6B]/30 rounded-sm transition-colors"
                  title="Stop generating"
                  aria-label="Stop generating"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 bg-[#00FF9C] text-[#05080A] font-bold rounded-sm hover:bg-[#00E5FF] transition-colors disabled:opacity-40 disabled:hover:bg-[#00FF9C]"
                  title="Send message"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </form>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#6B8A7D] px-1">
              <span>BOUND TO VERIFIED KNOWLEDGE</span>
              <span>ESC TO EXIT</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
