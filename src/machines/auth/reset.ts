import { apiClient } from "../../utils/apiClient";
import { validateEmail } from "../../utils/validate";
import { createFormMachine } from "../createFormMachine";

type ResetData = {
  email: string;
  password: string;
};

export const reset = createFormMachine<ResetData>({
  id: "reset",
  submit: function submitLogin(data) {
    return apiClient.post("/user/reset", data);
  },
  validate: function validateLogin(data) {
    const email = validateEmail(data.email);

    return { email };
  },
});
