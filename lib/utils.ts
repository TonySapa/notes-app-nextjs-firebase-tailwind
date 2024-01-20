export const fetcher = async (input: string | URL | Request, init: RequestInit | undefined) => {
  const response = await fetch(input, init);
  return await response.json();
};
