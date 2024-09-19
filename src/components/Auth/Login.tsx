import { FormEvent, useCallback } from "react";
import { AuthViewProps } from "./types";

export function Login({ send }: AuthViewProps) {
  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
  }, []);
  return (
    <div>
      <header>
        <button onClick={() => send({ type: "GO_RESET" })}>
          Forgot password
        </button>
        <button onClick={() => send({ type: "GO_REGISTER" })}>Register</button>
      </header>
      <form onSubmit={handleSubmit}>
        <h3>Login</h3>
        <p>
          <label htmlFor="email">email</label>
          <input id="email" name="email" />
        </p>
        <p>
          <label>password</label>
          <input name="password" type="password" />
        </p>
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
