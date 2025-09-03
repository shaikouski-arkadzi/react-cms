function getPageList() {
  document.querySelectorAll("h1").forEach((h1) => h1.remove());

  fetch("http://localhost:3000/pages")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((file) => {
        const h1 = document.createElement("h2");
        h1.textContent = file;
        document.body.appendChild(h1);
      });
    })
    .catch((error) => console.error("Error geting page:", error));
}

getPageList();

document.querySelector("button").addEventListener("click", () => {
  const name = document.querySelector("input").value;

  fetch("http://localhost:3000/createPage", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `name=${encodeURIComponent(name)}`,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Page already exists!");
      }
      return response.text();
    })
    .then(() => {
      getPageList();
    })
    .catch(() => {
      alert("Page already exists!");
    });
});
