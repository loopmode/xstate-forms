// These functions return undefined if the tested value is valid, a boolean or string if it's invalid

export function validateEmail(email: string) {
  if (!email) {
    return "required field";
  }
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) {
    return "invalid email";
  }
}

export function validateRequiredString(value: string, minLength = 1) {
  if (!value) {
    return "required field";
  }

  if (value.trim().length < minLength) {
    return `too short (min: ${minLength} characters)`;
  }
}

export function validatePassword(value: string) {
  return validateRequiredString(value, 3);
}

export function validateFirstName(value: string) {
  return validateRequiredString(value, 3);
}

export function validateLastName(value: string) {
  return validateRequiredString(value, 3);
}
