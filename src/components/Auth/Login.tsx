import { useMachine } from "@xstate/react";
import cx from "classnames";
import { LoginData, loginMachine } from "../../machines/auth/login";
import {
  useChangeHandler,
  useSubmitHandler,
  useValidationErrors,
} from "../../machines/form/hooks";

export function Login(props: {
  onRegister?: () => void;
  onResetPass?: () => void;
  onSuccess: () => void;
}) {
  const [snapshot, send, actorRef] = useMachine(loginMachine);
  const validationErrors = useValidationErrors<LoginData>(actorRef);

  const handleSubmit = useSubmitHandler(send);
  const handleChange = useChangeHandler(send);

  return (
    <div>
      <header>
        <button onClick={props.onResetPass}>Forgot password</button>
        <button onClick={props.onRegister}>Register</button>
      </header>

      <h2>Login</h2>

      {snapshot.matches("editing") && (
        <form name="login" onSubmit={handleSubmit}>
          <p className={cx({ error: validationErrors.email })}>
            <label>email</label>
            <input name="email" onChange={handleChange} />
            {validationErrors.email}
          </p>
          <p className={cx({ error: validationErrors.password })}>
            <label>password</label>
            <input name="password" type="password" onChange={handleChange} />
            {validationErrors.password}
          </p>
          <button type="submit">submit</button>
        </form>
      )}

      {snapshot.matches("submitting") && <p>Logging in...</p>}

      {snapshot.matches("success") && (
        <div>
          <p>Logged in!</p>
          <button onClick={props.onSuccess}>Proceed</button>
        </div>
      )}
    </div>
  );
}
