import { Modal } from "../modal";
import "./style.css";

export default function EditorMeta({ isModalOpen, setModalOpen }) {
  return (
    <>
      <Modal
        open={isModalOpen}
        title="Meta"
        onClose={() => setModalOpen(false)}
        onConfirm={() => setModalOpen(false)}
      >
        <p>Current meta tags:</p>
      </Modal>
    </>
  );
}
