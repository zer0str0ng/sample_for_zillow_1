import { compareSync, hashSync } from 'bcrypt';

export const comparePasswords = (plainText: string, hashed: string): boolean => {
  return compareSync(plainText, hashed);
};

export const hashPassword = (plainText: string): string => {
  return hashSync(plainText, 10);
};
