// ============================================================
// WORLD_0 — 세계의 현재 상태
// 이 객체만 "지금 우주가 어떤가"를 담습니다.
// 화면은 이 값을 읽기만 하고, 클릭 등으로 직접 바꾸지 않습니다.
// ============================================================
let world = {
  name: "WORLD_0",
  day: 1,
  objects: 1,
  step: 0, // 상태가 한 번 넘어간 횟수. 0에서 시작합니다.
};

// HTML 안의 빈 칸을 찾아옵니다.
const hud = {
  worldName: document.getElementById("world-name"),
  day: document.getElementById("day"),
  objects: document.getElementById("objects"),
  laws: document.getElementById("laws"),
  step: document.getElementById("step"),
};

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

// 관찰용. 세계의 숫자를 글자로 바꿉니다.
function render(state) {
  hud.worldName.textContent = state.name;
  hud.day.textContent = "DAY " + state.day;
  hud.objects.textContent = "OBJECTS: " + state.objects;
  hud.laws.textContent = "WORLD LAWS: " + WORLD_LAWS.length;
  hud.step.textContent = "STEP: " + state.step;
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
const STEP_INTERVAL_MS = 800;

// 첫 화면: STEP 0인 시작 상태를 보여줍니다.
render(world);

// 이후에는 세계가 내부 규칙만으로 다음 상태를 만듭니다.
setInterval(tick, STEP_INTERVAL_MS);
