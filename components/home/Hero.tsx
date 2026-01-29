export default function Hero() {
  return (
    <div className="flex flex-col gap-8 items-center pt-16 pb-8 text-center px-4">
      <div className="bg-gold-500/10 text-gold-700 px-4 py-1 rounded-full text-sm font-semibold border border-gold-200">
        #1 Trusted Beard Solution in Ghana [cite: 31]
      </div>
      <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-blue-900 max-w-3xl">
        Grow the Beard You’ve Always Wanted
      </h1>
      <p className="text-lg lg:text-xl text-gray-600 max-w-2xl">
        Original Kirkland Minoxidil with clear guidance and local support. 
        No more patchy beards—just real results[cite: 21, 28].
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <a href="#shop" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold transition-all">
          Shop Minoxidil Kits
        </a>
        <a href="/how-it-works" className="border border-gray-300 px-8 py-4 rounded-lg font-bold hover:bg-gray-50 transition-all">
          How It Works [cite: 43]
        </a>
      </div>
    </div>
  );
}