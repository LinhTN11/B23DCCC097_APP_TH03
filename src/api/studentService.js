import { request } from './client';

export const studentService = {
  getAll: () => request('GET', '/students'),
  getById: (id) => request('GET', `/students/${id}`),
  update: (id, data) => request('PATCH', `/students/${id}`, data),
  create: (data) => request('POST', '/students', data),
};

export default studentService;
