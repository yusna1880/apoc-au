import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Settings, Info, ChevronRight, Save, Send, Lock, Unlock, Zap, Activity, Shield, Cpu, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

// Assets - Backgrounds
import bgStart from "@assets/Naughty_Dog_The_Last_of_Us__Part_IArt_Blast_-_ArtStation_Maga_1767621865144.jfif";
import bgClip1 from "@assets/CLIP1_1767629114299.png";
import bgClip2 from "@assets/CLIP2__1767629114300.png";
import bgLivingRoom from "@assets/거실_1767632984088.png";
import bgBalcony from "@assets/발코니_1767633199816.png";
import bgNearForest from "@assets/숲근처_1767633723451.png";
import bgStorage from "@assets/창고_1767633855944.png";
import bgCity1 from "@assets/도시1_1767634895522.png";
import bgMart from "@assets/마트_1767635092045.png";
import bgNearHospital from "@assets/병원_근처_1767635318516.png";
import bgHospital from "@assets/병원_1767635422546.png";

// New Backgrounds from user
import bgC16 from "@assets/KakaoTalk_20260106_043354949_1767642072955.png";
import bgHospitalNew from "@assets/병원_1767642481036.png";
import bgNearHospitalNew from "@assets/병원_근처_1767642517933.png";
import bgLivingRoomNew from "@assets/거실_1767642563208.png";

// D-series Backgrounds
import bgD1 from "@assets/KakaoTalk_20260106_231721217_1767726264601.png";
import bgD2 from "@assets/KakaoTalk_20260107_021010473_01_1767724794632.png";
import bgD3 from "@assets/KakaoTalk_20260107_021010473_02_1767724794627.png";
import bgD5 from "@assets/KakaoTalk_20260107_021010473_03_1767724794628.png";
import bgD5_New from "@assets/KakaoTalk_20260107_021010473_04_1767729615579.png";
import bgD6 from "@assets/KakaoTalk_20260107_021010473_04_1767724794630.png";
import bgH1 from "@assets/KakaoTalk_20260107_021010473_1767724794633.png";
import bgD10 from "@assets/ㄱ_1767725110273.png";
import bgF2 from "@assets/ㄷ_1767724794638.png";
import bgF3 from "@assets/ㅎ_1767724794636.png";
import bgLivingRoomUpdate from "@assets/거실_1767725608813.png";
import bgG2 from "@assets/KakaoTalk_20260107_021010473_06_1767724794625.jpg";
import bgG2Dead from "@assets/KakaoTalk_20260107_021010473_06_1767738261773.jpg";
import bg_2 from "@assets/KakaoTalk_20260107_021010473_07_1767724794622.png";
import bg_4 from "@assets/KakaoTalk_20260107_021010473_08_1767724794619.png";
import bg_5 from "@assets/KakaoTalk_20260107_021010473_09_1767724794617.png";

// New scene backgrounds
import bgSillaRoom from "@assets/신라방_1767739540393.png";
import imgMemo from "@assets/메모장_1767739540390.png";
import bgForestRoad from "@assets/도로숲_1767739809224.png";
import bgLivingRoom2 from "@assets/거실_1767739883546.png";

// A2/A3 special backgrounds
import bgA2 from "@assets/1_1767744832349.png";
import bgA3 from "@assets/2_1767744832347.png";

// Assets - Characters (Normal)
import imgHaka from "@assets/하카_1767627793844.png";
import imgRan from "@assets/란_1767627793837.png";
import imgRenja from "@assets/렌쟈_1767627793839.png"; // Fix: Use the same asset if missing
import imgEl from "@assets/엘_1767627793842.png";
import imgPasnil from "@assets/파스닐_1767631756273.png";
import imgDale from "@assets/데일_1767642442612.png";
import imgSilla from "@assets/신라_1767737204993.png";

// Assets - Characters (V2)
import imgHaka2 from "@assets/하카2_1767637478411.png";
import imgRan2 from "@assets/란수정_1767737558677.png";
import imgRenja2 from "@assets/렌쟈2_1767637478408.png";
import imgEl2 from "@assets/엘2_1767637478414.png";
import imgPasnil2 from "@assets/파스닐2_1767745289498.png";

// Assets - Audio
import bgMusicStart from "@assets/Screen_Recording_20260106-003832_YouTube_1767628059034.mp3";
import bgMusic1 from "@assets/Screen_Recording_20260106-012639_YouTube_(1)_1767633094663.mp3";
const bgMusicBalcony = "/attached_assets/videoplayback_1767633518219.weba";
import bgMusicCity from "@assets/Screen_Recording_20260106-023850_YouTube_1767634933495.mp3";
import bgMusicC16 from "@assets/Screen_Recording_20260106-044430_YouTube_(1)_1767642743472.mp3";

// Audio imports - Background Music
import audioAloneTonight from "@assets/Alone_Tonight_1767736641617.mp3";
import audioEpicAftermath from "@assets/Epic_Post_Apocalyptic_Music_-_Aftermath_1767734880441.mp3";
import audioHorrorChase from "@assets/Horror_Chase_Music_Torture_Chamber___Royalty_Free_Action_And_P_1767734880439.mp3";
import audioSigh from "@assets/Sigh_(Killing_Eve)_1767734880443.mp3";
import audioItsNotYou from "@assets/Its_Not_You,_Its_Me_(Killing_Eve)_1767736641609.mp3";
import audioRemember from "@assets/KaizanBlu_-_Remember_1767736641607.mp3";

// Audio imports - Sound Effects
import sfxHeartBeat from "@assets/Heart_Beat_[SOUND_EFFECT]_1767734880437.mp3";
import sfxMetalClang from "@assets/Metal_Clang_Sound_Effect_1767736641613.mp3";
import sfxCarDriving from "@assets/Car_Slow_Driving_Sound_Effect_1767736641611.mp3";

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
  audio?: string | "stop";
  sfx?: string;
  sfxVolume?: number;
  audioVolume?: number;
  marker?: string;
  hideCharacter?: boolean;
  isPuzzle?: boolean;
  puzzleAnswer?: string;
  effect?: "shake" | "chase" | "carShake";
  textOnly?: boolean;
  eyeEffect?: boolean;
  isDeadEnd?: boolean;
  deadEndTitle?: string;
  deadEndSubtitle?: string;
  centeredMonologue?: boolean;
  clickHint?: boolean;
  requireClick?: boolean;
  showMemo?: boolean;
  hideMemo?: boolean;
  redText?: boolean;
  blackScreen?: boolean;
  // Minigame properties
  isMinigameTitle?: boolean;
  isMinigameRules?: boolean;
  isMinigameChoice?: boolean;
  randomChoices?: boolean;
  gunEffect?: boolean;
  hideNormalTag?: boolean;
  shakeOnEnter?: boolean;
  centerCharacter?: boolean;
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
  color?: string;
}

interface Chapter {
  id: number;
  title: string;
  marker: string;
  index: number;
  locked: boolean;
}

