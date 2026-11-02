import { request } from './client';

export function getAnnouncements() {
  return request('GET', '/announcements');
}

export function getExams() {
  return request('GET', '/exams');
}

export function getTrainingScores() {
  return request('GET', '/trainingScores');
}

export function getTuitions() {
  return request('GET', '/tuitions');
}

export function getSurveys() {
  return request('GET', '/surveys');
}

export function submitSurvey(id, data = {}) {
  return request('PATCH', `/surveys/${id}`, {
    status: 'completed',
    ...data,
  });
}

export function getServiceRequests() {
  return request('GET', '/serviceRequests');
}

export function createServiceRequest(data) {
  return request('POST', '/serviceRequests', data);
}

export async function getPortalBundle() {
  const safeFetch = async (fn, fallback = []) => {
    try {
      const res = await fn();
      return Array.isArray(res) ? res : fallback;
    } catch (error) {
      return fallback;
    }
  };

  const [
    announcements,
    exams,
    trainingScores,
    tuitions,
    surveys,
    serviceRequests,
  ] = await Promise.all([
    safeFetch(getAnnouncements),
    safeFetch(getExams),
    safeFetch(getTrainingScores),
    safeFetch(getTuitions),
    safeFetch(getSurveys),
    safeFetch(getServiceRequests),
  ]);

  return {
    announcements,
    exams,
    trainingScores,
    tuitions,
    surveys,
    serviceRequests,
  };
}

export const portalService = {
  getAnnouncements,
  getExams,
  getTrainingScores,
  getTuitions,
  getSurveys,
  submitSurvey,
  getServiceRequests,
  createServiceRequest,
  getPortalBundle,
};

export default portalService;
