import {
  containerSelector,
  templateSelector,
  editProfileForm,
  addCardForm,
  profileName,
  profileAbout,
  buttonEdit,
  buttonAdd
} from "./components/Utils.js"
import FormValidator from "./components/FormValidator.js";
import Card from "./components/Card.js";
import "../pages/index.css";
import PopupWithImage from "./components/PopupWithImage.js";
import PopupWithForm from "./components/PopupWithForm.js";
import Section from "./components/Section.js";
import UserInfo from "./components/UserInfo.js";
import Api from "./components/Api.js"

const api = new Api({
  baseUrl: "https://around.nomoreparties.co/v1/group-4",
  headers: {
    authorization: "82ebb591-5edb-4637-a2e8-efb178ef4c56",
    "Content-Type": "application/json"
  }
});



const cardDelete = new PopupWithForm({
  popupSelector: ".popup__delete-confirm",
  handleSubmitForm: (data) => {
    console.log ('hi', data);
    api.removeCard(id)
    .then (() => {cardDelete.close()});
    console.log("in handleSubmit", id);
  }
});

api.getAppInfo()
.then(([userInfoData, initalCardsData]) => {
  //console.log("initial", initalCardsData);
  const userId = userInfoData._id;
  const cardsList = new Section(
    {items: initalCardsData,
      renderer: (data) => {
        const card = new Card(data,
          userId,
          templateSelector,
          (id) => {
            console.log("cardD", cardDelete.open);
          cardDelete.open();
          cardDelete.setSubmitAction(() => {
            handleDeleteClick(id).then(() => {
              card.removeCard();
            })
          })
        },
          () => {
          popupWithImage.open(data);
        })
        const cardElement = card.generateCard();
        cardsList.addItem(cardElement);
      },
      containerSelector
    }
  );
  cardsList.renderItems();

  const addForm = new PopupWithForm({
    popupSelector: ".popup__add-card",
    handleSubmitForm: (data) => {

      api.addCard(data)
        .then(data => {
          const card = new Card(data,
            userId,
            templateSelector,
            (id) => {
              cardDelete.open();
              cardDelete.setSubmitAction(() => {
                console.log('id', id);
                handleDeleteClick(id).then(() => {
                  console.log(id);
                  card.removeCard();
                })
              })
            },
            () => {
          popupWithImage.open(data);
          });
          const cardElement = card.generateCard();
          cardsList.addItem(cardElement);
        });
    }
  });
  addForm.setEventListeners();
  buttonAdd.addEventListener("click", () => {addForm.open()});
})

const profileInfo =  new UserInfo({
  nameSelector: profileName,
  descriptionSelector: profileAbout,
});

//console.log(api.getUserInfo);
api.getUserInfo()
.then(res => {
  //console.log("profile!!!!", res);
  profileInfo.setUserInfo({ userName: res.name, userDescription: res.about })
})

// obj defaultConfig array, used in FormValidator.js
const defultConfig = {
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__submit-button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible"
}

//new FormValidator for Profile and Add Card
const editProfileValidation = new FormValidator(defultConfig, editProfileForm);
const addCardValidation = new FormValidator(defultConfig, addCardForm);

//calls function to validate profile and add card forms
editProfileValidation.enableValidation();
addCardValidation.enableValidation();

//declares new PopupWithImage and adds eventListeners.
const popupWithImage = new PopupWithImage(".popup__picture-section");
popupWithImage.setEventListeners();



function submitForm(data) {
  handleProfileEdit(data);
  profileForm.open();
}

function handleProfileEdit(data) {
  profileInfo.setUserInfo({
    userName: data.name,
    userDescription: data.about,
  });
}

const profileForm = new PopupWithForm({
  popupSelector: ".popup__edit-profile",
  handleSubmitForm: submitForm
});

profileForm.setEventListeners();
buttonEdit.addEventListener("click", () => {profileForm.open()});