export default function Home() {
  const [gameState, setGameState] = useState<SceneType>("start");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [dustParticles, setDustParticles] = useState<DustParticle[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<HTMLAudioElement | null>(null);
  const sparkleIdRef = useRef(0);
  const [hasSaveData, setHasSaveData] = useState(false);
  const [puzzleInput, setPuzzleInput] = useState("");
  const [shuffledChoices, setShuffledChoices] = useState<Choice[]>([]);
  const [showMemo, setShowMemo] = useState(false);
  const [maxReachedIndex, setMaxReachedIndex] = useState(0);

  // Check for save data and max reached index on mount
  useEffect(() => {
    const savedIndex = localStorage.getItem("game_save_index");
    if (savedIndex !== null) {
      setHasSaveData(true);
    }
    const maxIndex = localStorage.getItem("game_max_index");
    if (maxIndex !== null) {
      setMaxReachedIndex(parseInt(maxIndex));
    }
  }, []);

  // Update max reached index
  useEffect(() => {
    if (gameState === "story" && dialogueIndex > maxReachedIndex) {
      setMaxReachedIndex(dialogueIndex);
      localStorage.setItem("game_max_index", dialogueIndex.toString());
    }
  }, [dialogueIndex, gameState, maxReachedIndex]);

  // Initialize Dust Particles for Start Screen / Special Effects
  useEffect(() => {
    const count = 100; // Increased count for start screen
    const initialDust: DustParticle[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1, // Larger size
      speedX: (Math.random() - 0.5) * 0.1,
      speedY: (Math.random() - 0.5) * 0.1 + 0.05,
      opacity: Math.random() * 0.7 + 0.2, // More visible
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
    // CLIP 1 (0-4)
    { marker: "BEGIN", speaker: "파스닐", text: "요즘 ai가 발전해서 내가 할 일이 없네", background: bgClip1, character: "파스닐", isMonologue: true },
    { speaker: "파스닐", expression: "이메일을 확인한다", text: "...", background: bgClip1, character: "파스닐", isMonologue: true },
    { speaker: "파스닐", text: "초청 DJ 문의? 수상하긴 하지만 원체 부자들은 외진 곳을 좋아하니깐..", background: bgClip1, character: "파스닐", isMonologue: true },
    { speaker: "파스닐", text: "가 아니라 하필 나를?!", background: bgClip1, character: "파스닐", isMonologue: true },
    { speaker: "파스닐", expression: "통장장고가 눈에 스쳐지나간다.", text: "뭐 익명 파티인가 보지.", background: bgClip1, character: "파스닐", isMonologue: true, triggerTransition: true },
    
    // CLIP 2 (5-20)
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

    // 21-28 Dead End
    { speaker: "파스닐", text: "돈 많은 사람들은 이런 말 좋아하던데. 이런 데서 굳이 DJ까지 부를 필요는 없지 않아요?", background: bgClip2, isMonologue: true },
    { speaker: "하카", expression: "걸음을 멈춘다", text: "음.", background: bgClip2, character: "하카" },
    { speaker: "하카", expression: "천천히 고개를 돌려 파스닐을 본다", text: "그럼 필요 없는 사람을 부른 셈이네.", background: bgClip2, character: "하카" },
    { speaker: "파스닐", text: "농담이 안 통했다.", background: bgClip2, isMonologue: true },
    { speaker: "시스템", text: "나는 입을 다물었다.", isProgress: true, background: bgClip2 },
    { speaker: "하카", expression: "차 키를 던진다", text: "집에 가. 오늘 일은 없던 걸로 하자.", background: bgClip2, character: "하카" },
    { speaker: "파스닐", text: "…알겠습니다.", background: bgClip2, isMonologue: true },
    { speaker: "시스템", text: "[데드엔딩] 〈해고〉 아포칼립스는 오지 않았다. 하지만 나는, 이 이야기 안으로 들어가지도 못했다.", isProgress: true, background: bgClip2, onComplete: () => { setGameState("start"); setDialogueIndex(0); } },

    // 29-30 Normal
    { speaker: "파스닐", text: "웃어넘기는 게 제일 안전하다. 아무래도 이런 장소는 처음이라서요.", background: bgClip2, isMonologue: true },
    { speaker: "하카", expression: "별장 문을 열다 말고 웃는다", text: "금방 익숙해질 거야. 다들 그래.", background: bgClip2, character: "하카", jumpIndex: 34 },

    // 31-33
    { speaker: "파스닐", text: "사실… 분위기가 좀 독특해서요.", background: bgClip2, isMonologue: true },
    { speaker: "하카", expression: "별장 문을 열다 말고 웃는다", text: "금방 익숙해질 거야. 다들 그래.", background: bgClip2, character: "하카" },
    { speaker: "시스템", text: "나는 그 말이 위로인지, 그냥 흘려보낸 말인지 판단하지 못한 채 고개를 끄덕였다. 문이 열리자 서늘한 공기가 안쪽에서 흘러나왔다.", isProgress: true, background: bgClip2 },
    
    // 34-61 Arrival
    { speaker: "시스템", text: "멀리서 차 소리가 났다. 이번엔 두 사람의 기척이 거의 동시에 느껴졌다.", isProgress: true, background: bgClip2 },
    { speaker: "시스템", text: "(차가 멈추고, 문이 연달아 닫힌다)", isProgress: true, background: bgClip2 },
    { speaker: "하카", expression: "고개만 돌린다", text: "왔네.", background: bgClip2, character: "하카" },
    { speaker: "시스템", text: "차에서 먼저 내린 건 붉은 머리의 여자였다. 차분한 동작, 주변을 빠르게 훑는 시선.", isProgress: true, background: bgClip2 },
    { marker: "#C3_PRE", speaker: "렌쟈", text: "여기 맞지?", background: bgClip2, character: "렌쟈" },
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
    
    { speaker: "하카", expression: "손뼉을 한 번 친다", text: "자, 다 왔네. 일단 안으로 들어가자.", background: bgClip2, character: "하카", audio: "stop" },
    
    // #C3 - 거실 (62-89)
    { marker: "#C3", speaker: "시스템", text: "문이 닫히는 소리가 뒤에서 났다. 확실하게. 나는 장비 가방을 바닥에 내려놓고 자리를 잡는다.", background: bgLivingRoom, isProgress: true },
    { speaker: "하카", expression: "소파에 털썩 앉아 다리를 뻗는다", text: "아직 다 살아 있네. 일단.", background: bgLivingRoom, character: "하카" },
    { speaker: "엘", expression: "가방을 내려놓으며 담담하게", text: "여기까지 왔는데 안 괜찮을 확률이 더 낮지.", background: bgLivingRoom, character: "엘" },
    { speaker: "렌쟈", expression: "사람들 얼굴을 한 번씩 훑는다", text: "괜찮아 보여도 체크는 해야지.", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "란", expression: "바로 고개 숙여", text: "필요한 물품이나 불편한 점 있으면 말씀 주십시오.", background: bgLivingRoom, character: "란" },
    { speaker: "하카", expression: "입꼬리 올리며", text: "봐라. 이래서 란이 있지.", background: bgLivingRoom, character: "란" },
    { speaker: "란", expression: "조금 난처하게", text: "…습관입니다.", background: bgLivingRoom, character: "란" },
    { speaker: "하카", text: "하카는 더 말하지 않고 웃는다. 의미 없는 웃음은 아니다.", background: bgLivingRoom, character: "하카" },
    { speaker: "시스템", text: "나는 콘센트 위치를 다시 확인한다. 손이 바쁘면, 시선이 덜 튊다. 이 사람들, 말보다 표정이 더 빠르다.", background: bgLivingRoom, isProgress: true },
    { speaker: "렌쟈", expression: "하카 쪽 보며", text: "이번엔 얼마나 머무를 생각이야?", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "하카", text: "상황 봐서.", background: bgLivingRoom, character: "하카" },
    { speaker: "엘", expression: "즉답", text: "그 말은 오래 있다는 거네.", background: bgLivingRoom, character: "엘" },
    { speaker: "하카", expression: "태연하게", text: "눈치 빠르네.", background: bgLivingRoom, character: "하카" },
    { speaker: "렌쟈", expression: "짧게 숨 내쉬며", text: "그럼 생활 규칙부터 맞추자.", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "엘", expression: "고개 끄덕", text: "외출 최소화. 불필요한 소음 금지. 연락은 전부 공유.", background: bgLivingRoom, character: "엘" },
    { speaker: "하카", expression: "나 힐끗 보며", text: "우리 DJ는 예외지?", background: bgLivingRoom, character: "하카" },
    { speaker: "엘", expression: "시선만 던진다", text: "…상황 봐서.", background: bgLivingRoom, character: "엘" },
    { speaker: "파스닐", text: "(괜히 튀면 안 된다.)", background: bgLivingRoom, isMonologue: true },
    { speaker: "란", text: "데일 누님이 계셨다면 이런 건 이미 끝났을 텐데요.", background: bgLivingRoom, character: "란" },
    { speaker: "렌쟈", text: "맞아.", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "엘", text: "…난싫다.", background: bgLivingRoom, character: "엘" },
    { speaker: "하카", text: "하카는 말하지 않는다. 잔을 들어 탁자에 내려놓을 뿐.", background: bgLivingRoom, character: "하카" },
    { speaker: "하카", text: "없는 사람 얘기는 여기까지.", background: bgLivingRoom, character: "하카" },
    { speaker: "렌쟈", text: "피하는 거야?", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "하카", expression: "렌쟈와 시선을 맞춘다", text: "미루는 거지.", background: bgLivingRoom, character: "하카" },
    { speaker: "엘", text: "어차피 해야 할 얘기야.", background: bgLivingRoom, character: "엘" },
    { speaker: "하카", text: "알아.", background: bgLivingRoom, character: "하카" },
    { speaker: "시스템", text: "그걸로 끝. 더 묻지 않는다는 합의가 공기처럼 깔린다.", background: bgLivingRoom, isProgress: true },
    
    // #1 (90-106)
    { marker: "#1", speaker: "시스템", text: "나는 테스트 음악을 아주 작게 튼다. 공기만 살짝 흔들린다.", background: bgLivingRoom, isProgress: true, audio: bgMusic1 },
    { speaker: "하카", text: "이 정도면 귀 안 거슬려.", background: bgLivingRoom, character: "하카" },
    { speaker: "엘", expression: "나를 바라본다", text: "상황 오면 바로 끌 수 있지?", background: bgLivingRoom, character: "엘" },
    { speaker: "파스닐", text: "네. 즉시요.", background: bgLivingRoom, isMonologue: true },
    { speaker: "시스템", text: "엘은 더 묻지 않는다. 신뢰라기보단 확인이다.", background: bgLivingRoom, isProgress: true },
    { speaker: "렌쟈", expression: "부드럽게", text: "긴장 너무 안 해도 돼. 우린 소리 큰 사람만 아니면 괜찮아.", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "파스닐", text: "(문제는 소리가 아니라 사람인데.)", background: bgLivingRoom, isMonologue: true },
    { speaker: "하카", expression: "몸 일으키며", text: "오늘은 이쯤 쉬자.", background: bgLivingRoom, character: "하카" },
    { speaker: "엘", text: "교대는?", background: bgLivingRoom, character: "엘" },
    { speaker: "하카", text: "나랑 너.", background: bgLivingRoom, character: "하카" },
    { speaker: "렌쟈", expression: "자연스럽게", text: "그럼 난 다음.", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "란", expression: "즉각", text: "확인했습니다.", background: bgLivingRoom, character: "란" },
    { speaker: "시스템", text: "논의는 없다. 이건 즉석 팀이 아니다. 엘은 말없이 창 쪽에 서 있다가 조용히 문을 연다.", background: bgLivingRoom, isProgress: true },
    { speaker: "엘", text: "바람 좀 쐬고 올게.", background: bgLivingRoom, character: "엘" },
    { speaker: "렌쟈", text: "오빠 그러다가 데일 언니처럼 감기걸려", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "엘", text: "너도 와.", background: bgLivingRoom, character: "엘" },
    { speaker: "시스템", text: "나는 고개를 끄덕이고 엘을 따라간다.", background: bgLivingRoom, isProgress: true },
    
    // #C4 - 발코니 (107-122)
    { marker: "#C4", speaker: "시스템", text: "발코니. 문이 닫히자 실내의 소리가 뚝 끊겼다. 바람이 불어온다. 차갑지도, 따뜻하지도 않은 공기.", background: bgBalcony, isProgress: true, audio: bgMusicBalcony },
    { speaker: "엘", expression: "난간에 팔을 얹는다", text: "음악 하는 사람은 소리에 예민하지.", background: bgBalcony, character: "엘" },
    { speaker: "파스닐", text: "직업병 같은 거죠.", background: bgBalcony, isMonologue: true },
    { speaker: "엘", expression: "고개를 끄덕인다", text: "방금. 안 들렸어?", background: bgBalcony, character: "엘" },
    { speaker: "파스닐", text: "…뭐가요?", background: bgBalcony, isMonologue: true },
    { speaker: "엘", text: "모르겠으면 됐어.", background: bgBalcony, character: "엘" },
    { speaker: "시스템", text: "잠깐의 침묵. 근데 이 질문은, 확인처럼 들렸다.", background: bgBalcony, isProgress: true },
    { speaker: "시스템", text: "바람이 한 번 더 분다. 난간 아래로 숲이 어둡게 펼쳐져 있다. 발코니 아래에서 나뭇잎이 흔들린다. 규칙적인 바람 소리. …아닌데. 리듬이 어긋난다.", background: bgBalcony, isProgress: true },
    { speaker: "엘", text: "지금. 들리냐.", background: bgBalcony, character: "엘" },
    { speaker: "파스닐", text: "(이건… 사람이 걷는 소리가 아니다.)", background: bgBalcony, isMonologue: true },
    { speaker: "엘", text: "너도 느꼈네.", background: bgBalcony, character: "엘" },
    { speaker: "하카", expression: "안에서", text: "둘이 뭐해?", background: bgBalcony, character: "하카" },
    { speaker: "엘", expression: "짧게", text: "아무것도.", background: bgBalcony, character: "엘" },
    { speaker: "시스템", text: "하지만 아무것도 아닌 건 아니다. 이제, 편안한 시간은 끝났다.", background: bgBalcony, isProgress: true },
    { speaker: "엘", text: "차가 한 대도 안 다니네. 이 시간이면 돌아다닐 텐데...", background: bgBalcony, character: "엘" },
    { speaker: "시스템", text: "멀리서 연기처럼 피어오르는 무언가가 보인다. 그리고 바람이 방향을 바꾸자 희미한 비명이 들려온다. 너무 멀어서 확신할 수는 없다.", background: bgBalcony, isProgress: true },
    
    // #C5 - 거실 (123-138)
    { marker: "#C5", speaker: "시스템", text: "발코니 문을 열고 안으로 돌아온다. 거실에서는 렌쟈가 하카의 장난에 웃고 있고, 란은 조용히 커피를 내리고 있다.", background: bgLivingRoom, isProgress: true, audio: bgMusic1 },
    { speaker: "TV 앵커", text: "...오늘 오후, 고지나 제약 연구단지에서 원인 불명의 폭발 사고가 발생했습니다. 정확한 사고 원인은—", background: bgLivingRoom },
    { speaker: "하카", text: "고지나? 여기서 그렇게 안 먼데.", background: bgLivingRoom, character: "하카" },
    { speaker: "렌쟈", text: "거기... 군 시설 아니었어? 제약회사로 바뀐 거야?", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "엘", text: "실험실 하나 날아간 거 치고는 뉴스에서 너무 조심스럽게 말하네.", background: bgLivingRoom, character: "엘" },
    { speaker: "란", text: "고지나면 여기서 차로 한 시간 정도 거리죠. 바람 방향 생각하면 영향 있을 수 있어요.", background: bgLivingRoom, character: "란" },
    { speaker: "하카", text: "야, 그런 건 원래 도시에 먼저 간다. 우리는 산속이야. 안전한 척하는 장소 1위잖아?", background: bgLivingRoom, character: "하카" },
    { speaker: "시스템", text: "모두가 조용해진다. 짧은 침묵이 흐른다.", background: bgLivingRoom, isProgress: true, audio: "stop" },
    { speaker: "TV", text: "외출을 삼가시고— 가급적 실내에 머무르시길—", background: bgLivingRoom },
    { speaker: "렌쟈", text: "‘정확한 원인을 알 수 없다’고 했어.", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "시스템", text: "그때, 밖에서 소리가 난다. 둔탁한 마찰음. 무언가를 끌고 가는 소리.", background: bgLivingRoom, isProgress: true },
    { speaker: "란", text: "…밖에 뭐가 있습니다.", background: bgLivingRoom, character: "란" },
    { speaker: "엘", text: "보지 마.", background: bgLivingRoom, character: "엘" },
    { speaker: "란", text: "사람… 인 것 같습니다. 걷는 게 아닙니다.", background: bgLivingRoom, character: "란" },
    { speaker: "하카", text: "파스닐, 너 소리 잘 듣지.", background: bgLivingRoom, character: "하카" },
    { speaker: "란", text: "확인만 하겠습니다. 같이 가시죠.", background: bgLivingRoom, character: "란" },
    
    // #C6 - 숲근처 (139-156)
    { marker: "#C6", speaker: "시스템", text: "밤 공기가 무겁다. 풀잎이 젖어 있다. 소리가 가까워진다. 나는 숨을 죽인다. 귀가 먼저 반응한다. …발소리. 아니다. 발을 끄는 소리다.", background: bgNearForest, isProgress: true, audio: bgMusicBalcony },
    { speaker: "시스템", text: "앞서 걷는 란을 따라간다.", background: bgNearForest, isProgress: true },
    { speaker: "란", text: "저쪽입니다.", background: bgNearForest, character: "란" },
    { speaker: "시스템", text: "그때 나무 사이로 그게 보인다. 사람의 형태. 하지만— 고개가 너무 아래로 숙여져 있다. 팔이 흔들리지 않는다. 무릎이 꺾이지 않는다. 걷는 게 아니라, 떨어지는 걸 반복하는 느낌.", background: bgNearForest, isProgress: true },
    { speaker: "파스닐", text: "저건… 사람이 아니다.", background: bgNearForest, isMonologue: true },
    { speaker: "시스템", text: "그것이 고개를 든다. 눈이 너무 늦게 움직인다.", background: bgNearForest, isProgress: true },
    { speaker: "란", text: "…확인했습니다. 따라오세요.", background: bgNearForest, character: "란" },
    { speaker: "란", text: "지금은 돌아가야 합니다.", background: bgNearForest, character: "란", choices: [
      { text: "1. 혼자 더 확인하려 한다", targetIndex: 147 },
      { text: "2. 란을 믿고 바로 따른다", targetIndex: 152 }
    ]},

    // DEAD END 1 (147-151)
    { speaker: "시스템", text: "나는 멈춘다. 한 걸음만 더. 그 순간, 그것의 고개가 나를 정확히 향한다. 너무 정확해서— 도망칠 생각이 늦는다.", isProgress: true, background: bgNearForest },
    { speaker: "란", expression: "처음으로 목소리가 높아진다", text: "파스닐—!", background: bgNearForest, character: "란" },
    { speaker: "시스템", text: "잡아당기는 힘. 넘어짐. 이빨이 너무 가까이 있다.", isProgress: true, background: bgNearForest },
    { speaker: "시스템", text: "[데드엔딩] 혼자 확인하는 건 용기가 아니라 이탈이다.", isProgress: true, background: bgNearForest, onComplete: () => { setGameState("start"); setDialogueIndex(0); } },
    
    // NORMAL PROCEED (152-156)
    { speaker: "시스템", text: "나는 망설이지 않고 란의 뒤를 따른다. 지금은 판단을 나눌 때다.", isProgress: true, background: bgNearForest },
    { speaker: "시스템", text: "외부, 창고 근처. 밤. 공기엔 풀 냄새와 함께 어딘지 모르게 탁한 기운이 섞여 있다. 손전등이 어두운 숲길을 조심스럽게 비춘다. 나뭇잎 흔들리는 소리가 불규칙하게 울린다.", isProgress: true, background: bgNearForest },
    { speaker: "시스템", text: "란은 발소리를 줄이며 별장 옆 창고 쪽으로 향한다.", isProgress: true, background: bgNearForest },
    { speaker: "란", text: "바람 방향은 북동. 공기 중에 연소 냄새… 나무 타는 냄새가 아닌데..", background: bgNearForest, character: "란" },
    { speaker: "란", text: "여기일지도 몰라.", background: bgNearForest, character: "란" },
    
    // #C7 - 창고 (157-162)
    { marker: "#C7", speaker: "시스템", text: "끼익. 문이 작게 열리고, 먼지 낀 냄새가 확 풍긴다. 창고 안엔 오래된 캠핑 장비, 예비용 발전기, 부탄가스 박스 등이 정리돼 있다. 그러나 그중 한 박스가 미묘하게 어긋나 있다.", background: bgStorage, isProgress: true, audio: "stop" },
    { speaker: "란", text: "누군가 손 댄 흔적이… 우리 중 누군가가 이걸 손봤나? 오늘 누구도 창고엔 안 왔는데.", background: bgStorage, character: "란" },
    { speaker: "시스템", text: "박스를 열어보자 안에는 비상식량 몇 개가 빠져 있고, 안쪽엔 뭔가가 떨어져 있다. 군용 의료 마스크. 이미 포장을 뜯은 흔적이 있는, 낯선 브랜드.", background: bgStorage, isProgress: true },
    { speaker: "란", text: "...이건 별장에서 보관한 적 없는 물건이다.", background: bgStorage, character: "란" },
    { speaker: "시스템", text: "그때, 창고 외부에서 '탁', 무언가가 떨어지는 소리. 란과 나는 재빨리 몸을 낮추고 손전등을 끈다. 숨소리를 죽인다. 밖에선 바람이 흔드는 나뭇잎 소리와는 전혀 다른… 천천히 끌리는 발소리가 들려온다.", isProgress: true, background: bgStorage },
    { speaker: "란", text: "이건, 짐승이 아니네요. 걸음이… 너무 느려요.", background: bgStorage, character: "란" },
    
    // #C8 - 거실 (163-174)
    { marker: "#C8", speaker: "란", text: "돌아왔습니다.", background: bgLivingRoom, isProgress: true, audio: bgMusicCity },
    { speaker: "하카", text: "그래서.", background: bgLivingRoom, character: "하카" },
    { speaker: "엘", text: "봤어?", background: bgLivingRoom, character: "엘" },
    { speaker: "시스템", text: "란은 잠깐 말을 고른다. 평소보다 아주 조금 느리다.", background: bgLivingRoom, isProgress: true },
    { speaker: "란", text: "…정상적인 사람이 아닙니다. 복수입니다.", background: bgLivingRoom, character: "란" },
    { speaker: "하카", text: "몇이야. 이제 시작이네.", background: bgLivingRoom, character: "하카" },
    { speaker: "엘", text: "외출 중지. 재미로 보지 마.", background: bgLivingRoom, character: "엘" },
    { speaker: "렌쟈", text: "단독 행동 금지.", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "TV", text: "…현재 일부 지역에서 정체불명의 폭력 사태가—", background: bgLivingRoom },
    { speaker: "시스템", text: "엘이 리모컨을 들어 끈다. 순간의 정적.", background: bgLivingRoom, isProgress: true },
    { speaker: "파스닐", text: "이제 난 DJ가 아니다. 나는 귀를 연다. 밖은— 너무 조용하다.", background: bgLivingRoom, isMonologue: true },
    
    // #C9 - 거실 (175-188)
    { marker: "#C9", speaker: "시스템", text: "2일차 — 아침, 별장 거실. 아침이라고 부르기엔 공기가 너무 무겁다. 창밖은 흐리고, 안개가 아직 숲을 붙잡고 있다.", background: bgLivingRoom, isProgress: true },
    { speaker: "시스템", text: "엘은 식탁 위에 지도를 펼쳐 둔 채 서 있다. 하카는 머그컵을 들고 창가에 기대 있다. 란은 이미 장비를 정리해 두었다.", background: bgLivingRoom, isProgress: true },
    { speaker: "엘", text: "상황 정리한다. 밤새 접근 흔적 없음. 소리, 움직임, 전력 이상도 없어. 오늘부터 조를 나눈다. 혼자 움직이는 건 금지.", background: bgLivingRoom, character: "엘" },
    { speaker: "하카", text: "그래서 더 재수 없지. 아무 일도 없는 밤은 항상 뒤가 더럽거든.", background: bgLivingRoom, character: "하카" },
    { speaker: "엘", text: "파스닐. 너는 렌쟈랑 같이 식량, 물, 연료. 하루 단위로 정리해서 공유. 지금 제일 중요한 위치야. 팀 상태를 한눈에 볼 수 있어야 해.", background: bgLivingRoom, character: "엘" },
    { speaker: "렌쟈", text: "소비량 기준도 다시 짤게. 누가 뭘 얼마나 쓰는지 바로 보이게.", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "하카", text: "와— 완전 관리직이네. 책상 없어서 아쉽다.", background: bgLivingRoom, character: "하카" },
    { speaker: "파스닐", text: "전선보다 더 무서운 자리다.", background: bgLivingRoom, isMonologue: true },
    { speaker: "란", text: "탐사는 하루 두 번으로 나누는 게 좋겠습니다. 오전, 오후.", background: bgLivingRoom, character: "란" },
    { speaker: "엘", text: "동의. 오늘 오전은 내가 나갈거야. 나, 너, 파스닐.", background: bgLivingRoom, character: "엘" },
    { speaker: "렌쟈", text: "응. 나갈게.", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "시스템", text: "출발 전 — 현관. 엘은 무기를 점검한다. 렌쟈는 가방에 물과 간단한 식량을 넣는다.", isProgress: true, background: bgLivingRoom },
    { speaker: "렌쟈", text: "너 귀 제일 좋잖아. 앞에 서지 말고, 중간.", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "엘", text: "뒤는 내가 본다.", background: bgLivingRoom, character: "엘" },
    { speaker: "하카", text: "돌아오면 보고부터 해. 무용담 말고, 사실만.", background: bgLivingRoom, character: "하카" },
    
    // #C10 - 도시1 (189-198)
    { marker: "#C10", speaker: "시스템", text: "도심 진입. 숲을 빠져나오자 아스팔트가 드러난다. 도로는 도로였던 흔적만 남아 있다.", background: bgCity1, isProgress: true },
    { speaker: "렌쟈", text: "…와. 신호등은 반쯤 꺾여 있고 가로등은 전부 다른 각도로 서 있다.", background: bgCity1, character: "렌쟈" },
    { speaker: "엘", text: "폭발은 아니야.", background: bgCity1, character: "엘" },
    { speaker: "파스닐", text: "네. 밀린 흔적이에요.", background: bgCity1, isMonologue: true },
    { speaker: "시스템", text: "차들은 멈춘 채가 아니라 도망치다 멈춘 자세로 박혀 있다. 차체 옆면, 콘크리트 벽면, 셔터. 모두 같은 방향으로 긁혀 있다.", isProgress: true, background: bgCity1 },
    { speaker: "렌쟈", text: "…그렇다는건 한쪽으로만 도망쳤다는 거네.", background: bgCity1, character: "렌쟈" },
    { speaker: "시스템", text: "건물 안은 더 심하다. 유리문은 깨진 게 아니라 안에서 바깥으로 휘어 있다.", isProgress: true, background: bgCity1 },
    { speaker: "파스닐", text: "사람이 나가려다 멈춘 게 아니라 뭔가가 들어오려다 멈춘 것처럼.", background: bgCity1, isMonologue: true },
    { speaker: "렌쟈", text: "…여긴 오래 있으면 안 되겠다.", background: bgCity1, character: "렌쟈" },
    { speaker: "엘", text: "마트만 들른다.", background: bgCity1, character: "엘" },
    
    // #C11 - 마트 (199-207)
    { marker: "#C11", speaker: "시스템", text: "마트. 자동문은 열려 있다. 전기가 있어서가 아니라 부서져서. 안은 생각보다 조용하다. 선반은 많이 비어 있지만 완전히 털린 건 아니다.", background: bgMart, isProgress: true, audio: "stop" },
    { speaker: "엘", text: "필요한 것만. 다시 올 수 있어야 의미가 있어.", background: bgMart, character: "엘" },
    { speaker: "렌쟈", text: "통조림, 물, 건전지. 유통기한 긴 걸로. 의약품도 있으면 좋고.", background: bgMart, character: "렌쟈" },
    { speaker: "파스닐", text: "이 정도면 이틀 반.", background: bgMart, isMonologue: true },
    { speaker: "시스템", text: "그 순간— 멀리서 무언가 떨어지는 소리. 세 사람 모두 멈춘다. 듣는다. 발을 끄는 소리.", isProgress: true, background: bgMart },
    { speaker: "엘", text: "시간 됐다.", background: bgMart, character: "엘" },
    { speaker: "시스템", text: "마트를 나설 때 무심코 뒤를 보고말았다. 계산대 너머, 어둠 속에 사람 크기의 형체가 서 있다. 움직이지 않는다.", isProgress: true, background: bgMart },
    { speaker: "엘", text: "보지 마.", background: bgMart, character: "엘" },
    { speaker: "시스템", text: "셋은 뛰지 않고 빠르게 걷는다. 도심을 벗어날 때까지 아무도 말하지 않는다.", isProgress: true, background: bgMart },
    
    // #C12 - 거실 (208-239)
    { marker: "#C12", speaker: "하카", text: "표정이 그 답이네. 엘 너 얼굴 완전웃겨. 거울이 없는게 한이다. ", background: bgLivingRoom, character: "하카" },
    { speaker: "엘", text: "도심은 끝났어.", background: bgLivingRoom, character: "엘" },
    { speaker: "렌쟈", text: "마트는 아직 쓸 수 있어. 하지만 오래는 아니야.", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "란", text: "이미 ‘보는 것’들이 있다는거네요.", background: bgLivingRoom, character: "란" },
    { speaker: "시스템", text: "오후 — 별장. 현관문이 닫히는 소리가 아직 남아 있다. 란과 하카가 떠난 뒤 별장은 이상할 만큼 조용해졌다.", isProgress: true, background: bgLivingRoom },
    { speaker: "파스닐", text: "이제 남은 사람들만의 시간이다. 거실 테이블에 박스를 줄 세운다.", background: bgLivingRoom, isMonologue: true },
    { speaker: "렌쟈", text: "있잖아 파스닐, 너 이런 상황 익숙해?", background: bgLivingRoom, character: "렌쟈", choices: [
      { text: "1. “아니요. 음악 말곤 해본 게 없어요.”", targetIndex: 215 },
      { text: "2. “일이 꼬이는 건… 좀 겪어봤어요.”", targetIndex: 215 },
      { text: "3. “익숙해지고 싶진 않네요.”", targetIndex: 215 }
    ]},
    { speaker: "시스템", text: "렌쟈는 고개를 끄덕일 뿐이다. 렌쟈가 찻잔을 들고 온다. 세 잔. 렌쟈는 아무 말 없이 설탕을 내려놓는다.", isProgress: true, background: bgLivingRoom },
    { speaker: "엘", text: "괜히 과하게 나서지 마. 지금 위치가 딱 좋아. 여기선 ‘나중’이 너무 빨리 와.", background: bgLivingRoom, character: "엘" },
    { speaker: "파스닐", text: "익숙한 행동. 자주 있었던 일이다. 렌쟈는 내 쪽을 본다.", background: bgLivingRoom, isMonologue: true },
    { speaker: "렌쟈", text: "너는?", background: bgLivingRoom, character: "렌쟈", choices: [
      { text: "1. “조금만요.”", targetIndex: 219 },
      { text: "2. “괜찮아요.”", targetIndex: 219 },
      { text: "3. “상관없어요.”", targetIndex: 219 }
    ]},
    { speaker: "렌쟈", text: "취향은 나중에 알아도 되지.", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "엘", text: "여기선 ‘나중’이 너무 빨리 와.", background: bgLivingRoom, character: "엘" },
    { speaker: "렌쟈", text: "그래도 오는 건 오니까.", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "시스템", text: "멀리서 바람이 아니라 무언가 부딪히는 소리가 난다. 렌쟈의 손이 멈춘다. 엘은 바로 창에서 떨어진다.", isProgress: true, background: bgLivingRoom },
    { speaker: "엘", text: "…아직은.", background: bgLivingRoom, character: "엘" },
    { speaker: "파스닐", text: "아직이라는 말이 얼마나 남았다는 뜻일까. 렌쟈는 일부러 화제를 돌린다.", background: bgLivingRoom, isMonologue: true },
    { speaker: "렌쟈", text: "하카랑 란, 늦네.", background: bgLivingRoom, character: "렌쟈", choices: [
      { text: "1. “두 사람 조합이 특이하긴 해요.”", targetIndex: 226 },
      { text: "2. “란은 생각보다 침착해 보이던데요.”", targetIndex: 226 },
      { text: "3. “하카는… 늘 여유 있어 보이네요.”", targetIndex: 226 }
    ]},
    { speaker: "렌쟈", text: "그게 더 불안하지?", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "엘", text: "둘 다 자기 판단 믿는 타입이야. 걱정도, 신뢰도 같이 섞여 있다.", background: bgLivingRoom, character: "엘" },
    { speaker: "시스템", text: "정리된 오후. 물자는 정리됐고 사람들은 각자 자리에 있다. 별장은 잠깐 숨을 고르는 중이다.", isProgress: true, background: bgLivingRoom },
    { speaker: "파스닐", text: "나는 지금 이 팀의 중심도, 변두리도 아니다. 문득, DJ 부스를 설치할 공간이 보인다.", background: bgLivingRoom, isMonologue: true },
    { speaker: "시스템", text: "해가 기울 무렵, 현관 쪽에서 익숙한 소리가 난다. 엘이 먼저 고개를 든다.", isProgress: true, background: bgLivingRoom },
    { speaker: "엘", text: "왔다.", background: bgLivingRoom, character: "엘" },
    { speaker: "하카", text: "별일은 없어. 조용해. 주변 도로 몇 군데 막혔어. 차량 방치된 곳도 많고.", background: bgLivingRoom, character: "하카" },
    { speaker: "란", text: "사람은 보지 못했습니다.", background: bgLivingRoom, character: "란" },
    { speaker: "시스템", text: "해가 완전히 지기 전, 란은 혼자 바깥으로 나가 펜스 쪽을 다시 점검하고 있었다. (금속이 삐걱이는 소리) (둔탁한 충격음)", isProgress: true, background: bgLivingRoom },
    { speaker: "렌쟈", text: "란!", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "시스템", text: "란이 바닥에 주저앉아 있다. 렌쟈가 먼저 달려간다. 엘과 하카도 바로 뒤따른다.", isProgress: true, background: bgLivingRoom },
    { speaker: "엘", text: "움직이지 마. … 버티기 힘들겠네. 내일 아침, 소수로 움직이자. 그래.", background: bgLivingRoom, character: "엘" },
    { speaker: "란", text: "탈골은… 아닌 것 같습니다. 제가 조심했어야 했습니다.", background: bgLivingRoom, character: "란" },
    { speaker: "렌쟈", text: "붓는 속도가 빨라. 고정은 했어. 하지만 약이 부족해. 마트 뒤쪽에 작은 민간 병원 있었어. 재고 남아 있을지도. 나랑 엘오빠, 파스닐.", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "하카", text: "감염은 아닌거같고. 알긴하네. 내가 뭘.. 진통제도 거의 없지. 의약품이 필요해. 뭘 당연한걸. 렌쟈야 엘 오빠가 내일은 늦잠 좀 자고싶었대.", background: bgLivingRoom, character: "하카" },
    
    // #C13 - 병원 가는 길 (240-245)
    { marker: "#C13", speaker: "시스템", text: "3일차. 병원으로 가는 길. 차 문이 닫히는 소리가 아침 안개를 밀어낸다. 엘이 운전석에 앉아 시동을 건다.", background: bgNearForest, isProgress: true, audio: bgMusicBalcony },
    { speaker: "렌쟈", text: "아침부터 병원이라니. 세상 참 성실하게 망했네. 봤지. 나무, 안개, 또 나무. 어제랑 똑같아.", background: bgNearForest, character: "렌쟈" },
    { speaker: "엘", text: "입 다물고 주변 봐. 똑같다는 게 문제지. 하룻밤 새에 정리될 리 없지.", background: bgNearForest, character: "엘" },
    { speaker: "시스템", text: "나는 뒷좌석에서 가방 끈을 다시 조인다. 약, 붕대, 빈 통. ‘있으면 좋은 것’보다 ‘없으면 끝나는 것’ 위주다.", isProgress: true, background: bgNearForest },
    { speaker: "파스닐", text: "어제는 선택지였는데, 오늘은 일정이 됐구만..", background: bgNearForest, isMonologue: true },
    { speaker: "렌쟈", text: "…어제보다 차 더 는거같기도 하고. 정리라기엔 다들 너무 급했잖아. 여기,다시는 오면 안 될 곳이야.", background: bgNearForest, character: "렌쟈" },
    
    // #C14 - 병원 근처 (246-249)
    { marker: "#C14", speaker: "시스템", text: "도심 외곽 — 병원 근처. 병원 건물은 멀리서 보면 멀쩡하다. 가까이 가면 아니다. 유리창엔 테이프 자국, 출입문엔 밀린 흔적, 현관 앞엔 버리고 간 휠체어 하나.", background: bgNearHospital, isProgress: true },
    { speaker: "렌쟈", text: "와… 딱 ‘도망치다 만 병원’이잖아. 역시 걸어 들어가야 긴장 풀리지? 파스닐. 들리면 바로 말해. ‘괜찮을 것 같아요’ 이런 말 말고. 그 톤 좋아.", background: bgNearHospital, character: "렌쟈" },
    { speaker: "엘", text: "차 세운다. 여기서. 말 줄여. 들리기 전에 움직이면 그땐 내가 멈춘다.", background: bgNearHospital, character: "엘" },
    { speaker: "시스템", text: "차 문이 닫힌다. 세 사람은 자연스럽게 간격을 맞춘다. 엘 앞, 렌쟈 옆, 파스닐 반 박자 뒤.", isProgress: true, background: bgNearHospital },
    
    // #C15 - 병원 내부 (250-254)
    { marker: "#C15", speaker: "시스템", text: "병원 내부. 자동문은 열린 게 아니라 고정돼 있다. 안은 약 냄새보다 먼지 냄새가 먼저 온다. 렌쟈는 들어오자마자 표지판을 본다.", background: bgHospital, isProgress: true, audio: "stop" },
    { speaker: "렌쟈", text: "응급실, 약국, 처치실… 다 한 방향이네. 역시 현실적. 진통제, 소염제, 항생제… 아, 이건 란이 싫어하겠다. 사람 마음은 안 챙겨주네. 아쉽네. 초코우유는 없었는데. 하카오빠가 갖다달랬어. 이럴 때일수록 사소한 게 오래 남아.", background: bgHospital, character: "렌쟈" },
    { speaker: "엘", text: "약국 먼저. 다 챙겨. 몸이 먼저야. ‘버틴다’는 말 되게 듣기싫다. 봤어. 가방 닫아. 지금 그게 아쉬워?", background: bgHospital, character: "엘" },
    { speaker: "파스닐", text: "이 정도면 며칠은 버텨요. (선택지가 없는 소리다.)", background: bgHospital, isMonologue: true },
    { speaker: "시스템", text: "멀리서 무언가 끌리는 소리. 이번엔 확실하다. 렌쟈의 손이 멈춘다. 세 사람은 뛰지 않는다. 렌쟈는 나오면서 한 번 뒤를 본다.", isProgress: true, background: bgHospital },
    
    // #C16 - 데일 등장 (255-288)
    { marker: "#C16", speaker: "렌쟈", text: "“…어?”", background: bgC16, character: "렌쟈", hideCharacter: true, audio: bgMusicC16 },
    { speaker: "시스템", text: "침대 위 사람은 수척하다. 눈 밑은 검고, 이마엔 열로 번진 땀 자국.", background: bgC16, isProgress: true, hideCharacter: true },
    { speaker: "엘", text: "“…데일?? ”", background: bgC16, character: "엘", hideCharacter: true },
    { speaker: "파스닐", text: "아픈 사람의 얼굴인데 편히 아픈 얼굴은 아니다.", background: bgC16, isMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "데일은 눈을 뜬다. 느리다. 짜증부터 나온다.", background: bgC16, isProgress: true, hideCharacter: true },
    { speaker: "데일", text: "“…뭐야.”", background: bgC16, character: "데일", hideCharacter: true },
    { speaker: "렌쟈", text: "“우와 언니 살아 있었네?”", background: bgC16, character: "렌쟈", hideCharacter: true },
    { speaker: "데일", text: "“죽었으면 너희가 더 기뻤을까.”", background: bgC16, character: "데일", hideCharacter: true },
    { speaker: "렌쟈", text: "“와 성격 진짜.”", background: bgC16, character: "렌쟈", hideCharacter: true },
    { speaker: "데일", text: "“이틀 동안 혼자 살아보면 그래.”", background: bgC16, character: "데일", hideCharacter: true },
    { speaker: "엘", text: "“왜 여기 있는건데.”", background: bgC16, character: "엘", hideCharacter: true },
    { speaker: "데일", text: "“감기.”", background: bgC16, character: "데일", hideCharacter: true },
    { speaker: "엘", text: "“그건 아는데.”", background: bgC16, character: "엘", hideCharacter: true },
    { speaker: "데일", text: "“…왔더니 갑자기 밖이 저 모양이더라.”", background: bgC16, character: "데일", hideCharacter: true },
    { speaker: "렌쟈", text: "“그래서?”", background: bgC16, character: "렌쟈", hideCharacter: true },
    { speaker: "데일", text: "“문 잠기고, 사람들 뛰고, 의사 하나 쓰러지고.”", background: bgC16, character: "데일", hideCharacter: true },
    { speaker: "렌쟈", text: "“그 다음?”", background: bgC16, character: "렌쟈", hideCharacter: true },
    { speaker: "데일", text: "“그 다음은 내가 알아서.”", background: bgC16, character: "데일", hideCharacter: true },
    { speaker: "시스템", text: "말투는 퉁명한데 목소리는 갈라져 있다.", background: bgC16, isProgress: true, hideCharacter: true },
    { speaker: "파스닐", text: "강제로 버틴 사람이다. 선택지가 없었던 쪽.", background: bgC16, isMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "엘은 주변을 훑는다.", background: bgC16, isProgress: true, hideCharacter: true },
    { speaker: "엘", text: "“이틀 동안 혼자?”", background: bgC16, character: "엘", hideCharacter: true },
    { speaker: "데일", text: "“아니. 처음엔 몇 명 있었어.”", background: bgC16, character: "데일", hideCharacter: true },
    { speaker: "렌쟈", text: "“…처음엔.”", background: bgC16, character: "렌쟈", hideCharacter: true },
    { speaker: "데일", text: "“응. 처음엔.”", background: bgC16, character: "데일", hideCharacter: true },
    { speaker: "시스템", text: "렌쟈는 더 묻지 않는다. 표정만 굳는다.", background: bgC16, isProgress: true, hideCharacter: true },
    { speaker: "엘", text: "“진짜 누가 여기서 이틀을 버티긴 했네. 얼른 가자.”", background: bgC16, character: "엘", hideCharacter: true },
    { speaker: "데일", text: "“…어디로.”", background: bgC16, character: "데일", hideCharacter: true },
    { speaker: "렌쟈", text: "“별장.”", background: bgC16, character: "렌쟈", hideCharacter: true },
    { speaker: "데일", text: "“하카 있냐.”", background: bgC16, character: "데일", hideCharacter: true },
    { speaker: "렌쟈", text: "“응.”", background: bgC16, character: "렌쟈", hideCharacter: true },
    { speaker: "데일", text: "“…그럼 안가.”", background: bgC16, character: "데일", hideCharacter: true },
    { speaker: "렌쟈", text: "“와 선택 빠르네.”", background: bgC16, character: "렌쟈", hideCharacter: true },
    { speaker: "엘", text: "“어차피 선택 없어.”", background: bgC16, character: "엘", hideCharacter: true },

    // #C18 (289-305)
    { marker: "#C18", speaker: "시스템", text: "이동 준비. 렌쟈가 데일을 부축한다.", background: bgHospitalNew, isProgress: true },
    { speaker: "렌쟈", text: "“서?”", background: bgHospitalNew, character: "렌쟈" },
    { speaker: "데일", text: "“말은 서게 하지 마.”", background: bgHospitalNew, character: "데일" },
    { speaker: "렌쟈", text: "“어머나 언니. ”", background: bgHospitalNew, character: "렌쟈" },
    { speaker: "데일", text: "“농담 아니고 진짜 열 아직 있어.”", background: bgHospitalNew, character: "데일" },
    { speaker: "엘", text: "“말 줄여.”", background: bgHospitalNew, character: "엘" },
    { speaker: "데일", text: "“네, 거지 팀장님.”", background: bgHospitalNew, character: "데일" },
    { speaker: "엘", text: "“저거 열있는거 맞나 좀 봐줘.”", background: bgHospitalNew, character: "엘" },
    { speaker: "파스닐", text: "파스닐은 뒤를 맡는다.", background: bgHospitalNew, isMonologue: true },
    { speaker: "시스템", text: "병원 복도 — 철수. 걸음은 느리다. 데일의 숨이 거칠다.", background: bgHospitalNew, isProgress: true },
    { speaker: "렌쟈", text: "“언니, 이틀 동안 뭐 먹었어?”", background: bgHospitalNew, character: "렌쟈" },
    { speaker: "데일", text: "“수액, 자판기 물, 그리고 후회.”", background: bgHospitalNew, character: "데일" },
    { speaker: "렌쟈", text: "“후회는 칼로리 없는데.”", background: bgHospitalNew, character: "렌쟈" },
    { speaker: "데일", text: "“그래서 이렇게 마른 거야.”", background: bgHospitalNew, character: "데일" },
    { speaker: "엘", text: "“입은 멀쩡하네.”", background: bgHospitalNew, character: "엘" },
    { speaker: "데일", text: "“이게 살아 있는 증거지.”", background: bgHospitalNew, character: "데일" },
    { speaker: "파스닐", text: "이 사람은 살아남은 걸 미안해하지 않는다... 미안해 하는게 더 이상한가?", background: bgHospitalNew, isMonologue: true },

    // #C19 (306-320)
    { marker: "#C19", speaker: "시스템", text: "병원 밖. 차가 보이자 데일은 잠깐 멈춘다.", background: bgNearHospitalNew, isProgress: true },
    { speaker: "데일", text: "“…밖, 더 심해?”", background: bgNearHospitalNew, character: "데일" },
    { speaker: "엘", text: "“응.”", background: bgNearHospitalNew, character: "엘" },
    { speaker: "데일", text: "“…그럼 빨리 가자.”", background: bgNearHospitalNew, character: "데일" },
    { speaker: "렌쟈", text: "“와, 말 잘 듣네.”", background: bgNearHospitalNew, character: "렌쟈" },
    { speaker: "데일", text: "“여긴 싫거든.”", background: bgNearHospitalNew, character: "데일" },
    { speaker: "시스템", text: "차 문이 닫힌다. 엔진이 켜진다. 병원은 아무 말도 하지 않는다.", background: bgNearHospitalNew, isProgress: true },
    { speaker: "시스템", text: "하지만— 이 사람은 여기서 이틀을 살았다. 그리고 그 흔적은 말투에 그대로 남아 있다.", background: bgNearHospitalNew, isProgress: true },
    { speaker: "시스템", text: "문을 잠근다. 엔진이 다시 울린다.", background: bgNearHospitalNew, isProgress: true },
    { speaker: "파스닐", text: "약은 챙겼다. 하지만 이건 치료가 아니라 유예다.", background: bgNearHospitalNew, isMonologue: true },
    { speaker: "시스템", text: "렌쟈는 좌석에 몸을 기대며 말한다.", background: bgNearHospitalNew, isProgress: true },
    { speaker: "렌쟈", text: "“란한테 뭐라고 하지?”", background: bgNearHospitalNew, character: "렌쟈" },
    { speaker: "엘", text: "“사실만.”", background: bgNearHospitalNew, character: "엘" },
    { speaker: "렌쟈", text: "“그게 제일 아픈데.”", background: bgNearHospitalNew, character: "렌쟈" },
    { speaker: "엘", text: "“그래도 필요해.”", background: bgNearHospitalNew, character: "엘" },
    { speaker: "시스템", text: "차는 다시 숲으로 향한다. 병원은 뒤에서 아무 말도 하지 않는다.", background: bgNearHospitalNew, isProgress: true },

    // #C20 (321-360)
    { marker: "#C20", speaker: "시스템", text: "별장 문이 열리자, 안에 있던 공기가 잠깐 멈춘다. 엘이 먼저 들어오고, 그 뒤로 렌쟈가 누군가를 데리고 온다.", background: bgLivingRoomNew, isProgress: true },
    { speaker: "시스템", text: "고개를 들자마자 다들 동시에 알아본다.", background: bgLivingRoomNew, isProgress: true },
    { speaker: "란", text: "“…와. 이 누님이 살아있을 줄은 몰랐는데요.”", background: bgLivingRoomNew, character: "란" },
    { speaker: "하카", text: "“어. 진짜네. 데일이잖아.”", background: bgLivingRoomNew, character: "하카" },
    { speaker: "시스템", text: "데일은 신발도 제대로 벗지 않고 서 있다가, 피곤한 눈으로 한 바퀴 훑는다.", background: bgLivingRoomNew, isProgress: true },
    { speaker: "데일", text: "“하. 여기까지 와서 이 얼굴들을 또 보네.”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "하카", text: "“병원에서 나왔다며.”", background: bgLivingRoomNew, character: "하카" },
    { speaker: "데일", text: "“나왔다기보단… 이틀 동안 갇혀 있다가 기어 나온 거지.”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "란", text: "“누님… 괜찮으세요?”", background: bgLivingRoomNew, character: "란" },
    { speaker: "데일", text: "“괜찮아 보이면 병원에서 그 꼴이었겠어?”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "시스템", text: "란이 입 다문다. 불쌍하다. 렌쟈가 가볍게 손을 흔든다.", background: bgLivingRoomNew, isProgress: true },
    { speaker: "렌쟈", text: "“그래도 다행이다. 진짜 죽은 줄 알았거든.”", background: bgLivingRoomNew, character: "렌쟈" },
    { speaker: "데일", text: "“너는 그런 말 참 쉽게 하지.”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "렌쟈", text: "“응. 살아있는 사람 앞에서만.”", background: bgLivingRoomNew, character: "렌쟈" },
    { speaker: "하카", text: "“병원은 어땠어? 아직도 사람들 서로 물어뜯고 있어?”", background: bgLivingRoomNew, character: "하카" },
    { speaker: "데일", text: "“감염보다 인간이 더 끔찍하더라. 침대 하나 두고 싸우고, 약 숨기고. …딱 네가 좋아할 만한 환경이야.”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "하카", text: "“칭찬 고맙네. 늙을수록 병원을 가까이 하랬거든”", background: bgLivingRoomNew, character: "하카" },
    { speaker: "시스템", text: "그때, 한 명. 조금 떨어진 곳에 서 있던 파스닐을 데일이 이제야 본다.", background: bgLivingRoomNew, isProgress: true },
    { speaker: "데일", text: "“…근데 쟤는 뭐야.”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "파스닐", text: "“아, 저는—”", background: bgLivingRoomNew, isMonologue: true },
    { speaker: "엘", text: "“파스닐. 이번에 합류했어.”", background: bgLivingRoomNew, character: "엘" },
    { speaker: "하카", text: "“맞아. 우리 dj 지. 이제 총무라고 해드려야 하나?”", background: bgLivingRoomNew, character: "하카" },
    { speaker: "데일", text: "“새 사람?”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "엘", text: "“그래.”", background: bgLivingRoomNew, character: "엘" },
    { speaker: "데일", text: "“지금 이 상황에?”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "시스템", text: "나를 위아래로 훑는다. 무기, 손, 자세. 전부 본다.", background: bgLivingRoomNew, isProgress: true },
    { speaker: "데일", text: "“우와. 엄청 약해 보이네.”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "파스닐", text: "…그 말, 처음은 아니다.", background: bgLivingRoomNew, isMonologue: true },
    { speaker: "렌쟈", text: "“일은 잘해. 물자 정리도 꼼꼼하고.”", background: bgLivingRoomNew, character: "렌쟈" },
    { speaker: "데일", text: "“그게 여기서 생존이랑 직결돼?”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "엘", text: "“돼.”", background: bgLivingRoomNew, character: "엘" },
    { speaker: "시스템", text: "짧고 단호하다. 데일이 입을 다문다.", background: bgLivingRoomNew, isProgress: true },
    { speaker: "하카", text: "“뭐, 마음에 안 들면 나중에 정리하면 되잖아.”", background: bgLivingRoomNew, character: "하카" },
    { speaker: "데일", text: "“너 입에서 나오는 ‘정리’는 믿음이 안 가. 그나마 말은 제일 정상적이네.”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "엘", text: "“일단 쉬어. 내일 의약품 더 필요해.”", background: bgLivingRoomNew, character: "엘" },
    { speaker: "데일", text: "“나도 가.”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "란", text: "“누님, 아직 몸—”", background: bgLivingRoomNew, character: "란" },
    { speaker: "데일", text: "“내가 알아서 해. ”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "시스템", text: "불쌍하다. 렌쟈가 고개를 끄덕인다.", background: bgLivingRoomNew, isProgress: true },
    { speaker: "렌쟈", text: "“그래. 언니 어차피 조용히 살 날은 이미 지났잖아.”", background: bgLivingRoomNew, character: "렌쟈" },

    // New Scenes Start (361+)
    // D-series Start (361-386)
    { marker: "4일차", speaker: "시스템", text: "4일차. 별장 — 아침. 아침이라고 부르기엔 햇빛이 너무 얇다.", background: bgLivingRoomNew, isProgress: true },
    { speaker: "시스템", text: "부엌 쪽에서 냄비 뚜껑 닫히는 소리. 렌쟈다.", background: bgLivingRoomNew, isProgress: true },
    { speaker: "렌쟈", text: "“죽은 세상에서도 아침은 오네. 성실하다.”", background: bgLivingRoomNew, character: "렌쟈" },
    { speaker: "하카", text: "“세상은 안 성실해. 사람만 출근하지.”", background: bgLivingRoomNew, character: "하카" },
    { speaker: "데일", text: "“…나 약 냄새 맡기 싫은데.”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "렌쟈", text: "“그럼 열 내려가든가.”", background: bgLivingRoomNew, character: "렌쟈" },
    { speaker: "데일", text: "“사람 정서라는 게 있잖아.”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "렌쟈", text: "“그래서 죽을 뻔했잖아.”", background: bgLivingRoomNew, character: "렌쟈" },
    { speaker: "데일", text: "“…진짜 성격.”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "시스템", text: "란이 조심스럽게 다가온다. 어깨는 여전히 고정돼 있다.", background: bgLivingRoomNew, isProgress: true },
    { speaker: "란", text: "“누님, 열은 좀—”", background: bgLivingRoomNew, character: "란" },
    { speaker: "데일", text: "“괜찮아. 죽을 정도는 아니야.”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "하카", text: "“죽을 ‘정도’가 기준인 게 문제지.”", background: bgLivingRoomNew, character: "하카" },
    { speaker: "엘", text: "“오늘 나간다.”", background: bgLivingRoomNew, character: "엘" },
    { speaker: "렌쟈", text: "“또?”", background: bgLivingRoomNew, character: "렌쟈" },
    { speaker: "엘", text: "“약이 부족해.”", background: bgLivingRoomNew, character: "엘" },
    { speaker: "데일", text: "“어제도 약이었잖아.”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "엘", text: "“어제는 응급. 오늘은 유지.”", background: bgLivingRoomNew, character: "엘" },
    { speaker: "하카", text: "“유지 좋아하네. 이 팀이 제일 못하는 건데.”", background: bgLivingRoomNew, character: "하카" },
    { speaker: "시스템", text: "렌쟈가 웃는다.", background: bgLivingRoomNew, isProgress: true },
    { speaker: "렌쟈", text: "“그래도 해야지. 안 하면 더 빨리 망하잖아.”", background: bgLivingRoomNew, character: "렌쟈" },
    { speaker: "엘", text: "“파스닐.”", background: bgLivingRoomNew, character: "엘" },
    { speaker: "파스닐", text: "“네.”", background: bgLivingRoomNew, isMonologue: true },
    { speaker: "엘", text: "“오늘도 같이 간다.”", background: bgLivingRoomNew, character: "엘" },
    { speaker: "데일", text: "“잠깐.”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "엘", text: "“엘이 데일을 본다.”", background: bgLivingRoomNew, character: "엘" },
    { speaker: "데일", text: "“어제 본 바로는 쟤 아직도 후방 담당이 더 어울려.”", background: bgLivingRoomNew, character: "데일" },
    { speaker: "파스닐", text: "아침부터 평가다.", background: bgLivingRoomNew, isMonologue: true },
    { speaker: "렌쟈", text: "“언니, 어제 이 사람 없었으면 약 절반은 버렸어.”", background: bgLivingRoomNew, character: "렌쟈" },
    
    // #D1 (387)
    { marker: "#D1", speaker: "시스템", text: "이동 — 도로. 차 안은 조용하다. 이번엔 데일이 뒷좌석이다.", background: bgD1, isProgress: true, hideCharacter: true, audio: audioAloneTonight },
    { speaker: "데일", text: "“씨발.”", background: bgD1, character: "데일", hideCharacter: true },
    { speaker: "엘", text: "“뭐야. 씨발? 렌쟈 옆에 없다고 본색이 드러났나봐”", background: bgD1, character: "엘", hideCharacter: true },
    { speaker: "데일", text: "“하… 그래, 너 편하라고. 근데 차 안 공기 영 별로네.”", background: bgD1, character: "데일", hideCharacter: true },
    { speaker: "하카", text: "“이제 와서?”", background: bgD1, character: "하카", hideCharacter: true },
    { speaker: "엘", text: "“불만 있으면 처 걸어가.”", background: bgD1, character: "엘", hideCharacter: true },
    { speaker: "데일", text: "“아, 진짜.”", background: bgD1, character: "데일", hideCharacter: true },
    { speaker: "데일", text: "“병원보다 여긴 그래도 낫다.”", background: bgD1, character: "데일", hideCharacter: true },
    { speaker: "시스템", text: "잠깐의 정적.", background: bgD1, isProgress: true, hideCharacter: true },
    { speaker: "데일", text: "“근데.”", background: bgD1, character: "데일", hideCharacter: true },
    { speaker: "엘", text: "“말 짧게 해라.”", background: bgD1, character: "엘", hideCharacter: true },
    { speaker: "데일", text: "“쟤.”", background: bgD1, character: "데일", hideCharacter: true },
    { speaker: "시스템", text: "파스닐을 본다.", background: bgD1, isProgress: true, hideCharacter: true },
    { speaker: "데일", text: "“왜 여기 남아 있는 거야?”", background: bgD1, character: "데일", hideCharacter: true },
    { speaker: "파스닐", text: "“…”", background: bgD1, isMonologue: true, hideCharacter: true },
    { speaker: "파스닐", text: "“그야 하카님이-”", background: bgD1, isMonologue: true, hideCharacter: true },
    { speaker: "하카", text: "“뭐 폐건물보단 대리석이 나으니까 , 그치.”", background: bgD1, character: "하카", hideCharacter: true },
    { speaker: "데일", text: "“어줍짢은걸 가지고. 그래서 뭐?”", background: bgD1, character: "데일", hideCharacter: true },
    { speaker: "파스닐", text: "“어차피 멀리가지도 못하고 납치당할까봐요.”", background: bgD1, isMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "데일은 코웃음을 친다.", background: bgD1, isProgress: true, hideCharacter: true },
    { speaker: "데일", text: "“너 지금 납치된거야. 여기 정상적인 인간 하나 없거든, 심지어 착해보이는 란도.”", background: bgD1, character: "데일", hideCharacter: true },
    { speaker: "하카", text: "“렌쟈 가슴 보는 재미로 살 걸. ”", background: bgD1, character: "하카", hideCharacter: true },
    { speaker: "엘", text: "“너희같은 새끼들만 그런 생각 하는거야.”", background: bgD1, character: "엘", hideCharacter: true },
    { speaker: "엘", text: "“흘려 보내, 파스닐.”", background: bgD1, character: "엘", hideCharacter: true },
    { speaker: "파스닐", text: "“…네.”", background: bgD1, isMonologue: true, hideCharacter: true },
    { speaker: "데일", text: "“쟤 나름 즐기는 것 같아 보이는걸.”", background: bgD1, character: "데일", hideCharacter: true },
    { speaker: "하카", text: "“설마, 생긴게 세상 초식남이라 부른건데. ”", background: bgD1, character: "하카", hideCharacter: true },
    { speaker: "파스닐", text: "..;;”", background: bgD1, isMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "이 사람들, 말들이 험해지기 시작했다.", background: bgD1, isProgress: true, hideCharacter: true },

    // #D2
    { marker: "#D2", speaker: "시스템", text: "도심 외곽. 차 문이 닫히는 소리 뒤에 잠깐의 정적이 남는다.", background: bgD2, isProgress: true, audio: audioEpicAftermath },
    { speaker: "시스템", text: "나는 마지막으로 내린다. 늘 그렇듯 반 박자 늦게.", background: bgD2, isProgress: true },
    { speaker: "시스템", text: "엘 앞. 하카 옆. 데일은 조금 뒤, 그러나 시야는 넓다.", background: bgD2, isProgress: true },
    { speaker: "파스닐", text: "이 조합, 불편하다. 그래서 더 많은 게 보인다.", background: bgD2, isMonologue: true },
    { speaker: "시스템", text: "약국 문은 반쯤 열려 있다. 안은 비어 있다. 너무 비어 있다.", background: bgD2, isProgress: true },
    { speaker: "데일", text: "“…여긴 이미 한 번 털렸어.”", background: bgD2, character: "데일" },
    { speaker: "엘", text: "“언제.”", background: bgD2, character: "엘" },
    { speaker: "데일", text: "“어제 아니면 오늘 새벽.”", background: bgD2, character: "데일" },
    { speaker: "하카", text: "“근거는?”", background: bgD2, character: "하카" },
    { speaker: "데일", text: "“서랍 안 뒤집혔어. 급한 놈들이 아니야.”", background: bgD2, character: "데일" },
    { speaker: "시스템", text: "나는 바닥을 본다. 유리 조각이 없다. 약병도 깨지지 않았다.", background: bgD2, isProgress: true },
    { speaker: "파스닐", text: "“정리된 느낌이에요.”", background: bgD2, isMonologue: true },
    { speaker: "하카", text: "“어우, 싫다. 차라리 난장판이 낫지.”", background: bgD2, character: "하카" },
    { speaker: "엘", text: "“사람 있었단 뜻이다.”", background: bgD2, character: "엘" },
    { speaker: "데일", text: "“있었고, 살아서 나갔고.”", background: bgD2, character: "데일" },
    { speaker: "하카", text: "“…그리고 다시 안 돌아왔겠지.”", background: bgD2, character: "하카" },
    { speaker: "시스템", text: "데일은 말이 끝나자 약국 안쪽을 한 번 더 훑는다.", background: bgD2, isProgress: true },
    { speaker: "데일", text: "“여기서 머문 시간 짧아.”", background: bgD2, character: "데일" },
    { speaker: "엘", text: "“왜.”", background: bgD2, character: "엘" },
    { speaker: "데일", text: "“필요한 것만 챙겼거든. 망설임 없어.”", background: bgD2, character: "데일" },
    { speaker: "파스닐", text: "병원에서 살아남은 사람의 시선이다. 고르지 않는다. 결정한다.", background: bgD2, isMonologue: true },
    { speaker: "하카", text: "“이 동네에 생각보다 정상인 많네.”", background: bgD2, character: "하카" },
    { speaker: "데일", text: "“끝까지 남은 쪽이 정상이겠냐?”", background: bgD2, character: "데일" },
    { speaker: "엘", text: "“더 들어간다.”", background: bgD2, character: "엘" },

    // #D3
    { marker: "#D3", speaker: "시스템", text: "건물 내부. 발소리가 이상하게 크게 울린다.", background: bgD3, isProgress: true },
    { speaker: "시스템", text: "나는 자동으로 소리를 센다. 하카는 선반을 툭툭 건드리고, 엘은 통로 끝을 본다. 데일은 냉장고 쪽.", background: bgD3, isProgress: true },
    { speaker: "엘", text: "“비어 있나.”", background: bgD3, character: "엘" },
    { speaker: "데일", text: "“응. 근데 털린 흔적은 없어. 든게 없거든”", background: bgD3, character: "데일" },
    { speaker: "하카", text: "“너 머리처럼.”", background: bgD3, character: "하카" },
    { speaker: "파스닐", text: "“풉”", background: bgD3, isMonologue: true },
    { speaker: "시스템", text: "순간 정적이 흐른다.", background: bgD3, isProgress: true },
    { speaker: "파스닐", text: "“풉....푸..푸.푸. 풉.. 갑자기 머릿속에 비트가 떠올라서요.”", background: bgD3, isMonologue: true },
    { speaker: "하카", text: "“뭘 좀 아는구만?”", background: bgD3, character: "하카" },
    { speaker: "데일", text: "“너무 정중해서 죽고싶다. 저걸 ceo고 dj라고 두냐? ”", background: bgD3, character: "데일" },
    { speaker: "엘", text: "“이제 둘다 아니긴해.”", background: bgD3, character: "엘" },
    { speaker: "데일", text: "“혼자면 눈치 볼 필요 없겠네. 응? 하카. ”", background: bgD3, character: "데일" },
    { speaker: "하카", text: "“쩝…집단이 제일 귀찮지.”", background: bgD3, character: "하카" },
    { speaker: "엘", text: "“나간다.”", background: bgD3, character: "엘" },
    { speaker: "하카", text: "“엥 오빠, 벌써?”", background: bgD3, character: "하카" },
    { speaker: "엘", text: "“얻을 게 없다.”", background: bgD3, character: "엘" },
    { speaker: "엘", text: "“그리고 닥쳐.”", background: bgD3, character: "엘" },
    { speaker: "시스템", text: "데일은 고개를 끄덕인다. 이상할 정도로 말이 없다.", background: bgD3, isProgress: true },
    { speaker: "파스닐", text: "이 사람, 말 줄이면 위험하다.", background: bgD3, isMonologue: true },

    // #D4
    { marker: "#D4", speaker: "시스템", text: "이동 — 골목. 골목이 이어진다.", background: bgD3, isProgress: true },
    { speaker: "시스템", text: "나는 뒤를 한 번 본다. 아무도 없다. 아직은.", background: bgD3, isProgress: true },
    { speaker: "파스닐", text: "“…소리 들려요.”", background: bgD3, isMonologue: true },
    { speaker: "엘", text: "“어디서.”", background: bgD3, character: "엘" },
    { speaker: "파스닐", text: "“왼쪽, 11시. 멀리서.”", background: bgD3, isMonologue: true },
    { speaker: "하카", text: "“구체적이네.”", background: bgD3, character: "하카" },
    { speaker: "데일", text: "“사람이야?”", background: bgD3, character: "데일" },
    { speaker: "파스닐", text: "“…사람 같은데요. ”", background: bgD3, isMonologue: true },
    { speaker: "시스템", text: "데일이 바로 멈춘다.", background: bgD3, isProgress: true },
    { speaker: "데일", text: "“‘같은’은 빼.”", background: bgD3, character: "데일" },
    { speaker: "하카", text: "“우리 언니 예민.”", background: bgD3, character: "하카" },
    { speaker: "데일", text: "“꺼져.”", background: bgD3, character: "데일" },
    { speaker: "엘", text: "“야야. 확인만 한다.”", background: bgD3, character: "엘" },
    { speaker: "하카", text: "“또 확인.”", background: bgD3, character: "하카" },
    { speaker: "데일", text: "“가까이 안 가.”", background: bgD3, character: "데일" },
    { speaker: "엘", text: "“알아.”", background: bgD3, character: "엘" },
    { speaker: "파스닐", text: "엘은 항상 짧게 말한다. 그래서 더 신뢰받는다.", background: bgD3, isMonologue: true },
    { speaker: "시스템", text: "골목 끝. 사람 그림자 하나. 비틀린다. 멈춘다.", background: bgD3, isProgress: true },
    { speaker: "데일", text: "“…아.”", background: bgD3, character: "데일" },
    { speaker: "하카", text: "“와.”", background: bgD3, character: "하카" },
    { speaker: "엘", text: "“후퇴.”", background: bgD3, character: "엘" },
    { speaker: "데일", text: "“응.”", background: bgD3, character: "데일" },
    { speaker: "시스템", text: "말이 빠르다. 판단도 빠르다. 우리는 뛰지 않는다. 그게 이 팀의 규칙이다.", background: bgD3, isProgress: true },
    { speaker: "파스닐", text: "도망이 아니라 철수. 이 차이를 아는 사람들이 모였다.", background: bgD3, isMonologue: true },
    { speaker: "파스닐", text: "나는 이 팀에 걸맞는 사람일까. 차갑게 들끓는 이 분위기상 하마터면 상사앞에서 욕할뻔했다.", background: bgD3, isMonologue: true },
    { speaker: "파스닐", text: "저런게 더있으면 어쩌지.", background: bgD3, isMonologue: true },


    // 도심 외곽 — 분기점 (텍스트파일 399~479)
    { marker: "#D5_분기점", speaker: "시스템", text: "도심 외곽 — 분기점. 건물이 갈라지는 교차로.", background: bgD5, isProgress: true },
    { speaker: "시스템", text: "왼쪽은 낮은 상가—유리 많고, 시야 좋음. 오른쪽은 사무실—복도 길고, 어둡다.", background: bgD5, isProgress: true },
    { speaker: "시스템", text: "엘이 지도를 접는다.", background: bgD5, isProgress: true },
    { speaker: "엘", text: "\"여기서 나눈다.\"", background: bgD5, character: "엘" },
    { speaker: "하카", text: "\"드디어.\"", background: bgD5, character: "하카" },
    { speaker: "데일", text: "\"누가 어디.\"", background: bgD5, character: "데일" },
    { speaker: "엘", text: "\"하카, 혼자 오른쪽.\"", background: bgD5, character: "엘" },
    { speaker: "하카", text: "\"역시. 나만 위험한 데네ㅜㅜ\"", background: bgD5, character: "하카" },
    { speaker: "엘", text: "\"익숙하잖아. 깊고. 어둡고.\"", background: bgD5, character: "엘" },
    { speaker: "하카", text: "\"응. 너무 ㅎ. \"", background: bgD5, character: "하카" },
    { speaker: "시스템", text: "엘은 나를 본다.", background: bgD5, isProgress: true },
    { speaker: "엘", text: "\"파스닐.\"", background: bgD5, character: "엘" },
    { speaker: "시스템", text: "나는 짧게 숨을 들이킨다.", background: bgD5, isProgress: true },
    { speaker: "파스닐", text: "\"네.\"", background: bgD5, isMonologue: true },
    { speaker: "엘", text: "\"선택해.\"", background: bgD5, character: "엘" },
    { 
      speaker: "엘", 
      text: "\"어느 쪽이든, 내가 책임진다. 하카랑 갈생각은 하지도 말고\"", 
      background: bgD5, 
      character: "엘",
      choices: [
        { text: "1. 하카와 간다", targetIndex: 528 },
        { text: "2. 데일과 간다", targetIndex: 528 },
        { text: "3. 엘과 간다", targetIndex: 528 }
      ]
    },
    // 선택 후 통합 루트
    { speaker: "데일", text: "\"…듣기 싫은 말.\"", background: bgD5, character: "데일" },
    { speaker: "하카", text: "\"아, 또 시작이네. 엘데일. 그리고 파스닐\"", background: bgD5, character: "하카" },
    { speaker: "시스템", text: "결국 엘과 데일은 같은 방향으로 움직인다. 나는 그 사이에 낀다.", background: bgD5, isProgress: true },
    { speaker: "시스템", text: "하카는 혼자 오른쪽으로 사라진다.", background: bgD5, isProgress: true },
    { speaker: "하카", text: "\"살아있으면 보자. 아니면—뭐, 각자 운명이지.\"", background: bgD5, character: "하카" },
    { speaker: "엘", text: "\"쓸데없는 말 마.\"", background: bgD5, character: "엘" },
    { speaker: "하카", text: "\"그게 내 취미야.\"", background: bgD5, character: "하카" },

    // #d5 이동 — 상가 내부 (텍스트파일 483~568)
    { marker: "#d5", speaker: "시스템", text: "이동 — 상가 내부. 유리가 깨진 소리 하나에 데일이 바로 날카로워진다.", background: bgD5_New, isProgress: true },
    { speaker: "데일", text: "\"고양이가 발도 제대로 못딛냐?\"", background: bgD5_New, character: "데일" },
    { speaker: "엘", text: "\"개다.\"", background: bgD5_New, character: "엘" },
    { speaker: "엘", text: "\"불만이면 앞서 가.\"", background: bgD5_New, character: "엘" },
    { speaker: "데일", text: "\"네가 앞에서 길 막잖아.\"", background: bgD5_New, character: "데일" },
    { speaker: "엘", text: "\"그럼 네가 앞서.\"", background: bgD5_New, character: "엘" },
    { speaker: "데일", text: "\"싫어.\"", background: bgD5_New, character: "데일" },
    { speaker: "엘", text: "\"그럼 따라와.\"", background: bgD5_New, character: "엘" },
    { speaker: "데일", text: "\"명령하지 마.\"", background: bgD5_New, character: "데일" },
    { speaker: "파스닐", text: "아, 이 온도. 터지기 직전이다.", background: bgD5_New, isMonologue: true },
    { speaker: "엘", text: "\"데일, 여기선 내 판단이 기준이야.\"", background: bgD5_New, character: "엘" },
    { speaker: "엘", text: "\"쓸데없이 에너지낭비 하지 말자고.\"", background: bgD5_New, character: "엘" },
    { speaker: "데일", text: "\"그래서 사람들이 죽지.\"", background: bgD5_New, character: "데일" },
    { speaker: "시스템", text: "공기가 뚝 끊긴다.", background: bgD5_New, isProgress: true },
    { speaker: "엘", text: "\"…뭐라고.\"", background: bgD5_New, character: "엘" },
    { speaker: "데일", text: "\"못 들었어?\"", background: bgD5_New, character: "데일" },
    { speaker: "엘", text: "\"다시 말해.\"", background: bgD5_New, character: "엘" },
    { speaker: "데일", text: "\"네 방식 때문에 사람들이 선택권이 없어져.\"", background: bgD5_New, character: "데일" },
    { speaker: "데일", text: "\"왜 그니까 결국 혼자 차원에서 살아남은거잖아. 그리고 나머지 영악한 놈들만.\"", background: bgD5_New, character: "데일" },
    { speaker: "엘", text: "\"그건 다른 상황이고. 지금 선택하다 죽는 것보단 낫다 생각해.\"", background: bgD5_New, character: "엘" },
    { speaker: "데일", text: "\"네가 정한 선택은 늘 너한테만 안전해.\"", background: bgD5_New, character: "데일" },
    { speaker: "시스템", text: "정적. 나는 숨을 낮춘다.", background: bgD5_New, isProgress: true },
    { speaker: "파스닐", text: "이건 말싸움이 아니라 기억 싸움이다.", background: bgD5_New, isMonologue: true },
    { speaker: "엘", text: "\"지금 옛날 얘기할 시간 없어. 벌써 6년 전이야.\"", background: bgD5_New, character: "엘" },
    { speaker: "데일", text: "\"뭐 매일 매일이 기억상실증 이신가봐.\"", background: bgD5_New, character: "데일" },
    { speaker: "엘", text: "\"그래. 덕분에 누구랑 다르게 정상으로 남아있다.\"", background: bgD5_New, character: "엘" },
    { speaker: "시스템", text: "데일의 입꼬리가 비틀린다.", background: bgD5_New, isProgress: true },
    { speaker: "데일", text: "\"…역시 재수 없어. 실밥.\"", background: bgD5_New, character: "데일" },

    // 잠깐의 정지 — 데일 이탈 (텍스트파일 573~672)
    { speaker: "시스템", text: "엘이 앞을 본다. 나는 뒤를 본다.", background: bgD5_New, isProgress: true },
    { speaker: "시스템", text: "그리고— 데일이 조용히 방향을 바꾼다. 아무 말 없이. 너무 자연스럽게.", background: bgD5_New, isProgress: true },
    { speaker: "파스닐", text: "뭘까. 엘 형이 그렇게 싫은걸까.", background: bgD5_New, isMonologue: true },
    { speaker: "시스템", text: "걷는 속도가 미묘하게 다르다. 엘은 앞으로, 데일은 옆으로 빠질 각을 계속 본다.", background: bgD5_New, isProgress: true },
    { speaker: "시스템", text: "나는 안경을 바로잡느라 확신하지 못했다. 다만..", background: bgD5_New, isProgress: true },
    { speaker: "데일", text: "\"…이쪽은 비었네.\"", background: bgD5_New, character: "데일" },
    { speaker: "엘", text: "\"확인 끝난 방향이야.\"", background: bgD5_New, character: "엘" },
    { speaker: "데일", text: "\"확인 '당시엔'.\"", background: bgD5_New, character: "데일" },
    { speaker: "엘", text: "\"지금도.\"", background: bgD5_New, character: "엘" },
    { speaker: "시스템", text: "데일이 웃는다. 입꼬리만.", background: bgD5_New, isProgress: true },
    { speaker: "데일", text: "\"너는 늘 그렇게 말해. 지금은 지금이고, 그때는 그때라고.\"", background: bgD5_New, character: "데일" },
    { speaker: "엘", text: "\"지금 판단 흐리고 싶은 거면 집에 가.\"", background: bgD5_New, character: "엘" },
    { speaker: "데일", text: "\"…명령은 여전하네.\"", background: bgD5_New, character: "데일" },
    { speaker: "시스템", text: "데일이 걸음을 멈춘다.", background: bgD5_New, isProgress: true },
    { speaker: "엘", text: "\"데일.\"", background: bgD5_New, character: "엘" },
    { speaker: "데일", text: "\"잠깐이면 돼.\"", background: bgD5_New, character: "데일" },
    { speaker: "엘", text: "\"혼자 움직이지 말랬지.\"", background: bgD5_New, character: "엘" },
    { speaker: "데일", text: "\"그래서 몰래 가는 거야.\"", background: bgD5_New, character: "데일" },
    { speaker: "시스템", text: "그 말과 동시에 데일은 골목 쪽으로 방향을 튼다.", background: bgD5_New, isProgress: true },
    { speaker: "엘", text: "\"데일!\"", background: bgD5_New, character: "엘" },
    { speaker: "데일", text: "\"금방 돌아올게. 이번엔 진짜로.\"", background: bgD5_New, character: "데일" },
    { speaker: "시스템", text: "엘은 이를 악문다. 그리고 나를 본다.", background: bgD5_New, isProgress: true },
    { speaker: "엘", text: "\"파스닐.\"", background: bgD5_New, character: "엘" },
    { speaker: "파스닐", text: "\"…네?\"", background: bgD5_New, isMonologue: true },
    { speaker: "파스닐", text: "시야가 흐릿하다.", background: bgD5_New, isMonologue: true },
    { speaker: "엘", text: "\"너는—\"", background: bgD5_New, character: "엘" },
    { speaker: "시스템", text: "그 순간, 데일의 발소리가 건물 안으로 사라진다.", background: bgD5_New, isProgress: true },
    { speaker: "엘", text: "\"씨발.\"", background: bgD5_New, character: "엘" },
    { speaker: "시스템", text: "엘은 바로 따라가려다 걸음을 멈춘다.", background: bgD5_New, isProgress: true },
    { speaker: "엘", text: "\"….\"", background: bgD5_New, character: "엘" },
    { speaker: "시스템", text: "엘의 시선이 나에게 온다.", background: bgD5_New, isProgress: true },
    { speaker: "엘", text: "\"너는 정말 저런 여자를 믿을 수 있어?\"", background: bgD5_New, character: "엘" },

    // 선택지 — 데일 이탈
    { speaker: "파스닐", text: "지금 선택은 '누구 편이냐'가 아니라 '누구를 믿느냐'다.", background: bgD5_New, isMonologue: true },
    { 
      speaker: "시스템", 
      text: "선택하라.", 
      background: bgD5_New, 
      isProgress: true,
      choices: [
        { text: "1. 데일을 따라간다", targetIndex: 592 },
        { text: "2. 엘의 말을 따른다", targetIndex: 611 }
      ]
    },

    // 선택지 1 — 데일을 따라간다 (Dead Ending) #D6
    { marker: "#D6_Dead", speaker: "파스닐", text: "\"제가 따라갈게요.\"", background: bgD5_New, isMonologue: true },
    { speaker: "엘", text: "\"안 돼.\"", background: bgD5_New, character: "엘" },
    { speaker: "시스템", text: "나는 이미 방향을 틀고 있다.", background: bgD5_New, isProgress: true },
    { speaker: "파스닐", text: "\"혼자 두는 게 더 위험해 보여서요.\"", background: bgD5_New, isMonologue: true },
    { speaker: "엘", text: "\"…돌아와.\"", background: bgD5_New, character: "엘" },
    { speaker: "시스템", text: "하지만 데일이 사라진 쪽은 이미 나를 끌고 간다.", background: bgD5_New, isProgress: true },
    { speaker: "시스템", text: "나는 엘의 시야에서 벗어난다.", background: bgD5_New, isProgress: true },
    { speaker: "시스템", text: "건물 안은 생각보다 깊다. 소리가 흡수된다. 발소리조차.", background: bgD6, isProgress: true },
    { speaker: "파스닐", text: "\"데일 씨?\"", background: bgD6, isMonologue: true },
    { speaker: "시스템", text: "대답이 없다.", background: bgD6, isProgress: true },
    { speaker: "시스템", text: "대신— 뒤에서 숨소리. 사람 같다. 사람처럼 늦다.", background: bgD6, isProgress: true },
    { speaker: "시스템", text: "돌아보는 순간 너무 가깝다.", background: bgD6, isProgress: true },
    { speaker: "시스템", text: "손이 닿는다. 아니, 손 모양의 무언가가.", background: bgD6, isProgress: true },
    { speaker: "파스닐", text: "아, 이건—", background: bgD6, isMonologue: true },
    { speaker: "시스템", text: "소리가 터진다. 비명인지, 뼈 부러지는 소린지 구분이 안 된다.", background: bgD6, isProgress: true, effect: "shake" },
    { marker: "DEAD_END", speaker: "시스템", text: "[데드엔딩] 〈이탈〉", background: "black", isProgress: true },
    { speaker: "시스템", text: "엘은 선택을 통제하려 했다. 데일은 선택을 버렸다.", background: "black", isProgress: true },
    { speaker: "시스템", text: "나는 그 사이에서 혼자 판단했다.", background: "black", isProgress: true },
    { speaker: "시스템", text: "그리고 이 세계는 혼자 판단하는 사람에게 아무것도 남겨주지 않는다.", background: "black", isProgress: true, onComplete: () => { setGameState("start"); setDialogueIndex(0); } },

    // 선택지 2 — 엘의 말을 따른다 (정상 진행) #D7
    { marker: "#D7", speaker: "파스닐", text: "\"…여기 있을게요.\"", background: bgD5_New, isMonologue: true, audio: "stop" },
    { speaker: "시스템", text: "엘은 짧게 고개를 끄덕인다.", background: bgD5_New, isProgress: true },
    { speaker: "파스닐", text: "이 세계에선 둘 다 정답이 아닐 수 있다.", background: bgD5_New, isMonologue: true },
    { speaker: "엘", text: "\"파스닐.\"", background: bgD5_New, character: "엘" },
    { speaker: "파스닐", text: "\"네?\"", background: bgD5_New, isMonologue: true },
    { speaker: "엘", text: "\"젠장.\"", background: bgD5_New, character: "엘" },
    { speaker: "시스템", text: "엘이 나를 밀어 넣듯 세운다.", background: bgD5_New, isProgress: true },
    { speaker: "엘", text: "\"여기서 기다려.\"", background: bgD5_New, character: "엘" },
    { speaker: "파스닐", text: "\"같이—\"", background: bgD5_New, isMonologue: true },
    { speaker: "엘", text: "\"아니.\"", background: bgD5_New, character: "엘" },
    { speaker: "시스템", text: "짧고 단호하다.", background: bgD5_New, isProgress: true },
    { speaker: "엘", text: "\"문 잠그고, 소리 내지 마.\"", background: bgD5_New, character: "엘" },
    { speaker: "파스닐", text: "\"…알겠어요.\"", background: bgD5_New, isMonologue: true },
    { speaker: "시스템", text: "엘은 이미 돌아서 있다.", background: bgD5_New, isProgress: true },
    { speaker: "파스닐", text: "지금 나가면, 난 쓰레기다.", background: bgD5_New, isMonologue: true },
    { speaker: "시스템", text: "문이 닫힌다.", background: bgD5_New, isProgress: true },

    // #D8 - 텍스트 온리 (배경/캐릭터 없음)
    { marker: "#D8", speaker: "시스템", text: "혼자 남는다.", background: "black", isProgress: true, audio: audioHorrorChase, textOnly: true },
    { speaker: "시스템", text: "멀리서 금속 부딪히는 소리.", background: "black", isProgress: true, textOnly: true, sfx: sfxMetalClang, sfxVolume: 0.8 },
    { speaker: "시스템", text: "그리고— 사람의 비명. 짧다. 너무 짧다.", background: "black", isProgress: true, effect: "shake", textOnly: true },
    { speaker: "파스닐", text: "\"엘…?\"", background: "black", isMonologue: true, textOnly: true },
    { speaker: "시스템", text: "그 다음은 소리들이 겹친다. 발. 숨. 부딪힘.", background: "black", isProgress: true, textOnly: true },
    { speaker: "시스템", text: "그리고— 엘의 신음.", background: "black", isProgress: true, textOnly: true },
    { speaker: "파스닐", text: "나가도될까? 나간다면..", background: "black", isMonologue: true, textOnly: true },

    // #D9
    { marker: "#D9", speaker: "시스템", text: "문이 다시 열린 건 하카였다.", background: bgD5_New, isProgress: true },
    { speaker: "하카", text: "\"야.\"", background: bgD5_New, character: "하카" },
    { speaker: "파스닐", text: "\"엘이—\"", background: bgD5_New, isMonologue: true },
    { speaker: "하카", text: "\"알아.\"", background: bgD5_New, character: "하카" },
    { speaker: "시스템", text: "그는 이미 총을 들고 있다.", background: bgD5_New, isProgress: true },
    { speaker: "하카", text: "\"소리 컸어.\"", background: bgD5_New, character: "하카" },
    { speaker: "시스템", text: "우린 달린다. 복도 끝.", background: bgD5_New, isProgress: true, effect: "chase" },
    { speaker: "시스템", text: "엘이 벽에 기대 있다. 팔— 물려 있다. 피가 번진다.", background: bgD5_New, isProgress: true },
    { speaker: "엘", text: "\"…괜찮아.\"", background: bgD5_New, character: "엘" },
    { speaker: "하카", text: "\"개소리.\"", background: bgD5_New, character: "하카" },
    { speaker: "시스템", text: "감염자는 이미 쓰러져 있다.", background: bgD5_New, isProgress: true },
    { speaker: "하카", text: "\"언제.\"", background: bgD5_New, character: "하카" },
    { speaker: "엘", text: "\"…방금.\"", background: bgD5_New, character: "엘" },
    { speaker: "파스닐", text: "방금은— 너무 빠르다.", background: bgD5_New, isMonologue: true },
    { speaker: "하카", text: "\"나간다. 지금.\"", background: bgD5_New, character: "하카" },
    { speaker: "엘", text: "\"데일은—\"", background: bgD5_New, character: "엘" },
    { speaker: "하카", text: "\"지금은 너야.\"", background: bgD5_New, character: "하카" },
    { speaker: "시스템", text: "하카가 엘을 끌어당긴다.", background: bgD5_New, isProgress: true },
    { speaker: "엘", text: "\"파스닐.\"", background: bgD5_New, character: "엘" },
    { speaker: "파스닐", text: "\"네.\"", background: bgD5_New, isMonologue: true },
    { speaker: "엘", text: "\"…문 닫히면 뒤돌아보지 마.\"", background: bgD5_New, character: "엘" },
    { speaker: "시스템", text: "나는 고개를 끄덕인다. 말이 안 나온다.", background: bgD5_New, isProgress: true },

    // #D10 탈출 - 검정 배경, 캐릭터 없음
    { marker: "#D10", speaker: "시스템", text: "탈출. 계단. 문. 밖.", background: "black", isProgress: true, sfx: sfxHeartBeat, sfxVolume: 1.0, hideCharacter: true },
    { speaker: "시스템", text: "차가 보인다.", background: "black", isProgress: true, hideCharacter: true },
    { speaker: "하카", text: "\"태운다!\"", background: "black", hideCharacter: true },
    { speaker: "시스템", text: "엘의 숨이 거칠다. 색이 빠르게 변한다.", background: "black", isProgress: true, hideCharacter: true },
    { speaker: "파스닐", text: "이건 시간 문제다.", background: "black", isMonologue: true, hideCharacter: true },
    { speaker: "하카", text: "\"…젠장.\"", background: "black", hideCharacter: true },
    { speaker: "파스닐", text: "위기는 시작됐다. 그리고 이건— 되돌릴 수 없다.", background: "black", isMonologue: true, hideCharacter: true },

    // 차로 돌아오는 길
    { speaker: "시스템", text: "차 문이 닫히자 데일이 숨을 내쉰다.", background: "black", isProgress: true, hideCharacter: true },
    { speaker: "데일", text: "\"…역시 집에 있을걸.\"", background: "black", hideCharacter: true },
    { speaker: "하카", text: "\"좀 닥쳐.\"", background: "black", hideCharacter: true },
    { speaker: "데일", text: "\"….\"", background: "black", hideCharacter: true },
    { speaker: "엘", text: "\"뭐가 제일 이상해보이냐.\"", background: "black", hideCharacter: true },
    { speaker: "엘", text: "\"파스닐.\"", background: "black", hideCharacter: true },

    // #F1 - 붉은 눈 효과 + 퍼즐 입력
    { marker: "#F1", speaker: "시스템", text: "무엇이 가장 이상해 보였는가?", background: "black", isProgress: true, isPuzzle: true, puzzleAnswer: "눈", eyeEffect: true, hideCharacter: true },
    { speaker: "데일", text: "\"…눈.\"", background: "black", hideCharacter: true },
    { speaker: "하카", text: "\"아, 또 눈.\"", background: bgD10, character: "하카" },
    { speaker: "파스닐", text: "마트에서 보던 눈과 비슷했다.", background: bgD10, isMonologue: true },
    { speaker: "하카", text: "\"와, 합의 빠르네.\"", background: bgD10, character: "하카" },
    { speaker: "데일", text: "\"이 상황에 고집 부릴 생각 없어.\"", background: bgD10, character: "데일" },
    { speaker: "하카", text: "\"…그건 좀 멋없다.\"", background: bgD10, character: "하카" },
    { speaker: "데일", text: "\"살아남는 게 원래 멋없어.\"", background: bgD10, character: "데일" },
    { speaker: "시스템", text: "차가 움직인다.", background: bgD10, isProgress: true },
    { speaker: "시스템", text: "나는 뒷좌석에서 손을 풀었다 쥔다.", background: bgD10, isProgress: true },
    { speaker: "파스닐", text: "오늘 얻은 건 약이 아니다.", background: bgD10, isMonologue: true },
    { speaker: "시스템", text: "엔진 소리는 일정한데 차 안 공기는 들쭉날쭉하다.", background: bgD10, isProgress: true },
    { speaker: "시스템", text: "엘은 뒷좌석에 눕듯 기대 있다. 숨이 고르지 않다. 눈은 뜨고 있는데, 초점이 흔들린다.", background: bgD10, isProgress: true },

    // #F2~F3 차 안 대화 - 캐릭터 없음
    { marker: "#F2", speaker: "시스템", text: "하카가 운전대를 잡고 있고 뒷자석엔 데일. 나는 뒷자석 바닥 쪽에 쭈그려 앉아 엘의 손목을 보고 있다.", background: bgF2, isProgress: true, hideCharacter: true, audio: audioSigh },
    { speaker: "데일", text: "\"…그래서.\"", background: bgF2, hideCharacter: true },
    { speaker: "하카", text: "\"그래서 뭐.\"", background: bgF3, hideCharacter: true },
    { speaker: "하카", text: "\"결국 엘이 물린 거잖아.\"", background: bgF3, hideCharacter: true },
    { speaker: "데일", text: "\"네가 혼자 돌아다니지만 않았어도.\"", background: bgF2, hideCharacter: true },
    { speaker: "하카", text: "\"아, 그걸 나한테 돌려?\"", background: bgF3, hideCharacter: true },
    { speaker: "데일", text: "\"항상 그렇게 하잖아. 자기 판단, 자기 루트.\"", background: bgF2, hideCharacter: true },
    { speaker: "하카", text: "\"그 말은 엘한테 해.\"", background: bgF3, hideCharacter: true },
    { speaker: "데일", text: "\"지금 엘이 말할 수 있는 상태야?\"", background: bgF2, hideCharacter: true },
    { speaker: "시스템", text: "하카가 브레이크를 살짝 밟는다. 차가 덜컹인다.", background: bgF3, isProgress: true, hideCharacter: true },
    { speaker: "하카", text: "\"너, 지금 말 고르지 마.\"", background: bgF3, hideCharacter: true },
    { speaker: "데일", text: "\"고를 필요 없어. 이미 결과 나왔잖아.\"", background: bgF2, hideCharacter: true },
    { speaker: "시스템", text: "나는 엘의 팔을 살핀다. 상처 주변이… 빨라.", background: bgF2, isProgress: true, hideCharacter: true },
    { speaker: "파스닐", text: "\"열 올라요.\"", background: bgF2, isMonologue: true, hideCharacter: true },
    { speaker: "하카", text: "\"알아.\"", background: bgF3, hideCharacter: true },
    { speaker: "데일", text: "\"봤지. 시간 싸움이야.\"", background: bgF2, hideCharacter: true },
    { speaker: "하카", text: "\"그래서?\"", background: bgF3, hideCharacter: true },
    { speaker: "데일", text: "\"그래서— 누가 책임질 건데.\"", background: bgF2, hideCharacter: true },
    { speaker: "하카", text: "\"책임 같은 소리 하네.\"", background: bgF3, hideCharacter: true },
    { speaker: "데일", text: "\"항상 이렇게 끝나. 누군가는 물리고, 누군가는 '어쩔 수 없었다'고 말하고.\"", background: bgF2, hideCharacter: true },
    { speaker: "하카", text: "\"그럼 너는? 너는 어디 있었는데.\"", background: bgF3, hideCharacter: true },
    { speaker: "데일", text: "\"….\"", background: bgF2, hideCharacter: true },
    { speaker: "하카", text: "\"몰래 빠져나가서 혼자 판단하다가 결국 엘이 쫓아간 거잖아.\"", background: bgF3, hideCharacter: true },
    { speaker: "데일", text: "\"그건—\"", background: bgF2, hideCharacter: true },
    { speaker: "하카", text: "\"그건 네 선택이지.\"", background: bgF3, hideCharacter: true },
    { speaker: "시스템", text: "차 안이 다시 조용해진다.", background: bgF3, isProgress: true, hideCharacter: true },

    // #F4~F5
    { marker: "#F4", speaker: "엘", text: "\"…그만좀해라.\"", background: bgF2, hideCharacter: true },
    { speaker: "시스템", text: "목소리가 낮다. 힘이 없다.", background: bgF2, isProgress: true, hideCharacter: true },
    { speaker: "데일", text: "\"…엘.\"", background: bgF2, hideCharacter: true },
    { speaker: "엘", text: "\"지금 싸울 에너지 아껴.\"", background: bgF2, hideCharacter: true },
    { speaker: "하카", text: "\"들었지. 이제 다들 조용.\"", background: bgF3, hideCharacter: true },
    { marker: "#F5", speaker: "시스템", text: "데일은 창밖으로 시선을 돌린다.", background: bgF2, isProgress: true, hideCharacter: true },
    { speaker: "시스템", text: "차는 숲길로 들어선다. 별장이 보이기 시작한다.", background: bgF2, isProgress: true, hideCharacter: true },

    // #A1 별장 도착 - 오디오 정지
    { marker: "#A1", speaker: "시스템", text: "별장 도착", background: bgLivingRoomUpdate, isProgress: true, audio: "stop" },
    { speaker: "시스템", text: "차 문이 열리자 안에 있던 공기가 한 박자 늦게 반응한다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "렌쟈가 제일 먼저 뛰어나온다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "렌쟈", text: "\"왔—\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "시스템", text: "그리고 멈춘다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "렌쟈", text: "\"…엘오빠?\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "시스템", text: "엘은 하카에게 거의 기대다시피 내려온다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "렌쟈", text: "\"잠깐, 앉혀. 아니 눕혀. 아니—\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "시스템", text: "말이 꼬인다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "렌쟈가 바로 엘의 소매를 걷는다. 상처를 본다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "렌쟈", text: "\"…아.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "시스템", text: "그 한 음절에 상황이 다 들어 있다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "렌쟈", text: "\"언제.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "하카", text: "\"한 시간도 안 됐어.\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "렌쟈", text: "\"데일?\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "데일", text: "\"…나 때문에.\"", background: bgLivingRoomUpdate, character: "데일" },
    { speaker: "렌쟈", text: "\"지금 그 얘기 아니야.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "시스템", text: "렌쟈는 숨을 크게 들이쉬고 손부터 움직인다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "렌쟈", text: "\"심박 빨라. 체온 올라가고 있고.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "파스닐", text: "\"열 계속 오르고 있어.\"", background: bgLivingRoomUpdate, isMonologue: true },
    { speaker: "렌쟈", text: "\"응. 봐.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "시스템", text: "렌쟈는 엘의 얼굴을 가까이 본다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "렌쟈", text: "\"오빠. 나 보여?\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "엘", text: "\"…응.\"", background: bgLivingRoomUpdate, character: "엘" },
    { speaker: "렌쟈", text: "\"손.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "시스템", text: "엘이 손을 든다. 조금 늦다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "렌쟈", text: "\"…괜찮아. 아직 반응 있어.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "시스템", text: "그 말이 스스로를 안심시키는 말처럼 들린다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "란이 문가에 서 있다. 발목이 아직 불편해 보인다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "란", text: "\"…감염입니까.\"", background: bgLivingRoomUpdate, character: "란" },
    { speaker: "렌쟈", text: "\"…응.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "하카", text: "\"확정은 아니고.\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "렌쟈", text: "\"아니야 오빠. 이건 확정이야.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "시스템", text: "렌쟈는 고개를 든다.", background: bgLivingRoomUpdate, isProgress: true },

    // #G1 격리 준비 - 거실 배경
    { marker: "#G1", speaker: "렌쟈", text: "\"격리 준비해. 엘오빠 방.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "하카", text: "\"알겠어.\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "데일", text: "\"…내가 할 수 있는 건.\"", background: bgLivingRoomUpdate, character: "데일" },
    { speaker: "렌쟈", text: "\"있어.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "시스템", text: "데일이 고개를 든다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "렌쟈", text: "\"가만히 있어. 이번엔.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "데일", text: "\"….\"", background: bgLivingRoomUpdate, character: "데일" },
    { speaker: "시스템", text: "엘이 눈을 감았다 뜬다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "엘", text: "\"파스닐.\"", background: bgLivingRoomUpdate, character: "엘" },
    { speaker: "파스닐", text: "\"여기요.\"", background: bgLivingRoomUpdate, isMonologue: true },
    { speaker: "엘", text: "\"…문단속. 소리 관리. 너가 제일 잘하잖아.\"", background: bgLivingRoomUpdate, character: "엘" },
    { speaker: "시스템", text: "나는 고개를 끄덕인다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "파스닐", text: "\"다 막을게요.\"", background: bgLivingRoomUpdate, isMonologue: true },
    { speaker: "시스템", text: "렌쟈는 엘의 이마에 손을 얹은 채 조용히 말한다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "렌쟈", text: "\"지금부터 우린 시간 벌기 들어간다.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "시스템", text: "별장 안이 다시 분주해진다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "파스닐", text: "이번엔 도망치는 분주함이 아니라 붙잡는 쪽이다.", background: bgLivingRoomUpdate, isMonologue: true },
    { speaker: "시스템", text: "그리고 모두 안다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "지금 이 집엔 감염자 하나가 있다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "파스닐", text: "그게 엘이라는 걸.", background: bgLivingRoomUpdate, isMonologue: true },

    // #1 5일차 별장 — 이른 오전
    { marker: "#1_Day5", speaker: "시스템", text: "5일차 — 별장, 이른 오전", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "아침 공기가 어제보다 무겁다. 창문엔 이슬이 맺혀 있고, 산 쪽은 안개가 낮게 깔려 있다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "엘은 소파에 기대 앉아 있다. 겉으로는 멀쩡한 척하지만, 손등의 색이 좋지 않다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "렌쟈가 약통을 정리하다가 멈춘다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "렌쟈", text: "\"…이거, 어제보다 열 내려간 거 맞아?\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "엘", text: "\"버틸 만해.\"", background: bgLivingRoomUpdate, character: "엘" },
    { speaker: "하카", text: "\"버틴다는 말 진짜 지겹다.\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "시스템", text: "엘은 대꾸하지 않는다. 대신 시선을 란에게 둔다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "란은 조용히 서 있다. 어깨 고정대는 풀었지만, 팔을 크게 쓰지 않는다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "란", text: "\"누님.\"", background: bgLivingRoomUpdate, character: "란" },
    { speaker: "렌쟈", text: "\"응?\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "란", text: "\"엘씨의 상태, 지금 약으론 오래 못 갑니다.\"", background: bgLivingRoomUpdate, character: "란" },
    { speaker: "시스템", text: "방 안이 잠깐 멎는다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "하카", text: "\"와. 오늘은 돌려 말 안 하네. 너가 좋아하는 누님 상처 받겠다.\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "란", text: "\"상태가… 돌려 말할 단계는 아닌 것 같습니다.\"", background: bgLivingRoomUpdate, character: "란" },
    { speaker: "엘", text: "\"그래서.\"", background: bgLivingRoomUpdate, character: "엘" },
    { speaker: "란", text: "\"물류창고 쪽을 제안합니다.\"", background: bgLivingRoomUpdate, character: "란" },
    { speaker: "파스닐", text: "…물류창고?", background: bgLivingRoomUpdate, isMonologue: true },
    { speaker: "시스템", text: "렌쟈가 고개를 든다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "렌쟈", text: "\"산 넘어서 있는 그쪽?\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "란", text: "\"네. 의약품 이동 거점이었던 곳입니다. 병원보다 가능성 높습니다.\"", background: bgLivingRoomUpdate, character: "란" },
    { speaker: "하카", text: "\"거기면 도심 끝도 아니고, 아예 벗어나는 쪽인데.\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "란", text: "\"그래서 아직 남아 있을 확률이 있습니다.\"", background: bgLivingRoomUpdate, character: "란" },
    { speaker: "엘", text: "\"…거길 어떤 또라이가 가냐.\"", background: bgLivingRoomUpdate, character: "엘" },
    { speaker: "시스템", text: "란은 망설이지 않는다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "란", text: "\"제가 가겠습니다.\"", background: bgLivingRoomUpdate, character: "란" },
    { speaker: "렌쟈", text: "\"혼자는 안 돼.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "하카", text: "\"운전은 내가 하지.\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "시스템", text: "하카가 열쇠를 손가락으로 빙 돌린다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "하카", text: "\"산길은 내가 제일 안다.\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "렌쟈", text: "\"…파스닐은?\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "엘", text: "\"데려가.\"", background: bgLivingRoomUpdate, character: "엘" },
    { speaker: "시스템", text: "그 말에 란이 잠깐 파스닐을 본다. 아주 짧게, 확인하듯.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "란", text: "\"소리 판단이 필요합니다.\"", background: bgLivingRoomUpdate, character: "란" },
    { speaker: "시스템", text: "그게 전부다. 명령도, 부탁도 아니다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "파스닐", text: "\"…알겠습니다.\"", background: bgLivingRoomUpdate, isMonologue: true },
    { speaker: "엘", text: "\"해 지기 전엔 돌아와.\"", background: bgLivingRoomUpdate, character: "엘" },

    // #2 이동 — 산길
    { marker: "#2_Mountain", speaker: "시스템", text: "이동 — 산길", background: bg_2, isProgress: true, audio: sfxCarDriving, audioVolume: 0.3 },
    { speaker: "시스템", text: "차는 오래된 SUV다. 운전석엔 하카, 조수석에 렌쟈, 뒷좌석에 나와 란.", background: bg_2, isProgress: true },
    { speaker: "하카", text: "\"와, 이 조합 오랜만인데?\"", background: bg_2, character: "하카" },
    { speaker: "렌쟈", text: "\"그러게. 정상 둘, 문제 둘.\"", background: bg_2, character: "렌쟈" },
    { speaker: "하카", text: "\"문제 둘 중 하나 운전 중인데 괜찮겠어?\"", background: bg_2, character: "하카" },
    { speaker: "렌쟈", text: "\"그래서 더 안전할지도.\"", background: bg_2, character: "렌쟈" },
    { speaker: "시스템", text: "란은 창밖을 보고 있다. 말없이, 하지만 시선은 계속 움직인다.", background: bg_2, isProgress: true },
    { speaker: "파스닐", text: "란은 항상 말보다 먼저 본다.", background: bg_2, isMonologue: true },
    { speaker: "시스템", text: "산길은 생각보다 가파르다. 도로 옆엔 오래된 방호벽, 그 너머는 바로 낭떠러지.", background: bg_2, isProgress: true },
    { speaker: "하카", text: "\"이쪽으로 넘으면 물류단지까지 한 시간 반.\"", background: bg_2, character: "하카" },
    { speaker: "렌쟈", text: "\"좀 멀다.\"", background: bg_2, character: "렌쟈" },
    { speaker: "란", text: "\"괜찮습니다.\"", background: bg_2, character: "란" },
    { speaker: "시스템", text: "렌쟈가 힐끗 본다.", background: bg_2, isProgress: true },
    { speaker: "렌쟈", text: "\"아픈 건?\"", background: bg_2, character: "렌쟈" },
    { speaker: "란", text: "\"지장 없습니다.\"", background: bg_2, character: "란" },
    { speaker: "시스템", text: "그 대답에 렌쟈는 더 묻지 않는다.", background: bg_2, isProgress: true },

    // 선택지 A (대화) - 결과 영향 없음, 다음 줄로 진행
    { speaker: "시스템", text: "차가 급커브를 돌며 흔들린다. 잠깐의 정적.", background: bg_2, isProgress: true,
      choices: [
        { text: "1. \"란은 원래 이런 위험한 일 자주 했어요?\"", targetIndex: 804 },
        { text: "2. \"렌쟈가 있어서 란이 버티는 것 같네요.\"", targetIndex: 804 }
      ]
    },
    { speaker: "란", text: "\"…그렇습니다.\"", background: bg_2, character: "란" },
    { speaker: "시스템", text: "짧지만 확실한 긍정.", background: bg_2, isProgress: true },

    // 산 정상 근처 — 이상 징후
    { speaker: "시스템", text: "산 정상 근처 — 이상 징후", background: bg_2, isProgress: true },
    { speaker: "시스템", text: "차가 속도를 줄인다.", background: bg_2, isProgress: true },
    { speaker: "하카", text: "\"…야.\"", background: bg_2, character: "하카" },
    { speaker: "렌쟈", text: "\"왜.\"", background: bg_2, character: "렌쟈" },
    { speaker: "하카", text: "\"길이 좀 이상한데.\"", background: bg_2, character: "하카" },
    { speaker: "시스템", text: "앞쪽 도로에 버려진 트럭 두 대가 엉켜 있다. 부딪힌 흔적은 없는데, 방향이 제각각이다.", background: bg_2, isProgress: true },
    { speaker: "파스닐", text: "\"…소리 있어요.\"", background: bg_2, isMonologue: true },
    { speaker: "렌쟈", text: "\"어디서?\"", background: bg_2, character: "렌쟈" },
    { speaker: "파스닐", text: "\"아래. 낭떠러지 쪽.\"", background: bg_2, isMonologue: true },
    { speaker: "시스템", text: "란이 바로 말한다.", background: bg_2, isProgress: true },
    { speaker: "란", text: "\"정차합시다.\"", background: bg_2, character: "란" },
    { speaker: "하카", text: "\"여기서?\"", background: bg_2, character: "하카" },
    { speaker: "란", text: "\"지금 내려가면 차량 소음이 반향을 일으킵니다.\"", background: bg_2, character: "란" },
    { speaker: "하카", text: "\"와… 말 들을까 말까 고민되게 하네.\"", background: bg_2, character: "하카" },
    { speaker: "란", text: "\"지금은 '말 듣는 쪽'이 맞습니다.\"", background: bg_2, character: "란" },
    { speaker: "시스템", text: "그 어조는 정중하지만, 단정적이다.", background: bg_2, isProgress: true,
      choices: [
        { text: "1. \"소리 커지기 전에 통과하는게 낫겠어요.\"", targetIndex: 822 },
        { text: "2. 란의 말대로 정차하고 상황을 본다.", targetIndex: 830 }
      ]
    },

    // #G2 선택 1 결과 — DEAD END
    { marker: "#G2_Dead", speaker: "시스템", text: "하카가 가속한다.", background: bgG2Dead, isProgress: true, audio: audioHorrorChase, hideCharacter: true },
    { speaker: "하카", text: "\"오케이, 한 번에—\"", background: bgG2Dead, hideCharacter: true },
    { speaker: "시스템", text: "그 순간, 낭떠러지 아래서 무언가가 도로 쪽으로 튀어 오른다.", background: bgG2Dead, isProgress: true, hideCharacter: true },
    { speaker: "시스템", text: "너무 늦다.", background: bgG2Dead, isProgress: true, hideCharacter: true },
    { speaker: "시스템", text: "차량이 흔들리고, 가드레일이 찢어진다.", background: bgG2Dead, isProgress: true, hideCharacter: true },
    { speaker: "란", text: "\"렌쟈—!\"", background: bgG2Dead, hideCharacter: true },
    { speaker: "시스템", text: "충격. 시야 전복.", background: bgG2Dead, isProgress: true, hideCharacter: true },
    { speaker: "시스템", text: "", background: "black", isDeadEnd: true, deadEndTitle: "DEAD ENDING", deadEndSubtitle: "판단을 앞당긴 건 용기가 아니라 소음이었다.", onComplete: () => { setGameState("start"); setDialogueIndex(0); } },

    // #2 선택 2 결과 — 정상 진행
    { marker: "#2_Continue", speaker: "시스템", text: "하카가 브레이크를 밟는다. 엔진 소리가 줄어든다.", background: bg_2, isProgress: true },
    { speaker: "시스템", text: "정적.", background: bg_2, isProgress: true },
    { speaker: "시스템", text: "아래쪽에서 느린 마찰음이 올라온다.", background: bg_2, isProgress: true },
    { speaker: "렌쟈", text: "\"…저건.\"", background: bg_2, character: "렌쟈" },
    { speaker: "란", text: "\"지금 내려오지 않습니다.\"", background: bg_2, character: "란" },
    { speaker: "파스닐", text: "\"소리… 방향 잃은 것 같아요.\"", background: bg_2, isMonologue: true },
    { speaker: "란", text: "\"맞습니다.\"", background: bg_2, character: "란" },
    { speaker: "시스템", text: "그는 차 문을 아주 조금 연다. 바람의 방향을 확인하듯 손을 내민다.", background: bg_2, isProgress: true },
    { speaker: "란", text: "\"우회합니다. 좌측 임도.\"", background: bg_2, character: "란" },
    { speaker: "하카", text: "\"거기 길 있는 거 어떻게 알아.\"", background: bg_2, character: "하카" },
    { speaker: "란", text: "\"지도에 없지만, 차량 흔적은 있습니다.\"", background: bg_2, character: "란" },
    { speaker: "렌쟈", text: "\"…란.\"", background: bg_2, character: "렌쟈" },
    { speaker: "란", text: "\"네, 누님.\"", background: bg_2, character: "란" },
    { speaker: "렌쟈", text: "\"아니야.\"", background: bg_2, character: "렌쟈" },
    { speaker: "시스템", text: "란은 대답하지 않는다. 대신 고개를 한 번 끄덕인다.", background: bg_2, isProgress: true },
    { speaker: "시스템", text: "그걸로 충분하다.", background: bg_2, isProgress: true },

    // #4 물류창고 도착
    { marker: "#4_Warehouse", speaker: "시스템", text: "산을 넘자 풍경이 바뀐다. 숲 대신, 낮은 건물들. 컨테이너와 철문.", background: bg_4, isProgress: true, audio: audioItsNotYou },
    { speaker: "하카", text: "\"와… 아직 멀쩡하네.\"", background: bg_4, character: "하카" },
    { speaker: "란", text: "\"완전히 비진 않았습니다.\"", background: bg_4, character: "란" },
    { speaker: "렌쟈", text: "\"확신?\"", background: bg_4, character: "렌쟈" },
    { speaker: "란", text: "\"희망에 가깝습니다.\"", background: bg_4, character: "란" },
    { speaker: "시스템", text: "그 말은 솔직하다. 그리고 책임을 넘기지 않는다.", background: bg_4, isProgress: true },
    { speaker: "파스닐", text: "란은 항상 선택을 렌쟈에게 남긴다.", background: bg_4, isMonologue: true },
    { speaker: "렌쟈", text: "\"…가자.\"", background: bg_4, character: "렌쟈" },
    { speaker: "란", text: "\"네.\"", background: bg_4, character: "란" },
    { speaker: "시스템", text: "차는 천천히 물류창고 안으로 들어간다.", background: bg_4, isProgress: true },
    { speaker: "시스템", text: "엘에게 필요한 약은 아직 여기 어딘가에 있다.", background: bg_4, isProgress: true },
    { speaker: "시스템", text: "그리고 다들 그것을 찾기 전까지 멈추지 않을 얼굴이다.", background: bg_4, isProgress: true },

    // #5 물류창고 내부
    { marker: "#5_Inside", speaker: "시스템", text: "물류창고 내부", background: bg_5, isProgress: true },
    { speaker: "시스템", text: "문을 여는 순간, 분위기가 다르다. 너무 조용하다.", background: bg_5, isProgress: true },
    { speaker: "파스닐", text: "사람 소리가 난다. 감염자 말고, 살아있는 쪽.", background: bg_5, isMonologue: true },
    { speaker: "시스템", text: "그때, 위에서 쇠 부딪히는 소리가 난다.", background: bg_5, isProgress: true },
    { speaker: "???", text: "\"멈춰.\"", background: bg_5 },
    { speaker: "시스템", text: "총구가 내려다본다. 하나가 아니다. 최소 네 명. 적대적 생존자 무리다.", background: bg_5, isProgress: true },
    { speaker: "하카", text: "\"와, 환영은 참 살벌하네.\"", background: bg_5, character: "하카" },
    { speaker: "시스템", text: "렌쟈가 한 발 앞으로 나서려는 순간—", background: bg_5, isProgress: true },
    { speaker: "란", text: "\"누님.\"", background: bg_5, character: "란" },
    { speaker: "시스템", text: "아주 낮게, 하지만 분명히 부른다. 자연스럽게 그녀 앞을 반 보폭 가로막는다. 과하지 않다. 본능에 가까운 움직임이다.", background: bg_5, isProgress: true,
      choices: [
        { text: "1. 란을 밀치고 앞으로 나간다", targetIndex: 868 },
        { text: "2. 그대로 멈춘다", targetIndex: 871 }
      ]
    },

    // 선택지 ① DEAD END — 란 사망
    { marker: "#5_Dead", speaker: "시스템", text: "란은 균형을 잃고 넘어지고", background: bg_5, isProgress: true },
    { speaker: "시스템", text: "그 순간 날아온 총탄이 그대로 머리를 관통한다.", background: bg_5, isProgress: true },
    { speaker: "시스템", text: "", background: "black", isDeadEnd: true, deadEndTitle: "DEAD ENDING", deadEndSubtitle: "나는 살아남지 못했다.", onComplete: () => { setGameState("start"); setDialogueIndex(0); } },

    // 선택지 ② 정상 진행
    { marker: "#5_Continue", speaker: "시스템", text: "렌쟈가 멈춘다. 그 판단 1초 뒤—", background: bg_5, isProgress: true },
    { speaker: "시스템", text: "총성이 울린다.", background: bg_5, isProgress: true },
    { speaker: "시스템", text: "탕.", background: bg_5, isProgress: true },
    { speaker: "시스템", text: "란의 어깨가 뒤로 튕긴다. 그는 소리 없이 무릎을 꿇는다.", background: bg_5, isProgress: true },
    { speaker: "란", text: "\"…괜찮습니다.\"", background: bg_5, character: "란" },
    { speaker: "시스템", text: "숨이 흔들린다. 하지만 첫마디는 여전히 그것이다.", background: bg_5, isProgress: true },
    { speaker: "렌쟈", text: "\"란!\"", background: bg_5, character: "렌쟈" },
    { speaker: "시스템", text: "그 순간, 다른 총성.", background: bg_5, isProgress: true },
    { speaker: "시스템", text: "탕— 탕.", background: bg_5, isProgress: true },
    { speaker: "시스템", text: "위에서 있던 생존자 둘이 쓰러진다.", background: bg_5, isProgress: true },

    // 의문의 소년
    { speaker: "시스템", text: "창고 반대편, 그림자에서 누군가 나온다. 소년이다. 너무 어리다.", background: bg_5, isProgress: true },
    { speaker: "소년", text: "\"지금 안 빠지면 다 죽어.\"", background: bg_5, character: "소년" },
    { speaker: "시스템", text: "말투는 건조하고 빠르다. 감정이 없다기보다, 감정을 쓸 여유가 없는 얼굴.", background: bg_5, isProgress: true },
    { speaker: "시스템", text: "하카가 웃지도 않은 채 말한다.", background: bg_5, isProgress: true },
    { speaker: "하카", text: "\"구세주 취미야?\"", background: bg_5, character: "하카" },
    { speaker: "시스템", text: "소년은 대답하지 않는다. 대신 길을 가리킨다.", background: bg_5, isProgress: true },
    { speaker: "시스템", text: "렌쟈와 파스닐이 란을 부축한다. 란은 체중을 최대한 줄이려는 듯, 이를 악문다.", background: bg_5, isProgress: true },
    { speaker: "란", text: "\"누님… 속도 줄이지 마십시오. 전—\"", background: bg_5, character: "란" },
    { speaker: "렌쟈", text: "\"조용히해.\"", background: bg_5, character: "렌쟈" },
    { speaker: "시스템", text: "그 한마디에 란은 입을 다문다. 고개를 끄덕이는 걸로만 답한다. 그녀의 판단을 의심하지 않는다.", background: bg_5, isProgress: true },
    { speaker: "시스템", text: "소년이 문을 열어준다.", background: bg_5, isProgress: true },
    { speaker: "소년", text: "\"차, 밖에 있지?\"", background: bg_5, character: "소년" },
    { speaker: "하카", text: "\"응. 네 덕에 오늘은 안 죽네.\"", background: bg_5, character: "하카" },

    // #7 돌아가는 길
    { marker: "#7_Return", speaker: "시스템", text: "돌아가는 길", background: bg_2, isProgress: true, sfx: sfxCarDriving, sfxVolume: 0.3 },
    { speaker: "시스템", text: "차 안은 숨소리만 있다. 란은 창가에 기대 앉아 있다. 고통은 분명한데, 소리는 없다.", background: bg_2, isProgress: true },
    { speaker: "시스템", text: "그의 시선은 계속 렌쟈 쪽이다. 의식이 흐려질수록 더 선명해진다.", background: bg_2, isProgress: true },
    { speaker: "란", text: "\"…누님이 계셔서 다행이네요.\"", background: bg_2, character: "란" },
    { speaker: "시스템", text: "그 말이 마지막 힘이다.", background: bg_2, isProgress: true },
    { speaker: "시스템", text: "소년은 아무 말 없이 창밖을 본다. 이제, 그도 함께 간다.", background: bg_2, isProgress: true },

    // #8 6일차
    { marker: "#8_Day6", speaker: "시스템", text: "6일차 — 별장, 평화로운 낮", background: bgLivingRoomUpdate, isProgress: true, audio: audioRemember },
    { speaker: "시스템", text: "아침 햇빛이 창문을 반쯤만 통과한다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "별장은 조용하다. 너무 조용해서 '아직 괜찮다'는 착각이 든다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "렌쟈는 식탁에 앉아 캔을 두드린다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "렌쟈", text: "\"오늘은 메뉴가 있어요.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "하카", text: "\"오.\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "렌쟈", text: "\"통조림 콩, 통조림 고기, 통조림 고기 같은 콩.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "하카", text: "\"와… 우리 누님 창의력 어디 갔어.\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "렌쟈", text: "\"세상 망했는데 창의력까지 챙기면 사치야, 오빠.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "시스템", text: "란은 그릇을 꺼내며 말한다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "란", text: "\"누님, 제가 데울까요?\"", background: bgLivingRoomUpdate, character: "란" },
    { speaker: "렌쟈", text: "\"응. 고마워.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "란", text: "\"불은 제가 볼게요.\"", background: bgLivingRoomUpdate, character: "란" },
    { speaker: "시스템", text: "말투는 늘 같다. 부드럽고, 조용하고, 항상 렌쟈 쪽을 향해 있다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "파스닐", text: "란은 오늘도 중심을 잃지 않았다. 아니면 기울어진게 기본값이던가.", background: bgLivingRoomUpdate, isMonologue: true },
    { speaker: "시스템", text: "데일은 창가에 기대 있다. 밖을 보며 말한다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "데일", text: "\"오늘은 별일 없네.\"", background: bgLivingRoomUpdate, character: "데일" },
    { speaker: "하카", text: "\"그게 제일 무서운 말인 거 알지.\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "데일", text: "\"그래도 오늘은 진짜로.\"", background: bgLivingRoomUpdate, character: "데일" },
    { speaker: "하카", text: "\"너 그렇게 말하면 꼭 일 생기더라.\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "데일", text: "\"그건 네 쪽이고.\"", background: bgLivingRoomUpdate, character: "데일" },
    { speaker: "하카", text: "\"아님.\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "시스템", text: "두 사람은 티격태격하지만 목소리에 날은 없다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "파스닐", text: "싸우는 게 아니라, 확인하는 대화다.", background: bgLivingRoomUpdate, isMonologue: true },
    { speaker: "시스템", text: "신라는.. 조금 떨어진 곳에 앉아 있다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "말을 끼지 않는다. 웃지도 않는다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "하지만 누가 말을 걸면 항상 바로 반응한다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "렌쟈", text: "\"신라, 이거 먹어.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "신라", text: "\"아, 네. 감사합니다.\"", background: bgLivingRoomUpdate, character: "신라" },
    { speaker: "란", text: "\"입에 맞으십니까?\"", background: bgLivingRoomUpdate, character: "란" },
    { speaker: "신라", text: "\"괜찮아요.\"", background: bgLivingRoomUpdate, character: "신라" },
    { speaker: "시스템", text: "짧다. 필요한 말만 한다.", background: bgLivingRoomUpdate, isProgress: true },

    // 오후 작업
    { speaker: "시스템", text: "햇빛이 따사로운 오후,", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "하카와 데일은 외벽을 본다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "렌쟈는 빵을 굽고있고 란은 그 옆에 있다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "나는 못과 판자를 옮긴다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "신라도 같이 움직인다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "신라", text: "\"이쪽이 더 튼튼해요.\"", background: bgLivingRoomUpdate, character: "신라" },
    { speaker: "하카", text: "\"어디?\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "시스템", text: "신라는 손가락으로 정확한 지점을 짚는다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "하카", text: "\"눈 좋네.\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "신라", text: "\"예전에… 이런 데를 좀 다녀서요.\"", background: bgLivingRoomUpdate, character: "신라" },
    { speaker: "하카", text: "\"예전이 언제야.\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "신라", text: "\"…오래요.\"", background: bgLivingRoomUpdate, character: "신라" },
    { speaker: "시스템", text: "하카는 더 묻지 않는다.", background: bgLivingRoomUpdate, isProgress: true },

    // 파스닐의 의심
    { speaker: "파스닐", text: ".... 음?", background: bgLivingRoomUpdate, isMonologue: true },
    { speaker: "시스템", text: "파스닐은 물통을 옮기다 말고 신라를 본다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "신라는 지도 앞에 서 있다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "아무도 안 보는 줄 알고 선을 따라 손가락을 움직인다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "고지. 산. 물류창고. 딱 거기까지만.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "파스닐", text: "\"뭐 봐?\"", background: bgLivingRoomUpdate, isMonologue: true },
    { speaker: "시스템", text: "신라는 바로 손을 내린다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "신라", text: "\"아, 길이요.\"", background: bgLivingRoomUpdate, character: "신라" },
    { speaker: "파스닐", text: "\"길?\"", background: bgLivingRoomUpdate, isMonologue: true },
    { speaker: "신라", text: "\"네. 나중에… 움직일 일 있을까 봐.\"", background: bgLivingRoomUpdate, character: "신라" },
    { speaker: "파스닐", text: "\"움직일 일이?\"", background: bgLivingRoomUpdate, isMonologue: true },
    { speaker: "신라", text: "\"…있을 수도 있잖아요.\"", background: bgLivingRoomUpdate, character: "신라" },
    { speaker: "시스템", text: "틀린 말은 아니다. 하지만—", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "파스닐", text: "'있을지도 모른다'는 사람은 이렇게 정확히 보지 않지않나?", background: bgLivingRoomUpdate, isMonologue: true },

    // 밤 — 평화로운 순간
    { speaker: "시스템", text: "밤 — 정말 평화로운 순간", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "모두 모여 앉아 있다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "렌쟈가 말한다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "렌쟈", text: "\"이렇게 평화롭게 하루 끝나니까 좋다.\"", background: bgLivingRoomUpdate, character: "렌쟈" },
    { speaker: "데일", text: "\"언제까지 좋을지는 모르겠지만.\"", background: bgLivingRoomUpdate, character: "데일" },
    { speaker: "하카", text: "\"나도 안좋은 쪽이 좋아.\"", background: bgLivingRoomUpdate, character: "하카" },
    { speaker: "데일", text: "\"안궁금해.\"", background: bgLivingRoomUpdate, character: "데일" },
    { speaker: "란", text: "\"그래도… 오늘은 조용해서 다행입니다.\"", background: bgLivingRoomUpdate, character: "란" },
    { speaker: "신라", text: "\"…맞아요.\"", background: bgLivingRoomUpdate, character: "신라" },
    { speaker: "시스템", text: "그 말이 너무 자연스럽다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "마치 이미 이 장면을 알고 있었던 것처럼.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "파스닐", text: "지금 이 평화는, 이 사람한테 '처음'이 아닌걸까", background: bgLivingRoomUpdate, isMonologue: true },
    { speaker: "파스닐", text: "아직 어리잖아 가족이있었나? 그렇다 해도 너무 빨리 적응하지 않나?", background: bgLivingRoomUpdate, isMonologue: true },

    // 파스닐의 독백
    { speaker: "시스템", text: "밤.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "모두 잠들고 파스닐은 혼자 앉아 있다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "아무 증거도 없다. 아무 확신도 없다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "그런데—", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "이 애는 너무 잘 맞는다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "공포에도, 거리에도, 사람 사이의 간격에도.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "파스닐", text: "맞는 사람이 아니라, 맞춰본 사람 같다. 아니면 누군가에게 그러라고 배워온것만 같다.", background: bgLivingRoomUpdate, isMonologue: true },
    { speaker: "시스템", text: "의심은 아직 말이 되지 않는다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "하지만 오늘 처음으로 파스닐은 이렇게 생각한다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "파스닐", text: "이 사람은 우연히 여기 온 게 아닐지도 몰라.", background: bgLivingRoomUpdate, isMonologue: true },
    { speaker: "시스템", text: "그리고 그 생각이 이상하게도 전혀 급하지 않다.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "시스템", text: "마치 이미 오래전부터 자리를 잡고 있었던 것처럼.", background: bgLivingRoomUpdate, isProgress: true },
    { speaker: "파스닐", text: "나는 조용히 발을 옮긴다.", background: bgLivingRoomUpdate, isMonologue: true },

    // #신라방
    { marker: "#신라방", speaker: "시스템", text: "신라의 방.", background: bgSillaRoom, isProgress: true, centeredMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "마땅한 방이 남지 않아 다용도실에 작은 매트리스를 두고 그 위에선 신라가 자고있다.", background: bgSillaRoom, isProgress: true, centeredMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "그앞에 놓인건", background: bgSillaRoom, isProgress: true, centeredMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "처음 만났을 때부터 소중하게 가져온 가방.", background: bgSillaRoom, isProgress: true, centeredMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "조심스럽게 열어 안을 살핀다.", background: bgSillaRoom, isProgress: true, centeredMonologue: true, hideCharacter: true, clickHint: true, requireClick: true },

    // #메모조각
    { marker: "#메모조각", speaker: "시스템", text: "신라의 가방에서 고지나 연구소 표식이 있는 메모 조각.", background: bgSillaRoom, isProgress: true, hideCharacter: true, showMemo: true },
    { speaker: "시스템", text: "확실하다 이 일이 일어난 첫날 뉴스에서 본 이 표식을 기억한다.", background: bgSillaRoom, isProgress: true, hideCharacter: true },
    { speaker: "시스템", text: "좌표는 찢겨 있고, 날짜는 이번 사태 이전이다.", background: bgSillaRoom, isProgress: true, hideCharacter: true },
    { speaker: "시스템", text: "아직 증거는 없다.", background: bgSillaRoom, isProgress: true, hideCharacter: true },
    { speaker: "시스템", text: "하지만 하나는 확실하다.", background: bgSillaRoom, isProgress: true, hideCharacter: true },
    { speaker: "파스닐", text: "신라는 이 사태의 '피해자'가 아니다.", background: bgSillaRoom, isMonologue: true, hideCharacter: true },
    // #메모조각end
    { marker: "#메모조각end", speaker: "시스템", text: "그리고", background: bgSillaRoom, isProgress: true, hideCharacter: true, hideMemo: true },
    { speaker: "시스템", text: "그 사실을 말하는 순간, 자신이 쫓겨날 수도 있다는 것도 안다.", background: bgSillaRoom, isProgress: true, hideCharacter: true },
    { speaker: "시스템", text: "그래서", background: bgSillaRoom, isProgress: true, hideCharacter: true },
    { speaker: "시스템", text: "아직 아무 말도 하지 않는다.", background: bgSillaRoom, isProgress: true, hideCharacter: true },
    { speaker: "파스닐", text: "나는 결심한다.", background: bgSillaRoom, isMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "엘을 되돌리려면 이 모든 사태의 시작, 고지나 연구소에 가야 한다.", background: bgSillaRoom, isProgress: true, hideCharacter: true },
    { speaker: "시스템", text: "그 전에, 신라의 정체를 밝혀야 한다.", background: bgSillaRoom, isProgress: true, hideCharacter: true },

    // #RED
    { marker: "#RED", speaker: "시스템", text: "그러려면", background: bgSillaRoom, isProgress: true, hideCharacter: true, redText: true },
    { speaker: "시스템", text: "팀원 전부를 설득해야 한다.", background: bgSillaRoom, isProgress: true, hideCharacter: true, redText: true },
    // #REDEND
    { marker: "#REDEND", speaker: "시스템", text: "하지만 이걸로는 부족하다.", background: bgSillaRoom, isProgress: true, hideCharacter: true },
    { speaker: "시스템", text: "엘을 되돌릴 치료를 위해 고지나 연구소를 추적하려면 팀을 설득해야 한다.", background: bgSillaRoom, isProgress: true, hideCharacter: true },

    // #도로숲
    { marker: "#도로숲", speaker: "시스템", text: "하카, 신라, 데일과 별장 뒤편 숲으로 나간다.", background: bgForestRoad, isProgress: true },
    { speaker: "시스템", text: "하카가 운전대를 잡고, 신라는 조수석에 앉아 있었다.", background: bgForestRoad, isProgress: true },
    { speaker: "시스템", text: "데일과 나는 뒷자리에 앉아있다.", background: bgForestRoad, isProgress: true },
    { speaker: "하카", text: "\"이 근처에 도로 있었나?\"", background: bgForestRoad, character: "하카" },
    { speaker: "시스템", text: "신라가 망설임 없이 말한다.", background: bgForestRoad, isProgress: true },
    { speaker: "신라", text: "\"조금만 더 가면 옛 군수도로가 나와요. 고도는 여기서 30미터쯤 더 올라가고.\"", background: bgForestRoad, character: "신라" },
    { speaker: "시스템", text: "지도는 펼쳐지지 않았다.", background: bgForestRoad, isProgress: true },
    { speaker: "시스템", text: "차가 실제로 고개를 넘자, 낡은 콘크리트 길이 모습을 드러낸다.", background: bgForestRoad, isProgress: true },
    { speaker: "하카", text: "\"길눈 하나는 죽이네.\"", background: bgForestRoad, character: "하카" },
    { speaker: "시스템", text: "하지만 나는 본다. 신라는 주변을 보는 게 아니라, 이미 알고 있는 것처럼 고개를 들었다.", background: bgForestRoad, isProgress: true },
    { speaker: "시스템", text: "신라는 조용히 말한다.", background: bgForestRoad, isProgress: true },
    { speaker: "신라", text: "\"근처 약국은 이미 털렸을 거예요. 대신 서쪽에 또다른 물류창고 쪽이 아직 남아있을 가능성이 높아요.\"", background: bgForestRoad, character: "신라" },
    { speaker: "데일", text: "\"누가 그래?\"", background: bgForestRoad, character: "데일" },
    { speaker: "시스템", text: "신라는 잠시 입을 다문다.", background: bgForestRoad, isProgress: true },
    { speaker: "신라", text: "\"사람들 움직임이… 그런 식이에요.\"", background: bgForestRoad, character: "신라" },
    { speaker: "시스템", text: "구체적인 이름도, 무전도, 기록도 없다. 하지만 방향은 항상 맞다. 이 정보의 출처는 어디지?", background: bgForestRoad, isProgress: true },

    // #독백1
    { marker: "#독백1", speaker: "시스템", text: "계속 생각에 잠긴다.", background: "black", isProgress: true, blackScreen: true, centeredMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "엘이 혼자 떨어진 시간", background: "black", isProgress: true, blackScreen: true, centeredMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "데일이 이탈한 직후", background: "black", isProgress: true, blackScreen: true, centeredMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "신라가 처음 모습을 드러낸 시점", background: "black", isProgress: true, blackScreen: true, centeredMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "너무 깔끔하다.", background: "black", isProgress: true, blackScreen: true, centeredMonologue: true, hideCharacter: true },
    { speaker: "파스닐", text: "감염 자체보다, 순서가 이상해.", background: "black", isMonologue: true, blackScreen: true, centeredMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "모든 게 이어진다.", background: "black", isProgress: true, blackScreen: true, centeredMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "신라는 고지와 지형에 익숙하다", background: "black", isProgress: true, blackScreen: true, centeredMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "정보의 출처가 없다", background: "black", isProgress: true, blackScreen: true, centeredMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "관측소 표식은 고지나 연구소 라인", background: "black", isProgress: true, blackScreen: true, centeredMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "엘의 감염 시점과 등장 타이밍", background: "black", isProgress: true, blackScreen: true, centeredMonologue: true, hideCharacter: true },
    { speaker: "시스템", text: "그리고… 신라는 엘 근처를 피하면서도 끝없이 바라본다.", background: "black", isProgress: true, blackScreen: true, centeredMonologue: true, hideCharacter: true },
    { speaker: "파스닐", text: "최소한, 이 사태의 \"밖\"에서 온 사람은 아니다.", background: "black", isMonologue: true, blackScreen: true, centeredMonologue: true, hideCharacter: true },

    // #거실
    { marker: "#거실", speaker: "시스템", text: "별장 거실", background: bgLivingRoom2, isProgress: true },
    { speaker: "시스템", text: "난로는 꺼져 있다. 불 대신, 긴장이 방을 데우고 있다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "시스템", text: "렌쟈는 엘과 담소를 나누고있다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "시스템", text: "란은 테이블 맞은편. 자세는 흐트러짐 없이 곧다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "시스템", text: "하카는 창가. 데일은 팔짱을 끼고 벽에 기대 있다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "시스템", text: "그리고—", background: bgLivingRoom2, isProgress: true },
    { speaker: "시스템", text: "신라. 가운데.", background: bgLivingRoom2, isProgress: true },
    { speaker: "시스템", text: "파스닐은 한 걸음 앞으로 나온다.", background: bgLivingRoom2, isProgress: true },

    // #파스닐공개의심 - 미니게임 타이틀
    { marker: "#파스닐공개의심", speaker: "", text: "파스닐 — 공개 의심", background: "black", isMinigameTitle: true, blackScreen: true, hideCharacter: true },
    // #파스닐공개의심END - 거실에서 시작
    { marker: "#파스닐공개의심END", speaker: "파스닐", text: "\"신라가 고지나 연구소랑 연관돼 있을 가능성이 있어요.\"", background: bgLivingRoom2, character: "파스닐" },
    { speaker: "시스템", text: "방 안이 조용해진다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "데일", text: "\"…뭐?\"", background: bgLivingRoom2, character: "데일" },
    { speaker: "하카", text: "\"와. 오늘 회의 안건 세네.\"", background: bgLivingRoom2, character: "하카" },
    { speaker: "시스템", text: "렌쟈는 고개를 들지만 바로 말하지 않는다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "란", text: "\"…파스닐. 그 말, 무겁습니다.\"", background: bgLivingRoom2, character: "란" },
    { speaker: "파스닐", text: "\"알아요. 그래서 지금 말하는 거예요.\"", background: bgLivingRoom2, character: "파스닐" },

    // #규칙 - 미니게임 규칙 설명
    { marker: "#규칙", speaker: "시스템", text: "[ 의심 게임 ]", background: "black", isMinigameRules: true, blackScreen: true, hideCharacter: true },
    { speaker: "시스템", text: "각 인물들에게 걸맞는 올바른 증거 1개 필요", background: "black", isMinigameRules: true, blackScreen: true, hideCharacter: true, centeredMonologue: true },
    { speaker: "시스템", text: "틀린 선택을 하면 즉시 배드엔딩", background: "black", isMinigameRules: true, blackScreen: true, hideCharacter: true, centeredMonologue: true, redText: true },

    // #미니게임1시작 - 데일
    { marker: "#미니게임1시작", speaker: "데일", text: "\"그럼 하나부터. 왜 그 생각했어?\"", background: "black", character: "데일", centerCharacter: true, isMinigameChoice: true },
    { speaker: "시스템", text: "데일은 이기적이고 까칠하다. 그러나 그녀가 죄책감을 갖는 하나의 사건이 있다.", background: "black", isProgress: true, blackScreen: true, hideCharacter: true, centeredMonologue: true },
    { speaker: "선택", text: "증거를 선택하세요", background: "black", hideCharacter: true, randomChoices: true, gunEffect: true, hideNormalTag: true, choices: [
      { text: "엘의 감염과 등장 시점 (일반 진행)", targetIndex: 1501 },
      { text: "고지나 표식", targetIndex: 1550 },
      { text: "출처 없는 정보", targetIndex: 1550 },
      { text: "지나치게 똑똑함", targetIndex: 1550 }
    ]},
    // 정답 루트 - 데일
    { speaker: "파스닐", text: "\"엘이 감염된 그날요.\"", background: "black", character: "파스닐", centerCharacter: true },
    { speaker: "데일", text: "\"그 얘기는 왜 꺼내는건데.\"", background: "black", character: "데일", centerCharacter: true },
    { speaker: "파스닐", text: "\"그날, 분명 있을리 없던 감염자가 정확히 우릴 기다리고 있었어요.\"", background: "black", character: "파스닐", centerCharacter: true },
    { speaker: "데일", text: "\"…뭔 소리야.\"", background: "black", character: "데일", centerCharacter: true },
    { speaker: "파스닐", text: "\"그리고 얼마안가 신라가 나타났죠. 물류창고에서 마치 짠듯이.\"", background: "black", character: "파스닐", centerCharacter: true },
    { speaker: "데일", text: "\"추적당했다고 생각하는 거야?\"", background: "black", character: "데일", centerCharacter: true },
    { speaker: "파스닐", text: "\"아니요. '유도'에 가까웠어요.\"", background: "black", character: "파스닐", centerCharacter: true },
    { speaker: "데일", text: "\"신라가 우릴 거기로 끌었다?\"", background: "black", character: "데일", centerCharacter: true },
    { speaker: "파스닐", text: "\"신라가 거기서 '기다리고' 있었어요.\"", background: "black", character: "파스닐", centerCharacter: true },
    { speaker: "시스템", text: "신라는 입을 열지 않는다.", background: "black", isProgress: true, hideCharacter: true, centeredMonologue: true },

    // 렌쟈 선택
    { speaker: "렌쟈", text: "\"…파스닐.\"", background: "black", character: "렌쟈", centerCharacter: true },
    { speaker: "시스템", text: "그녀는 어린아이에게 관대하다. 애매한 증거로는 설득할 수 없다.", background: "black", isProgress: true, hideCharacter: true, centeredMonologue: true },
    { speaker: "선택", text: "증거를 선택하세요", background: "black", hideCharacter: true, randomChoices: true, gunEffect: true, hideNormalTag: true, choices: [
      { text: "엘의 감염과 등장 시점", targetIndex: 1550 },
      { text: "고지나 표식 (일반 진행)", targetIndex: 1516 },
      { text: "출처 없는 정보", targetIndex: 1550 },
      { text: "지나치게 똑똑함", targetIndex: 1550 }
    ]},
    // 정답 루트 - 렌쟈
    { speaker: "렌쟈", text: "\"표식? 다시 얘기 해줘.\"", background: "black", character: "렌쟈", centerCharacter: true },
    { speaker: "시스템", text: "파스닐은 주머니에서 종이를 꺼낸다.", background: "black", isProgress: true, hideCharacter: true, centeredMonologue: true },
    { speaker: "시스템", text: "관측소 표식 메모.", background: "black", isProgress: true, hideCharacter: true, centeredMonologue: true },
    { speaker: "파스닐", text: "\"신라 가방에 있던 거예요.\"", background: "black", character: "파스닐", centerCharacter: true },
    { speaker: "렌쟈", text: "\"…이건\"", background: "black", character: "렌쟈", centerCharacter: true },
    { speaker: "파스닐", text: "\"고지나 연구소 지도에서 같은 표식 써요\"", background: "black", character: "파스닐", centerCharacter: true },
    { speaker: "렌쟈", text: "\"넌 누가 알려줬는데?\"", background: "black", character: "렌쟈", centerCharacter: true },
    { speaker: "파스닐", text: "\"뉴스죠. 함께 봤잖아요? 신라는 엘의 감염과 연관된 고지나 연구소의 위치를 알고있어요.\"", background: "black", character: "파스닐", centerCharacter: true },
    { speaker: "시스템", text: "렌쟈의 눈이 흔들린다.", background: "black", isProgress: true, hideCharacter: true, centeredMonologue: true },

    // 란 선택
    { speaker: "란", text: "\"…파스닐.\"", background: "black", character: "란", centerCharacter: true },
    { speaker: "시스템", text: "목소리는 여전히 부드럽다.", background: "black", isProgress: true, hideCharacter: true, centeredMonologue: true },
    { speaker: "시스템", text: "그는 렌쟈의 안전에 방해되는거에 극심한 강박이 있어보여. 불확실한 것에도 마찬가지겠지?", background: "black", isProgress: true, hideCharacter: true, centeredMonologue: true },
    { speaker: "선택", text: "증거를 선택하세요", background: "black", hideCharacter: true, randomChoices: true, gunEffect: true, hideNormalTag: true, choices: [
      { text: "엘의 감염과 등장 시점", targetIndex: 1550 },
      { text: "고지나 표식", targetIndex: 1550 },
      { text: "신라가 준 정보 (일반 진행)", targetIndex: 1532 },
      { text: "지나치게 똑똑함", targetIndex: 1550 }
    ]},
    // 정답 루트 - 란
    { speaker: "란", text: "\"신라가 준 정보들. 어떤 게 문제였습니까?\"", background: "black", character: "란", centerCharacter: true },
    { speaker: "파스닐", text: "\"출처요.\"", background: "black", character: "파스닐", centerCharacter: true },
    { speaker: "파스닐", text: "\"도로 봉쇄 위치, 감염 밀도, 보급 실패 지역.\"", background: "black", character: "파스닐", centerCharacter: true },
    { speaker: "란", text: "\"…정확했죠.\"", background: "black", character: "란", centerCharacter: true },
    { speaker: "파스닐", text: "\"너무요.\"", background: "black", character: "파스닐", centerCharacter: true },
    { speaker: "시스템", text: "란은 고개를 끄덕인다.", background: "black", isProgress: true, hideCharacter: true, centeredMonologue: true },
    { speaker: "란", text: "\"정보는 항상 누군가의 시점에서 옵니다.\"", background: "black", character: "란", centerCharacter: true },
    { speaker: "시스템", text: "잠깐의 침묵.", background: "black", isProgress: true, hideCharacter: true, centeredMonologue: true },
    { speaker: "란", text: "\"신라씨의 정보는 시점이 없는듯 하네요.\"", background: "black", character: "란", centerCharacter: true },
    { speaker: "신라", text: "\"…그냥 들은 거예요.\"", background: "black", character: "신라", centerCharacter: true },
    { speaker: "란", text: "\"... 저에겐 그게 가장 위험한 말로 들리네요.\"", background: "black", character: "란", centerCharacter: true },

    // 하카 선택
    { speaker: "하카", text: "\"내 차례지?\"", background: "black", character: "하카", centerCharacter: true },
    { speaker: "시스템", text: "그는 직감에 의지하고 자신이 놓친것에 더 강하게 반응할 것이다.", background: "black", isProgress: true, hideCharacter: true, centeredMonologue: true },
    { speaker: "선택", text: "증거를 선택하세요", background: "black", hideCharacter: true, randomChoices: true, gunEffect: true, hideNormalTag: true, choices: [
      { text: "엘의 감염과 등장 시점", targetIndex: 1550 },
      { text: "고지나 표식", targetIndex: 1550 },
      { text: "출처 없는 정보", targetIndex: 1550 },
      { text: "지나치게 똑똑함 (일반 진행)", targetIndex: 1549 }
    ]},
    // 정답 루트 - 하카
    { speaker: "하카", text: "\"신라가 똑똑하다고 느낀 거야? 난 모르겠는데.\"", background: "black", character: "하카", centerCharacter: true },
    { speaker: "파스닐", text: "\"네.\"", background: "black", character: "파스닐", centerCharacter: true },
    { speaker: "하카", text: "\"얼마나?\"", background: "black", character: "하카", centerCharacter: true },
    { speaker: "파스닐", text: "\"지형, 속도, 사람 반응까지. 모두요.\"", background: "black", character: "파스닐", centerCharacter: true },
    { speaker: "하카", text: "\"…애매하네.\"", background: "black", character: "하카", centerCharacter: true },
    { speaker: "파스닐", text: "\"아니요. 애매하지 않아요.\"", background: "black", character: "파스닐", centerCharacter: true },
    { speaker: "시스템", text: "파스닐은 하카를 본다.", background: "black", isProgress: true, hideCharacter: true, centeredMonologue: true },
    { speaker: "파스닐", text: "\"살아남은 사람의 계산이 아니라, 설계한 사람의 계산이었어요.\"", background: "black", character: "파스닐", centerCharacter: true },
    { speaker: "시스템", text: "하카는 웃지 않는다.", background: "black", isProgress: true, hideCharacter: true, centeredMonologue: true },
    { speaker: "하카", text: "\"…그 말, 되게 싫은데. 내가 놓친거 같잖아\"", background: "black", character: "하카", centerCharacter: true, jumpIndex: 1563 },

    // 미니게임 실패 - 배드엔딩
    { marker: "#미니게임실패", speaker: "엘", text: "\"... 난 그게 무슨 연관인지 모르겠는데, 나만 그런건가?\"", background: bgLivingRoom2, character: "엘" },
    { speaker: "시스템", text: "신라가 입을 연다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "신라", text: "\"이 사람, 나 처음부터 싫어했던거죠?\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "시스템", text: "작은 말들이 겹친다. 불신이 번진다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "하카", text: "\"이상하네. 증거 하나없이 몰아가는거야? 너도 외부인이란걸 잊고있던거야?\"", background: bgLivingRoom2, character: "하카" },
    { speaker: "데일", text: "\"오만하네\"", background: bgLivingRoom2, character: "데일" },
    { speaker: "란", text: "\"...\"", background: bgLivingRoom2, character: "란" },
    { speaker: "렌쟈", text: "\"…파스닐, 나가 있어.\"", background: bgLivingRoom2, character: "렌쟈" },
    { speaker: "시스템", text: "문이 닫힌다. 밖은 어둡고, 혼자다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "", text: "", isDeadEnd: true, deadEndTitle: "BAD END", deadEndSubtitle: "추방", background: "black" },

    // #완료 - 미니게임 성공 후
    { marker: "#완료", speaker: "시스템", text: "다시, 중심으로", background: bgLivingRoom2, isProgress: true },
    { speaker: "시스템", text: "렌쟈가 자리에서 일어난다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "렌쟈", text: "\"신라.\"", background: bgLivingRoom2, character: "렌쟈" },
    { speaker: "시스템", text: "신라는 고개를 든다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "렌쟈", text: "\"반박할 기회를 줄게.\"", background: bgLivingRoom2, character: "렌쟈" },
    { speaker: "신라", text: "\"…지금 이 상황에서 나 하나 몰아가면 엘은 돌아와?\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "렌쟈", text: "\"질문에 답해.\"", background: bgLivingRoom2, character: "렌쟈" },
    { speaker: "신라", text: "\"…난 그냥 도와준 거야.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "데일", text: "\"도와준 타이밍이 너무 정확해.\"", background: bgLivingRoom2, character: "데일" },
    { speaker: "하카", text: "\"그리고 너무 깨끗하지.\"", background: bgLivingRoom2, character: "하카" },
    { speaker: "란", text: "\"…그리고 너무 설명이 없습니다.\"", background: bgLivingRoom2, character: "란" },
    { speaker: "시스템", text: "파스닐은 마지막으로 말한다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "파스닐", text: "\"확신은 없어요.\"", background: bgLivingRoom2, character: "파스닐" },
    { speaker: "시스템", text: "잠깐의 정적.", background: bgLivingRoom2, isProgress: true },
    { speaker: "파스닐", text: "\"그래도 이 정도면 의심은 공유해야 해요.\"", background: bgLivingRoom2, character: "파스닐" },
    { speaker: "시스템", text: "모두가 신라를 본다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "시스템", text: "신라는 처음으로, 아무 말도 하지 않는다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "시스템", text: "불이 꺼진 거실에서 누구도 쉽게 결론을 내리지 않는다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "시스템", text: "하지만—", background: bgLivingRoom2, isProgress: true },
    { speaker: "시스템", text: "이제 모두가 같은 질문을 안고 있다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "시스템", text: "난로는 꺼져 있다. 누군가 불을 붙이자고 말하지 않는다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "시스템", text: "신라는 한 발 물러선다. 도망치는 거리도, 공격적인 거리도 아니다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "시스템", text: "그냥 말해야 하는 거리다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "신라", text: "\"…미안합니다.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "시스템", text: "짧다. 군더더기가 없다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "데일", text: "\"와. 진짜로 사과하네.\"", background: bgLivingRoom2, character: "데일" },
    { speaker: "하카", text: "\"이거 처음 보는 장면인데.\"", background: bgLivingRoom2, character: "하카" },
    { speaker: "시스템", text: "렌쟈는 말하지 않는다. 눈은 신라에게 고정돼 있다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "시스템", text: "란은 고개를 약간 숙인 채 듣고 있다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "신라", text: "\"고지나 연구소는 감염이 느린 개체를 찾고 있었습니다.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "시스템", text: "엘의 표정이 미세하게 굳는다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "신라", text: "\"엘은 너무 느렸어요.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "데일", text: "\"…뭐?\"", background: bgLivingRoom2, character: "데일" },
    { speaker: "신라", text: "\"보통은 12시간 안에 행동 패턴이 바뀝니다.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "하카", text: "\"근데 엘은?\"", background: bgLivingRoom2, character: "하카" },
    { speaker: "신라", text: "\"이틀.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "시스템", text: "정적.", background: bgLivingRoom2, isProgress: true },
    { speaker: "신라", text: "\"고지나는 그걸 '지연'이라고 불렀어요.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "신라", text: "\"전 관측 담당이었습니다.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "파스닐", text: "\"…스파이.\"", background: bgLivingRoom2, character: "파스닐" },
    { speaker: "신라", text: "\"네.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "시스템", text: "말을 피하지 않는다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "신라", text: "\"엘의 동선을 확인하고, 상태를 보고하라는 명령이었어요.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "란", text: "\"…그래서 우릴 따라온 겁니까.\"", background: bgLivingRoom2, character: "란" },
    { speaker: "신라", text: "\"아니요.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "시스템", text: "고개를 젓는다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "신라", text: "\"처음엔 멀리서만.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "렌쟈", text: "\"…그럼 물류창고는?\"", background: bgLivingRoom2, character: "렌쟈" },
    { speaker: "신라", text: "\"고지나 쪽 정보입니다.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "하카", text: "\"와. 우리 전부 실험 재료였네.\"", background: bgLivingRoom2, character: "하카" },
    { speaker: "신라", text: "\"란이 다칠 줄은 몰랐습니다.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "란", text: "\"의도하지 않았다는 말은 변명이 되지 않습니다.\"", background: bgLivingRoom2, character: "란" },
    { speaker: "신라", text: "\"…압니다.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "신라", text: "\"고지나는 엘을 '되돌릴 수 있는지' 확인하려 했습니다.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "파스닐", text: "\"…되돌린다고요?\"", background: bgLivingRoom2, character: "파스닐" },
    { speaker: "신라", text: "\"완전한 치료는 아니지만, 지연을 안정화시키는 방법은 있습니다.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "렌쟈", text: "\"…어디.\"", background: bgLivingRoom2, character: "렌쟈" },
    { speaker: "신라", text: "\"고지나 본부.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "데일", text: "\"거기 가면 살아 나온다고 보장돼?\"", background: bgLivingRoom2, character: "데일" },
    { speaker: "신라", text: "\"보장은 없습니다.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "하카", text: "\"역시.\"", background: bgLivingRoom2, character: "하카" },
    { speaker: "시스템", text: "신라는 고개를 숙인다. 이번엔 아까보다 깊다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "신라", text: "\"이제 절 놓아주실건가요?\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "렌쟈", text: "\"왜.\"", background: bgLivingRoom2, character: "렌쟈" },
    { speaker: "신라", text: "\"…엘이 실험 대상이 되는 건 제가 보기에도 선을 넘었던것 같습니다.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "데일", text: "\"와. 이제 와서 양심.\"", background: bgLivingRoom2, character: "데일" },
    { speaker: "신라", text: "\"...\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "하카", text: "\"그냥 우리한테 맞아 죽을까봐 협조하는거 같은데\"", background: bgLivingRoom2, character: "하카" },
    { speaker: "시스템", text: "신라는 파스닐을 본다.", background: bgLivingRoom2, isProgress: true },

    // #A2 - 특수 배경 1
    { marker: "#A2", speaker: "신라", text: "\"그래도 당신 말이 맞았습니다.\"", background: bgA2, hideCharacter: true },
    { speaker: "파스닐", text: "\"…뭘요.\"", background: bgA2, hideCharacter: true },
    { speaker: "신라", text: "\"의심했어야 했던 건 나였습니다.\"", background: bgA2, hideCharacter: true },
    { speaker: "신라", text: "\"조용하신 분들이 무서운 법이지요.\"", background: bgA2, hideCharacter: true },
    { speaker: "파스닐", text: "내가 조용한 편이었나..", background: bgA2, isMonologue: true, hideCharacter: true },
    { speaker: "신라", text: "\"보통 음침한 취미를 숨기고 다니니까요.\"", background: bgA2, hideCharacter: true },
    { speaker: "신라", text: "\"남의 가방 열어보기 같은.\"", background: bgA2, hideCharacter: true },
    { speaker: "파스닐", text: "\"조사도 못합니까.\"", background: bgA2, hideCharacter: true },
    { speaker: "신라", text: "\"아아, 당연히 해도 되죠. 다만 이런식의 심문은 말이에요- 파스닐.\"", background: bgA2, hideCharacter: true },

    // #A3 - 특수 배경 2 + 흔들림 효과
    { marker: "#A3", speaker: "시스템", text: "그는 나에게만 아주 보일 정도로 표정을 찌푸렸다.", background: bgA3, isProgress: true, hideCharacter: true, shakeOnEnter: true, effect: "shake" },
    { speaker: "신라", text: "\"제가 무기를 가지고 있었다면요?\"", background: bgA3, hideCharacter: true },
    { speaker: "신라", text: "\"아니, 내가 고지나에 대한 정보를 수집한 평범한 꼬맹이라면?\"", background: bgA3, hideCharacter: true },
    { speaker: "신라", text: "\"순순히 엘을 돌려둘 정보를 말해줄 계획이었다면?\"", background: bgA3, hideCharacter: true },
    { speaker: "파스닐", text: "나는 차마 그의 얼굴을 볼 수 없었다.", background: bgA3, isMonologue: true, hideCharacter: true },
    { speaker: "파스닐", text: "맞는 말이었다.", background: bgA3, isMonologue: true, hideCharacter: true },
    { speaker: "파스닐", text: "확신이 섰다고 꼭 행동으로 옮길 필요는 없었다.", background: bgA3, isMonologue: true, hideCharacter: true },

    // #A4 - 거실로 복귀
    { marker: "#A4", speaker: "시스템", text: "렌쟈는 잠깐 눈을 감았다 뜬다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "렌쟈", text: "\"엘을 되돌릴 수 있는 가능성.\"", background: bgLivingRoom2, character: "렌쟈" },
    { speaker: "신라", text: "\"있습니다.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "렌쟈", text: "\"…얼마나.\"", background: bgLivingRoom2, character: "렌쟈" },
    { speaker: "신라", text: "\"지금 상태면 아직.\"", background: bgLivingRoom2, character: "신라" },
    { speaker: "시스템", text: "렌쟈는 고개를 끄덕인다. 결정은 빠르다.", background: bgLivingRoom2, isProgress: true },
    { speaker: "란", text: "\"…누님.\"", background: bgLivingRoom2, character: "란" },

    // 현재 스토리 끝
    { marker: "END", speaker: "시스템", text: "현재 스토리의 끝입니다.", isProgress: true, background: bgLivingRoom2, onComplete: () => { setGameState("start"); setDialogueIndex(0); } }
  ], [dialogueIndex]);
  const chapters: Chapter[] = useMemo(() => [
    { id: 1, title: "1장: 프롤로그", marker: "BEGIN", index: 0, locked: false },
    { id: 2, title: "2장: 별장 도착", marker: "#C3", index: 62, locked: maxReachedIndex < 62 },
    { id: 3, title: "3장: 탐색과 조우", marker: "#C9", index: 175, locked: maxReachedIndex < 175 },
    { id: 4, title: maxReachedIndex >= 240 ? "4장: 병원 잠입" : "4장: ???", marker: "#C13", index: 240, locked: maxReachedIndex < 240 },
    { id: 5, title: maxReachedIndex >= 565 ? "5장: 데일의 생환" : "5장: ???", marker: "#C20", index: 565, locked: maxReachedIndex < 565 },
    { id: 6, title: maxReachedIndex >= 493 ? "6장: 긴박한 탈출" : "6장: ???", marker: "#D8", index: 493, locked: maxReachedIndex < 493 },
    { id: 7, title: maxReachedIndex >= 800 ? "7장: 산길" : "7장: ???", marker: "#2_Mountain", index: 800, locked: maxReachedIndex < 800 },
    { id: 8, title: maxReachedIndex >= 920 ? "8장: 의문의 소년" : "8장: ???", marker: "#7_Return", index: 920, locked: maxReachedIndex < 920 },
    { id: 9, title: maxReachedIndex >= 960 ? "9장: 평화로운 낮" : "9장: ???", marker: "#8_Day6", index: 960, locked: maxReachedIndex < 960 }
  ], [maxReachedIndex]);

  const currentDialogue = story[dialogueIndex];

  // Preload Background Images
  useEffect(() => {
    const backgrounds = [
      bgStart, bgClip1, bgClip2, bgLivingRoom, bgBalcony, 
      bgNearForest, bgStorage, bgCity1, bgMart, bgNearHospital, bgHospital,
      bgC16, bgHospitalNew, bgNearHospitalNew, bgLivingRoomNew,
      bgD1, bgD2, bgD3, bgD5, bgD5_New, bgD6, bgH1, bgD10, bgF2, bgF3, bgLivingRoomUpdate, bgG2, bg_2, bg_4, bg_5
    ];
    backgrounds.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === "story" && !currentDialogue?.choices && !currentDialogue?.isPuzzle) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleNext();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, dialogueIndex, currentDialogue]);

  // Audio handling - Background Music
  useEffect(() => {
    if (gameState === "story") {
      if (currentDialogue?.audio === "stop") {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      } else if (currentDialogue?.audio) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(currentDialogue.audio);
        audioRef.current.loop = true;
        audioRef.current.volume = currentDialogue.audioVolume ?? 0.4;
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
  }, [gameState, currentDialogue?.audio, currentDialogue?.marker]);

  // Audio handling - Sound Effects (overlay)
  useEffect(() => {
    if (gameState === "story" && currentDialogue?.sfx) {
      const sfx = new Audio(currentDialogue.sfx);
      sfx.loop = false;
      sfx.volume = currentDialogue.sfxVolume ?? 0.6;
      sfx.play().catch(() => {});
      sfxRef.current = sfx;
    }
  }, [gameState, dialogueIndex, currentDialogue?.sfx]);

  // Sync memo state with dialogue index (for chapter select / save load)
  useEffect(() => {
    if (gameState === "story") {
      // Check if we're in a memo section by looking at surrounding dialogue
      const inMemoSection = story.slice(0, dialogueIndex + 1).some((d, i) => {
        if (d.showMemo) {
          // Check if there's a hideMemo after this showMemo and before current index
          const hideAfter = story.slice(i + 1, dialogueIndex + 1).some(d2 => d2.hideMemo);
          return !hideAfter;
        }
        return false;
      });
      setShowMemo(inMemoSection);
    } else {
      setShowMemo(false);
    }
  }, [dialogueIndex, gameState, story]);

  // Shuffle choices when dialogue with randomChoices is shown
  useEffect(() => {
    if (currentDialogue?.choices && currentDialogue?.randomChoices) {
      const shuffled = [...currentDialogue.choices].sort(() => Math.random() - 0.5);
      setShuffledChoices(shuffled);
    } else {
      setShuffledChoices([]);
    }
  }, [dialogueIndex, currentDialogue?.randomChoices]);

  const handleNext = useCallback(() => {
    if (currentDialogue.choices) return;
    if (currentDialogue.isPuzzle) return;
    
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
  }, [currentDialogue, dialogueIndex, story]);

  const handleChoice = (targetIndex: number) => {
    setDialogueIndex(targetIndex);
  };

  const handlePuzzleSubmit = () => {
    const answer = currentDialogue.puzzleAnswer || "눈";
    if (puzzleInput.includes(answer)) {
      setPuzzleInput("");
      setDialogueIndex(dialogueIndex + 1);
    }
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

  const saveGame = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem("game_save_index", dialogueIndex.toString());
    setHasSaveData(true);
    // Visual feedback for save
    const btn = e.currentTarget as HTMLButtonElement;
    btn.style.color = "#22c55e"; // green
    setTimeout(() => {
      btn.style.color = "";
    }, 1000);
  };

  // Find the appropriate audio for a given index by looking back through story
  const findAudioForIndex = (index: number): string | null => {
    for (let i = index; i >= 0; i--) {
      const line = story[i];
      if (line.audio) {
        if (line.audio === "stop") return null;
        return line.audio;
      }
    }
    return null;
  };

  // Start audio for a given track
  const startAudio = (audioSrc: string | null) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioSrc) {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});
    }
  };

  const loadGame = () => {
    const savedIndex = localStorage.getItem("game_save_index");
    if (savedIndex !== null) {
      const idx = parseInt(savedIndex);
      setDialogueIndex(idx);
      setGameState("story");
      // Start appropriate audio for this position
      const audio = findAudioForIndex(idx);
      startAudio(audio);
    }
  };

  const jumpToChapter = (index: number) => {
    setDialogueIndex(index);
    setGameState("story");
    // Start appropriate audio for this chapter
    const audio = findAudioForIndex(index);
    startAudio(audio);
  };

  const getCharacterImage = (name?: string, index?: number) => {
    if (!name || name === "시스템" || name === "TV" || name === "TV 앵커") return null;
    
    // Character V2 logic (starting from #C10 which is index 189)
    const isV2 = index !== undefined && index >= 189;

    switch (name) {
      case "하카": return isV2 ? imgHaka2 : imgHaka;
      case "란": return isV2 ? imgRan2 : imgRan;
      case "렌쟈": return isV2 ? imgRenja2 : imgRenja;
      case "엘": return isV2 ? imgEl2 : imgEl;
      case "데일": return imgDale;
      case "소년": return { src: imgSilla, silhouette: true };
      case "소년1":
      case "신라": return imgSilla;
      case "파스닐": 
        // Pasnil visible in CLIP1 (indices 0-4) and minigame scenes (1482+)
        if (index !== undefined && index <= 4) return imgPasnil;
        if (index !== undefined && index >= 1482) return imgPasnil2;
        return null;
      case "파스닐2":
        return imgPasnil2;
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
    if (!currentDialogue) {
      return <div className="w-full h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    }

    // DEAD ENDING Screen
    if (currentDialogue.isDeadEnd) {
      return (
        <div 
          className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleNext}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-6xl font-black text-red-600 tracking-widest mb-8"
              style={{ 
                fontFamily: "'Oxanium', sans-serif",
                textShadow: '0 0 60px rgba(220, 38, 38, 0.6), 0 0 120px rgba(220, 38, 38, 0.3)'
              }}
            >
              {currentDialogue.deadEndTitle || "DEAD ENDING"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-white/50 text-lg font-light tracking-wider italic"
            >
              {currentDialogue.deadEndSubtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="mt-12 text-white/20 text-sm font-mono tracking-widest"
            >
              클릭하여 계속
            </motion.div>
          </motion.div>
        </div>
      );
    }

    // Minigame Title Screen
    if (currentDialogue.isMinigameTitle) {
      return (
        <div 
          className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleNext}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-7xl font-black text-red-600 tracking-widest mb-4"
              style={{ 
                fontFamily: "'Oxanium', sans-serif",
                textShadow: '0 0 80px rgba(220, 38, 38, 0.8), 0 0 160px rgba(220, 38, 38, 0.4)'
              }}
            >
              {currentDialogue.text}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-12 text-white/30 text-sm font-mono tracking-widest"
            >
              클릭하여 시작
            </motion.div>
          </motion.div>
        </div>
      );
    }

    const charImgResult = currentDialogue.hideCharacter ? null : getCharacterImage(currentDialogue.character || currentDialogue.speaker, dialogueIndex);
    const charImg = charImgResult && typeof charImgResult === 'object' && 'src' in charImgResult ? charImgResult.src : charImgResult;
    const isSilhouette = charImgResult && typeof charImgResult === 'object' && 'silhouette' in charImgResult ? charImgResult.silhouette : false;
    
    // Effect class
    let effectClass = "";
    if (currentDialogue.effect === "shake" || currentDialogue.shakeOnEnter) effectClass = "animate-shake";
    if (currentDialogue.effect === "chase") effectClass = "animate-pulse scale-105 transition-transform duration-300";
    if (currentDialogue.effect === "carShake") effectClass = "animate-car-shake";

    return (
      <div className={`relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-end ${effectClass}`} onClick={handleClick}>
        {/* Red Eye Effect for F1 Puzzle */}
        {currentDialogue.eyeEffect && (
          <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
            <div className="relative">
              <div 
                className="w-32 h-32 rounded-full opacity-20 animate-pulse"
                style={{
                  background: 'radial-gradient(circle, rgba(220,38,38,0.8) 0%, rgba(220,38,38,0.3) 40%, rgba(0,0,0,0) 70%)',
                  boxShadow: '0 0 80px 40px rgba(220,38,38,0.15), 0 0 120px 60px rgba(220,38,38,0.08)',
                }}
              />
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: 'scale(0.3)' }}
              >
                <div 
                  className="w-16 h-16 rounded-full bg-black/80"
                  style={{ boxShadow: '0 0 20px 10px rgba(0,0,0,0.5)' }}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Red Snow Particles for Puzzle */}
        {currentDialogue.isPuzzle && (
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            {dustParticles.map(p => (
              <div 
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size + 1}px`,
                  height: `${p.size + 1}px`,
                  opacity: p.opacity,
                  backgroundColor: "#DC2626",
                  filter: 'blur(1px)',
                  transition: 'all 0.1s linear'
                }}
              />
            ))}
          </div>
        )}

        {/* Save Button - hidden for textOnly mode */}
        {!currentDialogue.textOnly && (
          <div className="absolute top-8 right-8 z-50 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-[10px] text-white/30 hover:text-white hover:bg-white/5 border border-white/5 uppercase tracking-tighter"
              onClick={saveGame}
              data-testid="button-save"
            >
              <Save className="w-3 h-3 mr-1" />
              Save Point
            </Button>
          </div>
        )}

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

        {/* Top letterbox - hidden for textOnly mode */}
        {!currentDialogue.textOnly && (
          <div className="absolute top-0 left-0 w-full h-[10%] bg-black z-30 pointer-events-none" />
        )}
        
        {/* Background - hidden for textOnly mode */}
        {!currentDialogue.textOnly && (
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
                {currentDialogue.background === "black" ? (
                  <div className="w-full h-full bg-black" />
                ) : (
                  <img 
                    src={currentDialogue.background || bgClip1} 
                    className="w-full h-full object-cover filter brightness-[0.6] contrast-[1.1] saturate-[0.8]"
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
          </div>
        )}

        {/* Character - hidden for textOnly mode */}
        {!currentDialogue.textOnly && (
          <AnimatePresence mode="wait">
            {charImg && (
              <motion.div
                key={`${currentDialogue.character || currentDialogue.speaker}-${dialogueIndex}`}
                initial={{ opacity: 0, x: currentDialogue.centerCharacter ? 0 : 20, scale: currentDialogue.centerCharacter ? 0.9 : 1 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: currentDialogue.centerCharacter ? 0 : -20, scale: currentDialogue.centerCharacter ? 0.9 : 1 }}
                transition={{ duration: 0.5 }}
                className={`absolute h-[100%] w-auto pointer-events-none z-10 ${currentDialogue.centerCharacter ? 'bottom-[-15%] left-1/2 -translate-x-1/2' : 'bottom-[-15%]'}`}
              >
                <img 
                  src={charImg} 
                  className="h-full object-contain drop-shadow-[0_0_40px_rgba(0,0,0,0.9)]"
                  style={isSilhouette ? { filter: 'brightness(0) saturate(100%)' } : undefined}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Memo Display - Large, Left Side */}
        <AnimatePresence>
          {showMemo && (
            <motion.div
              initial={{ x: -400, opacity: 0, rotate: 5 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              exit={{ x: -400, opacity: 0, rotate: -5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute left-8 top-16 z-30 pointer-events-none"
            >
              <img 
                src={imgMemo} 
                className="w-[900px] h-auto drop-shadow-[0_0_50px_rgba(0,0,0,0.95)]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click Hint Effect - Larger, More Visible, Clickable */}
        {currentDialogue.clickHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: [1, 1.1, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute right-16 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 cursor-pointer"
            onClick={handleNext}
          >
            <div className="w-20 h-20 rounded-full border-4 border-red-600 bg-red-600/30 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)]">
              <ChevronRight className="w-10 h-10 text-white" />
            </div>
            <span className="text-red-500 text-sm font-bold tracking-wider uppercase">클릭</span>
          </motion.div>
        )}

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`relative z-20 cursor-pointer group ${currentDialogue.centeredMonologue ? 'w-full max-w-2xl' : 'w-[85%] max-w-3xl mb-16'}`}
          style={currentDialogue.centeredMonologue ? { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } : undefined}
          onClick={handleNext}
        >
          {currentDialogue.isProgress && !currentDialogue.choices && !currentDialogue.isPuzzle ? (
            <div className={`p-5 rounded-lg text-center ${currentDialogue.centeredMonologue ? 'bg-transparent' : 'bg-black/20'}`}>
              <p className={`font-light tracking-widest italic ${currentDialogue.centeredMonologue ? 'text-xl leading-relaxed' : 'text-base'} ${currentDialogue.redText ? 'text-red-600 uppercase font-bold' : 'text-white/70'}`}>
                {currentDialogue.text}
              </p>
            </div>
          ) : (
            <div className="bg-neutral-950/90 backdrop-blur-md p-6 rounded-sm border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600/50" />
              <div className="flex items-center gap-3 mb-2">
                <span className="text-red-600 font-bold text-base tracking-tight uppercase">
                  {currentDialogue.speaker}
                </span>
                {currentDialogue.expression && (
                  <span className="text-white/30 text-[10px] font-normal tracking-wide bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    {currentDialogue.expression}
                  </span>
                )}
              </div>
              
              <div className={`text-white/90 text-lg font-normal leading-relaxed ${currentDialogue.isMonologue ? 'text-white/60 italic' : ''}`}>
                {currentDialogue.text}
              </div>

              {currentDialogue.isPuzzle && (
                <div className="mt-6 flex gap-2">
                  <Input 
                    placeholder="대답을 입력하세요..."
                    value={puzzleInput}
                    onChange={(e) => setPuzzleInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePuzzleSubmit()}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-none focus-visible:ring-red-600"
                  />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="bg-red-600/20 hover:bg-red-600/40 text-red-600 border border-red-600/30"
                    onClick={handlePuzzleSubmit}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {currentDialogue.choices && !currentDialogue.randomChoices && (
                <div className="mt-6 grid grid-cols-1 gap-2">
                  {currentDialogue.choices.map((choice, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className="w-full justify-start py-4 text-base font-medium border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all rounded-none text-white/80"
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
              
              {/* Random Choice Minigame Mode */}
              {currentDialogue.choices && currentDialogue.randomChoices && shuffledChoices.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {shuffledChoices.map((choice, i) => {
                    const displayText = currentDialogue.hideNormalTag 
                      ? choice.text.replace(/\s*\(일반 진행\)\s*/g, '')
                      : choice.text;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="group relative"
                      >
                        {/* Gun Targeting Effect */}
                        {currentDialogue.gunEffect && (
                          <div className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <div className="w-5 h-5 rounded-full border-2 border-red-600 relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-red-600" />
                              </div>
                              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[2px] h-2 bg-red-600" />
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[2px] h-2 bg-red-600" />
                              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-[2px] bg-red-600" />
                              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-[2px] bg-red-600" />
                            </div>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          className={`w-full justify-center py-6 text-lg font-bold border-2 transition-all rounded-md relative overflow-visible
                            ${currentDialogue.gunEffect 
                              ? 'border-red-600/50 bg-black/80 hover:bg-red-900/30 hover:border-red-500 text-white hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]' 
                              : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChoice(choice.targetIndex);
                          }}
                        >
                          {displayText}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {!currentDialogue.choices && !currentDialogue.isPuzzle && (
                <div className="absolute bottom-4 right-6 opacity-30 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-4 h-4 text-white animate-pulse" />
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Bottom letterbox - hidden for textOnly mode */}
        {!currentDialogue.textOnly && (
          <div className="absolute bottom-0 left-0 w-full h-[10%] bg-black z-30 pointer-events-none" />
        )}
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black flex flex-col p-16"
      onMouseMove={(e) => {
        const x = (e.clientX - window.innerWidth / 2) / 150;
        const y = (e.clientY - window.innerHeight / 2) / 150;
        setMousePosition({ x, y });
      }}
      onClick={handleClick}
    >
      {/* SF UI Overlays */}
      <div className="absolute inset-0 pointer-events-none border-[20px] border-white/5 z-40" />
      <div className="absolute top-0 left-0 w-full h-[12%] bg-black z-30 flex items-center px-16 justify-between border-b border-white/5">
        <div className="flex items-center gap-8 text-[10px] text-white/20 font-mono tracking-widest">
          <div className="flex items-center gap-2"><Zap className="w-3 h-3" /> CORE_STABLE</div>
          <div className="flex items-center gap-2"><Activity className="w-3 h-3" /> SYNC_98.4%</div>
          <div className="flex items-center gap-2"><Shield className="w-3 h-3" /> ENCRYPT_ON</div>
        </div>
        <div className="text-white/40 text-[10px] font-mono">2026.01.06 // APO_AU_SYSTEM</div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[12%] bg-black z-30 flex items-center px-16 justify-between border-t border-white/5">
        <div className="flex items-center gap-4 text-white/20 text-[8px] font-mono uppercase">
          <span>Boot Sequence Complete</span>
          <div className="w-32 h-[1px] bg-white/10" />
          <span>Sector 04 Verified</span>
        </div>
        <div className="flex gap-4">
          <div className="w-2 h-2 bg-red-600/50 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-red-600/30 rounded-full animate-pulse delay-75" />
          <div className="w-2 h-2 bg-red-600/10 rounded-full animate-pulse delay-150" />
        </div>
      </div>

      {/* Decorative SF UI Corners */}
      <div className="absolute top-[15%] left-16 w-32 h-32 border-l border-t border-red-600/20 z-30 pointer-events-none" />
      <div className="absolute bottom-[15%] right-16 w-32 h-32 border-r border-b border-red-600/20 z-30 pointer-events-none" />

      {/* Dust Particles */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {dustParticles.map(p => (
          <div 
            key={p.id}
            className="absolute rounded-full bg-white/60"
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

      <div
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.05)` }}
      >
        <img src={bgStart} className="w-full h-full object-cover opacity-30 filter saturate-[0.3] contrast-[1.3] brightness-[0.8]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-1 w-full max-w-7xl mx-auto items-center justify-between mt-12 mb-12">
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-[1px] bg-red-600" />
            <span className="text-red-600/60 font-mono text-xs tracking-[0.5em] uppercase">Post-Apocalyptic Era</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-8xl font-black text-red-600/90 tracking-tighter leading-none" 
            style={{ 
              fontFamily: "'Oxanium', sans-serif",
              filter: 'drop-shadow(0 0 30px rgba(220, 38, 38, 0.4))' 
            }}
          >
            아포AU
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-light text-red-600/40 tracking-[1.2rem] mt-4 ml-3"
          >
            2026
          </motion.h2>
          
          <div className="mt-16 flex flex-col gap-2">
            <div className="flex items-center gap-3 text-white/20 mb-4">
              <LayoutGrid className="w-4 h-4" />
              <span className="text-[10px] font-mono tracking-widest uppercase italic">Chapter Selection Protocol</span>
            </div>
            <div className="h-[200px] overflow-y-auto overflow-x-hidden chapter-scroll pr-2">
              <div className="grid grid-cols-2 gap-3 w-[450px]">
                {chapters.map(chapter => (
                  <Button
                    key={chapter.id}
                    variant="ghost"
                    disabled={chapter.locked}
                    onClick={() => jumpToChapter(chapter.index)}
                    className={`h-12 justify-between px-4 border border-white/5 rounded-none font-mono text-[10px] tracking-widest uppercase transition-all
                      ${chapter.locked 
                        ? "bg-white/5 text-white/10 cursor-not-allowed" 
                        : "bg-red-600/5 text-white/60 hover:bg-red-600/20 hover:text-white hover:border-red-600/30"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-red-600/40">0{chapter.id}</span>
                      {chapter.title}
                    </div>
                    {chapter.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3 text-red-600/40" />}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col mb-8 text-right font-mono">
            <span className="text-white/10 text-[8px] uppercase mb-1">System Load Sequence</span>
            <div className="flex gap-1 justify-end">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-4 h-1 bg-red-600/20" />
              ))}
            </div>
          </div>
          
          <Button
            size="lg"
            className="w-64 h-14 text-lg font-bold bg-red-700/80 hover:bg-red-600 text-white rounded-none border border-red-500/30 transition-all hover:translate-x-2 group relative overflow-hidden"
            onClick={() => {
              setDialogueIndex(0);
              setGameState("video");
            }}
            data-testid="button-start"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            시작하기
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-64 h-12 text-base rounded-none border border-white/5 transition-all flex justify-between px-6 group ${
              hasSaveData 
                ? "text-white/80 hover:text-white hover:bg-white/10 border-white/20" 
                : "text-white/10 cursor-not-allowed opacity-50"
            }`}
            onClick={hasSaveData ? loadGame : undefined}
            disabled={!hasSaveData}
            data-testid="button-continue"
          >
            <span>이어하기</span>
            <Cpu className={`w-4 h-4 transition-transform group-hover:rotate-90 ${hasSaveData ? 'text-red-600/40' : ''}`} />
          </Button>
          
          <Button variant="ghost" className="w-64 h-12 text-base text-white/40 hover:text-white hover:bg-white/5 rounded-none border border-white/5 flex justify-between px-6" data-testid="button-settings">
            <span>설정</span>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
