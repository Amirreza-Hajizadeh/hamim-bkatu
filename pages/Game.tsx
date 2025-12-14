import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, Flag, Sparkles, X, BookOpen, Gamepad2, RefreshCcw, Trophy, Gift, RotateCw, Check, Play, Circle, Square, Target, Shield, Heart, Map as MapIcon, Compass, Palette, Ghost, Car, Rat } from 'lucide-react';

// --- Types ---
type Gender = 'male' | 'female';
type SkinTone = 'light' | 'medium' | 'dark';
type Headwear = 'none' | 'turban_white' | 'turban_black' | 'scarf' | 'hat' | 'kufi' | 'pirate_hat' | 'space_helmet' | 'scholar_cap';
type Eyewear = 'none' | 'glasses' | 'sunglasses';
type Beard = 'none' | 'stubble' | 'full' | 'long';
type Outfit = 'casual' | 'suit' | 'abaya' | 'coat' | 'chador' | 'cleric' | 'shirt_pants' | 'scholar_gown';

interface CharacterConfig {
  name: string;
  gender: Gender;
  skinTone: SkinTone;
  headwear: Headwear;
  headwearColor: string; // New: Custom color for headwear
  eyewear: Eyewear;
  beard: Beard;
  outfit: Outfit;
  color: string; // Outfit color
}

// --- Game Data ---
const steps = [
  { id: 1, title: "طلب (آغاز)", description: "قدم اول: خواستن" },
  { id: 2, title: "بصیرت", description: "شناخت مسیر" },
  { id: 3, title: "جهاد اکبر", description: "مبارزه با نفس" },
  { id: 4, title: "علم و معرفت", description: "کسب دانش" },
  { id: 5, title: "ایثار", description: "مقدم داشتن دیگران" },
  { id: 6, title: "شهادت", description: "اوج کمال" },
];

const quotes = [
  { text: "پندار ما این است که ما مانده‌ایم و شهدا رفته‌اند، اما حقیقت آن است که زمان ما را با خود برده است و شهدا مانده‌اند.", author: "شهید سید مرتضی آوینی" },
  { text: "من ستایشگر معلمی هستم که اندیشیدن را به من بیاموزد، نه اندیشه‌ها را.", author: "شهید مرتضی مطهری" },
  { text: "خدایا! مرا از همه وابستگی‌ها رها کن و به خودت متصل گردان.", author: "شهید مصطفی چمران" },
  { text: "ما ملت امام حسینیم، ما ملت شهادتیم.", author: "شهید حاج قاسم سلیمانی" },
];

// --- Spinner Data ---
type RewardType = 'hadith' | 'dhikr' | 'deed';
interface Reward {
  id: number;
  type: RewardType;
  label: string; 
  content: string; 
  color: string;
}

const rewards: Reward[] = [
  { id: 1, type: 'dhikr', label: 'ذکر نورانی', content: '۱۰۰ مرتبه صلوات بر محمد و آل محمد (ص) هدیه به امام زمان (عج)', color: '#3b82f6' }, 
  { id: 2, type: 'hadith', label: 'کلام نور', content: 'پیامبر اکرم (ص): محبوب‌ترین اعمال نزد خداوند، شاد کردن دل مؤمن است.', color: '#f59e0b' }, 
  { id: 3, type: 'deed', label: 'عمل نیک', content: 'امروز با پدر و مادر خود تماس بگیرید و جویای احوالشان شوید.', color: '#10b981' }, 
  { id: 4, type: 'dhikr', label: 'تسبیحات', content: 'یک دور تسبیحات حضرت زهرا (س) بعد از نماز', color: '#8b5cf6' }, 
  { id: 5, type: 'hadith', label: 'حدیث روز', content: 'امام علی (ع): فرصت‌ها مانند ابرها می‌گذرند، پس فرصت‌های نیک را غنیمت شمارید.', color: '#ef4444' }, 
  { id: 6, type: 'deed', label: 'صدقه', content: 'امروز مبلغی را (هرچند اندک) به نیت سلامتی امام زمان (عج) صدقه دهید.', color: '#06b6d4' }, 
];

