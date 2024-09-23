import { apiClient } from "../../utils/apiClient";
import {
  validateEmail,
  validateFirstName,
  validateLastName,
  validateRequiredString,
} from "../../utils/validation";
import { createFormMachine } from "../form/createFormMachine";

export type RegisterData = {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
};

export const registerMachine = createFormMachine<RegisterData>({
  id: "register",
  submit: (data) => {
    return apiClient.post("/user/create", data);
  },
  validate: (data) => {
    return {
      email: validateEmail(data.email),
      firstName: validateFirstName(data.firstName),
      lastName: validateLastName(data.lastName),
      gender: validateRequiredString(data.gender),
    };
  },
});
