/* eslint-disable no-console */

export function logError(err: unknown): void {
  if (err instanceof Error) {
    console.log(err.name + ': ' + err.message + '\n' + err.stack);
  } else {
    console.log('Error: ' + JSON.stringify(err));
  }
}
