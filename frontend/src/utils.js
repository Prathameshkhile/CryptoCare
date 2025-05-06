export const getImageurl = (path) => {
  return new URL(`/lending-dapp/assets/${path}`, import.meta.url).href;
};
