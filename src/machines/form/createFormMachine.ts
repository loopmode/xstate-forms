import type { MachineContext } from "xstate";
import { assign, fromPromise } from "xstate";
import { formMachine } from "./formMachine";

export function createFormMachine<
  Data extends Record<string, unknown>,
  ResponseData = unknown,
  ValidationErrors extends Record<string, unknown> = Record<
    keyof Data,
    unknown
  >,
  Context extends MachineContext | undefined = {
    validationErrors: ValidationErrors;
    errorMessage: string;
    data: Data;
  }
>({
  id,
  submit = () => Promise.resolve({} as ResponseData),
  validate = () => ({} as ValidationErrors),
}: {
  id?: string;
  submit?: (data: Data) => Promise<ResponseData>;

  /**
   * Takes a data object and returns an object with validation errors.
   * The returned object should have a property for each field that has an error.
   * The error value can be a boolean, or when different kinds of error might occur for the same field, a string.
   * @param data
   * @returns
   */
  validate?: (data: Data) => ValidationErrors;
}) {
  return formMachine.provide({
    actions: {
      assignValidationErrors: assign({
        validationErrors: ({ context }) => validate(context.data as Data),
      }),
      assignErrorMessage: assign(({ event }) => {
        // TODO how and where to find the error in event?
        console.log("!! assignErrorMessage", event);

        return { errorMessage: "failed" };
      }),
      assignInput: assign(({ context, event }) => {
        const { name, value } = event as { name: string; value: string };

        return {
          data: {
            ...context.data,
            [name]: value,
          },
        };
      }),
      clearErrors: assign({ errorMessage: "", validationErrors: {} }),
    },
    actors: {
      submit: fromPromise(({ input }) => submit(input.data as Data)),
    },
    guards: {
      isValid: ({ context }) => {
        const hasError = Object.values(validate(context.data as Data)).some(
          Boolean
        );
        return !hasError;
      },
    },
  });
}
