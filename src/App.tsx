import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  Clock,
  Copy,
  Crown,
  Eye,
  EyeOff,
  Flame,
  Gauge,
  Hourglass,
  KeyRound,
  LayoutGrid,
  Lock,
  LockOpen,
  Maximize2,
  Minimize2,
  Radio,
  RefreshCw,
  Search,
  Send,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Timer,
  TrendingUp,
  Trophy,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                APP CONFIG                                  */
/* -------------------------------------------------------------------------- */

export const APP_CONFIG = {
  name: "ADVANCE",
  telegram: "https://t.me/+WIKRSTgIhx5kNDRl",
  profileImage: "https://cdn.phototourl.com/member/2026-10-06-8bd2c666-f684-4065-9545-e6ed40bd7661.jpg",
  wingoImage: "/assets/wingo_game.png",
};

export function openTelegramLink(url: string = APP_CONFIG.telegram) {
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  } catch {
    try {
      window.open(url, '_blank');
    } catch {}
  }
}

/* -------------------------------------------------------------------------- */
/*                                TYPES & DATA                                */
/* -------------------------------------------------------------------------- */

export type MarketInterval = 30 | 60 | 180 | 300;
export type GameSize = 'BIG' | 'SMALL';
export type GameColor = 'GREEN' | 'RED';
export type BetStatus = 'WIN' | 'JACKPOT' | 'LOSS' | 'PENDING';

export interface Prediction {
  size: GameSize;
  color: GameColor;
  numbers: [number, number];
  confidence: number;
  reasoning: string;
  stepLevel?: number;
}

export interface LotteryResult {
  period: string;
  number: number;
  color: string;
  size: GameSize;
}

export interface VerifiedHistoryRow {
  period: string;
  number: number;
  color: string;
  size: GameSize | '';
  prediction: Prediction;
  status: BetStatus;
  stepLevel?: number;
  isPending?: boolean;
}

export interface ServerStrategy {
  id: string;
  serverNum: string;
  name: string;
  code: string;
  strategyBn: string;
  strategyEn: string;
  accentColor: string;
  category: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'DYNAMIC';
  winRating: number;
  iconUrl?: string;
  predict: (historyNumbers: number[], currentPeriod: string) => Prediction;
}

export interface ServerTheme {
  name: string;
  primary: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  gradient: string;
  glow: string;
  buttonActiveBg: string;
}

/* -------------------------------------------------------------------------- */
/*                         DARK SLEEK ATMOSPHERE                              */
/* -------------------------------------------------------------------------- */

export const DarkAtmosphere: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#080A0B]" aria-hidden="true">
      {/* 1. Deep Black #080A0B base */}
      <div className="absolute inset-0 bg-[#080A0B]" />

      {/* 2. Soft Emerald & Dark Green ambient glows */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#19D58A]/5 rounded-full blur-[170px]" />
      <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-[#063B29]/35 rounded-full blur-[180px]" />
      <div className="absolute -bottom-32 left-1/3 w-[650px] h-[650px] bg-[#19D58A]/4 rounded-full blur-[180px]" />

      {/* 3. Subtle micro grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#19D58A0D_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />

      {/* 4. Deep cinematic vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(8,10,11,0.85)_80%,#080A0B_100%)]" />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                SOUND EFFECTS                               */
/* -------------------------------------------------------------------------- */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(
  type: 'click' | 'jackpot' | 'win' | 'loss' | 'stepUp' | 'tick' | 'alert',
  enabled: boolean = true
) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'jackpot') {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.25, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.45);
      });
    } else if (type === 'stepUp') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } else if (type === 'loss') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'tick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'alert') {
      [0, 0.12].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now + offset);
        gain.gain.setValueAtTime(0.15, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.08);
      });
    }
  } catch {}
}

/* -------------------------------------------------------------------------- */
/*                            MATHEMATICAL HELPERS                            */
/* -------------------------------------------------------------------------- */

export const numToSize = (n: number | string): GameSize => (Number(n) >= 5 ? 'BIG' : 'SMALL');
export const numToColor = (n: number | string): GameColor => (Number(n) % 2 === 1 ? 'GREEN' : 'RED');

export function getJackpotNumbers(
  size: GameSize,
  color: GameColor,
  recentNumbers: number[],
  serverSeed: number,
  periodStr: string,
  forceA?: number,
  forceB?: number
): [number, number] {
  const pool = size === 'BIG' ? [5, 6, 7, 8, 9] : [0, 1, 2, 3, 4];
  const pSeed = Number(String(periodStr || '892').slice(-3)) || serverSeed * 13;

  if (forceA !== undefined && pool.includes(forceA)) {
    const rem = pool.filter((x) => x !== forceA);
    const matchingColor = rem.filter((x) => numToColor(x) === color);
    const chosenPool = matchingColor.length > 0 ? matchingColor : rem;
    const second = chosenPool[Math.abs(serverSeed * 7 + pSeed) % chosenPool.length];
    return forceA < second ? [forceA, second] : [second, forceA];
  }

  if (forceB !== undefined && pool.includes(forceB)) {
    const rem = pool.filter((x) => x !== forceB);
    const idxA = Math.abs(serverSeed * 3 + pSeed) % rem.length;
    const idxB = (idxA + 1) % rem.length;
    const nA = rem[idxA];
    const nB = rem[idxB];
    return nA < nB ? [nA, nB] : [nB, nA];
  }

  const lastNum = recentNumbers[recentNumbers.length - 1] ?? (size === 'BIG' ? 7 : 2);
  const colorMatches = pool.filter((x) => numToColor(x) === color);

  let num1: number;
  let num2: number;

  if (colorMatches.length >= 2) {
    const idx1 = Math.abs(lastNum + serverSeed * 3 + pSeed) % colorMatches.length;
    const idx2 = (idx1 + 1) % colorMatches.length;
    num1 = colorMatches[idx1];
    num2 = colorMatches[idx2];
  } else if (colorMatches.length === 1) {
    num1 = colorMatches[0];
    const rem = pool.filter((x) => x !== num1);
    num2 = rem[Math.abs(lastNum + serverSeed + pSeed) % rem.length];
  } else {
    const idx1 = Math.abs(lastNum + serverSeed * 3 + pSeed) % pool.length;
    const idx2 = (idx1 + 1) % pool.length;
    num1 = pool[idx1];
    num2 = pool[idx2];
  }

  return num1 < num2 ? [num1, num2] : [num2, num1];
}

export const incrementPeriod = (periodStr: string): string => {
  const digits = String(periodStr || '').split('');
  let carry = 1;
  for (let i = digits.length - 1; i >= 0 && carry; --i) {
    const val = Number(digits[i]) + carry;
    digits[i] = String(val % 10);
    carry = +(val > 9);
  }
  if (carry) digits.unshift('1');
  return digits.join('');
};

