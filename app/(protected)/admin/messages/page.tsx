"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Clock, CheckCircle, Trash2, Reply, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReply = (msg: any) => {
    const subject = encodeURIComponent(`Re: ${msg.subject} - ManeF/x Support`);
    const body = encodeURIComponent(
      `Hello ${msg.full_name},\n\nThank you for reaching out to ManeF/x. regarding your inquiry: "${msg.subject}".\n\n[Type your response here]\n\nBest regards,\nReginald Osei Gyasi\nManeF/x Inc. Ghana`
    );
    
    // Opens default email app
    window.location.href = `mailto:${msg.email}?subject=${subject}&body=${body}`;
    
    // Mark as read automatically when replying
    markAsRead(msg.id);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ status: 'read' })
      .eq("id", id);

    if (!error) {
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
    }
  };

  const deleteMessage = async (id: string) => {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (!error) {
      setMessages(messages.filter(m => m.id !== id));
      toast.success("Message deleted");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-blue-900 uppercase tracking-tighter">
          Customer <span className="text-blue-600">Inquiries</span>
        </h1>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          {messages.filter(m => m.status === 'unread').length} New Messages
        </p>
      </header>

      <div className="grid gap-6">
        {messages.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-bold uppercase text-xs">Your inbox is empty</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`group bg-white border ${msg.status === 'unread' ? 'border-blue-100 shadow-md' : 'border-gray-100'} p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between gap-6 hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex-grow space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    msg.status === 'unread' ? 'bg-blue-600 text-white animate-pulse' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {msg.status}
                  </span>
                  <h3 className="font-black text-blue-950 uppercase text-lg">{msg.subject}</h3>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl italic text-gray-600 text-sm leading-relaxed relative">
                  "{msg.message}"
                  <div className="absolute -top-2 -left-2 text-blue-200">
                    <Mail size={24} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2 text-blue-900"><Mail size={14}/> {msg.email}</span>
                  <span className="flex items-center gap-2"><Clock size={14}/> {new Date(msg.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-2 text-gray-900">From: {msg.full_name}</span>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col justify-end gap-3 min-w-fit">
                <button 
                  onClick={() => handleReply(msg)}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-50"
                >
                  <Reply size={16} /> Reply
                </button>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => markAsRead(msg.id)}
                    title="Mark as Read"
                    className="flex-1 p-4 bg-gray-50 text-gray-400 hover:text-emerald-500 rounded-2xl transition-all border border-transparent hover:border-emerald-100"
                  >
                    <CheckCircle size={20} />
                  </button>
                  <button 
                    onClick={() => deleteMessage(msg.id)}
                    title="Delete Message"
                    className="flex-1 p-4 bg-gray-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all border border-transparent hover:border-red-100"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}