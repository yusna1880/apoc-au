import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Settings, Info, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Assets
import bgStart from "@assets/Naughty_Dog_The_Last_of_Us__Part_IArt_Blast_-_ArtStation_Maga_1767621865144.jfif";
import bgClip1 from "@assets/CLIP1_1767629114299.png";
import bgClip2 from "@assets/CLIP2__1767629114300.png";
import imgHaka from "@assets/하카_1767627793844.png";
import imgRan from "@assets/란_1767627793837.png";
import imgRenja from "@assets/렌쟈_1767627793839.png";
import imgEl from "@assets/엘_1767627793842.png";
import bgMusic from "@assets/Screen_Recording_20260106-003832_YouTube_1767628059034.mp3";

type SceneType = "start" | "video" | "story";

interface DialogueLine {
  speaker: string;
  text: string;
  expression?: string;
  background?: string;
  character?: string;
  isMonologue?: boolean;
  isProgress?: boolean;
  choices?: Choice[];
  onComplete?: () => void;
  jumpIndex?: number;
  triggerTransition?: boolean;
}

interface Choice {
  text: string;
  targetIndex: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}

interface DustParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export default function Home() {
  const [gameState, setGameState] = useState<SceneType>("start");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [dustParticles, setDustParticles] = useState<DustParticle[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sparkleIdRef = useRef(0);

  // Preload images to prevent lag
  useEffect(() => {
    const images = [bgStart, bgClip1, bgClip2, imgHaka, imgRan, imgRenja, imgEl];
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Initialize Dust Particles for Start Screen
  useEffect(() => {
    const initialDust: DustParticle[] = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.05,
      speedY: (Math.random() - 0.5) * 0.05 + 0.02,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setDustParticles(initialDust);

    const interval = setInterval(() => {
      setDustParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.speedX + 100) % 100,
        y: (p.y + p.speedY + 100) % 100,
      })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Story Data
  const story: DialogueLine[] = useMemo(() => [
    { speaker: "파스닐", text: "요즘 ai가 발전해서 내가 할 일이 없네", background: bgClip1, isMonologue: true },
    { speaker: "파스닐", expression: "이메일을 확인한다", text: "...", background: bgClip1, isMonologue: true },
    { speaker: "파스닐", text: "초청 DJ 문의? 수상하긴 하지만 원체 부자들은 외진 곳을 좋아하니깐..", background: bgClip1, isMonologue: true },
    { speaker: "파스닐", text: "가 아니라 하필 나를?!", background: bgClip1, isMonologue: true },
    { speaker: "파스닐", expression: "통장장고가 눈에 스쳐지나간다.", text: "뭐 익명 파티인가 보지.", background: bgClip1, isMonologue: true, triggerTransition: true },
    
    { speaker: "하카", expression: "차 문을 열고 먼저 내린다", text: "와. 공기 좋네.", background: bgClip2, character: "하카" },
    { speaker: "파스닐", text: "이런 데를 별장이라고 부르는 사람을 난 오늘 처음 본다.", background: bgClip2, isMonologue: true },
    { speaker: "시스템", text: "...", isProgress: true, background: bgClip2 },
    { speaker: "시스템", text: "나는 장비 가방을 둘러멘 채 차에서 내렸다.", isProgress: true, background: bgClip2 },
    { speaker: "파스닐", text: "생각보다… 크네요.", background: bgClip2, isMonologue: true },
    { speaker: "하카", expression: "웃으면서 별장을 올려다본다", text: "크지. 관리하기 귀찮을 정도로.", background: bgClip2, character: "하카" },
    { speaker: "파스닐", text: "귀찮다는 말에서 돈 냄새 난다.", background: bgClip2, isMonologue: true },
    { speaker: "시스템", text: "주위를 한번 둘러보았다.", isProgress: true, background: bgClip2 },
    { speaker: "파스닐", text: "우리밖에 없네요. 다른 분들은 아직 안 오셨어요?", background: bgClip2, isMonologue: true },
    { speaker: "하카", expression: "휴대폰을 꺼내다 말고 다시 주머니에 넣는다", text: "곧. 늘 그렇듯 제각각 오겠지.", background: bgClip2, character: "하카" },
    { speaker: "파스닐", expression: "‘늘’이라는 말. 여긴 내가 끼어든 자리가 아니라는 느낌이 든다.", text: "...", background: bgClip2, isMonologue: true },
    { speaker: "시스템", text: "가방 끈을 다시 고쳐 멘다", isProgress: true, background: bgClip2 },
    { speaker: "파스닐", text: "그럼 장비는 안에 세팅해둘까요?", background: bgClip2, isMonologue: true },
    { speaker: "하카", expression: "고개를 끄덕인다", text: "응. 네 판단에 맡길게.", background: bgClip2, character: "하카" },
    
    { speaker: "시스템", text: "[튜토리얼] 이 남자는 날 고용했고, 난 이 남자의 기분에 월급이 달려 있다. 말 하나, 태도 하나가 곧 결과다.", isProgress: true, background: bgClip2 },
    { 
      speaker: "하카", 
      expression: "별장 문을 열며",
      text: "긴장한 것 같네.", 
      background: bgClip2, 
      character: "하카",
      choices: [
        { text: "1. 시비를 건다.", targetIndex: 21 },
        { text: "2. 웃어넘긴다", targetIndex: 29 },
        { text: "3. 솔직히 말한다", targetIndex: 31 }
      ]
    },

    { speaker: "파스닐", text: "돈 많은 사람들은 이런 말 좋아하던데. 이런 데서 굳이 DJ까지 부를 필요는 없지 않아요?", background: bgClip2, isMonologue: true },
    { speaker: "하카", expression: "걸음을 멈춘다", text: "음.", background: bgClip2, character: "하카" },
    { speaker: "하카", expression: "천천히 고개를 돌려 파스닐을 본다", text: "그럼 필요 없는 사람을 부른 셈이네.", background: bgClip2, character: "하카" },
    { speaker: "파스닐", text: "농담이 안 통했다.", background: bgClip2, isMonologue: true },
    { speaker: "시스템", text: "나는 입을 다물었다.", isProgress: true, background: bgClip2 },
    { speaker: "하카", expression: "차 키를 던진다", text: "집에 가. 오늘 일은 없던 걸로 하자.", background: bgClip2, character: "하카" },
    { speaker: "파스닐", text: "…알겠습니다.", background: bgClip2, isMonologue: true },
    { speaker: "시스템", text: "[데드엔딩] 〈해고〉 아포칼립스는 오지 않았다. 하지만 나는, 이 이야기 안으로 들어가지도 못했다.", isProgress: true, background: bgClip2, onComplete: () => { setGameState("start"); setDialogueIndex(0); } },

    { speaker: "파스닐", text: "웃어넘기는 게 제일 안전하다. 아무래도 이런 장소는 처음이라서요.", background: bgClip2, isMonologue: true },
    { speaker: "하카", expression: "별장 문을 열다 말고 웃는다", text: "금방 익숙해질 거야. 다들 그래.", background: bgClip2, character: "하카", jumpIndex: 34 },

    { speaker: "파스닐", text: "사실… 분위기가 좀 독특해서요.", background: bgClip2, isMonologue: true },
    { speaker: "하카", expression: "별장 문을 열다 말고 웃는다", text: "금방 익숙해질 거야. 다들 그래.", background: bgClip2, character: "하카" },

    { speaker: "시스템", text: "나는 그 말이 위로인지, 그냥 흘려보낸 말인지 판단하지 못한 채 고개를 끄덕였다. 문이 열리자 서늘한 공기가 안쪽에서 흘러나왔다.", isProgress: true, background: bgClip2 },
    
    { speaker: "시스템", text: "멀리서 차 소리가 났다. 이번엔 두 사람의 기척이 거의 동시에 느껴졌다.", isProgress: true, background: bgClip2 },
    { speaker: "시스템", text: "(차가 멈추고, 문이 연달아 닫힌다)", isProgress: true, background: bgClip2 },
    { speaker: "하카", expression: "고개만 돌린다", text: "왔네.", background: bgClip2, character: "하카" },
    { speaker: "시스템", text: "차에서 먼저 내린 건 붉은 머리의 여자였다. 차분한 동작, 주변을 빠르게 훑는 시선.", isProgress: true, background: bgClip2 },
    { speaker: "렌쟈", text: "여기 맞지?", background: bgClip2, character: "렌쟈" },
    { speaker: "하카", expression: "손을 들어 가볍게 흔든다", text: "응.", background: bgClip2, character: "하카" },
    { speaker: "시스템", text: "그 뒤를 따라 내린 다른 남자는 가볍게 숨을 고르며 주변을 살폈다.", isProgress: true, background: bgClip2 },
    { speaker: "란", expression: "남자가 허리를 숙인다", text: "누님, 길은 괜찮으셨어요?", background: bgClip2, character: "란" },
    { speaker: "렌쟈", text: "응. 생각보다 덜 미끄러웠어.", background: bgClip2, character: "렌쟈" },
    { speaker: "시스템", text: "나는 그 짧은 대화에서 두 사람이 이미 역할이 정해진 관계라는 걸 느꼈다.", isProgress: true, background: bgClip2 },
    { speaker: "하카", expression: "나를 가리키며", text: "오늘 음악 맡은 애야.", background: bgClip2, character: "하카" },
    { speaker: "렌쟈", expression: "시선을 나에게 옮긴다", text: "…아, 그렇구나. 반가워. 난 드렌쟈야. 렌쟈라고 불러.", background: bgClip2, character: "렌쟈" },
    { speaker: "란", expression: "한 박자 늦게 고개를 숙인다", text: "처음 뵙겠습니다. 전 한 란 이에요. 란이라고 불러주세요.", background: bgClip2, character: "란" },
    { speaker: "시스템", text: "나는 반사적으로 고개를 숙였다. 누가 봐도 이 자리에 익숙하지 않은 건 나였다.", isProgress: true, background: bgClip2 },
    { speaker: "파스닐", text: "안녕하세요.", background: bgClip2, isMonologue: true },
    { speaker: "시스템", text: "렌쟈는 더 묻지 않았다. 란도 마찬가지였다. 둘 다, 필요 이상의 관심은 두지 않는 눈이었다.", isProgress: true, background: bgClip2 },
    
    { speaker: "시스템", text: "이번엔 발소리보다 먼저 기척이 느껴졌다. 무거운 공기가 먼저 움직였다.", isProgress: true, background: bgClip2 },
    { speaker: "시스템", text: "(차가 멈춘다. 문이 조용히 열린다)", isProgress: true, background: bgClip2 },
    { speaker: "엘", expression: "내리자마자 주변을 훑는다", text: "여기군.", background: bgClip2, character: "엘" },
    { speaker: "하카", expression: "가볍게 웃는다", text: "응. 어서와 엘", background: bgClip2, character: "하카" },
    { speaker: "엘", expression: "엘.. 은 내 쪽을 한 번 본다. 시선이 오래 머무르지 않는다.", text: "데일은 감기래. 오늘은 못 온다고.", background: bgClip2, character: "엘" },
    { speaker: "렌쟈", expression: "짧게 고개를 끄덕인다", text: "그럴 줄 알았어.", background: bgClip2, character: "렌쟈" },
    { speaker: "란", text: "심한가요?", background: bgClip2, character: "란" },
    { speaker: "엘", text: "본인은 죽을 것 같다더라.", background: bgClip2, character: "엘" },
    { speaker: "시스템", text: "그 말투엔 걱정도, 장난도 섞이지 않았다. 사실 전달, 딱 그 정도.", isProgress: true, background: bgClip2 },
    { speaker: "파스닐", text: "나는 이름 하나를 마음속에 적었다. 데일. 아직 보지 못한 사람. 하지만 이미 이들 사이엔 자리가 있다.", background: bgClip2, isMonologue: true },
    
    { speaker: "하카", expression: "손뼉을 한 번 친다", text: "자, 다 왔네. 일단 안으로 들어가자.", background: bgClip2, character: "하카" },
    { speaker: "시스템", text: "나는 자연스럽게 가장 마지막에 섰다. 누가 시킨 건 아니었지만, 그게 맞는 위치 같았다. 문은 아직 열려 있었다.", isProgress: true, background: bgClip2, onComplete: () => { setGameState("start"); setDialogueIndex(0); } }
  ], []);

  const currentDialogue = story[dialogueIndex];

  // Audio handling
  useEffect(() => {
    if (gameState === "story" && currentDialogue?.background === bgClip2) {
      if (!audioRef.current) {
        audioRef.current = new Audio(bgMusic);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4;
        audioRef.current.play().catch(() => {});
      }
    } else if (gameState === "start") {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
    return () => {
      if (gameState === "start" && audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [gameState, currentDialogue?.background]);

  const handleNext = () => {
    if (currentDialogue.choices) return;
    
    if (currentDialogue.onComplete) {
      currentDialogue.onComplete();
      return;
    }

    if (currentDialogue.jumpIndex !== undefined) {
      setDialogueIndex(currentDialogue.jumpIndex);
      return;
    }

    if (dialogueIndex < story.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      setGameState("start");
      setDialogueIndex(0);
    }
  };

  const handleChoice = (targetIndex: number) => {
    setDialogueIndex(targetIndex);
  };

  const handleClick = (e: React.MouseEvent) => {
    const newSparkle = {
      id: sparkleIdRef.current++,
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 8 + 4,
      opacity: 1,
      color: ["#DC2626", "#FFFFFF", "#FCA5A5"][Math.floor(Math.random() * 3)]
    };
    setSparkles(prev => [...prev, newSparkle]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
    }, 600);
  };

  const getCharacterImage = (name?: string) => {
    switch (name) {
      case "하카": return imgHaka;
      case "란": return imgRan;
      case "렌쟈": return imgRenja;
      case "엘": return imgEl;
      default: return null;
    }
  };

  if (gameState === "video") {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <iframe
          src="https://www.youtube.com/embed/ogS_HHnWwK8?autoplay=1&mute=0&controls=0&rel=0"
          className="w-full h-full border-0"
          allow="autoplay; encrypted-media; fullscreen"
        />
        <Button
          variant="ghost"
          className="absolute bottom-8 right-8 text-white/70 bg-black/50 backdrop-blur-md"
          onClick={() => setGameState("story")}
        >
          건너뛰기
        </Button>
      </div>
    );
  }

  if (gameState === "story") {
    const charImg = getCharacterImage(currentDialogue.character);
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-end" onClick={handleClick}>
        <AnimatePresence>
          {sparkles.map(s => (
            <motion.div
              key={s.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              className="absolute pointer-events-none z-[100] rounded-full"
              style={{ left: s.x - s.size/2, top: s.y - s.size/2, width: s.size, height: s.size, backgroundColor: s.color, boxShadow: `0 0 15px ${s.color}` }}
            />
          ))}
        </AnimatePresence>

        {/* Cinematic Letterbox (Top) */}
        <div className="absolute top-0 left-0 w-full h-[10%] bg-black z-30 pointer-events-none" />
        
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDialogue.background}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0 }}
              className="w-full h-full"
            >
              <img 
                src={currentDialogue.background || bgClip1} 
                className="w-full h-full object-cover filter brightness-[0.6] contrast-[1.1] saturate-[0.8]"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          {/* Light Leak / Cinematic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Character Rendering - Face focused scaling */}
        <AnimatePresence mode="wait">
          {charImg && (
            <motion.div
              key={currentDialogue.character}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-[-20%] h-[110%] w-auto pointer-events-none z-10"
            >
              <img 
                src={charImg} 
                className="h-full object-contain drop-shadow-[0_0_40px_rgba(0,0,0,0.9)]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dialogue UI - Scaled down & grittier */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-20 w-[85%] max-w-4xl mb-16 cursor-pointer group"
          onClick={handleNext}
        >
          {currentDialogue.isProgress ? (
            <div className="bg-black/20 p-6 rounded-lg text-center">
              <p className="text-white/50 text-lg font-light tracking-widest italic uppercase">
                {currentDialogue.text}
              </p>
            </div>
          ) : (
            <div className="bg-neutral-950/90 backdrop-blur-md p-8 rounded-sm border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600/50" />
              <div className="flex items-center gap-3 mb-3">
                <span className="text-red-600 font-bold text-lg tracking-tight uppercase">
                  {currentDialogue.speaker}
                </span>
                {currentDialogue.expression && (
                  <span className="text-white/30 text-xs font-normal tracking-wide bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    {currentDialogue.expression}
                  </span>
                )}
              </div>
              
              <div className={`text-white/90 text-xl font-normal leading-relaxed ${currentDialogue.isMonologue ? 'text-white/60 italic' : ''}`}>
                {currentDialogue.text}
              </div>

              {currentDialogue.choices && (
                <div className="mt-8 grid grid-cols-1 gap-3">
                  {currentDialogue.choices.map((choice, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className="w-full justify-start py-6 text-lg font-medium border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all rounded-none text-white/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChoice(choice.targetIndex);
                      }}
                    >
                      <span className="mr-4 text-red-600 font-bold opacity-50">{i + 1}</span>
                      {choice.text}
                    </Button>
                  ))}
                </div>
              )}

              {!currentDialogue.choices && (
                <div className="absolute bottom-4 right-6 opacity-30 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-white animate-pulse" />
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Cinematic Letterbox (Bottom) */}
        <div className="absolute bottom-0 left-0 w-full h-[10%] bg-black z-30 pointer-events-none" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black flex items-center p-16"
      onMouseMove={(e) => {
        const x = (e.clientX - window.innerWidth / 2) / 120;
        const y = (e.clientY - window.innerHeight / 2) / 120;
        setMousePosition({ x, y });
      }}
      onClick={handleClick}
    >
      {/* Background with Letterbox effect */}
      <div className="absolute top-0 left-0 w-full h-[8%] bg-black z-30" />
      <div className="absolute bottom-0 left-0 w-full h-[8%] bg-black z-30" />

      {/* Floating Dust Sparkles */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {dustParticles.map(p => (
          <div 
            key={p.id}
            className="absolute rounded-full bg-white/40"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              filter: 'blur(1px)',
              transition: 'all 0.05s linear'
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {sparkles.map(s => (
          <motion.div
            key={s.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            className="absolute pointer-events-none z-[100] rounded-full"
            style={{ left: s.x - s.size/2, top: s.y - s.size/2, width: s.size, height: s.size, backgroundColor: s.color, boxShadow: `0 0 15px ${s.color}` }}
          />
        ))}
      </AnimatePresence>

      {/* Parallax Background */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.03)` }}
      >
        <img src={bgStart} className="w-full h-full object-cover opacity-40 filter saturate-[0.5] contrast-[1.2]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent" />
      </div>

      <div className="relative z-10 flex w-full max-w-7xl mx-auto items-center justify-between">
        <div className="flex flex-col">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-8xl font-black text-red-600/90 tracking-tighter leading-none" 
            style={{ 
              fontFamily: "'Oxanium', sans-serif",
              filter: 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.3))' 
            }}
          >
            아포AU
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-light text-red-600/60 tracking-[1rem] mt-2 ml-2"
          >
            2026
          </motion.h2>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            size="lg"
            className="w-56 h-14 text-xl font-bold bg-red-700/80 hover:bg-red-600 text-white rounded-none border border-red-500/30 transition-all hover:translate-x-2"
            onClick={() => setGameState("video")}
          >
            시작하기
          </Button>
          <Button variant="ghost" className="w-56 h-12 text-lg text-white/40 hover:text-white hover:bg-white/5 rounded-none border border-white/5">
            이어하기
          </Button>
          <Button variant="ghost" className="w-56 h-12 text-lg text-white/40 hover:text-white hover:bg-white/5 rounded-none border border-white/5">
            설정
          </Button>
        </div>
      </div>
    </div>
  );
}
