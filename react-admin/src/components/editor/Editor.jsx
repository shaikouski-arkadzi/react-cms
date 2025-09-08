import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../helpers/iframeLoader.js";
import "./style.css";

export default function Editor() {
  const [pageList, setPageList] = useState([]);
  const [newPageName, setNewPageName] = useState("");
  const iframeRef = useRef(null);

  const currentPage = "/site/index.html";

  useEffect(() => {
    init(currentPage);
  }, []);

  const init = (page) => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    open(page, iframe);
    loadPageList();
  };

  const open = (page, iframe) => {
    const pagePath = `../${page}`;

    iframe.load(pagePath, () => {
      console.log(pagePath);
    });
  };

  const loadPageList = () => {
    axios
      .get("http://localhost:3000/pages")
      .then((res) => setPageList(res.data))
      .catch(() => alert("Error geting pages!"));
  };

  const createNewPage = () => {
    axios
      .post("http://localhost:3000/pages/create", { name: newPageName })
      .then(() => loadPageList())
      .catch(() => alert("Page already exists!"));
  };

  const deletePage = (page) => {
    axios
      .post("http://localhost:3000/pages/delete", { name: page })
      .then(() => loadPageList())
      .catch(() => alert("Page not exists"));
  };

  return (
    <>
      {/* <input
        type="text"
        value={newPageName}
        onChange={(e) => setNewPageName(e.target.value)}
      />
      <button onClick={createNewPage}>Create page</button>

      {pageList.map((page, i) => (
        <h2 key={i}>
          {page}
          <a href="#" onClick={() => deletePage(page)}>
            (x)
          </a>
        </h2>
      ))} */}
      <iframe ref={iframeRef}></iframe>
    </>
  );
}
