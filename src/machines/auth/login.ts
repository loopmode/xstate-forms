import { apiClient } from "../../utils/apiClient";
import { validateEmail, validatePassword } from "../../utils/validation";
import { createFormMachine } from "../form/formMachine.create";

export type LoginData = {
  email: string;
  password: string;
};

export const loginMachine = createFormMachine<LoginData>({
  id: "login",
  submit: (data) => {
    return apiClient.post("/user/login", data);
  },
  validate: (data) => {
    return {
      email: validateEmail(data.email),
      password: validatePassword(data.password),
    };
  },
});
