import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Home, BookOpen, Phone, ChevronLeft, Gamepad2, Layers, Lightbulb, Briefcase, Star, Info } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

interface CollectedItem {
  id: string;
  name: string;
  icon: string; // Storing icon name or emoji for simplicity in local storage
  description: string;
  date: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [collection, setCollection] = useState<CollectedItem[]>([]);
  const [showPassport, setShowPassport] = useState(false);
  const [notification, setNotification] = useState<CollectedItem | null>(null);
  
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'صفحه اصلی', path: '/', icon: <Home size={18} /> },
    { name: 'طرح مطالعاتی', path: '/about', icon: <BookOpen size={18} /> },
    { name: 'محتوای آموزشی', path: '/instructions', icon: <Layers size={18} /> },
    { name: 'مسیر رشد', path: '/game', icon: <Gamepad2 size={18} /> },
    { name: 'ثبت نام و تماس', path: '/contact', icon: <Phone size={18} /> },
  ];

  // Load Collection
  useEffect(() => {
    const saved = localStorage.getItem('hamim_collection');
    if (saved) {
      setCollection(JSON.parse(saved));
    }
  }, []);

  // Listen for Item Collection Events
  useEffect(() => {
    const handleCollect = (e: Event) => {
      const customEvent = e as CustomEvent<CollectedItem>;
      const newItem = customEvent.detail;

      setCollection((prev) => {
        if (prev.some(item => item.id === newItem.id)) return prev; // Already collected
        
        const newCollection = [...prev, { ...newItem, date: new Date().toLocaleDateString('fa-IR') }];
        localStorage.setItem('hamim_collection', JSON.stringify(newCollection));
        
        // Trigger Notification
        setNotification(newItem);
        setTimeout(() => setNotification(null), 4000);
        
        return newCollection;
      });
    };

    window.addEventListener('collect-item', handleCollect);
    return () => window.removeEventListener('collect-item', handleCollect);
  }, []);

  // Hidden Easter Egg: Konami Code Listener
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let cursor = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[cursor]) {
        cursor++;
        if (cursor === konamiCode.length) {
          setShowSecret(true);
          cursor = 0;
        }
      } else {
        cursor = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden font-sans">
      
      {/* Toast Notification for Collection */}
      {notification && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[100] bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-slideUp">
           <div className="text-3xl animate-bounce">{notification.icon === 'lantern' ? '💡' : notification.icon === 'rooster' ? '🐓' : notification.icon === 'heart' ? '❤️' : notification.icon === 'tasbih' ? '📿' : notification.icon === 'plaque' ? 'dogtag' : '🌟'}</div>
           <div>
              <h4 className="font-bold text-yellow-400">آیتم جدید یافت شد!</h4>
              <p className="text-sm text-gray-300">{notification.name} به کوله‌بار شما اضافه شد.</p>
           </div>
        </div>
      )}

      {/* Secret Wisdom Overlay */}
      {showSecret && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-8 animate-fadeIn" onClick={() => setShowSecret(false)}>
           <div className="max-w-2xl text-center space-y-6 text-amber-100 border-4 border-amber-500/50 p-12 rounded-[3rem] bg-gradient-to-br from-amber-900 to-black relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-20"></div>
              <Lightbulb className="w-16 h-16 mx-auto text-amber-400 animate-pulse" />
              <h2 className="text-4xl font-black font-serif">شما راز را یافتید</h2>
              <p className="text-xl leading-loose font-light">
                 "انسان در هر نفسی که می‌کشد، یک قدم به مرگ نزدیک‌تر می‌شود، اما اهل معرفت در هر نفس، یک قدم به خدا نزدیک‌تر می‌شوند."
              </p>
              <div className="pt-4 text-sm opacity-50 font-mono">CODE UNLOCKED: WISDOM_MASTER</div>
           </div>
        </div>
      )}

      {/* Cultural Passport Modal (The Collection) */}
      {showPassport && (
         <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPassport(false)}>
            <div className="bg-[#fdf6e3] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative border-8 border-[#d4c5a0]" onClick={e => e.stopPropagation()}>
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none"></div>
               
               {/* Passport Header */}
               <div className="bg-[#5c4033] text-[#d4c5a0] p-6 flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-3">
                     <div className="bg-[#d4c5a0] text-[#5c4033] p-2 rounded-full"><Briefcase /></div>
                     <h3 className="text-2xl font-bold font-serif">گذرنامه فرهنگی (پشت کارت)</h3>
                  </div>
                  <button onClick={() => setShowPassport(false)} className="hover:text-white"><X /></button>
               </div>

               {/* Passport Body */}
               <div className="p-8 relative z-10">
                  <div className="flex flex-col md:flex-row gap-8">
                     
                     {/* Stats / Info */}
                     <div className="md:w-1/3 border-b md:border-b-0 md:border-l border-[#d4c5a0] pb-6 md:pb-0 md:pl-6 space-y-4 text-center md:text-right">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto md:mx-0 border-4 border-[#5c4033] overflow-hidden mb-4">
                           <div className="w-full h-full bg-[#5c4033]/20 flex items-center justify-center text-[#5c4033]"><Briefcase size={40}/></div>
                        </div>
                        <div>
                           <h4 className="font-bold text-[#5c4033] text-lg">کوله‌بار معرفت</h4>
                           <p className="text-sm text-[#8b7355]">تعداد آیتم‌ها: {collection.length}</p>
                        </div>
                        <p className="text-xs text-[#8b7355] leading-relaxed">
                           این آیتم‌ها نشان‌دهنده مسیر رشد شما در طرح حامیم هستند. با کاوش در بخش‌های مختلف سایت، آیتم‌های مخفی را پیدا کنید.
                        </p>
                     </div>

                     {/* The Grid (Collection) */}
                     <div className="md:w-2/3">
                        <h4 className="font-bold text-[#5c4033] mb-4 flex items-center gap-2"><Star size={16} /> گنجینه یافته شده</h4>
                        {collection.length === 0 ? (
                           <div className="text-center py-10 border-2 border-dashed border-[#d4c5a0] rounded-xl text-[#8b7355]">
                              <p>هنوز آیتمی پیدا نکرده‌اید...</p>
                              <p className="text-xs mt-2">نکته: روی فانوس‌ها، تصاویر و ... کلیک کنید!</p>
                           </div>
                        ) : (
                           <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                              {collection.map(item => (
                                 <div key={item.id} className="group relative">
                                    <div className="aspect-square bg-[#eaddcf] rounded-xl border-2 border-[#d4c5a0] flex flex-col items-center justify-center p-2 hover:bg-[#d4c5a0] transition-colors cursor-help shadow-sm">
                                       <div className="text-3xl mb-1 filter drop-shadow-md transition-transform group-hover:scale-110">
                                          {item.icon === 'lantern' && '💡'}
                                          {item.icon === 'rooster' && '🐓'}
                                          {item.icon === 'heart' && '❤️'}
                                          {item.icon === 'tasbih' && '📿'}
                                          {item.icon === 'plaque' && '🏷️'}
                                          {item.icon === 'book' && '📖'}
                                          {!['lantern','rooster','heart','tasbih','plaque','book'].includes(item.icon) && '🌟'}
                                       </div>
                                       <span className="text-[10px] font-bold text-[#5c4033] text-center truncate w-full">{item.name}</span>
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-[#5c4033] text-[#fdf6e3] text-xs p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center shadow-xl">
                                       <p className="font-bold mb-1 text-yellow-400">{item.name}</p>
                                       <p>{item.description}</p>
                                       <p className="mt-2 text-[9px] opacity-60">{item.date}</p>
                                    </div>
                                 </div>
                              ))}
                              {/* Empty Slots */}
                              {[...Array(Math.max(0, 12 - collection.length))].map((_, i) => (
                                 <div key={i} className="aspect-square bg-[#f0eadd] rounded-xl border border-[#eaddcf] flex items-center justify-center opacity-50">
                                    <div className="w-2 h-2 bg-[#d4c5a0] rounded-full"></div>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo Area */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center text-white shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
                <GraduationCap size={28} />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-blue-900">طرح حامیم</h1>
                <p className="text-xs text-gray-500">دانشگاه صنعتی خاتم الانبیاء بهبهان</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-reverse space-x-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-blue-900 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              
              {/* Collection Button */}
              <button 
                 onClick={() => setShowPassport(true)}
                 className="relative p-2 bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 transition-colors group"
                 title="کوله بار (اینونتوری)"
              >
                 <Briefcase size={20} />
                 {collection.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white animate-bounce">
                       {collection.length}
                    </span>
                 )}
              </button>

              <Link
                to="/contact"
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                ثبت نام کنید
                <ChevronLeft size={16} />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
               <button 
                 onClick={() => setShowPassport(true)}
                 className="relative p-2 bg-amber-100 text-amber-800 rounded-full"
              >
                 <Briefcase size={20} />
                 {collection.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold border border-white">
                       {collection.length}
                    </span>
                 )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-blue-900 focus:outline-none p-2"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-100">
                <Link
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center bg-orange-500 text-white px-4 py-3 rounded-xl font-bold shadow-md active:scale-95 transition-transform"
                >
                  ثبت نام نهایی
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 text-white pt-16 pb-8 relative overflow-hidden">
        {/* Dynamic Intricate Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           
           {/* Layer 1: Animated Rotating Geometric Pattern */}
           <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                 <defs>
                    <pattern id="islamic-star-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                       <g transform="translate(30, 30)">
                          {/* 8-Point Star Geometry */}
                          <rect x="-15" y="-15" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(45)" />
                          <rect x="-15" y="-15" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1" />
                          <circle r="4" fill="currentColor" opacity="0.6" />
                          <path d="M-30 0 L30 0 M0 -30 L0 30" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                       </g>
                       {/* Slow rotation for the pattern itself gives a mesmerizing effect */}
                       <animateTransform attributeName="patternTransform" type="rotate" from="0 0 0" to="360 0 0" dur="240s" repeatCount="indefinite" />
                    </pattern>
                 </defs>
                 <rect width="100%" height="100%" fill="url(#islamic-star-pattern)" />
              </svg>
           </div>

           {/* Layer 2: Floating Particles for Depth */}
           <div className="absolute inset-0">
              <svg width="100%" height="100%">
                 <circle cx="15%" cy="25%" r="2" fill="#fbbf24" opacity="0.4">
                    <animate attributeName="cy" values="25%;20%;25%" dur="8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
                 </circle>
                 <circle cx="85%" cy="75%" r="3" fill="#60a5fa" opacity="0.3">
                    <animate attributeName="cy" values="75%;80%;75%" dur="10s" repeatCount="indefinite" />
                 </circle>
                 <circle cx="50%" cy="50%" r="1" fill="white" opacity="0.5">
                    <animate attributeName="r" values="1;3;1" dur="5s" repeatCount="indefinite" />
                 </circle>
                 <circle cx="10%" cy="90%" r="4" fill="none" stroke="#f97316" strokeWidth="0.5" opacity="0.2">
                    <animateTransform attributeName="transform" type="rotate" from="0 10 90" to="360 10 90" dur="20s" repeatCount="indefinite" />
                 </circle>
              </svg>
           </div>
           
           {/* Layer 3: Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Column 1: About */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-inner">
                   <GraduationCap className="text-orange-400" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-white to-blue-200">طرح حامیم</span>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed max-w-md font-light">
                دوره توانمندسازی دانشجویان فعال فرهنگی، اجتماعی و سیاسی.
                به همت نهاد نمایندگی مقام معظم رهبری در دانشگاه صنعتی خاتم الانبیاء بهبهان.
                هدف ما ارتقای بینش سیاسی و فرهنگی دانشجویان نخبه است.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-orange-400 border-b border-orange-400/20 pb-2 inline-block">دسترسی سریع</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-blue-100 hover:text-white hover:translate-x-1 transition-transform inline-block text-sm">صفحه اصلی</Link></li>
                <li><Link to="/about" className="text-blue-100 hover:text-white hover:translate-x-1 transition-transform inline-block text-sm">طرح مطالعاتی</Link></li>
                <li><Link to="/instructions" className="text-blue-100 hover:text-white hover:translate-x-1 transition-transform inline-block text-sm">محتوای آموزشی</Link></li>
                <li><Link to="/game" className="text-blue-100 hover:text-white hover:translate-x-1 transition-transform inline-block text-sm">مسیر رشد</Link></li>
                <li><Link to="/contact" className="text-blue-100 hover:text-white hover:translate-x-1 transition-transform inline-block text-sm">ثبت نام</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-orange-400 border-b border-orange-400/20 pb-2 inline-block">ارتباط با ما</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-blue-100 text-sm group">
                  <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-orange-500/20 transition-colors">
                     <Phone size={14} className="text-orange-400" />
                  </div>
                  <span className="font-mono dir-ltr">09991368050</span>
                </li>
                <li className="flex items-center gap-2 text-blue-100 text-sm group">
                   <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-blue-500/20 transition-colors">
                      <span className="text-xs font-bold text-blue-400">@</span>
                   </div>
                   <span className="font-mono bg-blue-900/50 px-2 py-1 rounded border border-blue-800/50">Hamim_yar</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-800/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-blue-300 text-xs opacity-80">
              © ۱۴۰۴ کلیه حقوق محفوظ است. دانشگاه صنعتی خاتم الانبیاء بهبهان.
            </p>
            <div className="flex gap-4">
               {/* Social Icons Placeholders */}
               <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-orange-500 cursor-pointer transition-all hover:scale-110 flex items-center justify-center text-white/60 hover:text-white border border-white/5 hover:border-orange-400">
                 <span className="text-xs font-bold">IG</span>
               </div>
               <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue-500 cursor-pointer transition-all hover:scale-110 flex items-center justify-center text-white/60 hover:text-white border border-white/5 hover:border-blue-400">
                 <span className="text-xs font-bold">TG</span>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;