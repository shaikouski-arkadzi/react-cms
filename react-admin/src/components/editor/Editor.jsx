import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useIframeTextEditor } from "../../hooks/useIframeTextEditor.js";
import "../../helpers/iframeLoader.js";
import {
  makePathsAbsolute,
  parseStringToDom,
  serializeDOMToString,
  wrapTextNode,
  unwrapTextNodes,
} from "../../helpers/dom-helper.js";
import "./style.css";
import { ManagePanel } from "../managePanel";

export default function Editor() {
  const [pageList, setPageList] = useState([]);
  const [newPageName, setNewPageName] = useState("");
  const iframeRef = useRef(null);
  const virtualDomRef = useRef(null);

  const { enableEditing } = useIframeTextEditor(iframeRef, virtualDomRef);

  const currentPage = "index.html";

  useEffect(() => {
    init(currentPage);
  }, []);

  const init = (page) => {
    open(page);
    loadPageList();
  };

  /**
   * Создаем 2 страницы
   * Первая нужная для редактирования(чистый html без влияния скриптов)
   * Редактируем страницу исходную, до загрузки в iFrame
   * Вторую страницу подаем в iFrame для открытия
   * Изменяя что-то в iFrame, дублируем изменения в чистый (первый) html
   */
  const open = async (page) => {
    const res = await axios.get(`http://localhost:3000/${page}`);
    const dom = wrapTextNode(parseStringToDom(res.data));
    virtualDomRef.current = dom;
    let html = serializeDOMToString(dom);
    // В html изменяем все пути чтоб читало с сервера бэка, а не с фронтового
    html = makePathsAbsolute(html);

    // подставляем прямо в iframe
    iframeRef.current.srcdoc = html;
  };

  const injectStyles = () => {
    if (iframeRef.current.contentDocument) {
      const style = iframeRef.current.contentDocument.createElement("style");
      style.innerHTML = `
        text-editor:hover {
          outline: 3px solid orange;
          outline-offset: 8px;
        }
        text-editor[contenteditable="true"]:focus {
          outline: 3px solid red;
          outline-offset: 8px;
        }
      `;
      iframeRef.current.contentDocument.head.appendChild(style);
    }
  };

  const iframeLoad = () => {
    enableEditing();
    injectStyles();
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
      <ManagePanel virtualDomRef={virtualDomRef} currentPage={currentPage} />
      <iframe onLoad={iframeLoad} ref={iframeRef}></iframe>
    </>
  );
}
