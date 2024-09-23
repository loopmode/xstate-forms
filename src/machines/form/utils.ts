import { ChangeEvent, FormEvent } from "react";

import { SendFunction } from "./formMachine";

export function createSubmitHandler(send: SendFunction) {
  return (event: FormEvent) => {
    event.preventDefault();
    send({ type: "SUBMIT" });
  };
}

export function createChangeHandler(send: SendFunction) {
  return (event: ChangeEvent<HTMLInputElement>) => {
    send({
      type: "INPUT",
      name: event.currentTarget.name,
      value: event.currentTarget.value,
    });
  };
}
