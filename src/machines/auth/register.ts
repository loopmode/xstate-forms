import { apiClient } from "../../utils/apiClient";
import { validateEmail } from "../../utils/validate";
import { createFormMachine } from "../createFormMachine";

type RegisterData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
};

export const register = createFormMachine<RegisterData>({
  id: "register",
  submit: function submitRegister(data) {
    return apiClient.post("/user/create", data);
  },
  validate: function validateLogin(data) {
    const email = validateEmail(data.email);
    const password = data.password.trim().length > 3;
    const firstName = data.firstName.trim().length > 3;
    const lastName = data.lastName.trim().length > 3;
    const gender = !!data.gender;

    return { email, password, firstName, lastName, gender };
  },
});
