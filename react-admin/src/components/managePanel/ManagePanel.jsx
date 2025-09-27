import axios from "axios";
import {
  serializeDOMToString,
  unwrapTextNodes,
} from "../../helpers/dom-helper";
import "./style.css";

export default function ManagePanel({ virtualDomRef, currentPage }) {
  const saveChanges = () => {
    const newDom = virtualDomRef.current.cloneNode(virtualDomRef.current);
    unwrapTextNodes(newDom);
    const html = serializeDOMToString(newDom);
    axios.post("http://localhost:3000/pages/save", {
      pageName: currentPage,
      html,
    });
  };

  return (
    <div className="panel">
      <button className="blue-btn" onClick={saveChanges}>
        Save
      </button>
    </div>
  );
}
