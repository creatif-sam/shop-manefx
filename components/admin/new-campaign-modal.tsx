"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  X, Send, Loader2, Type, AlignLeft, Eye, 
  Layout, Users, Mail, Save, Code, Smartphone, Monitor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function NewCampaignModal({ onClose, onSuccess, subscriberCount }: any) {
  const [step, setStep] = useState<'compose' | 'preview'>('compose');
  const [recipientType, setRecipientType] = useState<'newsletter' | 'custom'>('newsletter');
  const [form, setForm] = useState({ subject: "", content: "", customEmails: "" });
  const [templates, setTemplates] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop');

  const supabase = createClient();

  useEffect(() => {
    async function loadTemplates() {
      const { data } = await supabase.from('mail_templates').select('*');
      if (data) setTemplates(data);
    }
    loadTemplates();
  }, []);

  const applyTemplate = (tpl: any) => {
    setForm({ ...form, subject: tpl.subject, content: tpl.html_content });
    toast.success(`Template "${tpl.name}" applied`);
  };

  const handleDispatch = async () => {
    setSubmitting(true);
    // Logic to send via your Edge Function / Resend API
    setTimeout(() => {
      toast.success("Campaign dispatched successfully!");
      onSuccess();
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-950/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[90vh]"
      >
        {/* MODAL HEADER */}
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-blue-950 uppercase tracking-tight">New Email Campaign</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Powered by Resend Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-blue-600 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* LEFT SIDE: FORM & TEMPLATES */}
          <div className="w-full lg:w-3/5 overflow-y-auto p-8 space-y-8 border-r border-gray-50 scrollbar-hide">
            
            {/* 1. TEMPLATE SELECTOR (Matching your image) */}
            <section className="space-y-3">
              <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest flex items-center gap-2">
                <Layout size={14} /> Load from Template (Optional)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {templates.length > 0 ? templates.map(t => (
                  <button key={t.id} onClick={() => applyTemplate(t)} className="text-left p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group">
                    <p className="font-bold text-blue-950 text-sm group-hover:text-blue-600">{t.name}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">{t.category}</p>
                  </button>
                )) : (
                  <div className="col-span-2 p-4 bg-gray-50 rounded-2xl border border-dashed text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    No custom templates found
                  </div>
                )}
              </div>
            </section>

            {/* 2. SEND TO LOGIC (Matching your tabs) */}
            <section className="space-y-4">
              <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest">Send To</label>
              <div className="flex p-1 bg-gray-50 rounded-2xl">
                <button 
                  onClick={() => setRecipientType('newsletter')}
                  className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", recipientType === 'newsletter' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400")}
                >
                  <Users size={14} className="inline mr-2" /> Newsletter ({subscriberCount})
                </button>
                <button 
                  onClick={() => setRecipientType('custom')}
                  className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", recipientType === 'custom' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400")}
                >
                  <Code size={14} className="inline mr-2" /> Custom List
                </button>
              </div>
              
              {recipientType === 'custom' && (
                <input 
                  placeholder="email1@example.com, email2@example.com"
                  className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-100"
                  value={form.customEmails}
                  onChange={e => setForm({...form, customEmails: e.target.value})}
                />
              )}
            </section>

            {/* 3. CONTENT EDITOR */}
            <section className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest">Subject Line</label>
                <input 
                  value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-blue-950 outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest">HTML Content</label>
                <textarea 
                  rows={10} value={form.content} onChange={e => setForm({...form, content: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-3xl px-6 py-6 font-mono text-xs text-blue-900 outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>
            </section>
          </div>

          {/* RIGHT SIDE: LIVE PREVIEW (Matching the requirement) */}
          <div className="hidden lg:flex w-2/5 bg-gray-50 flex-col">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-2">
                <Eye size={14} /> Live Preview
              </span>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setPreviewMode('desktop')} className={cn("p-1.5 rounded-md", previewMode === 'desktop' ? "bg-white shadow-sm text-blue-600" : "text-gray-400")}><Monitor size={14}/></button>
                <button onClick={() => setPreviewMode('mobile')} className={cn("p-1.5 rounded-md", previewMode === 'mobile' ? "bg-white shadow-sm text-blue-600" : "text-gray-400")}><Smartphone size={14}/></button>
              </div>
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
              <div className={cn(
                "bg-white shadow-2xl transition-all duration-500 overflow-hidden",
                previewMode === 'mobile' ? "w-[320px] h-[580px] rounded-[3rem] border-[8px] border-blue-950" : "w-full h-full rounded-2xl border border-gray-100"
              )}>
                {form.content ? (
                  <iframe 
                    title="Preview" 
                    className="w-full h-full" 
                    srcDoc={`<html><body style="font-family: sans-serif; margin: 0; padding: 20px;">${form.content}</body></html>`} 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-10">
                    <Mail size={48} className="text-gray-100 mb-4" />
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-loose">
                      Compose your message or load a template to see the preview here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-8 bg-white border-t border-gray-50 flex justify-between items-center">
           <button className="text-[10px] font-black uppercase text-gray-400 hover:text-blue-600 flex items-center gap-2">
              <Save size={16} /> Save as Draft
           </button>
           <button 
              onClick={handleDispatch}
              disabled={submitting}
              className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-100 active:scale-95 transition-all"
           >
              {submitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Dispatch Campaign</>}
           </button>
        </div>
      </motion.div>
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');