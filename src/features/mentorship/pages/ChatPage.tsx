import { useState } from 'react';
import {
  Calendar,
  Check,
  CheckCheck,
  Edit3,
  ExternalLink,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { MOCK_CONVERSATIONS, type Conversation, type Message } from '@/features/mentorship/data/chatData';

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>('alex-rivera');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const filteredConversations = conversations.filter((c) =>
    c.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.mentorRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: String(Date.now()),
      sender: 'student',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            lastMessage: newMessage.text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    setInputText('');
  }

  return (
    <div className="w-full space-y-4 text-slate-800">
      
      {/* 1. Header: Messages Title & Subtitle */}
      <div className="flex items-center gap-3 pt-1">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2D0643] to-[#591077] text-white shadow-md">
          <MessageSquare size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            Messages
          </h1>
          <p className="text-xs font-normal text-slate-400 mt-0.5">
            Stay connected with your mentors.
          </p>
        </div>
      </div>

      {/* 2. Main 3-Column Layout */}
      <div className="flex h-[calc(100vh-185px)] min-h-[620px] w-full gap-4">
        
        {/* ================= COLUMN 1: CONVERSATIONS LIST ================= */}
        <section className="flex w-[310px] shrink-0 flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Conversations</h2>
              <span className="flex size-5 items-center justify-center rounded-full bg-purple-50 text-[11px] font-bold text-[#551072]">
                {conversations.length}
              </span>
            </div>

            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-xl bg-[#2D0643] text-white shadow-sm transition hover:bg-[#430963]"
              title="New Conversation"
            >
              <Edit3 size={15} />
            </button>
          </div>

          {/* Search Input */}
          <div className="px-4 pb-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-purple-300 focus:bg-white"
              />
            </div>
          </div>

          {/* Conversations Items */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversationId;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`group relative flex cursor-pointer items-start gap-3 rounded-2xl p-3 transition-all ${
                    isSelected
                      ? 'bg-[#FAF6FD] shadow-xs'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Left Indicator for active item */}
                  {isSelected && (
                    <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-[#7C3AED]" />
                  )}

                  {/* Avatar with Online Dot */}
                  <div className="relative shrink-0">
                    <img
                      src={conv.avatarUrl}
                      alt={conv.mentorName}
                      className="size-10 rounded-full object-cover ring-2 ring-white"
                    />
                    {conv.isOnline && (
                      <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-[#22C55E] ring-2 ring-white" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="truncate text-xs font-bold text-slate-900 leading-tight">
                        {conv.mentorName}
                      </h3>
                      <span className="text-[10px] font-medium text-slate-400 shrink-0">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-1 text-[11px] font-normal text-slate-500 leading-tight">
                      "{conv.lastMessage}"
                    </p>

                    {/* Tags */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {conv.tags.map((tag, idx) => (
                        <span
                          key={tag}
                          className={`rounded-md px-2 py-0.5 text-[9.5px] font-semibold leading-none ${
                            idx === 0
                              ? 'bg-purple-100/60 text-[#6B21A8]'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="mt-auto flex items-center justify-between border-t border-slate-100 px-4 py-3 text-[10.5px] text-slate-400">
            <span>Direct Student → Mentor messaging</span>
            <ShieldCheck size={14} className="text-purple-600/70" />
          </div>
        </section>

        {/* ================= COLUMN 2: ACTIVE CHAT CONVERSATION ================= */}
        <section className="flex flex-1 flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <img
                src={activeConversation.avatarUrl}
                alt={activeConversation.mentorName}
                className="size-9 rounded-full object-cover ring-2 ring-purple-100"
              />
              <div>
                <h2 className="text-sm font-bold leading-tight text-slate-900">
                  {activeConversation.mentorName}
                </h2>
                <p className="text-[11px] font-normal leading-tight text-slate-400 mt-0.5">
                  {activeConversation.mentorRole}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Session Button/Badge */}
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-xl border border-purple-100 bg-[#F5EEFB] px-3 py-1.5 text-xs font-semibold text-[#7C3AED] transition hover:bg-[#EDE1F7]"
              >
                <Calendar size={13} strokeWidth={2} />
                <span>Session Wed • 4:30 PM</span>
              </button>

              <button
                type="button"
                className="p-1 text-slate-400 transition hover:text-slate-600"
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Date Separator */}
            <div className="flex justify-center">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10.5px] font-semibold text-slate-400 shadow-2xs">
                Today • Oct 23
              </span>
            </div>

            {/* Render Messages */}
            {activeConversation.messages.map((msg) => {
              const isMentor = msg.sender === 'mentor';

              if (isMentor) {
                return (
                  <div key={msg.id} className="flex items-start gap-2.5">
                    <img
                      src={activeConversation.avatarUrl}
                      alt={activeConversation.mentorName}
                      className="size-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="max-w-[70%]">
                      <div className="rounded-2xl rounded-tl-xs border border-slate-100 bg-white p-3.5 text-xs font-normal leading-relaxed text-slate-700 shadow-sm">
                        {msg.text}
                      </div>
                      <span className="mt-1 block text-[10px] text-slate-400 px-1">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              }

              // Student message (Right aligned, dark purple)
              return (
                <div key={msg.id} className="flex flex-col items-end">
                  <div className="max-w-[70%]">
                    <div className="rounded-2xl rounded-tr-xs bg-[#2D0643] p-3.5 text-xs font-normal leading-relaxed text-white shadow-md">
                      {msg.text}
                    </div>
                    <div className="mt-1 flex items-center justify-end gap-1 px-1 text-[10px] text-slate-400">
                      <span>{msg.time}</span>
                      {msg.read ? (
                        <CheckCheck size={12} className="text-purple-600" />
                      ) : (
                        <Check size={12} className="text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 pt-2">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2 rounded-full border border-slate-200/90 bg-white p-1.5 pl-4 shadow-sm focus-within:border-purple-300"
            >
              <button
                type="button"
                className="text-slate-400 transition hover:text-slate-600"
                title="Attach file"
              >
                <Paperclip size={17} />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none"
              />

              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-full bg-[#2D0643] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#430963]"
              >
                <span>Send</span>
                <Send size={13} strokeWidth={2.2} />
              </button>
            </form>
          </div>
        </section>

        {/* ================= COLUMN 3: MENTOR PROFILE & SESSION SIDEBAR ================= */}
        <section className="flex w-[275px] shrink-0 flex-col items-center overflow-y-auto rounded-[24px] border border-slate-100 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {/* Avatar with Online Ring */}
          <div className="relative mt-2">
            <img
              src={activeConversation.avatarUrl}
              alt={activeConversation.mentorName}
              className="size-20 rounded-full object-cover ring-4 ring-purple-50 shadow-sm"
            />
            {activeConversation.isOnline && (
              <span className="absolute bottom-1 right-1 size-3.5 rounded-full bg-[#22C55E] ring-2 ring-white" />
            )}
          </div>

          {/* Name & Title */}
          <h3 className="mt-3 text-sm font-bold text-slate-900 leading-tight">
            {activeConversation.mentorName}
          </h3>
          <p className="mt-0.5 text-center text-xs font-normal text-slate-400">
            {activeConversation.mentorRole}
          </p>

          {/* Track Tag */}
          <span className="mt-2.5 rounded-lg bg-[#F5EEFB] px-3 py-1 text-[11px] font-semibold text-[#7C3AED]">
            {activeConversation.mentorTrack}
          </span>

          {/* Upcoming Session Card */}
          <div className="mt-7 w-full rounded-2xl border border-purple-100/80 bg-gradient-to-b from-purple-50/30 to-transparent p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.16em] text-purple-700 uppercase">
                UPCOMING SESSION
              </span>
              <span className="size-2 rounded-full bg-[#7C3AED] shadow-[0_0_6px_#7C3AED]" />
            </div>

            <p className="mt-2 text-xs font-bold text-slate-900">
              {activeConversation.upcomingSession?.date || 'Wednesday, Oct 25'}
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-slate-400">
              {activeConversation.upcomingSession?.time || '4:30 PM – 5:15 PM'}
            </p>

            {/* View Session Button */}
            <button
              type="button"
              className="mt-4 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-[#2D0643] text-xs font-semibold text-white shadow-xs transition hover:bg-[#430963]"
            >
              <ExternalLink size={13} />
              <span>View Session</span>
            </button>

            {/* View Mentor Profile Button */}
            <button
              type="button"
              className="mt-2 flex h-10 w-full items-center justify-center rounded-xl border border-slate-200/90 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            >
              View Mentor Profile
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
