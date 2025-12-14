import React, { useState } from 'react';
import { 
  Network, 
  BrainCircuit, 
  HelpCircle, 
  Play, 
  Download, 
  Mic, 
  Video, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  RotateCw,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Book,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cast,
  ExternalLink
} from 'lucide-react';

// --- Data ---
const booksData = [
  { id: 1, title: "طرح کلی اندیشه اسلامی", color: "#3b82f6", mapNodes: ["ایمان", "توحید", "نبوت", "ولایت"], chapters: ["آغاز سخن", "اصول دین", "ضرورت نبوت", "امام و رهبری"] },
  { id: 2, title: "همرزمان حسین (ع)", color: "#f97316", mapNodes: ["تقیه", "مبارزه", "انسان ۲۵۰ ساله", "خواص"], chapters: ["مقدمه تاریخی", "تحلیل سیاسی", "نقش خواص", "سیره مبارزاتی"] },
  { id: 3, title: "خط امام", color: "#10b981", mapNodes: ["استکبار ستیزی", "مردم سالاری", "عدالت", "معنویت"], chapters: ["ریشه‌های انقلاب", "اهداف نهضت", "وصیت‌نامه", "آینده انقلاب"] },
  { id: 4, title: "صعود چهل ساله", color: "#8b5cf6", mapNodes: ["استقلال", "آزادی", "پیشرفت علمی", "کرامت زن"], chapters: ["وضعیت پهلوی", "دستاوردها", "آمار جهانی", "چشم انداز"] },
];

const quizQuestions = [
  { 
    id: 1, 
    question: "مهم‌ترین ویژگی دانشجوی تراز انقلاب چیست؟", 
    options: ["فقط درس خواندن", "تعهد در کنار تخصص", "فعالیت سیاسی بدون بصیرت"], 
    correct: 1 
  },
  { 
    id: 2, 
    question: "محور اصلی کتاب طرح کلی اندیشه اسلامی چیست؟", 
    options: ["تاریخ اسلام", "احکام شرعی", "توحید اجتماعی و ولایت"], 
    correct: 2 
  },
  { 
    id: 3, 
    question: "منظور از انسان ۲۵۰ ساله چیست؟", 
    options: ["عمر طولانی انسان", "یکپارچگی زندگی ائمه (ع)", "غیبت امام زمان (عج)"], 
    correct: 1 
  },
];

// --- Components for Sections ---

// 0. Online Meeting Section
const OnlineMeetingSection: React.FC = () => {
   return (
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
         {/* Background Effect */}
         <div className="absolute -right-10 -top-10 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
            <Video size={150} />
         </div>
         
         <div className="flex-1 relative z-10">
            <div className="flex items-center gap-3 mb-3">
               <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm shadow-inner">
                  <Cast size={24} className="text-white" />
               </div>
               <h3 className="text-2xl font-bold">کلاس آنلاین و وبینار</h3>
            </div>
            <p className="text-emerald-100 text-sm leading-relaxed max-w-xl font-medium">
               جهت شرکت در جلسات زنده، رفع اشکال و کارگاه‌های مجازی، از طریق دکمه روبرو وارد محیط گوگل میت شوید.
               <span className="block mt-2 text-xs opacity-80 bg-black/10 w-fit px-2 py-1 rounded-md">
                 ⚠️ لطفا ۱۵ دقیقه قبل از شروع جلسه حاضر باشید.
               </span>
            </p>
         </div>

         <div className="relative z-10 w-full md:w-auto">
            <a 
               href="https://meet.google.com/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center justify-center gap-3 bg-white text-emerald-700 px-8 py-4 rounded-2xl font-black text-lg shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.25)] transition-all transform hover:-translate-y-1 active:scale-95 active:shadow-none"
            >
               <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
               </span>
               ورود به جلسه
               <ExternalLink size={20} strokeWidth={3} />
            </a>
         </div>
      </div>
   );
};

