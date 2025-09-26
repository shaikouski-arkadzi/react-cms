import { useCallback } from "react";
import {
  clickHandler,
  blurHandler,
  keyPressHandler,
  contextMenuHandler,
} from "../helpers/textNodeHandlers";

export const useIframeTextEditor = (iframeRef, virtualDomRef) => {
  // Когда вносим изменения в грязную копию(которая отображается в iframe),
  // Находим такой же узел по nodeid в чистой(temp файл)
  // И дублирем туда изменения
  const onTextEdit = useCallback(
    (element) => {
      const id = element.getAttribute("nodeid");
      const target = virtualDomRef.current?.body?.querySelector(
        `[nodeid="${id}"]`
      );
      if (target) {
        target.innerHTML = element.innerHTML;
      }
    },
    [virtualDomRef]
  );

  const enableEditing = useCallback(() => {
    const iframeDoc = iframeRef?.current?.contentDocument;
    if (!iframeDoc) return;

    const textNodes = iframeDoc.body.querySelectorAll("text-editor");

    textNodes.forEach((element) => {
      const handleInput = () => onTextEdit(element);

      element.addEventListener("click", () =>
        clickHandler(element, handleInput)
      );
      element.addEventListener("blur", () => blurHandler(element, handleInput));
      element.addEventListener("keypress", (e) => keyPressHandler(e, element));
      element.addEventListener("contextmenu", (e) =>
        contextMenuHandler(e, element, handleInput)
      );
    });
  }, [iframeRef, onTextEdit]);

  return { enableEditing };
};
