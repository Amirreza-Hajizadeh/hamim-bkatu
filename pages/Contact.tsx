import React, { useState } from 'react';
import { Copy, Check, MessageCircle, MapPin, Send, ExternalLink, Megaphone } from 'lucide-react';

const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const adminId = "@Hamim_yar";

  const handleCopy = () => {
    navigator.clipboard.writeText(adminId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Column: Instructions */}
        <div className="space-y-8">
           <div>
             <h1 className="text-3xl font-black text-gray-900 mb-4">نحوه ثبت نام</h1>
             <p className="text-gray-600 text-lg">
               برای ثبت نام در پنجمین دوره طرح حامیم، کافیست مراحل زیر را طی کنید. ظرفیت محدود است، پس عجله کنید!
             </p>
           </div>

           <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                   <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-lg z-10">1</div>
                   <div className="w-0.5 h-full bg-gray-200 -mt-2"></div>
                </div>
                <div className="pb-8">
                   <h3 className="font-bold text-xl text-gray-800 mb-2">ارسال پیام به ادمین</h3>
                   <p className="text-gray-500 text-sm">نام و نام خانوادگی، شماره دانشجویی و رشته تحصیلی خود را به آیدی زیر در پیام‌رسان ایتا یا تلگرام ارسال کنید.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                   <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg z-10">2</div>
                   <div className="w-0.5 h-full bg-gray-200 -mt-2"></div>
                </div>
                <div className="pb-8">
                   <h3 className="font-bold text-xl text-gray-800 mb-2">تکمیل فرم آنلاین</h3>
                   <p className="text-gray-500 text-sm mb-4">برای نهایی کردن ثبت نام، لطفا فرم الکترونیکی (لینک در کادر روبرو) را با دقت تکمیل نمایید.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                   <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold shadow-lg z-10">3</div>
                </div>
                <div>
                   <h3 className="font-bold text-xl text-gray-800 mb-2">مصاحبه و گزینش</h3>
                   <p className="text-gray-500 text-sm">زمان مصاحبه حضوری به شما اطلاع‌رسانی می‌شود.</p>
                </div>
              </div>
           </div>
        </div>

        {/* Right Column: Contact Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 flex flex-col justify-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl -z-10"></div>
           
           <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <MessageCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">ارتباط مستقیم</h2>
              <p className="text-gray-500 mt-2">پاسخگویی ۲۴ ساعته در پیام‌رسان‌ها</p>
           </div>

           {/* ID Box */}
           <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center gap-4 mb-8">
              <span className="text-gray-500 text-sm font-medium">آیدی ثبت نام:</span>
              <code className="text-2xl font-mono text-blue-900 font-bold tracking-wider">{adminId}</code>
              
              <button 
                onClick={handleCopy}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
                  copied 
                    ? 'bg-green-500 text-white shadow-green-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 shadow-lg'
                }`}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'کپی شد!' : 'کپی آیدی'}
              </button>
           </div>

           <div className="space-y-4">
             <a href="https://eitaa.com/Hamim_yar" target="_blank" rel="noopener noreferrer" className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
               <Send size={18} />
               ارسال پیام در ایتا
             </a>
             <a href="https://t.me/Hamim_yar" target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
               <Send size={18} />
               ارسال پیام در تلگرام
             </a>
             {/* Moved Link Button */}
             <a 
               href="https://digiform.ir/hamim_bkatu" 
               target="_blank" 
               rel="noopener noreferrer"
               className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-center py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
             >
               <ExternalLink size={18} />
               ورود به فرم ثبت نام آنلاین
             </a>

             {/* Channel Links */}
             <div className="pt-4 border-t border-gray-100 mt-2 space-y-3">
               <p className="text-center text-gray-400 text-xs font-bold mb-1">عضویت در کانال‌های اطلاع‌رسانی</p>
               <div className="grid grid-cols-2 gap-3">
                  <a 
                    href="https://eitaa.com/Hamim_Bkatu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-center py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm border border-amber-200"
                  >
                    <Megaphone size={16} className="rotate-12" />
                    کانال ایتا
                  </a>
                  <a 
                    href="https://t.me/Hamim_Bkatu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-sky-100 hover:bg-sky-200 text-sky-800 text-center py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm border border-sky-200"
                  >
                    <Megaphone size={16} className="rotate-12" />
                    کانال تلگرام
                  </a>
               </div>
             </div>
           </div>

           <div className="mt-8 pt-8 border-t border-gray-100 text-center">
             <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-2">
               <MapPin size={16} />
               <span>مکان برگزاری:</span>
             </div>
             <p className="font-bold text-gray-700">دانشگاه صنعتی خاتم الانبیاء بهبهان</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;