// --- 3D VECTOR AVATAR (MINIMALIST / GAME STYLE) ---
const VectorCharacterAvatar: React.FC<{ config: CharacterConfig, size?: number }> = ({ config, size = 300 }) => {
   const { gender, skinTone, headwear, headwearColor, eyewear, beard, outfit, color } = config;
   
   // --- Colors ---
   // Using somewhat flat, vibrant "game" colors
   const skin = skinTone === 'light' ? '#FADCB8' : skinTone === 'medium' ? '#E0AC69' : '#8D5524';
   const skinShadow = skinTone === 'light' ? '#E6B89C' : skinTone === 'medium' ? '#C68E52' : '#6B401B';
   
   // Outfit Colors
   const outfitBase = 
      outfit === 'cleric' ? '#E5E7EB' : 
      outfit === 'abaya' ? '#57534E' : 
      outfit === 'chador' ? '#18181B' : 
      outfit === 'suit' ? '#334155' : 
      outfit === 'scholar_gown' ? '#312E81' :
      color === 'blue' ? '#3B82F6' : color === 'green' ? '#10B981' : color === 'red' ? '#EF4444' : '#F59E0B';
    
   const outfitDark = 
      outfit === 'cleric' ? '#9CA3AF' : 
      outfit === 'abaya' ? '#44403C' : 
      outfit === 'chador' ? '#09090B' : 
      outfit === 'suit' ? '#1E293B' : 
      outfit === 'scholar_gown' ? '#1E1B4B' :
      color === 'blue' ? '#1D4ED8' : color === 'green' ? '#047857' : color === 'red' ? '#B91C1C' : '#B45309';

   const headwearBase = headwearColor || '#374151';

   return (
      <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision">
         <defs>
            <filter id="flatShadow" x="-20%" y="-20%" width="140%" height="140%">
               <feDropShadow dx="0" dy="4" stdDeviation="0" floodColor="#000000" floodOpacity="0.15"/>
            </filter>
            <clipPath id="avatarClip">
               <rect x="0" y="0" width="200" height="200" rx="20" />
            </clipPath>
         </defs>

         {/* --- BACKGROUND --- */}
         <circle cx="100" cy="100" r="90" fill={outfitBase} opacity="0.1" />
         
         {/* --- BODY (Simplified Blocky / Heroic) --- */}
         <g transform="translate(50, 110)">
             {outfit === 'chador' ? (
                <path d="M10 0 Q50 -10 90 0 L100 100 L0 100 Z" fill="#18181B" filter="url(#flatShadow)" />
             ) : (
                <path d="M10 10 C10 0, 90 0, 90 10 L100 90 L0 90 Z" fill={outfitBase} filter="url(#flatShadow)" />
             )}
             
             {/* Simple Outfit Details */}
             {outfit === 'suit' && (
                <>
                   <path d="M50 10 L50 90" stroke={outfitDark} strokeWidth="2" />
                   <path d="M50 10 L40 40 L60 40 Z" fill="#EF4444" /> {/* Tie */}
                   <path d="M30 10 L50 30 L70 10" stroke="white" strokeWidth="4" fill="none" /> {/* Collar */}
                </>
             )}
             {outfit === 'cleric' && (
                <>
                   <rect x="40" y="10" width="20" height="80" fill="white" opacity="0.5" />
                   <path d="M30 10 L30 90" stroke={outfitDark} strokeWidth="2" />
                   <path d="M70 10 L70 90" stroke={outfitDark} strokeWidth="2" />
                </>
             )}
             {outfit === 'scholar_gown' && (
                <path d="M20 10 L50 40 L80 10" stroke="#FBBF24" strokeWidth="2" fill="none" />
             )}
         </g>

         {/* --- HEAD (Minimal Geometric) --- */}
         <g transform="translate(100, 85)">
            {/* Neck */}
            <rect x="-12" y="25" width="24" height="20" fill={skinShadow} />

            {/* Scarf / Chador Background */}
            {(headwear === 'scarf' || outfit === 'chador') && (
               <circle cx="0" cy="0" r="52" fill={outfit === 'chador' ? '#18181B' : headwearBase} />
            )}

            {/* Face Shape - Squircle/Rounded Rect */}
            <rect x="-38" y="-45" width="76" height="85" rx="30" fill={skin} filter="url(#flatShadow)" />
            
            {/* Minimal Ear Hints */}
            {headwear !== 'scarf' && outfit !== 'chador' && headwear !== 'space_helmet' && (
               <>
                  <circle cx="-38" cy="0" r="8" fill={skinShadow} />
                  <circle cx="38" cy="0" r="8" fill={skinShadow} />
               </>
            )}

            {/* --- FACE FEATURES (Simple Animation Style) --- */}
            
            {/* Eyes - Simple Ovals */}
            <g transform="translate(0, -5)">
               <ellipse cx="-16" cy="0" rx="6" ry="8" fill="#1F2937" />
               <circle cx="-14" cy="-3" r="2" fill="white" />
               
               <ellipse cx="16" cy="0" rx="6" ry="8" fill="#1F2937" />
               <circle cx="18" cy="-3" r="2" fill="white" />

               {/* Eyebrows - Simple Strokes */}
               <path d="M-26 -12 Q-16 -16 -6 -12" stroke="#4B5563" strokeWidth="3" fill="none" strokeLinecap="round" />
               <path d="M6 -12 Q16 -16 26 -12" stroke="#4B5563" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>

            {/* Glasses */}
            {eyewear === 'glasses' && (
               <g transform="translate(0, -5)">
                  <circle cx="-16" cy="0" r="12" stroke="#111" strokeWidth="2" fill="rgba(255,255,255,0.2)" />
                  <circle cx="16" cy="0" r="12" stroke="#111" strokeWidth="2" fill="rgba(255,255,255,0.2)" />
                  <line x1="-4" y1="0" x2="4" y2="0" stroke="#111" strokeWidth="2" />
               </g>
            )}
            {eyewear === 'sunglasses' && (
               <g transform="translate(0, -5)">
                  <path d="M-30 -5 H-2 L-4 8 H-28 Z" fill="#111" />
                  <path d="M30 -5 H2 L4 8 H28 Z" fill="#111" />
                  <line x1="-4" y1="-2" x2="4" y2="-2" stroke="#111" strokeWidth="2" />
               </g>
            )}

            {/* Nose & Mouth - Minimal */}
            <path d="M-2 15 L0 18 L2 15" stroke={skinShadow} strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M-10 28 Q0 32 10 28" stroke="#BE123C" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />

            {/* Beard - Blocky */}
            {gender === 'male' && beard !== 'none' && (
               <g transform="translate(0, 10)">
                  {beard === 'stubble' && <path d="M-38 10 Q0 45 38 10 L38 30 Q0 60 -38 30 Z" fill="#374151" opacity="0.3" />}
                  {beard === 'full' && <path d="M-38 0 Q0 50 38 0 L38 30 Q0 70 -38 30 Z" fill="#374151" />}
                  {beard === 'long' && <path d="M-38 0 Q0 50 38 0 L38 50 Q0 90 -38 50 Z" fill="#374151" />}
               </g>
            )}

            {/* Hair / Headwear Top */}
            
            {/* Default Hair Base */}
            {headwear === 'none' && (
               gender === 'male' ? (
                  <path d="M-38 -20 C-38 -55, 38 -55, 38 -20 L38 -10 C38 -10, 0 -30, -38 -10 Z" fill="#374151" />
               ) : (
                  <path d="M-38 -20 C-38 -60, 38 -60, 38 -20 L38 40 L-38 40 Z" fill="#374151" /> // Simple Bob
               )
            )}

            {/* Bangs / Front Hair */}
            {headwear === 'none' && gender === 'female' && (
               <path d="M-38 -30 Q0 -10 38 -30" fill="#374151" />
            )}

            {/* Turban */}
            {(headwear === 'turban_white' || headwear === 'turban_black') && (
               <g transform="translate(0, -45)">
                  <rect x="-45" y="0" width="90" height="35" rx="12" fill={headwear === 'turban_white' ? '#F3F4F6' : '#18181B'} filter="url(#flatShadow)" />
                  <path d="M-45 18 Q0 30 45 18" stroke="rgba(0,0,0,0.1)" strokeWidth="2" fill="none" />
               </g>
            )}

            {/* Kufi */}
            {headwear === 'kufi' && (
               <path d="M-38 -25 Q0 -50 38 -25 L38 -15 Q0 -25 -38 -15 Z" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
            )}

            {/* Hat */}
            {headwear === 'hat' && (
               <g transform="translate(0, -40)">
                  <path d="M-40 20 Q0 -20 40 20" fill={headwearBase} />
                  <rect x="-50" y="20" width="100" height="8" rx="4" fill={headwearBase} filter="url(#flatShadow)" />
               </g>
            )}

            {/* Scholar Cap */}
            {headwear === 'scholar_cap' && (
               <g transform="translate(0, -45)">
                  <path d="M-45 15 L0 5 L45 15 L0 25 Z" fill={headwearBase} stroke={outfitDark} strokeWidth="1" />
                  <path d="M-40 15 L-40 35 Q0 45 40 35 L40 15" fill={headwearBase} />
                  <circle cx="0" cy="15" r="3" fill="#FBBF24" />
                  <path d="M0 15 Q20 15 30 35" stroke="#FBBF24" strokeWidth="2" fill="none" />
               </g>
            )}

            {/* Scarf / Chador Front */}
            {(headwear === 'scarf' || outfit === 'chador') && (
               <path d="M-39 -30 Q0 -45 39 -30 L39 40 Q0 55 -39 40 Z" fill="none" stroke={outfit === 'chador' ? '#18181B' : headwearBase} strokeWidth="10" />
            )}

            {/* Pirate Hat */}
            {headwear === 'pirate_hat' && (
               <g transform="translate(0, -50)">
                  <path d="M-50 20 Q0 -10 50 20 L40 40 L-40 40 Z" fill={headwearBase} />
                  <circle cx="0" cy="15" r="5" fill="white" opacity="0.8" />
                  <path d="M-5 20 L5 10 M5 20 L-5 10" stroke="white" strokeWidth="2" opacity="0.8" />
               </g>
            )}

            {/* Space Helmet */}
            {headwear === 'space_helmet' && (
               <circle cx="0" cy="0" r="55" fill="none" stroke="#9CA3AF" strokeWidth="4" />
            )}

         </g>
      </svg>
   );
};

