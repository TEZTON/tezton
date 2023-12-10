export const capitalizeFirstLetter = (str: string) => {
  const isAllUppercase = str === str.toUpperCase();

  return isAllUppercase
    ? str
    : str
        .toLowerCase()
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};