"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star, CheckCircle2, XCircle, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner"; // 

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select(`*, products(name)`)
      .order('created_at', { ascending: false });
    
    if (data) setReviews(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', id);

    if (!error) {
      toast.success(`Review ${status}`);
      fetchReviews();
    }
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-10">
      <h1 className="text-5xl font-black text-blue-950 uppercase tracking-tighter">
        Review <span className="text-blue-600">Moderation</span>
      </h1>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Comment</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Rating</th>
              <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-8 py-6 font-black text-blue-950 text-sm">
                  {review.customer_name}
                  {review.is_verified_purchase && <span className="block text-[9px] text-green-600 uppercase font-black tracking-widest mt-1">Verified</span>}
                </td>
                <td className="px-8 py-6 text-sm text-gray-500 max-w-sm">{review.comment}</td>
                <td className="px-8 py-6">
                   <div className="flex gap-1 text-blue-600">
                     {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                   </div>
                </td>
                <td className="px-8 py-6 text-right space-x-2">
                  {review.status === 'pending' && (
                    <button onClick={() => updateStatus(review.id, 'published')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                  <button onClick={() => updateStatus(review.id, 'spam')} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                    <XCircle size={18} />
                  </button>
                  <button className="p-2 text-gray-300 hover:text-red-600 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}