// 1. Mind Map Component (Slider)
const MindMapSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextBook = () => setCurrentIndex((prev) => (prev + 1) % booksData.length);
  const prevBook = () => setCurrentIndex((prev) => (prev - 1 + booksData.length) % booksData.length);

  const currentBook = booksData[currentIndex];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 overflow-hidden relative">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Network className="text-blue-500" />
            نقشه ذهنی: <span style={{ color: currentBook.color }}>{currentBook.title}</span>
          </h3>
          <div className="flex gap-2">
             <button onClick={prevBook} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"><ChevronRight /></button>
             <button onClick={nextBook} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"><ChevronLeft /></button>
          </div>
       </div>
       
       <div className="w-full h-[400px] bg-slate-50 rounded-2xl relative border border-slate-200 flex items-center justify-center overflow-auto transition-all duration-500">
          <svg viewBox="0 0 800 500" className="w-full h-full min-w-[600px]">
             {/* Connectors */}
             <path d="M400 250 L200 100" stroke="#cbd5e1" strokeWidth="2" />
             <path d="M400 250 L600 100" stroke="#cbd5e1" strokeWidth="2" />
             <path d="M400 250 L200 400" stroke="#cbd5e1" strokeWidth="2" />
             <path d="M400 250 L600 400" stroke="#cbd5e1" strokeWidth="2" />

             {/* Center Node */}
             <g transform="translate(400, 250)">
                <circle r="70" fill={currentBook.color} stroke="white" strokeWidth="4" className="drop-shadow-lg" />
                <text textAnchor="middle" dy="5" fill="white" fontSize="14" fontWeight="bold" className="pointer-events-none">
                  {currentBook.title.split(' ')[0]}...
                </text>
             </g>

             {/* Nodes (Dynamic based on book) */}
             <g transform="translate(200, 100)" className="cursor-pointer hover:scale-110 transition-transform">
                <circle r="45" fill="white" stroke={currentBook.color} strokeWidth="3" />
                <text textAnchor="middle" dy="5" fontSize="12" fontWeight="bold" fill="#333">{currentBook.mapNodes[0]}</text>
             </g>
             <g transform="translate(600, 100)" className="cursor-pointer hover:scale-110 transition-transform">
                <circle r="45" fill="white" stroke={currentBook.color} strokeWidth="3" />
                <text textAnchor="middle" dy="5" fontSize="12" fontWeight="bold" fill="#333">{currentBook.mapNodes[1]}</text>
             </g>
             <g transform="translate(200, 400)" className="cursor-pointer hover:scale-110 transition-transform">
                <circle r="45" fill="white" stroke={currentBook.color} strokeWidth="3" />
                <text textAnchor="middle" dy="5" fontSize="12" fontWeight="bold" fill="#333">{currentBook.mapNodes[2]}</text>
             </g>
             <g transform="translate(600, 400)" className="cursor-pointer hover:scale-110 transition-transform">
                <circle r="45" fill="white" stroke={currentBook.color} strokeWidth="3" />
                <text textAnchor="middle" dy="5" fontSize="12" fontWeight="bold" fill="#333">{currentBook.mapNodes[3]}</text>
             </g>
          </svg>
       </div>
       <p className="text-center text-sm text-gray-400 mt-4">اسلاید {currentIndex + 1} از {booksData.length}</p>
    </div>
  );
};

