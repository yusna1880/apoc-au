import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Settings, Info, ChevronRight, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

// Assets - Characters (Normal)
import imgHaka from "@assets/하카_1767627793844.png";
import imgRan from "@assets/란_1767627793837.png";
import imgRenja from "@assets/렌쟈_1767627793839.png";
import imgEl from "@assets/엘_1767627793842.png";
import imgPasnil from "@assets/파스닐_1767631756273.png";
import imgDale from "@assets/데일_1767642442612.png";

// Assets - Characters (V2)
import imgHaka2 from "@assets/하카2_1767637478411.png";
import imgRan2 from "@assets/란2_1767637478406.png";
import imgRenja2 from "@assets/렌쟈2_1767637478408.png";
import imgEl2 from "@assets/엘2_1767637478414.png";

// Assets - Audio
import bgMusicStart from "@assets/Screen_Recording_20260106-003832_YouTube_1767628059034.mp3";
import bgMusic1 from "@assets/Screen_Recording_20260106-012639_YouTube_(1)_1767633094663.mp3";
const bgMusicBalcony = "/attached_assets/videoplayback_1767633518219.weba";
import bgMusicCity from "@assets/Screen_Recording_20260106-023850_YouTube_1767634933495.mp3";
import bgMusicC16 from "@assets/Screen_Recording_20260106-044430_YouTube_(1)_1767642743472.mp3";

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
  marker?: string;
  hideCharacter?: boolean;
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
  const [hasSaveData, setHasSaveData] = useState(false);

  // Check for save data on mount
  useEffect(() => {
    const savedIndex = localStorage.getItem("game_save_index");
    if (savedIndex !== null) {
      setHasSaveData(true);
    }
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
    // CLIP 1
    { speaker: "파스닐", text: "요즘 ai가 발전해서 내가 할 일이 없네", background: bgClip1, character: "파스닐", isMonologue: true },
    { speaker: "파스닐", expression: "이메일을 확인한다", text: "...", background: bgClip1, character: "파스닐", isMonologue: true },
    { speaker: "파스닐", text: "초청 DJ 문의? 수상하긴 하지만 원체 부자들은 외진 곳을 좋아하니깐..", background: bgClip1, character: "파스닐", isMonologue: true },
    { speaker: "파스닐", text: "가 아니라 하필 나를?!", background: bgClip1, character: "파스닐", isMonologue: true },
    { speaker: "파스닐", expression: "통장장고가 눈에 스쳐지나간다.", text: "뭐 익명 파티인가 보지.", background: bgClip1, character: "파스닐", isMonologue: true, triggerTransition: true },
    
    // CLIP 2 (Dialogue starts here)
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
    
    { speaker: "하카", expression: "손뼉을 한 번 친다", text: "자, 다 왔네. 일단 안으로 들어가자.", background: bgClip2, character: "하카", audio: "stop" },
    
    // #C3 - 거실 (Dialogue index 62)
    { marker: "#C3", speaker: "시스템", text: "문이 닫히는 소리가 뒤에서 났다. 확실하게. 나는 장비 가방을 바닥에 내려놓고 자리를 잡는다.", background: bgLivingRoom, isProgress: true },
    { speaker: "하카", expression: "소파에 털썩 앉아 다리를 뻗는다", text: "아직 다 살아 있네. 일단.", background: bgLivingRoom, character: "하카" },
    { speaker: "엘", expression: "가방을 내려놓으며 담담하게", text: "여기까지 왔는데 안 괜찮을 확률이 더 낮지.", background: bgLivingRoom, character: "엘" },
    { speaker: "렌쟈", expression: "사람들 얼굴을 한 번씩 훑는다", text: "괜찮아 보여도 체크는 해야지.", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "란", expression: "바로 고개 숙여", text: "필요한 물품이나 불편한 점 있으면 말씀 주십시오.", background: bgLivingRoom, character: "란" },
    { speaker: "하카", expression: "입꼬리 올리며", text: "봐라. 이래서 란이 있지.", background: bgLivingRoom, character: "란" },
    { speaker: "란", expression: "조금 난처하게", text: "…습관입니다.", background: bgLivingRoom, character: "란" },
    { speaker: "하카", text: "하카는 더 말하지 않고 웃는다. 의미 없는 웃음은 아니다.", background: bgLivingRoom, character: "하카" },
    { speaker: "시스템", text: "나는 콘센트 위치를 다시 확인한다. 손이 바쁘면, 시선이 덜 튄다. 이 사람들, 말보다 표정이 더 빠르다.", background: bgLivingRoom, isProgress: true },
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
    
    // #1 (Dialogue index 90)
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
    { speaker: "엘", text: "바람 좀 고 올게.", background: bgLivingRoom, character: "엘" },
    { speaker: "렌쟈", text: "오빠 그러다가 데일 언니처럼 감기걸려", background: bgLivingRoom, character: "렌쟈" },
    { speaker: "엘", text: "너도 와.", background: bgLivingRoom, character: "엘" },
    { speaker: "시스템", text: "나는 고개를 끄덕이고 엘을 따라간다.", background: bgLivingRoom, isProgress: true },
    
    // #C4 - 발코니 (Dialogue index 107)
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
    
    // #C5 - 거실 (Dialogue index 123)
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
    
    // #C6 - 숲근처 (Dialogue index 139)
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

    // DEAD END 1
    { speaker: "시스템", text: "나는 멈춘다. 한 걸음만 더. 그 순간, 그것의 고개가 나를 정확히 향한다. 너무 정확해서— 도망칠 생각이 늦는다.", isProgress: true, background: bgNearForest },
    { speaker: "란", expression: "처음으로 목소리가 높아진다", text: "파스닐—!", background: bgNearForest, character: "란" },
    { speaker: "시스템", text: "잡아당기는 힘. 넘어짐. 이빨이 너무 가까이 있다.", isProgress: true, background: bgNearForest },
    { speaker: "시스템", text: "[데드엔딩] 혼자 확인하는 건 용기가 아니라 이탈이다.", isProgress: true, background: bgNearForest, onComplete: () => { setGameState("start"); setDialogueIndex(0); } },
    
    // NORMAL PROCEED
    { speaker: "시스템", text: "나는 망설이지 않고 란의 뒤를 따른다. 지금은 판단을 나눌 때다.", isProgress: true, background: bgNearForest },
    { speaker: "시스템", text: "외부, 창고 근처. 밤. 공기엔 풀 냄새와 함께 어딘지 모르게 탁한 기운이 섞여 있다. 손전등이 어두운 숲길을 조심스럽게 비춘다. 나뭇잎 흔들리는 소리가 불규칙하게 울린다.", isProgress: true, background: bgNearForest },
    { speaker: "시스템", text: "란은 발소리를 줄이며 별장 옆 창고 쪽으로 향한다.", isProgress: true, background: bgNearForest },
    { speaker: "란", text: "바람 방향은 북동. 공기 중에 연소 냄새… 나무 타는 냄새가 아닌데..", background: bgNearForest, character: "란" },
    { speaker: "란", text: "여기일지도 몰라.", background: bgNearForest, character: "란" },
    
    // #C7 - 창고 (Dialogue index 157)
    { marker: "#C7", speaker: "시스템", text: "끼익. 문이 작게 열리고, 먼지 낀 냄새가 확 풍긴다. 창고 안엔 오래된 캠핑 장비, 예비용 발전기, 부탄가스 박스 등이 정리돼 있다. 그러나 그중 한 박스가 미묘하게 어긋나 있다.", background: bgStorage, isProgress: true, audio: "stop" },
    { speaker: "란", text: "누군가 손 댄 흔적이… 우리 중 누군가가 이걸 손봤나? 오늘 누구도 창고엔 안 왔는데.", background: bgStorage, character: "란" },
    { speaker: "시스템", text: "박스를 열어보자 안에는 비상식량 몇 개가 빠져 있고, 안쪽엔 뭔가가 떨어져 있다. 군용 의료 마스크. 이미 포장을 뜯은 흔적이 있는, 낯선 브랜드.", background: bgStorage, isProgress: true },
    { speaker: "란", text: "...이건 별장에서 보관한 적 없는 물건이다.", background: bgStorage, character: "란" },
    { speaker: "시스템", text: "그때, 창고 외부에서 '탁', 무언가가 떨어지는 소리. 란과 나는 재빨리 몸을 낮추고 손전등을 끈다. 숨소리를 죽인다. 밖에선 바람이 흔드는 나뭇잎 소리와는 전혀 다른… 천천히 끌리는 발소리가 들려온다.", isProgress: true, background: bgStorage },
    { speaker: "란", text: "이건, 짐승이 아니네요. 걸음이… 너무 느려요.", background: bgStorage, character: "란" },
    
    // #C8 - 거실 (Dialogue index 163)
    { marker: "#C8", speaker: "시스템", text: "별장 안 — 거실. 문이 열리는 소리가 너무 크게 들렸다.", background: bgLivingRoom, isProgress: true, audio: bgMusicCity },
    { speaker: "란", text: "돌아왔습니다.", background: bgLivingRoom, character: "란" },
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
    
    // #C9 - 거실 (Dialogue index 175)
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
    
    // #C10 - 도시1 (Dialogue index 189)
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
    
    // #C11 - 마트 (Dialogue index 199)
    { marker: "#C11", speaker: "시스템", text: "마트. 자동문은 열려 있다. 전기가 있어서가 아니라 부서져서. 안은 생각보다 조용하다. 선반은 많이 비어 있지만 완전히 털린 건 아니다.", background: bgMart, isProgress: true, audio: "stop" },
    { speaker: "엘", text: "필요한 것만. 다시 올 수 있어야 의미가 있어.", background: bgMart, character: "엘" },
    { speaker: "렌쟈", text: "통조림, 물, 건전지. 유통기한 긴 걸로. 의약품도 있으면 좋고.", background: bgMart, character: "렌쟈" },
    { speaker: "파스닐", text: "이 정도면 이틀 반.", background: bgMart, isMonologue: true },
    { speaker: "시스템", text: "그 순간— 멀리서 무언가 떨어지는 소리. 세 사람 모두 멈춘다. 듣는다. 발을 끄는 소리.", isProgress: true, background: bgMart },
    { speaker: "엘", text: "시간 됐다.", background: bgMart, character: "엘" },
    { speaker: "시스템", text: "마트를 나설 때 무심코 뒤를 보고말았다. 계산대 너머, 어둠 속에 사람 크기의 형체가 서 있다. 움직이지 않는다.", isProgress: true, background: bgMart },
    { speaker: "엘", text: "보지 마.", background: bgMart, character: "엘" },
    { speaker: "시스템", text: "셋은 뛰지 않고 빠르게 걷는다. 도심을 벗어날 때까지 아무도 말하지 않는다.", isProgress: true, background: bgMart },
    
    // #C12 - 거실 (Dialogue index 208)
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
    
    // #C13 - 병원 가는 길 (Dialogue index 240)
    { marker: "#C13", speaker: "시스템", text: "3일차. 병원으로 가는 길. 차 문이 닫히는 소리가 아침 안개를 밀어낸다. 엘이 운전석에 앉아 시동을 건다.", background: bgNearForest, isProgress: true, audio: bgMusicBalcony },
    { speaker: "렌쟈", text: "아침부터 병원이라니. 세상 참 성실하게 망했네. 봤지. 나무, 안개, 또 나무. 어제랑 똑같아.", background: bgNearForest, character: "렌쟈" },
    { speaker: "엘", text: "입 다물고 주변 봐. 똑같다는 게 문제지. 하룻밤 새에 정리될 리 없지.", background: bgNearForest, character: "엘" },
    { speaker: "시스템", text: "나는 뒷좌석에서 가방 끈을 다시 조인다. 약, 붕대, 빈 통. ‘있으면 좋은 것’보다 ‘없으면 끝나는 것’ 위주다.", isProgress: true, background: bgNearForest },
    { speaker: "파스닐", text: "어제는 선택지였는데, 오늘은 일정이 됐구만..", background: bgNearForest, isMonologue: true },
    { speaker: "렌쟈", text: "…어제보다 차 더 는거같기도 하고. 정리라기엔 다들 너무 급했잖아. 여기,다시는 오면 안 될 곳이야.", background: bgNearForest, character: "렌쟈" },
    
    // #C14 - 병원 근처 (Dialogue index 246)
    { marker: "#C14", speaker: "시스템", text: "도심 외곽 — 병원 근처. 병원 건물은 멀리서 보면 멀쩡하다. 가까이 가면 아니다. 유리창엔 테이프 자국, 출입문엔 밀린 흔적, 현관 앞엔 버리고 간 휠체어 하나.", background: bgNearHospital, isProgress: true },
    { speaker: "렌쟈", text: "와… 딱 ‘도망치다 만 병원’이잖아. 역시 걸어 들어가야 긴장 풀리지? 파스닐. 들리면 바로 말해. ‘괜찮을 것 같아요’ 이런 말 말고. 그 톤 좋아.", background: bgNearHospital, character: "렌쟈" },
    { speaker: "엘", text: "차 세운다. 여기서. 말 줄여. 들리기 전에 움직이면 그땐 내가 멈춘다.", background: bgNearHospital, character: "엘" },
    { speaker: "시스템", text: "차 문이 닫힌다. 세 사람은 자연스럽게 간격을 맞춘다. 엘 앞, 렌쟈 옆, 파스닐 반 박자 뒤.", isProgress: true, background: bgNearHospital },
    
    // #C15 - 병원 내부 (Dialogue index 250)
    { marker: "#C15", speaker: "시스템", text: "병원 내부. 자동문은 열린 게 아니라 고정돼 있다. 안은 약 냄새보다 먼지 냄새가 먼저 온다. 렌쟈는 들어오자마자 표지판을 본다.", background: bgHospital, isProgress: true, audio: "stop" },
    { speaker: "렌쟈", text: "응급실, 약국, 처치실… 다 한 방향이네. 역시 현실적. 진통제, 소염제, 항생제… 아, 이건 란이 싫어하겠다. 사람 마음은 안 챙겨주네. 아쉽네. 초코우유는 없었는데. 하카오빠가 갖다달랬어. 이럴 때일수록 사소한 게 오래 남아.", background: bgHospital, character: "렌쟈" },
    { speaker: "엘", text: "약국 먼저. 다 챙겨. 몸이 먼저야. ‘버틴다’는 말 되게 듣기싫다. 봤어. 가방 닫아. 지금 그게 아쉬워?", background: bgHospital, character: "엘" },
    { speaker: "파스닐", text: "이 정도면 며칠은 버텨요. (선택지가 없는 소리다.)", background: bgHospital, isMonologue: true },
    { speaker: "시스템", text: "멀리서 무언가 끌리는 소리. 이번엔 확실하다. 렌쟈의 손이 멈춘다. 세 사람은 뛰지 않는다. 렌쟈는 나오면서 한 번 뒤를 본다.", isProgress: true, background: bgHospital },
    
    // #C16 (Dialogue index 255)
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

    // #C18 (Dialogue index 289)
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

    // #C19 (Dialogue index 306)
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

    // #C20 (Dialogue index 321)
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

    // 4일차 (Dialogue index 361)
    { speaker: "시스템", text: "4일차. 별장 — 아침. 아침이라고 부르기엔 햇빛이 너무 얇다.", background: bgLivingRoomNew, isProgress: true },
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
    { speaker: "렌쟈", text: "“언니, 어제 이 사람 없었으면”", background: bgLivingRoomNew, character: "렌쟈", onComplete: () => { setGameState("start"); setDialogueIndex(0); } }
  ], []);

  const currentDialogue = story[dialogueIndex];

  // Preload Background Images
  useEffect(() => {
    const backgrounds = [
      bgStart, bgClip1, bgClip2, bgLivingRoom, bgBalcony, 
      bgNearForest, bgStorage, bgCity1, bgMart, bgNearHospital, bgHospital,
      bgC16, bgHospitalNew, bgNearHospitalNew, bgLivingRoomNew
    ];
    backgrounds.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === "story" && !currentDialogue?.choices) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleNext();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, dialogueIndex, currentDialogue]);

  // Audio handling
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
  }, [gameState, currentDialogue?.audio, currentDialogue?.marker]);

  const handleNext = useCallback(() => {
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
  }, [currentDialogue, dialogueIndex, story]);

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

  const loadGame = () => {
    const savedIndex = localStorage.getItem("game_save_index");
    if (savedIndex !== null) {
      setDialogueIndex(parseInt(savedIndex));
      setGameState("story");
    }
  };

  const getCharacterImage = (name?: string, index?: number) => {
    if (!name || name === "시스템" || name === "TV" || name === "TV 앵커") return null;
    
    // Character V2 logic (starting from #C10 which is index 173)
    const isV2 = index !== undefined && index >= 189;

    switch (name) {
      case "하카": return isV2 ? imgHaka2 : imgHaka;
      case "란": return isV2 ? imgRan2 : imgRan;
      case "렌쟈": return isV2 ? imgRenja2 : imgRenja;
      case "엘": return isV2 ? imgEl2 : imgEl;
      case "데일": return imgDale;
      case "파스닐": 
        // Pasnil only visible in CLIP1 (indices 0-4)
        return (index !== undefined && index <= 4) ? imgPasnil : null;
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
    const charImg = currentDialogue.hideCharacter ? null : getCharacterImage(currentDialogue.character || currentDialogue.speaker, dialogueIndex);
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-end" onClick={handleClick}>
        {/* Save Button */}
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

        <div className="absolute top-0 left-0 w-full h-[10%] bg-black z-30 pointer-events-none" />
        
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
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        </div>

        <AnimatePresence mode="wait">
          {charImg && (
            <motion.div
              key={`${currentDialogue.character || currentDialogue.speaker}-${dialogueIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-[-15%] h-[100%] w-auto pointer-events-none z-10"
            >
              <img 
                src={charImg} 
                className="h-full object-contain drop-shadow-[0_0_40px_rgba(0,0,0,0.9)]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-20 w-[85%] max-w-3xl mb-16 cursor-pointer group"
          onClick={handleNext}
        >
          {currentDialogue.isProgress ? (
            <div className="bg-black/20 p-5 rounded-lg text-center">
              <p className="text-white/50 text-base font-light tracking-widest italic uppercase">
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

              {currentDialogue.choices && (
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

              {!currentDialogue.choices && (
                <div className="absolute bottom-4 right-6 opacity-30 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-4 h-4 text-white animate-pulse" />
                </div>
              )}
            </div>
          )}
        </motion.div>

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
      <div className="absolute top-0 left-0 w-full h-[8%] bg-black z-30" />
      <div className="absolute bottom-0 left-0 w-full h-[8%] bg-black z-30" />

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
            className="text-7xl font-black text-red-600/90 tracking-tighter leading-none" 
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
            className="text-3xl font-light text-red-600/60 tracking-[0.8rem] mt-2 ml-2"
          >
            2026
          </motion.h2>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            size="lg"
            className="w-52 h-12 text-lg font-bold bg-red-700/80 hover:bg-red-600 text-white rounded-none border border-red-500/30 transition-all hover:translate-x-2"
            onClick={() => setGameState("video")}
            data-testid="button-start"
          >
            시작하기
          </Button>
          <Button 
            variant="ghost" 
            className={`w-52 h-10 text-base rounded-none border border-white/5 transition-all ${
              hasSaveData 
                ? "text-white hover:text-white hover:bg-white/10 border-white/20" 
                : "text-white/10 cursor-not-allowed opacity-50"
            }`}
            onClick={hasSaveData ? loadGame : undefined}
            disabled={!hasSaveData}
            data-testid="button-continue"
          >
            이어하기
          </Button>
          <Button variant="ghost" className="w-52 h-10 text-base text-white/40 hover:text-white hover:bg-white/5 rounded-none border border-white/5" data-testid="button-settings">
            설정
          </Button>
        </div>
      </div>
    </div>
  );
}