// --- GAME: Sardar (Angry Birds Style) ---
const SardarGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const [score, setScore] = useState(0);
   const [mouseLeft, setMouseLeft] = useState(3);
   const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Game Objects
      let projectile = { x: 80, y: 220, vx: 0, vy: 0, r: 8, state: 'idle' }; // states: idle, dragging, flying
      let anchor = { x: 80, y: 220 };
      
      // Enemies are Mice now
      let enemies = [
         { x: 350, y: 150, r: 12, alive: true },
         { x: 380, y: 150, r: 12, alive: true },
         { x: 365, y: 110, r: 12, alive: true }, // Stacked
         { x: 450, y: 200, r: 12, alive: true }
      ];

      // Buildings are Soap Bars
      const buildings = [
         { x: 330, y: 170, w: 80, h: 130 }, // Building 1
         { x: 430, y: 220, w: 60, h: 80 },  // Building 2
      ];

      let animationFrame: number;
      let dragStart = { x: 0, y: 0 };
      
      const drawSardar = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
         // Head
         ctx.fillStyle = '#f0d5b9';
         ctx.beginPath(); ctx.arc(x, y-20, 10, 0, Math.PI*2); ctx.fill();
         // Beard
         ctx.fillStyle = '#e5e7eb';
         ctx.beginPath(); ctx.arc(x, y-18, 8, 0, Math.PI, false); ctx.fill();
         // Body (Green Outfit)
         ctx.fillStyle = '#15803d';
         ctx.fillRect(x-12, y-10, 24, 30);
         // Arm
         ctx.strokeStyle = '#15803d';
         ctx.lineWidth = 4;
         ctx.beginPath(); ctx.moveTo(x, y-5); ctx.lineTo(x+15, y+5); ctx.stroke();
      };

      const draw = () => {
         // Clear
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         
         // Sky
         const grad = ctx.createLinearGradient(0, 0, 0, 300);
         grad.addColorStop(0, '#87CEEB');
         grad.addColorStop(1, '#E0F7FA');
         ctx.fillStyle = grad;
         ctx.fillRect(0, 0, canvas.width, canvas.height);

         // Ground
         ctx.fillStyle = '#4CAF50';
         ctx.fillRect(0, 300, canvas.width, 50);
         ctx.fillStyle = '#388E3C';
         ctx.fillRect(0, 310, canvas.width, 40);

         // Buildings (Soap Bars)
         buildings.forEach(b => {
            // Draw as soap
            ctx.fillStyle = '#fce7f3'; // Light pink soap
            ctx.fillRect(b.x, b.y, b.w, b.h);
            ctx.strokeStyle = '#fbcfe8';
            ctx.lineWidth = 2;
            ctx.strokeRect(b.x, b.y, b.w, b.h);
            
            // Soap indent/logo
            ctx.fillStyle = '#f9a8d4';
            ctx.font = '10px Arial';
            ctx.fillText('SOAP', b.x + 10, b.y + 20);
            
            // Bubbles detail
            ctx.beginPath(); ctx.arc(b.x + b.w - 10, b.y + b.h - 10, 5, 0, Math.PI*2); ctx.fill();
         });

         // Launcher (Car + Sardar)
         // Sardar Character
         drawSardar(ctx, 30, 270);

         // Car
         ctx.fillStyle = '#ef4444'; // Red Car body
         ctx.beginPath();
         ctx.roundRect(40, 250, 60, 30, 8);
         ctx.fill();
         ctx.fillStyle = '#333'; // Wheels
         ctx.beginPath(); ctx.arc(55, 280, 8, 0, Math.PI*2); ctx.fill();
         ctx.beginPath(); ctx.arc(85, 280, 8, 0, Math.PI*2); ctx.fill();

         // Slingshot Band (Back)
         if (projectile.state === 'dragging') {
            ctx.strokeStyle = '#3E2723';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(anchor.x - 10, anchor.y);
            ctx.lineTo(projectile.x, projectile.y);
            ctx.stroke();
         }

         // Projectile (Mouse)
         if (projectile.state !== 'hit') {
            ctx.font = '20px Arial';
            ctx.fillText('🐀', projectile.x - 10, projectile.y + 5);
         }

         // Slingshot Band (Front)
         if (projectile.state === 'dragging') {
            ctx.strokeStyle = '#3E2723';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(anchor.x + 10, anchor.y);
            ctx.lineTo(projectile.x, projectile.y);
            ctx.stroke();
         }

         // Enemies (Mice / Bosses)
         enemies.forEach(g => {
            if (g.alive) {
               ctx.font = '24px Arial';
               ctx.fillText('🐀', g.x - 12, g.y + 8);
            }
         });
      };

      const update = () => {
         if (projectile.state === 'flying') {
            projectile.x += projectile.vx;
            projectile.y += projectile.vy;
            projectile.vy += 0.25; // Gravity

            // Collision with Ground
            if (projectile.y > 300 - projectile.r) {
               projectile.state = 'hit';
               setTimeout(resetProjectile, 1000);
            }

            // Collision with Buildings
            buildings.forEach(b => {
               if (projectile.x > b.x && projectile.x < b.x + b.w && projectile.y > b.y && projectile.y < b.y + b.h) {
                  projectile.state = 'hit';
                  setTimeout(resetProjectile, 1000);
               }
            });

            // Collision with Enemies
            enemies.forEach(g => {
               if (g.alive) {
                  const dx = projectile.x - g.x;
                  const dy = projectile.y - g.y;
                  const dist = Math.sqrt(dx*dx + dy*dy);
                  if (dist < projectile.r + g.r) {
                     g.alive = false;
                     setScore(s => s + 100);
                     projectile.state = 'hit'; // Stop projectile
                     setTimeout(resetProjectile, 500);
                  }
               }
            });
            
            // Out of bounds
            if (projectile.x > canvas.width + 50) {
               setTimeout(resetProjectile, 500);
            }
         }
         
         // Check Win Condition
         if (enemies.every(g => !g.alive)) {
            setGameState('won');
         }

         draw();
         animationFrame = requestAnimationFrame(update);
      };

      const resetProjectile = () => {
         if (mouseLeft > 0) {
            setMouseLeft(prev => {
               if (prev <= 1 && enemies.some(g => g.alive)) {
                   setGameState('lost'); // Last shot used and enemies remain
                   return 0;
               }
               return prev - 1;
            });
            projectile.x = anchor.x;
            projectile.y = anchor.y;
            projectile.vx = 0;
            projectile.vy = 0;
            projectile.state = 'idle';
         }
      };

      const handleMouseDown = (e: MouseEvent | TouchEvent) => {
         if (projectile.state !== 'idle') return;
         const rect = canvas.getBoundingClientRect();
         const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
         const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
         const mx = clientX - rect.left;
         const my = clientY - rect.top;

         // Check if clicking near anchor
         const dist = Math.sqrt((mx - anchor.x)**2 + (my - anchor.y)**2);
         if (dist < 40) {
            projectile.state = 'dragging';
            dragStart = { x: mx, y: my };
         }
      };

      const handleMouseMove = (e: MouseEvent | TouchEvent) => {
         if (projectile.state !== 'dragging') return;
         const rect = canvas.getBoundingClientRect();
         const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
         const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
         let mx = clientX - rect.left;
         let my = clientY - rect.top;

         // Limit drag distance
         const dx = mx - anchor.x;
         const dy = my - anchor.y;
         const dist = Math.sqrt(dx*dx + dy*dy);
         const maxDrag = 60;
         
         if (dist > maxDrag) {
            const angle = Math.atan2(dy, dx);
            mx = anchor.x + Math.cos(angle) * maxDrag;
            my = anchor.y + Math.sin(angle) * maxDrag;
         }

         projectile.x = mx;
         projectile.y = my;
      };

      const handleMouseUp = () => {
         if (projectile.state === 'dragging') {
            projectile.state = 'flying';
            // Calculate velocity based on drag
            const dx = anchor.x - projectile.x;
            const dy = anchor.y - projectile.y;
            const power = 0.25;
            projectile.vx = dx * power;
            projectile.vy = dy * power;
         }
      };

      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('touchstart', handleMouseDown);
      canvas.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);

      update();

      return () => {
         cancelAnimationFrame(animationFrame);
         canvas.removeEventListener('mousedown', handleMouseDown);
         canvas.removeEventListener('mousemove', handleMouseMove);
         window.removeEventListener('mouseup', handleMouseUp);
         canvas.removeEventListener('touchstart', handleMouseDown);
         canvas.removeEventListener('touchmove', handleMouseMove);
         window.removeEventListener('touchend', handleMouseUp);
      };
   }, [mouseLeft]); // Re-bind if shots change

   return (
      <div className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto bg-slate-900 p-6 rounded-3xl shadow-2xl border-4 border-red-500">
         <div className="flex justify-between w-full text-white items-center">
            <h3 className="font-bold text-xl flex items-center gap-2"><Car size={20}/> بازی سردار</h3>
            <div className="flex gap-4 text-sm">
               <span>امتیاز: {score}</span>
               <span>موش‌ها: {mouseLeft}</span>
            </div>
            <button onClick={onClose}><X/></button>
         </div>
         
         <div className="relative w-full">
            <canvas ref={canvasRef} width={500} height={350} className="bg-sky-200 rounded-xl w-full cursor-grab active:cursor-grabbing shadow-inner" />
            
            {gameState !== 'playing' && (
               <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-xl animate-fadeIn text-white">
                  {gameState === 'won' ? (
                     <>
                        <Trophy size={64} className="text-yellow-400 mb-4 animate-bounce"/>
                        <h2 className="text-3xl font-bold text-green-400">پیروزی!</h2>
                        <p className="mb-4">تمام دشمنان نابود شدند.</p>
                     </>
                  ) : (
                     <>
                        <Ghost size={64} className="text-gray-400 mb-4"/>
                        <h2 className="text-3xl font-bold text-red-400">باختید</h2>
                        <p className="mb-4">مهمات تمام شد!</p>
                     </>
                  )}
                  <button onClick={onClose} className="bg-blue-600 px-6 py-2 rounded-full font-bold hover:bg-blue-700">خروج</button>
               </div>
            )}
         </div>
         <p className="text-gray-400 text-xs">موش را بکشید و به سمت دشمنان روی صابون‌ها شلیک کنید!</p>
      </div>
   );
};