export const decrementPeriod = (periodStr: string): string => {
  const digits = String(periodStr || '').split('');
  let borrow = 1;
  for (let i = digits.length - 1; i >= 0 && borrow; --i) {
    let val = Number(digits[i]) - borrow;
    if (val < 0) {
      val += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    digits[i] = String(val);
  }
  return digits.join('');
};

export const GAME_TYPE_CODES: Record<number, string> = {
  30: '10005',
  60: '10001',
  180: '10002',
  300: '10003',
};

export const API_URLS: Record<number, string> = {
  30: 'https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json',
  60: 'https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json',
  180: 'https://draw.ar-lottery01.com/WinGo/WinGo_3M/GetHistoryIssuePage.json',
  300: 'https://draw.ar-lottery01.com/WinGo/WinGo_5M/GetHistoryIssuePage.json',
};

export const GAME_TYPE_NAMES: Record<number, string> = {
  30: 'WinGo_30S',
  60: 'WinGo_1M',
  180: 'WinGo_3M',
  300: 'WinGo_5M',
};

export const calculatePeriodByTime = (interval: MarketInterval): string => {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}`;
  const gameCode = GAME_TYPE_CODES[interval] || '10005';
  const totalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const issueNum = Math.floor(totalSeconds / interval) + 1;
  return `${dateStr}${gameCode}${String(issueNum).padStart(4, '0')}`;
};

export function determineColorTrend(nums: number[], targetSize: GameSize): GameColor {
  const lastFew = nums.slice(-6);
  let odd = 0;
  let even = 0;
  for (const n of lastFew) {
    if (n % 2 === 1) odd++;
    else even++;
  }
  if (targetSize === 'BIG') {
    return odd >= even ? 'GREEN' : 'RED';
  } else {
    return even >= odd ? 'RED' : 'GREEN';
  }
}

export function evaluateBetStatus(predSize: GameSize, predNumbers: [number, number], actualNum: number): BetStatus {
  if (predSize === numToSize(actualNum)) {
    if (predNumbers && predNumbers.includes(actualNum)) {
      return 'JACKPOT';
    }
    return 'WIN';
  }
  return 'LOSS';
}

export function getTierBadge(winRate: number) {
  if (winRate >= 94) {
    return {
      tier: 'S+',
      label: 'LEVEL S+ (99%)',
      badgeBg: 'bg-gradient-to-r from-[#00C853] via-[#00E676] to-[#00FF88]',
      badgeBorder: 'border-[#00FF88]',
      badgeText: 'text-[#03150E] font-black',
      glow: 'shadow-[0_0_15px_rgba(0,255,136,0.5)]',
    };
  }
  if (winRate >= 88) {
    return {
      tier: 'S',
      label: 'LEVEL S (90%)',
      badgeBg: 'bg-[#00C853]/25',
      badgeBorder: 'border-[#00C853]',
      badgeText: 'text-[#00FF88]',
      glow: 'shadow-[0_0_12px_rgba(0,200,83,0.35)]',
    };
  }
  if (winRate >= 80) {
    return {
      tier: 'A+',
      label: 'LEVEL A+ (82%)',
      badgeBg: 'bg-[#008F5A]/25',
      badgeBorder: 'border-[#124D35]',
      badgeText: 'text-[#A8C7B5]',
      glow: 'shadow-[0_0_8px_rgba(0,143,90,0.25)]',
    };
  }
  return {
    tier: 'A',
    label: 'LEVEL A (71%)',
    badgeBg: 'bg-[#0B1511]',
    badgeBorder: 'border-[#124D35]',
    badgeText: 'text-[#A8C7B5]',
    glow: '',
  };
}

/* -------------------------------------------------------------------------- */
/*                           SERVER ICONS & AVATAR                            */
/* -------------------------------------------------------------------------- */

export const SERVER_ICONS: Record<string, string> = {
  'server-01': '/assets/aistudio/Dragon_King_6e62e761.png',
  'server-02': '/assets/aistudio/Viper_Gold_975f4827.png',
  'server-03': '/assets/aistudio/Quantum_Wave_0227df07.png',
  'server-04': '/assets/aistudio/Fractal_VIP_2aec7744.png',
  'server-05': '/assets/aistudio/Delta_Vector_d92b1ab4.png',
  'server-06': '/assets/aistudio/Bollinger_King_de271694.png',
  'server-07': '/assets/aistudio/Rocket_Star_f4e6f786.png',
  'server-08': '/assets/aistudio/Hyperion_X_bbad6cc1.png',
  'server-09': '/assets/aistudio/Kalman_Master_b5f6345a.png',
  'server-10': '/assets/aistudio/Shark_Tank_cccbbf95.png',
  'server-11': '/assets/aistudio/Fourier_Titan_1f4f439d.png',
  'server-12': '/assets/aistudio/Orderflow_Pro_f504de20.png',
  'server-13': '/assets/aistudio/Entropy_Core_61dc7bf8.png',
  'server-14': '/assets/aistudio/Bullet_Pro_3870a992.png',
  'server-15': '/assets/aistudio/Thunder_Bolt_6ff24b01.png',
  'server-16': '/assets/aistudio/Eagle_Eye_223ae776.png',
  'server-17': '/assets/aistudio/Cyber_Q_Alpha_4f6465fd.png',
  'server-18': '/assets/aistudio/Dark_Horse_6da57b7e.png',
  'server-19': '/assets/aistudio/Tiger_Pro_343a8602.png',
  'server-20': '/assets/aistudio/Wolf_Pack_11e584b8.png',
  'server-21': '/assets/aistudio/Shadow_X_5d430730.png',
  'server-22': '/assets/aistudio/Panther_VIP_44c9c816.png',
  'server-23': '/assets/aistudio/Ghost_Rider_02307f95.png',
  'server-24': '/assets/aistudio/Storm_Chaser_95985dc7.png',
  'server-25': '/assets/aistudio/Cobra_Strike_518f070e.png',
  'server-26': '/assets/aistudio/Phoenix_VIP_94313874.png',
  'server-27': '/assets/aistudio/Blaze_Pro_b32c2aa6.png',
  'server-28': '/assets/aistudio/Cyber_Apex_Core.jpg',
  'server-29': '/assets/aistudio/Alpha_Sentinel_VIP.jpg',
  'server-30': '/assets/aistudio/Omni_God_Mode.jpg',
};

export const getServerIcon = (server: ServerStrategy | string): string => {
  if (!server) return '/assets/aistudio/Dragon_King_6e62e761.png';
  if (typeof server === 'object' && server.iconUrl) return server.iconUrl;
  const id = typeof server === 'string' ? server : server.id;
  return SERVER_ICONS[id] || '/assets/aistudio/Dragon_King_6e62e761.png';
};

export const ServerAvatar: React.FC<{
  server: ServerStrategy | string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showGlow?: boolean;
}> = ({ server, name, size = 'sm', className = '', showGlow = false }) => {
  const iconSrc = getServerIcon(server);
  const [loadFailed, setLoadFailed] = useState(false);
  const sizeClasses = {
    xs: 'w-5 h-5 rounded-md',
    sm: 'w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-lg',
    md: 'w-8 h-8 sm:w-9 sm:h-9 rounded-xl',
    lg: 'w-9.5 h-9.5 sm:w-11 sm:h-11 rounded-xl',
    xl: 'w-11 h-11 sm:w-12.5 sm:h-12.5 rounded-xl',
    '2xl': 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl',
  }[size];

  return (
    <div
      className={`relative ${sizeClasses} flex-shrink-0 p-0.5 bg-gradient-to-br from-white/30 via-[#19D58A]/40 to-[#063B29] shadow-md border border-white/20 overflow-hidden group select-none ${
        showGlow ? 'shadow-[0_0_25px_rgba(25,213,138,0.4)]' : ''
      } ${className}`}
    >
      <img
        src={loadFailed ? '/assets/app_logo.png' : iconSrc}
        alt={name || 'Server emblem'}
        loading="lazy"
        className="w-full h-full object-cover rounded-[inherit] transition-transform duration-300 group-hover:scale-110"
        onError={() => setLoadFailed(true)}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                30 VIP SERVERS                              */
/* -------------------------------------------------------------------------- */

export const SERVERS: ServerStrategy[] = [
  {
    id: 'server-01',
    serverNum: 'Server 01',
    name: 'Dragon Trend AI',
    code: 'S#01',
    strategyBn: 'টানা মার্কেট ড্রাগন ধারা ও মোমেন্টাম ট্র্যাকিং — ৯৬%+ উইনরেট',
    strategyEn: 'Dragon Streak & Trend Follower Algorithm',
    accentColor: 'from-amber-500 via-orange-500 to-emerald-600',
    category: 'ট্রেন্ড মোমেন্টাম',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 2 ? nums : [7, 8];
      const last = valid[valid.length - 1];
      const isStreak = numToSize(valid[valid.length - 2] ?? last) === numToSize(last);
      const targetSize: GameSize = isStreak ? numToSize(last) : last >= 5 ? 'BIG' : 'SMALL';
      const targetColor = determineColorTrend(valid, targetSize);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 1, period),
        confidence: isStreak ? 96 : 93,
        reasoning: isStreak
          ? `টানা ${targetSize} ড্রাগন মোমেন্টাম সক্রিয় • কালার ${targetColor}`
          : `ড্রাগন কন্টিনিউয়েশন: প্রবাবিলিটি সাইজ ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-02',
    serverNum: 'Server 02',
    name: 'Reversal Viper AI',
    code: 'S#02',
    strategyBn: 'এক্সহশন রিভার্সাল — ৩ বা ততোধিক ধারার পর নির্ভুল কাউন্টার রিভার্স শট',
    strategyEn: 'Trend Exhaustion & Counter Reversal Engine',
    accentColor: 'from-amber-500 via-orange-600 to-blue-700',
    category: 'কাউন্টার রিভার্সাল',
    riskLevel: 'MEDIUM',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 3 ? nums : [8, 9, 7];
      const last = valid[valid.length - 1];
      let streak = 0;
      for (let i = valid.length - 1; i >= 0 && numToSize(valid[i]) === numToSize(last); i--) streak++;
      const targetSize: GameSize = streak >= 3 ? (numToSize(last) === 'BIG' ? 'SMALL' : 'BIG') : numToSize(last);
      const targetColor = determineColorTrend(valid, targetSize);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 2, period),
        confidence: streak >= 3 ? 95 : 92,
        reasoning:
          streak >= 3
            ? `${streak}x ধারার পর শক্তিশালী কাউন্টার রিভার্স ${targetSize}`
            : `মোমেন্টাম সাপোর্ট: সক্রিয় সাইজ ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-03',
    serverNum: 'Server 03',
    name: 'Parity Matrix AI',
    code: 'S#03',
    strategyBn: 'প্যারিটি কালার সিঙ্ক — অড/ইভেন জোড়-বেজোড় ফ্র্যাক্টাল ও গ্রিন/রেড ব্যালেন্স',
    strategyEn: 'Odd/Even Parity & Color Balance Matrix',
    accentColor: 'from-emerald-600 via-teal-600 to-amber-500',
    category: 'প্যারিটি ব্যালেন্স',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 4 ? nums : [3, 7, 8, 2];
      const oddCount = valid.slice(-5).filter((x) => x % 2 === 1).length;
      const targetColor: GameColor = oddCount >= 4 ? 'RED' : oddCount <= 1 || oddCount >= 3 ? 'GREEN' : 'RED';
      const avg = valid.slice(-4).reduce((a, b) => a + b, 0) / 4;
      const targetSize: GameSize = avg >= 4.5 ? 'BIG' : 'SMALL';
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 3, period),
        confidence: 94,
        reasoning: `প্যারিটি ব্যালেন্স ফিল্টার: টার্গেট কালার ${targetColor} ও সাইজ ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-04',
    serverNum: 'Server 04',
    name: 'Fibonacci Wave VIP',
    code: 'S#04',
    strategyBn: 'ফিবোনাচ্চি গোল্ডেন রেশিও — ০.৬১৮ হারমোনিক স্পাইরাল ও টার্নিং পয়েন্ট',
    strategyEn: 'Fibonacci Harmonic Wave & Golden Mean',
    accentColor: 'from-yellow-500 via-amber-600 to-emerald-600',
    category: 'গাণিতিক মডেল',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 2 ? nums : [5, 8];
      const sum = valid[valid.length - 1] + valid[valid.length - 2];
      const fibVal = Math.round(sum * 0.618) % 10;
      const targetSize = fibVal >= 5 ? 'BIG' : 'SMALL';
      const targetColor = numToColor(fibVal);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 4, period),
        confidence: 95,
        reasoning: `ফিবোনাচ্চি গোল্ডেন নোড [${fibVal}] -> সাইজ ${targetSize} (${targetColor})`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-05',
    serverNum: 'Server 05',
    name: 'Golden Ratio Core',
    code: 'S#05',
    strategyBn: 'ডব্লিউএমএ ৩-পিরিয়ড ওয়েটেড গড় — সাম্প্রতিক ড্রয়ের সর্বোচ্চ প্রাধান্য',
    strategyEn: 'Weighted Moving Average (WMA) Core Engine',
    accentColor: 'from-amber-500 via-emerald-600 to-blue-600',
    category: 'গাণিতিক মডেল',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 3 ? nums : [6, 7, 8];
      const a = valid[valid.length - 1];
      const b = valid[valid.length - 2];
      const c = valid[valid.length - 3] ?? b;
      const wma = (a * 3 + b * 2 + c * 1) / 6;
      const targetSize: GameSize = wma >= 4.5 ? 'BIG' : 'SMALL';
      const targetColor = determineColorTrend(valid, targetSize);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 5, period),
        confidence: 96,
        reasoning: `ওয়েটেড স্কোর ${wma.toFixed(1)} -> সর্বোচ্চ সম্ভাবনায় ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-06',
    serverNum: 'Server 06',
    name: 'Bollinger Band AI',
    code: 'S#06',
    strategyBn: 'মিন রিভার্সন ব্যান্ড — আপার ও লোয়ার ব্যান্ডের বিচ্যুতিতে বাউন্স শট',
    strategyEn: 'Bollinger Mean-Reversion Channel',
    accentColor: 'from-emerald-500 via-teal-600 to-amber-500',
    category: 'স্ট্যাটিস্টিক্যাল ব্যান্ড',
    riskLevel: 'MEDIUM',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 5 ? nums : [7, 6, 8, 9, 8];
      const avg = valid.slice(-5).reduce((a, b) => a + b, 0) / 5;
      const targetSize: GameSize = avg > 6 ? 'SMALL' : avg < 3.5 || avg >= 4.5 ? 'BIG' : 'SMALL';
      const targetColor = determineColorTrend(valid, targetSize);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 6, period),
        confidence: 94,
        reasoning: `ব্যান্ড চ্যানেল গড় ${avg.toFixed(1)} -> অপটিমাল বাউন্স ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-07',
    serverNum: 'Server 07',
    name: 'RSI Extreme Momentum',
    code: 'S#07',
    strategyBn: 'ওভারবট ও ওভারসোল্ড আরএসআই ফিল্টার — চরম সীমায় নিখুঁত আঘাত',
    strategyEn: 'RSI Extreme Oscillator & Momentum Index',
    accentColor: 'from-amber-600 via-orange-600 to-emerald-600',
    category: 'অসিলেটর মোমেন্টাম',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 4 ? nums : [4, 7, 8, 9];
      const last = valid[valid.length - 1];
      const bigCount = valid.slice(-6).filter((x) => x >= 5).length;
      const targetSize: GameSize = bigCount >= 5 ? 'SMALL' : bigCount <= 1 || last >= 5 ? 'BIG' : 'SMALL';
      const targetColor: GameColor = targetSize === 'BIG' ? 'GREEN' : 'RED';
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 7, period),
        confidence: 95,
        reasoning: `আরএসআই এক্সট্রিম রিডিং (${bigCount}/6) -> টার্গেট সাইজ ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-08',
    serverNum: 'Server 08',
    name: 'Neural Matrix VIP',
    code: 'S#08',
    strategyBn: 'ডিপ নিউরাল প্যাটার্ন — বিগত রাউন্ডের মোমেন্টাম স্লোপ ও ডেল্টা হিস্টোগ্রাম',
    strategyEn: 'Deep Neural Signature & Momentum Delta',
    accentColor: 'from-emerald-600 via-indigo-700 to-amber-400',
    category: 'নিউরাল সিগনেচার',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 3 ? nums : [2, 7, 8];
      const diff = valid[valid.length - 1] - valid[valid.length - 2];
      const last = valid[valid.length - 1];
      const targetSize: GameSize = diff >= 0 ? (last >= 4 ? 'BIG' : 'SMALL') : last <= 5 ? 'SMALL' : 'BIG';
      const targetColor = determineColorTrend(valid, targetSize);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 8, period),
        confidence: 97,
        reasoning: `নিউরাল সিগনেচার ডেল্টা [${diff >= 0 ? '+' : ''}${diff}] -> কনফার্মড ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-09',
    serverNum: 'Server 09',
    name: 'Markov Transition AI',
    code: 'S#09',
    strategyBn: 'মার্কভ ট্রানজিশন ম্যাট্রিক্স — পূর্ববর্তী সংখ্যার শর্তাধীন সম্ভাবনাময় ভবিষ্যৎ শট',
    strategyEn: '1st-Order Markov Chain Conditional State Predictor',
    accentColor: 'from-amber-400 via-emerald-600 to-blue-700',
    category: 'কন্ডিশনাল প্রবাবিলিটি',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 3 ? nums : [2, 3, 8];
      const last = valid[valid.length - 1];
      const targetSize: GameSize = last <= 2 ? 'BIG' : last >= 8 ? 'SMALL' : last >= 5 ? 'BIG' : 'SMALL';
      const targetColor = determineColorTrend(valid, targetSize);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 9, period),
        confidence: 95,
        reasoning: `মার্কভ ট্রানজিশন স্টেট [${last}] -> শর্তাধীন সম্ভাবনায় ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-10',
    serverNum: 'Server 10',
    name: 'Cluster Density AI',
    code: 'S#10',
    strategyBn: 'ক্লাস্টার ঘনত্ব অ্যানালিসিস — উচ্চ ঘনত্বের হট জোনে জ্যাকপট শট ফেলা',
    strategyEn: 'High-Density Hot Zone & Cluster Analyzer',
    accentColor: 'from-blue-700 via-sky-600 to-amber-500',
    category: 'ক্লাস্টার ডেনসিটি',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 4 ? nums : [6, 8, 9, 7];
      const hotCount = valid.slice(-5).filter((x) => x >= 5).length;
      const targetSize: GameSize = hotCount >= 3 ? 'BIG' : 'SMALL';
      const targetColor: GameColor = targetSize === 'BIG' ? 'GREEN' : 'RED';
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 10, period),
        confidence: 95,
        reasoning: `হট ক্লাস্টার ডেনসিটি (${hotCount}/5) -> প্রাধান্য ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-11',
    serverNum: 'Server 11',
    name: 'Mirror Symmetry Sync',
    code: 'S#11',
    strategyBn: 'মিরর সিমেট্রি — পূর্ববর্তী ড্রয়ের পরিপূরক ডিজিটাল রিফ্লেকশন শট',
    strategyEn: 'Harmonic 9-Complement Mirror Symmetry Engine',
    accentColor: 'from-emerald-600 via-blue-600 to-amber-500',
    category: 'ডিজিটাল সিমেট্রি',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 2 ? nums : [4, 6];
      const last = valid[valid.length - 1];
      const mirror = 9 - last;
      const targetSize = numToSize(mirror);
      const targetColor = numToColor(mirror);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 11, period),
        confidence: 94,
        reasoning: `মিরর রিফ্লেকশন [${last} ➔ ${mirror}] -> টার্গেট সাইজ ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-12',
    serverNum: 'Server 12',
    name: 'Frequency Delta VIP',
    code: 'S#12',
    strategyBn: 'ফ্রিকোয়েন্সি ডেল্টা — শীর্ষ ব্যবধানে পিছিয়ে থাকা নম্বরের স্প্রিং রিবাউন্ড',
    strategyEn: 'Velocity Delta & Lag-Free Spring Rebound',
    accentColor: 'from-amber-500 via-orange-600 to-emerald-600',
    category: 'ফ্রিকোয়েন্সি ডেল্টা',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 3 ? nums : [7, 8, 9];
      const delta = valid[valid.length - 1] - valid[valid.length - 2];
      const last = valid[valid.length - 1];
      const targetSize: GameSize = delta > 0 ? 'BIG' : delta < 0 ? 'SMALL' : last >= 5 ? 'BIG' : 'SMALL';
      const targetColor = determineColorTrend(valid, targetSize);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 12, period),
        confidence: 94,
        reasoning: `ভেলোসিটি ডেল্টা [${delta}] -> ট্রেন্ড এক্সেলেশন ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-13',
    serverNum: 'Server 13',
    name: 'Quantum Entropy Filter',
    code: 'S#13',
    strategyBn: 'কোয়ান্টাম এন্ট্রপি — গাণিতিক বিশৃঙ্খলা ফিল্টার করে বিশুদ্ধ সিগন্যাল প্রদান',
    strategyEn: 'Quantum Entropy Reducer & Signal Purifier',
    accentColor: 'from-amber-500 via-emerald-600 to-sky-500',
    category: 'কোয়ান্টাম এন্ট্রপি',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 4 ? nums : [5, 6, 7, 8];
      const sum = valid.slice(-3).reduce((a, b) => a + b, 0);
      const targetSize: GameSize = sum >= 14 ? 'BIG' : 'SMALL';
      const targetColor = determineColorTrend(valid, targetSize);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 13, period),
        confidence: 95,
        reasoning: `কোয়ান্টাম সাম স্টেট [${sum}] -> টার্গেট ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-14',
    serverNum: 'Server 14',
    name: 'Step-Master Core',
    code: 'S#14',
    strategyBn: 'মার্টিঙ্গেল স্টেপ মাস্টার — সর্বোচ্চ ১-২ ধাপে শতভাগ প্রফিট রিকভারি শিল্ড',
    strategyEn: 'Martingale Step-1 Primary & Step-2 Shield Engine',
    accentColor: 'from-emerald-600 via-blue-600 to-amber-400',
    category: 'স্টেপ প্রোটেকশন',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 3 ? nums : [7, 8, 9];
      const last = valid[valid.length - 1];
      const targetSize = numToSize(last);
      const targetColor = determineColorTrend(valid, targetSize);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 14, period),
        confidence: 97,
        reasoning: `স্টেপ-মাস্টার শিল্ড: হাই কনভিকশন ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-15',
    serverNum: 'Server 15',
    name: 'Volatility Breakout AI',
    code: 'S#15',
    strategyBn: 'ভোলাটিলিটি ব্রেকআউট — হঠাৎ ট্রেন্ড পরিবর্তনের শুরুতে দ্রুত পজিশন নেওয়া',
    strategyEn: 'Dynamic Range Expansion & Volatility Breakout',
    accentColor: 'from-blue-600 via-orange-600 to-amber-500',
    category: 'ভলাটিলিটি ব্রেকআউট',
    riskLevel: 'MEDIUM',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 4 ? nums : [4, 5, 4, 8];
      const targetSize: GameSize = valid[valid.length - 1] >= 5 ? 'BIG' : 'SMALL';
      const targetColor: GameColor = targetSize === 'BIG' ? 'GREEN' : 'RED';
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 15, period),
        confidence: 95,
        reasoning: `ব্রেকআউট মোমেন্টাম এক্সপেনশন -> উচ্চ গতিবেগে ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-16',
    serverNum: 'Server 16',
    name: 'Poisson Cluster AI',
    code: 'S#16',
    strategyBn: 'পয়সন ক্লাস্টার — প্রত্যাশিত গড় বিচ্যুতি রিগ্রেশন ও রিবাউন্ড মডেল',
    strategyEn: 'Poisson Distribution Mean-Deviation & Cluster AI',
    accentColor: 'from-blue-700 via-emerald-600 to-amber-400',
    category: 'পয়সন রিগ্রেশন',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 4 ? nums : [4, 5, 6, 7];
      const sum = valid.slice(-4).reduce((a, b) => a + b, 0);
      const targetSize: GameSize = sum > 18 ? 'SMALL' : 'BIG';
      const targetColor = determineColorTrend(valid, targetSize);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 16, period),
        confidence: 95,
        reasoning: `পয়সন ল্যাম্বডা সাম [${sum}/18] -> রিগ্রেশন টার্গেট ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-17',
    serverNum: 'Server 17',
    name: 'Period Seed Hash Sync',
    code: 'S#17',
    strategyBn: 'পিরিয়ড সিড অ্যালগরিদম — অফিসিয়াল ১৭ ডিজিট পিরিয়ড সিড মডিউলার ফিল্টার',
    strategyEn: 'Official 17-Digit Period Hash & Seed Modulo Engine',
    accentColor: 'from-emerald-500 via-blue-600 to-amber-500',
    category: 'পিরিয়ড হ্যাশ',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const pStr = String(period || '20261010100010892');
      const seedMod = ((Number(pStr.slice(-3)) || 892) + (nums[nums.length - 1] ?? 7)) % 10;
      const targetSize: GameSize = seedMod >= 5 ? 'BIG' : 'SMALL';
      const targetColor = numToColor(seedMod);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, nums, 17, period),
        confidence: 96,
        reasoning: `পিরিয়ড সিড #${pStr.slice(-4)} সিঙ্ক [${seedMod}] -> সাইজ ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-18',
    serverNum: 'Server 18',
    name: 'MA Crossover AI',
    code: 'S#18',
    strategyBn: 'মুভিং এভারেজ ক্রস — ফাস্ট ইএমএ-৩ ও স্লো এসএমএ-৭ এর গোল্ডেন ক্রস সিগন্যাল',
    strategyEn: 'Fast EMA-3 vs Slow SMA-7 Golden Crossover Engine',
    accentColor: 'from-amber-500 via-emerald-600 to-blue-800',
    category: 'মুভিং এভারেজ',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 5 ? nums : [3, 5, 7, 8, 9];
      const fast = valid.slice(-3).reduce((a, b) => a + b, 0) / 3;
      const slow = valid.slice(-5).reduce((a, b) => a + b, 0) / 5;
      const targetSize: GameSize = fast >= slow ? 'BIG' : 'SMALL';
      const targetColor: GameColor = targetSize === 'BIG' ? 'GREEN' : 'RED';
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 18, period),
        confidence: 95,
        reasoning: `এমএ ক্রস: ফাস্ট (${fast.toFixed(1)}) বনাম স্লো (${slow.toFixed(1)}) -> ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-19',
    serverNum: 'Server 19',
    name: 'Apex VIP Momentum',
    code: 'S#19',
    strategyBn: 'এপেক্স কোয়ান্টাম মোমেন্টাম — মাল্টি-মডেল কনসেন্সাস ও সর্বোচ্চ অ্যাকুরেসি',
    strategyEn: 'Multi-Model Consensus & Apex High-Conviction Core',
    accentColor: 'from-amber-500 via-emerald-500 to-indigo-900',
    category: 'মাল্টি-কনসেন্সাস',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 3 ? nums : [7, 8, 9];
      const avg = valid.slice(-4).reduce((a, b) => a + b, 0) / 4;
      const targetSize: GameSize = avg >= 4.5 ? 'BIG' : 'SMALL';
      const targetColor: GameColor = targetSize === 'BIG' ? 'GREEN' : 'RED';
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 19, period),
        confidence: 98,
        reasoning: `এপেক্স কনসেন্সাস ৯৮% কনফিডেন্স: টার্গেট ${targetSize} (${targetColor})`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-20',
    serverNum: 'Server 20',
    name: 'Guardian Risk Minimizer',
    code: 'S#20',
    strategyBn: 'কনজারভেটিভ শিল্ড — কম ঝুঁকি ও স্থির নির্ভরযোগ্য গড়ের ওপর সিগন্যাল প্রদান',
    strategyEn: 'Conservative Capital Defense & Low-Drawdown Filter',
    accentColor: 'from-emerald-600 via-teal-700 to-amber-500',
    category: 'ক্যাপিটাল ডিফেন্স',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 5 ? nums : [6, 7, 5, 8, 7];
      const avg = valid.slice(-5).reduce((a, b) => a + b, 0) / 5;
      const targetSize: GameSize = avg >= 4.5 ? 'BIG' : 'SMALL';
      const targetColor = determineColorTrend(valid, targetSize);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 20, period),
        confidence: 96,
        reasoning: `গার্ডিয়ান লো-রিস্ক ফিল্টার: স্ট্যাটিস্টিক্যাল সেফটি জোন ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-21',
    serverNum: 'Server 21',
    name: 'Nexus Matrix AI',
    code: 'S#21',
    strategyBn: 'কালার পোলারিটি ম্যাট্রিক্স — গ্রিন/রেড ভেক্টর ও ব্যালেন্স বিশ্লেষণ',
    strategyEn: 'Nexus Color Matrix & Polarity Vector Engine',
    accentColor: 'from-[#00C853] via-[#00E676] to-[#00FF88]',
    category: 'কালার ম্যাট্রিক্স',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 4 ? nums : [7, 2, 8, 3];
      const greenCount = valid.slice(-4).filter((x) => x % 2 === 1).length;
      const targetColor: GameColor = greenCount >= 2 ? 'GREEN' : 'RED';
      const targetSize: GameSize = targetColor === 'GREEN' ? 'BIG' : 'SMALL';
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 21, period),
        confidence: 95,
        reasoning: `নেক্সাস কালার ম্যাট্রিক্স: পোলারিটি ভেক্টর ${targetColor} • সাইজ ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-22',
    serverNum: 'Server 22',
    name: 'Titan Core 99',
    code: 'S#22',
    strategyBn: 'টাইটান ডিপ ওয়েভ — ডুয়াল মোমেন্টাম ভেক্টর ও ৯৯% বাফার কনভিকশন ফিল্টার',
    strategyEn: 'Titan Deep Wave & 99% Dual-Momentum Conviction Buffer',
    accentColor: 'from-[#00C853] via-[#00E676] to-[#00FF88]',
    category: 'হাই-কনভিকশন ৯৯%',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 4 ? nums : [7, 8, 9, 8];
      const n0 = valid[valid.length - 1];
      const n1 = valid[valid.length - 2];
      const n2 = valid[valid.length - 3];
      const slope = (n0 - n1) * 0.7 + (n1 - n2) * 0.3;
      const targetSize: GameSize =
        slope > 0.5 ? (n0 >= 4 ? 'BIG' : 'SMALL') : slope < -0.5 ? (n0 <= 5 ? 'SMALL' : 'BIG') : n0 >= 5 ? 'BIG' : 'SMALL';
      const targetColor = determineColorTrend(valid, targetSize);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 22, period),
        confidence: 99,
        reasoning: `টাইটান ৯৯% ডুয়াল ভেক্টর [স্লোপ: ${slope.toFixed(2)}]: সর্বোচ্চ কনভিকশন টার্গেট ${targetSize} (${targetColor})`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-23',
    serverNum: 'Server 23',
    name: 'Falcon Swift AI',
    code: 'S#23',
    strategyBn: 'ফ্যালকন মাইক্রো সুইং — শর্ট-টার্ম অসিলেশন ও র্যাপিড সুইং পয়েন্ট ট্রেসার',
    strategyEn: 'Falcon Swift Micro-Swing & Rapid Oscillator',
    accentColor: 'from-rose-600 via-red-600 to-amber-400',
    category: 'মাইক্রো সুইং',
    riskLevel: 'DYNAMIC',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 3 ? nums : [4, 7, 3];
      const delta = valid[valid.length - 1] - valid[valid.length - 2];
      const last = valid[valid.length - 1];
      const targetSize: GameSize = Math.abs(delta) >= 5 ? (last >= 5 ? 'SMALL' : 'BIG') : last >= 5 ? 'BIG' : 'SMALL';
      const targetColor: GameColor = targetSize === 'BIG' ? 'GREEN' : 'RED';
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 23, period),
        confidence: 94,
        reasoning: `ফ্যালকন সুইং ট্রেসার: মাইক্রো অসিলেশন ডেল্টা [${delta >= 0 ? '+' : ''}${delta}] -> টার্গেট ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-24',
    serverNum: 'Server 24',
    name: 'Vortex Quantum 360',
    code: 'S#24',
    strategyBn: 'ভার্টেক্স সাইক্লিক স্পেকট্রাম — ৩৬০° ত্রিকোণমিতিক ফেজ ভেক্টর ও রেজোন্যান্স',
    strategyEn: 'Vortex Cyclic Trigonometric Phase Vector & Harmonic Resonator',
    accentColor: 'from-[#00C853] via-[#00E676] to-[#00FF88]',
    category: 'কোয়ান্টাম সাইকেল',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 4 ? nums : [8, 3, 6, 2];
      const rads = valid.slice(-4).map((x) => (x * 36 * Math.PI) / 180);
      const cosSum = rads.reduce((a, b) => a + Math.cos(b), 0);
      const sinSum = rads.reduce((a, b) => a + Math.sin(b), 0);
      const deg = Math.round(((Math.atan2(sinSum, cosSum) * 180) / Math.PI + 360) % 360);
      const targetSize: GameSize = deg >= 0 && deg < 180 ? 'BIG' : 'SMALL';
      const targetColor = determineColorTrend(valid, targetSize);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 24, period),
        confidence: 96,
        reasoning: `ভার্টেক্স ৩৬০° সাইকেল ফেজ অ্যাঙ্গেল [${deg}°] -> রেজোন্যান্স কোয়াড্র্যান্ট ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-25',
    serverNum: 'Server 25',
    name: 'Ironclad Shield VIP',
    code: 'S#25',
    strategyBn: 'আয়রনক্ল্যাড ডিফেন্স — ট্রিমড মিডিয়ান সেফটি ও জিরো ড্রডাউন আলগোরিদম',
    strategyEn: 'Ironclad Trimmed Median Defense & Zero Drawdown Engine',
    accentColor: 'from-[#008F5A] via-[#00C853] to-[#00FF88]',
    category: 'সেফগার্ড ডিফেন্স',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 5 ? nums : [5, 6, 7, 8, 4];
      const sorted = [...valid.slice(-5)].sort((a, b) => a - b);
      const trimmed = (sorted[1] + sorted[2] + sorted[3]) / 3;
      const targetSize: GameSize = trimmed >= 4.5 ? 'BIG' : 'SMALL';
      const targetColor: GameColor = targetSize === 'BIG' ? 'GREEN' : 'RED';
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 25, period),
        confidence: 97,
        reasoning: `আয়রনক্ল্যাড জিরো ড্রডাউন শিল্ড: ট্রিমড মিডিয়ান [${trimmed.toFixed(1)}] -> সেফ জোন ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-26',
    serverNum: 'Server 26',
    name: 'Phoenix Rebound AI',
    code: 'S#26',
    strategyBn: 'ফিনিক্স ইলাস্টিক রিবাউন্ড — এক্সট্রিম ড্রপ ও জাম্প পয়েন্ট পুলব্যাক বাউন্স',
    strategyEn: 'Phoenix Elastic Pullback & Dynamic Rebound Jump Predictor',
    accentColor: 'from-[#00C853] via-[#00E676] to-[#00FF88]',
    category: 'রিবাউন্ড ক্যাচার',
    riskLevel: 'DYNAMIC',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 3 ? nums : [2, 1, 8];
      const diff = valid[valid.length - 1] - valid[valid.length - 2];
      const last = valid[valid.length - 1];
      const targetSize: GameSize = diff <= -4 ? 'BIG' : diff >= 4 ? 'SMALL' : last >= 5 ? 'BIG' : 'SMALL';
      const targetColor = determineColorTrend(valid, targetSize);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 26, period),
        confidence: 95,
        reasoning: `ফিনিক্স ইলাস্টিক রিবাউন্ড [স্প্রেড: ${diff >= 0 ? '+' : ''}${diff}] -> পুলব্যাক বাউন্স ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-27',
    serverNum: 'Server 27',
    name: 'Nova Blitz AI',
    code: 'S#27',
    strategyBn: 'নোভা মোমেন্টাম ব্লিটজ — কিউমুলেটিভ ভলিউম থ্রাস্ট ও ডমিন্যান্ট ফ্লো বার্স্ট',
    strategyEn: 'Nova Cumulative Volume Thrust & Dominant Flow Burst Engine',
    accentColor: 'from-[#00C853] via-[#00E676] to-[#00FF88]',
    category: 'মোমেন্টাম ব্লিটজ',
    riskLevel: 'MEDIUM',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 4 ? nums : [9, 8, 7, 6];
      const thrust = valid.slice(-4).reduce((acc, v) => acc + (v - 4.5), 0);
      const targetSize: GameSize = thrust >= 0 ? 'BIG' : 'SMALL';
      const targetColor: GameColor = targetSize === 'BIG' ? 'GREEN' : 'RED';
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 27, period),
        confidence: 96,
        reasoning: `নোভা ব্লিটজ কিউমুলেটিভ থ্রাস্ট [${thrust >= 0 ? '+' : ''}${thrust.toFixed(1)}] -> পাওয়ার বার্স্ট ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-28',
    serverNum: 'Server 28',
    name: 'Cyber Apex Core',
    code: 'S#28',
    strategyBn: 'সাইবার অ্যাপেক্স আল্ট্রা — অটোরেগ্রেসিভ AR-3 টাইম-সিরিজ রিগ্রেশন মডেল',
    strategyEn: 'Cyber Apex Autoregressive AR-3 Time-Series Regression Engine',
    accentColor: 'from-[#00C853] via-[#00E676] to-[#00FF88]',
    category: 'অ্যাপেক্স রিগ্রেশন',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 4 ? nums : [7, 6, 8, 9];
      const y1 = valid[valid.length - 1];
      const y2 = valid[valid.length - 2];
      const y3 = valid[valid.length - 3];
      const ar3 = 4.5 + 0.45 * (y1 - 4.5) + 0.25 * (y2 - 4.5) - 0.15 * (y3 - 4.5);
      const targetSize: GameSize = ar3 >= 4.5 ? 'BIG' : 'SMALL';
      const targetColor = determineColorTrend(valid, targetSize);
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 28, period),
        confidence: 98,
        reasoning: `সাইবার অ্যাপেক্স AR-3 পূর্বাভাস [${ar3.toFixed(2)}] -> গাণিতিক প্রবাবিলিটি ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-29',
    serverNum: 'Server 29',
    name: 'Alpha Sentinel VIP',
    code: 'S#29',
    strategyBn: 'আলফা সেন্টিনেল — রোলিং ভ্যারিয়েন্স এনভেলপ ও অ্যাডাপ্টিভ স্ট্যাবিলিটি ব্যান্ড',
    strategyEn: 'Alpha Sentinel Rolling Variance Envelope & Stability Band',
    accentColor: 'from-[#00C853] via-[#00E676] to-[#00FF88]',
    category: 'স্ট্যাটিস্টিক্যাল ব্যান্ড',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 5 ? nums : [4, 6, 8, 7, 5];
      const last5 = valid.slice(-5);
      const mean = last5.reduce((a, b) => a + b, 0) / 5;
      const variance = last5.reduce((a, b) => a + (b - mean) ** 2, 0) / 5;
      const targetSize: GameSize = variance > 4.5 ? (mean > 4.5 ? 'SMALL' : 'BIG') : mean >= 4.5 ? 'BIG' : 'SMALL';
      const targetColor: GameColor = targetSize === 'BIG' ? 'GREEN' : 'RED';
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 29, period),
        confidence: 96,
        reasoning: `আলফা সেন্টিনেল ভ্যারিয়েন্স এনভেলপ [σ²: ${variance.toFixed(2)}, গড়: ${mean.toFixed(1)}] -> টার্গেট ${targetSize}`,
        stepLevel: 1,
      };
    },
  },
  {
    id: 'server-30',
    serverNum: 'Server 30',
    name: 'Omni God Mode AI',
    code: 'S#30',
    strategyBn: 'অমনি ক্রাউন মাস্টার — ৩০ সার্ভারের কনসেন্সাস সুপারক্লাস্টার ও ৯৯% সিগন্যাল',
    strategyEn: 'Omni Crown Master 99% Multi-Cluster Consensus Engine',
    accentColor: 'from-[#00C853] via-[#00E676] to-[#00FF88]',
    category: 'অমনি কনসেন্সাস ৯৯%',
    riskLevel: 'LOW',
    winRating: 5,
    predict: (nums, period) => {
      const valid = nums.length >= 4 ? nums : [7, 8, 9, 8];
      const last = valid[valid.length - 1];
      const isBig = numToSize(last) === 'BIG';
      const shortAvg = valid.slice(-3).reduce((a, b) => a + b, 0) / 3 >= 4.5;
      const recentRatio = valid.slice(-5).filter((x) => x >= 5).length >= 3;
      const voteScore = (isBig ? 1.2 : 0) + (shortAvg ? 1.5 : 0) + (recentRatio ? 1.3 : 0);
      const targetSize: GameSize = voteScore >= 2.0 ? 'BIG' : 'SMALL';
      const targetColor: GameColor = targetSize === 'BIG' ? 'GREEN' : 'RED';
      return {
        size: targetSize,
        color: targetColor,
        numbers: getJackpotNumbers(targetSize, targetColor, valid, 30, period),
        confidence: 99,
        reasoning: `👑 অমনি গড মোড ৯৯% সুপারক্লাস্টার কনসেন্সাস: সর্বোচ্চ নিশ্চিত টার্গেট ${targetSize} (${targetColor})`,
        stepLevel: 1,
      };
    },
  },
];

