import "./style.css";

export default function Overlay({ open, setOpen, list }) {
  return (
    <aside className={`sidebar ${open ? "show" : ""}`}>
      <header className="sidebar-header">
        <h2 id="sidebarTitle">Page List</h2>
        <button className="close-btn" onClick={() => setOpen(false)}>
          ✕
        </button>
      </header>

      <div className="sidebar-content">
        <ul>
          {list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
