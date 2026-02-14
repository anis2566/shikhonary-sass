/**
 * Bangladesh-specific phone validation and formatting
 */

/**
 * Validates if a string is a valid BD mobile number
 * Pattern: 013-019, 11 digits
 */
export const isValidBDPhone = (phone: string) => {
  const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
  return bdPhoneRegex.test(phone.replace(/\s/g, ""));
};

/**
 * Formats a phone number to standard 11-digit string (01XXX-XXXXXX)
 */
export const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return digits;
  }
  if (digits.length === 13 && digits.startsWith("880")) {
    return digits.substring(2);
  }
  return phone;
};
