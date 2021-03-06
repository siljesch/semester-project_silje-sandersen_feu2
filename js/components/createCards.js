import {
  cartContainer,
  cartKey,
  featuredProducts,
  productcont,
  strapiUrl,
} from "../constants.js";
import { retrieveFromStorage, saveToStorage } from "../utils/storage.js";
import { showAlert } from "./alert.js";
import { findIndex } from "./findIndex.js";
import { summarizeCart } from "./sum.js";

let collection;
let storageArray = retrieveFromStorage(cartKey);

const createCart = (item, version) => {
  const { id, imgUrl, Title, Price } = item;

  return `
  <div class="cart">
  <div class="cart__item">
  <a href="productDetail.html?id=${id}">
  <img class="cart__item--img" src="${imgUrl}" alt="Product image">
  <div class="cart__itemText">
  <h3 class="cart__itemText--title">${Title}</h3>
  <p class="cart__itemText--price">${Price} NOK</p>
  </a>
  <button class="cart__item--btn" id="${id}-${version}"><i class="fas fa-trash"></i></button>
  </div>
  </div>
  </div>`;
};

const removeListener = () => {
  storageArray.forEach((item) => {
    document
      .getElementById(`${item.id}-remove`)
      .addEventListener("click", () => {
        storageArray.splice(findIndex(storageArray, item), 1);
        saveToStorage(cartKey, storageArray);
        renderCart();
      });
  });
};

if (localStorage.getItem(cartKey) == null) {
  collection = [];
} else {
  collection = JSON.parse(localStorage.getItem(cartKey));
}

export const addListener = (item) => {
  document.getElementById(`${item.id}-add`).addEventListener("click", () => {
    collection.push(item);
    saveToStorage(cartKey, collection);
    const addMessage = document.querySelector(".detailMessage");
    addMessage.innerHTML += showAlert(
      "Product is added to the cart",
      "success"
    );
  });
};

export const renderCart = () => {
  cartContainer.innerHTML = "";
  if (!storageArray.length) {
    cartContainer.innerHTML = "<h2>No items added</h2>";
  } else {
    storageArray.forEach((item) => {
      return (cartContainer.innerHTML += createCart(item, "remove"));
    });
    summarizeCart(storageArray);
    removeListener();
  }
};

export const renderFeaturedCard = (arr) => {
  featuredProducts.innerHTML = "";
  arr.forEach((element) => {
    if (element.Featured) {
      featuredProducts.innerHTML += `
            <div class="card featuredCard">
            <div class="imgCont">
            <a href="productDetail.html?id=${element.id}">
                <div class="imgCont__overlay"></div>
                <img class="card__img" src="${element.imgUrl}" alt="Product image">
                <div class="imgCont__details fadeIn-top">
                    <h4>Read more</h4>
                </div>
            </a>
            </div>
            <h3>${element.Title}</h3>
            <p>${element.Price}</p>
            </div>`;
    }
  });
};

export const renderProductCard = (arr) => {
  productcont.innerHTML = "";
  arr.forEach((element) => {
    console.log(element);
    productcont.innerHTML += `
    <div class="card productCard">
        <div class="imgCont">
            <a href="productDetail.html?id=${element.id}">
                <div class="imgCont__overlay"></div>
                <img class="card__img" src="${element.imgUrl}" alt="Product image">
                <div class="imgCont__details fadeIn-top">
                    <h4>Read more</h4>
                </div>
            </a>
        </div>
        <h3>${element.Title}</h3>
        <p>${element.Price}</p>
    </div>`;
  });
};
