import { FormEvent, useCallback } from "react";
import { AuthViewProps } from "./types";

export function Reset(props: AuthViewProps) {
  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
  }, []);
  return (
    <div>
      <header>
        <button onClick={() => props.send({ type: "GO_BACK" })}>
          &laquo; Back
        </button>
      </header>

      <form onSubmit={handleSubmit}>
        <h3>Reset</h3>
        <p>
          <label>email</label>
          <input name="email" />
        </p>
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
