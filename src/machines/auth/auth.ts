import { setup } from "xstate";
import { login } from "./login";
import { reset } from "./reset";
import { register } from "./register";

export const auth = setup({
  actors: {
    login,
    reset,
    register,
  },
  types: {
    events: {} as
      | { type: "SUBMIT" }
      | { type: "GO_BACK" }
      | { type: "GO_REGISTER" }
      | { type: "GO_RESET" },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgOgDYHsoBLAOwGIJ8SxtSA3fAaxrSz0NIXvwGNl0iVANoAGALqixiUAAd8sIgKrSQAD0QBmDdgBMADgCcIgGwB2ACx6ArBuPnjegDQgAnogCM7q9ne2HBuysgkQ0rAF8w51YcAmJyAHEAeQB9ACUAUXiASQBlABV01MkVOQUlEhV1BHd7bAM9EXNTET1zdwdTDWc3BA1zOq0rf09zDR0xiKiMGI4ElIyc9LzipBBSxUEK1aqAWlNjbDbzRuP7Yy1jK27NfoNByz13EysGnXNJkGjsACcwYlh0GBvhQqDRuMxsF9fv9Ad8uCQGHxypIVrJ5BtlNtEG9vBp6k0rM1bHpQjprgg9v09DoQjUSTpjPp3HoPlC-kQAUCyElkgAhACCAGEANKotbo8qVRDHUx1GpPPpWAwGGxXVyIHbGAzYQkhUIjPTWHSmVnTH5wMDoEHUWgIpgsM2-WCW+GI-ibFHiEoSzZSim+HQ+EReFpDHTK4NqnqU7DU2mWMaMx7GU1sJ2W7kpAUisXrSVYikM9zYMYNFXGERK-aV8ma7W6jQh+VPAwmj4kfAQOAqaLesq+gs7DQibWlkdDSutitRjU6Tw+SzmJqhPpajSpmZxPsYragKrubWmTqjUwz-3jbB2VrLmz2O4b80woHb-N7zQOXTmHRzhM2fRNcl51GUIrAZMwHAnddIk+R0LXQF8BzfQs8R8U9TzxGozC8Lp1WqYtgMJY0HHMJVDBTaCvkoagEMxJCNFlSNGSsNoni-UZjEA6wdWYrD7C0Sx3AiCIgA */
  id: "auth",
  initial: "login",
  states: {
    login: {
      invoke: {
        src: "login",
        onDone: {
          target: "done",
        },
      },
      on: {
        GO_REGISTER: { target: "register" },
        GO_RESET: { target: "reset" },
      },
    },
    register: {
      invoke: {
        src: "register",
        onDone: {
          target: "login",
        },
      },
      on: {
        GO_BACK: { target: "login" },
      },
    },
    reset: {
      invoke: {
        src: "reset",
        onDone: {
          target: "login",
        },
      },
      on: {
        GO_BACK: { target: "login" },
      },
    },
    done: {
      type: "final",
    },
  },
});
