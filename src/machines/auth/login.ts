import { apiClient } from "../../utils/apiClient";
import { validateEmail } from "../../utils/validate";
import { createFormMachine } from "../createFormMachine";

type LoginData = {
  email: string;
  password: string;
};

export const login = createFormMachine<LoginData>({
  id: "login",
  submit: function submitLogin(data) {
    return apiClient.post("/user/login", data);
  },
  validate: function validateLogin(data) {
    const email = validateEmail(data.email);
    const password = data.password.trim().length > 3;

    return { email, password };
  },
});
