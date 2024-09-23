import { ChangeEvent, FormEvent } from "react";

import { FormMachineSend } from "./createFormMachine";

export function createSubmitHandler(send: FormMachineSend) {
  return (event: FormEvent) => {
    event.preventDefault();
    send({ type: "SUBMIT" });
  };
}

export function createChangeHandler(send: FormMachineSend) {
  return (event: ChangeEvent<HTMLInputElement>) => {
    send({
      type: "INPUT",
      name: event.currentTarget.name,
      value: event.currentTarget.value,
    });
  };
}
