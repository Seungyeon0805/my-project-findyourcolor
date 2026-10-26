/**
 * Find your color! ✨ 공주님의 시크릿 뷰티 드레서
 * 코스메틱 컬러 정밀 분석 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - User Name Gate
  const nameModalOverlay = document.getElementById('nameModalOverlay');
  const nameForm = document.getElementById('nameForm');
  const userNameInput = document.getElementById('userNameInput');
  const enterBtn = document.getElementById('enterBtn');
  const displayName = document.getElementById('displayName');
  const prescriptionUserName = document.getElementById('prescriptionUserName');
  const editNameBtn = document.getElementById('editNameBtn');

  // DOM Elements - Upload & Inputs
  const sparkleCanvas = document.getElementById('sparkleCanvas');
  const fileInput = document.getElementById('fileInput');
  const dropzone = document.getElementById('dropzone');
  const browseBtn = document.getElementById('browseBtn');
  const pasteBtn = document.getElementById('pasteBtn');
  const imageCanvas = document.getElementById('imageCanvas');
  const mirrorWrapper = document.getElementById('mirrorWrapper');
  const loupe = document.getElementById('colorLoupe');
  const loupeCanvas = document.getElementById('loupeCanvas');
  const loupeBadge = document.getElementById('loupeBadge');
  const paletteSwatches = document.getElementById('paletteSwatches');
  const colorPicker = document.getElementById('colorPicker');
  const selectedHexBadge = document.getElementById('selectedHexBadge');
  const sampleBtns = document.querySelectorAll('.sample-btn');
  
  // DOM Elements - Results Gauges
  const currentSwatchPreview = document.getElementById('currentSwatchPreview');
  const swatchPersonalTag = document.getElementById('swatchPersonalTag');
  const swatchHexText = document.getElementById('swatchHexText');
  const swatchRgbText = document.getElementById('swatchRgbText');
  const copyHexBtn = document.getElementById('copyHexBtn');

  const toneBadge = document.getElementById('toneBadge');
  const warmFill = document.getElementById('warmFill');
  const coolFill = document.getElementById('coolFill');
  const warmPercentLabel = document.getElementById('warmPercentLabel');
  const coolPercentLabel = document.getElementById('coolPercentLabel');
  const toneAnalysisText = document.getElementById('toneAnalysisText');

  const lightnessBadge = document.getElementById('lightnessBadge');
  const lightFill = document.getElementById('lightFill');
  const lightnessAnalysisText = document.getElementById('lightnessAnalysisText');

  const saturationBadge = document.getElementById('saturationBadge');
  const satFill = document.getElementById('satFill');
  const saturationAnalysisText = document.getElementById('saturationAnalysisText');

  // DOM Elements - Suitability Elements
  const lipStars = document.getElementById('lipStars');
  const lipNote = document.getElementById('lipNote');
  const cheekStars = document.getElementById('cheekStars');
  const cheekNote = document.getElementById('cheekNote');
  const eyeStars = document.getElementById('eyeStars');
  const eyeNote = document.getElementById('eyeNote');

  // DOM Elements - Wide Prescription
  const bestSeasonValue = document.getElementById('bestSeasonValue');
  const seasonSubNote = document.getElementById('seasonSubNote');
  const makeupTipValue = document.getElementById('makeupTipValue');
  const textureGuideValue = document.getElementById('textureGuideValue');
  const pairingColorsRow = document.getElementById('pairingColorsRow');
  const shareReportBtn = document.getElementById('shareReportBtn');
  const saveCardBtn = document.getElementById('saveCardBtn');
  const princessToast = document.getElementById('princessToast');
  const toastMsg = document.getElementById('toastMsg');

  // Canvas Contexts
  const imgCtx = imageCanvas.getContext('2d', { willReadFrequently: true });
  const loupeCtx = loupeCanvas.getContext('2d');

  // Global State
  let currentImage = null;
  let currentColor = { r: 255, g: 107, b: 139, hex: '#FF6B8B' };
  let currentUserName = '공주님';

  /* ==========================================================================
     0. 공주님의 이름 관리 (Name Gate & Display)
     ========================================================================== */
  function initUserName() {
    const savedName = localStorage.getItem('princess_user_name');
    if (savedName && savedName.trim() !== '') {
      setUserName(savedName.trim());
      nameModalOverlay.classList.add('hidden');
    } else {
      nameModalOverlay.classList.remove('hidden');
      setTimeout(() => userNameInput.focus(), 300);
    }
  }

  function setUserName(name) {
    currentUserName = name || '공주님';
    displayName.textContent = currentUserName;
    prescriptionUserName.textContent = currentUserName;
    localStorage.setItem('princess_user_name', currentUserName);
  }

  function handleNameSubmit() {
    const entered = userNameInput.value.trim();
    if (entered.length > 0) {
      setUserName(entered);
    } else {
      setUserName('로즈 공주님');
    }
    nameModalOverlay.classList.add('hidden');
    showToast(`👑 환영합니다, ${currentUserName}! 드레서가 열렸습니다 ✨`);
  }

  enterBtn.addEventListener('click', handleNameSubmit);
  userNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNameSubmit();
    }
  });

  editNameBtn.addEventListener('click', () => {
    userNameInput.value = currentUserName !== '공주님' ? currentUserName : '';
    nameModalOverlay.classList.remove('hidden');
    userNameInput.focus();
  });

  initUserName();

  /* ==========================================================================
     1. 배경 반짝이 파티클 애니메이션
     ========================================================================== */
  function initSparkles() {
    const ctx = sparkleCanvas.getContext('2d');
    let width = sparkleCanvas.width = window.innerWidth;
    let height = sparkleCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = sparkleCanvas.width = window.innerWidth;
      height = sparkleCanvas.height = window.innerHeight;
    });

    const sparkles = [];
    const sparkleColors = ['#FFE4EC', '#FFB6C1', '#F7D679', '#FFFFFF', '#FF8DA1'];

    for (let i = 0; i < 40; i++) {
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4 + 2,
        color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
        opacity: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
        growth: Math.random() > 0.5 ? 1 : -1,
        rotation: Math.random() * Math.PI
      });
    }

    function drawSparkleStar(cx, cy, spikes, outerRadius, innerRadius, color, alpha, rot) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.fillStyle = color;
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      let step = Math.PI / spikes;
      for (let i = 0; i < 2 * spikes; i++) {
        let r = (i % 2 === 0) ? outerRadius : innerRadius;
        let x = Math.cos(i * step) * r;
        let y = Math.sin(i * step) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      sparkles.forEach(s => {
        s.opacity += s.speed * s.growth;
        if (s.opacity > 0.85) {
          s.growth = -1;
        } else if (s.opacity < 0.05) {
          s.growth = 1;
          s.x = Math.random() * width;
          s.y = Math.random() * height;
        }
        s.rotation += 0.01;
        drawSparkleStar(s.x, s.y, 4, s.size * 2, s.size * 0.4, s.color, s.opacity, s.rotation);
      });

      requestAnimationFrame(animate);
    }
    animate();
  }
  initSparkles();

  /* ==========================================================================
     2. 코스메틱 색상 정밀 분석 알고리즘 (웜/쿨 %, 명도 %, 채도 %)
     ========================================================================== */
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  function rgbToHex(r, g, b) {
    const toHex = n => {
      const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function calculateWarmCoolTone(r, g, b) {
    const hsl = rgbToHsl(r, g, b);
    const { h, s, l } = hsl;

    if (s < 10) {
      return {
        warmPercent: 50,
        coolPercent: 50,
        toneTag: '뉴트럴 (Neutral Tone)',
        desc: '웜과 쿨의 경계에 있는 균형 잡힌 <strong>뉴트럴 그레이시 톤</strong>입니다.'
      };
    }

    let warmScore = 50;

    if (h >= 15 && h <= 65) {
      const peakWarmDist = Math.abs(h - 38);
      warmScore = 80 + (1 - peakWarmDist / 30) * 18;
    } else if (h > 65 && h <= 120) {
      warmScore = 65 + (120 - h) * 0.2;
    } else if (h > 120 && h <= 170) {
      warmScore = 40 - (h - 120) * 0.3;
    } else if (h > 170 && h <= 270) {
      const peakCoolDist = Math.abs(h - 220);
      const coolStrength = 85 + (1 - peakCoolDist / 50) * 13;
      warmScore = 100 - coolStrength;
    } else if (h > 270 && h <= 335) {
      warmScore = 15 + ((h - 270) / 65) * 15;
    } else {
      const yellowComponent = (r + g) / 2;
      const blueComponent = b;
      const diffRatio = (yellowComponent - blueComponent) / 255;
      const gbDiff = (g - b) / 255;
      let baseWarm = 50 + diffRatio * 35 + gbDiff * 30;
      warmScore = Math.max(10, Math.min(92, baseWarm));
    }

    const redBlueDiff = (r - b) / 255;
    if (redBlueDiff > 0.4 && g > b) {
      warmScore += 5;
    } else if (b > g && b > 100) {
      warmScore -= 6;
    }

    warmScore = Math.round(Math.max(5, Math.min(95, warmScore)));
    const coolScore = 100 - warmScore;

    let toneTag = '';
    let desc = '';

    if (warmScore >= 68) {
      toneTag = `완벽한 웜톤 (Warm ${warmScore}%)`;
      desc = `살구빛과 따스한 골든 피치 베이스가 가득 머금어진 <strong>극강의 웜톤 컬러</strong>입니다. 봄 웜/가을 웜의 혈색을 극대화해줘요!`;
    } else if (warmScore >= 56) {
      toneTag = `소프트 웜톤 (Warm ${warmScore}%)`;
      desc = `자연스럽고 부드러운 온기(Warm)를 품고 있어 <strong>피부에 친근하게 감기는 온화한 톤</strong>입니다.`;
    } else if (warmScore >= 45 && warmScore <= 55) {
      toneTag = `뉴트럴 톤 (Warm ${warmScore}% / Cool ${coolScore}%)`;
      desc = `웜톤과 쿨톤 사이의 절묘한 황금 밸런스를 가진 <strong>만능 뉴트럴 톤</strong>입니다. 톤에 구애받지 않고 두루 잘 어울려요!`;
    } else if (warmScore >= 33) {
      toneTag = `소프트 쿨톤 (Cool ${coolScore}%)`;
      desc = `푸른빛과 라벤더 기운이 은은하게 감도는 <strong>우아하고 차분한 쿨톤 컬러</strong>입니다.`;
    } else {
      toneTag = `완벽한 쿨톤 (Cool ${coolScore}%)`;
      desc = `체리빛과 마젠타 쿨 베이스가 선명한 <strong>시원하고 청량한 쿨톤 컬러</strong>입니다. 쿨톤 공주님의 얼굴을 맑고 투명하게 밝혀줘요!`;
    }

    return { warmPercent: warmScore, coolPercent: coolScore, toneTag, desc };
  }

  function calculateLightness(r, g, b) {
    const hsl = rgbToHsl(r, g, b);
    const perceived = Math.round(Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)) / 2.55);
    const combinedLightness = Math.round(0.4 * hsl.l + 0.6 * perceived);
    const finalLightness = Math.max(0, Math.min(100, combinedLightness));

    let tag = '';
    let desc = '';

    if (finalLightness >= 78) {
      tag = '고명도 (High Light)';
      desc = `눈부시게 맑고 화사한 <strong>극상의 고명도(Light)</strong> 레벨입니다. 뽀용하고 투명한 동안 페이스를 완성해 줍니다.`;
    } else if (finalLightness >= 60) {
      tag = '중고명도 (Light-Medium)';
      desc = `적당한 화사함과 자연스러운 생기를 주는 <strong>맑은 라이트 레벨</strong>로, 데일리로 가장 부담 없이 쓰기 좋습니다.`;
    } else if (finalLightness >= 40) {
      tag = '중명도 (Medium)';
      desc = `안정적이고 차분한 깊이감을 주는 <strong>미디엄 명도 레벨</strong>입니다. 은은하고 그윽한 분위기를 연출해요.`;
    } else if (finalLightness >= 22) {
      tag = '중저명도 (Deep)';
      desc = `깊고 고혹적인 무드를 풍기는 <strong>딥(Deep) 명도 레벨</strong>입니다. 음영 메이크업이나 포인트 립으로 탁월합니다.`;
    } else {
      tag = '저명도 (Dark)';
      desc = `압도적인 존재감과 강렬함을 선사하는 <strong>다크(Dark) 레벨</strong>로, 엣지 있는 립 포인트나 아이라인에 적합합니다.`;
    }

    return { percent: finalLightness, tag, desc };
  }

  function calculateSaturation(r, g, b) {
    const hsl = rgbToHsl(r, g, b);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const purity = max === 0 ? 0 : Math.round(((max - min) / max) * 100);
    const combinedSat = Math.round(0.5 * hsl.s + 0.5 * purity);
    const finalSat = Math.max(0, Math.min(100, combinedSat));

    let tag = '';
    let desc = '';

    if (finalSat >= 80) {
      tag = '고채도 (Vivid / Clear)';
      desc = `원색의 매력이 또렷하게 살아있는 <strong>선명함의 절정, 비비드(Vivid)</strong> 컬러입니다. 얼굴에 형광등을 탁 켜주는 생기 부스터!`;
    } else if (finalSat >= 55) {
      tag = '중고채도 (Bright)';
      desc = `적당한 맑기와 발랄한 생기를 머금은 <strong>브라이트(Bright)</strong> 채도입니다. 데일리 립/치크로 사랑스러움을 극대화해요.`;
    } else if (finalSat >= 30) {
      tag = '중채도 (Soft / Muted)';
      desc = `회기와 우유빛이 살짝 감도는 <strong>부드러운 뮤트(Muted/Soft)</strong> 채도입니다. 감성적이고 분위기 있는 여신 무드를 완성합니다.`;
    } else {
      tag = '저채도 (Dull / Grayish)';
      desc = `채도가 쏙 빠져 오묘하고 스모키한 <strong>흐림(Grayish/Dull)</strong> 레벨입니다. 힙하고 몽환적인 음영 메이크업에 제격입니다.`;
    }

    return { percent: finalSat, tag, desc };
  }

  /**
   * 화장품 부위별 적합도 (립, 블러셔, 아이) 계산
   */
  function calculateSuitability(lightInfo, satInfo) {
    const l = lightInfo.percent;
    const s = satInfo.percent;

    // 1. 립 적합도
    let lip = { stars: '★★★★☆', note: '화사한 데일리 립 컬러' };
    if (s >= 60 && l >= 35 && l <= 75) {
      lip = { stars: '★★★★★', note: '생기 충전 메인 립 최적!' };
    } else if (l > 75) {
      lip = { stars: '★★★★☆', note: '청순한 누디/글로스 립' };
    } else if (l < 35) {
      lip = { stars: '★★★★★', note: '치명적인 포인트 딥 립' };
    } else {
      lip = { stars: '★★★☆☆', note: '자연스러운 베이스 오버립' };
    }

    // 2. 블러셔 적합도
    let cheek = { stars: '★★★★☆', note: '자연스러운 혈색 치크' };
    if (l >= 60 && s >= 25 && s <= 70) {
      cheek = { stars: '★★★★★', note: '맑은 수채화 발색 최적!' };
    } else if (s > 70) {
      cheek = { stars: '★★★☆☆', note: '소량 톡톡 포인트 치크' };
    } else if (l < 45) {
      cheek = { stars: '★★☆☆☆', note: '쉐딩과 레이어링 추천' };
    } else {
      cheek = { stars: '★★★★☆', note: '뽀용한 안색 밝힘 블러셔' };
    }

    // 3. 아이섀도우 적합도
    let eye = { stars: '★★★☆☆', note: '포인트 아이 메이크업' };
    if (l <= 55 && s <= 65) {
      eye = { stars: '★★★★★', note: '깊이감 있는 음영 섀도우 최적!' };
    } else if (l >= 70 && s <= 45) {
      eye = { stars: '★★★★☆', note: '눈두덩이 베이스 톤 정리' };
    } else if (s >= 70) {
      eye = { stars: '★★★☆☆', note: '눈꼬리/삼각존 포인트 섀도우' };
    } else {
      eye = { stars: '★★★★☆', note: '데일리 미디엄 음영 섀도우' };
    }

    return { lip, cheek, eye };
  }

  function diagnosePersonalBeauty(warmInfo, lightInfo, satInfo) {
    const isWarm = warmInfo.warmPercent >= 50;
    const l = lightInfo.percent;
    const s = satInfo.percent;

    let seasonTone = '';
    let subNote = '';
    let makeupTip = '';
    let textureGuide = '';
    let pairingColors = [];

    if (isWarm) {
      if (l >= 65 && s >= 45) {
        seasonTone = '봄 웜 라이트 / 클리어 (Spring Warm Light)';
        subNote = '햇살을 머금은 듯 투명하고 맑은 화사함이 돋보이는 톤';
        makeupTip = '살구빛 코랄 립글로스와 복숭아 과즙 블러셔로 투명하고 맑은 물광 수채화 메이크업을 연출해보세요 🍑';
        textureGuide = '가벼운 수분 앰플 틴트 & 투명 유리알 글로스에 은은한 샴페인 펄 하이라이터 조합 추천!';
        pairingColors = [
          { name: '밀크 피치 (치크)', hex: '#FFBEA3' },
          { name: '샴페인 골드 (글리터)', hex: '#F7E7B4' },
          { name: '살몬 코랄 (립)', hex: '#FF6F59' }
        ];
      } else if (s >= 65) {
        seasonTone = '봄 웜 브라이트 (Spring Warm Bright)';
        subNote = '비타민처럼 톡톡 튀는 비비드한 생기가 가득한 톤';
        makeupTip = '쨍한 다홍 레드 틴트나 네온 코랄 립으로 포인트를 주고, 피부는 깔끔하고 깨끗하게 정돈하는 것이 베스트입니다 🍊';
        textureGuide = '발색력 좋은 크리미 립라커 또는 젤리 틴트 & 보송하고 맑은 세미글로우 베이스';
        pairingColors = [
          { name: '비비드 오렌지', hex: '#FF5722' },
          { name: '크림 아이보리', hex: '#FFF8E7' },
          { name: '골든 옐로우', hex: '#FFC107' }
        ];
      } else if (l >= 45 && s < 50) {
        seasonTone = '가을 웜 뮤트 / 소프트 (Autumn Warm Muted)';
        subNote = '차분하고 그윽한 감성, 말린 장미빛 분위기 여신의 톤';
        makeupTip = '말린 장미(MLBB)와 소프트 베이지 브라운 음영 섀도우로 그윽하고 고급스러운 분위기 룩을 추천해요 🍂';
        textureGuide = '부드러운 벨벳 매트 립스틱 & 입자가 고운 무펄 매트 음영 섀도우';
        pairingColors = [
          { name: '누디 베이지', hex: '#D2B48C' },
          { name: '드라이 로즈', hex: '#C08081' },
          { name: '소프트 카멜', hex: '#C19A6B' }
        ];
      } else {
        seasonTone = '가을 웜 딥 / 다크 (Autumn Warm Deep)';
        subNote = '풍부한 음영과 앤틱한 우아함을 지닌 매혹적인 톤';
        makeupTip = '고혹적인 칠리 브릭 레드나 딥 초콜릿 버건디 립에 골드 펄 라이너를 매치하면 치명적인 매력이 배가됩니다 🍫';
        textureGuide = '밀도 높은 딥 매트 립 & 앤틱 브론즈/골드 쉬머 글리터 피니시';
        pairingColors = [
          { name: '칠리 브릭', hex: '#9E2A2B' },
          { name: '앤틱 골드', hex: '#D4AF37' },
          { name: '에스프레소 브라운', hex: '#4A2E1B' }
        ];
      }
    } else {
      if (l >= 65 && s >= 40) {
        seasonTone = '여름 쿨 라이트 (Summer Cool Light)';
        subNote = '우윳빛 파스텔과 투명한 청순함이 넘치는 요정 톤';
        makeupTip = '딸기우유빛 베이비 핑크 립과 라벤더 파우더 블러셔로 뽀얗고 투명한 요정 미모를 밝혀주세요 🍓';
        textureGuide = '맑은 수채화 워터 틴트 & 오팔 펄 하이라이터로 투명한 쿨톤 피부 표현';
        pairingColors = [
          { name: '베이비 핑크 (립)', hex: '#FFB7C5' },
          { name: '라벤더 포그 (치크)', hex: '#E6D7FF' },
          { name: '오팔 실버 (펄)', hex: '#EDF2F7' }
        ];
      } else if (s < 50) {
        seasonTone = '여름 쿨 뮤트 / 모브 (Summer Cool Muted)';
        subNote = '안개 낀 듯 오묘하고 감각적인 세련미의 톤';
        makeupTip = '애쉬빛이 가미된 모브 틴트와 플럼 그레이 섀도우로 세련되고 몽환적인 쿨톤 감성을 완성해보세요 🩰';
        textureGuide = '블러셔 블러링 벨벳 텍스처 & 차분한 애쉬 매트 섀도우 팔레트';
        pairingColors = [
          { name: '더스티 모브', hex: '#B8869B' },
          { name: '애쉬 라일락', hex: '#C8B9D2' },
          { name: '로즈 토프', hex: '#905D5D' }
        ];
      } else if (s >= 65 && l >= 35) {
        seasonTone = '겨울 쿨 브라이트 / 클리어 (Winter Cool Bright)';
        subNote = '눈부신 백설공주처럼 선명한 대비감이 돋보이는 톤';
        makeupTip = '선명한 푸시아 핫핑크나 체리 쿨레드 립으로 원포인트를 주고, 깔끔한 캣츠아이 라인으로 또렷한 이목구비를 살려주세요 🍒';
        textureGuide = '선명한 고발색 매트 립 또는 쨍한 고광택 에나멜 립 & 실버 다이아몬드 글리터';
        pairingColors = [
          { name: '푸시아 핑크', hex: '#FF007F' },
          { name: '트루 체리 레드', hex: '#C2185B' },
          { name: '플래티넘 실버', hex: '#E2E8F0' }
        ];
      } else {
        seasonTone = '겨울 쿨 딥 / 다크 (Winter Cool Deep)';
        subNote = '카리스마 넘치는 흑장미 같은 독보적인 무드의 톤';
        makeupTip = '블랙베리, 딥 플럼 와인 립에 투명한 유리알 글로스를 얹어 독보적인 쿨시크 로열 프린세스 무드를 뽐내보세요 🍷';
        textureGuide = '딥 버건디 틴트 플럼퍼 & 새틴 피니시의 쿨 그레이 음영 베이스';
        pairingColors = [
          { name: '딥 플럼 와인', hex: '#5B1E31' },
          { name: '루비 레드', hex: '#990024' },
          { name: '미드나잇 블루', hex: '#191970' }
        ];
      }
    }

    return { seasonTone, subNote, makeupTip, textureGuide, pairingColors };
  }

  /* ==========================================================================
     3. 분석 결과 UI 렌더링
     ========================================================================== */
  function updateAnalysisUI(r, g, b) {
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    currentColor = { r, g, b, hex };

    // 1. 배너 및 뱃지 업데이트
    currentSwatchPreview.style.backgroundColor = hex;
    swatchHexText.textContent = hex;
    swatchRgbText.textContent = `RGB(${r}, ${g}, ${b}) · HSL(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`;
    colorPicker.value = hex;
    selectedHexBadge.textContent = hex;

    // 2. 웜/쿨 계산 & 렌더링
    const warmInfo = calculateWarmCoolTone(r, g, b);
    toneBadge.textContent = warmInfo.toneTag;
    warmFill.style.width = `${warmInfo.warmPercent}%`;
    coolFill.style.width = `${warmInfo.coolPercent}%`;
    warmPercentLabel.textContent = `웜 ${warmInfo.warmPercent}%`;
    coolPercentLabel.textContent = `쿨 ${warmInfo.coolPercent}%`;
    toneAnalysisText.innerHTML = warmInfo.desc;

    // 3. 명도 계산 & 렌더링
    const lightInfo = calculateLightness(r, g, b);
    lightnessBadge.textContent = `${lightInfo.percent}%`;
    lightFill.style.width = `${lightInfo.percent}%`;
    lightnessAnalysisText.innerHTML = lightInfo.desc;

    // 4. 채도 계산 & 렌더링
    const satInfo = calculateSaturation(r, g, b);
    saturationBadge.textContent = `${satInfo.percent}%`;
    satFill.style.width = `${satInfo.percent}%`;
    saturationAnalysisText.innerHTML = satInfo.desc;

    // 5. 화장품 부위별 적합도 렌더링 (공백 제거 & 정보 밀도 향상)
    const suit = calculateSuitability(lightInfo, satInfo);
    lipStars.textContent = suit.lip.stars;
    lipNote.textContent = suit.lip.note;
    cheekStars.textContent = suit.cheek.stars;
    cheekNote.textContent = suit.cheek.note;
    eyeStars.textContent = suit.eye.stars;
    eyeNote.textContent = suit.eye.note;

    // 6. 하단 와이드 처방전 렌더링
    const beauty = diagnosePersonalBeauty(warmInfo, lightInfo, satInfo);
    swatchPersonalTag.textContent = beauty.seasonTone.split(' (')[0];
    bestSeasonValue.textContent = beauty.seasonTone;
    seasonSubNote.textContent = beauty.subNote;
    makeupTipValue.textContent = beauty.makeupTip;
    textureGuideValue.textContent = beauty.textureGuide;

    // 와이드 페어링 칩 렌더링
    pairingColorsRow.innerHTML = '';
    beauty.pairingColors.forEach(chip => {
      const chipEl = document.createElement('div');
      chipEl.className = 'pairing-chip';
      chipEl.title = `${chip.name} (${chip.hex}) - 클릭 시 이 색상 분석하기`;
      chipEl.innerHTML = `
        <span class="pairing-dot" style="background:${chip.hex};"></span>
        <div class="pairing-info">
          <div class="pairing-name">${chip.name}</div>
          <div class="pairing-hex" style="font-family:monospace; font-size:0.75rem; color:#888;">${chip.hex}</div>
        </div>
      `;
      chipEl.addEventListener('click', () => {
        const rgb = hexToRgb(chip.hex);
        updateAnalysisUI(rgb.r, rgb.g, rgb.b);
        showToast(`✨ ${chip.name} 컬러로 분석 전환되었습니다!`);
      });
      pairingColorsRow.appendChild(chipEl);
    });
  }

  /* ==========================================================================
     4. 이미지 로딩 & 캔버스 렌더링 & 대표 5구 팔레트 자동 추출
     ========================================================================== */
  function loadImageToCanvas(img) {
    currentImage = img;
    
    const maxWidth = 560;
    const maxHeight = 340;
    let w = img.width;
    let h = img.height;

    if (w > maxWidth || h > maxHeight) {
      const ratio = Math.min(maxWidth / w, maxHeight / h);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);
    }

    imageCanvas.width = w;
    imageCanvas.height = h;
    imgCtx.clearRect(0, 0, w, h);
    imgCtx.drawImage(img, 0, 0, w, h);

    extractDominantPalette(w, h);
    analyzeCenterColor(w, h);
  }

  function analyzeCenterColor(w, h) {
    const cx = Math.floor(w / 2);
    const cy = Math.floor(h / 2);
    const pixelData = imgCtx.getImageData(Math.max(0, cx - 2), Math.max(0, cy - 2), 5, 5).data;
    let rSum = 0, gSum = 0, bSum = 0, count = 0;
    for (let i = 0; i < pixelData.length; i += 4) {
      if (pixelData[i + 3] > 100) {
        rSum += pixelData[i];
        gSum += pixelData[i + 1];
        bSum += pixelData[i + 2];
        count++;
      }
    }
    if (count > 0) {
      updateAnalysisUI(Math.round(rSum / count), Math.round(gSum / count), Math.round(bSum / count));
    }
  }

  function extractDominantPalette(w, h) {
    const imgData = imgCtx.getImageData(0, 0, w, h).data;
    const step = 4 * 6;
    const colorBuckets = {};

    for (let i = 0; i < imgData.length; i += step) {
      const a = imgData[i + 3];
      if (a < 128) continue;

      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];

      const hsl = rgbToHsl(r, g, b);
      if (hsl.l > 95 && hsl.s < 8) continue;
      if (hsl.l < 6) continue;

      const qR = Math.floor(r / 24) * 24;
      const qG = Math.floor(g / 24) * 24;
      const qB = Math.floor(b / 24) * 24;
      const key = `${qR},${qG},${qB}`;

      if (!colorBuckets[key]) {
        colorBuckets[key] = { r: qR, g: qG, b: qB, count: 0, sat: hsl.s };
      }
      colorBuckets[key].count++;
    }

    const sortedBuckets = Object.values(colorBuckets)
      .sort((a, b) => (b.count * (1 + b.sat / 50)) - (a.count * (1 + a.sat / 50)))
      .slice(0, 5);

    if (sortedBuckets.length === 0) {
      sortedBuckets.push({ r: 255, g: 107, b: 139, hex: '#FF6B8B' });
    }

    paletteSwatches.innerHTML = '';
    sortedBuckets.forEach((bucket, idx) => {
      const hex = rgbToHex(bucket.r, bucket.g, bucket.b);
      const swatch = document.createElement('div');
      swatch.className = `swatch-item ${idx === 0 ? 'active' : ''}`;
      swatch.style.backgroundColor = hex;
      swatch.innerHTML = `<span class="swatch-item-label">${hex}</span>`;
      swatch.title = `발색 포인트 ${idx + 1}: ${hex}`;

      swatch.addEventListener('click', () => {
        document.querySelectorAll('.swatch-item').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        updateAnalysisUI(bucket.r, bucket.g, bucket.b);
        showToast(`✨ ${hex} 컬러가 선택되었습니다!`);
      });

      paletteSwatches.appendChild(swatch);
    });
  }

  /* ==========================================================================
     5. 인터랙티브 매직 스포이드 돋보기 (Color Loupe)
     ========================================================================== */
  function getCanvasCoords(e) {
    const rect = imageCanvas.getBoundingClientRect();
    const scaleX = imageCanvas.width / rect.width;
    const scaleY = imageCanvas.height / rect.height;

    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    return {
      x: Math.floor((clientX - rect.left) * scaleX),
      y: Math.floor((clientY - rect.top) * scaleY),
      screenX: clientX - rect.left,
      screenY: clientY - rect.top
    };
  }

  function handleLoupeMove(e) {
    if (!currentImage) return;

    const coords = getCanvasCoords(e);
    if (coords.x < 0 || coords.x >= imageCanvas.width || coords.y < 0 || coords.y >= imageCanvas.height) {
      loupe.style.display = 'none';
      return;
    }

    loupe.style.display = 'block';
    loupe.style.left = `${coords.screenX}px`;
    loupe.style.top = `${coords.screenY}px`;

    const sampleSize = 11;
    const half = Math.floor(sampleSize / 2);
    const sx = Math.max(0, coords.x - half);
    const sy = Math.max(0, coords.y - half);
    
    loupeCtx.imageSmoothingEnabled = false;
    loupeCtx.clearRect(0, 0, loupeCanvas.width, loupeCanvas.height);
    loupeCtx.drawImage(
      imageCanvas,
      sx, sy, sampleSize, sampleSize,
      0, 0, loupeCanvas.width, loupeCanvas.height
    );

    const centerPixel = imgCtx.getImageData(coords.x, coords.y, 1, 1).data;
    const hex = rgbToHex(centerPixel[0], centerPixel[1], centerPixel[2]);
    loupeBadge.textContent = hex;
    loupeBadge.style.backgroundColor = hex;
    const hsl = rgbToHsl(centerPixel[0], centerPixel[1], centerPixel[2]);
    loupeBadge.style.color = hsl.l > 60 ? '#111' : '#FFF';
  }

  function handleCanvasPick(e) {
    if (!currentImage) return;
    const coords = getCanvasCoords(e);
    if (coords.x < 0 || coords.x >= imageCanvas.width || coords.y < 0 || coords.y >= imageCanvas.height) return;

    const pixel = imgCtx.getImageData(coords.x, coords.y, 1, 1).data;
    if (pixel[3] > 0) {
      updateAnalysisUI(pixel[0], pixel[1], pixel[2]);
      showToast(`💖 선택한 픽셀(${rgbToHex(pixel[0], pixel[1], pixel[2])}) 분석 완료!`);
    }
  }

  mirrorWrapper.addEventListener('mousemove', handleLoupeMove);
  mirrorWrapper.addEventListener('mouseleave', () => { loupe.style.display = 'none'; });
  mirrorWrapper.addEventListener('click', handleCanvasPick);

  mirrorWrapper.addEventListener('touchmove', (e) => {
    handleLoupeMove(e);
    e.preventDefault();
  }, { passive: false });
  mirrorWrapper.addEventListener('touchstart', (e) => {
    handleLoupeMove(e);
  }, { passive: true });
  mirrorWrapper.addEventListener('touchend', (e) => {
    handleCanvasPick(e);
    setTimeout(() => { loupe.style.display = 'none'; }, 400);
  });

  /* ==========================================================================
     6. 파일 업로드 & '복사한 이미지 붙여넣기(Ctrl+V)' 듀얼 지원
     ========================================================================== */
  browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-active');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-active');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files[0]) {
      processFile(dt.files[0]);
    }
  });

  function processFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('⚠️ 이미지 파일만 업로드할 수 있습니다!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        loadImageToCanvas(img);
        showToast('✨ 이미지가 우아하게 로드되었습니다!');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  pasteBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        showToast('📋 이미지를 복사한 뒤 키보드로 [Ctrl + V]를 눌러주세요!');
        return;
      }
      const clipboardItems = await navigator.clipboard.read();
      let foundImage = false;

      for (const item of clipboardItems) {
        const imageType = item.types.find(type => type.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          processFile(blob);
          foundImage = true;
          showToast('📋 클립보드의 이미지를 성공적으로 붙여넣었습니다!');
          break;
        }
      }

      if (!foundImage) {
        showToast('ℹ️ 클립보드에 복사된 이미지가 없습니다. 이미지를 복사한 뒤 눌러주세요!');
      }
    } catch (err) {
      showToast('📋 권한 제한 시, 키보드로 [Ctrl + V]를 누르면 바로 붙여넣어집니다!');
    }
  });

  window.addEventListener('paste', (e) => {
    if (document.activeElement === userNameInput) return;

    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    let found = false;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processFile(file);
          found = true;
          showToast('💖 복사해놓은 이미지를 우아하게 붙여넣었습니다!');
          break;
        }
      }
    }

    if (found) {
      e.preventDefault();
    }
  });

  /* ==========================================================================
     7. 화장품 발색 샘플 프리셋 4종
     ========================================================================== */
  const samplePresets = {
    springCoral: {
      name: '봄 웜 라이트 피치 코랄 립',
      baseHex: '#FF7A70',
      gradient: ['#FFA399', '#FF7A70', '#E5564B']
    },
    summerMuted: {
      name: '여름 쿨 소프트 딸기우유 모브 틴트',
      baseHex: '#E68BA7',
      gradient: ['#F7B5C8', '#E68BA7', '#C26284']
    },
    autumnBrick: {
      name: '가을 웜 딥 칠리 브릭 레드',
      baseHex: '#B33F2E',
      gradient: ['#C85848', '#B33F2E', '#872314']
    },
    winterCherry: {
      name: '겨울 쿨 비비드 플럼 버건디',
      baseHex: '#9B174C',
      gradient: ['#C42F6B', '#9B174C', '#68052D']
    }
  };

  function createCosmeticSwatchImage(preset) {
    const canvas = document.createElement('canvas');
    canvas.width = 460;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFF5F8';
    ctx.fillRect(0, 0, 460, 300);

    const grad = ctx.createLinearGradient(60, 50, 400, 250);
    grad.addColorStop(0, preset.gradient[0]);
    grad.addColorStop(0.5, preset.gradient[1]);
    grad.addColorStop(1, preset.gradient[2]);

    ctx.save();
    ctx.shadowColor = 'rgba(232, 76, 118, 0.25)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;

    ctx.beginPath();
    ctx.moveTo(70, 110);
    ctx.bezierCurveTo(120, 60, 260, 70, 380, 100);
    ctx.bezierCurveTo(410, 120, 390, 170, 350, 190);
    ctx.bezierCurveTo(240, 230, 130, 210, 70, 170);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    const glossGrad = ctx.createLinearGradient(120, 90, 320, 150);
    glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    glossGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
    glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.moveTo(120, 100);
    ctx.bezierCurveTo(180, 80, 280, 90, 330, 120);
    ctx.bezierCurveTo(280, 135, 180, 130, 120, 115);
    ctx.closePath();
    ctx.fillStyle = glossGrad;
    ctx.fill();

    for (let i = 0; i < 25; i++) {
      ctx.beginPath();
      const px = 100 + Math.random() * 240;
      const py = 90 + Math.random() * 80;
      ctx.arc(px, py, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 245, 220, 0.7)';
      ctx.fill();
    }

    ctx.font = '600 13px "Noto Serif KR", serif';
    ctx.fillStyle = 'rgba(120, 80, 100, 0.7)';
    ctx.fillText(`✨ Swatch: ${preset.name}`, 30, 275);

    const img = new Image();
    img.onload = () => {
      loadImageToCanvas(img);
    };
    img.src = canvas.toDataURL('image/png');
  }

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.dataset.preset;
      const preset = samplePresets[presetKey];
      if (preset) {
        createCosmeticSwatchImage(preset);
        showToast(`💄 [${preset.name}] 샘플이 적용되었습니다!`);
      }
    });
  });

  /* ==========================================================================
     8. 직접 컬러 피커 입력
     ========================================================================== */
  colorPicker.addEventListener('input', (e) => {
    const hex = e.target.value;
    const rgb = hexToRgb(hex);
    updateAnalysisUI(rgb.r, rgb.g, rgb.b);
  });

  /* ==========================================================================
     9. 컬러 복사 및 와이드 진단서 저장/공유 기능
     ========================================================================== */
  copyHexBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(currentColor.hex).then(() => {
      showToast(`💖 컬러 코드 ${currentColor.hex} 가 복사되었습니다!`);
    });
  });

  shareReportBtn.addEventListener('click', () => {
    const reportText = `[Find your color! ✨ ${currentUserName}만을 위한 컬러 진단 처방전]
👑 컬러 코드: ${currentColor.hex}
🌡️ 색상 톤: ${toneBadge.textContent}
🕊️ 명도(밝기): ${lightnessBadge.textContent}
🎨 채도(선명도): ${saturationBadge.textContent}
💖 베스트 퍼스널 톤: ${bestSeasonValue.textContent}
💄 추천 메이크업: ${makeupTipValue.textContent}
✨ 찰떡 텍스처 가이드: ${textureGuideValue.textContent}`;

    navigator.clipboard.writeText(reportText).then(() => {
      showToast(`💌 ${currentUserName}의 진단서 요약본이 클립보드에 복사되었습니다!`);
    });
  });

  saveCardBtn.addEventListener('click', () => {
    generateAndDownloadReportCard();
  });

  function generateAndDownloadReportCard() {
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 720;
    cardCanvas.height = 920;
    const ctx = cardCanvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 720, 920);
    bgGrad.addColorStop(0, '#FFF3F6');
    bgGrad.addColorStop(0.5, '#FFEAF0');
    bgGrad.addColorStop(1, '#FFF9FB');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 720, 920);

    ctx.strokeStyle = '#E6B762';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 680, 880);
    ctx.strokeStyle = '#FFB6C1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(28, 28, 664, 864);

    ctx.font = 'bold 36px "Playfair Display", serif';
    ctx.fillStyle = '#E84C76';
    ctx.textAlign = 'center';
    ctx.fillText('Find your color!', 360, 85);

    ctx.font = 'bold 16px "Noto Serif KR", serif';
    ctx.fillStyle = '#7A5B69';
    ctx.fillText(`✦ 오직 ${currentUserName}만을 위한 로열 뷰티 컬러 진단서 ✦`, 360, 120);

    ctx.save();
    ctx.beginPath();
    ctx.arc(360, 220, 66, 0, Math.PI * 2);
    ctx.fillStyle = currentColor.hex;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
    ctx.restore();

    ctx.font = 'bold 28px "Playfair Display", monospace';
    ctx.fillStyle = '#3D2934';
    ctx.fillText(currentColor.hex, 360, 320);

    ctx.font = 'bold 20px "Noto Serif KR", serif';
    ctx.fillStyle = '#B83258';
    ctx.fillText(bestSeasonValue.textContent, 360, 355);

    const startY = 390;
    const boxWidth = 600;
    const boxHeight = 65;
    const boxX = (720 - boxWidth) / 2;

    const metrics = [
      { title: '색상 (온도감)', val: toneBadge.textContent, color: '#D9532F' },
      { title: '명도 (밝고 어두움)', val: `명도 ${lightnessBadge.textContent}`, color: '#7E6B74' },
      { title: '채도 (선명하고 흐림)', val: `채도 ${saturationBadge.textContent}`, color: '#FF1A68' }
    ];

    metrics.forEach((m, idx) => {
      const y = startY + idx * 78;
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(232, 76, 118, 0.08)';
      ctx.shadowBlur = 10;
      ctx.fillRect(boxX, y, boxWidth, boxHeight);
      ctx.shadowColor = 'transparent';

      ctx.strokeStyle = 'rgba(255, 182, 193, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX, y, boxWidth, boxHeight);

      ctx.textAlign = 'left';
      ctx.font = 'bold 16px "Noto Serif KR", serif';
      ctx.fillStyle = '#3D2934';
      ctx.fillText(m.title, boxX + 24, y + 39);

      ctx.textAlign = 'right';
      ctx.font = 'bold 17px "Noto Serif KR", serif';
      ctx.fillStyle = m.color;
      ctx.fillText(m.val, boxX + boxWidth - 24, y + 39);
    });

    const tipY = 645;
    const tipHeight = 160;
    ctx.fillStyle = '#FFF8FA';
    ctx.fillRect(boxX, tipY, boxWidth, tipHeight);
    ctx.strokeStyle = '#E6B762';
    ctx.strokeRect(boxX, tipY, boxWidth, tipHeight);

    ctx.textAlign = 'center';
    ctx.font = 'bold 16px "Noto Serif KR", serif';
    ctx.fillStyle = '#966E26';
    ctx.fillText(`👑 ${currentUserName}를 위한 시크릿 처방전`, 360, tipY + 32);

    ctx.font = '14px "Noto Serif KR", serif';
    ctx.fillStyle = '#4A2A38';
    
    const tipText = makeupTipValue.textContent;
    if (tipText.length > 40) {
      ctx.fillText(tipText.slice(0, 40), 360, tipY + 62);
      ctx.fillText(tipText.slice(40), 360, tipY + 84);
    } else {
      ctx.fillText(tipText, 360, tipY + 70);
    }

    ctx.font = '13px "Noto Serif KR", serif';
    ctx.fillStyle = '#8B5D71';
    ctx.fillText(`✨ ${textureGuideValue.textContent}`, 360, tipY + 120);

    ctx.font = '12px "Noto Serif KR", serif';
    ctx.fillStyle = '#A38593';
    ctx.fillText('Find your color! ✨ Designed for Princesses & Cosmetics Lovers', 360, 870);

    const link = document.createElement('a');
    link.download = `FindYourColor_${currentUserName}_${currentColor.hex.replace('#', '')}.png`;
    link.href = cardCanvas.toDataURL('image/png');
    link.click();
    showToast(`👑 ${currentUserName}의 진단서 이미지가 저장되었습니다!`);
  }

  /* ==========================================================================
     10. 토스트 알림 헬퍼
     ========================================================================== */
  let toastTimer = null;
  function showToast(msg) {
    toastMsg.textContent = msg;
    princessToast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      princessToast.classList.remove('show');
    }, 2800);
  }

  /* ==========================================================================
     11. 초기 기본 샘플 로드 (봄 웜 코랄 립)
     ========================================================================== */
  createCosmeticSwatchImage(samplePresets.springCoral);
});
