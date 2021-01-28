const d = document,
ls = localStorage,
btnClearAll = d.querySelector('.clear-items'),
itemsLeft = d.querySelector('#items-left'),
toDoMenu = d.querySelectorAll('input[type="radio"]'),
listToDoItems = d.querySelector('.list-to-do-items'),
formToDo = d.querySelector('.new-item'),
input = d.querySelector('#new'),
btnDarkMode = d.querySelector('.dark-mode-btn'),
selectoresDark = d.querySelectorAll('[data-dark-mode]'),
selectoresDarkSecond = d.querySelectorAll('[data-dark-second]');
let itemsRemain = d.querySelectorAll('[data-success="0"]').length,
listToDo = Array.from(d.querySelectorAll('.to-do')),
itemsTitle = Array.from(d.querySelectorAll('.to-do > .to-do-header > h6')),
btnCheck = Array.from(d.querySelectorAll('.success')),
btnClose = Array.from(d.querySelectorAll('.to-do > img')),
darkTheme = false;

new Sortable(listToDoItems, {
  animation: 150,
});

d.addEventListener('DOMContentLoaded', () => {
  obtenerModoTema();
  obtenerTareasLocalStorage();
  actualizarRemainItemsLeft();
});

btnClearAll.addEventListener('click', limpiarToDo);

btnDarkMode.addEventListener('click', cambiarModo);

formToDo.addEventListener('submit', e => {
  e.preventDefault();
  ingresarTarea(input.value, '0');
  input.value = '';
})

toDoMenu.forEach(radio => {
  radio.addEventListener('change', e => actualizarVistaDeListToDo(Number(radio.id.slice(-1))))
})

function limpiarToDo() {
  const itemsSuccess = d.querySelectorAll('[data-success="1"]');
  itemsSuccess.forEach((item, arr) => {
    listToDoItems.removeChild(item);
    filtrarElementosRestantes(item);
  });
  actualizarDataAttributesElementos();
  actualizarVistaDeListToDo(1);
  activarOpcionAll();
  actualizarLocalStorage();
}
function actualizarRemainItemsLeft() {
  itemsRemain = d.querySelectorAll('[data-success="0"]').length;
  itemsLeft.textContent = `${itemsRemain} items left`;
}

function actualizarVistaDeListToDo(lista) {
  limpiarListToDo();
  const fragment = d.createDocumentFragment();
  const arr = [...listToDo]
  if(lista === 1){
    arr.forEach(item => fragment.appendChild(item));
  }else if(lista === 2){
    const aux = arr.filter(item => item.dataset.success === '0');
    aux.forEach(item => fragment.appendChild(item));
  }else if(lista === 3){
    const aux = arr.filter(item => item.dataset.success === '1');
    aux.forEach(item => fragment.appendChild(item));
  }
  listToDoItems.appendChild(fragment);
}

function limpiarListToDo() {
  let aux = d.querySelector('.list-to-do-items');
  while(aux.firstElementChild){
    aux.removeChild(aux.firstElementChild);
  }
}

function actualizarDataAttributesElementos() {
  listToDo.forEach((item, arr) => {
    item.querySelector('.success').dataset.check = arr;
    item.querySelector('img:last-child').dataset.close = arr;
  })
}

function ingresarTarea(tarea, hecha) {
  // CREACION ELEMENTOS
  const sectionToDo = d.createElement('section'),
  header = d.createElement('header'),
  h6 = d.createElement('h6'),
  img = d.createElement('img'),
  divSuccess = d.createElement('div');

  // AGREGANDO CLASES O ATRIBUTOS
  sectionToDo.classList.add('to-do');
  sectionToDo.setAttribute('data-success',`${hecha}`);
  header.classList.add('to-do-header');
  img.setAttribute('data-close', `${listToDo.length}`);
  img.src=`images/icon-cross.svg`;
  img.alt="Delete Icon";
  divSuccess.classList.add('success');
  if(hecha === '1'){
    divSuccess.classList.add('success-check');
    h6.classList.add('title-success');
  }
  divSuccess.setAttribute('data-check', `${listToDo.length}`);
  
  // AGREGANDO CONTENIDO
  h6.textContent = tarea;
  
  // ANIDANDO
  header.appendChild(h6);
  header.appendChild(divSuccess);
  sectionToDo.appendChild(header);
  sectionToDo.appendChild(img);

  // AGREGANDO A LOS ARRAYS
  btnCheck.push(divSuccess);
  btnClose.push(img);
  itemsTitle.push(h6);
  listToDo.push(sectionToDo);
  if(window.devicePixelRatio === 1) { divSuccess.addEventListener('click', e => chequearActividadCumplida(divSuccess)); }
  else{ divSuccess.addEventListener('touchstart', e => chequearActividadCumplida(divSuccess)); }
  img.addEventListener('click', e => botonEliminarActividad(img));
  
  // PEGANDOLE AL DOM
  listToDoItems.appendChild(sectionToDo);
  actualizarRemainItemsLeft();
  actualizarLocalStorage();
}

