import { setup } from "xstate";

export const authMachine = setup({
  types: {
    events: {} as
      | { type: "SUCCESS" }
      | { type: "LOGIN" }
      | { type: "REGISTER" }
      | { type: "RESET" },
  },
}).createMachine({
  id: "auth",
  initial: "login",

  states: {
    login: {
      on: {
        REGISTER: { target: "register" },
        RESET: { target: "reset" },
        SUCCESS: { target: "loggedIn" },
      },
    },
    register: {
      on: {
        LOGIN: { target: "login" },
        SUCCESS: { target: "login" },
      },
    },
    reset: {
      on: {
        LOGIN: { target: "login" },
        SUCCESS: { target: "login" },
      },
    },
    loggedIn: {
      type: "final",
    },
  },
});