// 2. Infographic Component (Slider)
const InfographicSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextBook = () => setCurrentIndex((prev) => (prev + 1) % booksData.length);
  const prevBook = () => setCurrentIndex((prev) => (prev - 1 + booksData.length) % booksData.length);
  
  const currentBook = booksData[currentIndex];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <div className="flex justify-between items-center mb-8">
         <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-orange-500" />
            اینفوگرافی محتوا: <span className="text-gray-600 text-lg">{currentBook.title}</span>
         </h3>
         <div className="flex gap-2">
             <button onClick={prevBook} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"><ChevronRight /></button>
             <button onClick={nextBook} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"><ChevronLeft /></button>
         </div>
      </div>
       
       <div className="relative min-h-[200px] flex items-center justify-center">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 hidden md:block z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full relative z-10">
             {currentBook.chapters.map((chapter, idx) => (
                <div key={idx} className="relative flex flex-col items-center text-center group animate-slideUp" style={{ animationDelay: `${idx * 100}ms` }}>
                   <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white z-10 shadow-lg transition-transform group-hover:scale-110 border-4 border-white"
                      style={{ backgroundColor: currentBook.color }}
                   >
                      <span className="font-bold text-xl">{idx + 1}</span>
                   </div>
                   <div className="mt-4 bg-gray-50 p-4 rounded-xl w-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-gray-800 text-sm">{chapter}</h4>
                      <p className="text-xs text-gray-400 mt-1">فصل {idx + 1}</p>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

// 3. Flashcards Component (Fixed RTL)
const FlashcardsSection: React.FC = () => {
  const cards = [
    { q: "هدف اصلی طرح حامیم چیست؟", a: "توانمندسازی دانشجویان فعال فرهنگی" },
    { q: "کدام کتاب محور بخش اندیشه است؟", a: "طرح کلی اندیشه اسلامی در قرآن" },
    { q: "شرط دریافت گواهی چیست؟", a: "حضور کامل و قبولی در آزمون" },
  ];
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const nextCard = () => {
     setFlipped(false);
     setTimeout(() => setCurrent((prev) => (prev + 1) % cards.length), 300);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 shadow-xl text-white">
       <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
         <Lightbulb className="text-yellow-300" />
         فلش کارت مرور
       </h3>
       
       <div className="relative h-64 perspective-1000 group cursor-pointer w-full" onClick={() => setFlipped(!flipped)}>
          <div 
             className={`relative w-full h-full duration-700 preserve-3d transition-transform ${flipped ? 'rotate-y-180' : ''}`} 
             style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          >
             
             {/* Front Side */}
             <div 
                className="absolute inset-0 backface-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-inner"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
             >
                <span className="text-sm text-indigo-200 mb-4 uppercase tracking-widest border border-indigo-200/30 px-3 py-1 rounded-full">سوال {current + 1}</span>
                <p className="text-2xl font-bold leading-normal">{cards[current].q}</p>
                <span className="absolute bottom-4 text-xs text-indigo-300 animate-pulse flex items-center gap-1">
                   <RotateCw size={12}/> کلیک کنید
                </span>
             </div>

             {/* Back Side */}
             <div 
                className="absolute inset-0 backface-hidden bg-white text-indigo-900 rounded-2xl flex flex-col items-center justify-center p-8 text-center"
                style={{ 
                  transform: 'rotateY(180deg)', 
                  backfaceVisibility: 'hidden', 
                  WebkitBackfaceVisibility: 'hidden' 
                }}
             >
                <span className="text-sm text-indigo-400 mb-4 uppercase tracking-widest font-bold">پاسخ صحیح</span>
                <p className="text-xl font-bold leading-relaxed">{cards[current].a}</p>
             </div>
          </div>
       </div>

       <div className="mt-6 flex justify-center">
          <button onClick={(e) => { e.stopPropagation(); nextCard(); }} className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full font-bold transition-colors flex items-center gap-2 shadow-lg">
             کارت بعدی <ArrowLeft size={16} />
          </button>
       </div>
    </div>
  );
};

// 4. Quiz Component (Navigable & Fixed Colors)
const QuizSection: React.FC = () => {
   const [qIndex, setQIndex] = useState(0);
   const [selectedOption, setSelectedOption] = useState<number | null>(null);
   const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

   const currentQ = quizQuestions[qIndex];

   const triggerCollect = (item: { id: string; name: string; icon: string; description: string }) => {
     const event = new CustomEvent('collect-item', { detail: item });
     window.dispatchEvent(event);
   };

   const handleAnswer = (optionIndex: number) => {
      setSelectedOption(optionIndex);
      if (optionIndex === currentQ.correct) {
         setIsCorrect(true);
         // If it's a correct answer, and it's the last question (or just reward every time for now for simplicity)
         // Let's reward 'Iman' if they get a question right to be encouraging.
         triggerCollect({
            id: 'item-iman',
            name: 'گوهر ایمان',
            icon: 'heart',
            description: 'پاسخ صحیح به ندای حق. ایمان، نوری در قلب مؤمن است.'
         });
      } else {
         setIsCorrect(false);
      }
   };

   const nextQuestion = () => {
      setSelectedOption(null);
      setIsCorrect(null);
      setQIndex((prev) => (prev + 1) % quizQuestions.length);
   };
   
   const prevQuestion = () => {
      setSelectedOption(null);
      setIsCorrect(null);
      setQIndex((prev) => (prev - 1 + quizQuestions.length) % quizQuestions.length);
   };

   return (
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col h-full">
         <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
               <HelpCircle className="text-green-500" />
               آزمون کوتاه
            </h3>
            <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
               سوال {qIndex + 1}
            </span>
         </div>
         
         <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex-grow">
            <p className="font-bold text-black mb-6 text-lg leading-relaxed">{currentQ.question}</p>
            <div className="space-y-3">
               {currentQ.options.map((opt, idx) => (
                  <button 
                     key={idx}
                     onClick={() => handleAnswer(idx)}
                     disabled={selectedOption !== null}
                     className={`w-full text-right p-4 rounded-xl border-2 font-bold transition-all ${
                        selectedOption === idx 
                           ? idx === currentQ.correct 
                              ? 'bg-green-100 border-green-500 text-green-900' 
                              : 'bg-red-100 border-red-500 text-red-900'
                           : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-100 hover:border-gray-300'
                     }`}
                  >
                     <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                           selectedOption === idx ? 'border-current' : 'border-gray-400 text-gray-500'
                        }`}>
                           {idx + 1}
                        </div>
                        {opt}
                     </div>
                  </button>
               ))}
            </div>
            
            {/* Feedback Message */}
            {isCorrect === true && <p className="mt-4 text-green-600 font-bold flex items-center gap-2 animate-fadeIn"><Check size={18}/> عالی بود! پاسخ صحیح است.</p>}
            {isCorrect === false && <p className="mt-4 text-red-500 font-bold animate-fadeIn">اشتباه بود. تلاش کنید.</p>}
         </div>

         {/* Navigation */}
         <div className="mt-6 flex justify-between gap-4">
             <button onClick={prevQuestion} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold flex items-center gap-2">
                <ChevronRight size={18}/> سوال قبل
             </button>
             <button onClick={nextQuestion} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2">
                سوال بعد <ChevronLeft size={18}/>
             </button>
         </div>
      </div>
   );
};

// 5. Multimedia Section
const MultimediaSection: React.FC = () => {
   const videos = [
      { id: 1, title: "معرفی کامل طرح حامیم", duration: "04:20", seed: "hamimintro" },
      { id: 2, title: "ضرورت کار تشکیلاتی در دانشگاه", duration: "08:15", seed: "teamwork" },
      { id: 3, title: "بصیرت در دوران غبارآلود", duration: "12:05", seed: "basirat" },
      { id: 4, title: "مسیر نخبه‌پروری فرهنگی", duration: "06:30", seed: "elite" },
   ];

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Audio */}
         <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
               <Mic className="text-pink-500" />
               خلاصه صوتی
            </h3>
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-1">
               {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 bg-pink-50 p-3 rounded-xl hover:bg-pink-100 transition-colors cursor-pointer group border border-pink-100">
                     <button className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform shrink-0 shadow-md">
                        <Play size={16} fill="currentColor" />
                     </button>
                     <div className="flex-1 min-w-0">
                        <div className="h-1 bg-pink-200 rounded-full overflow-hidden mb-1">
                           <div className="h-full bg-pink-500 w-0 group-hover:w-1/3 transition-all duration-1000"></div>
                        </div>
                        <span className="text-xs text-pink-800 block font-bold truncate">جلسه {i}: مبانی اندیشه اسلامی</span>
                     </div>
                     <span className="text-xs font-mono text-pink-400 shrink-0">15:00</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Video */}
         <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
               <Video className="text-red-500" />
               ویدیوهای آموزشی
            </h3>
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-1">
               {videos.map((video) => (
                  <div key={video.id} className="group relative overflow-hidden rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all bg-gray-50 border border-gray-100">
                     <div className="flex flex-row h-24">
                        <div className="w-1/3 h-full relative">
                           <img src={`https://picsum.photos/seed/${video.seed}/300/200`} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                                 <Play size={14} fill="white" className="text-white ml-0.5" />
                              </div>
                           </div>
                        </div>
                        <div className="w-2/3 p-3 flex flex-col justify-center">
                           <h4 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-red-600 transition-colors line-clamp-2">{video.title}</h4>
                           <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock size={10} />
                              {video.duration}
                           </span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

// 6. PowerPoint Section (Dropdown)
const PPTSection: React.FC = () => {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <div className="bg-blue-900 rounded-3xl p-8 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
         <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
               <FileText className="text-orange-400" />
               اسلاید آموزشی (PowerPoint)
            </h3>
            <p className="text-blue-200 text-sm">دانلود فایل ارائه کامل دوره جهت تدریس یا مرور شخصی.</p>
         </div>
         
         <div className="relative w-full md:w-auto">
            <button 
               onClick={() => setIsOpen(!isOpen)}
               className="w-full md:w-64 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-between gap-4 shadow-lg transition-transform active:scale-95"
            >
               <span className="flex items-center gap-2"><Download size={20} /> دانلود فایل‌ها</span>
               {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {isOpen && (
               <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-xl shadow-2xl overflow-hidden animate-slideUp text-gray-800 z-20">
                  {booksData.map((book) => (
                     <button key={book.id} className="w-full text-right px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center gap-2 transition-colors">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: book.color }}></div>
                        <span className="text-sm font-bold">{book.title}</span>
                     </button>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
};

const Instructions: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Hero */}
      <div className="text-center space-y-4 mb-12">
        <span className="text-blue-600 font-bold tracking-wider text-sm bg-blue-50 px-3 py-1 rounded-full border border-blue-100">منابع آموزشی</span>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900">جعبه ابزار یادگیری</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          هر آنچه برای یادگیری عمیق‌تر و مرور مباحث نیاز دارید، اینجا گردآوری شده است.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
         {/* Online Meeting Banner */}
         <OnlineMeetingSection />

         {/* Top Section: Mind Map */}
         <MindMapSection />

         {/* Section: Infographic */}
         <InfographicSection />

         {/* Middle: Flashcards & Quiz */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FlashcardsSection />
            <QuizSection />
         </div>

         {/* Bottom: Media */}
         <MultimediaSection />

         {/* Footer: PPT */}
         <PPTSection />
      </div>

    </div>
  );
};

export default Instructions;