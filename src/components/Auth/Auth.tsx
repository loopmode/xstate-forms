import { useMachine } from "@xstate/react";
import { Login } from "./Login";
import { auth } from "../../machines/auth/auth";
import { Reset } from "./Reset";
import { Register } from "./Register";

export function Auth() {
  const [snapshot, send] = useMachine(auth);
  return (
    <div>
      <h1>Auth</h1>
      {snapshot.matches("login") && <Login send={send} />}
      {snapshot.matches("reset") && <Reset send={send} />}
      {snapshot.matches("register") && <Register send={send} />}
    </div>
  );
}
