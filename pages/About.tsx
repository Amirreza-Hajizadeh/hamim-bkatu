import React, { useState } from 'react';
import { Book, Quote, CheckCircle2, Star, Clock, FileText, Bookmark, BookOpen } from 'lucide-react';

interface BookData {
  id: number;
  title: string;
  summary: string;
  features: { label: string; value: string; icon: React.ReactNode }[];
  coverSeed: string; // for picsum
}

const books: BookData[] = [
  {
    id: 1,
    title: "ده گفتار",
    summary: "مجموعه‌ای ارزشمند از ده سخنرانی استاد شهید مرتضی مطهری که در آن به مباحث مهمی همچون «تقوا»، «امر به معروف و نهی از منکر»، «اصل اجتهاد در اسلام» و «احیای تفکر دینی» پرداخته شده است. این کتاب مدخلی عالی برای ورود به منظومه فکری استاد است.",
    features: [
      { label: "سطح", value: "مقدماتی", icon: <Star size={14} /> },
      { label: "موضوع", value: "اجتماعی - اعتقادی", icon: <BookOpen size={14} /> },
      { label: "تعداد صفحات", value: "۳۵۰ صفحه", icon: <FileText size={14} /> },
    ],
    coverSeed: "motahari1"
  },
  {
    id: 2,
    title: "گریز از ایمان و گریز از عمل",
    summary: "این کتاب به کالبدشکافی علل دین‌گریزی در جوامع مدرن می‌پردازد. استاد مطهری با نگاهی جامعه‌شناسانه و روان‌شناسانه، تفاوت میان «گریز از ایمان» (مشکل اعتقادی) و «گریز از عمل» (مشکل رفتاری) را تبیین می‌کند.",
    features: [
      { label: "سطح", value: "متوسط", icon: <Star size={14} /> },
      { label: "موضوع", value: "آسیب‌شناسی دینی", icon: <BookOpen size={14} /> },
      { label: "تعداد صفحات", value: "۱۸۰ صفحه", icon: <FileText size={14} /> },
    ],
    coverSeed: "motahari2"
  },
  {
    id: 3,
    title: "تکامل اجتماعی انسان",
    summary: "آیا جامعه انسانی رو به تکامل است؟ آینده بشریت چگونه خواهد بود؟ این کتاب به بررسی فلسفه تاریخ از دیدگاه اسلام می‌پردازد و نظریات مادی‌گرایانه درباره تکامل جامعه را نقد و بررسی می‌کند.",
    features: [
      { label: "سطح", value: "پیشرفته", icon: <Star size={14} /> },
      { label: "موضوع", value: "فلسفه تاریخ", icon: <BookOpen size={14} /> },
      { label: "تعداد صفحات", value: "۲۲۰ صفحه", icon: <FileText size={14} /> },
    ],
    coverSeed: "motahari3"
  },
  {
    id: 4,
    title: "اسلام و مقتضیات زمان",
    summary: "یکی از مهم‌ترین آثار استاد که به چالش برانگیزترین سوال دینی پاسخ می‌دهد: چگونه اسلام با قوانین ثابت ۱۴۰۰ سال پیش، پاسخگوی نیازهای متغیر بشر امروز است؟ بحثی عمیق درباره اجتهاد، قوانین ثابت و متغیر.",
    features: [
      { label: "سطح", value: "پیشرفته", icon: <Star size={14} /> },
      { label: "موضوع", value: "فقه و زمان", icon: <BookOpen size={14} /> },
      { label: "تعداد صفحات", value: "جلد ۱ و ۲", icon: <FileText size={14} /> },
    ],
    coverSeed: "motahari4"
  }
];

