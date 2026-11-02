import { BASE_URL, TIMEOUT } from '../config';

function buildUrl(url) {
  if (/^https?:\/\//.test(url)) {
    return url;
  }
  return `${BASE_URL}${url}`;
}

function normalizeHttpError(status) {
  return {
    type: 'http',
    status,
    message: `Máy chủ trả về lỗi HTTP ${status}. Vui lòng thử lại.`,
  };
}

export async function request(method, url, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const options = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    };

    if (body !== undefined && body !== null) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(buildUrl(url), options);

    if (!response.ok) {
      throw normalizeHttpError(response.status);
    }

    if (response.status === 204) {
      return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    if (error && error.type) {
      throw error;
    }
    if (error && error.name === 'AbortError') {
      throw {
        type: 'timeout',
        status: 0,
        message: 'Máy chủ phản hồi quá lâu. Vui lòng kiểm tra kết nối và thử lại.',
      };
    }
    throw {
      type: 'network',
      status: 0,
      message:
        'Không kết nối được tới máy chủ. Kiểm tra json-server và kết nối mạng.',
    };
  } finally {
    clearTimeout(timer);
  }
}
