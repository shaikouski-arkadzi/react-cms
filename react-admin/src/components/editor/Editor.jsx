import { useState, useEffect } from "react";
import axios from "axios";

export default function Editor() {
  const [pageList, setPageList] = useState([]);
  const [newPageName, setNewPageName] = useState("");

  const loadPageList = () => {
    axios
      .get("http://localhost:3000/pages")
      .then((res) => setPageList(res.data))
      .catch(() => alert("Error geting pages!"));
  };

  const createNewPage = () => {
    console.log();

    axios
      .post("http://localhost:3000/createPage", { name: newPageName })
      .then(() => loadPageList())
      .catch(() => alert("Page already exists!"));
  };

  useEffect(() => {
    loadPageList();
  }, []);

  return (
    <>
      <input
        type="text"
        value={newPageName}
        onChange={(e) => setNewPageName(e.target.value)}
      />
      <button onClick={createNewPage}>Create page</button>

      {pageList.map((page, i) => (
        <h2 key={i}>{page}</h2>
      ))}
    </>
  );
}