const About: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<BookData>(books[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Header with Large Vector Book Concept */}
      <div className="text-center space-y-4 relative">
        <span className="text-orange-500 font-bold tracking-wider text-sm bg-orange-50 px-3 py-1 rounded-full border border-orange-100">سیر مطالعاتی</span>
        <h1 className="text-4xl md:text-5xl font-black text-blue-900">گنجینه دانایی</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          سفری به دنیای اندیشه‌های استاد مطهری. کتابی را انتخاب کنید تا بیشتر بدانید.
        </p>
        
        {/* Background Vector Decoration (Abstract Book) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none -z-10">
           <svg width="600" height="400" viewBox="0 0 24 24" fill="currentColor" className="text-blue-900">
             <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
             <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
           </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Sidebar List (Right) */}
        <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
           <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
               <Book className="text-orange-500" />
               لیست کتب دوره
             </h3>
             <div className="space-y-3">
               {books.map((book) => (
                 <button
                   key={book.id}
                   onClick={() => setSelectedBook(book)}
                   className={`w-full text-right p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                     selectedBook.id === book.id 
                       ? 'bg-blue-600 text-white shadow-md border-blue-600' 
                       : 'bg-gray-50 text-gray-700 border-transparent hover:bg-blue-50 hover:text-blue-700'
                   }`}
                 >
                   <span className="font-bold">{book.title}</span>
                   {selectedBook.id === book.id && <CheckCircle2 className="animate-fadeIn" size={18} />}
                 </button>
               ))}
             </div>
           </div>

           {/* Decorative Quote Box */}
           <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 relative overflow-hidden">
             <Quote className="text-orange-200 w-24 h-24 absolute -top-4 -left-4 -z-0 rotate-12" />
             <p className="relative z-10 text-gray-700 font-medium italic leading-relaxed text-sm">
               "کتاب، بوستانی است که در جیب جای می‌گیرد."
             </p>
           </div>
        </div>

        {/* Main Content Display (Left/Center) */}
        <div className="lg:col-span-8 order-1 lg:order-2">
           <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden transition-all duration-500">
             
             {/* Background Gradient */}
             <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent opacity-50"></div>

             <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                
                {/* Book Cover Image */}
                <div className="w-full md:w-1/3 shrink-0 perspective-1000">
                   <div className="relative group w-full aspect-[2/3] rounded-2xl shadow-2xl transform transition-transform duration-500 hover:rotate-y-12 preserve-3d">
                      <img 
                        key={selectedBook.coverSeed} // Force re-render for animation
                        src={`https://picsum.photos/seed/${selectedBook.coverSeed}/400/600`} 
                        alt={selectedBook.title}
                        className="w-full h-full object-cover rounded-2xl animate-fadeIn"
                      />
                      {/* Spine Effect */}
                      <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-black/20 to-transparent rounded-l-2xl pointer-events-none"></div>
                   </div>
                </div>

                {/* Details */}
                <div className="w-full md:w-2/3 space-y-6">
                   <div className="space-y-2">
                     <h2 className="text-3xl font-black text-gray-900 animate-slideUp">
                       {selectedBook.title}
                     </h2>
                     <div className="w-20 h-1.5 bg-orange-500 rounded-full"></div>
                   </div>

                   {/* Features Grid */}
                   <div className="flex flex-wrap gap-3 animate-slideUp delay-100">
                      {selectedBook.features.map((feat, idx) => (
                        <div key={idx} className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-gray-700 font-medium">
                           <span className="text-blue-500">{feat.icon}</span>
                           <span>{feat.label}: <span className="text-black font-bold">{feat.value}</span></span>
                        </div>
                      ))}
                   </div>

                   {/* Summary Box */}
                   <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 animate-slideUp delay-200">
                      <div className="flex items-center gap-2 text-blue-800 font-bold mb-3">
                         <Bookmark size={18} />
                         <span>خلاصه محتوا</span>
                      </div>
                      <p className="text-gray-700 leading-8 text-justify">
                        {selectedBook.summary}
                      </p>
                   </div>
                   
                   <button className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                      <FileText size={18} />
                      دانلود فایل PDF خلاصه
                   </button>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default About;