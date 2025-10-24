import { useState } from "react";
import { ManagePanel } from "../managePanel";
import { Overlay } from "../overlay";
import { EditorMeta } from "../editorMeta";
import "./style.css";

export default function Tools({ virtualDomRef, currentPage }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

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
    </>
  );
}