// --- GAME: Tic Tac Toe (XO) ---
const TicTacToeGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = (squares: string[]) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return squares.includes(null) ? null : 'Draw';
  };

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setWinner(checkWinner(newBoard));
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  useEffect(() => {
    if (!isXNext && !winner) {
      const timer = setTimeout(() => {
        const emptyIndices = board.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
        if (emptyIndices.length > 0) {
          const rand = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          handleClick(rand);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isXNext, winner, board]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto bg-gray-800 p-6 rounded-3xl shadow-2xl border-4 border-blue-500">
       <div className="flex justify-between w-full text-white items-center mb-2">
         <h3 className="font-bold text-xl flex items-center gap-2"><Square size={20}/> دوز (XO)</h3>
         <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X/></button>
       </div>
       <div className="grid grid-cols-3 gap-2 bg-gray-700 p-2 rounded-xl">
          {board.map((cell, i) => (
             <button key={i} onClick={() => handleClick(i)} className="w-20 h-20 bg-gray-600 rounded-lg text-4xl font-black text-white flex items-center justify-center hover:bg-gray-500 transition-colors">
                {cell === 'X' && <span className="text-blue-400">X</span>}
                {cell === 'O' && <span className="text-red-400">O</span>}
             </button>
          ))}
       </div>
       {winner && (
         <div className="text-center mt-2">
           <p className="text-white font-bold text-lg mb-2">{winner === 'Draw' ? 'مساوی شد!' : `برنده: ${winner}`}</p>
           <button onClick={reset} className="bg-blue-500 px-4 py-2 rounded-full text-white font-bold">بازی مجدد</button>
         </div>
       )}
    </div>
  );
};

// --- GAME: Hadith Quiz ---
const HadithQuiz: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  
  const questions = [
    { q: "پیامبر اکرم (ص): بهترین شما کسی است که ...", options: ["قرآن بیاموزد", "اخلاقش نیکوتر باشد", "نماز شب بخواند", "روزه بگیرد"], a: 1 },
    { q: "امام علی (ع): بزرگترین گناه ... است.", options: ["ناامیدی", "دروغ", "ظلم", "غیبت"], a: 0 },
    { q: "کدام سوره به قلب قرآن معروف است؟", options: ["رحمن", "یاسین", "بقره", "توحید"], a: 1 },
    { q: "معنی کلمه 'تقوا' چیست؟", options: ["ترس", "خویشتنداری", "عبادت", "علم"], a: 1 },
  ];

  const handleAnswer = (idx: number) => {
    setSelected(idx);
    setTimeout(() => {
      if (idx === questions[qIndex].a) setScore(score + 1);
      if (qIndex < questions.length - 1) {
        setQIndex(qIndex + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto bg-white p-6 rounded-3xl shadow-2xl border-4 border-green-500 text-center">
       {!showResult ? (
         <>
           <h3 className="font-bold text-xl text-green-700 mb-4">مسابقه احادیث</h3>
           <p className="text-black font-bold mb-6 text-lg">{questions[qIndex].q}</p>
           <div className="space-y-3 w-full">
              {questions[qIndex].options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`w-full p-3 rounded-xl border-2 font-bold transition-all ${
                    selected === i 
                      ? i === questions[qIndex].a ? 'bg-green-500 text-white border-green-600' : 'bg-red-500 text-white border-red-600'
                      : 'border-gray-200 hover:bg-gray-50 text-black'
                  }`}
                >
                  {opt}
                </button>
              ))}
           </div>
           <p className="text-gray-400 text-xs mt-4">سوال {qIndex + 1} از {questions.length}</p>
         </>
       ) : (
         <>
           <Trophy size={64} className="text-yellow-400 mb-4" />
           <h2 className="text-2xl font-black text-gray-800">پایان آزمون</h2>
           <p className="text-lg my-4">امتیاز شما: {score} از {questions.length}</p>
           <div className="flex gap-2 w-full">
             <button onClick={onClose} className="flex-1 bg-gray-200 py-3 rounded-xl font-bold">خروج</button>
             <button onClick={() => { setQIndex(0); setScore(0); setShowResult(false); setSelected(null); }} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold">تکرار</button>
           </div>
         </>
       )}
    </div>
  );
};

// --- GAME: Escape from Sin (Dino) ---
const DinoGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cactus: {x: number, h: number}[] = [];
    let player = { y: 0, dy: 0, jumping: false };
    let frame = 0;
    let gameRunning = true;
    let animationFrameId: number;

    const loop = () => {
      if (!gameRunning) return;
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ground
      ctx.fillStyle = '#555';
      ctx.fillRect(0, 180, canvas.width, 2);

      // Player
      if (player.jumping) {
        player.dy += 0.6; // Gravity
        player.y += player.dy;
        if (player.y > 0) { player.y = 0; player.jumping = false; player.dy = 0; }
      }
      
      const pY = 150 + player.y;
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(30, pY, 30, 30); // Player Body
      ctx.fillStyle = '#fff';
      ctx.fillText('🏃', 35, pY + 20);

      // Obstacles (Sins)
      if (frame % 100 === 0) {
        cactus.push({ x: canvas.width, h: 30 + Math.random() * 20 });
      }

      for (let i = 0; i < cactus.length; i++) {
        let c = cactus[i];
        c.x -= 4; // Speed
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(c.x, 180 - c.h, 20, c.h);
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.fillText('گناه', c.x - 2, 180 - c.h - 5);

        // Collision
        if (30 + 20 > c.x && 30 < c.x + 20 && pY + 30 > 180 - c.h) {
           gameRunning = false;
           setGameOver(true);
        }
      }
      
      // Cleanup
      cactus = cactus.filter(c => c.x > -50);
      
      // Score
      if (frame % 10 === 0) setScore(s => s + 1);

      animationFrameId = requestAnimationFrame(loop);
    };

    const jump = () => {
       if (!player.jumping && gameRunning) {
         player.jumping = true;
         player.dy = -10;
       }
    };

    window.addEventListener('keydown', jump);
    canvas.addEventListener('mousedown', jump);
    canvas.addEventListener('touchstart', jump);
    
    loop();

    return () => {
      gameRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', jump);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto bg-gray-900 p-6 rounded-3xl shadow-2xl border-4 border-red-500">
       <div className="flex justify-between w-full text-white items-center">
         <h3 className="font-bold text-xl">فرار از گناه</h3>
         <button onClick={onClose}><X/></button>
       </div>
       <canvas ref={canvasRef} width={300} height={200} className="bg-gray-100 rounded-xl w-full cursor-pointer" />
       {gameOver && (
          <div className="text-white text-center">
             <h2 className="text-2xl font-bold text-red-500">باختید!</h2>
             <p>امتیاز: {score}</p>
             <button onClick={() => { setGameOver(false); setScore(0); /* Rough reload for simplicity */ onClose(); }} className="mt-2 bg-blue-500 px-4 py-2 rounded">خروج</button>
          </div>
       )}
       {!gameOver && <p className="text-gray-400 text-sm">برای پرش کلیک کنید یا Space بزنید</p>}
    </div>
  );
};

// --- GAME: Resistance Tank (Atari Style) ---
const TankGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Game State Refs to avoid closure staleness in loop
  const playerRef = useRef({ x: 150 });
  const bulletsRef = useRef<{x: number, y: number}[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let enemies: {x: number, y: number}[] = [];
    let frame = 0;
    let gameRunning = true;
    let animationFrameId: number;

    const loop = () => {
      if (!gameRunning) return;
      frame++;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Player Tank
      const pX = playerRef.current.x;
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(pX - 10, 260, 20, 20);
      ctx.fillRect(pX - 2, 250, 4, 10); // Barrel

      // Enemies
      if (frame % 60 === 0) {
        enemies.push({ x: Math.random() * 280 + 10, y: -20 });
      }

      // Bullets Update
      bulletsRef.current.forEach(b => { b.y -= 5; });
      ctx.fillStyle = '#fbbf24';
      bulletsRef.current.forEach(b => ctx.fillRect(b.x - 2, b.y, 4, 6));

      // Enemies Update
      enemies.forEach(e => {
        e.y += 1;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(e.x - 10, e.y, 20, 20); // Enemy Tank
        
        // Collision with Player
        if (Math.abs(e.x - pX) < 20 && e.y > 240) {
           gameRunning = false;
           setGameOver(true);
        }
      });

      // Bullet Hit Logic
      bulletsRef.current = bulletsRef.current.filter(b => {
         let hit = false;
         enemies = enemies.filter(e => {
            if (Math.abs(b.x - e.x) < 15 && Math.abs(b.y - e.y) < 15) {
               hit = true;
               setScore(s => s + 10);
               return false;
            }
            return true;
         });
         return !hit && b.y > 0;
      });
      
      // Cleanup Enemies
      enemies = enemies.filter(e => e.y < 300);

      animationFrameId = requestAnimationFrame(loop);
    };

    const handleInput = (e: KeyboardEvent) => {
       if (e.key === 'ArrowLeft') playerRef.current.x = Math.max(10, playerRef.current.x - 10);
       if (e.key === 'ArrowRight') playerRef.current.x = Math.min(290, playerRef.current.x + 10);
       if (e.key === ' ') bulletsRef.current.push({ x: playerRef.current.x, y: 250 });
    };

    window.addEventListener('keydown', handleInput);
    loop();

    return () => {
       gameRunning = false;
       cancelAnimationFrame(animationFrameId);
       window.removeEventListener('keydown', handleInput);
    };
  }, []);

  // Controls for buttons
  const moveLeft = () => { playerRef.current.x = Math.max(10, playerRef.current.x - 10); };
  const moveRight = () => { playerRef.current.x = Math.min(290, playerRef.current.x + 10); };
  const fire = () => { bulletsRef.current.push({ x: playerRef.current.x, y: 250 }); };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto bg-slate-800 p-6 rounded-3xl shadow-2xl border-4 border-green-600">
       <div className="flex justify-between w-full text-white items-center">
         <h3 className="font-bold text-xl">تانک مقاومت</h3>
         <button onClick={onClose}><X/></button>
       </div>
       <canvas ref={canvasRef} width={300} height={300} className="bg-black/50 rounded-xl w-full border border-white/10" />
       {gameOver ? (
          <div className="text-white text-center">
             <h2 className="text-2xl font-bold text-red-500">بازی تمام شد</h2>
             <p>امتیاز: {score}</p>
             <button onClick={onClose} className="mt-2 bg-blue-500 px-4 py-2 rounded">خروج</button>
          </div>
       ) : (
          <div className="flex gap-4 w-full justify-center select-none">
             <button className="bg-white/10 p-4 rounded-full text-white active:bg-white/30" onTouchStart={moveLeft} onClick={moveLeft}>Left</button>
             <button className="bg-red-500/80 p-4 rounded-full text-white font-bold active:bg-red-500" onTouchStart={fire} onClick={fire}>FIRE</button>
             <button className="bg-white/10 p-4 rounded-full text-white active:bg-white/30" onTouchStart={moveRight} onClick={moveRight}>Right</button>
          </div>
       )}
    </div>
  );
};

