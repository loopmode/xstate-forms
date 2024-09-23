import { apiClient } from "../../utils/apiClient";
import { validateEmail } from "../../utils/validation";
import { createFormMachine } from "../form/createFormMachine";

export type ResetData = {
  email: string;
};

export const resetMachine = createFormMachine<ResetData>({
  id: "reset",
  submit: (data) => {
    return apiClient.post("/user/reset", data);
  },
  validate: (data) => {
    return {
      email: validateEmail(data.email),
    };
  },
});
