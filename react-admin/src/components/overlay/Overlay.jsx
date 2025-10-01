import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

export default function Overlay({ open, setOpen, redirect }) {
  const [pageList, setPageList] = useState([]);

  useEffect(() => {
    loadPageList();
  }, []);

  const loadPageList = async () => {
    try {
      const result = await axios.get("http://localhost:3000/pages");
      setPageList(result.data);
    } catch {
      alert("Error geting pages!");
    }
  };

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
          {pageList.map((item) => (
            <li
              onClick={() => {
                redirect(item);
                setOpen(false);
              }}
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
