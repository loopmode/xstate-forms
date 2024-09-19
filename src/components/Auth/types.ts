import { Actor } from "xstate";
import { auth } from "../../machines/auth/auth";

export type AuthViewProps = {
  send: Actor<typeof auth>["send"];
};
