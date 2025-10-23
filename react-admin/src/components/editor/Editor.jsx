import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ManagePanel } from "../managePanel";
import { Overlay } from "../overlay";
import { EditorMeta } from "../editorMeta";
import { useIframeTextEditor } from "../../hooks/useIframeTextEditor.js";
import { useIframeImageEditor } from "../../hooks/useIframeImageEditor.js";
import "../../helpers/iframeLoader.js";
import {
  makePathsAbsolute,
  parseStringToDom,
  serializeDOMToString,
  wrapImages,
  wrapTextNode,
} from "../../helpers/dom-helper.js";
import "./style.css";

export default function Editor() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const iframeRef = useRef(null);
  const virtualDomRef = useRef(null);

  const { enableEditing } = useIframeTextEditor(iframeRef, virtualDomRef);
  const { enableEditingImg } = useIframeImageEditor(iframeRef, virtualDomRef);

  const currentPage = "index.html";

  useEffect(() => {
    open(currentPage);
  }, []);

  /**
   * Создаем 2 страницы
   * Первая нужная для редактирования(чистый html без влияния скриптов)
   * Редактируем страницу исходную, до загрузки в iFrame
   * Вторую страницу подаем в iFrame для открытия
   * Изменяя что-то в iFrame, дублируем изменения в чистый (первый) html
   */
  const open = async (page) => {
    const res = await axios.get(`http://localhost:3000/${page}`);
    const domWrappingText = wrapTextNode(parseStringToDom(res.data));
    const domWrappingImg = wrapImages(domWrappingText);
    const dom = domWrappingImg;
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
        [editableimgid]:hover {
          cursor: pointer;
          outline: 3px solid orange;
          outline-offset: 8px;
        }
      `;
      iframeRef.current.contentDocument.head.appendChild(style);
    }
  };

  const iframeLoad = () => {
    enableEditing();
    enableEditingImg();
    injectStyles();
  };

  return (
    <>
      <Overlay open={sidebarOpen} setOpen={setSidebarOpen} redirect={open} />
      <ManagePanel
        virtualDomRef={virtualDomRef}
        currentPage={currentPage}
        setOpen={setSidebarOpen}
        setModalOpen={setModalOpen}
      />
      <EditorMeta
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        virtualDom={virtualDomRef.current}
      />
      <input id="img-upload" type="file" accept="image/*"></input>
      <iframe onLoad={iframeLoad} ref={iframeRef}></iframe>
    </>
  );
}
