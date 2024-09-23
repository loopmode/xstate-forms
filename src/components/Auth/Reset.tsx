import { useMachine } from "@xstate/react";
import { ResetData, resetMachine } from "../../machines/auth/reset";
import {
  useChangeHandler,
  useSubmitHandler,
  useValidationErrors,
} from "../../machines/form/hooks";

export function Reset(props: { onBack: () => void; onSuccess: () => void }) {
  const [snapshot, send, actorRef] = useMachine(resetMachine);

  const validationErrors = useValidationErrors<ResetData>(actorRef);

  const handleSubmit = useSubmitHandler(send);
  const handleChange = useChangeHandler(send);

  return (
    <div>
      <header>
        <button onClick={props.onBack}>&laquo; Back</button>
      </header>

      <h2>Reset</h2>

      {snapshot.matches("editing") && (
        <form onSubmit={handleSubmit}>
          <p>
            <label>email</label>
            <input name="email" onChange={handleChange} />
            <span>{validationErrors.email}</span>
          </p>
          <button type="submit">submit</button>
        </form>
      )}

      {snapshot.matches("submitting") && <p>Resetting password...</p>}

      {snapshot.matches("success") && (
        <div>
          <p>Password reset!</p>
          <p>
            You should have received an email with a link to set a new password
          </p>
          <button onClick={props.onSuccess}>Proceed</button>
        </div>
      )}
    </div>
  );
}