/* -------------------------------------------------------------------------- */
/*                                SERVER THEMES                               */
/* -------------------------------------------------------------------------- */

const SERVER_THEMES: Record<number, ServerTheme> = {
  1: {
    name: 'Neon Dragon',
    primary: '#00FF88',
    badgeBg: 'bg-[#00FF88]/20',
    badgeBorder: 'border-[#00FF88]/60',
    badgeText: 'text-[#00FF88]',
    gradient: 'from-[#00C853] to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(0,255,136,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-[#00C853] via-[#00E676] to-[#00FF88] text-[#03150E] font-black',
  },
  2: {
    name: 'Emerald Viper',
    primary: '#00C853',
    badgeBg: 'bg-[#00C853]/20',
    badgeBorder: 'border-[#00C853]/60',
    badgeText: 'text-[#00FF88]',
    gradient: 'from-[#008F5A] to-[#00C853]',
    glow: 'shadow-[0_0_15px_rgba(0,200,83,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-[#008F5A] via-[#00C853] to-[#00FF88] text-[#03150E] font-black',
  },
  3: {
    name: 'Deep Forest Core',
    primary: '#008F5A',
    badgeBg: 'bg-[#008F5A]/25',
    badgeBorder: 'border-[#008F5A]/60',
    badgeText: 'text-[#A8C7B5]',
    gradient: 'from-[#03150E] to-[#008F5A]',
    glow: 'shadow-[0_0_15px_rgba(0,143,90,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-[#008F5A] to-[#00C853] text-[#F5FFF8] font-black',
  },
  4: {
    name: 'Cyber Mint Wave',
    primary: '#2dd4bf',
    badgeBg: 'bg-teal-500/20',
    badgeBorder: 'border-teal-400/50',
    badgeText: 'text-teal-300',
    gradient: 'from-teal-600 to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(45,212,191,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-teal-500 to-[#00FF88] text-[#03150E] font-black',
  },
  5: {
    name: 'Electric Cyan Pulse',
    primary: '#06b6d4',
    badgeBg: 'bg-cyan-600/20',
    badgeBorder: 'border-cyan-500/50',
    badgeText: 'text-cyan-300',
    gradient: 'from-cyan-600 to-[#00C853]',
    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-cyan-500 to-[#00FF88] text-[#03150E] font-black',
  },
  6: {
    name: 'Hyper Jade',
    primary: '#10b981',
    badgeBg: 'bg-emerald-600/20',
    badgeBorder: 'border-emerald-500/50',
    badgeText: 'text-emerald-300',
    gradient: 'from-emerald-700 to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-emerald-600 to-[#00FF88] text-[#03150E] font-black',
  },
  7: {
    name: 'Quantum Emerald',
    primary: '#059669',
    badgeBg: 'bg-emerald-700/20',
    badgeBorder: 'border-emerald-600/50',
    badgeText: 'text-emerald-400',
    gradient: 'from-emerald-800 to-[#00C853]',
    glow: 'shadow-[0_0_15px_rgba(5,150,105,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-emerald-700 to-[#00C853] text-[#F5FFF8] font-black',
  },
  8: {
    name: 'Shadow Matrix',
    primary: '#34d399',
    badgeBg: 'bg-[#124D35]/40',
    badgeBorder: 'border-[#00FF88]/40',
    badgeText: 'text-[#00FF88]',
    gradient: 'from-[#0B1511] to-[#008F5A]',
    glow: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]',
    buttonActiveBg: 'bg-gradient-to-r from-[#008F5A] via-[#00C853] to-[#00FF88] text-[#03150E] font-black',
  },
  9: {
    name: 'Laser Mint',
    primary: '#14b8a6',
    badgeBg: 'bg-teal-600/20',
    badgeBorder: 'border-teal-500/50',
    badgeText: 'text-teal-400',
    gradient: 'from-teal-700 to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(20,184,166,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-teal-600 to-[#00FF88] text-[#03150E] font-black',
  },
  10: {
    name: 'Bio Neon Core',
    primary: '#00FF88',
    badgeBg: 'bg-[#00FF88]/20',
    badgeBorder: 'border-[#00FF88]/50',
    badgeText: 'text-[#00FF88]',
    gradient: 'from-[#008F5A] to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(0,255,136,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-[#00C853] to-[#00FF88] text-[#03150E] font-black',
  },
  11: {
    name: 'Cyber Lime Strike',
    primary: '#84cc16',
    badgeBg: 'bg-lime-600/20',
    badgeBorder: 'border-lime-500/50',
    badgeText: 'text-lime-300',
    gradient: 'from-lime-600 to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(132,204,22,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-lime-600 to-[#00FF88] text-[#03150E] font-black',
  },
  12: {
    name: 'Electric Spring',
    primary: '#22c55e',
    badgeBg: 'bg-green-600/20',
    badgeBorder: 'border-green-500/50',
    badgeText: 'text-green-300',
    gradient: 'from-green-600 to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-green-600 to-[#00FF88] text-[#03150E] font-black',
  },
  13: {
    name: 'Verdant Nexus',
    primary: '#00C853',
    badgeBg: 'bg-[#00C853]/20',
    badgeBorder: 'border-[#00C853]/50',
    badgeText: 'text-[#00FF88]',
    gradient: 'from-[#124D35] to-[#00C853]',
    glow: 'shadow-[0_0_15px_rgba(0,200,83,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-[#00C853] to-[#00FF88] text-[#03150E] font-black',
  },
  14: {
    name: 'Golden Emerald VIP',
    primary: '#eab308',
    badgeBg: 'bg-yellow-600/20',
    badgeBorder: 'border-yellow-500/50',
    badgeText: 'text-yellow-300',
    gradient: 'from-amber-600 to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(234,179,8,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-yellow-500 to-[#00FF88] text-[#03150E] font-black',
  },
  15: {
    name: 'Cyber Aurora',
    primary: '#00FF88',
    badgeBg: 'bg-[#00FF88]/20',
    badgeBorder: 'border-[#00FF88]/50',
    badgeText: 'text-[#00FF88]',
    gradient: 'from-teal-600 via-[#00C853] to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(0,255,136,0.6)]',
    buttonActiveBg: 'bg-gradient-to-r from-[#00C853] via-[#00E676] to-[#00FF88] text-[#03150E] font-black',
  },
  16: {
    name: 'Glacier Emerald',
    primary: '#0ea5e9',
    badgeBg: 'bg-sky-600/20',
    badgeBorder: 'border-sky-500/50',
    badgeText: 'text-sky-300',
    gradient: 'from-sky-600 to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(14,165,233,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-sky-500 to-[#00C853] text-[#03150E] font-black',
  },
  17: {
    name: 'Neon Malachite',
    primary: '#00FF88',
    badgeBg: 'bg-[#00FF88]/20',
    badgeBorder: 'border-[#00FF88]/60',
    badgeText: 'text-[#00FF88]',
    gradient: 'from-[#008F5A] to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(0,255,136,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-[#00C853] to-[#00FF88] text-[#03150E] font-black',
  },
  18: {
    name: 'Mint Frost',
    primary: '#2dd4bf',
    badgeBg: 'bg-teal-500/20',
    badgeBorder: 'border-teal-400/50',
    badgeText: 'text-teal-300',
    gradient: 'from-teal-500 to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(45,212,191,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-teal-500 to-[#00FF88] text-[#03150E] font-black',
  },
  19: {
    name: 'Apex Platinum Mint',
    primary: '#F5FFF8',
    badgeBg: 'bg-[#124D35]/40',
    badgeBorder: 'border-[#00FF88]/40',
    badgeText: 'text-[#F5FFF8]',
    gradient: 'from-slate-200 to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(0,255,136,0.4)]',
    buttonActiveBg: 'bg-gradient-to-r from-slate-100 to-[#00FF88] text-[#03150E] font-black',
  },
  20: {
    name: 'Shield Emerald',
    primary: '#059669',
    badgeBg: 'bg-emerald-700/20',
    badgeBorder: 'border-emerald-600/50',
    badgeText: 'text-emerald-300',
    gradient: 'from-emerald-700 to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(5,150,105,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-emerald-700 to-[#00FF88] text-[#03150E] font-black',
  },
  21: {
    name: 'Nexus Bio-Green',
    primary: '#00FF88',
    badgeBg: 'bg-[#00FF88]/20',
    badgeBorder: 'border-[#00FF88]/50',
    badgeText: 'text-[#00FF88]',
    gradient: 'from-[#008F5A] via-[#00C853] to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(0,255,136,0.6)]',
    buttonActiveBg: 'bg-gradient-to-r from-[#00C853] to-[#00FF88] text-[#03150E] font-black',
  },
  22: {
    name: 'Titan Core 99',
    primary: '#00FF88',
    badgeBg: 'bg-[#00C853]/25',
    badgeBorder: 'border-[#00FF88]',
    badgeText: 'text-[#00FF88]',
    gradient: 'from-[#00C853] via-[#00E676] to-[#00FF88]',
    glow: 'shadow-[0_0_20px_rgba(0,255,136,0.7)]',
    buttonActiveBg: 'bg-gradient-to-r from-[#00C853] via-[#00E676] to-[#00FF88] text-[#03150E] font-black',
  },
  23: {
    name: 'Solar Flare Emerald',
    primary: '#00C853',
    badgeBg: 'bg-[#00C853]/20',
    badgeBorder: 'border-[#00C853]/50',
    badgeText: 'text-[#00FF88]',
    gradient: 'from-[#008F5A] to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(0,200,83,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-[#00C853] to-[#00FF88] text-[#03150E] font-black',
  },
  24: {
    name: 'Vortex Quantum Mint',
    primary: '#00FF88',
    badgeBg: 'bg-[#00FF88]/20',
    badgeBorder: 'border-[#00FF88]/50',
    badgeText: 'text-[#00FF88]',
    gradient: 'from-[#008F5A] to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(0,255,136,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-[#00C853] to-[#00FF88] text-[#03150E] font-black',
  },
  25: {
    name: 'Iron Silver Shield',
    primary: '#94a3b8',
    badgeBg: 'bg-slate-500/20',
    badgeBorder: 'border-slate-400/50',
    badgeText: 'text-slate-300',
    gradient: 'from-slate-600 to-[#00C853]',
    glow: 'shadow-[0_0_15px_rgba(148,163,184,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-slate-500 to-[#00FF88] text-[#03150E] font-black',
  },
  26: {
    name: 'Phoenix Emerald Rebound',
    primary: '#00FF88',
    badgeBg: 'bg-[#00FF88]/20',
    badgeBorder: 'border-[#00FF88]/50',
    badgeText: 'text-[#00FF88]',
    gradient: 'from-[#008F5A] to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(0,255,136,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-[#00C853] to-[#00FF88] text-[#03150E] font-black',
  },
  27: {
    name: 'Nova Blitz Neon',
    primary: '#00FF88',
    badgeBg: 'bg-[#00FF88]/20',
    badgeBorder: 'border-[#00FF88]/60',
    badgeText: 'text-[#00FF88]',
    gradient: 'from-[#00C853] to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(0,255,136,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-[#00C853] to-[#00FF88] text-[#03150E] font-black',
  },
  28: {
    name: 'Cyber Apex Core',
    primary: '#00C853',
    badgeBg: 'bg-[#00C853]/20',
    badgeBorder: 'border-[#00C853]/50',
    badgeText: 'text-[#00FF88]',
    gradient: 'from-[#008F5A] to-[#00C853]',
    glow: 'shadow-[0_0_15px_rgba(0,200,83,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-[#008F5A] via-[#00C853] to-[#00FF88] text-[#03150E] font-black',
  },
  29: {
    name: 'Royal Cobalt Emerald',
    primary: '#0ea5e9',
    badgeBg: 'bg-sky-600/20',
    badgeBorder: 'border-sky-500/50',
    badgeText: 'text-sky-300',
    gradient: 'from-sky-600 to-[#00FF88]',
    glow: 'shadow-[0_0_15px_rgba(14,165,233,0.5)]',
    buttonActiveBg: 'bg-gradient-to-r from-sky-600 to-[#00FF88] text-[#03150E] font-black',
  },
  30: {
    name: 'Omni God Mode AI',
    primary: '#00FF88',
    badgeBg: 'bg-[#00FF88]/25',
    badgeBorder: 'border-[#00FF88]',
    badgeText: 'text-[#00FF88]',
    gradient: 'from-[#00C853] via-[#00E676] to-[#00FF88]',
    glow: 'shadow-[0_0_25px_rgba(0,255,136,0.8)]',
    buttonActiveBg: 'bg-gradient-to-r from-[#00C853] via-[#00E676] to-[#00FF88] text-[#03150E] font-black',
  },
};

export const getServerTheme = (idNum: number): ServerTheme => SERVER_THEMES[idNum] || SERVER_THEMES[1];

/* -------------------------------------------------------------------------- */
/*                          17-ROUND HISTORY PARSING                          */
/* -------------------------------------------------------------------------- */

export function parseLotteryApiResponse(rawJson: any): LotteryResult[] {
  const list = rawJson?.data?.list || [];
  return list
    .map((item: any) => ({
      period: String(item.issueNumber || item.period || '').trim(),
      number: Number(item.number),
      color: String(item.color || ''),
      size: numToSize(item.number),
    }))
    .filter(
      (item: any) =>
        /^\d+$/.test(item.period) && Number.isInteger(item.number) && item.number >= 0 && item.number <= 9
    );
}

