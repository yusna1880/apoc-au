import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Settings, Info } from "lucide-react";
import backgroundImage from "@assets/Naughty_Dog_The_Last_of_Us__Part_IArt_Blast_-_ArtStation_Maga_1767621865144.jfif";
import bgMusic from "@assets/Screen_Recording_20260105-231735_YouTube_1767624088058.mp3";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const particleIdRef = useRef(0);
  const sparkleIdRef = useRef(0);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const initialParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      initialParticles.push({
        id: particleIdRef.current++,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.4 + 0.2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: Math.random() * 0.3 + 0.1,
      });
    }
    setParticles(initialParticles);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.speedX,
          y: p.y + p.speedY,
          opacity: p.y > window.innerHeight ? Math.random() * 0.4 + 0.2 : p.opacity,
          ...(p.y > window.innerHeight
            ? { y: -10, x: Math.random() * window.innerWidth }
            : {}),
          ...(p.x < 0 ? { x: window.innerWidth } : {}),
          ...(p.x > window.innerWidth ? { x: 0 } : {}),
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isVideoPlaying) return;

    const audio = new Audio(bgMusic);
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = "auto";
    audioRef.current = audio;

    const safePlay = async () => {
      if (isPlayingRef.current || !audioRef.current) return;
      
      try {
        isPlayingRef.current = true;
        await audioRef.current.play();
      } catch (err) {
        isPlayingRef.current = false;
      }
    };

    const handleInteraction = () => {
      safePlay();
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      isPlayingRef.current = false;
    };
  }, [isVideoPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      isPlayingRef.current = false;
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const offsetX = ((e.clientX - centerX) / centerX) * 3;
    const offsetY = ((e.clientY - centerY) / centerY) * 3;
    setMousePosition({ x: offsetX, y: offsetY });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const newSparkles: Sparkle[] = [];
    const colors = ["#DC2626", "#F87171", "#FCA5A5", "#FFFFFF", "#FEF2F2"];
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = Math.random() * 30 + 10;
      newSparkles.push({
        id: sparkleIdRef.current++,
        x: e.clientX + Math.cos(angle) * distance,
        y: e.clientY + Math.sin(angle) * distance,
        size: Math.random() * 6 + 2,
        opacity: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setSparkles((prev) => [...prev, ...newSparkles]);

    setTimeout(() => {
      setSparkles((prev) =>
        prev.filter((s) => !newSparkles.find((ns) => ns.id === s.id))
      );
    }, 500);
  }, []);

  const handleStartGame = () => {
    stopAudio();
    setIsVideoPlaying(true);
  };

  const handleButtonClick = () => {
    stopAudio();
  };

  if (isVideoPlaying) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <iframe
          src="https://www.youtube.com/embed/ogS_HHnWwK8?autoplay=1&mute=0&controls=0&rel=0"
          className="w-full h-full border-0"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          data-testid="video-intro"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-8 right-8 text-white/70 hover:text-white bg-black/50 backdrop-blur-sm"
          onClick={() => setIsVideoPlaying(false)}
          data-testid="button-skip-video"
        >
          건너뛰기
        </Button>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <div
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.02)`,
        }}
      >
        <img
          src={backgroundImage}
          alt="Apocalypse Background"
          className="w-full h-full object-cover"
          data-testid="img-background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
      </div>

      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/60 pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            filter: "blur(0.5px)",
          }}
        />
      ))}

      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute rounded-full pointer-events-none animate-ping"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: sparkle.color,
            opacity: sparkle.opacity,
            boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`,
          }}
        />
      ))}

      <div className="relative z-10 flex h-full">
        <div className="flex-1 flex flex-col justify-center pl-12 md:pl-20 lg:pl-28">
          <h1
            className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight"
            style={{
              color: "#DC2626",
              textShadow: "0 0 40px rgba(220, 38, 38, 0.5), 0 4px 20px rgba(0,0,0,0.8)",
              fontFamily: "'Oxanium', 'Orbitron', sans-serif",
            }}
            data-testid="text-title"
          >
            아포AU
          </h1>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mt-2"
            style={{
              color: "#DC2626",
              textShadow: "0 0 30px rgba(220, 38, 38, 0.4), 0 2px 10px rgba(0,0,0,0.6)",
              fontFamily: "'Oxanium', 'Orbitron', sans-serif",
            }}
            data-testid="text-subtitle"
          >
            2026
          </h2>
          <p className="text-white/60 text-lg mt-6 max-w-md" style={{ fontFamily: "'Open Sans', sans-serif" }}>
            선택이 운명을 결정하는 세계에서 살아남으세요
          </p>
        </div>

        <div className="flex flex-col justify-center items-end pr-12 md:pr-20 lg:pr-28 gap-4">
          <Button
            onClick={handleStartGame}
            className="w-48 h-14 text-xl font-bold bg-red-600 hover:bg-red-700 text-white border-2 border-red-500 shadow-lg"
            style={{
              boxShadow: "0 0 30px rgba(220, 38, 38, 0.5), 0 4px 15px rgba(0,0,0,0.5)",
            }}
            data-testid="button-start"
          >
            시작하기
          </Button>
          <Button
            variant="ghost"
            className="w-48 h-12 text-lg font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/20"
            onClick={handleButtonClick}
            data-testid="button-continue"
          >
            이어하기
          </Button>
          <Button
            variant="ghost"
            className="w-48 h-12 text-lg font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/20"
            onClick={handleButtonClick}
            data-testid="button-settings"
          >
            <Settings className="w-5 h-5 mr-2" />
            설정
          </Button>
          <Button
            variant="ghost"
            className="w-48 h-12 text-lg font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/20"
            onClick={handleButtonClick}
            data-testid="button-credits"
          >
            <Info className="w-5 h-5 mr-2" />
            크레딧
          </Button>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          setIsMuted(!isMuted);
        }}
        className="absolute bottom-6 left-6 text-white/60 hover:text-white z-20"
        data-testid="button-mute"
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </Button>

      <div className="absolute bottom-6 right-6 text-white/40 text-sm z-20">
        v1.0.0
      </div>
    </div>
  );
}
