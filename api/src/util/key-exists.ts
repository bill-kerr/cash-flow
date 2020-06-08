export const keyExists = (obj: {}, key: string): boolean => {
  return Object.keys(obj).includes(key);
};