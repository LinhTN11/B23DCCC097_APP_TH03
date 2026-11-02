import { request } from './client';

export const assignmentService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams({
      _expand: 'course',
      _sort: 'dueDate',
      ...params,
    });
    return request('GET', `/assignments?${query.toString()}`);
  },
  getById: (id) => request('GET', `/assignments/${id}?_expand=course`),
  update: (id, data) => request('PATCH', `/assignments/${id}`, data),
  create: (data) => request('POST', '/assignments', data),
};

export default assignmentService;
