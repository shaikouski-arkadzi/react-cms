import { useEffect, useRef } from "react";
import axios from "axios";
import { Tools } from "../tools";
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
import {
  BACKEND_URI,
  EDITOR_STYLES,
  STARTED_PAGE,
} from "../../constants/siteStylesInIframe.js";
import "./style.css";

export default function Editor() {
  const iframeRef = useRef(null);
  const virtualDomRef = useRef(null);

  const { enableEditing } = useIframeTextEditor(iframeRef, virtualDomRef);
  const { enableEditingImg } = useIframeImageEditor(iframeRef, virtualDomRef);

  const currentPage = STARTED_PAGE;

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
    const res = await axios.get(`${BACKEND_URI}/${page}`);
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
      style.innerHTML = EDITOR_STYLES;
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
      <Tools currentPage={currentPage} virtualDomRef={virtualDomRef} />
      <iframe onLoad={iframeLoad} ref={iframeRef}></iframe>
    </>
  );
}
