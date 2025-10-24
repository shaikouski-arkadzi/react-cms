import axios from "axios";
import {
  serializeDOMToString,
  unwrapImages,
  unwrapTextNodes,
} from "../../helpers/dom-helper";
import { BACKEND_URI } from "../../constants/siteStylesInIframe";
import "./style.css";

export default function ManagePanel({
  virtualDomRef,
  currentPage,
  setOpen,
  setModalOpen,
}) {
  const saveChanges = () => {
    const newDom = virtualDomRef.current.cloneNode(virtualDomRef.current);
    unwrapTextNodes(newDom);
    unwrapImages(newDom);

    const html = serializeDOMToString(newDom);

    axios.post(`${BACKEND_URI}/pages/save`, {
      pageName: currentPage,
      html,
    });
  };

  return (
    <div className="panel">
      <button className="blue-btn" onClick={setOpen}>
        Show Page List
      </button>
      <button className="blue-btn" onClick={saveChanges}>
        Save
      </button>
      <button className="blue-btn" onClick={() => setModalOpen(true)}>
        Change Meta
      </button>
    </div>
  );
}
