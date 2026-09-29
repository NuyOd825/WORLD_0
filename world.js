// ============================================================
// WORLD_0 — 세계의 현재 상태
// 이 객체만 "지금 우주가 어떤가"를 담습니다.
// 화면은 이 값을 읽기만 하고, 클릭 등으로 직접 바꾸지 않습니다.
// ============================================================

// 격자 위의 1차원 자유 입자. 단위는 ħ = 1, 질량 m = 1 로 둡니다.
const GRID_N = 256;
const LENGTH = 1;
const DX = LENGTH / (GRID_N - 1);
const MASS = 1;
const HBAR = 1;
const DT = 2e-4;
const PACKET_SIGMA = 0.05;
const PACKET_K0 = 16;

// Crank–Nicolson 계수 r = ħ Δt / (4 m Δx²)
const CN_R = (HBAR * DT) / (4 * MASS * DX * DX);

function createGaussianPacket() {
  const re = new Float64Array(GRID_N);
  const im = new Float64Array(GRID_N);
  const x0 = 0.5 * LENGTH;

  for (let i = 1; i < GRID_N - 1; i += 1) {
    const x = i * DX;
    const envelope = Math.exp(-((x - x0) * (x - x0)) / (2 * PACKET_SIGMA * PACKET_SIGMA));
    const phase = PACKET_K0 * (x - x0);
    re[i] = envelope * Math.cos(phase);
    im[i] = envelope * Math.sin(phase);
  }

  // 양 끝은 무한 벽: ψ = 0
  re[0] = 0;
  im[0] = 0;
  re[GRID_N - 1] = 0;
  im[GRID_N - 1] = 0;

  normalizeWavefunction(re, im);
  return { re, im };
}

function densityAt(re, im, i) {
  return re[i] * re[i] + im[i] * im[i];
}

function totalProbability(re, im) {
  let sum = 0;
  for (let i = 0; i < re.length; i += 1) {
    sum += densityAt(re, im, i);
  }
  return sum * DX;
}

function normalizeWavefunction(re, im) {
  const p = totalProbability(re, im);
  const scale = 1 / Math.sqrt(p);
  for (let i = 0; i < re.length; i += 1) {
    re[i] *= scale;
    im[i] *= scale;
  }
}

function cMul(ar, ai, br, bi) {
  return [ar * br - ai * bi, ar * bi + ai * br];
}

function cDiv(ar, ai, br, bi) {
  const den = br * br + bi * bi;
  return [(ar * br + ai * bi) / den, (ai * br - ar * bi) / den];
}

// 자유 입자 iħ ∂ψ/∂t = -(ħ²/2m) ∂²ψ/∂x² 를 Crank–Nicolson으로 한 걸음 진행합니다.
// 단순 Euler는 확률을 깨뜨리기 쉬워 쓰지 않습니다. 이 방법은 유니터리에 가깝습니다.
function evolveFreeParticle(psiRe, psiIm) {
  const n = psiRe.length;
  const interior = n - 2;
  const r = CN_R;

  const dRe = new Float64Array(interior);
  const dIm = new Float64Array(interior);

  for (let k = 0; k < interior; k += 1) {
    const j = k + 1;
    const leftRe = -r * psiIm[j - 1];
    const leftIm = r * psiRe[j - 1];
    const midRe = psiRe[j] + 2 * r * psiIm[j];
    const midIm = psiIm[j] - 2 * r * psiRe[j];
    const rightRe = -r * psiIm[j + 1];
    const rightIm = r * psiRe[j + 1];
    dRe[k] = leftRe + midRe + rightRe;
    dIm[k] = leftIm + midIm + rightIm;
  }

  // 삼중대각: a = c = -i r, b = 1 + 2 i r
  const aRe = 0;
  const aIm = -r;
  const bRe = 1;
  const bIm = 2 * r;
  const cRe = 0;
  const cIm = -r;

  const cpRe = new Float64Array(interior);
  const cpIm = new Float64Array(interior);
  const dpRe = new Float64Array(interior);
  const dpIm = new Float64Array(interior);

  let q = cDiv(cRe, cIm, bRe, bIm);
  cpRe[0] = q[0];
  cpIm[0] = q[1];
  q = cDiv(dRe[0], dIm[0], bRe, bIm);
  dpRe[0] = q[0];
  dpIm[0] = q[1];

  for (let i = 1; i < interior; i += 1) {
    const ac = cMul(aRe, aIm, cpRe[i - 1], cpIm[i - 1]);
    const denRe = bRe - ac[0];
    const denIm = bIm - ac[1];
    q = cDiv(cRe, cIm, denRe, denIm);
    cpRe[i] = q[0];
    cpIm[i] = q[1];
    const ad = cMul(aRe, aIm, dpRe[i - 1], dpIm[i - 1]);
    q = cDiv(dRe[i] - ad[0], dIm[i] - ad[1], denRe, denIm);
    dpRe[i] = q[0];
    dpIm[i] = q[1];
  }

  const nextRe = new Float64Array(n);
  const nextIm = new Float64Array(n);

  let xRe = dpRe[interior - 1];
  let xIm = dpIm[interior - 1];
  nextRe[interior] = xRe;
  nextIm[interior] = xIm;

  for (let i = interior - 2; i >= 0; i -= 1) {
    const cx = cMul(cpRe[i], cpIm[i], xRe, xIm);
    xRe = dpRe[i] - cx[0];
    xIm = dpIm[i] - cx[1];
    nextRe[i + 1] = xRe;
    nextIm[i + 1] = xIm;
  }

  return { re: nextRe, im: nextIm };
}

