import { useMachine, useSelector } from "@xstate/react";
import { Login } from "./Login";
import { authMachine } from "../../machines/auth/auth";
import { Reset } from "./Reset";
import { Register } from "./Register";
import { FormEvent, useCallback } from "react";

export function Auth() {
  const [snapshot, send] = useMachine(authMachine);

  const goLogin = useCallback(() => send({ type: "LOGIN" }), [send]);
  const goRegister = useCallback(() => send({ type: "REGISTER" }), [send]);
  const goResetPass = useCallback(() => send({ type: "RESET" }), [send]);
  const handleSuccess = useCallback(() => send({ type: "SUCCESS" }), [send]);

  return (
    <div>
      <h1>Auth</h1>
      {snapshot.matches("login") && (
        <Login
          onResetPass={goResetPass}
          onRegister={goRegister}
          onSuccess={handleSuccess}
        />
      )}
      {snapshot.matches("reset") && (
        <Reset onBack={goLogin} onSuccess={goLogin} />
      )}
      {snapshot.matches("register") && (
        <Register onBack={goLogin} onSuccess={goLogin} />
      )}
      {snapshot.matches("loggedIn") && <div>Logged in</div>}
    </div>
  );
}