// --- Checkers Game (Existing) ---
const BOARD_SIZE = 8;
type Piece = { player: 'red' | 'black', isKing: boolean } | null;
const CheckersGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [board, setBoard] = useState<Piece[][]>([]);
  const [turn, setTurn] = useState<'red' | 'black'>('red');
  const [selected, setSelected] = useState<{r: number, c: number} | null>(null);
  const [validMoves, setValidMoves] = useState<{r: number, c: number}[]>([]);

  useEffect(() => {
    const newBoard: Piece[][] = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if ((r + c) % 2 === 1) {
          if (r < 3) newBoard[r][c] = { player: 'black', isKing: false };
          if (r > 4) newBoard[r][c] = { player: 'red', isKing: false };
        }
      }
    }
    setBoard(newBoard);
  }, []);

  const getValidMoves = (r: number, c: number, piece: Piece, currentBoard: Piece[][]) => {
    if (!piece) return [];
    const moves: {r: number, c: number}[] = [];
    const directions = piece.isKing ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : piece.player === 'red' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];

    directions.forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
        if (!currentBoard[nr][nc]) {
          moves.push({r: nr, c: nc});
        } else if (currentBoard[nr][nc]?.player !== piece.player) {
          const nnr = nr + dr;
          const nnc = nc + dc;
          if (nnr >= 0 && nnr < BOARD_SIZE && nnc >= 0 && nnc < BOARD_SIZE && !currentBoard[nnr][nnc]) {
            moves.push({r: nnr, c: nnc});
          }
        }
      }
    });
    return moves;
  };

  const handleSquareClick = (r: number, c: number) => {
    if (board[r][c]?.player === turn) {
      setSelected({r, c});
      setValidMoves(getValidMoves(r, c, board[r][c], board));
      return;
    }
    if (selected) {
      const isValid = validMoves.some(m => m.r === r && m.c === c);
      if (isValid) {
        const newBoard = [...board.map(row => [...row])];
        const piece = newBoard[selected.r][selected.c]!;
        newBoard[r][c] = piece;
        newBoard[selected.r][selected.c] = null;
        if (Math.abs(r - selected.r) === 2) {
          const mr = (r + selected.r) / 2;
          const mc = (c + selected.c) / 2;
          newBoard[mr][mc] = null;
        }
        if ((piece.player === 'red' && r === 0) || (piece.player === 'black' && r === BOARD_SIZE - 1)) {
          piece.isKing = true;
        }
        setBoard(newBoard);
        setTurn(turn === 'red' ? 'black' : 'red');
        setSelected(null);
        setValidMoves([]);
      } else {
        if (!board[r][c]) {
           setSelected(null);
           setValidMoves([]);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto bg-gray-800 p-6 rounded-3xl shadow-2xl border-4 border-yellow-600">
      <div className="flex justify-between w-full text-white items-center mb-2">
         <h3 className="font-bold text-xl flex items-center gap-2"><Gamepad2/> دوز (Checkers)</h3>
         <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X/></button>
      </div>
      <div className="bg-amber-100 p-2 rounded-lg shadow-inner">
        <div className="grid grid-cols-8 gap-0 border-4 border-amber-900 rounded-sm">
          {board.map((row, r) => (
            row.map((piece, c) => {
              const isDark = (r + c) % 2 === 1;
              const isSelected = selected?.r === r && selected?.c === c;
              const isValid = validMoves.some(m => m.r === r && m.c === c);
              return (
                <div key={`${r}-${c}`} onClick={() => handleSquareClick(r, c)} className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center cursor-pointer relative ${isDark ? 'bg-amber-800' : 'bg-amber-200'} ${isValid ? 'ring-inset ring-4 ring-green-400' : ''}`}>
                  {isValid && <div className="absolute w-3 h-3 bg-green-500 rounded-full opacity-50"></div>}
                  {piece && (
                    <div className={`w-[80%] h-[80%] rounded-full shadow-lg border-2 transition-transform duration-200 ${piece.player === 'red' ? 'bg-red-600 border-red-800' : 'bg-gray-900 border-black'} ${piece.isKing ? 'ring-2 ring-yellow-400' : ''} ${isSelected ? 'scale-110 ring-2 ring-white' : ''}`}>
                      {piece.isKing && <div className="flex justify-center items-center h-full text-yellow-400 text-xs">👑</div>}
                    </div>
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Spinner Game ---
const SpinnerGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<Reward | null>(null);

  const spinWheel = () => {
    if (spinning || result) return;
    setSpinning(true);
    const randomDegree = Math.floor(Math.random() * 360) + (5 * 360);
    const newRotation = rotation + randomDegree;
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      const normalizedRotation = newRotation % 360;
      const sliceAngle = 360 / rewards.length;
      const index = Math.floor(((360 - (normalizedRotation % 360)) % 360) / sliceAngle);
      setResult(rewards[index]);
    }, 4000);
  };

  const resetSpinner = () => {
    setResult(null);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto bg-gradient-to-b from-purple-900 to-indigo-900 p-8 rounded-[2rem] shadow-2xl border-4 border-purple-300 relative overflow-hidden">
      <div className="flex justify-between w-full text-white items-center z-10">
         <h3 className="font-bold text-xl flex items-center gap-2 text-purple-100"><Gift className="text-yellow-400"/> گردونه پاداش</h3>
         <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X/></button>
      </div>
      <div className="relative mt-4 group">
         <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-8 h-10">
            <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-yellow-400 drop-shadow-lg"></div>
         </div>
         <div className="w-72 h-72 rounded-full border-8 border-white/20 shadow-2xl relative transition-transform duration-[4000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]" style={{ transform: `rotate(${rotation}deg)` }}>
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
               {rewards.map((reward, i) => {
                 const angle = 360 / rewards.length;
                 const startAngle = i * angle;
                 const endAngle = (i + 1) * angle;
                 const x1 = 50 + 50 * Math.cos(Math.PI * startAngle / 180);
                 const y1 = 50 + 50 * Math.sin(Math.PI * startAngle / 180);
                 const x2 = 50 + 50 * Math.cos(Math.PI * endAngle / 180);
                 const y2 = 50 + 50 * Math.sin(Math.PI * endAngle / 180);
                 return ( <path key={reward.id} d={`M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`} fill={reward.color} stroke="white" strokeWidth="0.5" /> );
               })}
            </svg>
            {rewards.map((reward, i) => {
               const angle = 360 / rewards.length;
               const midAngle = (i * angle) + (angle / 2);
               return ( <div key={reward.id} className="absolute top-1/2 left-1/2 w-full h-full origin-top-left -translate-y-1/2 flex items-center justify-center" style={{ transform: `rotate(${midAngle}deg) translate(0, -50%)`, pointerEvents: 'none' }}> <div className="absolute text-white font-bold text-xs" style={{ transform: `translateX(35%) rotate(90deg)` }}> {reward.label} </div> </div> );
            })}
         </div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-inner border-4 border-gray-100 z-10 flex items-center justify-center">
            <div className="w-8 h-8 bg-purple-600 rounded-full animate-pulse"></div>
         </div>
      </div>
      <button onClick={spinWheel} disabled={spinning || !!result} className={`mt-4 px-10 py-3 rounded-full font-black text-lg shadow-[0_5px_0_rgb(0,0,0,0.2)] active:shadow-none active:translate-y-[5px] transition-all ${spinning || result ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-yellow-400 text-purple-900 hover:bg-yellow-300'}`}> {spinning ? 'در حال چرخش...' : 'بچرخان!'} </button>
      {result && (
        <div className="absolute inset-0 bg-black/80 z-30 flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white text-center p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-slideUp border-t-8" style={{ borderColor: result.color }}>
             <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto -mt-12 mb-4 shadow-lg text-white text-2xl" style={{ backgroundColor: result.color }}>
                {result.type === 'hadith' ? '📖' : result.type === 'dhikr' ? '📿' : '🤝'}
             </div>
             <h4 className="text-xl font-bold text-gray-800 mb-2">{result.label}</h4>
             <p className="text-gray-600 text-sm leading-7 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">{result.content}</p>
             <button onClick={resetSpinner} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-2"> <RotateCw size={16}/> چرخش مجدد </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
const Game: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'arcade' | 'completed'>('start');
  const [activeGame, setActiveGame] = useState<'none' | 'checkers' | 'xo' | 'spinner' | 'dino' | 'tank' | 'quiz' | 'sardar'>('none');
  
  const [charConfig, setCharConfig] = useState<CharacterConfig>({
    name: '',
    gender: 'male',
    skinTone: 'medium',
    headwear: 'none',
    headwearColor: '#374151',
    eyewear: 'none',
    beard: 'none',
    outfit: 'casual',
    color: 'blue'
  });

  const [currentStep, setCurrentStep] = useState(0); 
  const [modalOpen, setModalOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<{ text: string; author: string } | null>(null);

  const triggerCollect = (item: { id: string; name: string; icon: string; description: string }) => {
    const event = new CustomEvent('collect-item', { detail: item });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    const saved = localStorage.getItem('hamim_game_state_v3');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure new fields exist in old saves
      const mergedConfig = {
          ...charConfig,
          ...parsed.charConfig
      };
      setCharConfig(mergedConfig);
      setCurrentStep(parsed.currentStep);
      if (parsed.currentStep >= steps.length) setGameState('completed');
    }
  }, []);

  useEffect(() => {
    if (gameState !== 'start' && gameState !== 'arcade') {
      localStorage.setItem('hamim_game_state_v3', JSON.stringify({
        charConfig,
        currentStep
      }));
    }
  }, [charConfig, currentStep, gameState]);

  const updateConfig = (key: keyof CharacterConfig, value: any) => {
    setCharConfig(prev => ({ ...prev, [key]: value }));
  };

  const startGame = () => {
    if (!charConfig.name.trim()) return;
    setGameState('playing');
    setCurrentStep(0);
  };

  const resetGame = () => {
    setGameState('start');
    setCurrentStep(0);
    localStorage.removeItem('hamim_game_state_v3');
  };

  const handleStepClick = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
    setModalOpen(true);
  };

  const advanceStep = () => {
    setModalOpen(false);
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep === steps.length) {
        setGameState('completed');
        // Trigger Tasbih Collection
        triggerCollect({
           id: 'item-tasbih',
           name: 'تسبیح ملکوت',
           icon: 'tasbih',
           description: 'پاداش صبر و استقامت در مسیر بندگی. ذکر خدا آرام‌بخش دل‌هاست.'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 pt-8 relative z-10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-blue-900 mb-2">مسیر نورانی رشد</h1>
          <p className="text-gray-500 text-sm">طراحی شخصیت و سفر در مسیر دانایی</p>
        </div>

        {/* --- START SCREEN with ARCADE OPTION --- */}
        {gameState === 'start' && (
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Quick Access Arcade Button */}
            <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 rounded-3xl p-6 shadow-xl flex items-center justify-between text-white transform hover:scale-[1.02] transition-all cursor-pointer" onClick={() => setGameState('arcade')}>
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                     <Gamepad2 size={32} />
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold">اتاق بازی (بدون ثبت نام)</h2>
                     <p className="text-indigo-100 text-sm">همین حالا بازی کنید: دوز، تانک، فرار از گناه و ...</p>
                  </div>
               </div>
               <div className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                  <Play size={18} fill="currentColor" />
                  شروع بازی
               </div>
            </div>

            {/* Character Creator */}
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
              {/* Left: Preview Area */}
              <div className="w-full md:w-5/12 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-l border-gray-100 min-h-[500px] relative">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                 <h3 className="font-bold text-gray-700 mb-6 z-10">پیش‌نمایش شخصیت</h3>
                 <div className="relative group cursor-pointer transition-transform hover:scale-105 duration-500 h-[400px] flex items-center justify-center z-10">
                    <div className="absolute inset-0 bg-white rounded-full blur-3xl opacity-50 w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    <VectorCharacterAvatar config={charConfig} size={320} />
                 </div>
                 <div className="mt-8 text-center w-full z-10">
                    <span className="inline-block px-6 py-2 bg-white rounded-full text-lg font-bold text-blue-800 shadow-md border border-blue-100 w-full max-w-xs">
                      {charConfig.name || "نام قهرمان"}
                    </span>
                 </div>
              </div>

              {/* Right: Controls */}
              <div className="w-full md:w-7/12 p-8 space-y-6 h-[600px] overflow-y-auto scrollbar-thin">
                 <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Sparkles size={18} />
                    <span className="font-bold text-sm">شخصیت خود را بسازید</span>
                 </div>
                 
                 <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">نام شما</label>
                    <input 
                      type="text" 
                      value={charConfig.name}
                      onChange={(e) => updateConfig('name', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black"
                      placeholder="نام خود را وارد کنید..."
                    />
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-xs font-bold text-gray-900 mb-2">جنسیت</label>
                       <div className="flex bg-gray-200 p-1 rounded-lg">
                          <button onClick={() => updateConfig('gender', 'male')} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${charConfig.gender === 'male' ? 'bg-white shadow text-blue-800' : 'text-gray-900'}`}>آقا</button>
                          <button onClick={() => updateConfig('gender', 'female')} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${charConfig.gender === 'female' ? 'bg-white shadow text-pink-700' : 'text-gray-900'}`}>خانم</button>
                       </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-2">رنگ پوست</label>
                      <div className="flex gap-2">
                        {['light', 'medium', 'dark'].map((tone) => (
                          <button 
                            key={tone}
                            onClick={() => updateConfig('skinTone', tone)}
                            className={`w-10 h-10 rounded-full border-4 transition-transform hover:scale-110 ${charConfig.skinTone === tone ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
                            style={{ backgroundColor: tone === 'light' ? '#FDE4C8' : tone === 'medium' ? '#EAC096' : '#8D5524' }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Outfit Selection */}
                    <div className="sm:col-span-2">
                       <label className="block text-xs font-bold text-gray-900 mb-2">لباس و پوشش</label>
                       <div className="flex flex-wrap gap-2">
                          <button onClick={() => updateConfig('outfit', 'casual')} className={`px-3 py-2 rounded-lg border text-sm ${charConfig.outfit === 'casual' ? 'bg-blue-50 border-blue-500 font-bold text-blue-800' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}>معمولی</button>
                          <button onClick={() => updateConfig('outfit', 'shirt_pants')} className={`px-3 py-2 rounded-lg border text-sm ${charConfig.outfit === 'shirt_pants' ? 'bg-blue-50 border-blue-500 font-bold text-blue-800' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}>پیراهن و شلوار</button>
                          <button onClick={() => updateConfig('outfit', 'suit')} className={`px-3 py-2 rounded-lg border text-sm ${charConfig.outfit === 'suit' ? 'bg-blue-50 border-blue-500 font-bold text-blue-800' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}>رسمی</button>
                          <button onClick={() => updateConfig('outfit', 'coat')} className={`px-3 py-2 rounded-lg border text-sm ${charConfig.outfit === 'coat' ? 'bg-blue-50 border-blue-500 font-bold text-blue-800' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}>پالتو</button>
                          <button onClick={() => updateConfig('outfit', 'scholar_gown')} className={`px-3 py-2 rounded-lg border text-sm ${charConfig.outfit === 'scholar_gown' ? 'bg-blue-50 border-blue-500 font-bold text-blue-800' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}>لباس فارغ‌التحصیلی</button>
                          
                          {/* Male Specific Outfits */}
                          {charConfig.gender === 'male' && (
                            <>
                              <button onClick={() => updateConfig('outfit', 'cleric')} className={`px-3 py-2 rounded-lg border text-sm ${charConfig.outfit === 'cleric' ? 'bg-blue-50 border-blue-500 font-bold text-blue-800' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}>روحانی</button>
                              <button onClick={() => updateConfig('outfit', 'abaya')} className={`px-3 py-2 rounded-lg border text-sm ${charConfig.outfit === 'abaya' ? 'bg-blue-50 border-blue-500 font-bold text-blue-800' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}>دشداشه</button>
                            </>
                          )}
                          
                          {/* Female Specific Outfits */}
                          {charConfig.gender === 'female' && (
                             <button onClick={() => updateConfig('outfit', 'chador')} className={`px-3 py-2 rounded-lg border text-sm ${charConfig.outfit === 'chador' ? 'bg-blue-50 border-blue-500 font-bold text-blue-800' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}>چادر</button>
                          )}
                       </div>
                    </div>

                    {/* Headwear Selection - Separate Menus */}
                    <div className="sm:col-span-2">
                       <label className="block text-xs font-bold text-gray-900 mb-2">پوشش سر</label>
                       
                       {/* Render different options based on Gender for clarity */}
                       {charConfig.gender === 'male' ? (
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <button onClick={() => updateConfig('headwear', 'none')} className={`p-2 rounded-lg border text-xs ${charConfig.headwear === 'none' ? 'bg-blue-100 border-blue-500 font-bold text-blue-900' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}>بدون کلاه</button>
                            <button onClick={() => updateConfig('headwear', 'kufi')} className={`p-2 rounded-lg border text-xs ${charConfig.headwear === 'kufi' ? 'bg-blue-100 border-blue-500 font-bold text-blue-900' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}>عرقچین</button>
                            <button onClick={() => updateConfig('headwear', 'turban_white')} className={`p-2 rounded-lg border text-xs ${charConfig.headwear === 'turban_white' ? 'bg-blue-100 border-blue-500 font-bold text-blue-900' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}>عمامه سفید</button>
                            <button onClick={() => updateConfig('headwear', 'turban_black')} className={`p-2 rounded-lg border text-xs ${charConfig.headwear === 'turban_black' ? 'bg-blue-100 border-blue-500 font-bold text-blue-900' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}>عمامه مشکی</button>
                            <button onClick={() => updateConfig('headwear', 'hat')} className={`p-2 rounded-lg border text-xs ${charConfig.headwear === 'hat' ? 'bg-blue-100 border-blue-500 font-bold text-blue-900' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}>کلاه لبه‌دار</button>
                            <button onClick={() => updateConfig('headwear', 'pirate_hat')} className={`p-2 rounded-lg border text-xs ${charConfig.headwear === 'pirate_hat' ? 'bg-blue-100 border-blue-500 font-bold text-blue-900' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}>کلاه دزد دریایی</button>
                            <button onClick={() => updateConfig('headwear', 'space_helmet')} className={`p-2 rounded-lg border text-xs ${charConfig.headwear === 'space_helmet' ? 'bg-blue-100 border-blue-500 font-bold text-blue-900' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}>کلاه فضایی</button>
                            <button onClick={() => updateConfig('headwear', 'scholar_cap')} className={`p-2 rounded-lg border text-xs ${charConfig.headwear === 'scholar_cap' ? 'bg-blue-100 border-blue-500 font-bold text-blue-900' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}>کلاه فارغ‌التحصیلی</button>
                         </div>
                       ) : (
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                             <button onClick={() => updateConfig('headwear', 'scarf')} className={`p-2 rounded-lg border text-xs ${charConfig.headwear === 'scarf' ? 'bg-pink-100 border-pink-500 font-bold text-pink-900' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}>روسری / مقنعه</button>
                             <button onClick={() => updateConfig('headwear', 'hat')} className={`p-2 rounded-lg border text-xs ${charConfig.headwear === 'hat' ? 'bg-pink-100 border-pink-500 font-bold text-pink-900' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}>کلاه لبه‌دار</button>
                             <button onClick={() => updateConfig('headwear', 'pirate_hat')} className={`p-2 rounded-lg border text-xs ${charConfig.headwear === 'pirate_hat' ? 'bg-pink-100 border-pink-500 font-bold text-pink-900' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}>کلاه دزد دریایی</button>
                             <button onClick={() => updateConfig('headwear', 'space_helmet')} className={`p-2 rounded-lg border text-xs ${charConfig.headwear === 'space_helmet' ? 'bg-pink-100 border-pink-500 font-bold text-pink-900' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}>کلاه فضایی</button>
                             <button onClick={() => updateConfig('headwear', 'scholar_cap')} className={`p-2 rounded-lg border text-xs ${charConfig.headwear === 'scholar_cap' ? 'bg-pink-100 border-pink-500 font-bold text-pink-900' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}>کلاه فارغ‌التحصیلی</button>
                             <button onClick={() => updateConfig('headwear', 'none')} className={`p-2 rounded-lg border text-xs ${charConfig.headwear === 'none' ? 'bg-pink-100 border-pink-500 font-bold text-pink-900' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}>بدون کلاه</button>
                         </div>
                       )}

                       {/* Headwear Color Picker (Only for colored items) */}
                       {['scarf', 'hat', 'pirate_hat', 'scholar_cap'].includes(charConfig.headwear) && (
                          <div className="mt-3 flex items-center gap-2 animate-fadeIn">
                             <Palette size={16} className="text-gray-900" />
                             <span className="text-xs text-gray-900 font-bold">رنگ:</span>
                             <div className="flex gap-1">
                                {['#18181B', '#047857', '#B91C1C', '#1D4ED8', '#EAB308', '#7E22CE', '#BE185D'].map(c => (
                                   <button 
                                      key={c} 
                                      onClick={() => updateConfig('headwearColor', c)} 
                                      className={`w-6 h-6 rounded-full border border-gray-400 ${charConfig.headwearColor === c ? 'ring-2 ring-blue-400 scale-110' : ''}`}
                                      style={{ backgroundColor: c }}
                                   />
                                ))}
                             </div>
                          </div>
                       )}
                    </div>

                    <div className="flex flex-col gap-4">
                       <div>
                         <label className="block text-xs font-bold text-gray-900 mb-2">عینک</label>
                         <div className="flex gap-2">
                            <button onClick={() => updateConfig('eyewear', 'none')} className={`flex-1 p-2 rounded-lg border ${charConfig.eyewear === 'none' ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold' : 'bg-white text-black border-gray-300'}`}>هیچ</button>
                            <button onClick={() => updateConfig('eyewear', 'glasses')} className={`flex-1 p-2 rounded-lg border ${charConfig.eyewear === 'glasses' ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold' : 'bg-white text-black border-gray-300'}`}>طبی</button>
                            <button onClick={() => updateConfig('eyewear', 'sunglasses')} className={`flex-1 p-2 rounded-lg border ${charConfig.eyewear === 'sunglasses' ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold' : 'bg-white text-black border-gray-300'}`}>آفتابی</button>
                         </div>
                       </div>
                       {charConfig.gender === 'male' && (
                          <div>
                            <label className="block text-xs font-bold text-gray-900 mb-2">محاسن (ریش)</label>
                            <select value={charConfig.beard} onChange={(e) => updateConfig('beard', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-black text-sm font-medium">
                                <option value="none">بدون ریش</option>
                                <option value="stubble">ته‌ریش</option>
                                <option value="full">ریش کامل</option>
                                <option value="long">ریش بلند</option>
                             </select>
                          </div>
                       )}
                    </div>
                 </div>

                 <button
                    onClick={startGame}
                    disabled={!charConfig.name.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg mt-8 transition-all flex items-center justify-center gap-2"
                  >
                    <Check />
                    تایید و شروع بازی
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MAIN GAMEPLAY --- */}
        {(gameState === 'playing' || gameState === 'arcade') && (
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6 sticky top-24">
                 {/* Show Profile only if playing as character, else show Guest Info */}
                 {gameState === 'playing' ? (
                   <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col items-center text-center overflow-hidden relative">
                      <div className="mb-4 transform hover:scale-105 transition-transform w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 bg-blue-50 flex items-center justify-center">
                         <div className="scale-75 translate-y-2">
                            <VectorCharacterAvatar config={charConfig} size={150} />
                         </div>
                      </div>
                      <h3 className="font-bold text-lg text-gray-800">{charConfig.name}</h3>
                      <p className="text-xs text-gray-500 mb-4">{charConfig.gender === 'male' ? 'مسافر راه حق' : 'بانوی مسیر نور'}</p>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                         <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(currentStep / steps.length) * 100}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-400">پیشرفت: {Math.round((currentStep / steps.length) * 100)}%</span>
                   </div>
                 ) : (
                   <div className="bg-[#1e1b4b] rounded-3xl p-6 shadow-lg text-white text-center border-4 border-purple-500">
                      <div className="w-32 h-32 mx-auto mb-4 bg-black/30 rounded-full flex items-center justify-center border-4 border-purple-300 shadow-inner">
                         <VectorCharacterAvatar config={charConfig} size={100} />
                      </div>
                      <h3 className="font-bold text-xl mb-2 font-mono tracking-widest text-yellow-400">ARCADE</h3>
                      <p className="text-sm opacity-90 mb-4 font-mono">حالت مهمان</p>
                      <button onClick={resetGame} className="w-full bg-yellow-500 text-black py-2 rounded-xl font-bold text-sm hover:bg-yellow-400 font-mono shadow-[0_4px_0_rgb(180,83,9)] active:translate-y-1 active:shadow-none transition-all">خروج</button>
                   </div>
                 )}

                 <div className="space-y-2">
                    {gameState === 'playing' && (
                      <button 
                         onClick={() => { setActiveGame('none'); }}
                         className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold bg-blue-600 text-white shadow-md transition-all"
                      >
                         <MapIcon size={18} />
                         نقشه گنج (مسیر)
                      </button>
                    )}
                    <button 
                       onClick={() => { if(gameState === 'playing') setGameState('arcade'); else setActiveGame('none'); }}
                       className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${gameState === 'arcade' ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                       <Gamepad2 size={18} />
                       لیست بازی‌ها
                    </button>
                    {gameState === 'playing' && (
                       <button onClick={resetGame} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all">
                          <RefreshCcw size={18} />
                          خروج / شروع مجدد
                       </button>
                    )}
                 </div>
              </div>

              {/* Main Area */}
              <div className="lg:col-span-3">
                 {/* GAME PATH VIEW - TREASURE MAP STYLE */}
                 {gameState === 'playing' && activeGame === 'none' && (
                    <div className="bg-[#fdf6e3] rounded-3xl p-8 shadow-xl border-4 border-[#d4c5a0] min-h-[700px] relative overflow-hidden">
                        {/* Map Background Pattern */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')" }}></div>
                        <div className="absolute top-0 right-0 p-8 opacity-20"><Compass size={120} /></div>
                        
                        <div className="flex justify-between items-center mb-8 border-b-2 border-[#d4c5a0]/50 pb-4 relative z-10">
                           <h2 className="text-2xl font-black text-[#5c4033] flex items-center gap-2">
                             <MapIcon className="text-orange-600" />
                             نقشه گنج معنوی
                           </h2>
                           <button onClick={handleStepClick} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all">
                              <Sparkles size={16} />
                              باز کردن صندوقچه مرحله بعد
                           </button>
                        </div>
                        
                        <div className="relative p-4 md:p-10 flex flex-col items-center space-y-12 z-10">
                           {/* Dotted Connecting Line */}
                           <div className="absolute top-20 bottom-20 left-1/2 w-1 border-r-4 border-dashed border-[#a89070] -translate-x-1/2 hidden md:block opacity-50"></div>

                           {steps.map((step, index) => {
                              const isCompleted = index < currentStep;
                              const isCurrent = index === currentStep;
                              // Alternate left/right alignment for snake effect
                              const alignClass = index % 2 === 0 ? "md:mr-auto md:ml-12" : "md:ml-auto md:mr-12";
                              
                              return (
                                 <div key={step.id} className={`relative w-full md:w-5/12 ${alignClass} transition-all duration-700 ${isCurrent ? 'scale-105 z-20' : 'opacity-80 hover:opacity-100'}`}>
                                    {/* Connector Dot for Desktop */}
                                    <div className={`absolute top-1/2 ${index % 2 === 0 ? '-right-14 translate-x-1/2' : '-left-14 -translate-x-1/2'} w-6 h-6 rounded-full border-4 border-[#fdf6e3] hidden md:block ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>

                                    <div className={`bg-white rounded-2xl p-4 shadow-[0_5px_15px_rgba(0,0,0,0.05)] border-2 flex items-center gap-4 ${isCompleted ? 'border-green-400 bg-green-50' : isCurrent ? 'border-blue-500 ring-4 ring-blue-100/50' : 'border-[#d4c5a0] grayscale opacity-70'}`}>
                                       <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-white font-bold shadow-md ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-600' : 'bg-gray-400'}`}>
                                          {isCompleted ? <Check size={24} /> : isCurrent ? <User size={24}/> : <span className="text-lg">{index + 1}</span>}
                                       </div>
                                       <div>
                                          <h4 className={`font-bold text-lg ${isCurrent ? 'text-blue-800' : 'text-gray-700'}`}>{step.title}</h4>
                                          <p className="text-xs text-gray-500">{step.description}</p>
                                       </div>
                                       {isCurrent && (
                                          <div className="mr-auto text-blue-500 animate-bounce">
                                             <Flag fill="currentColor" />
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              );
                           })}
                           
                           {/* Final Treasure Chest */}
                           <div className="relative mt-8 animate-bounce">
                              <div className="w-20 h-20 bg-yellow-400 rounded-xl flex items-center justify-center border-4 border-yellow-600 shadow-xl text-yellow-900">
                                 <Trophy size={40} />
                              </div>
                              <div className="absolute -bottom-2 w-20 h-4 bg-black/20 rounded-full blur-sm"></div>
                           </div>
                        </div>
                    </div>
                 )}

                 {/* ARCADE VIEW */}
                 {(gameState === 'arcade' || (gameState === 'playing' && activeGame !== 'none')) && (
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 min-h-[600px]">
                       {activeGame === 'none' ? (
                          <div className="space-y-6">
                             <div className="text-center mb-8">
                                <h2 className="text-2xl font-black text-gray-800 mb-2">اتاق بازی</h2>
                                <p className="text-gray-500">برای سرگرمی و کسب امتیاز معنوی، بازی کنید</p>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Sardar Game (Angry Birds Style) */}
                                <div onClick={() => setActiveGame('sardar')} className="group bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 hover:border-slate-400 cursor-pointer transition-all hover:-translate-y-2">
                                   <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 mb-4 mx-auto group-hover:scale-110 transition-transform">
                                      <Rat size={32} />
                                   </div>
                                   <h3 className="text-center font-bold text-gray-800 mb-1">بازی سردار</h3>
                                   <p className="text-center text-xs text-gray-500">پرتاب موش به دشمنان</p>
                                </div>

                                {/* Tic Tac Toe */}
                                <div onClick={() => setActiveGame('xo')} className="group bg-blue-50 rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-400 cursor-pointer transition-all hover:-translate-y-2">
                                   <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 mb-4 mx-auto group-hover:scale-110 transition-transform">
                                      <Square size={32} />
                                   </div>
                                   <h3 className="text-center font-bold text-gray-800 mb-1">دوز (XO)</h3>
                                   <p className="text-center text-xs text-gray-500">بازی کلاسیک دونفره</p>
                                </div>

                                {/* Dino Game */}
                                <div onClick={() => setActiveGame('dino')} className="group bg-red-50 rounded-2xl p-6 border-2 border-red-100 hover:border-red-400 cursor-pointer transition-all hover:-translate-y-2">
                                   <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center text-red-700 mb-4 mx-auto group-hover:scale-110 transition-transform">
                                      <span className="text-3xl">🏃</span>
                                   </div>
                                   <h3 className="text-center font-bold text-gray-800 mb-1">فرار از گناه</h3>
                                   <p className="text-center text-xs text-gray-500">از موانع عبور کنید</p>
                                </div>

                                {/* Tank Game */}
                                <div onClick={() => setActiveGame('tank')} className="group bg-green-50 rounded-2xl p-6 border-2 border-green-100 hover:border-green-400 cursor-pointer transition-all hover:-translate-y-2">
                                   <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center text-green-700 mb-4 mx-auto group-hover:scale-110 transition-transform">
                                      <Target size={32} />
                                   </div>
                                   <h3 className="text-center font-bold text-gray-800 mb-1">تانک مقاومت</h3>
                                   <p className="text-center text-xs text-gray-500">دفاع در برابر تهاجم</p>
                                </div>

                                {/* Hadith Quiz */}
                                <div onClick={() => setActiveGame('quiz')} className="group bg-teal-50 rounded-2xl p-6 border-2 border-teal-100 hover:border-teal-400 cursor-pointer transition-all hover:-translate-y-2">
                                   <div className="w-16 h-16 bg-teal-200 rounded-full flex items-center justify-center text-teal-700 mb-4 mx-auto group-hover:scale-110 transition-transform">
                                      <BookOpen size={32} />
                                   </div>
                                   <h3 className="text-center font-bold text-gray-800 mb-1">آزمون حدیث</h3>
                                   <p className="text-center text-xs text-gray-500">سنجش اطلاعات دینی</p>
                                </div>

                                {/* Spinner */}
                                <div onClick={() => setActiveGame('spinner')} className="group bg-purple-50 rounded-2xl p-6 border-2 border-purple-100 hover:border-purple-400 cursor-pointer transition-all hover:-translate-y-2">
                                   <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 mb-4 mx-auto group-hover:rotate-180 transition-transform duration-500">
                                      <Gift size={32} />
                                   </div>
                                   <h3 className="text-center font-bold text-gray-800 mb-1">گردونه پاداش</h3>
                                   <p className="text-center text-xs text-gray-500">شانس خود را امتحان کنید</p>
                                </div>
                                
                                {/* Checkers */}
                                <div onClick={() => setActiveGame('checkers')} className="group bg-amber-50 rounded-2xl p-6 border-2 border-amber-100 hover:border-amber-400 cursor-pointer transition-all hover:-translate-y-2">
                                   <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 mb-4 mx-auto group-hover:scale-110 transition-transform">
                                      <Circle size={10} className="mr-1"/> <Circle size={10} />
                                   </div>
                                   <h3 className="text-center font-bold text-gray-800 mb-1">دوز (Checkers)</h3>
                                   <p className="text-center text-xs text-gray-500">بازی فکری</p>
                                </div>
                             </div>
                          </div>
                       ) : (
                         // Game Render Area
                         <div className="w-full flex justify-center">
                            {activeGame === 'sardar' && <SardarGame onClose={() => setActiveGame('none')} />}
                            {activeGame === 'xo' && <TicTacToeGame onClose={() => setActiveGame('none')} />}
                            {activeGame === 'dino' && <DinoGame onClose={() => setActiveGame('none')} />}
                            {activeGame === 'tank' && <TankGame onClose={() => setActiveGame('none')} />}
                            {activeGame === 'quiz' && <HadithQuiz onClose={() => setActiveGame('none')} />}
                            {activeGame === 'spinner' && <SpinnerGame onClose={() => setActiveGame('none')} />}
                            {activeGame === 'checkers' && <CheckersGame onClose={() => setActiveGame('none')} />}
                         </div>
                       )}
                    </div>
                 )}
              </div>
           </div>
        )}

        {/* --- COMPLETED SCREEN --- */}
        {gameState === 'completed' && (
           <div className="bg-white rounded-3xl p-12 text-center shadow-2xl border border-yellow-200 max-w-2xl mx-auto mt-10">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                 <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 animate-ping"></div>
                 <div className="scale-75 translate-y-2">
                    <VectorCharacterAvatar config={charConfig} size={150} />
                 </div>
                 <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white p-2 rounded-full border-4 border-white">
                    <Trophy size={24} />
                 </div>
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">تبریک! به قله رسیدید</h2>
              <p className="text-gray-600 text-lg mb-8">
                 شما با موفقیت تمام مراحل سلوک را طی کردید. شخصیت شما اکنون به کمال رسیده است.
              </p>
              <button onClick={resetGame} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                شروع مجدد سفر
              </button>
           </div>
        )}

      </div>

      {/* Quote Modal */}
      {modalOpen && currentQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative animate-slideUp border-t-8 border-orange-500">
            <button 
              onClick={() => setModalOpen(false)} 
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600 mb-4">
                 <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">کلام نور</h3>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl mb-8 relative">
               <span className="absolute top-2 right-4 text-4xl text-gray-300 font-serif">"</span>
               <p className="text-lg text-gray-700 leading-8 font-medium text-center relative z-10 px-4">
                 {currentQuote.text}
               </p>
               <span className="absolute bottom-0 left-4 text-4xl text-gray-300 font-serif">"</span>
               <div className="mt-4 text-left">
                 <span className="text-sm text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full">
                   {currentQuote.author}
                 </span>
               </div>
            </div>

            <button
              onClick={advanceStep}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-95"
            >
              دریافتم و ادامه میدهم
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;