"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle, Plus, X, Loader2, Quote } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Fetch Reviews
  useEffect(() => {
    async function fetchReviews() {
      const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (data) setReviews(data);
      setLoading(false);
    }
    fetchReviews();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <section className="bg-blue-900 py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Real Results</h1>
        <p className="text-blue-100 font-medium max-w-xl mx-auto">
          See why 1,000+ men across Ghana trust ManeF/x for their beard growth journey.
        </p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-8 bg-gold-500 text-blue-950 px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl"
        >
          Submit Your Story
        </button>
      </section>

      {/* Reviews Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin text-blue-900 w-10 h-10" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                key={review.id} 
                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative group"
              >
                <Quote className="absolute top-6 right-8 text-blue-50 w-12 h-12 -z-0" />
                <div className="relative z-10">
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 font-medium leading-relaxed mb-6 italic">"{review.comment}"</p>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-blue-900 uppercase text-sm">{review.user_name}</span>
                    {review.verified_purchase && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase bg-green-50 px-2 py-1 rounded-md">
                        <CheckCircle className="w-3 h-3" /> Verified Proof
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ReviewModal onClose={() => setIsModalOpen(false)} onRefresh={() => window.location.reload()} />
        )}
      </AnimatePresence>
    </main>
  );
}

function ReviewModal({ onClose, onRefresh }: { onClose: () => void, onRefresh: () => void }) {
  const [form, setForm] = useState({ user_name: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert([form]);
    if (!error) {
      onRefresh();
    } else {
      alert("Submission error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-blue-950/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400"><X /></button>
        <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tighter mb-2">Share Your Results</h2>
        <p className="text-gray-500 text-sm mb-8 font-medium">How was your experience with ManeF/x?</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            required 
            placeholder="Your Name (e.g., Kwesi A.)" 
            className="w-full bg-gray-50 border-none p-4 rounded-2xl font-bold focus:ring-2 focus:ring-blue-600 outline-none"
            onChange={(e) => setForm({...form, user_name: e.target.value})}
          />
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-400 uppercase">Rating:</span>
            {[1, 2, 3, 4, 5].map((num) => (
              <button 
                key={num} type="button" 
                onClick={() => setForm({...form, rating: num})}
                className={`p-2 rounded-lg transition-all ${form.rating >= num ? 'text-gold-500' : 'text-gray-200'}`}
              >
                <Star className={`w-6 h-6 ${form.rating >= num ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>

          <textarea 
            required 
            placeholder="Tell us about your growth journey..." 
            rows={4}
            className="w-full bg-gray-50 border-none p-4 rounded-2xl font-medium focus:ring-2 focus:ring-blue-600 outline-none"
            onChange={(e) => setForm({...form, comment: e.target.value})}
          />

          <button 
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 flex justify-center items-center gap-2"
          >
            {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Post Review"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}