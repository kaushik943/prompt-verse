import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Copy, Check, Search, Sparkles, LayoutGrid, Info, ArrowRight, Zap, Globe, Shield, X, Maximize2, Sun, Moon, Plus, Upload, Loader2, ChevronLeft } from 'lucide-react';
// Replace this URL with your deployed Google Apps Script Web App URL
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxwB2P5dDIRcZ6mcC8NWsFDK2b794siC-PyuyxwZvalptzOtveIogPH5kf1byk4AKlzww/exec";

const cleanImageUrl = (url: string) => {
  if (!url) return '';
  // If it's a srcset-style string (contains spaces and commas), take the highest resolution or just the first clean URL
  if (url.includes(',') && url.includes(' ')) {
    const parts = url.split(',').map(p => p.trim());
    const lastPart = parts[parts.length - 1]; // Assume the last one is highest res
    return lastPart.split(' ')[0];
  }
  return url.trim();
};

interface Prompt {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string;
  category: string;
}

interface PromptCardProps {
  item: Prompt;
  onClick: (item: Prompt) => void;
  key?: string | number;
}

const Loader = () => (
  <motion.div
    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
    exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative"
    >
      <div className="w-24 h-24 border-2 border-white/20 rounded-full animate-spin-slow" />
      <Sparkles className="w-10 h-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </motion.div>
    <motion.div
      className="mt-12 h-[1px] w-64 bg-zinc-800 overflow-hidden"
    >
      <motion.div
        className="h-full bg-white"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-6 text-zinc-500 font-black text-[10px] tracking-[0.5em] uppercase italic"
    >
      PromptVerse / Visionary Engine
    </motion.p>
  </motion.div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const textRevealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const PromptCard = ({ item, onClick }: PromptCardProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{
        y: -10,
        scale: 1.02,
        transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
      }}
      className="group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
      id={`prompt-card-${item.id}`}
      onClick={() => onClick(item)}
    >
      <div className="aspect-[4/5] overflow-hidden relative">
        <motion.img
          src={cleanImageUrl(item.imageUrl)}
          srcSet={item.imageUrl.includes(',') ? item.imageUrl : undefined}
          alt={item.title}
          whileHover={{ scale: 1.15 }}
          className="w-full h-full object-cover transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <Maximize2 className="w-10 h-10 text-white/50 scale-50 group-hover:scale-100 transition-transform duration-500" />
        </div>

        <div className="absolute top-6 left-6">
          <span className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-white/90 dark:bg-black/90 text-black dark:text-white rounded-full border border-black/10 dark:border-white/10 backdrop-blur-md">
            {item.category}
          </span>
        </div>

        <div className="absolute bottom-6 left-6 right-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
          <button
            onClick={copyToClipboard}
            className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'COPIED' : 'COPY PROMPT'}
          </button>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        <h3 className="text-xl lg:text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-2 lg:mb-3 tracking-tighter uppercase italic group-hover:text-zinc-500 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs lg:text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {item.prompt}
        </p>
      </div>
    </motion.div>
  );
};

