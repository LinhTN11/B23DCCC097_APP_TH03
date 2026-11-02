import { request } from '../client';

global.fetch = jest.fn();

describe('api client', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('performs successful GET request and parses JSON', async () => {
    const mockData = { id: 1, name: 'Khóa học' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockData)),
    });

    const result = await request('GET', '/courses/1');
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/courses/1'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('normalizes HTTP errors', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: () => Promise.resolve('Not found'),
    });

    await expect(request('GET', '/courses/999')).rejects.toEqual(
      expect.objectContaining({
        type: 'http',
        status: 404,
      }),
    );
  });

  it('normalizes network errors', async () => {
    global.fetch.mockRejectedValueOnce(new TypeError('Network request failed'));

    await expect(request('GET', '/courses')).rejects.toEqual(
      expect.objectContaining({
        type: 'network',
        status: 0,
      }),
    );
  });
});

