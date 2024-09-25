import { ChangeEvent, FormEvent, useCallback } from "react";

import { useSelector } from "@xstate/react";
import { AnyActorRef } from "xstate";
import { FormMachineSend } from "./formMachine.create";

export function useSubmitHandler(send: FormMachineSend) {
  return useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      send({ type: "SUBMIT" });
    },
    [send]
  );
}

export function useChangeHandler(send: FormMachineSend) {
  return useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      send({
        type: "INPUT",
        name: event.currentTarget.name,
        value: event.currentTarget.value,
      });
    },
    [send]
  );
}

//? the main purpose of this hook is to fix the "any" type of validationErrors and give us proper typing, especially intellisense
//? too bad that the types get lost here somehow, maybe xstate will improve or I will find out where I made a mistake
export function useValidationErrors<Data>(actor: AnyActorRef) {
  const validationErrors = useSelector(actor, ({ context }) => {
    return context.validationErrors;
  });
  return validationErrors as Record<keyof Data, string | boolean | undefined>;
}
