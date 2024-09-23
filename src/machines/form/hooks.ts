import { useCallback } from "react";

import { useSelector } from "@xstate/react";
import { AnyActorRef } from "xstate";
import { FormMachineSend } from "./createFormMachine";
import { createChangeHandler, createSubmitHandler } from "./utils";

export function useSubmitHandler(send: FormMachineSend) {
  return useCallback(createSubmitHandler(send), [send]);
}

export function useChangeHandler(send: FormMachineSend) {
  return useCallback(createChangeHandler(send), [send]);
}

export function useValidationErrors<Data>(actor: AnyActorRef) {
  const validationErrors = useSelector(actor, ({ context }) => {
    return context.validationErrors;
  });
  return validationErrors as Record<keyof Data, string | boolean | undefined>;
}