const initialPacket = createGaussianPacket();

let world = {
  name: "WORLD_0",
  day: 1,
  objects: 1,
  step: 0, // 상태가 한 번 넘어간 횟수. 0에서 시작합니다.
  psiRe: initialPacket.re,
  psiIm: initialPacket.im,
  probability: totalProbability(initialPacket.re, initialPacket.im),
};

const canvas = document.getElementById("view");
const ctx = canvas.getContext("2d");

const hud = {
  worldName: document.getElementById("world-name"),
  day: document.getElementById("day"),
  objects: document.getElementById("objects"),
  laws: document.getElementById("laws"),
  step: document.getElementById("step"),
  probability: document.getElementById("probability"),
};

// 그래프 높이 기준. 화면용이며 세계 상태를 바꾸지 않습니다.
let displayPeak = 0;
for (let i = 0; i < world.psiRe.length; i += 1) {
  displayPeak = Math.max(displayPeak, densityAt(world.psiRe, world.psiIm, i));
}

// ------------------------------------------------------------
// 세계 법칙
// 앞으로 법칙이 늘어나면 이 목록에만 추가하면 됩니다.
// 각 법칙은 "지금 상태"를 받아 "다음 상태"를 돌려줍니다.
// ------------------------------------------------------------
const WORLD_LAWS = [
  {
    id: 1,
    name: "STATE TRANSITION",
    // LAW 01: 세계는 한 상태에서 다음 상태로 진행한다.
    apply(state) {
      return {
        ...state,
        step: state.step + 1,
      };
    },
  },
  {
    id: 2,
    name: "FREE QUANTUM EVOLUTION",
    // LAW 02: 자유 입자의 파동함수는 시간 의존 슈뢰딩거 방정식으로 진행한다.
    apply(state) {
      const nextPsi = evolveFreeParticle(state.psiRe, state.psiIm);
      return {
        ...state,
        psiRe: nextPsi.re,
        psiIm: nextPsi.im,
        probability: totalProbability(nextPsi.re, nextPsi.im),
      };
    },
  },
];

// ------------------------------------------------------------
// 다음 상태 만들기
// 다음 상태는 항상 "현재 상태 + 그에 작용한 법칙"에서만 나옵니다.
// ------------------------------------------------------------
function nextState(current) {
  let upcoming = current;

  for (const law of WORLD_LAWS) {
    upcoming = law.apply(upcoming);
  }

  return upcoming;
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
}

function drawProbability(state) {
  const width = canvas.width;
  const height = canvas.height;
  const n = state.psiRe.length;
  const baseline = height * 0.72;
  const amplitude = height * 0.5;
  const peak = displayPeak > 0 ? displayPeak : 1;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // 위치축. 밝기는 그 칸에서 입자가 검출될 확률 밀도 |ψ|² 입니다.
  ctx.beginPath();
  ctx.moveTo(0, baseline);
  for (let i = 0; i < n; i += 1) {
    const x = (i / (n - 1)) * width;
    const p = densityAt(state.psiRe, state.psiIm, i);
    const y = baseline - (p / peak) * amplitude;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, baseline);
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = Math.max(1, canvas.height / 800);
  ctx.beginPath();
  ctx.moveTo(0, baseline);
  ctx.lineTo(width, baseline);
  ctx.stroke();
}

function render(state) {
  hud.worldName.textContent = state.name;
  hud.day.textContent = "DAY " + state.day;
  hud.objects.textContent = "OBJECTS: " + state.objects;
  hud.laws.textContent = "WORLD LAWS: " + WORLD_LAWS.length;
  hud.step.textContent = "STEP: " + state.step;
  hud.probability.textContent = "PROBABILITY: " + state.probability.toFixed(8);
  drawProbability(state);
}

// ------------------------------------------------------------
// 세계가 스스로 한 걸음 나아갑니다.
// 점을 움직이거나 바깥에서 숫자를 집어넣지 않습니다.
// ------------------------------------------------------------
function tick() {
  world = nextState(world);
  render(world);
}

// 상태를 넘기는 간격(밀리초).
// 지금은 "일정한 박자"일 뿐이며, 1 STEP이 몇 초인지는 아직 정하지 않습니다.
const STEP_INTERVAL_MS = 40;

window.addEventListener("resize", () => {
  resizeCanvas();
  render(world);
});

resizeCanvas();

// 첫 화면: STEP 0인 시작 상태를 보여줍니다.
render(world);

// 이후에는 세계가 내부 규칙만으로 다음 상태를 만듭니다.
setInterval(tick, STEP_INTERVAL_MS);
