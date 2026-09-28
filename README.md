# WORLD_0

철학적 우주 시뮬레이션의 첫 버전입니다.

지금은 **검은 화면, 움직이지 않는 흰 점 하나, 왼쪽 위 상태 글자**만 있습니다.

## 실행 방법

1. `index.html` 파일을 웹 브라우저로 엽니다.
2. 검은 화면 한가운데 흰 점과 왼쪽 위 글자가 보이면 성공입니다.

## 파일 역할

| 파일 | 하는 일 |
| --- | --- |
| `index.html` | 페이지의 뼈대. 어떤 요소가 있는지만 적습니다. |
| `style.css` | 색, 위치, 글꼴. 검은 배경과 중앙의 점을 그립니다. |
| `world.js` | 우주의 상태와 법칙. 다음 상태는 여기서만 만들어집니다. |
| `README.md` | 이 프로젝트를 사람이 읽기 위한 설명서입니다. |

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
1 STEP이 몇 초인지는 아직 정의하지 않습니다.

점은 아직 움직이지 않습니다. 운동의 법칙이 없기 때문입니다.

## Current State

DAY 1  
OBJECTS: 1  
AXIOMS: 4  
WORLD LAWS: 1
