const API = "http://localhost:8000/contacts";

let inpImage = document.getElementById("inpImage");
let inpName = document.getElementById("inpName");
let inpPhoneNum = document.getElementById("inpPhoneNum");
let inpEmail = document.getElementById("inpEmail");
let btnAdd = document.getElementById("btnAdd");
let sectionContact = document.getElementById("sectionContact");
let btnOpenForm = document.getElementById("flush-collapseOne"); //при нажатии на кнопку "Добавить" она закрывается

//! Навешиваем событие на кнопку Добавить контакт
btnAdd.addEventListener("click", () => {
  if (
    !inpImage.value.trim() ||
    !inpName.value.trim() ||
    !inpPhoneNum.value.trim() ||
    !inpEmail.value.trim()
  ) {
    alert("Заполните все поля");
    return;
  }
  //! Создаем новый контакт с ключами, куда добавляем значение наших инпутов
  let newContact = {
    contactImage: inpImage.value,
    contactName: inpName.value,
    contactPhoneNum: inpPhoneNum.value,
    contactEmail: inpEmail.value,
  };
  createContact(newContact);
  readContact();
});

//! ============================== CREATE ==============================

// Функция для добавления нового контакта в базу данных (db.json)

function createContact(contact) {
  fetch(API, {
    // отправляем запрос с помощью метода post для отправки данных
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(contact),
  }).then(() => readContact());
  //Совершаем очистку
  inpImage.value = "";
  inpName.value = "";
  inpPhoneNum.value = "";
  inpEmail.value = "";
  //Меняем класс с помощью toggle у акардиона для того что бы закрывался аккардион при клике на кнопку добавить
  btnOpenForm.classList.toggle("show");
}

//! ============================== READ ==============================
// Создаём функцию для отображения
function readContact() {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      sectionContact.innerHTML = ""; // очищаем тег section что бы не было дубликатов
      data.forEach((item) => {
        sectionContact.innerHTML += `<div class="card" style="width: 15rem">
            <img
              src="${item.contactImage}"
              style="width: 14,7rem; height: 18rem"
              class="card-img-top"
              alt="${item.contactName}"
            />
            <div class="card-body">
              <h5 class="card-text">${item.contactName}</h5>
              <p class="card-text">${item.contactPhoneNum}</p>
              <p class="card-text">${item.contactEmail}</p>
              <button class="btn btn-outline-success btnEdit" id="${item.id}" data-bs-toggle="modal"
              data-bs-target="#exampleModal">
              Изменить
              </button>
              <button class="btn btn-outline-danger btnDelete" id="${item.id}"> Удалить </button>
            </div>
          </div>`;
      });
    });
}
readContact();

//! ============================== DELETE ==============================
// Событие на кнопку Удалить
document.addEventListener("click", (event) => {
  //с помощью обьекта event ищем класс нашего элемента
  let btnDelete = [...event.target.classList];
  if (btnDelete.includes("btnDelete")) {
    // если в нашем btnDelete есть класс btnDelete
    let btnId = event.target.id;
    fetch(`${API}/${btnId}`, {
      method: "DELETE",
    }).then(() => readContact());
  }
});

//! ============================== EDIT ==============================
// Сохраняем в переменные названия инпутов и кнопки
let editInpImage = document.getElementById("editInpImage");
let editInpName = document.getElementById("editInpName");
let editInpPhoneNum = document.getElementById("editInpPhoneNum");
let editInpEmail = document.getElementById("editInpEmail");
let editBtnSave = document.getElementById("editBtnSave");

document.addEventListener("click", (event) => {
  let editArr = [...event.target.classList];
  if (editArr.includes("btnEdit")) {
    let id = event.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        //сохраняем в инпуты модального окна, данные из db.json
        //что бы инпуты  были ужезаполнены нашими уже имеющими значениями для редактирования
        editInpImage.value = data.contactImage;
        editInpName.value = data.contactName;
        editInpPhoneNum.value = data.contactPhoneNum;
        editInpEmail.value = data.contactEmail;
        // добавляем при помощи метода setAttibute id в нашу кнопку сохранить, для того что бы
        // передать в дальнейшем в  аргументы функции editContact()
        editBtnSave.setAttribute("id", data.id);
      });
  }
});

//Событие на кнопку сохранить
editBtnSave.addEventListener("click", () => {
  // создаем обьект с измененными данными в дальнейшем для отправки в db.json
  let editedContact = {
    contactImage: editInpImage.value,
    contactName: editInpName.value,
    contactPhoneNum: editInpPhoneNum.value,
    contactEmail: editInpEmail.value,
  };
  editContact(editedContact, editBtnSave.id);
});

// функция для отправки измененных данных в db.json

function editContact(objEditContact, id) {
  //в параметры принимаем измененный обьект и id по которому будем обращаться
  fetch(`${API}/${id}`, {
    method: "PATCH", // используем метод patch для запроса на изменения данных в db.json
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objEditContact),
  }).then(() => readContact());
}
