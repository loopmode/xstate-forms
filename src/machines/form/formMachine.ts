import { Actor, assign, fromPromise, setup } from "xstate";

export type SendFunction = Actor<typeof formMachine>["send"];

export type InputEvent = {
  type: "INPUT";
  /** the name of the DOM input element */
  name: string;
  /** the value of the DOM input element */
  value: string;
};

export type SubmitEvent = {
  type: "SUBMIT";
  /** validation errors will be added to the event object via actions */
  validationErrors?: unknown;
};

export const formMachine = setup({
  types: {
    context: {} as {
      validationErrors: Record<string, unknown>;
      errorMessage: string;
      data: Record<string, unknown>;
    },
    events: {} as InputEvent | SubmitEvent | { type: "BACK" },
  },
  actions: {
    assignValidationErrors: () => console.warn("not implemented"),
    assignErrorMessage: assign(({ event }) => {
      // TODO how and where to find the error in event?
      console.log("!! TODO assignErrorMessage", event);

      return { errorMessage: "failed" };
    }),
    assignInput: assign(({ context, event }) => {
      const { name, value } = event as InputEvent;

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
    submit: fromPromise<unknown, { data: Record<string, unknown> }>(async () =>
      console.warn("not implemented")
    ),
  },
  guards: {
    isValid: () => {
      console.warn("not implemented");
      return true;
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOklwBcCoBiAZQFUAhAWQEkAVAbQAYBdRKAAOAe1iVcI-IJAAPRACYArEpLKePAIwAWABxKA7ADYl2zUoA0IAJ6IAzDpIBOBU4PaDSu9pdGjAX38rNCw8QlJyKnxaAHEAeQB9JgBBAGEAaV4BJBBRcSopGXkEZVV1LT1DEzNLG0RtHgUSI00nXR5tOx4nIwcOwOCMHAJiMggJaJo2ADkABQZufhk8iUKc4qceEjsFHh3Nbs0Fb08rWwQj1R4lDTs7T2uXYwGQEOHwkgA3dAAbXAh0FFaFllmJVtJ1ogjMcSN17h5NHcTG4zopoSRNK1dK1rkonPiPC83mFRt8-gCgTQuJpssIwQUIaBiqU1DcKvpjKZzKiSjCPCYDHCDApeuYiUMSaRYABXABGqEolIgUjAJAInxEAGtVcSRlK5QqKECEOqRJhAZJ8FkQTkVgyiogCSRDO0nJp2uUjDyjlsdDsFK5MUojMLdOLQnqSDL5YrqDQwAAnBMiBMkIQ-QEAMxTqBIuo+0cNxtN5oZ1qWtvplodCGhdlhTnhBkRdmRBh52JIPnxPWbO0FfnD71GMswmDgsBo8SSaUyFbp+WrkIuyicJAM2Pd2gafm83vdzU6AbdDXaRj2gSCIHwIggcBk+eIoMXayZiAAtJoee+AlfHxFxiBZ9wRrDweQDIxYT2TQjDcBoDkaBQh0lL5fn+C1omA+1l20IxtAxBRu10e5dG0YMnHA1sSF0WDiNw4NukbOxkMjQtY0wysX0ZOREF0BRNG2TZzzxZtoPbOoECcVQ8J2XC7EMEVnj-CVWOlMcJywpc3wuHRVAMbwDK8HROjsfc1z9Y8dB4M8L2UiMPllLBNU018eIuOxG2aXR3CUVxBWFPcJMuZ08U2LpkRgnpL38IA */
  id: "formMachine",
  context: {
    errorMessage: "",
    validationErrors: {},
    data: {},
  },
  initial: "editing",

  states: {
    editing: {
      on: {
        SUBMIT: {
          target: "validating",
        },
        BACK: {
          target: "back",
        },

        INPUT: {
          actions: {
            type: "assignInput",
          },
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
          target: "editing",
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
          target: "editing",
          actions: {
            type: "assignErrorMessage",
          },
        },
      },
    },
    success: {
      on: {
        BACK: {
          target: "back",
        },
      },
    },

    back: {
      type: "final",
    },
  },
});
