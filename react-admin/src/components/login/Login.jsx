import "./style.css";

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <label className="login-label">Login:</label>
        <input
          type="text"
          className="login-input"
          value={undefined}
          onChange={() => {}}
        />

        <label className="login-label">Password:</label>
        <input
          type="password"
          className="login-input"
          value={undefined}
          onChange={() => {}}
        />

        <button className="login-button" type="button" onClick={() => {}}>
          Enter
        </button>
      </div>
    </div>
  );
}
