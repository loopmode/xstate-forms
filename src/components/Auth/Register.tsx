import { FormEvent, useCallback } from "react";
import { AuthViewProps } from "./types";

export function Register(props: AuthViewProps) {
  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
  }, []);
  return (
    <div>
      <header>
        <button onClick={() => props.send({ type: "GO_BACK" })}>
          &laquo; back
        </button>
      </header>

      <form onSubmit={handleSubmit}>
        <h3>Register</h3>
        <p>
          <label>email</label>
          <input name="email" />
        </p>
        <p>
          <label>password</label>
          <input name="password" type="password" />
        </p>
        <p>
          <label>firstName</label>
          <input name="firstName" />
        </p>
        <p>
          <label>lastName</label>
          <input name="lastName" />
        </p>
        <p>
          <label>gender</label>
          <span>
            <label>
              male <input name="gender" type="radio" value="male" />
            </label>
            <label>
              female <input name="gender" type="radio" value="female" />
            </label>
            <label>
              other <input name="gender" type="radio" value="other" />
            </label>
          </span>
        </p>
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
