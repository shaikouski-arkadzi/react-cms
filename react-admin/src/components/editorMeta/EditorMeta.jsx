import { useEffect, useState } from "react";
import { Modal } from "../modal";
import {
  getDescriptionTag,
  getKeywordsTag,
  getTitleTag,
} from "../../helpers/dom-helper";
import { MetaForm } from "../metaForm";
import "./style.css";

export default function EditorMeta({ isModalOpen, setModalOpen, virtualDom }) {
  const [meta, setMeta] = useState({
    title: "",
    keywords: "",
    description: "",
  });

  const getMeta = (vDom) => {
    const title = getTitleTag(vDom);
    const keywords = getKeywordsTag(vDom);
    const description = getDescriptionTag(vDom);

    setMeta({
      title: title.innerHTML,
      keywords: keywords.getAttribute("content"),
      description: description.getAttribute("content"),
    });
  };

  useEffect(() => {
    virtualDom && getMeta(virtualDom);
  }, [virtualDom]);

  const applyMeta = () => {
    let title = getTitleTag(virtualDom);
    title.innerHTML = meta.title;

    let keywords = getKeywordsTag(virtualDom);
    keywords.setAttribute("content", meta.keywords);

    let description = getDescriptionTag(virtualDom);
    description.setAttribute("content", meta.description);
  };

  const handleConfirm = () => {
    applyMeta();
    setModalOpen(false);
  };

  return (
    <Modal
      open={isModalOpen}
      title="Meta tags editing"
      onClose={() => setModalOpen(false)}
      onConfirm={handleConfirm}
    >
      <MetaForm meta={meta} setMeta={setMeta} />
    </Modal>
  );
}
