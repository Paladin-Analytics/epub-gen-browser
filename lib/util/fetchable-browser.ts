/// <reference lib="DOM" />
export const type = 'blob';

const fetchable = async (url: string, timeout: number) => {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : {} as AbortController;
  const out = setTimeout(() => controller.abort && controller.abort(), timeout);
  
  //appending a query parameter to the image url to avoid the CORS error caused due to the browser cache issue
  url = url+ "?export=epub";

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok)
      throw new Error(`Got error ${res.status} (${res.statusText}) while fetching ${url}`);
    return res.blob();
  } finally {
    clearTimeout(out);
  }
};
export default fetchable;