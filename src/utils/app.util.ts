export function isNonDevEnvironment(currentEnv: string) {
  return !['DEV', 'DEVELOPMENT', 'dev', 'development'].includes(currentEnv);
}
