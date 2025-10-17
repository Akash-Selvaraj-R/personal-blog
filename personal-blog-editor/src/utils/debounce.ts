export function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let timeout: number | undefined;
  return (...args: Parameters<T>) => {
    if (timeout) window.clearTimeout(timeout);
    timeout = window.setTimeout(() => fn(...args), wait);
  };
}
