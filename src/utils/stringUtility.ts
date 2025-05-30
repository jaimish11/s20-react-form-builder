/**
 * Makes the first letter of a string uppercase
 * @param str - The string to capitalize
 * @returns The capitalized string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