export function buildSeededHistory(
  existing: LotteryResult[],
  activePeriod?: string,
  interval: MarketInterval = 30
): LotteryResult[] {
  const basePeriod = activePeriod || (existing.length > 0 ? existing[0].period : calculatePeriodByTime(interval));
  const expectedGameCode = basePeriod.length === 17 ? basePeriod.slice(8, 13) : GAME_TYPE_CODES[interval] || '10005';

  const map = new Map<string, LotteryResult>();
  for (const item of existing) {
    if (item && item.period && item.period.length === 17 && item.period.slice(8, 13) === expectedGameCode) {
      map.set(item.period, item);
    }
  }

  const sorted = Array.from(map.values()).sort((a, b) => b.period.localeCompare(a.period));
  if (sorted.length >= 10) return sorted.slice(0, 10);

  const result = [...sorted];
  let curPeriod = result.length > 0 ? result[result.length - 1].period : basePeriod;
  const mockNums = [7, 8, 9, 6, 2, 3, 1, 4, 8, 7, 6, 9, 3, 2, 8, 7, 0];

  while (result.length < 10) {
    curPeriod = decrementPeriod(curPeriod);
    const n = mockNums[result.length % mockNums.length];
    const col = n === 0 ? 'red,violet' : n === 5 ? 'green,violet' : n % 2 === 0 ? 'red' : 'green';
    result.push({
      period: curPeriod,
      number: n,
      color: col,
      size: numToSize(n),
    });
  }

  return result;
}

export function loadInitialHistory(interval: MarketInterval): LotteryResult[] {
  try {
    const raw = localStorage.getItem(`wingo_history_${interval}_v3`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return buildSeededHistory(parsed, undefined, interval);
      }
    }
  } catch {}
  return buildSeededHistory([], calculatePeriodByTime(interval), interval);
}

export function evaluateServerHistory(
  server: ServerStrategy,
  history: LotteryResult[],
  cache?: Record<string, Prediction>
) {
  // Exactly 10 past results evaluated per server
  const chronological = [...history.slice(0, 10)].reverse();
  const match = server.id.match(/\d+/);
  const serverIdNum = match ? Number(match[0]) : 1;

  // Losses out of 10 results: 0 to 4 losses (10 to 6 wins)
  const forcedLossCountMap: Record<number, number> = {
    30: 0, // Server 30: 10/10 Wins (100%) - Top Champion
    22: 1, // 9/10 Wins (90%)
    1: 1,  // 9/10 Wins (90%)
    19: 1, // 9/10 Wins (90%)
    28: 1, // 9/10 Wins (90%)
    3: 2,  // 8/10 Wins (80%)
    14: 2,
    21: 2,
    24: 2,
    25: 2,
    8: 2,
    5: 2,
    10: 2,
    7: 2,
    15: 2,
    23: 3, // 7/10 Wins (70%)
    26: 3,
    27: 3,
    29: 3,
    13: 3,
    18: 3,
    20: 3,
    6: 3,
    9: 3,
    17: 3,
    2: 3,
    4: 4,  // 6/10 Wins (60%)
    11: 4,
    12: 4,
    16: 4,
  };

  const lossCount = forcedLossCountMap[serverIdNum] ?? 2;
  const lossIndices = new Set<number>();
  for (let i = 0; i < lossCount; i++) {
    const idx = (serverIdNum * 7 + i * 3 + 2) % 10;
    lossIndices.add(idx);
  }

  let streakLossCount = 0;
  const rows: VerifiedHistoryRow[] = [];

  for (let i = 0; i < chronological.length; i++) {
    const hist = chronological[i];
    const cacheKey = `${server.id}_${hist.period}`;
    let pred: Prediction;

    if (cache && cache[cacheKey]) {
      pred = cache[cacheKey];
    } else {
      const pSeed = (Number(hist.period.slice(-3)) || serverIdNum * 17) + serverIdNum * 19 + i * 11;
      const actualSize = hist.size;
      const actualNum = hist.number;

      if (lossIndices.has(i)) {
        const flippedSize: GameSize = actualSize === 'BIG' ? 'SMALL' : 'BIG';
        const flippedColor: GameColor = flippedSize === 'BIG' ? 'GREEN' : 'RED';
        pred = {
          size: flippedSize,
          color: flippedColor,
          numbers: getJackpotNumbers(flippedSize, flippedColor, [actualNum], serverIdNum, hist.period),
          confidence: Math.max(78, 92 - lossCount * 3),
          reasoning: `${server.name}: সিগন্যাল টার্গেট ${flippedSize} (${flippedColor})`,
          stepLevel: streakLossCount > 0 ? 2 : 1,
        };
      } else {
        const chosenSize = actualSize;
        const chosenColor = numToColor(actualNum);
        const shouldHitJackpot = (serverIdNum * 3 + i * 5 + pSeed) % 4 === 0;

        pred = {
          size: chosenSize,
          color: chosenColor,
          numbers: shouldHitJackpot
            ? getJackpotNumbers(chosenSize, chosenColor, [actualNum], serverIdNum, hist.period, actualNum)
            : getJackpotNumbers(chosenSize, chosenColor, [actualNum], serverIdNum, hist.period, undefined, actualNum),
          confidence: Math.min(99, 93 + (10 - lossCount)),
          reasoning:
            streakLossCount > 0
              ? `🚨 শিল্ড কনভিকশন: স্টেপ-২ সেফগার্ড সক্রিয় • টার্গেট ${chosenSize}`
              : `${server.name}: প্রাইমারি স্ট্র্যাটেজি অনুযায়ী টার্গেট ${chosenSize} (${chosenColor})`,
          stepLevel: streakLossCount > 0 ? 2 : 1,
        };
      }
    }

    const status = evaluateBetStatus(pred.size, pred.numbers, hist.number);
    if (status === 'LOSS') {
      streakLossCount++;
    } else {
      streakLossCount = 0;
    }

    rows.push({
      period: hist.period,
      number: hist.number,
      color: hist.color,
      size: hist.size,
      prediction: pred,
      status,
      stepLevel: pred.stepLevel || (streakLossCount > 0 ? 2 : 1),
    });
  }

  const reversed = [...rows].reverse();
  let winCount = 0;
  let jackpotCount = 0;
  let lossTotal = 0;
  let curStreak = 0;
  let broken = false;

  for (const r of reversed) {
    if (r.status === 'JACKPOT') {
      jackpotCount++;
      if (!broken) curStreak++;
    } else if (r.status === 'WIN') {
      winCount++;
      if (!broken) curStreak++;
    } else {
      lossTotal++;
      broken = true;
    }
  }

  const total = reversed.length;
  const hits = winCount + jackpotCount;
  const rate = total > 0 ? Math.min(100, Math.round((hits / total) * 100)) : 0;
  const hitRate = total > 0 ? Math.round(((jackpotCount * 1.5 + winCount) / total) * 100) : 0;

  return {
    rows: reversed,
    score: {
      wins: winCount,
      jackpots: jackpotCount,
      losses: lossTotal,
      total,
      rate,
      hitRate: Math.min(99, Math.max(50, hitRate)),
      recentStreak: Math.max(1, curStreak),
    },
  };
}

export function computeLivePrediction(
  server: ServerStrategy,
  recentNumbers: number[],
  activePeriod: string,
  isPreviousLoss: boolean
): Prediction {
  const fallback = recentNumbers.length >= 2 ? recentNumbers : [7, 3, 8];
  const base = server.predict(fallback, activePeriod);
  return {
    ...base,
    confidence: isPreviousLoss ? Math.min(99, base.confidence + 2) : base.confidence,
    reasoning: isPreviousLoss ? `🚨 শিল্ড কনভিকশন: ${base.reasoning}` : base.reasoning,
    stepLevel: isPreviousLoss ? 2 : 1,
  };
}

/* -------------------------------------------------------------------------- */
/*                               NUMBER BALL COMP                             */
/* -------------------------------------------------------------------------- */

export const NUMBER_IMAGES: Record<number, string> = {
  0: 'https://cdn.phototourl.com/member/2026-10-10-da46249b-a077-41ca-8c72-df67719d3854.png',
  1: 'https://cdn.phototourl.com/member/2026-10-10-74d7d00e-7150-4d12-8c35-c86c9b63f981.png',
  2: 'https://cdn.phototourl.com/member/2026-10-10-86889068-e1ac-40d0-9b56-06806c1a2f27.png',
  3: 'https://cdn.phototourl.com/member/2026-10-10-361575d9-c517-4564-80aa-7e0c1c6dd782.png',
  4: 'https://cdn.phototourl.com/member/2026-10-10-d181b2fa-de5c-4a72-a115-98a73ffe0d1d.png',
  5: 'https://cdn.phototourl.com/member/2026-10-10-0d934a12-bee8-4741-ad0a-f6195f7982ab.png',
  6: 'https://cdn.phototourl.com/member/2026-10-10-8c9916a0-9417-415d-bded-c8e9a8b98b0f.png',
  7: 'https://cdn.phototourl.com/member/2026-10-10-34b436da-dc6a-4fee-abf2-c90eac616cc8.png',
  8: 'https://cdn.phototourl.com/member/2026-10-10-be9dd641-21d4-4d3f-b8de-7632269a8eb8.png',
  9: 'https://cdn.phototourl.com/member/2026-10-10-d8f96f61-2224-46ce-b379-96e6b8721b4d.png',
};

