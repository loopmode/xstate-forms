import { useMachine } from "@xstate/react";
import { RegisterData, registerMachine } from "../../machines/auth/register";
import {
  useChangeHandler,
  useSubmitHandler,
  useValidationErrors,
} from "../../machines/form/hooks";
import cx from "classnames";

export function Register(props: { onBack: () => void; onSuccess: () => void }) {
  const [snapshot, send, actorRef] = useMachine(registerMachine);

  const validationErrors = useValidationErrors<RegisterData>(actorRef);

  const handleSubmit = useSubmitHandler(send);
  const handleChange = useChangeHandler(send);

  return (
    <div>
      <header>
        <button onClick={props.onBack}>&laquo; back</button>
      </header>

      <h2>Register</h2>

      {snapshot.matches("editing") && (
        <form name="register" onSubmit={handleSubmit}>
          <p className={cx({ error: validationErrors.email })}>
            <label>email</label>
            <input name="email" onChange={handleChange} />
            {validationErrors.email}
          </p>
          <p className={cx({ error: validationErrors.firstName })}>
            <label>firstName</label>
            <input name="firstName" onChange={handleChange} />
            {validationErrors.firstName}
          </p>
          <p className={cx({ error: validationErrors.lastName })}>
            <label>lastName</label>
            <input name="lastName" onChange={handleChange} />
            {validationErrors.lastName}
          </p>
          <p className={cx({ error: validationErrors.gender })}>
            <label>gender</label>
            <span>
              <label>
                male{" "}
                <input
                  name="gender"
                  type="radio"
                  value="male"
                  onChange={handleChange}
                />
              </label>
              <label>
                female{" "}
                <input
                  name="gender"
                  type="radio"
                  value="female"
                  onChange={handleChange}
                />
              </label>
              <label>
                other{" "}
                <input
                  name="gender"
                  type="radio"
                  value="other"
                  onChange={handleChange}
                />
              </label>
            </span>
            <br />
            {validationErrors.gender}
          </p>
          <button type="submit">submit</button>
        </form>
      )}

      {snapshot.matches("submitting") && <p>Creating account...</p>}

      {snapshot.matches("success") && (
        <div>
          <p>Account created!</p>
          <button onClick={props.onSuccess}>Proceed</button>
        </div>
      )}
    </div>
  );
}
