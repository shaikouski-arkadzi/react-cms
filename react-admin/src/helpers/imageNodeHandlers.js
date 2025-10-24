import axios from "axios";
import { BACKEND_URI } from "../constants/siteStylesInIframe";

export const clickHandler = (element, handleInput) => {
  const imgUploader = document.querySelector("#img-upload");
  imgUploader.click();
  imgUploader.addEventListener("change", () => {
    if (imgUploader.files && imgUploader.files[0]) {
      let formData = new FormData();
      formData.append("image", imgUploader.files[0]);

      axios
        .post(`${BACKEND_URI}/pages/uploadImage`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          element.src = `${BACKEND_URI}/img/${res.data.src}`;
          handleInput(element);
        })
        .catch(() => console.log("Ошибка сохранения"))
        .finally(() => {
          imgUploader.value = "";
        });
    }
  });
};