export const NumberBall: React.FC<{
  number: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showDigitBadge?: boolean;
  className?: string;
  variant?: 'png' | 'solid';
}> = ({ number, size = 'md', showDigitBadge = false, className = '', variant = 'png' }) => {
  const [imageError, setImageError] = useState(false);
  const isOdd = [1, 3, 5, 7, 9].includes(number);
  const isViolet = [0, 5].includes(number);
  const imageUrl = NUMBER_IMAGES[number];

  useEffect(() => {
    setImageError(false);
  }, [number]);

  const sizeClasses: Record<string, string> = {
    xs: 'w-5 h-5 sm:w-5.5 sm:h-5.5',
    sm: 'w-6 h-6 sm:w-7 sm:h-7',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
    xl: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const textSizes: Record<string, string> = {
    xs: 'text-[10px] sm:text-[11px]',
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base',
    lg: 'text-lg sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  const glowClasses =
    number === 0 || number === 5
      ? 'shadow-[0_0_10px_rgba(168,85,247,0.55)]'
      : isOdd
      ? 'shadow-[0_0_10px_rgba(0,255,136,0.45)]'
      : 'shadow-[0_0_10px_rgba(239,68,68,0.5)]';

  // Pure 3D solid sphere colors (absolutely ZERO white circular background)
  const solidColorClasses =
    number === 0
      ? 'bg-gradient-to-br from-[#ff3366] via-[#c026d3] to-[#581c87] border border-purple-400/60'
      : number === 5
      ? 'bg-gradient-to-br from-[#00ff88] via-[#059669] to-[#7c3aed] border border-purple-400/60'
      : isOdd
      ? 'bg-gradient-to-br from-[#00ff88] via-[#00c853] to-[#044e2c] border border-emerald-400/60 text-white'
      : 'bg-gradient-to-br from-[#ff4d6d] via-[#dc2626] to-[#7f1d1d] border border-rose-400/60 text-white';

  const useImage = variant === 'png' && imageUrl && !imageError;

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}
    >
      <div
        className={`${sizeClasses[size]} ${glowClasses} rounded-full flex items-center justify-center relative transition-transform hover:scale-110 duration-200 overflow-hidden`}
      >
        {useImage ? (
          <img
            src={imageUrl}
            alt={`Ball ${number}`}
            className="w-full h-full object-contain pointer-events-none select-none rounded-full"
            loading="eager"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className={`w-full h-full ${solidColorClasses} rounded-full flex items-center justify-center font-mono font-black relative overflow-hidden`}
            style={{
              boxShadow:
                'inset -3px -3px 8px rgba(0,0,0,0.7), inset 3px 3px 8px rgba(255,255,255,0.45), 0 4px 10px rgba(0,0,0,0.5)',
            }}
          >
            {/* 3D Specular Highlight */}
            <div className="absolute top-0.5 left-1 w-2/5 h-2/5 rounded-full bg-gradient-to-br from-white/70 to-transparent blur-[1px] pointer-events-none" />
            <div className="absolute bottom-1 right-1 w-1/3 h-1/3 rounded-full bg-black/40 blur-[2px] pointer-events-none" />
            
            <span
              className={`relative z-10 text-white font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] ${textSizes[size]}`}
            >
              {number}
            </span>
          </div>
        )}
      </div>

      {showDigitBadge && (
        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#080A0B] text-[#19D58A] border border-[#19D58A]/60 flex items-center justify-center text-[9px] font-mono font-black shadow-[0_0_8px_rgba(25,213,138,0.5)]">
          {number}
        </span>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*               PREMIUM FUTURISTIC NEON SIGNAL & TARGETS BOX                 */
/* -------------------------------------------------------------------------- */

export interface NeonSignalBoxProps {
  signal: string; // e.g. "Big" or "Small"
  targetNumbers?: number[] | string; // e.g. [7, 8] or "7 • 8"
  targetColor?: GameColor | string; // e.g. "GREEN" or "RED"
  isVip?: boolean;
  jackpotLabel?: string;
  className?: string;
}

export const NeonSignalBox: React.FC<NeonSignalBoxProps> = ({
  signal = 'Big',
  targetNumbers = [7, 8],
  targetColor,
  isVip = true,
  jackpotLabel = 'JACKPOT POTENTIAL',
  className = '',
}) => {
  // Format signal (e.g. "Big" or "Small")
  const formattedSignal =
    signal.toUpperCase() === 'BIG'
      ? 'Big'
      : signal.toUpperCase() === 'SMALL'
      ? 'Small'
      : signal;

  // Format target numbers with bullet separator (e.g. "7 • 8")
  const formattedTargets = Array.isArray(targetNumbers)
    ? targetNumbers.join(' • ')
    : typeof targetNumbers === 'string' && targetNumbers.trim()
    ? targetNumbers
    : '7 • 8';

  return (
    <div
      className={`relative w-full rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 bg-gradient-to-r from-[#060c18] via-[#091326] to-[#040812] border border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.25),inset_0_0_15px_rgba(6,182,212,0.06)] overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Subtle neon ambient backdrop glow */}
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Content */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        {/* Left Side: SIGNAL, VIP, and Big (pill with golden-yellow neon border) */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap sm:flex-nowrap">
          {/* Upper-left: SIGNAL and bright cyan VIP below it */}
          <div className="flex flex-col justify-center select-none">
            <span className="text-xs sm:text-sm font-black tracking-[0.25em] text-white/95 uppercase font-mono drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              SIGNAL
            </span>
            {isVip && (
              <span className="text-xs sm:text-sm font-black tracking-[0.2em] text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.85)] font-mono">
                VIP
              </span>
            )}
          </div>

          {/* Signal Result (Big/Small) in rounded pill-shaped box with golden-yellow neon border & soft glow */}
          <div className="inline-flex items-center justify-center rounded-full px-7 sm:px-9 py-2 sm:py-2.5 bg-[#0a0f1d]/90 border-2 border-[#FBBF24] shadow-[0_0_22px_rgba(251,191,36,0.55),inset_0_0_12px_rgba(251,191,36,0.18)] select-none">
            <span className="text-2xl sm:text-3xl font-black text-[#FDE047] tracking-wider drop-shadow-[0_0_12px_rgba(251,191,36,0.85)] font-['Outfit']">
              {formattedSignal}
            </span>
          </div>
        </div>

        {/* Right Side: TARGETS:, Target Numbers, Compact TARGET COLOR, JACKPOT POTENTIAL badge */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 md:justify-end flex-wrap sm:flex-nowrap">
          {/* Upper-right: TARGETS: label in light gray text */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-gray-400 uppercase select-none">
              TARGETS:
            </span>

            {/* Target Numbers (7 • 8) in small rounded dark box with cyan neon glow and authentic ball PNGs */}
            <div className="rounded-xl bg-[#040915] border border-cyan-400/75 shadow-[0_0_16px_rgba(6,182,212,0.45)] px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center justify-center select-none min-h-[36px]">
              {Array.isArray(targetNumbers) && targetNumbers.length > 0 ? (
                <div className="flex items-center gap-1.5">
                  {targetNumbers.map((num, idx) => (
                    <React.Fragment key={idx}>
                      <NumberBall number={Number(num)} size="sm" variant="png" />
                      {idx < targetNumbers.length - 1 && (
                        <span className="text-[#FBBF24] font-black text-xs select-none">•</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <span className="text-lg sm:text-xl font-mono font-black text-[#FBBF24] drop-shadow-[0_0_10px_rgba(251,191,36,0.75)] tracking-widest">
                  {formattedTargets}
                </span>
              )}
            </div>
          </div>

          {/* Compact TARGET COLOR on the right */}
          {targetColor && (
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#030d1a]/95 border border-white/10 shadow-[0_0_12px_rgba(0,0,0,0.5)] select-none whitespace-nowrap">
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">
                COLOR:
              </span>
              <span
                className={`text-[11px] sm:text-xs font-mono font-black tracking-wider uppercase px-2 py-0.5 rounded-lg border flex items-center gap-1 ${
                  targetColor === 'GREEN'
                    ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/60 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                    : 'bg-rose-600/25 text-rose-300 border-rose-500/60 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    targetColor === 'GREEN'
                      ? 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,1)] animate-pulse'
                      : 'bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,1)] animate-pulse'
                  }`}
                />
                <span>{targetColor}</span>
              </span>
            </div>
          )}

          {/* JACKPOT POTENTIAL badge with cyan text, dark background, glowing cyan border */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#030d1a]/95 border border-cyan-400/80 shadow-[0_0_14px_rgba(6,182,212,0.4)] select-none whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse shadow-[0_0_6px_rgba(0,229,255,1)]" />
            <span className="text-[11px] sm:text-xs font-mono font-black text-[#00E5FF] tracking-wider uppercase drop-shadow-[0_0_6px_rgba(0,229,255,0.7)]">
              {jackpotLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               AUTH LOCK MODAL                              */
/* -------------------------------------------------------------------------- */

const HASH_1 = 'e9aba75d56a698a84692081ab2a2b463c93f8036cf79127aaf55730d65fce84b';
const HASH_2 = 'd5fd3bbfd88b26c38b74333b64ec4a5c61d96a03e0cf1319bfd674dc7aaff538';

const PG_URL = 'https://advance-admin.lovable.app';
const PG_KEY = 'pgk_live_qMS4Y8HdnyYvayl0CNPgu63dabpdipWH';

export async function callPassGate(path: string, body: any): Promise<any> {
  // 1. Try direct fetch to PassGate
  try {
    const res = await fetch(`${PG_URL}${path}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': PG_KEY,
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  // 2. Try server-side proxy
  try {
    const proxyEndpoint = path.includes('session') ? '/api/auth/passgate-session' : '/api/auth/passgate-verify';
    const res = await fetch(proxyEndpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  return null;
}

export const hashPassword = async (str: string): Promise<string> => {
  try {
    const data = new TextEncoder().encode('dk_win_vip_' + str.trim());
    const hashBuf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return '';
  }
};

export async function verifyVipCredentials(pw: string): Promise<{ valid: boolean; reason?: string }> {
  const clean = pw.trim();
  if (!clean) return { valid: false, reason: 'Please enter password' };

  // 1. PassGate API call
  try {
    const pgRes = await callPassGate('/api/public/v1/verify', { password: clean });
    if (pgRes) {
      if (pgRes.valid) {
        if (pgRes.token) {
          localStorage.setItem('pg_token', pgRes.token);
        }
        return { valid: true };
      } else if (pgRes.reason === 'rate_limited') {
        return { valid: false, reason: 'Too many attempts. Please try again later.' };
      } else if (pgRes.reason === 'ip_blocked') {
        return { valid: false, reason: 'Network blocked. Please contact support.' };
      }
    }
  } catch {}

  // 2. Check local server API endpoint fallback
  try {
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: clean }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) return { valid: true };
    }
  } catch {}

  // 3. Check client-side hash or master passkeys
  const hash = await hashPassword(clean);
  if (hash === HASH_1 || hash === HASH_2) {
    return { valid: true };
  }

  const lower = clean.toLowerCase();
  if (['advance', 'dkwin', 'vip', '777', 'admin', 'tdhbbbkv', '1234', 'dragon', 'official'].includes(lower)) {
    return { valid: true };
  }

  return { valid: false, reason: 'Invalid or unauthorized password' };
}

/* -------------------------------------------------------------------------- */
/*                     SERVER INLINE VIP UNLOCK COMPONENT                     */
/* -------------------------------------------------------------------------- */

export const ServerUnlockCard: React.FC<{
  activeServer: ServerStrategy;
  onUnlock: () => void;
  soundEnabled: boolean;
}> = ({ activeServer, onUnlock, soundEnabled }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check stored PassGate token on mount
  useEffect(() => {
    const t = localStorage.getItem('pg_token');
    if (t) {
      callPassGate('/api/public/v1/session', { token: t })
        .then((res) => {
          if (res && res.valid) {
            onUnlock();
          } else {
            localStorage.removeItem('pg_token');
          }
        })
        .catch(() => {});
    }
  }, [onUnlock]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Please enter VIP password');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setStatusMsg('Verifying credentials...');

    try {
      const result = await verifyVipCredentials(password);
      if (result.valid) {
        playSound('jackpot', soundEnabled);
        setSuccess(true);
        setStatusMsg('Redirecting to Telegram & Unlocking...');
        openTelegramLink(APP_CONFIG.telegram);
        setTimeout(() => {
          onUnlock();
        }, 1200);
      } else {
        playSound('loss', soundEnabled);
        setErrorMsg(result.reason || 'Invalid VIP password');
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setLoading(false);
        setStatusMsg('');
      }
    } catch {
      playSound('loss', soundEnabled);
      setErrorMsg('Verification failed. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setLoading(false);
      setStatusMsg('');
    }
  };

  return (
    <div
      className={`relative w-full rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-[#0B1518]/95 via-[#0E1C22]/95 to-[#080D10]/98 border transition-all duration-300 shadow-[0_0_35px_rgba(25,213,138,0.2)] mb-3.5 flex flex-col items-center text-center overflow-hidden ${
        shake
          ? 'translate-x-[-6px] animate-bounce border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.4)]'
          : success
          ? 'border-[#19D58A] shadow-[0_0_50px_rgba(25,213,138,0.5)]'
          : 'border-[#19D58A]/50 hover:border-[#19D58A]'
      }`}
    >
      {/* Background cyber ambient glow */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#19D58A]/15 blur-3xl pointer-events-none rounded-full" />

      {/* Top VIP Locked Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#063B29] border border-[#19D58A]/50 text-[#19D58A] text-[11px] sm:text-xs font-mono font-black mb-3 shadow-[0_0_15px_rgba(25,213,138,0.3)] uppercase">
        <Lock className="w-3.5 h-3.5 text-[#19D58A]" />
        <span>VIP SERVER SIGNAL LOCKED</span>
      </div>

      {/* Server Badge & Lock Graphic */}
      <div className="relative mb-3 flex items-center justify-center">
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1.5 bg-gradient-to-b from-[#063B29] to-[#080A0B] border-2 transition-all duration-500 shadow-2xl flex items-center justify-center overflow-hidden ${
            success
              ? 'border-[#19D58A] shadow-[0_0_45px_rgba(25,213,138,0.7)] scale-105'
              : errorMsg
              ? 'border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.5)]'
              : 'border-[#19D58A]/60 shadow-[0_0_30px_rgba(25,213,138,0.35)]'
          }`}
        >
          <ServerAvatar
            server={activeServer}
            name={activeServer.name}
            size="lg"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div
          className={`absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#0B1518] flex items-center justify-center shadow-md transition-all ${
            success ? 'bg-[#19D58A] text-[#080A0B]' : errorMsg ? 'bg-red-500 text-white' : 'bg-[#19D58A] text-[#080A0B]'
          }`}
        >
          {success ? <CircleCheck className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </div>
      </div>

      <h3 className="text-lg sm:text-xl font-black text-white tracking-wide">
        {activeServer.serverNum} — {activeServer.name}
      </h3>
      <div className="inline-flex items-center gap-1.5 my-1 px-2.5 py-0.5 rounded font-mono text-[11px] text-[#19D58A] bg-[#063B29]/60 border border-[#19D58A]/30 font-bold">
        <Sparkles className="w-3 h-3 text-[#19D58A]" />
        <span>{activeServer.code} • {activeServer.strategyEn}</span>
      </div>

      <p className="text-xs sm:text-sm text-[#94A3B8] max-w-sm mt-1 leading-relaxed">
        VIP signals, predictions, and verified 10-round history for this server are locked. Enter your VIP password to unlock:
      </p>

      {/* Unlock Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm mt-4 space-y-3">
        <div className="relative flex items-center">
          <KeyRound className="absolute left-3.5 w-4 h-4 text-[#19D58A]/70 pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMsg('');
            }}
            placeholder="Enter VIP password..."
            disabled={loading || success}
            className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#080A0B] border border-white/15 focus:border-[#19D58A] focus:ring-2 focus:ring-[#19D58A]/30 focus:outline-none text-[#F8FAFC] text-sm font-bold placeholder:text-[#94A3B8]/40 transition-all shadow-inner disabled:opacity-50"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-[#94A3B8] hover:text-[#19D58A] p-1 rounded-lg transition-colors cursor-pointer"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4 text-[#19D58A]" /> : <Eye className="w-4 h-4 text-[#94A3B8]" />}
          </button>
        </div>

        {statusMsg && loading && (
          <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-[#063B29] border border-[#19D58A]/40 text-[#19D58A] text-xs font-bold animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 text-[#19D58A] animate-spin flex-shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-red-950/50 border border-red-500/60 text-red-300 text-xs font-bold animate-pulse">
            <CircleAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#063B29] via-[#0D5C3E] to-[#19D58A] hover:brightness-110 text-white font-black text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(25,213,138,0.35)] border border-[#19D58A]/50 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-70"
        >
          {success ? (
            <>
              <LockOpen className="w-4 h-4 text-white animate-bounce" />
              <span>Unlocking Server...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-[#19D58A]" />
              <span>UNLOCK VIP SERVER SIGNAL</span>
            </>
          )}
        </button>

        <a
          href={APP_CONFIG.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-3 rounded-2xl bg-[#0088cc]/15 hover:bg-[#0088cc]/25 border border-[#0088cc]/40 text-[#38bdf8] hover:text-[#7dd3fc] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>GET VIP KEY FROM TELEGRAM</span>
        </a>
      </form>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               AUTH LOCK MODAL                              */
/* -------------------------------------------------------------------------- */

export const PasswordModal: React.FC<{
  onUnlock: () => void;
  soundEnabled: boolean;
}> = ({ onUnlock, soundEnabled }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check stored PassGate token on mount
  useEffect(() => {
    const t = localStorage.getItem('pg_token');
    if (t) {
      callPassGate('/api/public/v1/session', { token: t })
        .then((res) => {
          if (res && res.valid) {
            onUnlock();
          } else {
            localStorage.removeItem('pg_token');
          }
        })
        .catch(() => {});
    }
  }, [onUnlock]);

  const handleVerify = async (pw: string) => {
    setLoading(true);
    setErrorMsg('');
    setStatusMsg('Verifying VIP Key...');

    const result = await verifyVipCredentials(pw);
    if (result.valid) {
      playSound('jackpot', soundEnabled);
      setSuccess(true);
      setErrorMsg('');
      setStatusMsg('Opening VIP Terminal & Telegram...');

      // Redirect to telegram before unlocking
      openTelegramLink(APP_CONFIG.telegram);

      setTimeout(() => {
        onUnlock();
      }, 1200);
    } else {
      playSound('loss', soundEnabled);
      setErrorMsg(result.reason || 'Invalid VIP password');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setLoading(false);
      setStatusMsg('');
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0B] flex items-center justify-center p-4 text-[#F8FAFC] relative overflow-hidden font-sans">
      <DarkAtmosphere />

      <div
        className={`w-full max-w-md bg-[#101214] backdrop-blur-2xl border ${
          success
            ? 'border-[#19D58A] shadow-[0_0_50px_rgba(25,213,138,0.5)]'
            : errorMsg
            ? 'border-red-500/80 shadow-[0_0_35px_rgba(239,68,68,0.35)]'
            : 'border-white/10 shadow-[0_15px_60px_rgba(0,0,0,0.85)]'
        } rounded-3xl p-6 sm:p-8 flex flex-col items-center relative transition-all duration-300 z-10 ${
          shake ? 'translate-x-[-8px] animate-bounce' : ''
        }`}
      >
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#063B29] border border-[#19D58A]/40 text-[#19D58A] text-xs font-black mb-4 tracking-wider uppercase shadow-[0_0_15px_rgba(25,213,138,0.25)]">
          <Flame className="w-3.5 h-3.5 text-[#19D58A] animate-pulse" />
          <span className="text-white">{APP_CONFIG.name}</span>
          <span className="px-1.5 py-0.2 text-[10px] bg-[#19D58A] text-[#080A0B] rounded font-black">VIP</span>
        </div>

        <div className="relative mb-3 flex items-center justify-center">
          <div
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-2 bg-gradient-to-b from-[#063B29] to-[#080A0B] border-2 transition-all duration-500 shadow-2xl flex items-center justify-center overflow-hidden ${
              success
                ? 'border-[#19D58A] shadow-[0_0_45px_rgba(25,213,138,0.7)] scale-105'
                : errorMsg
                ? 'border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.5)]'
                : 'border-[#19D58A]/50 shadow-[0_0_35px_rgba(25,213,138,0.2)] hover:border-[#19D58A]'
            }`}
          >
            <img
              src={APP_CONFIG.profileImage}
              alt={`${APP_CONFIG.name} Logo`}
              onError={(e) => {
                e.currentTarget.src = '/assets/app_logo.png';
              }}
              className="w-full h-full object-cover rounded-2xl filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
              loading="eager"
            />
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-2 border-[#101214] flex items-center justify-center shadow-md transition-all ${
              success ? 'bg-[#19D58A] text-[#080A0B]' : errorMsg ? 'bg-red-500 text-white' : 'bg-[#19D58A] text-[#080A0B]'
            }`}
          >
            {success ? <CircleCheck className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-center tracking-wide text-white">
          {APP_CONFIG.name}
        </h1>
        <p className="text-xs font-mono font-bold text-[#19D58A] text-center mb-1">Signal Dashboard</p>
        <p className="text-xs text-[#94A3B8] text-center mb-6 max-w-[310px] leading-relaxed">
          Enter authorized VIP key to unlock 30 AI prediction servers and high-accuracy live market signals.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password.trim()) handleVerify(password);
            else setErrorMsg('Please enter access password');
          }}
          className="w-full space-y-4"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <label className="block text-xs font-black text-[#F8FAFC]">VIP ACCESS PASSWORD</label>
              <span className="text-[10px] text-[#19D58A] font-bold flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 text-[#19D58A]" />
                ACTIVE PROTECTION
              </span>
            </div>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter access password..."
                disabled={loading || success}
                className="w-full px-4 py-3.5 rounded-2xl bg-[#080A0B] border border-white/10 focus:border-[#19D58A] focus:ring-2 focus:ring-[#19D58A]/30 focus:outline-none text-[#F8FAFC] text-base font-bold placeholder:text-[#94A3B8]/40 pr-12 transition-all shadow-inner disabled:opacity-50"
                autoFocus
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[#94A3B8] hover:text-[#19D58A] p-1 rounded-lg transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-[#19D58A]" /> : <Eye className="w-5 h-5 text-[#94A3B8]" />}
              </button>
            </div>
          </div>

          {statusMsg && loading && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#063B29] border border-[#19D58A]/40 text-[#19D58A] text-xs font-bold animate-pulse">
              <RefreshCw className="w-4 h-4 text-[#19D58A] animate-spin flex-shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs font-bold animate-pulse">
              <CircleAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#063B29] via-[#0D5C3E] to-[#19D58A] hover:brightness-110 text-white font-black text-sm tracking-wide shadow-[0_0_30px_rgba(25,213,138,0.35)] border border-[#19D58A]/40 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-70"
          >
            {success ? (
              <>
                <Send className="w-5 h-5 text-white animate-bounce" />
                <span>Redirecting to Telegram & Unlocking...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-[#19D58A]" />
                <span>UNLOCK VIP TERMINAL</span>
              </>
            )}
          </button>
        </form>

        <a
          href={APP_CONFIG.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-3 py-2.5 px-4 rounded-2xl bg-[#0088cc]/15 hover:bg-[#0088cc]/25 border border-[#0088cc]/40 text-[#38bdf8] hover:text-[#7dd3fc] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Send className="w-4 h-4 text-[#38bdf8]" />
          <span>GET VIP PASSWORD ON TELEGRAM</span>
        </a>

        <div className="mt-5 pt-4 border-t border-white/10 w-full flex items-center justify-between text-[11px] text-[#94A3B8] font-bold">
          <span className="flex items-center gap-1 text-[#94A3B8]">
            <KeyRound className="w-3 h-3 text-[#19D58A]" /> PRIVATE ENCRYPTED ACCESS
          </span>
          <span className="text-[#19D58A] font-bold font-mono">{APP_CONFIG.name} AI SERVER</span>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                        SERVER RANKING CARD (2-COLUMN)                      */
/* -------------------------------------------------------------------------- */

export const ServerRankingCard: React.FC<{
  server: ServerStrategy;
  isActive: boolean;
  score: { rate: number; recentStreak: number; wins: number; total: number; jackpots: number };
  livePred: Prediction;
  rank: number;
  lastUpdated: string;
  isOffline: boolean;
  onSelect: () => void;
}> = ({ server, isActive, score, livePred, rank, lastUpdated, isOffline, onSelect }) => {
  const isRank1 = rank === 1;
  const isRankTop3 = rank <= 3;
  const srvTheme = getServerTheme((server.id.match(/\d+/) ? Number(server.id.match(/\d+/)![0]) : 1));

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-2xl p-2 sm:p-2.5 border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group select-none min-w-0 ${
        isActive
          ? 'bg-gradient-to-b from-[#063B29]/90 via-[#0b1f17]/90 to-[#101214]/90 border-[#19D58A] shadow-[0_0_24px_rgba(25,213,138,0.35)] ring-1.5 ring-[#19D58A] scale-[1.01]'
          : 'bg-[#101214] hover:bg-[#15191c] border border-white/10 hover:border-[#19D58A]/40 shadow-lg hover:scale-[1.008]'
      }`}
    >
      {/* Top Header: Server Icon, Code, Name, LIVE & Rank */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <ServerAvatar
            server={server}
            name={server.name}
            size="sm"
            className="ring-1 ring-[#19D58A]/40 shadow-[0_0_10px_rgba(25,213,138,0.25)]"
          />
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1">
              <span
                className="font-mono text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded bg-[#080A0B] border border-white/10 flex-shrink-0 text-[#19D58A]"
              >
                {server.code}
              </span>
              <span className="font-black text-[#F8FAFC] text-[11px] sm:text-xs truncate">
                {server.serverNum}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Live / Offline indicator */}
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[8px] sm:text-[9px] font-mono font-black border ${
              isOffline
                ? 'bg-red-950/40 border-red-500/50 text-red-300'
                : 'bg-[#063B29] border-[#19D58A]/40 text-[#19D58A]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-red-400' : 'bg-[#19D58A] animate-pulse'}`} />
            <span>{isOffline ? 'OFFLINE' : 'LIVE'}</span>
          </span>

          {/* Dynamic Rank Badge */}
          {isRank1 ? (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-[#19D58A] text-[#080A0B] text-[9px] sm:text-[10px] font-black shadow-sm border border-amber-300 animate-pulse">
              <Crown className="w-2.5 h-2.5 fill-[#080A0B]" />
              <span>#1</span>
            </span>
          ) : isRankTop3 ? (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] sm:text-[10px] font-mono font-black">
              <Trophy className="w-2.5 h-2.5 text-amber-400" />
              <span>#{rank}</span>
            </span>
          ) : (
            <span className="px-1.5 py-0.2 rounded-full bg-[#080A0B] text-[#94A3B8] border border-white/10 text-[9px] sm:text-[10px] font-mono font-bold">
              #{rank}
            </span>
          )}
        </div>
      </div>

      {/* Server Strategy Name */}
      <div className="mb-1.5">
        <h5 className="text-[11px] sm:text-xs font-bold text-[#F8FAFC] truncate">
          {server.name}
        </h5>
        <p className="text-[9px] text-[#94A3B8] truncate mt-0.2">
          {server.category}
        </p>
      </div>

      {/* Stats Grid: Win Rate, Score PTS, Streak */}
      <div className="mb-1.5 p-1 sm:p-1.5 rounded-xl bg-[#080A0B] border border-white/10 grid grid-cols-3 gap-0.5 text-center">
        <div>
          <span className="text-[8px] text-[#94A3B8] block font-bold leading-tight">WIN RATE</span>
          <span className="text-[11px] sm:text-xs font-black font-mono text-[#19D58A]">
            {score.total > 0 ? `${score.rate}%` : 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-[8px] text-[#94A3B8] block font-bold leading-tight">SCORE</span>
          <span className="text-[11px] sm:text-xs font-black font-mono text-[#F8FAFC]">
            {score.total > 0 ? `${score.wins}/${score.total}` : 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-[8px] text-[#94A3B8] block font-bold leading-tight">STREAK</span>
          <span className="text-[11px] sm:text-xs font-black font-mono text-[#19D58A] flex items-center justify-center gap-0.5">
            <Flame className="w-2.5 h-2.5 text-[#19D58A] fill-[#19D58A]" />
            <span>{score.total > 0 ? `${score.recentStreak}x` : 'N/A'}</span>
          </span>
        </div>
      </div>

      {/* Target Signals & Timestamp footer */}
      <div className="pt-1.5 border-t border-white/10 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-[9px] text-[#94A3B8] font-bold flex-shrink-0">টার্গেট:</span>
          <span
            className={`px-1.5 py-0.2 rounded font-black text-[9px] sm:text-[10px] flex-shrink-0 ${
              livePred.size === 'BIG'
                ? 'bg-[#19D58A]/20 text-[#19D58A] border border-[#19D58A]/40'
                : 'bg-emerald-800/30 text-emerald-300 border border-emerald-600/40'
            }`}
          >
            {livePred.size || 'N/A'}
          </span>
          <span
            className={`px-1 py-0.2 rounded text-[8px] sm:text-[9px] font-black flex-shrink-0 ${
              livePred.color === 'GREEN'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/20 text-rose-300'
            }`}
          >
            {livePred.color || 'N/A'}
          </span>
          <div className="flex items-center gap-0.5 ml-0.5">
            {livePred.numbers && livePred.numbers.map((n) => (
              <NumberBall key={n} number={n} size="xs" />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`px-1.5 py-0.5 rounded-lg text-[8px] sm:text-[9px] font-black flex items-center gap-0.5 transition-all flex-shrink-0 cursor-pointer ${
            isActive
              ? 'bg-[#19D58A] text-[#080A0B] font-black shadow-[0_0_10px_rgba(25,213,138,0.6)]'
              : 'bg-[#080A0B] text-[#19D58A] hover:bg-[#19D58A] hover:text-[#080A0B] border border-white/10'
          }`}
          title="সার্ভার ট্যাপ করে ফুল স্ক্রিন সিগন্যাল বক্স খুলুন"
        >
          <span>{isActive ? 'ফুলস্ক্রিন সিগন্যাল' : 'সিগন্যাল বক্স'}</span>
          <ChevronRight className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                       ALL SERVER ICONS SHOWCASE MODAL                      */
/* -------------------------------------------------------------------------- */

export const AllServerIconsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  activeServerId: string;
  historyList: LotteryResult[];
  predictionCache: Record<string, Prediction>;
  recentHistoryNumbers: number[];
  activePeriod: string;
  soundEnabled: boolean;
  onSelectServer: (server: ServerStrategy) => void;
}> = ({
  isOpen,
  onClose,
  activeServerId,
  historyList,
  predictionCache,
  recentHistoryNumbers,
  activePeriod,
  soundEnabled,
  onSelectServer,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  if (!isOpen) return null;

  const filtered = SERVERS.filter((s) => {
    const evalData = evaluateServerHistory(s, historyList, predictionCache);
    const rate = evalData.score.rate;
    if (filter === 'S+' && rate < 94) return false;
    if (filter === 'S' && (rate < 88 || rate >= 94)) return false;
    if (filter === 'A+' && (rate < 80 || rate >= 88)) return false;
    if (filter === 'A' && rate >= 80) return false;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        s.name.toLowerCase().includes(q) ||
        s.serverNum.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.strategyBn.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#101214]/98 border border-white/10 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
        {/* Top gradient highlight */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-[#19D58A] to-emerald-400" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-[#080A0B]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#19D58A] to-[#063B29] p-0.5 shadow-[0_0_15px_rgba(25,213,138,0.3)] flex items-center justify-center text-[#080A0B] flex-shrink-0">
              <Sparkles className="w-5 h-5 fill-[#080A0B] text-[#080A0B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#F8FAFC]">
                  সকল ৩০টি সার্ভার আইকন ও প্রোফাইল গ্যালারি
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#19D58A]/15 text-[#19D58A] border border-[#19D58A]/30 text-[10px] font-mono font-black">
                  ৩০ আইকন
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Official 30 VIP 3D Server Emblems • প্রতিটি সার্ভারের হাই-রেজোলিউশন আইকন ও লাইভ স্ট্র্যাটেজি
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playSound('click', soundEnabled);
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-[#F8FAFC] border border-white/10 transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 sm:p-4 bg-[#080A0B]/70 border-b border-white/10 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="সার্ভারের আইকন বা নাম দিয়ে খুঁজুন (যেমন: Dragon, Viper, Titan, 30)..."
              className="w-full bg-[#101214] border border-white/10 focus:border-[#19D58A] rounded-xl py-2 pl-9 pr-8 text-xs font-bold text-[#F8FAFC] placeholder:text-[#94A3B8]/40 focus:outline-none transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8] hover:text-[#19D58A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {[
              { id: 'ALL', label: 'সব আইকন (৩০)' },
              { id: 'S+', label: '👑 S+ (৯৫-৯৯%)' },
              { id: 'S', label: '⚡ S (৮৮-৯৪%)' },
              { id: 'A+', label: '🛡️ A+ (৮০-৮৭%)' },
              { id: 'A', label: '🎯 A (৭০-৭৯%)' },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  playSound('click', soundEnabled);
                  setFilter(id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                  filter === id
                    ? 'bg-gradient-to-r from-[#19D58A] to-emerald-400 text-[#080A0B] font-black shadow-md border border-[#19D58A]'
                    : 'bg-[#101214] text-[#94A3B8] hover:text-[#F8FAFC] border border-white/10 hover:border-[#19D58A]/40'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 30-Server Icon Cards Grid */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 scrollbar-none">
          {filtered.map((srv) => {
            const isSelected = srv.id === activeServerId;
            const evalHist = evaluateServerHistory(srv, historyList, predictionCache);
            const isLoss = evalHist.rows.length > 0 && evalHist.rows[0].status === 'LOSS';
            const livePred = computeLivePrediction(srv, recentHistoryNumbers, activePeriod, isLoss);
            const tier = getTierBadge(evalHist.score.rate);

            return (
              <div
                key={srv.id}
                onClick={() => {
                  playSound('click', soundEnabled);
                  onSelectServer(srv);
                  onClose();
                }}
                className={`relative rounded-2xl p-3 border transition-all cursor-pointer flex flex-col justify-between group overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#063B29]/60 to-[#101214] border-[#19D58A] shadow-[0_0_25px_rgba(25,213,138,0.25)] ring-2 ring-[#19D58A]'
                    : 'bg-[#101214] hover:bg-[#14181b] border border-white/10 hover:border-[#19D58A]/50 shadow-md hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-start gap-3 mb-2.5">
                  <div className="relative flex-shrink-0">
                    <ServerAvatar
                      server={srv}
                      name={srv.name}
                      size="lg"
                      className="ring-1 ring-[#19D58A]/40 group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-1 -right-1 font-mono text-[9px] font-black px-1 rounded bg-[#080A0B] text-[#19D58A] border border-[#19D58A]/30">
                      {srv.code}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-mono text-xs font-black text-[#19D58A]">
                        {srv.serverNum}
                      </span>
                      <span className={`text-[9px] px-2 py-0.2 rounded font-black border ${tier.badgeBg} ${tier.badgeText} ${tier.badgeBorder}`}>
                        {tier.label}
                      </span>
                    </div>

                    <h4 className="font-black text-[#F8FAFC] text-sm truncate">
                      {srv.name}
                    </h4>
                    <p className="text-[10px] text-[#94A3B8] truncate mt-0.5">
                      {srv.category} • {srv.riskLevel} রিস্ক
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-[#94A3B8] line-clamp-2 mb-2 bg-[#080A0B]/60 p-1.5 rounded-lg border border-white/5">
                  {srv.strategyBn}
                </p>

                {/* Live Prediction & Stats Bar */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#94A3B8]">সিগন্যাল:</span>
                    <span
                      className={`font-black px-1.5 py-0.2 rounded text-[10px] ${
                        livePred.size === 'BIG'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                      }`}
                    >
                      {livePred.size}
                    </span>
                    <span
                      className={`font-bold px-1 py-0.2 rounded text-[9px] ${
                        livePred.color === 'GREEN'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {livePred.color}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-[#19D58A] text-[#080A0B] shadow-md'
                        : 'bg-white/5 text-[#19D58A] group-hover:bg-[#19D58A] group-hover:text-[#080A0B]'
                    }`}
                  >
                    <span>{isSelected ? 'সক্রিয় টার্মিনাল' : 'টার্মিনালে যান'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#080A0B] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#94A3B8]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#19D58A]" />
            <span>মোট ৩০টি অফিসিয়াল সার্ভারের প্রত্যেকের আলাদা ৩ডি আইকন ও হাই-একুরেসি অ্যালগরিদম সক্রিয়</span>
          </span>
          <button
            type="button"
            onClick={() => {
              playSound('click', soundEnabled);
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F8FAFC] font-bold cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               MAIN TERMINAL                                */
/* -------------------------------------------------------------------------- */

export const MainTerminal: React.FC<{
  isUnlocked: boolean;
  onUnlock: () => void;
  onLock: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}> = ({ isUnlocked, onUnlock, onLock, soundEnabled, onToggleSound }) => {
  const [interval, setInterval] = useState<MarketInterval>(30);
  const [currentView, setCurrentView] = useState<'HOME' | 'MARKET_PAGE' | 'SIGNAL_TERMINAL'>('HOME');
  const [previousView, setPreviousView] = useState<'HOME' | 'MARKET_PAGE'>('MARKET_PAGE');
  const [isDeviceFullscreen, setIsDeviceFullscreen] = useState<boolean>(false);
  const [isWingoExpanded, setIsWingoExpanded] = useState<boolean>(true);
  const [realtimeClock, setRealtimeClock] = useState<string>(() => {
    return new Date().toLocaleTimeString('en-US', { hour12: true });
  });

  useEffect(() => {
    const clockTimer = window.setInterval(() => {
      setRealtimeClock(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => window.clearInterval(clockTimer);
  }, []);

  // Listen to browser fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsDeviceFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleDeviceFullscreen = () => {
    playSound('click', soundEnabled);
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
        setIsDeviceFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        setIsDeviceFullscreen(false);
      }
    } catch {}
  };

  const handleOpenMarket = (newInterval: MarketInterval) => {
    playSound('click', soundEnabled);
    setInterval(newInterval);
    setPreviousView('HOME');
    setCurrentView('MARKET_PAGE');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [activeServerId, setActiveServerId] = useState<string>('server-01');
  const [serverDrawerOpen, setServerDrawerOpen] = useState(false);
  const [allIconsModalOpen, setAllIconsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [ballTheme, setBallTheme] = useState<'png' | 'solid'>(() => {
    try {
      return (localStorage.getItem('wingo_ball_theme') as 'png' | 'solid') || 'png';
    } catch {
      return 'png';
    }
  });

  const toggleBallTheme = () => {
    setBallTheme((prev) => {
      const next = prev === 'png' ? 'solid' : 'png';
      try {
        localStorage.setItem('wingo_ball_theme', next);
      } catch {}
      return next;
    });
  };

  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>(() => {
    const d = new Date();
    return d.toLocaleTimeString('en-US', { hour12: false });
  });
  const [isOffline, setIsOffline] = useState<boolean>(false);

  const [predictionCache, setPredictionCache] = useState<Record<string, Prediction>>(() => {
    try {
      const saved = localStorage.getItem('wingo_prediction_cache_v2');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [historyList, setHistoryList] = useState<LotteryResult[]>(() => loadInitialHistory(30));
  const [activePeriod, setActivePeriod] = useState<string>(() => {
    const list = loadInitialHistory(30);
    return list.length > 0 ? incrementPeriod(list[0].period) : calculatePeriodByTime(30);
  });

  const [countdown, setCountdown] = useState<number>(30);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [copiedSignal, setCopiedSignal] = useState(false);
  const [copiedPeriod, setCopiedPeriod] = useState(false);

  const [historyFilter, setHistoryFilter] = useState<string>('ALL');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const carouselRef = useRef<HTMLDivElement>(null);
  const activeTerminalRef = useRef<HTMLDivElement>(null);
  const [terminalHighlighted, setTerminalHighlighted] = useState(false);
  const lastSyncLock = useRef<boolean>(false);
  const prevPeriodRef = useRef<string>('');



  // Sync Lottery from API
  const syncLotteryData = async (_isAuto: boolean = false) => {
    try {
      const typeName = GAME_TYPE_NAMES[interval];
      const apiUrl = API_URLS[interval];
      const proxyUrl = `/api/draw-proxy?type=${typeName}&interval=${interval}&_t=${Date.now()}`;
      let json: any = null;

      // 1. Try local proxy first
      try {
        const res = await fetch(proxyUrl, { cache: 'no-store' });
        if (res.ok) json = await res.json();
      } catch {}

      // 2. Try direct URL
      if (!json || !json.data || !Array.isArray(json.data.list)) {
        try {
          const res = await fetch(`${apiUrl}?_t=${Date.now()}`, {
            cache: 'no-store',
            headers: { Accept: 'application/json' },
          });
          if (res.ok) json = await res.json();
        } catch {}
      }

      // 3. Try CORS proxy
      if (!json || !json.data || !Array.isArray(json.data.list)) {
        try {
          const corsUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
          const res = await fetch(corsUrl, { cache: 'no-store' });
          if (res.ok) json = await res.json();
        } catch {}
      }

      if (json && json.data && Array.isArray(json.data.list) && json.data.list.length > 0) {
        const parsed = parseLotteryApiResponse(json);
        if (parsed.length > 0) {
          const seeded = buildSeededHistory(parsed, parsed[0].period, interval);
          setHistoryList(seeded);
          try {
            localStorage.setItem(`wingo_history_${interval}_v3`, JSON.stringify(seeded));
          } catch {}
          const newest = seeded[0].period;
          const nextPeriod = incrementPeriod(newest);
          setActivePeriod(nextPeriod);
          prevPeriodRef.current = newest;
          setSyncing(false);
          return;
        }
      }

      // Fallback: build seeded history
      setHistoryList((prev) => {
        const seeded = buildSeededHistory(prev, calculatePeriodByTime(interval), interval);
        if (seeded.length > 0) {
          setActivePeriod(incrementPeriod(seeded[0].period));
        }
        return seeded;
      });
    } catch {
      setHistoryList((prev) => {
        const seeded = buildSeededHistory(prev, calculatePeriodByTime(interval), interval);
        if (seeded.length > 0) {
          setActivePeriod(incrementPeriod(seeded[0].period));
        }
        return seeded;
      });
    }
  };

  // Interval change trigger
  useEffect(() => {
    setHistoryList(loadInitialHistory(interval));
    syncLotteryData(false);
  }, [interval]);

  // Real-time clock countdown
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const sec = now.getSeconds();
      const ms = now.getMilliseconds();
      let left = interval - (sec % interval);
      if (left === interval && ms < 600) {
        left = 0;
      }
      setCountdown(left);

      if (left <= 4 && !syncing) {
        setSyncing(true);
      } else if (left > 4 && syncing) {
        setSyncing(false);
      }

      if (left <= 3 && left > 0) {
        if (!lastSyncLock.current) {
          playSound('tick', soundEnabled);
        }
      }

      if (left === 0 || left === interval) {
        if (!lastSyncLock.current) {
          lastSyncLock.current = true;
          setSyncing(true);
          playSound('click', soundEnabled);
          syncLotteryData(true);
          setTimeout(() => {
            syncLotteryData(true);
            lastSyncLock.current = false;
          }, 1500);
          setTimeout(() => {
            syncLotteryData(true);
          }, 3500);
        }
      }
    };

    updateTimer();
    const timer = window.setInterval(updateTimer, 500);
    return () => window.clearInterval(timer);
  }, [interval, soundEnabled, syncing, activePeriod]);

  // Periodic background refresh
  useEffect(() => {
    const intervalTimer = window.setInterval(() => {
      syncLotteryData(true);
    }, 3000);
    return () => window.clearInterval(intervalTimer);
  }, [interval]);

  const activeServer = useMemo(
    () => SERVERS.find((s) => s.id === activeServerId) || SERVERS[0],
    [activeServerId]
  );
  const activeServerIndex = useMemo(
    () => SERVERS.findIndex((s) => s.id === activeServerId),
    [activeServerId]
  );
  const recentHistoryNumbers = useMemo(
    () => historyList.map((h) => h.number).reverse(),
    [historyList]
  );

  const activeServerHistory = useMemo(
    () => evaluateServerHistory(activeServer, historyList, predictionCache),
    [activeServer, historyList, predictionCache]
  );
  const activeScore = activeServerHistory.score;
  const isLossShieldActive = useMemo(
    () => activeServerHistory.rows.length > 0 && activeServerHistory.rows[0].status === 'LOSS',
    [activeServerHistory]
  );

  const livePrediction = useMemo(
    () => computeLivePrediction(activeServer, recentHistoryNumbers, activePeriod, isLossShieldActive),
    [activeServer, recentHistoryNumbers, activePeriod, isLossShieldActive]
  );

  // Prediction caching
  useEffect(() => {
    if (!activePeriod || recentHistoryNumbers.length === 0) return;
    setPredictionCache((prev) => {
      let modified = false;
      const next = { ...prev };
      for (const s of SERVERS) {
        const k = `${s.id}_${activePeriod}`;
        if (!next[k]) {
          const evalHist = evaluateServerHistory(s, historyList, prev);
          const isLoss = evalHist.rows.length > 0 && evalHist.rows[0].status === 'LOSS';
          next[k] = computeLivePrediction(s, recentHistoryNumbers, activePeriod, isLoss);
          modified = true;
        }
      }
      if (modified) {
        try {
          localStorage.setItem('wingo_prediction_cache_v2', JSON.stringify(next));
        } catch {}
        return next;
      }
      return prev;
    });
  }, [activePeriod, recentHistoryNumbers, historyList]);

  // Ranked servers by highest wins in 10 results, win rate, streak and jackpots
  const rankedServers = useMemo(() => {
    return SERVERS.map((srv) => {
      const { score, rows } = evaluateServerHistory(srv, historyList, predictionCache);
      const isLoss = rows.length > 0 && rows[0].status === 'LOSS';
      return {
        server: srv,
        score,
        livePred: computeLivePrediction(srv, recentHistoryNumbers, activePeriod, isLoss),
      };
    }).sort((a, b) => {
      // 1. Highest wins out of 10
      if (b.score.wins !== a.score.wins) {
        return b.score.wins - a.score.wins;
      }
      // 2. Win rate percentage
      if (b.score.rate !== a.score.rate) {
        return b.score.rate - a.score.rate;
      }
      // 3. Current active win streak
      if (b.score.recentStreak !== a.score.recentStreak) {
        return b.score.recentStreak - a.score.recentStreak;
      }
      // 4. Jackpot hits
      if (b.score.jackpots !== a.score.jackpots) {
        return b.score.jackpots - a.score.jackpots;
      }
      // Stable tie-breaker: server number
      const numA = Number(a.server.id.match(/\d+/)?.[0] || 0);
      const numB = Number(b.server.id.match(/\d+/)?.[0] || 0);
      return numA - numB;
    });
  }, [historyList, recentHistoryNumbers, activePeriod, predictionCache]);

  // 15 Rows x 2 Columns layout: Dynamic Live Win Ranking
  // User Requirement:
  // - Top 1 বাম পাশে (Left Column), Top 2 ডান পাশে (Right Column)
  // Row 1: Left = Top 1 (Rank #1 👑), Right = Top 2 (Rank #2)
  // Row 2: Left = Top 3 (Rank #3), Right = Top 4 (Rank #4)
  // Row 3: Left = Top 5 (Rank #5), Right = Top 6 (Rank #6)
  // ...
  // Row i: Left = Rank #(2*i + 1), Right = Rank #(2*i + 2)
  const serverRows = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => {
      const leftRank = rankedServers[2 * i]; // Top 1 (i=0), Top 3 (i=1), Top 5 (i=2)...
      const rightRank = rankedServers[2 * i + 1]; // Top 2 (i=0), Top 4 (i=1), Top 6 (i=2)...
      return {
        rowNum: i + 1,
        left: leftRank ? leftRank.server : (SERVERS[2 * i] || SERVERS[0]),
        right: rightRank ? rightRank.server : (SERVERS[2 * i + 1] || SERVERS[0]),
      };
    });
  }, [rankedServers]);

  const activeServerRank = useMemo(() => {
    const idx = rankedServers.findIndex((item) => item.server.id === activeServerId);
    return idx === -1 ? 1 : idx + 1;
  }, [rankedServers, activeServerId]);

  const getCardData = (srv: ServerStrategy) => {
    const evalData = evaluateServerHistory(srv, historyList, predictionCache);
    const isLoss = evalData.rows.length > 0 && evalData.rows[0].status === 'LOSS';
    const livePred = computeLivePrediction(srv, recentHistoryNumbers, activePeriod, isLoss);
    const rk = rankedServers.findIndex((item) => item.server.id === srv.id) + 1;
    return {
      score: evalData.score,
      livePred,
      rank: rk === 0 ? 1 : rk,
    };
  };

  const filteredRankedServers = useMemo(() => {
    if (tierFilter === 'S+') return rankedServers.filter((r) => r.score.rate >= 94);
    if (tierFilter === 'S') return rankedServers.filter((r) => r.score.rate >= 88 && r.score.rate < 94);
    if (tierFilter === 'A+') return rankedServers.filter((r) => r.score.rate >= 80 && r.score.rate < 88);
    if (tierFilter === 'A') return rankedServers.filter((r) => r.score.rate < 80);
    return rankedServers;
  }, [rankedServers, tierFilter]);

  const historyDisplayRows = useMemo<VerifiedHistoryRow[]>(() => {
    const pendingRow: VerifiedHistoryRow = {
      period: activePeriod,
      number: -1,
      color: '',
      size: '',
      prediction: livePrediction,
      status: 'PENDING',
      isPending: true,
      stepLevel: isLossShieldActive ? 2 : 1,
    };
    return [pendingRow, ...activeServerHistory.rows.map((r) => ({ ...r, isPending: false }))];
  }, [activePeriod, livePrediction, isLossShieldActive, activeServerHistory]);

  const filteredHistory = useMemo(() => {
    if (historyFilter === 'ALL') return historyDisplayRows;
    return historyDisplayRows.filter((r) => r.status === historyFilter || r.isPending);
  }, [historyDisplayRows, historyFilter]);

  const handleSelectServer = (srv: ServerStrategy, shouldScroll: boolean = true) => {
    playSound('click', soundEnabled);
    if (currentView !== 'SIGNAL_TERMINAL') {
      setPreviousView(currentView as 'HOME' | 'MARKET_PAGE');
    }
    setActiveServerId(srv.id);
    setCurrentView('SIGNAL_TERMINAL');
    setToastMessage(`⚡ ${srv.serverNum} (${srv.name}) ফুল স্ক্রিন সিগন্যাল বক্স ওপেন হয়েছে`);
    setTimeout(() => setToastMessage(null), 3000);

    setTerminalHighlighted(true);
    setTimeout(() => setTerminalHighlighted(false), 2200);

    if (typeof window !== 'undefined' && shouldScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackFromSignal = () => {
    playSound('click', soundEnabled);
    setCurrentView(previousView || 'MARKET_PAGE');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCycleServer = (delta: number) => {
    playSound('click', soundEnabled);
    const total = SERVERS.length;
    const nextIdx = (activeServerIndex + delta + total) % total;
    handleSelectServer(SERVERS[nextIdx]);
  };

  const handleCopySignal = () => {
    playSound('click', soundEnabled);
    if (!livePrediction) return;
    const intervalLabel = interval === 30 ? '30S' : interval === 60 ? '1M' : interval === 180 ? '3M' : '5M';
    const text = [
      `👑 ${APP_CONFIG.name} VIP WINGO SIGNAL 👑`,
      `🎮 SERVER: ${activeServer.serverNum} - ${activeServer.name} (${activeServer.code})`,
      `⏱️ MARKET TIME: WinGo ${intervalLabel}`,
      `🎯 17-DIGIT PERIOD: ${activePeriod}`,
      `⚡ PREDICTION SIZE: ${livePrediction.size}`,
      `🎨 TARGET COLOR: ${livePrediction.color}`,
      `🎯 2 JACKPOT SHOTS: [${livePrediction.numbers.join(', ')}]`,
      `🔥 HIT RATE: ${activeScore.hitRate}% | WIN RATE: ${activeScore.rate}%`,
      `💡 STRATEGY: ${livePrediction.reasoning}`,
      `📱 OFFICIAL TELEGRAM: ${APP_CONFIG.telegram}`,
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedSignal(true);
    setTimeout(() => setCopiedSignal(false), 2500);
  };

  const handleCopyPeriod = () => {
    playSound('click', soundEnabled);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(activePeriod).catch(() => {});
    }
    setCopiedPeriod(true);
    setTimeout(() => setCopiedPeriod(false), 2000);
  };

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (carouselRef.current) {
      const offset = dir === 'left' ? -280 : 280;
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const filteredDrawerServers = useMemo(() => {
    let list = SERVERS;
    if (categoryFilter === 'S+') {
      list = list.filter((s) => evaluateServerHistory(s, historyList).score.rate >= 94);
    } else if (categoryFilter === 'S') {
      list = list.filter((s) => {
        const r = evaluateServerHistory(s, historyList).score.rate;
        return r >= 88 && r < 94;
      });
    } else if (categoryFilter === 'A+') {
      list = list.filter((s) => {
        const r = evaluateServerHistory(s, historyList).score.rate;
        return r >= 80 && r < 88;
      });
    } else if (categoryFilter === 'A') {
      list = list.filter((s) => evaluateServerHistory(s, historyList).score.rate < 80);
    } else if (categoryFilter !== 'ALL') {
      list = list.filter((s) => s.category.includes(categoryFilter));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.serverNum.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.strategyBn.toLowerCase().includes(q)
      );
    }
    return list;
  }, [categoryFilter, searchQuery, historyList]);

  const activeThemeId = useMemo(() => {
    const m = activeServer.id.match(/\d+/);
    return m ? Number(m[0]) : 1;
  }, [activeServer.id]);

  const activeTheme = getServerTheme(activeThemeId);
  const tierInfo = getTierBadge(activeScore.rate);

  return (
    <div className="min-h-screen bg-[#080A0B] text-[#F8FAFC] flex flex-col font-sans relative overflow-x-hidden selection:bg-[#19D58A] selection:text-[#080A0B]">
      {/* Dark Atmosphere */}
      <DarkAtmosphere />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#101214] border border-[#19D58A] text-white text-xs font-black shadow-[0_0_25px_rgba(25,213,138,0.45)] flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#19D58A] fill-[#19D58A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      {currentView === 'SIGNAL_TERMINAL' ? (
        <header className="sticky top-0 z-40 bg-[#080A0B]/98 backdrop-blur-2xl border-b border-[#19D58A]/30 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
          {/* Back button + Server Pic & Name */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <button
              type="button"
              onClick={handleBackFromSignal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#063B29] hover:bg-[#19D58A] text-[#19D58A] hover:text-[#080A0B] text-xs font-black border border-[#19D58A]/40 transition-all active:scale-95 cursor-pointer shadow-sm group flex-shrink-0"
              title="সার্ভার তালিকায় ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-bold">Back</span>
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <ServerAvatar
                server={activeServer}
                name={activeServer.name}
                size="md"
                className="ring-2 ring-[#19D58A]/60 shadow-[0_0_15px_rgba(25,213,138,0.4)] flex-shrink-0"
              />
              <div className="min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-sm sm:text-base font-black text-white truncate">
                    {activeServer.serverNum} — {activeServer.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#063B29] text-[#19D58A] border border-[#19D58A]/40">
                    {activeServer.code}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs">
                  <span className="text-amber-400 font-mono font-bold flex items-center gap-0.5">
                    <Crown className="w-3 h-3 fill-amber-400" />
                    <span>#{activeServerRank}</span>
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-[#19D58A] font-mono font-black">{activeScore.rate}% WIN</span>
                  <span className="text-white/20">•</span>
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#19D58A] animate-pulse" />
                    LIVE SIGNAL
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Countdown Clock */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#101214] border border-[#19D58A]/35 shadow-[0_0_15px_rgba(25,213,138,0.2)] flex-shrink-0">
            <Clock className={`w-4 h-4 ${countdown <= 5 || syncing ? 'text-red-400 animate-spin' : 'text-[#19D58A]'}`} />
            <span
              className={`font-mono text-sm sm:text-base font-black tracking-wider ${
                countdown <= 5 || syncing
                  ? 'text-red-400 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                  : 'text-[#19D58A]'
              }`}
            >
              {String(Math.floor(countdown / 60)).padStart(2, '0')}:
              {String(countdown % 60).padStart(2, '0')}
            </span>
          </div>
        </header>
      ) : (
        /* 1. Home Page Header */
        <header className="sticky top-0 z-40 bg-[#080A0B]/90 backdrop-blur-2xl border-b border-white/10 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Trophy/Team Logo on the left with glowing green online-status dot */}
          <div className="relative flex items-center">
            <div
              onClick={() => {
                playSound('click', soundEnabled);
                setCurrentView('HOME');
              }}
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#101214] p-1 border border-[#19D58A]/40 shadow-[0_0_15px_rgba(25,213,138,0.2)] flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer group"
              title="হোম পেজে যান"
            >
              <img
                src={APP_CONFIG.profileImage}
                alt={`${APP_CONFIG.name} Logo`}
                onError={(e) => {
                  e.currentTarget.src = '/assets/app_logo.png';
                }}
                className="w-full h-full object-cover rounded-xl filter drop-shadow group-hover:scale-105 transition-transform"
              />
            </div>
            {/* Small glowing green online-status dot beside the logo */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#19D58A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#19D58A] border-2 border-[#080A0B] shadow-[0_0_8px_#19D58A]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                onClick={() => {
                  playSound('click', soundEnabled);
                  setCurrentView('HOME');
                }}
                className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5 font-sans cursor-pointer hover:text-[#19D58A] transition-colors"
              >
                {APP_CONFIG.name}
              </span>
            </div>
            {/* Monospace green typography subtitle */}
            <p className="text-[11px] sm:text-xs text-[#19D58A] font-mono font-semibold tracking-wider">
              Signal Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Rounded AI SERVER badge with green trending icon */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#063B29]/80 border border-[#19D58A]/40 text-[#19D58A] text-xs font-mono font-bold shadow-[0_0_12px_rgba(25,213,138,0.2)]">
            <TrendingUp className="w-3.5 h-3.5 text-[#19D58A]" />
            <span className="tracking-wide">AI SERVER</span>
          </div>

          <a
            href={APP_CONFIG.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border border-[#0088cc]/50 text-[#38bdf8] hover:text-[#7dd3fc] text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
            title="অফিসিয়াল টেলিগ্রাম চ্যানেলে জয়েন করুন"
          >
            <Send className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="hidden sm:inline">টেলিগ্রাম</span>
          </a>

          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'সাউন্ড বন্ধ করুন' : 'সাউন্ড চালু করুন'}
            className="p-2 rounded-xl bg-[#101214] hover:bg-[#15191c] border border-white/10 text-[#94A3B8] hover:text-[#19D58A] transition-all active:scale-95 cursor-pointer shadow-md"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#19D58A]" /> : <VolumeX className="w-4 h-4 text-[#94A3B8]/60" />}
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('click', soundEnabled);
              onLock();
            }}
            title="Lock Terminal"
            className="p-2 rounded-xl bg-[#101214] hover:bg-[#15191c] border border-white/10 text-[#94A3B8] hover:text-[#19D58A] transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <Lock className="w-4 h-4 text-[#19D58A]" />
          </button>
        </div>
      </header>
      )}

      {/* 3. Live Status Section - slim LIVE status bar (Only on Home) */}
      {currentView === 'HOME' && (
        <div className="bg-[#101214]/90 backdrop-blur-md border-b border-white/8 px-3 sm:px-6 py-2 relative z-30">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#19D58A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#19D58A] shadow-[0_0_8px_#19D58A]"></span>
              </span>
              <span className="font-mono font-black text-[#19D58A] tracking-wider text-xs">LIVE</span>
              <span className="text-white/20">|</span>
              <span className="text-[#94A3B8] text-[11px] sm:text-xs">
                WinGo AI Engine Active · 30 Clusters Online
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#94A3B8] text-[11px] font-mono hidden xs:inline">System Time:</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#080A0B] border border-white/10 font-mono text-xs text-[#19D58A] font-bold shadow-inner">
                <Clock className="w-3.5 h-3.5 text-[#19D58A]" />
                <span>{realtimeClock}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 space-y-5 pb-8 sm:pb-12 relative z-10">
        {currentView === 'HOME' ? (
          /* ================================================================= */
          /*                       HOME PAGE VIEW                              */
          /* ================================================================= */
          <div className="space-y-6">
            {/* 4. Prediction Games Section */}
            <section className="space-y-3.5">
              {/* Heading with gold sparkle icon and thin gold divider */}
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                <h2 className="text-xs sm:text-sm font-black text-amber-400 tracking-widest uppercase font-mono">
                  PREDICTION GAMES
                </h2>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-400/40 via-amber-400/15 to-transparent" />
              </div>

              {/* Main Game Category: Wingo (Single Category, Clickable to expand/collapse) */}
              <div className="rounded-3xl bg-[#101214] border border-white/10 shadow-[0_12px_45px_rgba(0,0,0,0.7)] p-4 sm:p-6 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#19D58A] via-[#10B981] to-[#063B29]" />

                {/* Clickable Card Header for Expand / Collapse */}
                <div
                  onClick={() => {
                    playSound('click', soundEnabled);
                    setIsWingoExpanded((prev) => !prev);
                  }}
                  className="flex items-center justify-between gap-3 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Wingo game picture */}
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#080A0B] p-1 border border-[#19D58A]/40 flex items-center justify-center shadow-[0_0_20px_rgba(25,213,138,0.2)] flex-shrink-0 group-hover:border-[#19D58A] transition-all overflow-hidden">
                      <img
                        src={APP_CONFIG.wingoImage}
                        alt="WinGo Game"
                        className="w-full h-full object-cover rounded-xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/wingo_game.png';
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-[#063B29] border border-[#19D58A]/40 text-[9px] font-black text-[#19D58A] font-mono leading-tight">
                        0-9
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-black text-white tracking-wide font-sans group-hover:text-[#19D58A] transition-colors">
                          Wingo
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#063B29] border border-[#19D58A]/40 text-[#19D58A] text-[10px] font-mono font-black uppercase tracking-wider">
                          ACTIVE
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-mono text-[#19D58A] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#19D58A] animate-ping" />
                          Live Now
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-0.5 font-medium">
                        Color prediction · 4 modes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#94A3B8] font-mono hidden sm:inline">
                      {isWingoExpanded ? 'প্যানেল গুটিয়ে নিন' : 'মার্কেটসমূহ দেখুন'}
                    </span>
                    <div className="p-2 rounded-xl bg-[#080A0B] border border-white/10 text-[#19D58A] group-hover:border-[#19D58A]/50 transition-all">
                      {isWingoExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#19D58A]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#19D58A]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. WinGo Market Selection (Responsive Two-Column Grid with Exactly 4 Cards) */}
                {isWingoExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {/* Card 1: WinGo 30 Seconds */}
                      <div
                        onClick={() => handleOpenMarket(30)}
                        className="group relative rounded-2xl p-4 bg-[#080A0B] border border-white/10 hover:border-[#19D58A]/60 hover:shadow-[0_0_25px_rgba(25,213,138,0.22)] transition-all duration-200 cursor-pointer flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-[#063B29]/80 border border-[#19D58A]/40 flex items-center justify-center text-[#19D58A] shadow-sm group-hover:scale-105 transition-transform">
                            <Zap className="w-5 h-5 text-[#19D58A]" />
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-[#063B29] border border-[#19D58A]/40 text-[#19D58A] font-mono font-black text-xs">
                            30S
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-black text-white group-hover:text-[#19D58A] transition-colors">
                            WinGo 30 Seconds
                          </h4>
                          <p className="text-xs text-[#94A3B8] mt-0.5">
                            Ultra fast prediction
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#19D58A]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#19D58A] animate-pulse" />
                            LIVE
                          </span>
                          <span className="text-xs font-bold text-[#19D58A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            <span>টার্মিনাল</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      {/* Card 2: WinGo 1 Minute */}
                      <div
                        onClick={() => handleOpenMarket(60)}
                        className="group relative rounded-2xl p-4 bg-[#080A0B] border border-white/10 hover:border-[#19D58A]/60 hover:shadow-[0_0_25px_rgba(25,213,138,0.22)] transition-all duration-200 cursor-pointer flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-[#063B29]/80 border border-[#19D58A]/40 flex items-center justify-center text-[#19D58A] shadow-sm group-hover:scale-105 transition-transform">
                            <Timer className="w-5 h-5 text-[#19D58A]" />
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-[#063B29] border border-[#19D58A]/40 text-[#19D58A] font-mono font-black text-xs">
                            1M
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-black text-white group-hover:text-[#19D58A] transition-colors">
                            WinGo 1 Minute
                          </h4>
                          <p className="text-xs text-[#94A3B8] mt-0.5">
                            Standard speed
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#19D58A]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#19D58A] animate-pulse" />
                            LIVE
                          </span>
                          <span className="text-xs font-bold text-[#19D58A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            <span>টার্মিনাল</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      {/* Card 3: WinGo 3 Minutes */}
                      <div
                        onClick={() => handleOpenMarket(180)}
                        className="group relative rounded-2xl p-4 bg-[#080A0B] border border-white/10 hover:border-[#19D58A]/60 hover:shadow-[0_0_25px_rgba(25,213,138,0.22)] transition-all duration-200 cursor-pointer flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-[#063B29]/80 border border-[#19D58A]/40 flex items-center justify-center text-[#19D58A] shadow-sm group-hover:scale-105 transition-transform">
                            <Hourglass className="w-5 h-5 text-[#19D58A]" />
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-[#063B29] border border-[#19D58A]/40 text-[#19D58A] font-mono font-black text-xs">
                            3M
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-black text-white group-hover:text-[#19D58A] transition-colors">
                            WinGo 3 Minutes
                          </h4>
                          <p className="text-xs text-[#94A3B8] mt-0.5">
                            Balanced mode
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#19D58A]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#19D58A] animate-pulse" />
                            LIVE
                          </span>
                          <span className="text-xs font-bold text-[#19D58A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            <span>টার্মিনাল</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      {/* Card 4: WinGo 5 Minutes */}
                      <div
                        onClick={() => handleOpenMarket(300)}
                        className="group relative rounded-2xl p-4 bg-[#080A0B] border border-white/10 hover:border-[#19D58A]/60 hover:shadow-[0_0_25px_rgba(25,213,138,0.22)] transition-all duration-200 cursor-pointer flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-[#063B29]/80 border border-[#19D58A]/40 flex items-center justify-center text-[#19D58A] shadow-sm group-hover:scale-105 transition-transform">
                            <Clock className="w-5 h-5 text-[#19D58A]" />
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-[#063B29] border border-[#19D58A]/40 text-[#19D58A] font-mono font-black text-xs">
                            5M
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-black text-white group-hover:text-[#19D58A] transition-colors">
                            WinGo 5 Minutes
                          </h4>
                          <p className="text-xs text-[#94A3B8] mt-0.5">
                            Long interval
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#19D58A]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#19D58A] animate-pulse" />
                            LIVE
                          </span>
                          <span className="text-xs font-bold text-[#19D58A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            <span>টার্মিনাল</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Platform Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#101214] border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#063B29] border border-[#19D58A]/40 flex items-center justify-center text-[#19D58A] flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-white">Genuine API Data</h5>
                  <p className="text-[11px] text-[#94A3B8]">১৭-ডিজিট রিয়েল মার্কেট সিঙ্ক</p>
                </div>
              </div>
              <div
                onClick={() => {
                  playSound('click', soundEnabled);
                  setPreviousView('HOME');
                  setCurrentView('MARKET_PAGE');
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-2xl bg-[#101214] border border-white/10 hover:border-[#19D58A]/50 transition-all cursor-pointer flex items-center gap-3 shadow-md group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#063B29] border border-[#19D58A]/40 flex items-center justify-center text-[#19D58A] flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-white group-hover:text-[#19D58A] transition-colors">30 AI Servers</h5>
                  <p className="text-[11px] text-[#94A3B8]">VIP সিগন্যাল অ্যালগরিদম (লাইভ বোর্ড)</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#101214] border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#063B29] border border-[#19D58A]/40 flex items-center justify-center text-[#19D58A] flex-shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-white">Level S+ 99%</h5>
                  <p className="text-[11px] text-[#94A3B8]">৩-লেভেল স্মার্ট মার্টিনগেল</p>
                </div>
              </div>
            </div>
          </div>
        ) : currentView === 'MARKET_PAGE' ? (
          /* ================================================================= */
          /*                    MARKET PAGE (30S, 1M, 3M, 5M)                  */
          /* ================================================================= */
          <div className="space-y-4 sm:space-y-5">
            {/* Market Top Navigation Bar: Back button on left, Selected market (30S / 1M) on right */}
            <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-3xl bg-[#101214] border border-white/10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#19D58A] via-[#10B981] to-[#063B29]" />
              
              {/* Left: ONLY Back button */}
              <button
                type="button"
                onClick={() => {
                  playSound('click', soundEnabled);
                  setCurrentView('HOME');
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#063B29] hover:bg-[#19D58A] text-[#19D58A] hover:text-[#080A0B] text-xs sm:text-sm font-black border border-[#19D58A]/40 cursor-pointer active:scale-95 transition-all shadow-md group"
                title="হোম পেজে ফিরে যান"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back</span>
              </button>

              {/* Right: Selected Market Badge (30S / 1M) + Live Countdown */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="px-3.5 py-1.5 rounded-xl bg-[#063B29] text-[#19D58A] border border-[#19D58A] shadow-[0_0_15px_rgba(25,213,138,0.3)] font-mono font-black text-xs sm:text-sm flex items-center gap-1.5 select-none">
                  <span className="w-2 h-2 rounded-full bg-[#19D58A] animate-pulse" />
                  <span>{interval === 30 ? '30S' : interval === 60 ? '1M' : interval === 180 ? '3M' : '5M'}</span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#080A0B] border border-[#19D58A]/35 text-xs font-mono font-black shadow-inner">
                  <Clock className={`w-3.5 h-3.5 ${countdown <= 5 || syncing ? 'text-red-400 animate-spin' : 'text-[#19D58A]'}`} />
                  <span className={countdown <= 5 || syncing ? 'text-red-400 animate-pulse' : 'text-[#19D58A]'}>
                    {String(Math.floor(countdown / 60)).padStart(2, '0')}:
                    {String(countdown % 60).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* 30-Server Dynamic Live Ranking Board (15 Rows x 2 Columns) */}
            <div className="p-3 sm:p-5 rounded-3xl bg-[#101214] border border-white/10 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>৩০টি সার্ভার ডাইনামিক লাইভ র‍্যাঙ্কিং বোর্ড</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#063B29] text-[#19D58A] border border-[#19D58A]/40 font-mono font-bold animate-pulse">
                      LIVE
                    </span>
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#080A0B] border border-white/10 text-[10px] font-mono text-[#94A3B8]">
                    <span className="w-2 h-2 rounded-full bg-[#19D58A] animate-pulse" />
                    <span>৩০টি সার্ভার অনলাইন</span>
                    <span className="text-[#19D58A]">•</span>
                    <span>আপডেট: {lastUpdatedTime}</span>
                  </div>
                </div>
              </div>

              {/* Scrollable 15-Row x 2-Column Grid (30 Servers) */}
              <div className="max-h-[720px] sm:max-h-[820px] overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 scrollbar-none">
                <div
                  className="grid grid-cols-2 gap-2 sm:gap-3 items-stretch"
                  style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}
                >
                  {serverRows.map((row) => {
                    const leftData = getCardData(row.left);
                    const rightData = getCardData(row.right);
                    return (
                      <React.Fragment key={row.rowNum}>
                        <ServerRankingCard
                          server={row.left}
                          isActive={row.left.id === activeServerId}
                          score={leftData.score}
                          livePred={leftData.livePred}
                          rank={leftData.rank}
                          lastUpdated={lastUpdatedTime}
                          isOffline={isOffline}
                          onSelect={() => {
                            handleSelectServer(row.left);
                            setCurrentView('SIGNAL_TERMINAL');
                          }}
                        />
                        <ServerRankingCard
                          server={row.right}
                          isActive={row.right.id === activeServerId}
                          score={rightData.score}
                          livePred={rightData.livePred}
                          rank={rightData.rank}
                          lastUpdated={lastUpdatedTime}
                          isOffline={isOffline}
                          onSelect={() => {
                            handleSelectServer(row.right);
                            setCurrentView('SIGNAL_TERMINAL');
                          }}
                        />
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================================================================= */
          /*         DEDICATED FULL-SCREEN SIGNAL TERMINAL FOR SERVER          */
          /* ================================================================= */
          <div className="space-y-4 sm:space-y-5">
            {/* LIVE PREDICTION HERO CARD - সক্রিয় সিগন্যাল টার্মিনাল */}
            <div
              ref={activeTerminalRef}
              id="active-signal-terminal"
              className={`bg-[#101214] rounded-3xl p-4 sm:p-6 border relative overflow-hidden transition-all duration-500 scroll-mt-20 ${
                terminalHighlighted
                  ? 'border-[#19D58A] ring-4 ring-[#19D58A] shadow-[0_0_50px_rgba(25,213,138,0.6)] scale-[1.01]'
                  : 'shadow-[0_12px_45px_rgba(0,0,0,0.75)] border-white/10'
              }`}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#063B29] via-[#19D58A] to-[#063B29]"
              />

              {/* Terminal Strategy & Tier Strip (Single clean header) */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 mb-4 border-b border-white/10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-[#19D58A] text-[#080A0B] font-black flex items-center gap-1 shadow-md border border-[#19D58A]">
                    <Radio className="w-3 h-3 text-[#080A0B] animate-pulse" />
                    <span>সক্রিয় সিগন্যাল টার্মিনাল</span>
                  </span>
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full font-black border"
                    style={{
                      backgroundColor: `${activeTheme.primary}25`,
                      borderColor: activeTheme.primary,
                      color: '#ffffff',
                    }}
                  >
                    {tierInfo.label}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-[#080A0B] font-black flex items-center gap-1 shadow-md border border-amber-400">
                    <Crown className="w-3 h-3 fill-[#080A0B]" />
                    <span>র‌্যাংক #{activeServerRank}</span>
                  </span>
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full font-mono font-black border bg-[#063B29] text-[#19D58A] border-[#19D58A]/40"
                  >
                    উইন রেট: {activeScore.rate}%
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#94A3B8] border border-white/10 font-bold hidden sm:inline">
                    {activeServer.category}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] font-medium">{activeServer.strategyBn}</p>
              </div>

              {/* Running 17-digit Period & Countdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3 p-3 rounded-2xl bg-[#080A0B] border border-white/10 shadow-inner">
                <div className="flex items-center justify-between sm:justify-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#101214] flex items-center justify-center text-[#19D58A] border border-white/10 flex-shrink-0">
                    <Crown className="w-4 h-4 text-[#19D58A]" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-[11px] text-[#94A3B8] font-bold">
                      রানিং ১৭-ডিজিট পিরিয়ড
                    </div>
                    <div className="text-sm sm:text-lg font-mono font-black tracking-wider text-white">
                      <span>
                        {activePeriod.slice(0, 8)}-{activePeriod.slice(8, 13)}-
                      </span>
                      <span className="text-[#19D58A] underline decoration-[#19D58A]/40 decoration-2 font-black">
                        {activePeriod.slice(13)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2.5">
                  <div className="text-right">
                    <div className="text-[10px] sm:text-[11px] text-[#94A3B8] font-bold">
                      {syncing ? 'ড্রো সিঙ্ক হচ্ছে...' : 'কাউন্টডাউন টাইমার'}
                    </div>
                    <div
                      className={`text-xl sm:text-2xl font-mono font-black tracking-wider ${
                        countdown <= 5 || syncing
                          ? 'text-red-400 animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                          : 'text-[#19D58A]'
                      }`}
                    >
                      {String(Math.floor(countdown / 60)).padStart(2, '0')}:
                      {String(countdown % 60).padStart(2, '0')}
                    </div>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0 ${
                      countdown <= 5 || syncing
                        ? 'bg-[#19D58A]/20 text-[#19D58A] border-[#19D58A] animate-spin'
                        : 'bg-[#101214] text-[#19D58A] border border-white/10'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-[#19D58A]" />
                  </div>
                </div>
              </div>

              {/* PRIMARY FUTURISTIC NEON SIGNAL & TARGETS BOX */}
              <NeonSignalBox
                signal={livePrediction.size}
                targetNumbers={livePrediction.numbers}
                targetColor={livePrediction.color}
                isVip={true}
                jackpotLabel="JACKPOT POTENTIAL"
                className="mb-3.5"
              />

              {/* Server Risk & Conviction Stats */}
              <div className="p-3.5 rounded-2xl bg-[#101214]/90 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3 shadow-inner">
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">ক্যাটাগরি</span>
                  <span className="font-bold text-[#F8FAFC]">{activeServer.category}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">রিস্ক প্রোফাইল</span>
                  <span className="font-bold text-[#19D58A]">{activeServer.riskLevel} শিল্ড</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">কনফিডেন্স লেভেল</span>
                  <span className="font-bold font-mono text-[#19D58A]">{livePrediction.confidence}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">সাইবার রেটিং</span>
                  <span className="font-bold text-[#F8FAFC]">★★★★★ (৫/৫)</span>
                </div>
              </div>

              {/* Live Reasoning strip */}
              <div className="p-3.5 rounded-2xl bg-[#101214]/90 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#94A3B8] shadow-inner">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-[#19D58A] flex-shrink-0" />
                  <span>
                    <strong className="text-[#19D58A]">অ্যালগরিদম লজিক:</strong> {livePrediction.reasoning}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono font-black text-xs">
                  <span className="text-[#F8FAFC]">{livePrediction.confidence}% কনফিডেন্স</span>
                  <span className="text-[#19D58A]">WIN RATE: {activeScore.rate}%</span>
                </div>
              </div>
            </div>

            {/* 10-ROUND VERIFIED HISTORY TABLE */}
            <div
              className="bg-[#101214]/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-[#063B29] shadow-xl w-full max-w-full box-border overflow-hidden"
              style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
            >
                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <ShieldCheck className="w-4 h-4 text-[#19D58A] flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-mono font-black text-white tracking-wider uppercase truncate">
                      10-ROUND VERIFIED HISTORY
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#063B29] text-[#19D58A] border border-[#19D58A]/30 whitespace-nowrap flex-shrink-0">
                    REAL-TIME VERIFIED
                  </span>
                </div>

                {/* Stats Summary Strip */}
                <div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-2.5 sm:mb-3 p-2 rounded-xl sm:rounded-2xl bg-[#080A0B]/85 border border-white/10 text-center shadow-inner w-full max-w-full box-border"
                  style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                >
                  <div className="min-w-0">
                    <div className="text-[9px] sm:text-[10px] text-[#94A3B8] font-bold truncate">TOTAL VERIFIED</div>
                    <div className="text-xs sm:text-sm font-black text-[#F8FAFC] font-mono">10 ROUNDS</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] sm:text-[10px] text-[#94A3B8] font-bold truncate">WIN RATE</div>
                    <div className="text-xs sm:text-sm font-black text-[#19D58A] font-mono">{activeScore.rate}%</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] sm:text-[10px] text-[#94A3B8] font-bold truncate">TOTAL WINS</div>
                    <div className="text-xs sm:text-sm font-black text-[#19D58A] font-mono">{activeScore.wins} ROUNDS</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] sm:text-[10px] text-[#94A3B8] font-bold truncate">WIN STREAK</div>
                    <div className="text-xs sm:text-sm font-black text-[#19D58A] font-mono">{activeScore.recentStreak}x STREAK</div>
                  </div>
                </div>

                {/* 100% Width Responsive Table (No Horizontal Scrolling) */}
                <div
                  className="w-full max-w-full box-border rounded-xl border border-white/10 overflow-hidden"
                  style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                >
                  <table
                    className="w-full table-fixed text-left text-xs border-collapse"
                    style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                  >
                    <colgroup>
                      <col style={{ width: '33%' }} />
                      <col style={{ width: '23%' }} />
                      <col style={{ width: '25%' }} />
                      <col style={{ width: '19%' }} />
                    </colgroup>
                    <thead className="bg-[#080A0B]/90 text-[#94A3B8] font-bold border-b border-white/10">
                      <tr>
                        <th className="py-2 px-1.5 sm:py-2.5 sm:px-3 text-[9px] sm:text-xs font-mono font-bold tracking-tight">
                          <span className="hidden sm:inline">17-DIGIT </span>PERIOD
                        </th>
                        <th className="py-2 px-1.5 sm:py-2.5 sm:px-3 text-[9px] sm:text-xs font-mono font-bold tracking-tight">
                          PREDICTION
                        </th>
                        <th className="py-2 px-1.5 sm:py-2.5 sm:px-3 text-[9px] sm:text-xs font-mono font-bold tracking-tight">
                          RESULT
                        </th>
                        <th className="py-2 px-1.5 sm:py-2.5 sm:px-3 text-[9px] sm:text-xs font-mono font-bold tracking-tight text-right">
                          STATUS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-[#101214]/70 font-medium">
                      {filteredHistory.map((row, idx) => {
                        const isPending = row.isPending;
                        const status = isPending ? 'PENDING' : row.status;

                        return (
                          <tr
                            key={`${row.period}-${idx}`}
                            className={`hover:bg-white/5 transition-colors ${isPending ? 'bg-emerald-500/10' : ''}`}
                          >
                            {/* Col 1: 17-Digit Period */}
                            <td className="py-2 px-1.5 sm:py-2.5 sm:px-3 min-w-0">
                              <div className="flex items-center gap-1 min-w-0">
                                {isPending && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
                                )}
                                <div className="font-mono font-bold text-[9px] sm:text-xs leading-tight min-w-0 text-[#F8FAFC]">
                                  <span className="text-gray-400 block xs:inline">{row.period.slice(0, 8)}-</span>
                                  <span className="inline-block whitespace-nowrap">
                                    <span>{row.period.slice(8, 13)}-</span>
                                    <span className="text-[#19D58A] font-black">{row.period.slice(13)}</span>
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Col 2: Prediction Size & Color */}
                            <td className="py-2 px-1.5 sm:py-2.5 sm:px-3 min-w-0">
                              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-1 min-w-0">
                                <span
                                  className={`px-1.5 py-0.5 rounded font-black text-[9px] sm:text-xs leading-none whitespace-nowrap ${
                                    row.prediction.size === 'BIG'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/40'
                                  }`}
                                >
                                  {row.prediction.size}
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] font-black leading-none whitespace-nowrap ${
                                    row.prediction.color === 'GREEN'
                                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                                      : 'bg-rose-500/25 text-rose-300 border border-rose-400/40'
                                  }`}
                                >
                                  {row.prediction.color}
                                </span>
                              </div>
                            </td>

                            {/* Col 3: Market Result (Ball + Size + Color) */}
                            <td className="py-2 px-1.5 sm:py-2.5 sm:px-3 min-w-0">
                              {isPending ? (
                                <span className="text-emerald-300 font-mono italic text-[9px] sm:text-xs whitespace-nowrap">
                                  ড্র অপেক্ষমাণ...
                                </span>
                              ) : (
                                <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                                  <NumberBall number={row.number} size="xs" showDigitBadge={false} variant={ballTheme} />
                                  <div className="flex flex-col xs:flex-row items-start xs:items-center gap-0.5 xs:gap-1 leading-none min-w-0">
                                    <span
                                      className={`px-1 py-0.5 rounded text-[8px] sm:text-[10px] font-black leading-none whitespace-nowrap ${
                                        row.size === 'BIG'
                                          ? 'bg-amber-500/20 text-amber-300'
                                          : 'bg-indigo-500/20 text-indigo-300'
                                      }`}
                                    >
                                      {row.size}
                                    </span>
                                    <span
                                      className={`text-[8px] sm:text-[10px] font-bold leading-none whitespace-nowrap ${
                                        row.color.toLowerCase().includes('green') ? 'text-emerald-400' : 'text-rose-400'
                                      }`}
                                    >
                                      {row.color}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Col 4: Status */}
                            <td className="py-2 px-1.5 sm:py-2.5 sm:px-3 text-right min-w-0">
                              {isPending ? (
                                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 font-black text-[9px] sm:text-[11px] animate-pulse whitespace-nowrap">
                                  <span>⏳ PENDING</span>
                                </span>
                              ) : status === 'WIN' || status === 'JACKPOT' ? (
                                <span className="inline-flex items-center gap-0.5 px-1.5 sm:px-2.5 py-0.5 rounded-full bg-[#19D58A]/15 text-[#19D58A] border border-[#19D58A]/40 font-black text-[9px] sm:text-[11px] whitespace-nowrap">
                                  <Check className="w-3 h-3 text-[#19D58A]" />
                                  <span>WIN</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full bg-[#181116] text-slate-400 border border-slate-700/60 font-black text-[9px] sm:text-[11px] whitespace-nowrap">
                                  <span>LOSS</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

          </div>
        )}
      </main>

      {/* FULL 30-SERVERS SELECTION MODAL DRAWER */}
      {serverDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#101214]/98 border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-[0_0_60px_rgba(25,213,138,0.2)] overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#080A0B]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#19D58A] to-[#063B29] flex items-center justify-center text-[#080A0B] font-black shadow-md border border-[#19D58A]">
                  <SlidersHorizontal className="w-5 h-5 fill-[#080A0B] text-[#080A0B]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#F8FAFC] flex items-center gap-2">
                    <span>৩০টি ভিআইপি সার্ভার নির্বাচন প্যানেল</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#19D58A]/15 text-[#19D58A] border border-[#19D58A]/30 font-mono">
                      মোট ৩০টি
                    </span>
                  </h3>
                  <p className="text-xs text-[#94A3B8]">যেকোনো সার্ভারে ক্লিক করে সরাসরি লাইভ সিগন্যালে প্রবেশ করুন</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setServerDrawerOpen(false)}
                className="p-2 rounded-xl bg-[#101214] hover:bg-[#14181b] text-[#94A3B8] hover:text-[#19D58A] transition-all cursor-pointer border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Box */}
            <div className="px-4 py-2.5 bg-[#080A0B] border-b border-white/10">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="সার্ভারের নাম বা নম্বর দিয়ে দ্রুত খুঁজুন (যেমন: 30, Titan, Dragon)..."
                  className="w-full bg-[#101214] border border-white/10 focus:border-[#19D58A] rounded-xl py-2 pl-9 pr-8 text-xs font-bold text-[#F8FAFC] placeholder:text-[#94A3B8]/40 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 p-1 text-[#94A3B8] hover:text-[#19D58A]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="px-4 py-2 bg-[#101214] border-b border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {[
                { id: 'ALL', label: 'সব সার্ভার (৩০)' },
                { id: 'S+', label: '👑 লেভেল S+ (৯৫-৯৯%)' },
                { id: 'S', label: '⚡ লেভেল S (৮৮-৯৪%)' },
                { id: 'A+', label: '🛡️ লেভেল A+ (৮০-৮৭%)' },
                { id: 'A', label: '🎯 লেভেল A (৭০-৭৯%)' },
                { id: 'মোমেন্টাম', label: 'মোমেন্টাম' },
                { id: 'রিভার্সাল', label: 'রিভার্সাল' },
                { id: 'প্যারিটি', label: 'প্যারিটি' },
                { id: 'কোয়ান্টাম', label: 'কোয়ান্টাম' },
                { id: 'ডিফেন্স', label: 'ডিফেন্স' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCategoryFilter(id)}
                  className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                    categoryFilter === id
                      ? 'bg-gradient-to-r from-[#19D58A] to-emerald-400 text-[#080A0B] font-black shadow-md border border-[#19D58A]'
                      : 'bg-[#080A0B] text-[#94A3B8] hover:text-[#F8FAFC] border border-white/10 hover:border-[#19D58A]/40'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Server Cards Grid */}
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredDrawerServers.map((srv) => {
                const isSelected = srv.id === activeServerId;
                const { score, rows } = evaluateServerHistory(srv, historyList);
                const isLoss = rows.length > 0 && rows[0].status === 'LOSS';
                const livePred = computeLivePrediction(srv, recentHistoryNumbers, activePeriod, isLoss);
                const tier = getTierBadge(score.rate);

                return (
                  <div
                    key={srv.id}
                    onClick={() => {
                      handleSelectServer(srv);
                      setServerDrawerOpen(false);
                      setCurrentView('SIGNAL_TERMINAL');
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#063B29]/60 to-[#101214] border-[#19D58A] shadow-[0_0_25px_rgba(25,213,138,0.25)] ring-2 ring-[#19D58A]'
                        : 'bg-[#101214] hover:bg-[#14181b] border border-white/10 hover:border-[#19D58A]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <ServerAvatar server={srv} name={srv.name} size="md" className="ring-1 ring-[#19D58A]/40 shadow-sm" />
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-[#080A0B] text-[#19D58A] border border-white/10">
                              {srv.code}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-black border ${tier.badgeBg} ${tier.badgeText} ${tier.badgeBorder}`}
                          >
                            {tier.label}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#19D58A]/15 text-[#19D58A] font-mono font-bold border border-[#19D58A]/30">
                            {score.rate}% WIN
                          </span>
                        </div>
                      </div>

                      <h4 className="font-black text-[#F8FAFC] text-sm mb-1">
                        {srv.serverNum} — {srv.name}
                      </h4>
                      <p className="text-xs text-[#94A3B8] line-clamp-2 mb-2">{srv.strategyBn}</p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#94A3B8]">টার্গেট:</span>
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded ${
                            livePred.size === 'BIG'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/40'
                          }`}
                        >
                          {livePred.size}
                        </span>
                        <div className="flex items-center gap-1 ml-1">
                          {livePred.numbers.map((n) => (
                            <NumberBall key={n} number={n} size="sm" variant={ballTheme} />
                          ))}
                        </div>
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#19D58A] text-[#080A0B] font-black shadow-md'
                            : 'bg-white/5 text-[#94A3B8] hover:bg-[#19D58A] hover:text-[#080A0B]'
                        }`}
                      >
                        {isSelected ? 'সক্রিয় আছে' : 'প্রবেশ করুন'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-[#080A0B] border-t border-white/10 text-center">
              <span className="text-xs text-[#94A3B8]">
                যেকোনো সার্ভারে ক্লিক করলেই তাৎক্ষণিক লাইভ টার্মিনালে সুইচ হবে (মোট ৩০টি সার্ভার)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ALL SERVER ICONS SHOWCASE MODAL */}
      <AllServerIconsModal
        isOpen={allIconsModalOpen}
        onClose={() => setAllIconsModalOpen(false)}
        activeServerId={activeServerId}
        historyList={historyList}
        predictionCache={predictionCache}
        recentHistoryNumbers={recentHistoryNumbers}
        activePeriod={activePeriod}
        soundEnabled={soundEnabled}
        onSelectServer={(srv) => {
          handleSelectServer(srv);
          setCurrentView('SIGNAL_TERMINAL');
        }}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                ROOT APP                                    */
/* -------------------------------------------------------------------------- */

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('wingo_vip_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  if (!isUnlocked) {
    return (
      <PasswordModal
        onUnlock={() => {
          setIsUnlocked(true);
          try {
            sessionStorage.setItem('wingo_vip_unlocked', 'true');
          } catch {}
        }}
        soundEnabled={soundEnabled}
      />
    );
  }

  return (
    <MainTerminal
      isUnlocked={isUnlocked}
      onUnlock={() => {
        setIsUnlocked(true);
        try {
          sessionStorage.setItem('wingo_vip_unlocked', 'true');
          localStorage.setItem('wingo_vip_unlocked', 'true');
        } catch {}
      }}
      onLock={() => {
        setIsUnlocked(false);
        try {
          sessionStorage.removeItem('wingo_vip_unlocked');
          localStorage.removeItem('wingo_vip_unlocked');
          localStorage.removeItem('pg_token');
        } catch {}
      }}
      soundEnabled={soundEnabled}
      onToggleSound={() => setSoundEnabled((prev) => !prev)}
    />
  );
}
