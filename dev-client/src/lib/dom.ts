export function hideKeyboard(): void {
  if (document.activeElement instanceof HTMLInputElement) {
    document.activeElement.blur();
  }
}
