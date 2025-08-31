import { useEffect, useMemo, useRef, useState } from 'react'
import { FiSend, FiMessageSquare, FiUser, FiShield, FiZap, FiTrash, FiMenu, FiX } from 'react-icons/fi'

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState('ai') // 'ai' | 'pro'

  // Chat history: conversations per tab with localStorage persistence
  const defaultAiGreeting = { id: `a-${Date.now()}`, role: 'assistant', text: 'Hi! I\'m your AI assistant. Ask me anything, and I\'ll do my best to help.', ts: Date.now() - 60_000 }
  const defaultProGreeting = { id: `p-${Date.now()}`, role: 'agent', text: 'Hello! A counselor will be with you shortly. Share how we can help today.', ts: Date.now() - 45_000 }

  const loadConvos = (key, fallbackMessages) => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return [{ id: `${key}-1`, title: 'New chat', updatedAt: Date.now(), messages: fallbackMessages }]
  }

  const [aiConvos, setAiConvos] = useState(() => loadConvos('chat_ai_convos', [defaultAiGreeting]))
  const [proConvos, setProConvos] = useState(() => loadConvos('chat_pro_convos', [defaultProGreeting]))
  const [aiCurrentId, setAiCurrentId] = useState(() => (loadConvos('chat_ai_convos', [defaultAiGreeting])[0]?.id ?? null))
  const [proCurrentId, setProCurrentId] = useState(() => (loadConvos('chat_pro_convos', [defaultProGreeting])[0]?.id ?? null))

  const [aiInput, setAiInput] = useState('')
  const [proInput, setProInput] = useState('')
  const [aiTyping, setAiTyping] = useState(false)
  const [proTyping, setProTyping] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => { localStorage.setItem('chat_ai_convos', JSON.stringify(aiConvos)) }, [aiConvos])
  useEffect(() => { localStorage.setItem('chat_pro_convos', JSON.stringify(proConvos)) }, [proConvos])

  const aiEndRef = useRef(null)
  const proEndRef = useRef(null)
  const textareaRef = useRef(null)

  const currentAi = aiConvos.find((c) => c.id === aiCurrentId) || aiConvos[0]
  const currentPro = proConvos.find((c) => c.id === proCurrentId) || proConvos[0]
  const aiMessages = currentAi?.messages ?? []
  const proMessages = currentPro?.messages ?? []

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const maxHeight = 160
    const newHeight = Math.min(el.scrollHeight, maxHeight)
    el.style.height = `${newHeight}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [aiInput, proInput, activeTab])

  function handleDeleteConversation(conversationId) {
    if (!window.confirm('Delete this conversation? This cannot be undone.')) return
    if (activeTab === 'ai') {
      setAiConvos((convos) => {
        const remaining = convos.filter((c) => c.id !== conversationId)
        if (remaining.length === 0) {
          const id = `ai-${Date.now()}`
          const fresh = { id, title: 'New chat', updatedAt: Date.now(), messages: [{ ...defaultAiGreeting, id: `a-${Date.now()}`, ts: Date.now() }] }
          setAiCurrentId(id)
          return [fresh]
        }
        if (aiCurrentId === conversationId) {
          setAiCurrentId(remaining[0].id)
        }
        return remaining
      })
    } else {
      setProConvos((convos) => {
        const remaining = convos.filter((c) => c.id !== conversationId)
        if (remaining.length === 0) {
          const id = `pro-${Date.now()}`
          const fresh = { id, title: 'New chat', updatedAt: Date.now(), messages: [{ ...defaultProGreeting, id: `p-${Date.now()}`, ts: Date.now() }] }
          setProCurrentId(id)
          return [fresh]
        }
        if (proCurrentId === conversationId) {
          setProCurrentId(remaining[0].id)
        }
        return remaining
      })
    }
  }

  const handleSendAi = (e) => {
    e?.preventDefault()
    const text = aiInput.trim()
    if (!text) return
    const userMsg = { id: `u-${Date.now()}`, role: 'user', text, ts: Date.now() }
    setAiConvos((convos) => convos.map((c) => {
      if (c.id !== aiCurrentId) return c
      const hasTitle = c.title && c.title !== 'New chat'
      const newTitle = hasTitle ? c.title : text.slice(0, 40)
      return { ...c, title: newTitle || 'New chat', updatedAt: Date.now(), messages: [...c.messages, userMsg] }
    }))
    setAiInput('')
    setAiTyping(true)

    // Simulated AI response (replace with API hookup later)
    setTimeout(() => {
      const reply = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: 'Thanks for your message! This is a placeholder AI response. We can wire this to a backend when ready.',
        ts: Date.now(),
      }
      setAiConvos((convos) => convos.map((c) => (
        c.id === aiCurrentId ? { ...c, updatedAt: Date.now(), messages: [...c.messages, reply] } : c
      )))
      setAiTyping(false)
    }, 800)
  }

  const handleSendPro = (e) => {
    e?.preventDefault()
    const text = proInput.trim()
    if (!text) return
    const userMsg = { id: `u-${Date.now()}`, role: 'user', text, ts: Date.now() }
    setProConvos((convos) => convos.map((c) => {
      if (c.id !== proCurrentId) return c
      const hasTitle = c.title && c.title !== 'New chat'
      const newTitle = hasTitle ? c.title : text.slice(0, 40)
      return { ...c, title: newTitle || 'New chat', updatedAt: Date.now(), messages: [...c.messages, userMsg] }
    }))
    setProInput('')
    setProTyping(true)

    // Simulated agent ack (replace with realtime/queue later)
    setTimeout(() => {
      const ack = {
        id: `p-${Date.now()}`,
        role: 'agent',
        text: 'We\'ve received your message. A professional will respond here. (Demo)',
        ts: Date.now(),
      }
      setProConvos((convos) => convos.map((c) => (
        c.id === proCurrentId ? { ...c, updatedAt: Date.now(), messages: [...c.messages, ack] } : c
      )))
      setProTyping(false)
    }, 1000)
  }

  const header = useMemo(() => (
    activeTab === 'ai' ? (
      <div className="flex items-center gap-2 text-[#1E3A8A]">
        <FiZap />
        <span className="font-bold">AI Chat</span>
        <span className="text-slate-600 font-semibold">Instant, automated guidance</span>
      </div>
    ) : (
      <div className="flex items-center gap-2 text-[#1E3A8A]">
        <FiShield />
        <span className="font-bold">Professional Chat</span>
        <span className="text-slate-600 font-semibold">Private, human support</span>
      </div>
    )
  ), [activeTab])

  const insertPrompt = (text) => {
    if (activeTab === 'ai') setAiInput((v) => (v ? `${v} ${text}` : text))
    else setProInput((v) => (v ? `${v} ${text}` : text))
  }

  return (
    <section className="px-0 md:px-6 py-0 md:py-4 font-friendly w-screen mx-[calc(50%-50vw)]">
      <div className="w-full">

        {/* Joined container: Sidebar left, right column with top bar + messages + composer */}
        <div className="relative mx-auto w-full max-w-none h-[85vh] bg-white rounded-none md:rounded-2xl border-0 md:border border-[#65A3FA] shadow-none md:shadow-lg flex flex-col overflow-hidden">
          {/* Content grid */}
          <div className="grid flex-1 min-h-0 grid-rows-[auto_1fr_auto] md:grid-cols-[18rem_1fr]">
            {/* Sidebar: conversation history */}
            <aside className="hidden md:flex w-72 shrink-0 flex-col md:row-span-3 md:border-r border-slate-200">
              <div className="p-3 border-b border-slate-200 flex items-center justify-between">
                <div className="text-sm font-bold text-slate-700">Conversations</div>
                <button
                  type="button"
                  className="rounded-md bg-[#65A3FA] px-2 py-1 text-xs text-white font-semibold hover:bg-[#3B82F6]"
                  onClick={() => {
                    if (activeTab === 'ai') {
                      const id = `ai-${Date.now()}`
                      const next = { id, title: 'New chat', updatedAt: Date.now(), messages: [defaultAiGreeting] }
                      setAiConvos((c) => [next, ...c])
                      setAiCurrentId(id)
                    } else {
                      const id = `pro-${Date.now()}`
                      const next = { id, title: 'New chat', updatedAt: Date.now(), messages: [defaultProGreeting] }
                      setProConvos((c) => [next, ...c])
                      setProCurrentId(id)
                    }
                  }}
                >
                  New chat
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {(activeTab === 'ai' ? aiConvos : proConvos)
                  .slice()
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map((c) => {
                    const isActive = (activeTab === 'ai' ? aiCurrentId : proCurrentId) === c.id
                    return (
                      <div
                        key={c.id}
                        className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold transition-colors ${isActive ? 'bg-blue-50 text-[#1E3A8A] border border-blue-200' : 'hover:bg-slate-100 text-slate-700 border border-transparent'}`}
                      >
                        <button
                          type="button"
                          className="flex-1 text-left"
                          onClick={() => {
                            if (activeTab === 'ai') setAiCurrentId(c.id)
                            else setProCurrentId(c.id)
                          }}
                          title={new Date(c.updatedAt).toLocaleString()}
                        >
                          <div className="truncate">{c.title || 'New chat'}</div>
                          <div className="text-[11px] text-slate-500 font-semibold">{new Date(c.updatedAt).toLocaleDateString()} {new Date(c.updatedAt).toLocaleTimeString()}</div>
                        </button>
                        <button
                          type="button"
                          aria-label="Delete conversation"
                          className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                          onClick={(e) => { e.stopPropagation(); handleDeleteConversation(c.id) }}
                          title="Delete"
                        >
                          <FiTrash size={14} />
                        </button>
                      </div>
                    )
                  })}
              </div>
            </aside>

            {/* Top bar with toggle and descriptor (right column) */}
            <div className="border-b border-slate-200 p-2 md:p-3 flex items-center justify-between gap-2 md:col-start-2 md:row-start-1">
              <div className="flex items-center gap-2">
                <div className="md:hidden">
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                    aria-label="Open chat history"
                    onClick={() => setMobileSidebarOpen(true)}
                  >
                    <FiMenu />
                  </button>
                </div>
            <div className="inline-flex rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('ai')}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm md:text-base font-semibold transition-colors ${activeTab === 'ai' ? 'bg-[#65A3FA] text-white' : 'text-slate-700 hover:bg-slate-200'}`}
              >
                <FiMessageSquare /> AI Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pro')}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm md:text-base font-semibold transition-colors ${activeTab === 'pro' ? 'bg-[#65A3FA] text-white' : 'text-slate-700 hover:bg-slate-200'}`}
              >
                <FiShield /> Professional Chat
              </button>
                </div>
            </div>
            <div className="hidden sm:block">
              {header}
            </div>
          </div>

            {/* Mobile conversation drawer (relative to chat container) */}
            <div className={`md:hidden absolute inset-0 ${mobileSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
              <div
                className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ease-out ${mobileSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => setMobileSidebarOpen(false)}
              />
              <div
                className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-out ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
              >
                <div className="p-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="text-sm font-bold text-slate-700">Conversations</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-md bg-[#65A3FA] px-2 py-1 text-xs text-white font-semibold hover:bg-[#3B82F6]"
                      onClick={() => {
                        if (activeTab === 'ai') {
                          const id = `ai-${Date.now()}`
                          const next = { id, title: 'New chat', updatedAt: Date.now(), messages: [defaultAiGreeting] }
                          setAiConvos((c) => [next, ...c])
                          setAiCurrentId(id)
                        } else {
                          const id = `pro-${Date.now()}`
                          const next = { id, title: 'New chat', updatedAt: Date.now(), messages: [defaultProGreeting] }
                          setProConvos((c) => [next, ...c])
                          setProCurrentId(id)
                        }
                      }}
                    >
                      New chat
                    </button>
                        <button
                          type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                      aria-label="Close"
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {(activeTab === 'ai' ? aiConvos : proConvos)
                    .slice()
                    .sort((a, b) => b.updatedAt - a.updatedAt)
                    .map((c) => {
                      const isActive = (activeTab === 'ai' ? aiCurrentId : proCurrentId) === c.id
                      return (
                        <div
                          key={c.id}
                          className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold transition-colors ${isActive ? 'bg-blue-50 text-[#1E3A8A] border border-blue-200' : 'hover:bg-slate-100 text-slate-700 border border-transparent'}`}
                        >
                          <button
                            type="button"
                            className="flex-1 text-left"
                            onClick={() => {
                              if (activeTab === 'ai') setAiCurrentId(c.id)
                              else setProCurrentId(c.id)
                              setMobileSidebarOpen(false)
                            }}
                            title={new Date(c.updatedAt).toLocaleString()}
                          >
                            <div className="truncate">{c.title || 'New chat'}</div>
                            <div className="text-[11px] text-slate-500 font-semibold">{new Date(c.updatedAt).toLocaleDateString()} {new Date(c.updatedAt).toLocaleTimeString()}</div>
                          </button>
                          <button
                            type="button"
                            aria-label="Delete conversation"
                            className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                            onClick={(e) => { e.stopPropagation(); handleDeleteConversation(c.id) }}
                            title="Delete"
                          >
                            <FiTrash size={14} />
                        </button>
                        </div>
                      )
                    })}
                    </div>
                  </div>
                  </div>

            {/* Messages (right column, middle row) */}
            <div className="min-h-0 overflow-y-auto p-4 md:p-6 space-y-3 bg-slate-50 md:col-start-2 md:row-start-2">
              {activeTab === 'ai' ? (
                <>
                  {aiMessages.map((m) => (
                    <MessageBubble key={m.id} role={m.role} text={m.text} />
                  ))}
                  {aiTyping && <TypingBubble who="assistant" />}
                  <div ref={aiEndRef} />
                </>
              ) : (
                <>
                  {proMessages.map((m) => (
                    <MessageBubble key={m.id} role={m.role} text={m.text} />
                  ))}
                  {proTyping && <TypingBubble who="agent" />}
                  <div ref={proEndRef} />
                </>
              )}
            </div>

            {/* Composer (right column, bottom row) */}
            <form
              onSubmit={activeTab === 'ai' ? handleSendAi : handleSendPro}
              className="p-3 md:p-4 border-t border-slate-200 bg-white md:col-start-2 md:row-start-3"
            >
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-xl border border-slate-300 bg-white/90 focus-within:ring-2 focus-within:ring-[#65A3FA]">
                <textarea
                    ref={textareaRef}
                    rows={1}
                    className="block w-full resize-none rounded-xl bg-transparent px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none"
                  placeholder={activeTab === 'ai' ? 'Ask the AI for guidance…' : 'Message the professional counselor…'}
                  value={activeTab === 'ai' ? aiInput : proInput}
                  onChange={(e) => (activeTab === 'ai' ? setAiInput(e.target.value) : setProInput(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        ;(activeTab === 'ai' ? handleSendAi : handleSendPro)()
                      }
                    }}
                  />
                  <div className="hidden md:flex items-center justify-end px-3 pb-1 text-[11px] text-slate-500 font-semibold">Press Enter to send • Shift+Enter for newline</div>
                </div>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-[#65A3FA] px-4 text-white font-semibold hover:bg-[#3B82F6] disabled:opacity-50"
                  disabled={(activeTab === 'ai' ? aiInput.trim().length === 0 || aiTyping : proInput.trim().length === 0 || proTyping)}
                  title="Send"
                >
                  <FiSend />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function MessageBubble({ role, text }) {
  const isUser = role === 'user'
  const isAssistant = role === 'assistant'
  const isAgent = role === 'agent'
  return (
    <div className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className={`mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isAssistant ? 'bg-[#65A3FA]/10 text-[#1E3A8A]' : 'bg-emerald-50 text-emerald-700'}`}>
          {isAssistant ? <FiZap /> : <FiShield />}
        </div>
      )}
      <div className={`max-w-[80%] rounded-2xl border px-3 py-2 text-sm font-semibold shadow-sm ${isUser ? 'border-blue-200 bg-blue-50 text-[#1E3A8A]' : 'border-slate-200 bg-white text-slate-800'}`}>
        {text}
      </div>
      {isUser && (
        <div className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#65A3FA] text-white">
          <FiUser />
        </div>
      )}
    </div>
  )
}

function TypingBubble({ who }) {
  const label = who === 'assistant' ? 'AI is typing…' : 'Counselor is typing…'
  return (
    <div className="flex items-center gap-2 text-slate-500 font-semibold">
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.2s]" />
          <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
          <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
        </span>
        <span>{label}</span>
      </span>
    </div>
  )
}