function botonEliminarActividad(btn) {
  let id = Number(btn.dataset.close);
  let item = listToDo[id];
  filtrarElementosRestantes(item);
  actualizarVistaDeListToDo(1);
  actualizarDataAttributesElementos();
  activarOpcionAll();
  actualizarRemainItemsLeft();
  actualizarLocalStorage();
}

function chequearActividadCumplida(btn) {
  let id = Number(btn.dataset.check);
  btn.classList.toggle('success-check');
  itemsTitle[id].classList.toggle('title-success');
  listToDo[id].setAttribute('data-success',(listToDo[id].dataset.success === '1') ? '0' : '1');
  actualizarRemainItemsLeft();
  actualizarLocalStorage();
}

function cambiarModo() {
  if(!darkTheme){
    darkTheme = darkMode();
    ls.setItem('theme','dark');
  }else{
    darkTheme = lightMode();
    ls.setItem('theme','light');
  }
}

function darkMode() {
  btnDarkMode.firstElementChild.classList.add('none');
  btnDarkMode.lastElementChild.classList.remove('none');
  selectoresDark.forEach(item => item.classList.add('dark-mode-primary'))
  selectoresDarkSecond.forEach(item => item.classList.add('dark-mode-secondary'))
  return true;
}

function lightMode() {
  btnDarkMode.firstElementChild.classList.remove('none');
  btnDarkMode.lastElementChild.classList.add('none');
  selectoresDark.forEach(item => item.classList.remove('dark-mode-primary'))
  selectoresDarkSecond.forEach(item => item.classList.remove('dark-mode-secondary'))
  return false;
}

function reordenarListToDo() {
  if(d.querySelector('#radio1').checked){
    listToDo = Array.from(d.querySelectorAll('.to-do'));
    itemsTitle = Array.from(d.querySelectorAll('.to-do > .to-do-header > h6'));
    btnCheck = Array.from(d.querySelectorAll('.success'));
    btnClose = Array.from(d.querySelectorAll('.to-do > img'));
    actualizarDataAttributesElementos();
  }
}

function actualizarLocalStorage() {
  reordenarListToDo();
  const obj = {}
  listToDo.forEach((item, arr) => obj[arr] = [item.querySelector('h6').textContent, item.dataset.success])
  const aux = JSON.stringify(obj)
  ls.setItem('todo',aux);
}

function filtrarElementosRestantes(item) {
  listToDo = listToDo.filter(item2 => item!==item2);
  itemsTitle = itemsTitle.filter(item3 => item.querySelector('.to-do-header > h6') !== item3);
  btnClose = btnClose.filter(item4 => item.querySelector('img') !== item4);
  btnCheck = btnCheck.filter(item5 => item.querySelector('.to-do-header > div') !== item5);
}

function obtenerModoTema() {
  if(ls.getItem('theme') === null) ls.setItem('theme','light');
  darkTheme = (ls.getItem('theme') === 'dark') 
    ? darkMode()
    : lightMode();
}

function obtenerTareasLocalStorage() {
  if(ls.getItem('todo') === null){
    ls.setItem('todo', '');
  }
  if(ls.getItem('todo')!==''){
    const aux = JSON.parse(ls.getItem('todo'));
    Object.values(aux).forEach(tarea => ingresarTarea(tarea[0], tarea[1]));
  }
}

const activarOpcionAll = () => d.querySelector('#radio1').checked = true;