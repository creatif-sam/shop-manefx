"use client";

import { motion, Variants } from "framer-motion"; // Added Variants type
import { 
  ShoppingBag, 
  Truck, 
  FlaskConical, 
  CheckCircle, 
  MessageSquare, 
  Calendar 
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    title: "Select Your Kit",
    description: "Choose between our Starter, Pro, or 6-Month Supply kits. Every kit features original Kirkland Signature Minoxidil.",
    icon: ShoppingBag,
    color: "bg-blue-100 text-blue-900",
  },
  {
    title: "Fast Local Delivery",
    description: "We dispatch from Accra. Get your kit delivered to your doorstep within 24-48 hours across major cities in Ghana.",
    icon: Truck,
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Verification Proof",
    description: "Scan the QR code on your package to view the batch authenticity certificate. No fakes, just real results.",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Start Your Routine",
    description: "Follow our guided application process. Use the included derma roller twice a week for maximum follicle stimulation.",
    icon: FlaskConical,
    color: "bg-purple-100 text-purple-700",
  },
  {
    title: "Free Expert Support",
    description: "Access our private WhatsApp group for 1-on-1 guidance. Our specialists help you stay consistent.",
    icon: MessageSquare,
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    title: "Track Your Progress",
    description: "Most users see visible vellus hair growth within 4-8 weeks of consistent daily application.",
    icon: Calendar,
    color: "bg-orange-100 text-orange-700",
  },
];

// Explicitly typing as Variants fixes the Vercel build error
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    } 
  },
};

export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-900 py-24 px-6 text-center text-white">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6"
        >
          Your Journey to a <span className="text-amber-500">Full Beard</span>
        </motion.h1>
        <p className="max-w-2xl mx-auto text-blue-100 text-lg md:text-xl font-medium">
          We don't just sell products; we provide a proven system for beard growth 
          specifically for the modern Ghanaian man.
        </p>
      </section>

      {/* Steps Grid */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="relative p-8 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-shadow group"
            >
              <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 transition-transform group-hover:rotate-6`}>
                <step.icon size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-blue-900 uppercase mb-3 tracking-tight">
                {index + 1}. {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Final Reassurance Section */}
      <section className="py-20 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-blue-900 mb-6 uppercase">Ready to start?</h2>
          <p className="text-gray-600 mb-10 text-lg">
            Join thousands of men in Accra, Kumasi, and Takoradi who have transformed 
            their confidence with ManeF/x.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/#shop" 
              className="bg-blue-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Browse All Kits
            </Link>
            <Link 
              href="https://wa.me/233535023614" 
              className="bg-white text-blue-900 border-2 border-blue-900 px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-blue-50 transition-all"
            >
              Chat on WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}