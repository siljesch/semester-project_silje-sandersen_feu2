import { showAlert } from "./components/alert.js";
import { renderNav } from "./components/nav.js";
import {
  editForm,
  title,
  productsUrl,
  price,
  description,
  formMessage,
  formId,
  tokenKey,
  imgurl,
  strapiUrl,
  featured,
  deleteBtn,
  deleteMessage,
} from "./constants.js";
import { getToken } from "./utils/storage.js";

renderNav();

const token = getToken(tokenKey);

if (!token) {
  location.href = "index.html";
}

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

(async function () {
  try {
    const response = await fetch(productsUrl + id);
    const json = await response.json();
    document.querySelector(".loading").classList.add("hide");

    if (json.Featured) {
      featured.checked = true;
    }

    title.value = json.Title;
    price.value = json.Price;
    description.value = json.Description;
    imgurl.value = json.imgUrl;
    formId.value = json.id;

    console.log(json);
  } catch (error) {
    console.log(error);
  } finally {
    editForm.style.display = "block";
  }
})();

const submitEditForm = (event) => {
  event.preventDefault();
  formMessage.innerHTML = "";

  const titleValue = title.value.trim();
  const priceValue = parseFloat(price.value);
  const descriptionValue = description.value.trim();
  const imageValue = imgurl.value.trim();
  const featuredCheck = featured.checked;
  const idValue = formId.value;

  if (
    titleValue.length === 0 ||
    priceValue.length === 0 ||
    isNaN(priceValue) ||
    descriptionValue.length === 0 ||
    imageValue.length === 0
  ) {
    return (formMessage.innerHTML += showAlert(
      "Please enter proper values",
      "danger"
    ));
  }

  updateProduct(
    titleValue,
    priceValue,
    descriptionValue,
    idValue,
    imageValue,
    featuredCheck
  );
};

editForm.addEventListener("submit", submitEditForm);

async function updateProduct(title, price, description, id, img, featured) {
  const data = JSON.stringify({
    Title: title,
    Price: price,
    Description: description,
    Featured: featured,
    imgUrl: img,
  });
  const options = {
    method: "PUT",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(productsUrl + id, options);
    const json = await response.json();
    console.log(json);

    if (json.updated_at) {
      formMessage.innerHTML += showAlert("Yay! Product is updated", "success");
    }

    if (json.error) {
      formMessage.innerHTML += showAlert(json.message, "danger");
    }
  } catch (error) {
    console.log(error);
    formMessage.innerHTML += showAlert("An error occured", "danger");
  }
}

deleteBtn.onclick = function deleteProduct() {
  deleteListener(id);
};

async function deleteListener(id) {
  const confirmDelete = confirm("Do you wish to delete this product?");

  if (confirmDelete) {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(productsUrl + id, options);
      const json = await response.json();

      editForm.style.display = "none";

      deleteMessage.innerHTML += showAlert("Product is deleted", "success");
    } catch (error) {
      console.log(error);
      formMessage.innerHTML += showAlert("An error occured", "danger");
    }
  }
}