const PromptDetailModal = ({ item, onClose }: { item: Prompt | null, onClose: () => void }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [item]);

  const copyToClipboard = () => {
    if (!item) return;
    navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50, rotateX: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50, rotateX: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white dark:bg-zinc-900 w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] rounded-none md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-3 md:p-4 bg-black/50 hover:bg-black text-white rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Left Side: Image */}
            <div className="w-full md:w-3/5 h-[40vh] md:h-full bg-zinc-100 dark:bg-zinc-950 relative overflow-hidden flex items-center justify-center shrink-0">
              {/* Blurred Background */}
              <motion.div
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 0.3, scale: 1.1 }}
                className="absolute inset-0 blur-3xl"
                style={{
                  backgroundImage: `url(${item.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <motion.img
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                src={cleanImageUrl(item.imageUrl)}
                srcSet={item.imageUrl.includes(',') ? item.imageUrl : undefined}
                alt={item.title}
                className="relative z-10 w-full h-full object-contain p-4 md:p-12 drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-20" />
            </div>

            {/* Right Side: Details */}
            <div className="w-full md:w-2/5 h-full p-4 sm:p-6 lg:p-12 overflow-y-auto flex flex-col">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-auto"
              >
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <span className="px-4 py-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full border border-zinc-200 dark:border-zinc-700">
                    {item.category}
                  </span>
                  <div className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-800" />
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-zinc-900 dark:text-white mb-6 md:mb-8 tracking-tighter uppercase italic leading-none">
                  {item.title}
                </h2>

                <div className="space-y-6 md:space-y-8">
                  <div className="p-4 sm:p-6 lg:p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-[1.5rem] md:rounded-[2rem] border border-zinc-100 dark:border-zinc-800 relative group">
                    <div className="absolute -top-3 left-6 md:left-8 px-4 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full">
                      The Prompt
                    </div>
                    <p className="text-sm sm:text-base lg:text-xl text-zinc-600 dark:text-zinc-300 italic leading-relaxed font-medium">
                      "{item.prompt}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Resolution</p>
                      <p className="text-sm font-bold">4K Ultra HD</p>
                    </div>
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Engine</p>
                      <p className="text-sm font-bold">Visionary v4.2</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-12 pt-12 border-t border-zinc-100 dark:border-zinc-800"
              >
                <button
                  onClick={copyToClipboard}
                  className="w-full py-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.02] transition-all active:scale-95 shadow-xl"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  {copied ? 'COPIED TO CLIPBOARD' : 'COPY MASTER PROMPT'}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AboutSection = () => {
  const team = [
    {
      name: "Elias Thorne",
      role: "Lead Neural Architect",
      bio: "Pioneer in multi-modal synthesis and latent space exploration.",
      image: "https://picsum.photos/seed/elias/400/400"
    },
    {
      name: "Sarah Chen",
      role: "Creative Synthesis Director",
      bio: "Award-winning digital artist specializing in human-AI collaborative workflows.",
      image: "https://picsum.photos/seed/sarah/400/400"
    },
    {
      name: "Marcus Vane",
      role: "Prompt Optimization Expert",
      bio: "Expert in linguistic precision and cross-model prompt engineering.",
      image: "https://picsum.photos/seed/marcus/400/400"
    }
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-20 lg:py-40 border-t border-zinc-100 dark:border-zinc-900" id="about">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={textRevealVariants}
          className="space-y-6 lg:space-y-10"
        >
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-zinc-400 block">The Mission</span>
          <h2 className="text-3xl sm:text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">
            Democratizing <br />Intelligence
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg lg:text-xl leading-relaxed max-w-xl">
            PromptVerse was born from a simple realization: the future of art isn't just about algorithms, it's about the language we use to guide them.
            Our mission is to provide a curated, verified, and high-performance repository of creative intelligence for everyone.
          </p>
          <div className="flex items-center gap-6 pt-6">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Guided by <br />Industry Experts
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-square rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 group"
        >
          <img
            src="https://picsum.photos/seed/mission/1200/1200"
            alt="Mission"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-zinc-900/20 group-hover:bg-transparent transition-colors duration-1000" />
          <div className="absolute bottom-6 left-6 right-6 lg:bottom-12 lg:left-12 lg:right-12 p-6 lg:p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] lg:rounded-3xl">
            <p className="text-white text-base lg:text-lg font-medium italic">
              "We don't just collect prompts; we engineer the bridges between human imagination and machine execution."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const AdminPanel = ({ onBack }: { onBack: () => void }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    prompt: '',
    category: 'Sci-Fi',
    imageUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert("Please provide an image link!");
      return;
    }

    setIsUploading(true);
    try {
      // POST to Google Apps Script
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Apps Script requires no-cors for simple POSTs or handle redirects
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // Note: with no-cors we can't read the response, but it typically succeeds if headers are correct
      alert('Prompt signal sent to the Cloud! The sheet will be updated momentarily.');
      onBack();
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error(error);
      alert('An error occurred during communication with the Sheet.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-12 lg:pb-20 px-4 sm:px-6 lg:px-12 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto">
        <motion.button
          onClick={onBack}
          whileHover={{ x: -10 }}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-8 lg:mb-12"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Nexus
        </motion.button>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="flex-1 space-y-8 lg:space-y-12">
            <div>
              <span className="text-[10px] font-black tracking-[0.4em] uppercase text-zinc-400 block mb-4">Admin Engine</span>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none">
                Expand the <br />Promptverse
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Master Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Neon Samurai"
                  className="w-full p-4 lg:p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl lg:rounded-3xl outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all font-medium"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">The Neural Prompt</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your vision in detail..."
                  className="w-full p-4 lg:p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl lg:rounded-3xl outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all font-medium resize-none"
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Classification</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sci-Fi"
                    className="w-full p-4 lg:p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl lg:rounded-3xl outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all font-medium"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Image Link</label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      placeholder="https://example.com/image.jpg"
                      className="w-full p-4 lg:p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl lg:rounded-3xl outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all font-medium"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-5 lg:py-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl lg:rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                {isUploading ? 'SYNTHESIZING...' : 'UPLOAD TO Promptverse'}
              </button>
            </form>
          </div>

          <div className="w-full md:w-80">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-zinc-400 block mb-6">Real-time Preview</span>
            <div className="sticky top-32">
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] lg:rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-4 lg:p-8 space-y-4 lg:space-y-6">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 relative">
                  {formData.imageUrl ? (
                    <img 
                      src={cleanImageUrl(formData.imageUrl)} 
                      srcSet={formData.imageUrl.includes(',') ? formData.imageUrl : undefined}
                      className="w-full h-full object-cover" 
                      alt="Preview" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <Sparkles className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic mb-2 truncate">
                    {formData.title || 'Untitled Vision'}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-3">
                    {formData.prompt || 'Your prompt will appear here...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState<'gallery' | 'admin'>('gallery');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [promptsData, setPromptsData] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [featuredPrompt, setFeaturedPrompt] = useState<Prompt | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const categories = ['All', ...new Set((Array.isArray(promptsData) ? promptsData : []).map(p => p.category).filter(Boolean))];

  useEffect(() => {
    async function loadData() {
      console.log("Initializing Neural Nexus connection...");
      try {
        const response = await fetch(APPS_SCRIPT_URL);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const data = await response.json();
        console.log("Nexus Data Received:", Array.isArray(data) ? `${data.length} prompts` : "Not an array");

        if (Array.isArray(data)) {
          const cleanedData = data.map((p: any) => ({
            ...p,
            category: p.category?.trim() || 'Uncategorized'
          }));
          setPromptsData(cleanedData);
          setFilteredPrompts(cleanedData);
          
          // Featured selection
          if (cleanedData.length > 0) {
            const today = new Date();
            const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
            let hash = 0;
            for (let i = 0; i < dateString.length; i++) {
              const char = dateString.charCodeAt(i);
              hash = ((hash << 5) - hash) + char;
              hash = hash & hash;
            }
            setFeaturedPrompt(cleanedData[Math.abs(hash) % cleanedData.length]);
          }
        } else {
          throw new Error("Invalid data format received from Nexus.");
        }
      } catch (err) {
        console.error("Critical: Failed to sync with Nexus:", err);
        setError("Synchronization failure. The neural link is unstable. Please check your source sheet.");
        // Fallback to empty allow the app to render error state
        setPromptsData([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Simple Routing Logic based on Hash
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('gallery');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Init

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const filtered = promptsData.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.prompt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredPrompts(filtered);
  }, [searchTerm, selectedCategory, promptsData]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden">
      <AnimatePresence>
        {loading && <Loader key="loader" />}
        {!loading && error && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-6 text-center">
            <div className="max-w-md space-y-6">
              <div className="w-20 h-20 border-2 border-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <Info className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">System Breach</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-colors"
              >
                Re-initialize
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      <PromptDetailModal
        item={selectedPrompt}
        onClose={() => setSelectedPrompt(null)}
      />

      <AnimatePresence mode="wait">
        {currentView === 'admin' ? (
          <motion.div
            key="admin"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <AdminPanel onBack={() => window.location.hash = ''} />
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <>
              {/* Navigation */}
              <nav className="fixed top-0 w-full z-50 bg-white/10 dark:bg-black/10 backdrop-blur-xl border-b border-white/10" id="navbar">
                <div className="max-w-[1600px] mx-auto px-4 lg:px-12">
                  <div className="flex items-center justify-between h-16 lg:h-20">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="flex items-center gap-2 lg:gap-3 cursor-pointer shrink-0"
                      onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }}
                    >
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white dark:bg-white rounded-lg lg:rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-black" />
                      </div>
                      <span className="text-xl lg:text-2xl font-black tracking-tighter uppercase italic leading-none text-zinc-900 dark:text-white">PromptVerse</span>
                    </motion.div>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 dark:text-zinc-400">
                      <a href="#gallery" className="hover:text-zinc-900 dark:hover:text-white transition-all hover:tracking-[0.5em]">Explorer</a>
                      <a href="#about" className="hover:text-zinc-900 dark:hover:text-white transition-all hover:tracking-[0.5em]">About</a>
                      <a href="#footer" className="hover:text-zinc-900 dark:hover:text-white transition-all hover:tracking-[0.5em]">Engine</a>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                      <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2 lg:p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg lg:rounded-xl transition-all hover:scale-110 active:scale-95"
                      >
                        {isDarkMode ? <Sun className="w-4 h-4 lg:w-5 lg:h-5" /> : <Moon className="w-4 h-4 lg:w-5 lg:h-5" />}
                      </button>
                      <a
                        href="#gallery"
                        className="hidden sm:flex px-6 lg:px-8 py-2.5 lg:py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95"
                      >
                        Explore
                      </a>
                      <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-zinc-900 dark:text-white"
                      >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <LayoutGrid className="w-6 h-6" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                  {isMobileMenuOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="lg:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden"
                    >
                      <div className="flex flex-col p-6 gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 dark:text-zinc-400">
                        <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-zinc-900 dark:hover:text-white">Explorer</a>
                        <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-zinc-900 dark:hover:text-white">About</a>
                        <a href="#footer" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-zinc-900 dark:hover:text-white">Engine</a>
                        <button
                          onClick={() => { window.location.hash = '#admin'; setIsMobileMenuOpen(false); }}
                          className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl"
                        >
                          Admin Panel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </nav>

              <main className="relative">
                {/* Hero Section - Editorial / Magazine Style */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" id="hero">
                  {/* Background Ambient Effects */}
                  <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-200 dark:bg-zinc-900/50 rounded-full blur-[120px] opacity-50" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-300 dark:bg-zinc-800/30 rounded-full blur-[120px] opacity-30" />
                  </div>

                  <div className="max-w-[1600px] mx-auto px-4 lg:px-12 w-full relative z-10">
                    <div className="flex flex-col items-center text-center mb-12 lg:mb-20">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 mb-6 lg:mb-8 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800"
                      >
                        <Zap className="w-3 h-3 text-zinc-900 dark:text-white" />
                        <span className="text-[8px] lg:text-[9px] font-black tracking-[0.3em] uppercase text-zinc-500 dark:text-zinc-400">
                          The Future of Creative Intelligence
                        </span>
                      </motion.div>

                      <motion.h1
                        style={{ opacity: heroOpacity, scale: heroScale }}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[14vw] sm:text-[12vw] lg:text-[10vw] font-black tracking-[-0.05em] leading-[0.85] uppercase italic mb-8 lg:mb-12"
                      >
                        Visionary <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-900 dark:from-white dark:via-zinc-400 dark:to-white bg-[length:200%_auto] animate-gradient">
                          Creation
                        </span>
                      </motion.h1>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="max-w-2xl mx-auto mb-10 lg:mb-16"
                      >
                        <p className="text-lg lg:text-2xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium mb-10 lg:mb-12 px-4">
                          The world's most advanced repository of AI prompts. <br className="hidden md:block" />
                          Curated by experts, powered by the Promptverse.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6 px-4">
                          <a
                            href="#gallery"
                            className="w-full sm:w-auto px-8 lg:px-12 py-5 lg:py-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl hover:scale-105 transition-all active:scale-95"
                          >
                            Start Exploring <ArrowRight className="w-5 h-5" />
                          </a>
                          <a
                            href="#gallery"
                            className="w-full sm:w-auto px-8 lg:px-12 py-5 lg:py-6 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:scale-105 transition-all active:scale-95"
                          >
                            View Showcase
                          </a>
                        </div>
                      </motion.div>
                    </div>

                    {/* Featured Prompt Showcase - Interactive */}
                    <motion.div
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="relative max-w-5xl mx-auto px-4 sm:px-0"
                    >
                      {featuredPrompt ? (
                        <div
                          className="relative aspect-square sm:aspect-video lg:aspect-[21/9] rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl group cursor-pointer"
                          onClick={() => setSelectedPrompt(featuredPrompt)}
                        >
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={featuredPrompt.id}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            src={cleanImageUrl(featuredPrompt.imageUrl)}
                            srcSet={featuredPrompt.imageUrl.includes(',') ? featuredPrompt.imageUrl : undefined}
                            className="absolute inset-0 w-full h-full object-cover"
                            alt="Featured Art"
                            referrerPolicy="no-referrer"
                          />
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12 flex flex-col md:flex-row items-end justify-between gap-6 lg:gap-8">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={featuredPrompt.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                              className="max-w-xl space-y-3 lg:space-y-4 text-left"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Featured Prompt of the Day</span>
                              </div>
                              <h3 className="text-xl lg:text-4xl font-black text-white tracking-tight uppercase italic leading-none">
                                {featuredPrompt.title}
                              </h3>
                              <p className="text-white/60 text-xs lg:text-base italic line-clamp-2">
                                "{featuredPrompt.prompt}"
                              </p>
                            </motion.div>
                          </AnimatePresence>

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden md:flex flex-col items-center justify-center px-6 py-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl"
                          >
                            <Zap className="w-6 h-6 text-white mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Impact</span>
                            <span className="text-3xl font-black italic">99%</span>
                          </motion.div>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto relative z-10 p-6 lg:p-12 pt-0 md:pt-6" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(featuredPrompt.prompt);
                            }}
                            className="flex-1 md:flex-none px-8 py-4 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all active:scale-95"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Prompt
                          </button>
                        </div>
                      </div>
                      ) : (
                        <div className="relative aspect-square sm:aspect-video lg:aspect-[21/9] rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 animate-pulse flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
                        </div>
                      )}

                      {/* Decorative Floating Badges */}
                      <motion.div
                        animate={{ y: [0, -15, 0], rotate: [5, 8, 5] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-10 -right-10 hidden lg:flex flex-col items-center justify-center w-32 h-32 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800"
                      >
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Quality</span>
                        <span className="text-3xl font-black italic">99%</span>
                      </motion.div>

                      <motion.div
                        animate={{ y: [0, 15, 0], rotate: [-5, -8, -5] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -bottom-10 -left-10 hidden lg:flex flex-col items-center justify-center w-32 h-32 bg-zinc-900 dark:bg-white rounded-3xl shadow-2xl border border-zinc-800 dark:border-zinc-200"
                      >
                        <Zap className="w-8 h-8 text-white dark:text-zinc-900" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Scroll Indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                  >
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-400">Scroll</span>
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-[1px] h-12 bg-gradient-to-b from-zinc-400 to-transparent"
                    />
                  </motion.div>
                </section>

                <div className="relative z-20">
                  <div className="relative flex overflow-x-hidden border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4">
                    <motion.div
                      animate={{ x: ["0%", "-50%"] }}
                      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                      className="flex whitespace-nowrap gap-8 items-center"
                    >
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center gap-8">
                          {promptsData.map((p) => (
                            <div key={`${i}-${p.id}`} className="flex items-center gap-8">
                              <div className="flex items-center gap-4">
                                <img src={cleanImageUrl(p.imageUrl)} className="w-10 h-10 rounded-lg object-cover grayscale hover:grayscale-0 transition-all" alt="" referrerPolicy="no-referrer" />
                                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-400">
                                  {p.title}
                                </span>
                              </div>
                              <Sparkles className="w-4 h-4 text-zinc-200 dark:text-zinc-800" />
                            </div>
                          ))}
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>

                {/* Content Section */}
                <section className="max-w-[1400px] mx-auto px-4 lg:px-12 py-20 lg:py-40" id="gallery">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 lg:mb-32"
                  >
                    <motion.div variants={textRevealVariants} className="max-w-2xl">
                      <span className="text-[10px] font-black tracking-[0.4em] uppercase text-zinc-400 mb-6 block">The Repository</span>
                      <h2 className="text-5xl lg:text-8xl font-black tracking-tighter uppercase italic mb-8 leading-[0.9]">
                        Curated <br />Masterpieces
                      </h2>
                      <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg lg:text-xl leading-relaxed">
                        Our neural network filters the noise to bring you only the most effective prompts.
                        Optimized for Midjourney, DALL-E, and Stable Diffusion.
                      </p>
                    </motion.div>

                    <motion.div variants={textRevealVariants} className="flex flex-col gap-6 w-full lg:w-auto">
                      <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 lg:w-6 lg:h-6 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
                        <input
                          type="text"
                          placeholder="Filter by style..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full lg:w-[400px] pl-14 pr-6 py-4 lg:py-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl lg:rounded-3xl focus:outline-none focus:ring-4 focus:ring-zinc-900/5 dark:focus:ring-white/5 transition-all shadow-xl"
                          id="search-input"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 lg:gap-3">
                        {categories.map((cat) => (
                          <motion.button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-300 ${selectedCategory === cat
                              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent shadow-xl'
                              : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm'
                              }`}
                          >
                            {cat}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>

                  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pb-32">
                    {filteredPrompts.length > 0 ? (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
                      >
                        <AnimatePresence mode="popLayout">
                          {filteredPrompts.map((item) => (
                            <PromptCard key={item.id} item={item} onClick={setSelectedPrompt} />
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 lg:py-60"
                      >
                        <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 rotate-12 shadow-inner">
                          <Info className="w-12 h-12 text-zinc-400" />
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter mb-4 italic">No results found</h3>
                        <p className="text-zinc-500 max-w-sm mx-auto text-sm lg:text-base px-4">The Promptverse is vast, but we couldn't find that specific prompt in our current sector.</p>
                      </motion.div>
                    )}
                  </div>
                </section>

                {/* Features Section - Production Ready */}
                <section className="bg-zinc-900 text-white py-20 lg:py-40 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  </div>
                  <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                      >
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/10 rounded-xl lg:rounded-2xl flex items-center justify-center rotate-6">
                          <Zap className="w-6 h-6 lg:w-8 lg:h-8" />
                        </div>
                        <h4 className="text-2xl lg:text-3xl font-black uppercase italic tracking-tight">Instant Synthesis</h4>
                        <p className="text-zinc-400 text-base lg:text-lg leading-relaxed font-medium">
                          Our proprietary engine allows for instantaneous prompt copying and testing. Speed is our primary directive.
                        </p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                      >
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/10 rounded-xl lg:rounded-2xl flex items-center justify-center -rotate-6">
                          <Shield className="w-6 h-6 lg:w-8 lg:h-8" />
                        </div>
                        <h4 className="text-2xl lg:text-3xl font-black uppercase italic tracking-tight">Neural Verification</h4>
                        <p className="text-zinc-400 text-base lg:text-lg leading-relaxed font-medium">
                          Every entry is verified by our team of expert prompt engineers to ensure 100% reliability across all models.
                        </p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                      >
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/10 rounded-xl lg:rounded-2xl flex items-center justify-center rotate-12">
                          <Globe className="w-6 h-6 lg:w-8 lg:h-8" />
                        </div>
                        <h4 className="text-2xl lg:text-3xl font-black uppercase italic tracking-tight">Cross-Model Ready</h4>
                        <p className="text-zinc-400 text-base lg:text-lg leading-relaxed font-medium">
                          Optimized for the entire generative landscape. From Midjourney v6 to the latest DALL-E iterations.
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </section>

                <AboutSection />
              </main>

              {/* Footer - Production Ready */}
              <footer className="bg-white dark:bg-black py-20 lg:py-32 border-t border-zinc-200 dark:border-zinc-800" id="footer">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                  <div className="flex flex-col lg:flex-row items-start justify-between gap-16 lg:gap-24">
                    <div className="flex flex-col items-start gap-8 lg:gap-10">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center shadow-xl">
                          <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-white dark:text-zinc-900" />
                        </div>
                        <span className="text-2xl lg:text-3xl font-black tracking-tighter uppercase italic">PromptVerse</span>
                      </div>
                      <p className="text-zinc-500 text-base lg:text-lg max-w-sm font-medium leading-relaxed">
                        Redefining the boundaries of human-AI collaboration through the power of curated language.
                      </p>
                      <div className="flex gap-6">
                        <a href="#" className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                          <Globe className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                          <Zap className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                          <Shield className="w-5 h-5" />
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-20 w-full lg:w-auto">
                      <div className="space-y-8">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Engine</h5>
                        <ul className="text-sm space-y-4 font-black uppercase italic tracking-tight">
                          <li><a href="#" className="hover:text-zinc-500 transition-colors">Explorer</a></li>
                          <li><a href="#" className="hover:text-zinc-500 transition-colors">Showcase</a></li>
                          <li><a href="#" className="hover:text-zinc-500 transition-colors">Synthesis</a></li>
                          <li><a href="#" className="hover:text-zinc-500 transition-colors">API</a></li>
                        </ul>
                      </div>
                      <div className="space-y-8">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Nexus</h5>
                        <ul className="text-sm space-y-4 font-black uppercase italic tracking-tight">
                          <li><a href="#about" className="hover:text-zinc-500 transition-colors">About</a></li>
                          <li><a href="#" className="hover:text-zinc-500 transition-colors">Contact</a></li>
                        </ul>
                      </div>
                      <div className="space-y-8 col-span-2 sm:col-span-1">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Social</h5>
                        <ul className="text-sm space-y-4 font-black uppercase italic tracking-tight">
                          <li><a href="#" className="hover:text-zinc-500 transition-colors">Twitter</a></li>
                          <li><a href="#" className="hover:text-zinc-500 transition-colors">Discord</a></li>
                          <li><a href="#" className="hover:text-zinc-500 transition-colors">Instagram</a></li>
                          <li><a href="#" className="hover:text-zinc-500 transition-colors">LinkedIn</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-32 pt-12 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                      © 2026 PromptVerse. Engineered by Visionaries.
                    </p>
                    <div className="flex gap-10 text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                      <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy</a>
                      <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms</a>
                      <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Cookies</a>
                    </div>
                  </div>
                </div>
              </footer>
            </>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
