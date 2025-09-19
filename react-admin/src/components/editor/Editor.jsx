import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../helpers/iframeLoader.js";
import "./style.css";

export default function Editor() {
  const [pageList, setPageList] = useState([]);
  const [newPageName, setNewPageName] = useState("");
  const iframeRef = useRef(null);
  const virtualDomRef = useRef(null);

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

  const parseStringToDom = (string) => {
    const parser = new DOMParser();
    return parser.parseFromString(string, "text/html");
  };

  const wrapTextNode = (dom) => {
    const body = dom.body;
    let textNodes = [];

    // Рекурсивно находим текстовые узлы и игнорируем пусты ноды
    function recursy(element) {
      element.childNodes.forEach((node) => {
        if (
          node.nodeName === "#text" &&
          node.nodeValue.replace(/\s+/g, "").length > 0
        ) {
          textNodes.push(node);
        } else {
          recursy(node);
        }
      });
    }

    recursy(body);

    textNodes.forEach((node, i) => {
      // Создаем обертку вокруг ноды для редактирования текста
      // Обертка будет только в админке
      const wrapper = dom.createElement("text-editor");
      node.parentNode.replaceChild(wrapper, node);
      wrapper.appendChild(node);
      wrapper.setAttribute("nodeid", i);
    });

    return dom;
  };

  const unwrapTextNodes = (dom) => {
    dom.body.querySelectorAll("text-editor").forEach((element) => {
      element.parentNode.replaceChild(element.firstChild, element);
    });
  };

  const enableEditing = () => {
    if (iframeRef.current.contentDocument) {
      iframeRef.current.contentDocument.body
        .querySelectorAll("text-editor")
        .forEach((element) => {
          element.contentEditable = "true";
          element.addEventListener("input", () => {
            onTextEdit(element);
          });
        });
    }
  };

  function makePathsAbsolute(html, baseUrl = "http://localhost:3000/") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    doc.querySelectorAll("*").forEach((el) => {
      for (let attr of el.attributes) {
        const name = attr.name;
        const value = attr.value;

        if (
          (["src", "href", "action"].includes(name) || name.endsWith("src")) &&
          value
        ) {
          if (!/^(https?:)?\/\//.test(value)) {
            const newValue =
              baseUrl.replace(/\/$/, "") + "/" + value.replace(/^\/+/, "");
            el.setAttribute(name, newValue);
          }
        }
      }
    });

    return doc.documentElement.outerHTML;
  }

  // Когда вносим изменения в грязную копию(которая отображается в iframe),
  // Находим такой же узел по nodeid в чистой(temp файл)
  // И дублирем туда изменения
  const onTextEdit = (element) => {
    const id = element.getAttribute("nodeid");
    virtualDomRef.current.body.querySelector(`[nodeid="${id}"]`).innerHTML =
      element.innerHTML;
  };

  const serializeDOMToString = (dom) => {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(dom);
  };

  const saveChanges = () => {
    const newDom = virtualDomRef.current.cloneNode(virtualDomRef.current);
    unwrapTextNodes(newDom);
    const html = serializeDOMToString(newDom);
    axios.post("http://localhost:3000/pages/save", {
      pageName: currentPage,
      html,
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
      <button onClick={saveChanges}>Save</button>
      <iframe onLoad={() => enableEditing()} ref={iframeRef}></iframe>
    </>
  );
}
