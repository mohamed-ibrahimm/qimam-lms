'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Paperclip, Check, User, ShieldCheck } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
          loadConversations(data.user);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const loadConversations = async (user: any) => {
    try {
      const res = await fetch('/api/chat');
      const data = await res.json();
      if (user.role === 'ADMIN' || user.role === 'INSTRUCTOR') {
        setConversations(data.conversations || []);
        if (data.conversations?.length > 0) {
          setActiveConvId(data.conversations[0].id);
          loadMessages(data.conversations[0].id);
        }
      } else if (data.conversation) {
        setActiveConvId(data.conversation.id);
        setMessages(data.conversation.messages || []);
      }
    } catch (e) {}
  };

  const loadMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/chat?conversationId=${convId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (e) {}
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConvId || sending) return;

    setSending(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId,
          message: inputMessage.trim(),
        })
      });
      const data = await res.json();
      if (data.message) {
        setMessages([...messages, data.message]);
        setInputMessage('');
      }
    } catch (e) {
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-zinc-400 text-xs">
        جاري تحميل المحادثات...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-3xl bg-surface border border-border overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[75vh] shadow-2xl">
        {/* Conversations Sidebar (For Admins/Instructors) */}
        {(currentUser?.role === 'ADMIN' || currentUser?.role === 'INSTRUCTOR') && (
          <div className="border-l border-border bg-surface-raised/50 overflow-y-auto p-4 space-y-3">
            <h3 className="text-xs font-bold text-white px-2">محادثات الطلاب ({conversations.length})</h3>
            <div className="space-y-1.5">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveConvId(c.id);
                    loadMessages(c.id);
                  }}
                  className={`w-full p-3 rounded-2xl text-right transition-all flex items-center gap-3 ${
                    activeConvId === c.id
                      ? 'bg-primary-950/80 border border-primary-700 text-white'
                      : 'bg-surface-card border border-border/80 text-zinc-300 hover:bg-surface-raised'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-900 border border-primary-700 flex items-center justify-center font-bold text-xs text-white shrink-0">
                    {c.student?.officialFullName?.[0] || 'ط'}
                  </div>
                  <div className="truncate text-xs">
                    <p className="font-bold truncate">{c.student?.officialFullName}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{c.messages?.[0]?.message || 'بدء المحادثة...'}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div
          className={`flex flex-col justify-between h-full bg-surface ${
            currentUser?.role === 'ADMIN' || currentUser?.role === 'INSTRUCTOR'
              ? 'md:col-span-2'
              : 'md:col-span-3'
          }`}
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-primary-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {currentUser?.role === 'STUDENT' ? 'المحادثة المباشرة مع إدارة المنصة والمعلمين' : 'غرفة المحادثة'}
                </h3>
                <p className="text-[10px] text-zinc-400">دعم وإجابة فورية لكافة الاستفسارات</p>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 text-xs">
                لا توجد رسائل سابقة. ابدأ المحادثة الآن! 
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.senderId === currentUser?.id;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col max-w-[80%] ${
                      isMe ? 'mr-auto items-end' : 'ml-auto items-start'
                    }`}
                  >
                    <span className="text-[10px] text-zinc-500 mb-1 px-1">
                      {m.sender?.officialFullName || (isMe ? 'أنت' : 'الطرف الآخر')} • {m.sender?.role === 'ADMIN' ? 'الإدارة' : m.sender?.role === 'INSTRUCTOR' ? 'المعلم' : 'طالب'}
                    </span>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-primary-600 text-white rounded-br-none shadow-md shadow-primary-950/50'
                          : 'bg-surface-raised border border-border text-zinc-200 rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.message}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-surface-raised/40 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 px-4 py-3 rounded-2xl bg-surface border border-border text-white text-xs focus:outline-none focus:border-primary-500"
            />
            <button
              type="submit"
              disabled={sending || !inputMessage.trim()}
              className="px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-primary-900/30"
            >
              <Send className="w-4 h-4" />
              <span>إرسال</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}