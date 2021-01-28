const d = document,
  ls = localStorage,
  btnClearAll = d.querySelector(".clear-items"),
  itemsLeft = d.querySelector("#items-left"),
  toDoMenu = d.querySelectorAll('input[type="radio"]'),
  listToDoItems = d.querySelector(".list-to-do-items"),
  formToDo = d.querySelector(".new-item"),
  input = d.querySelector("#new"),
  btnDarkMode = d.querySelector(".dark-mode-btn"),
  selectoresDark = d.querySelectorAll("[data-dark-mode]"),
  selectoresDarkSecond = d.querySelectorAll("[data-dark-second]");
let itemsRemain = d.querySelectorAll('[data-success="0"]').length,
  listToDo = Array.from(d.querySelectorAll(".to-do")),
  itemsTitle = Array.from(d.querySelectorAll(".to-do > .to-do-header > h6")),
  btnCheck = Array.from(d.querySelectorAll(".success")),
  btnClose = Array.from(d.querySelectorAll(".to-do > img")),
  darkTheme = !1;
function limpiarToDo() {
  d.querySelectorAll('[data-success="1"]').forEach((e, t) => {
    listToDoItems.removeChild(e), filtrarElementosRestantes(e);
  }),
    actualizarDataAttributesElementos(),
    actualizarVistaDeListToDo(1),
    activarOpcionAll(),
    actualizarLocalStorage();
}
function actualizarRemainItemsLeft() {
  (itemsRemain = d.querySelectorAll('[data-success="0"]').length),
    (itemsLeft.textContent = `${itemsRemain} items left`);
}
function actualizarVistaDeListToDo(e) {
  limpiarListToDo();
  const t = d.createDocumentFragment(),
    a = [...listToDo];
  1 === e
    ? a.forEach((e) => t.appendChild(e))
    : 2 === e
    ? a
        .filter((e) => "0" === e.dataset.success)
        .forEach((e) => t.appendChild(e))
    : 3 === e &&
      a
        .filter((e) => "1" === e.dataset.success)
        .forEach((e) => t.appendChild(e)),
    listToDoItems.appendChild(t);
}
function limpiarListToDo() {
  let e = d.querySelector(".list-to-do-items");
  for (; e.firstElementChild; ) e.removeChild(e.firstElementChild);
}
function actualizarDataAttributesElementos() {
  listToDo.forEach((e, t) => {
    (e.querySelector(".success").dataset.check = t),
      (e.querySelector("img:last-child").dataset.close = t);
  });
}
function ingresarTarea(e, t) {
  const a = d.createElement("section"),
    o = d.createElement("header"),
    r = d.createElement("h6"),
    s = d.createElement("img"),
    l = d.createElement("div");
  a.classList.add("to-do"),
    a.setAttribute("data-success", `${t}`),
    o.classList.add("to-do-header"),
    s.setAttribute("data-close", `${listToDo.length}`),
    (s.src = "images/icon-cross.svg"),
    (s.alt = "Delete Icon"),
    l.classList.add("success"),
    "1" === t &&
      (l.classList.add("success-check"), r.classList.add("title-success")),
    l.setAttribute("data-check", `${listToDo.length}`),
    (r.textContent = e),
    o.appendChild(r),
    o.appendChild(l),
    a.appendChild(o),
    a.appendChild(s),
    btnCheck.push(l),
    btnClose.push(s),
    itemsTitle.push(r),
    listToDo.push(a),
    l.addEventListener("click", (e) => {
      chequearActividadCumplida(l)
    },true),
    s.addEventListener("click", (e) => botonEliminarActividad(s)),
    listToDoItems.appendChild(a),
    actualizarRemainItemsLeft(),
    actualizarLocalStorage();
}
function botonEliminarActividad(e) {
  let t = Number(e.dataset.close);
  filtrarElementosRestantes(listToDo[t]),
    actualizarVistaDeListToDo(1),
    actualizarDataAttributesElementos(),
    activarOpcionAll(),
    actualizarRemainItemsLeft(),
    actualizarLocalStorage();
}
function chequearActividadCumplida(e) {
  let t = Number(e.dataset.check);
  e.classList.toggle("success-check"),
    itemsTitle[t].classList.toggle("title-success"),
    listToDo[t].setAttribute(
      "data-success",
      "1" === listToDo[t].dataset.success ? "0" : "1"
    ),
    actualizarRemainItemsLeft(),
    actualizarLocalStorage();
}
function cambiarModo() {
  darkTheme
    ? ((darkTheme = lightMode()), ls.setItem("theme", "light"))
    : ((darkTheme = darkMode()), ls.setItem("theme", "dark"));
}
function darkMode() {
  return (
    btnDarkMode.firstElementChild.classList.add("none"),
    btnDarkMode.lastElementChild.classList.remove("none"),
    selectoresDark.forEach((e) => e.classList.add("dark-mode-primary")),
    selectoresDarkSecond.forEach((e) => e.classList.add("dark-mode-secondary")),
    !0
  );
}
function lightMode() {
  return (
    btnDarkMode.firstElementChild.classList.remove("none"),
    btnDarkMode.lastElementChild.classList.add("none"),
    selectoresDark.forEach((e) => e.classList.remove("dark-mode-primary")),
    selectoresDarkSecond.forEach((e) =>
      e.classList.remove("dark-mode-secondary")
    ),
    !1
  );
}
function reordenarListToDo() {
  d.querySelector("#radio1").checked &&
    ((listToDo = Array.from(d.querySelectorAll(".to-do"))),
    (itemsTitle = Array.from(
      d.querySelectorAll(".to-do > .to-do-header > h6")
    )),
    (btnCheck = Array.from(d.querySelectorAll(".success"))),
    (btnClose = Array.from(d.querySelectorAll(".to-do > img"))),
    actualizarDataAttributesElementos());
}
function actualizarLocalStorage() {
  reordenarListToDo();
  const e = {};
  listToDo.forEach(
    (t, a) => (e[a] = [t.querySelector("h6").textContent, t.dataset.success])
  );
  const t = JSON.stringify(e);
  ls.setItem("todo", t);
}
function filtrarElementosRestantes(e) {
  (listToDo = listToDo.filter((t) => e !== t)),
    (itemsTitle = itemsTitle.filter(
      (t) => e.querySelector(".to-do-header > h6") !== t
    )),
    (btnClose = btnClose.filter((t) => e.querySelector("img") !== t)),
    (btnCheck = btnCheck.filter(
      (t) => e.querySelector(".to-do-header > div") !== t
    ));
}
function obtenerModoTema() {
  null === ls.getItem("theme") && ls.setItem("theme", "light"),
    (darkTheme = "dark" === ls.getItem("theme") ? darkMode() : lightMode());
}
function obtenerTareasLocalStorage() {
  if (
    (null === ls.getItem("todo") && ls.setItem("todo", ""),
    "" !== ls.getItem("todo"))
  ) {
    const e = JSON.parse(ls.getItem("todo"));
    Object.values(e).forEach((e) => ingresarTarea(e[0], e[1]));
  }
}
new Sortable(listToDoItems, { animation: 150 }),
  d.addEventListener("DOMContentLoaded", () => {
    obtenerModoTema(), obtenerTareasLocalStorage(), actualizarRemainItemsLeft();
  }),
  btnClearAll.addEventListener("click", limpiarToDo),
  btnDarkMode.addEventListener("click", cambiarModo),
  formToDo.addEventListener("submit", (e) => {
    e.preventDefault(), ingresarTarea(input.value, "0"), (input.value = "");
  }),
  toDoMenu.forEach((e) => {
    e.addEventListener("change", (t) =>
      actualizarVistaDeListToDo(Number(e.id.slice(-1)))
    );
  });
const activarOpcionAll = () => (d.querySelector("#radio1").checked = !0);
