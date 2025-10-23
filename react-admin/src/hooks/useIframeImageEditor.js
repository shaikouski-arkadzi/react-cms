import { useCallback } from "react";
import { clickHandler } from "../helpers/imageNodeHandlers";

export const useIframeImageEditor = (iframeRef, virtualDomRef) => {
  const onImageEdit = useCallback(
    (element) => {
      const id = element.getAttribute("editableimgid");

      const target = virtualDomRef.current?.body?.querySelector(
        `[editableimgid="${id}"]`
      );

      if (target) {
        const imgPathMatch = element.src.match(/img\/.+$/);
        if (imgPathMatch) {
          target.src = imgPathMatch;
        }
      }
    },
    [virtualDomRef]
  );

  const enableEditingImg = useCallback(() => {
    const iframeDoc = iframeRef?.current?.contentDocument;
    if (!iframeDoc) return;

    const imgNodes = iframeDoc.body.querySelectorAll("[editableimgid]");

    imgNodes.forEach((element) => {
      const handleInput = () => onImageEdit(element);

      element.addEventListener("click", () =>
        clickHandler(element, handleInput)
      );
    });
  }, [iframeRef, onImageEdit]);

  return { enableEditingImg };
};
