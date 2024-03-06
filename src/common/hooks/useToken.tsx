import Cookies from "js-cookie";

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
    Cookies.set("pengguna_token", token);
  };
  const getPenggunaToken = () => {
    return Cookies.get("pengguna_token");
  };  
  const removePenggunaToken = () => {
    Cookies.remove("pengguna_token");
  };

  return { setPenggunaToken, getPenggunaToken, removePenggunaToken };
};
