import type { MachineContext } from "xstate";
import { assign, fromPromise, setup } from "xstate";

export function createFormMachine<
  Data extends object,
  ResponseData = unknown,
  ValidationErrors extends object = Partial<
    Record<keyof Data, boolean | string>
  >,
  Context extends MachineContext | undefined = {
    validationErrors: ValidationErrors;
    errorMessage: string;
    data: Data;
  }
>({
  id,
  submit = () => Promise.resolve({} as ResponseData),
  validate = (values) => {
    console.log("validation not implemented", { values });
    return {} as ValidationErrors;
  },
}: {
  id?: string;
  submit?: (data: Data) => Promise<ResponseData>;

  /**
   * Takes a data object and returns an object with validation errors.
   * The returned object may be empty when data was valid or have flags for invalid fields.
   * @param data
   * @returns
   */
  validate?: (data: Data) => ValidationErrors;
}) {
  const machine = setup({
    types: {
      context: {} as Context,
      events: {} as
        | { type: "GO_BACK" }
        | {
            type: "SUBMIT";
            data: Data;
            /** validation errors are added to the event during the validation guard */
            validationErrors?: string[];
          },
    },
    actions: {
      assignValidationErrors: assign(({ event }) => ({
        validationErrors: validate(event as Data),
      })),
      assignErrorMessage: assign(({ event }) => {
        // TODO how and where to find the error in event?
        console.log("!! assignErrorMessage", event);
        return { errorMessage: "failed" };
      }),
      clearErrors: assign({ errorMessage: "", validationErrors: {} }),
    },
    actors: {
      submit: fromPromise<ResponseData, { data: Data }>(({ input: { data } }) =>
        submit(data)
      ),
    },
    guards: {
      isValid: ({ event }) => {
        const hasError = Object.values(validate(event as Data)).some(Boolean);
        return !hasError;
      },
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAZQFUAhAWQEkAVAbQAYBdRUAAcA9rFwAXXMPwCQAD0QBWAGwAOEgCYAzABZVO5coCc3bgHYAjBoA0IAJ6IAtBtXrVFi8p0WjJnUY0jAF8g2zQsPEJScipqAHEAeQB9RgBBAGEAaR5+JBARMUlpWQUERR0zEl9FLSNFK2UzRUUjWwcERx0KzTNlC3qzI1Vy4NCQcJwCYhIAN3QKcnRJfChqHNkCiSkZPNLm9Q1uLRbDE3MrNqcrSotVQ89jXW8LMxCwjEmo2fnF5dXOCy5ISiLbFXaIMwaDQkLTcEzKDRmbjXS4dCz+KrcYaDHxPDyvMYTSLTWAAVwARqgJH9qBBpGAyPgZsIANYMolTUhkynUghQBAEZmYJbbHLrPKbIo7UB7GqaQxw06mSw2eyICymEgasyDKEaYyqXxaN7jD7ErkUqniGlgABOtuEtpIggoSwAZo7UCQOV9uVa-gKmcJhVKxXwNiCpSVELplCRuC1vLC+o1FGZUZ1uCRvN46hodPqXFZFCafSTSZhMHBYPFkmksuLgYVttGyn0SIaNUYledVe184otVpblpCwMdIpVCExvhhBA4LIy0QI82wTL1XKPDotKplCoEbq+04anHuPr0S5GhOp4SzZyyJQwCvQdL5EpAiRLAENJ4ziqMzuWjxloOpGCBHhHNopZ3l8cwLBAIorM+Ubgm2QHuIEljGMqFxqmiRiVMYGjlMcLxwtuN7vBE95+rySESpGLaoTURifoo3AVL+OFHh0BYkGovSjmYBYIu4OjQdRvoVlWsDwAxq6vnsxgwocZj6D43Goi86hIqoHFcUcEmfNM5JYCyyFMeuCD3Fq6I7nuhiIt+GZdOoijngMQwjNOQRAA */
    id,
    context: {
      errorMessage: "",
      validationErrors: {},
      data: {},
    },
    initial: "idle",
    states: {
      idle: {
        entry: "clearErrors",

        on: {
          SUBMIT: {
            target: "validating",
          },
          GO_BACK: {
            target: "back",
          },
        },
      },
      validating: {
        always: [
          {
            guard: "isValid",
            target: "submitting",
          },
          {
            actions: "assignValidationErrors",
            target: "idle",
            reenter: true,
          },
        ],
      },
      submitting: {
        invoke: {
          src: "submit",
          input: ({ context }) => ({ data: context.data }),
          onDone: {
            target: "success",
          },
          onError: {
            target: "idle",
            actions: {
              type: "assignErrorMessage",
            },
          },
        },
      },
      success: {
        on: {
          GO_BACK: {
            target: "back",
          },
        },
      },

      back: {
        type: "final",
      },
    },
  });
  return machine;
}
