export const EDITOR_STYLES = `
  text-editor:hover {
    outline: 3px solid orange;
    outline-offset: 8px;
  }
  text-editor[contenteditable="true"]:focus {
    outline: 3px solid red;
    outline-offset: 8px;
  }
  [editableimgid]:hover {
    cursor: pointer;
    outline: 3px solid orange;
    outline-offset: 8px;
  }
`;

export const BACKEND_URI = "http://localhost:3000";

export const STARTED_PAGE = "index.html";
