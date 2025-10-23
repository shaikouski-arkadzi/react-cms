import axios from "axios";

export const clickHandler = (element, handleInput) => {
  const imgUploader = document.querySelector("#img-upload");
  imgUploader.click();
  imgUploader.addEventListener("change", () => {
    if (imgUploader.files && imgUploader.files[0]) {
      let formData = new FormData();
      formData.append("image", imgUploader.files[0]);

      axios
        .post("http://localhost:3000/pages/uploadImage", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          element.src = `http://localhost:3000/img/${res.data.src}`;
          handleInput(element);
        })
        .catch(() => console.log("Ошибка сохранения"))
        .finally(() => {
          imgUploader.value = "";
        });
    }
  });
};
