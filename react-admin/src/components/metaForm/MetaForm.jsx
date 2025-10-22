import "./style.css";

export default function MetaForm({ meta, setMeta }) {
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

  return (
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
  );
}
