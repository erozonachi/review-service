export const isValidRating = (value?: number | null): boolean => {
  if (value === null || value === undefined) {
    return false;
  }

  return Number.isSafeInteger(value) && value >= 1 && value <= 5;
};

export const validateRating = {
  message: '{VALUE} is not a valid rating in range 1 to 5',
  validator: isValidRating,
};
