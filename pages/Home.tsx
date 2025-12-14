import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, MapPin, Users, Calendar, ShieldCheck, BookOpen, Globe, Sparkles, X, TrendingUp, Share2, Scroll, Lightbulb, Fingerprint } from 'lucide-react';

const Home: React.FC = () => {
  const [timeState, setTimeState] = useState<'dawn' | 'day' | 'dusk' | 'night'>('day');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false); // The Hidden Layer State
  const [characterClicks, setCharacterClicks] = useState(0); // For secret item
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  
  // Mouse position tracking for canvas and parallax
  const mouseRef = useRef({ x: 0, y: 0 });

  const triggerCollect = (item: { id: string; name: string; icon: string; description: string }) => {
    const event = new CustomEvent('collect-item', { detail: item });
    window.dispatchEvent(event);
  };

  const handleLanternToggle = () => {
    const newState = !isRevealed;
    setIsRevealed(newState);
    if (newState) {
      triggerCollect({
        id: 'item-basirat',
        name: 'نور بصیرت',
        icon: 'lantern',
        description: 'شما با روشن کردن فانوس، حقیقت پنهان را دیدید. بصیرت قطب‌نمای مسیر حق است.'
      });
    }
  };

  const handleCharacterClick = () => {
    const newCount = characterClicks + 1;
    setCharacterClicks(newCount);
    if (newCount === 5) {
      triggerCollect({
        id: 'item-morgh',
        name: 'مرغ سحر (بیداری)',
        icon: 'rooster',
        description: 'ناله مرغ سحر... شما بیدار شدید! این نماد هوشیاری در برابر غفلت است.'
      });
    }
  };

  const handleOrbClick = () => {
    triggerCollect({
      id: 'item-plaque',
      name: 'پلاک سوخته',
      icon: 'plaque',
      description: 'یادگاری از شهدا. پلاک‌شان گم شد تا نام‌شان جاودانه بماند.'
    });
  };

  // Time of Day Logic
  useEffect(() => {
    const updateTime = () => {
      const h = new Date().getHours();
      if (h >= 5 && h < 8) setTimeState('dawn');
      else if (h >= 8 && h < 17) setTimeState('day');
      else if (h >= 17 && h < 20) setTimeState('dusk');
      else setTimeState('night');
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Canvas Animation Logic (The "Living Brick/Book Wall" + Wisdom Words)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Configuration based on Time State
    const getThemeColors = () => {
      if (isRevealed) return ['#fbbf24', '#d97706', '#92400e']; // Golden/Hidden Theme
      switch(timeState) {
        case 'dawn': return ['#fdba74', '#fb923c', '#ea580c']; // Oranges
        case 'day': return ['#7dd3fc', '#38bdf8', '#0284c7']; // Sky Blues
        case 'dusk': return ['#c4b5fd', '#818cf8', '#4f46e5']; // Indigos
        case 'night': default: return ['#cbd5e1', '#64748b', '#334155']; // Slates
      }
    };
    
    const colors = getThemeColors();
    const bgColor = isRevealed ? '#2a1b0a' : (timeState === 'night' ? '#0f172a' : timeState === 'dusk' ? '#1e1b4b' : timeState === 'dawn' ? '#431407' : '#0c4a6e');

    // Words of Wisdom
    const wisdomWords = ["ایمان", "بصیرت", "علم", "عمل", "تقوا", "شهادت", "صبر", "یقین"];

    // Particle Class representing a "Book", "Brick", or "Word"
    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      baseSize: number;
      color: string;
      density: number;
      isWord: boolean;
      word: string;

      constructor(x: number, y: number, size: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.baseSize = size;
        this.size = size;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.density = (Math.random() * 30) + 1;
        
        // 5% chance to be a Word Particle
        this.isWord = Math.random() < 0.05;
        this.word = wisdomWords[Math.floor(Math.random() * wisdomWords.length)];
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        
        if (this.isWord && isRevealed) {
          ctx.font = `bold ${this.size / 2}px Vazirmatn`;
          ctx.textAlign = 'center';
          ctx.fillText(this.word, this.x, this.y);
        } else {
          ctx.beginPath();
          // Drawing a rounded rectangle (book spine shape)
          ctx.roundRect(this.x, this.y, this.size, this.size * 1.5, 4);
          ctx.fill();
          
          // Add a "spine" detail
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.fillRect(this.x + 2, this.y + 2, 2, this.size * 1.5 - 4);
        }
      }

      update() {
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = 250; // Interaction radius
        
        // Calculate force: closer = stronger repulsion/attraction
        const force = (maxDistance - distance) / maxDistance;
        
        if (distance < maxDistance) {
          // "Flip" or "Move" effect
          const directionX = forceDirectionX * force * this.density;
          const directionY = forceDirectionY * force * this.density;
          
          this.x -= directionX;
          this.y -= directionY;
          
          // Scale up effect
          this.size = this.baseSize + (force * 10);
        } else {
          // Return to original position
          if (this.x !== this.baseX) {
            const dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            const dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
          if (this.size !== this.baseSize) {
             const ds = this.size - this.baseSize;
             this.size -= ds / 10;
          }
        }
      }
    }

    const init = () => {
      particles = [];
      const particleSize = 30; // Size of each brick/book
      const gap = 15;
      
      for (let y = 0; y < canvas.height; y += (particleSize * 1.5 + gap)) {
        for (let x = 0; x < canvas.width; x += (particleSize + gap)) {
          particles.push(new Particle(x, y, particleSize));
        }
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    // Handle Resize
    const handleResize = () => {
      canvas.width = containerRef.current?.offsetWidth || window.innerWidth;
      canvas.height = containerRef.current?.offsetHeight || 800;
      init();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [timeState, isRevealed]); // Re-run when theme changes or Revealed state changes

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const getHeroText = () => {
     if (isRevealed) return "اسرار هویدا";
     switch(timeState) {
        case 'night': return 'نور در تاریکی';
        case 'dawn': return 'طلوع دانایی';
        case 'dusk': return 'آرامش اندیشه';
        default: return 'اوج بصیرت';
     }
  };

  const openModal = (id: string) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  // Modal Content Renderer
  const renderModalContent = () => {
    switch (activeModal) {
      case 'credits':
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <TrendingUp className="text-green-600 w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-800">رشد نمایی نمرات</h3>
            
            {/* Chart Graphic */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 relative overflow-hidden h-48 flex items-end justify-center gap-2">
               {/* Character pointing */}
               <div className="absolute left-2 bottom-0 w-24 h-32 z-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                     <circle cx="50" cy="30" r="20" fill="#fbbf24" /> {/* Head */}
                     <path d="M50 50 L50 100" stroke="#374151" strokeWidth="20" /> {/* Body */}
                     <path d="M50 60 L80 30" stroke="#374151" strokeWidth="8" strokeLinecap="round" /> {/* Arm pointing up */}
                     <circle cx="45" cy="25" r="2" fill="black"/>
                     <circle cx="55" cy="25" r="2" fill="black"/>
                     <path d="M40 35 Q50 45 60 35" fill="none" stroke="black" strokeWidth="2" />
                  </svg>
               </div>
               
               {/* Bars */}
               <div className="w-8 bg-green-200 h-[20%] rounded-t-lg"></div>
               <div className="w-8 bg-green-300 h-[40%] rounded-t-lg"></div>
               <div className="w-8 bg-green-400 h-[60%] rounded-t-lg"></div>
               <div className="w-8 bg-green-500 h-[80%] rounded-t-lg"></div>
               <div className="w-8 bg-green-600 h-[95%] rounded-t-lg shadow-[0_0_15px_rgba(22,163,74,0.5)]"></div>
               
               {/* Line */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <polyline points="80,150 120,120 160,90 200,60 240,20" fill="none" stroke="#dc2626" strokeWidth="3" strokeDasharray="5,5" />
               </svg>
            </div>

            <p className="text-gray-600 leading-relaxed">
              توی این دوره قراره رشد کنیم... درست مثل بورس! اما اینجا سود شما نمره‌های درخشان و معنویت ماندگار است. ۴ نمره درسی کسر از دروس معارف، سرمایه‌گذاری مطمئن برای معدل شما.
            </p>
          </div>
        );
      
      case 'networking':
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto relative overflow-hidden">
               {/* Spider Web Graphic */}
               <svg viewBox="0 0 100 100" className="absolute inset-0 opacity-20">
                  <path d="M50 50 L0 0 M50 50 L100 0 M50 50 L0 100 M50 50 L100 100 M50 50 L50 0 M50 50 L50 100 M50 50 L0 50 M50 50 L100 50" stroke="black" strokeWidth="1" />
                  <circle cx="50" cy="50" r="10" fill="none" stroke="black" />
                  <circle cx="50" cy="50" r="20" fill="none" stroke="black" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="black" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="black" />
               </svg>
               <Share2 className="text-blue-600 w-10 h-10 relative z-10" />
            </div>
            
            <h3 className="text-2xl font-black text-gray-800">شبکه‌سازی قدرتمند</h3>
            
            <div className="bg-gradient-to-br from-red-600 to-blue-800 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
               <div className="absolute top-0 left-0 opacity-20 transform -translate-x-4 -translate-y-4">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <path d="M12 2L2 22h20L12 2z" /> {/* Simplified Spider-man eye shape/mask hint */}
                  </svg>
               </div>
               <div className="relative z-10">
                  <span className="text-5xl block mb-2">🕷️🕸️</span>
                  <p className="font-bold text-lg mb-2">فراتر از مرد عنکبوتی تار بساز!</p>
                  <p className="text-sm text-blue-100 opacity-90">
                    قدرت واقعی در ارتباطات است. اینجا با نخبگان فرهنگی آشنا می‌شوید و تارهایی از دوستی و همکاری می‌بافید که هیچ‌کس نمی‌تواند پاره کند.
                  </p>
               </div>
            </div>
          </div>
        );

      case 'pilgrimage':
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="text-amber-600 w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-gray-800">سفرهای زیارتی</h3>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 hover:scale-105 transition-transform">
                  <div className="h-24 bg-cover bg-center rounded-lg mb-2" style={{backgroundImage: "url('https://picsum.photos/seed/mashhad/200/200')"}}></div>
                  <h4 className="font-bold text-amber-800">مشهد مقدس</h4>
                  <p className="text-xs text-amber-600">صحن انقلاب، نیمه شب...</p>
               </div>
               <div className="bg-green-50 p-4 rounded-xl border border-green-200 hover:scale-105 transition-transform">
                  <div className="h-24 bg-cover bg-center rounded-lg mb-2" style={{backgroundImage: "url('https://picsum.photos/seed/karbala/200/200')"}}></div>
                  <h4 className="font-bold text-green-800">کربلای معلی</h4>
                  <p className="text-xs text-green-600">بین الحرمین، غروب جمعه...</p>
               </div>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm">
               اردوهایی که فقط سفر نیستند؛ پرواز روح‌اند. خاطرات قدم زدن در صحن‌ها، چای روضه، و حال و هوایی که هیچ‌کجا پیدا نمی‌شود. قم، مشهد، و شاید کربلا...
            </p>
          </div>
        );

      case 'certificate':
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <Scroll className="text-purple-600 w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-800">گواهی معتبر</h3>
            
            <div className="bg-white border-4 border-double border-gray-300 p-8 rounded-lg shadow-inner relative mx-auto max-w-xs transform rotate-2 hover:rotate-0 transition-transform">
               <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-yellow-400"></div>
               <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-yellow-400"></div>
               <div className="absolute bottom-2 left-2 w-4 h-4 rounded-full bg-yellow-400"></div>
               <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-yellow-400"></div>
               
               <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 text-gray-800">
                     <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                  </div>
                  <h4 className="font-serif font-bold text-lg mb-1">گواهی پایان دوره</h4>
                  <div className="h-0.5 w-full bg-gray-200 my-2"></div>
                  <p className="text-xs text-gray-500 font-mono">CODE: HM-1403</p>
               </div>
            </div>

            <p className="text-purple-700 font-bold text-lg px-4 bg-purple-50 py-2 rounded-lg border border-purple-100">
              "با این گواهینامه می‌تونید این دنیا و اون دنیا تو رو بسازید"
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-20 pb-20 bg-slate-50 relative transition-colors duration-1000">
      
      {/* Hero Section: Interactive Library/Wall */}
      <section 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full min-h-[750px] overflow-hidden rounded-b-[4rem] shadow-2xl group cursor-crosshair"
      >
        {/* Canvas Background */}
        <canvas 
           ref={canvasRef} 
           className="absolute inset-0 z-0 opacity-80"
        />
        
        {/* Gradient Overlay for Text Readability */}
        <div className={`absolute inset-0 bg-gradient-to-r ${isRevealed ? 'from-amber-900/90 to-black/80' : timeState === 'day' ? 'from-blue-900/80 to-transparent' : 'from-black/80 to-transparent'} z-0 pointer-events-none transition-colors duration-1000`}></div>

        {/* Floating Particles/Dust */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping opacity-20"></div>
           <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-white rounded-full animate-pulse opacity-10"></div>
           <div className="absolute bottom-10 left-1/2 w-1 h-1 bg-white rounded-full animate-bounce opacity-30"></div>
        </div>

        {/* --- HIDDEN LAYER ELEMENTS (Wisdom & Memory) --- */}
        <div className={`absolute inset-0 z-1 pointer-events-none transition-opacity duration-1000 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
           
           {/* The Hidden Character (The Guide) - Vector Silhouette */}
           <div className="absolute left-[10%] bottom-0 w-[400px] h-[600px] opacity-20 transform scale-110 origin-bottom">
              <svg viewBox="0 0 200 300" className="w-full h-full text-amber-500 fill-current filter drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                 <path d="M100 20 C80 20 70 40 70 60 L70 90 L40 120 L40 250 L160 250 L160 120 L130 90 L130 60 C130 40 120 20 100 20 Z" />
                 <circle cx="100" cy="50" r="15" opacity="0.5" />
                 <rect x="90" y="80" width="20" height="150" opacity="0.3" />
                 {/* Cane */}
                 <rect x="150" y="100" width="5" height="150" />
              </svg>
           </div>

           {/* Memory Orbs (Interactive Hidden Elements) */}
           {[
             { top: '20%', left: '15%', name: 'شهید چمران' },
             { top: '40%', right: '20%', name: 'شهید آوینی' },
             { top: '70%', left: '30%', name: 'شهید مطهری' }
           ].map((orb, i) => (
             <div 
                key={i}
                onClick={handleOrbClick}
                className="absolute w-12 h-12 rounded-full bg-amber-400/20 blur-xl pointer-events-auto cursor-help group flex items-center justify-center hover:bg-amber-400/50 transition-all duration-500"
                style={{ top: orb.top, left: orb.left, right: orb.right }}
             >
                <div className="w-2 h-2 bg-amber-100 rounded-full animate-pulse"></div>
                <span className="absolute -top-8 whitespace-nowrap bg-black/70 text-amber-200 px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {orb.name} (یادمان)
                </span>
             </div>
           ))}
        </div>

        {/* Content Overlay */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24 pb-32 h-full">
          
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-right order-2 lg:order-1 pointer-events-none">
             <div className="flex items-center gap-4">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm font-medium animate-fadeIn shadow-lg">
                    <Globe size={14} className="animate-spin-slow text-orange-300" />
                    <span>{getHeroText()} - طرح ملی حامیم</span>
                </div>
                
                {/* Lantern Toggle Button (Not obvious at first glance - small and transparent) */}
                <button 
                  onClick={handleLanternToggle}
                  className={`pointer-events-auto p-2 rounded-full transition-all duration-500 ${isRevealed ? 'bg-amber-500/20 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'bg-white/5 text-white/30 hover:text-white hover:bg-white/10'}`}
                  title="نور بصیرت"
                >
                  <Lightbulb size={20} />
                </button>
             </div>
             
             <h1 className="text-5xl lg:text-7xl font-black leading-tight drop-shadow-2xl text-white">
                <span className="block text-3xl lg:text-4xl font-light mb-2 opacity-90">پنجمین دوره</span>
                <span className={`text-transparent bg-clip-text filter drop-shadow-lg transition-all duration-1000 ${isRevealed ? 'bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400' : 'bg-gradient-to-r from-orange-200 via-white to-blue-200'}`}>
                  {isRevealed ? 'کشف حقیقت' : 'بصیرت افزایی'}
                </span>
             </h1>
             
             <p className={`text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light drop-shadow-md border-r-4 pr-6 transition-colors duration-1000 ${isRevealed ? 'text-amber-100 border-amber-500' : 'text-blue-50 border-orange-500'}`}>
               {isRevealed 
                 ? "آنچه در نگاه اول پیداست، تنها سایه‌ای از حقیقت است. اینجا حکمت‌ها در میان خطوط پنهان شده‌اند." 
                 : "سفری به اعماق اقیانوس معارف دینی. جایی که آجرهای دانایی، دیوار مستحکم ایمان را می‌سازند."
               }
             </p>

             <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6 pointer-events-auto">
               <Link to="/contact" className={`group px-10 py-4 rounded-2xl font-bold shadow-[0_10px_30px_rgba(234,88,12,0.4)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 text-white ${isRevealed ? 'bg-gradient-to-r from-amber-700 to-yellow-600 hover:from-amber-600 hover:to-yellow-500' : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500'}`}>
                 <span className="relative z-10">شروع ماجراجویی</span>
                 <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
               </Link>
               <Link to="/about" className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                 <BookOpen className="ml-2 w-5 h-5" />
                 سرفصل‌ها
               </Link>
             </div>
          </div>

          {/* 3D Cleric Vector Area */}
          <div className="order-1 lg:order-2 flex justify-center relative perspective-1000 pointer-events-auto">
             <div 
               onClick={handleCharacterClick}
               className="relative w-[350px] h-[350px] lg:w-[550px] lg:h-[550px] animate-float transition-transform duration-100 ease-out hover:scale-105 cursor-pointer"
             >
                
                {/* Back Glow/Portal Effect */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr blur-3xl rounded-full animate-pulse transition-colors duration-1000 ${isRevealed ? 'from-amber-500/40 to-yellow-500/40' : timeState === 'day' ? 'from-blue-500/30 to-cyan-500/30' : 'from-purple-500/30 to-orange-500/30'}`}></div>
                
                {/* The "Vector" Image */}
                <img 
                  src="https://picsum.photos/seed/cleric3dvector/800/800" 
                  alt="3D Vector illustration of a friendly Cleric"
                  className={`w-full h-full object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-10 relative transition-all duration-1000 ${isRevealed ? 'grayscale opacity-80' : ''}`}
                  style={{
                    filter: isRevealed ? 'sepia(1) contrast(1.2)' : 'contrast(1.1) saturate(1.1)',
                    maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                  }}
                />
                
                {/* Floating Elements around the Cleric */}
                <div className="absolute top-10 right-10 bg-white/20 backdrop-blur-xl border border-white/30 p-3 rounded-2xl shadow-xl animate-bounce z-20">
                   <Sparkles className="text-yellow-300 w-8 h-8 filter drop-shadow-lg" />
                </div>
                <div className="absolute bottom-32 -left-4 bg-white/20 backdrop-blur-xl border border-white/30 p-4 rounded-2xl shadow-xl animate-pulse z-20 delay-700">
                   {isRevealed ? <Fingerprint className="text-amber-300 w-10 h-10" /> : <ShieldCheck className="text-green-300 w-10 h-10 filter drop-shadow-lg" />}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid (Content below) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 z-20">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-8 md:p-12">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-800 mb-4">چرا این دوره متفاوت است؟</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full"></div>
            <p className="text-gray-400 text-sm mt-2">برای مشاهده جزئیات روی موارد زیر کلیک کنید</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: 'credits', icon: <Award className="w-10 h-10 text-orange-500" />, title: "۴ نمره درسی", desc: "کسر از دروس معارف اسلامی" },
              { id: 'networking', icon: <Users className="w-10 h-10 text-blue-500" />, title: "شبکه‌سازی", desc: "آشنایی با دانشجویان نخبه" },
              { id: 'pilgrimage', icon: <MapPin className="w-10 h-10 text-green-500" />, title: "اردوی زیارتی", desc: "سفر به مشهد مقدس یا کربلا" },
              { id: 'certificate', icon: <Calendar className="w-10 h-10 text-purple-500" />, title: "گواهی معتبر", desc: "رزومه فرهنگی دانشگاهی" },
            ].map((item) => (
              <div 
                key={item.id} 
                onClick={() => openModal(item.id)}
                className="group p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer active:scale-95"
              >
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow mx-auto">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL OVERLAY */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={closeModal}>
          <div 
            className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 shadow-2xl relative animate-slideUp border-4 border-white/50" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
            
            {renderModalContent()}

          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-[#1e1b4b] rounded-[3rem] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-2xl group">
           {/* Animated Background in CTA */}
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.2),transparent_70%)] group-hover:scale-110 transition-transform duration-700"></div>
           
           <div className="relative z-10 text-center md:text-right mb-8 md:mb-0 max-w-lg">
             <h3 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">هنوز مردد هستید؟ <br/> <span className="text-orange-400">ظرفیت رو به اتمام است!</span></h3>
             <p className="text-blue-200 mb-8 text-lg">فقط تا ۵ آذر ماه فرصت دارید تا به جمع نخبگان فرهنگی دانشگاه بپیوندید.</p>
             
             {/* Countdown */}
             <div className="flex items-center justify-center md:justify-start gap-6">
                <div className="text-center">
                   <div className="text-4xl font-black text-white bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 mb-2">۰۵</div>
                   <span className="text-sm text-blue-300">روز</span>
                </div>
                <div className="text-2xl text-white/50 font-bold">:</div>
                <div className="text-center">
                   <div className="text-4xl font-black text-white bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 mb-2">۱۲</div>
                   <span className="text-sm text-blue-300">ساعت</span>
                </div>
             </div>
           </div>

           <div className="relative z-10">
              <button 
                 onClick={() => window.location.hash = '#/contact'}
                 className="bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold px-12 py-6 rounded-2xl shadow-[0_20px_50px_rgba(249,115,22,0.3)] transition-transform active:scale-95 flex items-center gap-4 hover:gap-6"
              >
                ثبت نام نهایی
                <ArrowLeft />
              </button>
           </div>
        </div>
      </section>

    </div>
  );
};

export default Home;