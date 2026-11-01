export const createOTP = () => {
  return Math.floor(Math.random() * 90000 + 100000);
};
