import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

/**
 * @typedef {Object} UseTokenFeatures
 * @property {function(string): void} setPenggunaToken
 * @property {function(): string | undefined} getPenggunaToken
 * @property {function(): void} removePenggunaToken
 */

/**
 * @returns {UseTokenFeatures}
 */
export const useToken = () => {
  const setPenggunaToken = (token) => {
    Cookies.set("Authorization", token);
  };
  const getPenggunaToken = () => {
    return Cookies.get("Authorization");
  };
  const removePenggunaToken = () => {
    Cookies.remove("Authorization");
  };
  const parseToken = () => {
    const token = getPenggunaToken();
    if (token === undefined) {
      return null;
    }
    const decodedToken = jwtDecode(token);
    return decodedToken;
  };

  return {
    setPenggunaToken,
    getPenggunaToken,
    removePenggunaToken,
    parseToken,
  };
};
