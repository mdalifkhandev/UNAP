export function getShortErrorMessage(
  error: any,
  fallback: string = 'Something went wrong'
) {
  let message = '';

  const data = error?.response?.data;
  if (data) {
    if (typeof data.error === 'string') {
      message = data.error;
    } else if (typeof data.message === 'string') {
      message = data.message;
    } else if (Array.isArray(data.errors) && data.errors.length > 0) {
      const first = data.errors[0];
      if (typeof first === 'string') message = first;
      else if (typeof first?.msg === 'string') message = first.msg;
      else if (typeof first?.message === 'string') message = first.message;
    }
  }

  if (!message && typeof error?.message === 'string') {
    message = error.message;
  }

  message = String(message || fallback)
    .replace(/^Error:\s*/i, '')
    .trim();

  if (message.includes('You must share at least one active UBlast')) {
    return 'Share an Active UBlast first (Trending > Active).';
  }

  if (!message || /request failed with status code/i.test(message)) {
    message = fallback;
  }

  const firstLine = message.split('\n')[0].trim();
  const maxLen = 80;
  if (firstLine.length <= maxLen) return firstLine || fallback;
  return `${firstLine.slice(0, maxLen - 3).trimEnd()}...`;
}
