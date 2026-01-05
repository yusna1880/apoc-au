import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Settings, Info, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Assets
import bgStart from "@assets/Naughty_Dog_The_Last_of_Us__Part_IArt_Blast_-_ArtStation_Maga_1767621865144.jfif";
import bgClip1 from "@assets/CLIP1_1767627793833.png";
import bgClip2 from "@assets/CLIP2__1767627793836.png";
import imgHaka from "@assets/하카_1767627793844.png";
import imgRan from "@assets/란_1767627793837.png";
import imgRenja from "@assets/렌쟈_1767627793839.png";
import imgEl from "@assets/엘_1767627793842.png";
import bgMusic from "@assets/Screen_Recording_20260106-003832_YouTube_1767628059034.mp3";

type SceneType = "start" | "video" | "story";

interface DialogueLine {
  speaker: string;
  text: string;
  background?: string;
  character?: string;
  isMonologue?: boolean;
  choices?: Choice[];
  onComplete?: () => void;
  jumpIndex?: number; // Added jumpIndex for flow control
}

interface Choice {
  text: string;
  targetIndex: number;
}

export default function Home() {
  const [gameState, setGameState] = useState<SceneType>("start");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Story Data
  const story: DialogueLine[] = [
    { speaker: "파스닐", text: "요즘 ai가 발전해서 내가 할 일이 없네", background: bgClip1, isMonologue: true },
    { speaker: "파스닐", text: "(이메일을 확인한다)", background: bgClip1, isMonologue: true },
    { speaker: "파스닐", text: "초청 DJ 문의? 수상하긴 하지만 원체 부자들은 외진 곳을 좋아하니깐..", background: bgClip1, isMonologue: true },
    { speaker: "파스닐", text: "가 아니라 하필 나를?!", background: bgClip1, isMonologue: true },
    { speaker: "파스닐", text: "(통장장고가 눈에 스쳐지나간다.) 뭐 익명 파티인가 보지.", background: bgClip1, isMonologue: true },
    
    // CLIP 2 (Index 5)
    { speaker: "하카", text: "(차 문을 열고 먼저 내린다) 와. 공기 좋네.", background: bgClip2, character: "하카" },
    { speaker: "파스닐", text: "이런 데를 별장이라고 부르는 사람을 난 오늘 처음 본다.", background: bgClip2, isMonologue: true },
    { speaker: "파스닐", text: "나는 장비 가방을 둘러멘 채 차에서 내렸다. 생각보다… 크네요.", background: bgClip2, isMonologue: true },
    { speaker: "하카", text: "(웃으면서 별장을 올려다본다) 크지. 관리하기 귀찮을 정도로.", background: bgClip2, character: "하카" },
    { speaker: "파스닐", text: "귀찮다는 말에서 돈 냄새 난다.", background: bgClip2, isMonologue: true },
    { speaker: "파스닐", text: "우리밖에 없네요. 다른 분들은 아직 안 오셨어요?", background: bgClip2, isMonologue: true },
    { speaker: "하카", text: "(주머니에 넣는다) 곧. 늘 그렇듯 제각각 오겠지.", background: bgClip2, character: "하카" },
    
    // Tutorial & Choices (Index 12)
    { speaker: "시스템", text: "[튜토리얼] 말 하나, 태도 하나가 곧 결과다. 하카와의 대화 — 선택지", background: bgClip2 },
    { 
      speaker: "하카", 
      text: "긴장한 것 같네.", 
      background: bgClip2, 
      character: "하카",
      choices: [
        { text: "1. 시비를 건다. 🚫", targetIndex: 14 },
        { text: "2. 웃어넘긴다", targetIndex: 19 },
        { text: "3. 솔직히 말한다", targetIndex: 22 }
      ]
    },

    // 1. 시비를 건다 (Dead End) (Index 14)
    { speaker: "파스닐", text: "이런 데서 굳이 DJ까지 부를 필요는 없지 않아요?", background: bgClip2, isMonologue: true },
    { speaker: "하카", text: "음. 그럼 필요 없는 사람을 부른 셈이네.", background: bgClip2, character: "하카" },
    { speaker: "하카", text: "(차 키를 던진다) 집에 가. 오늘 일은 없던 걸로 하자.", background: bgClip2, character: "하카" },
    { speaker: "시스템", text: "[데드엔딩] 〈해고〉 아포칼립스는 오지 않았다. 하지만 나는, 이 이야기 안으로 들어가지도 못했다.", background: bgClip2, onComplete: () => setGameState("start") },
    { speaker: "시스템", text: "다시 시작하시겠습니까?", background: bgClip2, choices: [{ text: "처음으로", targetIndex: 0 }] },

    // 2. 웃어넘긴다 (Index 19)
    { speaker: "파스닐", text: "아무래도 이런 장소는 처음이라서요.", background: bgClip2, isMonologue: true },
    { speaker: "하카", text: "금방 익숙해질 거야. 다들 그래.", background: bgClip2, character: "하카", jumpIndex: 24 }, // Jump to meeting others

    // 3. 솔직히 말한다 (Index 22)
    { speaker: "파스닐", text: "사실… 분위기가 좀 독특해서요.", background: bgClip2, isMonologue: true },
    { speaker: "하카", text: "금방 익숙해질 거야. 다들 그래.", background: bgClip2, character: "하카" },

    // Meeting others (Index 24)
    { speaker: "시스템", text: "멀리서 차 소리가 났다. 두 사람의 기척이 느껴졌다.", background: bgClip2 },
    { speaker: "렌쟈", text: "여기 맞지?", background: bgClip2, character: "렌쟈" },
    { speaker: "하카", text: "오늘 음악 맡은 애야.", background: bgClip2, character: "하카" },
    { speaker: "렌쟈", text: "반가워. 난 드렌쟈야. 렌쟈라고 불러.", background: bgClip2, character: "렌쟈" },
    { speaker: "란", text: "처음 뵙겠습니다. 전 한 란 이에요. 란이라고 불러주세요.", background: bgClip2, character: "란" },
    
    // El arrives
    { speaker: "시스템", text: "무거운 공기가 먼저 움직였다. 엘이 도착했다.", background: bgClip2 },
    { speaker: "하카", text: "응. 어서와 엘", background: bgClip2, character: "하카" },
    { speaker: "엘", text: "데일은 감기래. 오늘은 못 온다고.", background: bgClip2, character: "엘" },
    { speaker: "렌쟈", text: "그럴 줄 알았어.", background: bgClip2, character: "렌쟈" },
    { speaker: "란", text: "심한가요?", background: bgClip2, character: "란" },
    { speaker: "엘", text: "본인은 죽을 것 같다더라.", background: bgClip2, character: "엘" },
    
    { speaker: "하카", text: "자, 다 왔네. 일단 안으로 들어가자.", background: bgClip2, character: "하카" },
    { speaker: "시스템", text: "이야기는 계속됩니다...", background: bgClip2, onComplete: () => setGameState("start") }
  ];

  const currentDialogue = story[dialogueIndex];

  useEffect(() => {
    if (gameState === "story" || gameState === "start") {
      audioRef.current = new Audio(bgMusic);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      
      const playAudio = () => {
        if (audioRef.current) audioRef.current.play().catch(() => {});
      };

      if (gameState === "story") playAudio();
      
      document.addEventListener("click", playAudio, { once: true });
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [gameState]);

  const handleNext = () => {
    if (currentDialogue.choices) return;
    
    if (currentDialogue.onComplete) {
      currentDialogue.onComplete();
      setDialogueIndex(0);
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
          className="absolute bottom-8 right-8 text-white/70 bg-black/50"
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
      <div className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-end">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src={currentDialogue.background || bgClip1} 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Character Image */}
        <AnimatePresence mode="wait">
          {charImg && (
            <motion.div
              key={currentDialogue.character}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute bottom-0 h-[80%] w-auto pointer-events-none"
            >
              <img 
                src={charImg} 
                className="h-full object-contain scale-125 origin-bottom"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dialogue Box */}
        <div 
          className="relative z-20 w-full max-w-5xl mb-12 p-8 bg-black/70 border-2 border-red-900/50 rounded-lg cursor-pointer"
          onClick={handleNext}
        >
          <div className="text-red-600 font-bold mb-2 text-xl tracking-widest">
            {currentDialogue.speaker}
          </div>
          <div className={`text-white text-2xl leading-relaxed ${currentDialogue.isMonologue ? 'italic text-white/80' : ''}`}>
            {currentDialogue.text}
          </div>

          {currentDialogue.choices && (
            <div className="mt-6 flex flex-col gap-3">
              {currentDialogue.choices.map((choice, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4 text-lg border-red-900/30 hover:bg-red-900/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChoice(choice.targetIndex);
                  }}
                >
                  {choice.text}
                </Button>
              ))}
            </div>
          )}

          {!currentDialogue.choices && (
            <div className="absolute bottom-4 right-4 animate-bounce">
              <ChevronRight className="text-red-600" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black"
      onMouseMove={(e) => {
        const x = (e.clientX - window.innerWidth / 2) / 100;
        const y = (e.clientY - window.innerHeight / 2) / 100;
        setMousePosition({ x, y });
      }}
    >
      {/* Parallax Background */}
      <div
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.05)` }}
      >
        <img src={bgStart} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full p-20">
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-9xl font-black text-red-600 tracking-tighter" style={{ textShadow: '0 0 50px rgba(220, 38, 38, 0.5)' }}>
            아포AU
          </h1>
          <h2 className="text-6xl font-bold text-red-600 mt-2">2026</h2>
        </div>

        <div className="flex flex-col justify-center gap-4">
          <Button
            size="lg"
            className="w-64 h-16 text-2xl font-bold bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setGameState("video")}
          >
            시작하기
          </Button>
          <Button variant="ghost" className="w-64 h-14 text-xl text-white/70 hover:text-white bg-white/5">
            이어하기
          </Button>
          <Button variant="ghost" className="w-64 h-14 text-xl text-white/70 hover:text-white bg-white/5">
            설정
          </Button>
        </div>
      </div>
    </div>
  );
}
