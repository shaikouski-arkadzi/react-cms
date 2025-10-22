import { useEffect, useState } from "react";
import { Modal } from "../modal";
import {
  getDescriptionTag,
  getKeywordsTag,
  getTitleTag,
} from "../../helpers/dom-helper";
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

  const onValueChange = (e) => {
    const { value } = e.target;

    if (e.target.hasAttribute("data-title")) {
      setMeta((prev) => ({ ...prev, title: value }));
    } else if (e.target.hasAttribute("data-keywords")) {
      setMeta((prev) => ({ ...prev, keywords: value }));
    } else if (e.target.hasAttribute("data-description")) {
      setMeta((prev) => ({ ...prev, description: value }));
    }
  };

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
    <>
      <Modal
        open={isModalOpen}
        title="Meta tags editing"
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
      >
        <form className="meta-form">
          <input
            data-title
            type="text"
            placeholder="Title"
            value={meta.title}
            onChange={onValueChange}
          />
          <textarea
            data-keywords
            rows="5"
            placeholder="Keywords"
            value={meta.keywords}
            onChange={onValueChange}
          ></textarea>
          <textarea
            data-description
            rows="5"
            placeholder="Description"
            value={meta.description}
            onChange={onValueChange}
          ></textarea>
        </form>
      </Modal>
    </>
  );
}
