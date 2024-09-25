import type { MachineContext } from "xstate";
import { assign, fromPromise } from "xstate";

import { Actor, setup } from "xstate";

export type FormMachine = ReturnType<typeof createFormMachine>;
export type FormMachineSend = Actor<FormMachine>["send"];

type InputEvent = {
  type: "INPUT";
  /** the name of the DOM input element */
  name: string;
  /** the value of the DOM input element */
  value: string;
};

type SubmitEvent<ValidationErrors> = {
  type: "SUBMIT";
  /** validation errors will be added to the event object via actions */
  validationErrors?: ValidationErrors;
};

export function createFormMachine<
  Data extends Record<string, string>,
  ResponseData = unknown,
  ValidationErrors extends { [key: string]: unknown } = Partial<
    Record<keyof Data, string | boolean | undefined>
  >
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
  const formMachine = setup({
    types: {
      context: {} as {
        validationErrors: ValidationErrors;
        errorMessage: string;
        data: Data;
      },
      events: {} as
        | InputEvent
        | SubmitEvent<ValidationErrors>
        | { type: "BACK" },
    },

    actions: {
      handleValidationErrors: assign({
        validationErrors: ({ context }) => validate(context.data),
      }),

      handleSubmitError: assign({
        errorMessage: ({ event }) => {
          // TODO study response errors and implement meaningful messages
          console.log("submit failed", event);
          return "submit failed";
        },
      }),

      handleInput: assign(({ context, event }) => {
        const { name, value } = event as InputEvent;

        return {
          data: {
            ...context.data,
            [name]: value,
          },
          // clear the validation error for a field as soon as the user starts typing
          validationErrors: {
            ...context.validationErrors,
            [name]: undefined,
          },
        };
      }),
    },

    actors: {
      submit: fromPromise<ResponseData, { data: Data }>(({ input }) =>
        submit(input.data)
      ),
    },

    guards: {
      isValid: ({ context }) => {
        const validationResult = validate(context.data);

        const hasError = Object.values(validationResult).some(Boolean);
        return !hasError;
      },
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOklwBcCoBiAZQFUAhAWQEkAVAbQAYBdRKAAOAe1iVcI-IJAAPRACYArAA4SCgIw8AnABYtAZgDsPAxoUA2ADQgAnot26SK0zxUHjunkqUWDAX38bNCw8QlJyKnxaJgBBAGEAaV4BJBBRcSopGXkEAFoNbRIlA21vFW0LBUqVI10bewQNJR51Mo8NDXcjC19A4IwcAmIyCAlomjYAOQAFBm5+GQyJbLTcvO0NZxUFFXMlBsQDBVaSut0LHh4qjTN+kBCh8JIAN3QAG1wIdCjaFKWxCtpGtEEpdiRLtoDLU6pVdMdDghlE5dhYvDCLFUjNoVPdHmERm9Pt9fjQuBpUsJAVlgaBcro9M59gozJjNlVEccFCQjLULns6tifEo8YMCaRYABXABGqEopIgUjAJAILxEAGtlfjhhKZXKKL8EKqRJgfpJ8Cl-mlljScogVBVnHoqpcTDs9Ijbk5tEoTFcLEYjNVjrigg8xTqSFLZfLqDQwAAnBMiBMkITvH4AMxTqBI2ue0f1huNppplsW1up5rtCCU2iMJB4LN0LQUDLRCLsiE63JZPBbaJOVTKoYGoUjUswmDgsBocSSVqpmWrIKa3gsJF0DpDbJ4Gl0CkRdRIlTqtzbFihlW0gTD+BEEDgMnzxABy9WdMQeU03O01SUW4mNC8J-oieRbhCShaEGLj7ABPqiuOzyRNQb5AjWFhbPu1wKJYPTXC4Bj1F2SKOM4pidJ0Jg4hoFiIU8hIfF8ZrRGhtqrl4BiNoUJSFGYBh7tYJFtk4hGURo1F7FU9HilGeqxqxlbvrSciID0RTuHWYIslBtxCY0uFqCUg4ES2tRETJE6SlOM5sSun5rj4xSYvCyg9GCUGeh4m6+NoPq0dCLiWJZzzSlg6p2R+qn5LR3r-oBpgqCBh4kdCzhbn+RiFHyLbeLe-hAA */
    id,
    context: {
      errorMessage: "",
      validationErrors: {} as ValidationErrors,
      data: {} as Data,
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
            // no target, just assign context
            actions: "handleInput",
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
            actions: "handleValidationErrors",
            target: "editing",
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
            actions: "handleSubmitError",
            target: "editing",
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
  return formMachine;
}
