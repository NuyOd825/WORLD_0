# WORLD_0

철학적 우주 시뮬레이션입니다.

개발 기준으로는 **DAY 2**까지 구현되어 있습니다. 세계 상태의 `world.day`는 아직 **1**입니다.

검은 화면에는 고정된 흰 점이 아니라, **1차원 양자 입자 한 개의 파동함수**가 만든 위치별 확률 분포가 그려집니다. 왼쪽 위 HUD는 상태를 읽기만 합니다.

## 첫 객체는 행성이 아닙니다

화면에 보이는 흰 분포는 입자의 **확정된 위치**가 아닙니다.
각 격자 칸의 밝기(그래프 높이)는 그 위치에서 입자가 검출될 확률 밀도 \(|\psi(x)|^2\) 입니다.

입자는 격자 각 칸에 복소수 \(\psi = a + bi\) (실수부·허수부)를 갖습니다.
시작 상태는 공간 중앙 부근에 모인 **가우시안 파동묶음**입니다.

## 실행 방법

1. `index.html` 파일을 웹 브라우저로 엽니다.
2. 왼쪽 위에 `WORLD_0`, `DAY 1`, `OBJECTS: 1`, `WORLD LAWS: 2`, `STEP`, `PROBABILITY`가 보이면 성공입니다.
3. 화면 가운데~아래쪽에 흰 봉우리 하나가 있고, STEP이 저절로 올라가며 봉우리가 퍼지거나 이동합니다.

## 파일 역할

| 파일 | 하는 일 |
| --- | --- |
| `index.html` | 페이지의 뼈대. HUD와 읽기 전용 캔버스만 둡니다. |
| `style.css` | 검은 배경, HUD 글꼴, 캔버스가 화면을 채우게 합니다. |
| `world.js` | 우주의 상태와 법칙. 파동함수와 다음 상태는 여기서만 만들어집니다. |
| `README.md` | 이 프로젝트를 사람이 읽기 위한 설명서입니다. |

## 이번 변경 파일

- `world.js` — 상태의 첫 객체를 복소 파동함수로 두고, LAW 02로 자유 진화를 적용합니다. HUD에 전체 확률을 표시합니다.
- `index.html` — 중앙의 점 요소를 없애고, \(|\psi|^2\)를 그리는 캔버스와 확률 HUD를 둡니다.
- `style.css` — 점 스타일을 제거하고 캔버스를 전체 화면으로 둡니다.
- `README.md` — 양자 입자 모형, 화면의 의미, 한계, 검증 방법을 기록합니다.

## Axioms

이 세계를 만드는 바깥의 제약입니다. 법칙보다 먼저 있습니다.

### AXIOM 01 — CAUSALITY

Every state must arise from a previous state and the laws acting upon it.

모든 상태는 이전 상태와 그에 작용한 규칙으로부터 발생해야 한다.

### AXIOM 02 — NON-INTERVENTION

Once a world is running, its internal state cannot be directly manipulated from outside.

세계가 실행된 이후에는 외부에서 내부 상태를 직접 조작할 수 없다.

### AXIOM 03 — NO HARDCODED OUTCOME

Complex entities and outcomes must emerge from general rules, not be explicitly created.

복잡한 존재와 결과는 일반 규칙의 상호작용으로부터 나타나야 하며, 직접 구현해서는 안 된다.

### AXIOM 04 — UNIVERSALITY

The same rules must apply to all entities under the same conditions.

동일한 조건에 놓인 모든 존재에는 동일한 규칙이 적용된다.

## World Laws

이 세계 안에서 상태를 바꾸는 규칙입니다.

### LAW 01 — STATE TRANSITION

The world advances from one state to the next.
Each update creates the next state from the current state and the laws acting upon it.

세계는 하나의 상태에서 다음 상태로 진행한다.
각 업데이트는 현재 상태와 그에 작용하는 법칙으로부터 다음 상태를 만든다.

STEP은 세계가 한 상태에서 다음 상태로 넘어간 횟수입니다.
1 STEP이 몇 초인지는 아직 정의하지 않습니다. 화면의 갱신 간격은 관찰용 박자일 뿐입니다.

### LAW 02 — FREE QUANTUM EVOLUTION

A free particle's wavefunction advances by the time-dependent Schrödinger equation.

자유 입자의 파동함수는 시간 의존 슈뢰딩거 방정식으로 진행한다.

\[
i\hbar\frac{\partial\psi}{\partial t} = -\frac{\hbar^{2}}{2m}\frac{\partial^{2}\psi}{\partial x^{2}}
\]

매 STEP마다 격자 위의 \(\psi\)를 갱신합니다. 퍼텐셜은 아직 없습니다(\(V = 0\)).
시간 적분은 확률이 쉽게 발산하는 단순 Euler가 아니라 **Crank–Nicolson**(복소 삼중대각 연립방정식, Thomas 해법)을 씁니다. 외부 수치 라이브러리는 쓰지 않습니다.

전체 확률 \(\sum_i |\psi_i|^2\,\Delta x\) 는 HUD의 `PROBABILITY`로 관찰합니다. 이상적으로는 1 근처를 유지해야 합니다.

## Current State

DAY 1  
OBJECTS: 1  
AXIOMS: 4  
WORLD LAWS: 2

검출, 무작위 선택, 이중슬릿, 두 번째 입자는 아직 없습니다.

## 모형의 한계

- **1차원**입니다. 공간은 선 위의 격자뿐입니다.
- 객체는 **입자 하나**뿐입니다.
- 화면에 그리는 것은 궤적이 아니라 **위치 확률 밀도**입니다. 관측(붕괴)은 없습니다.
- 격자의 양 끝은 \(\psi = 0\)인 벽입니다. 충분히 퍼지거나 벽에 닿으면 반사·간섭이 생깁니다. 무한히 넓은 자유 공간이 아닙니다.
- 비상대론적 슈뢰딩거 방정식이며 \(\hbar = 1\), \(m = 1\) 단위입니다.
- Crank–Nicolson은 이산 격자에서 확률을 잘 보존하지만, 연속 공간의 정확한 해가 아닙니다.
- `world.day`는 아직 1입니다.

## 검증 방법

1. 브라우저에서 `index.html`을 연다.
2. HUD가 `OBJECTS: 1`, `WORLD LAWS: 2`를 보여 주고, `STEP`이 자동으로 증가하는지 확인한다.
3. 시작 직후 흰 봉우리가 화면 중앙 부근에 모여 있는지 확인한다.
4. `PROBABILITY`가 약 `1.00000000`에서 크게 벗어나지 않는지 확인한다. (발산하거나 0으로 무너지면 실패)
5. 시간이 지나면 봉우리가 퍼지고, 운동량이 있으면 옆으로 이동한다. 클릭해도 분포가 점프하지 않아야 한다. (화면은 읽기 전용)
6. 개발용으로, 같은 Crank–Nicolson 한 걸음을 Node에서 여러 번 돌려 \(\lvert P-1\rvert\)가 작게 유지되는지도 확인할 수 있다.
