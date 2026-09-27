// WORLD_0의 현재 상태입니다. 지금은 변하지 않습니다.
const world = {
  name: "WORLD_0",
  day: 0,
  objects: 1,
  laws: 0,
};

// HTML 안의 빈 칸을 찾아옵니다.
const worldNameEl = document.getElementById("world-name");
const dayEl = document.getElementById("day");
const objectsEl = document.getElementById("objects");
const lawsEl = document.getElementById("laws");

// 화면에 상태를 그대로 보여줍니다.
worldNameEl.textContent = world.name;
dayEl.textContent = "DAY " + world.day;
objectsEl.textContent = "OBJECTS: " + world.objects;
lawsEl.textContent = "LAWS: " + world.laws;
