import { useToken } from "./useToken";

const useFetchWithToken = () => {
  const { getPenggunaToken } = useToken();

  const fetchWithToken = async (
    url,
    method = "GET",
    body = null,
    options = {}
  ) => {
    const token = getPenggunaToken();
    const headers = new Headers(
      (options as { headers?: HeadersInit }).headers || {}
    );
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }

    if (body) {
      headers.append("Content-Type", "application/json");
      body = JSON.stringify(body);
    }

    const newOptions = { ...options, headers, method, body };

    url = `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    const response = await fetch(url, newOptions);

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response;
  };

  return fetchWithToken;
};

export default useFetchWithToken;
