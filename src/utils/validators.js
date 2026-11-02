import { parseDate } from './date';

export function validateAssignment({ title, dueDate }) {
  const errors = {};
  const trimmedTitle = String(title || '').trim();

  if (!trimmedTitle) {
    errors.title = 'Vui lòng nhập tiêu đề bài tập';
  } else if (trimmedTitle.length > 120) {
    errors.title = 'Tiêu đề tối đa 120 ký tự';
  }

  const parsedDueDate = parseDate(dueDate);
  if (!parsedDueDate) {
    errors.dueDate = 'Hạn nộp không hợp lệ (YYYY-MM-DDTHH:mm)';
  } else if (parsedDueDate.getTime() < Date.now()) {
    errors.dueDate = 'Hạn nộp không được ở quá khứ';
  }

  return errors;
}

export function validateProfile({ fullName, email, phone }) {
  const errors = {};
  const trimmedName = String(fullName || '').trim();
  const trimmedEmail = String(email || '').trim();
  const trimmedPhone = String(phone || '').trim();

  if (!trimmedName) {
    errors.fullName = 'Họ tên không được để trống';
  }

  if (!trimmedEmail) {
    errors.email = 'Email không được để trống';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!trimmedPhone) {
    errors.phone = 'Số điện thoại không được để trống';
  } else if (!/^0\d{9,10}$/.test(trimmedPhone)) {
    errors.phone = 'Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số';
  }

  return errors;
}
