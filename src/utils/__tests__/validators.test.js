import { validateAssignment, validateProfile } from '../validators';

describe('validators', () => {
  describe('validateAssignment', () => {
    it('returns error when title is empty', () => {
      const future = new Date(Date.now() + 86400000).toISOString();
      const errors = validateAssignment({ title: '   ', dueDate: future });
      expect(errors.title).toBeDefined();
    });

    it('returns error when dueDate is in the past', () => {
      const past = new Date(Date.now() - 86400000).toISOString();
      const errors = validateAssignment({ title: 'Bài tập 1', dueDate: past });
      expect(errors.dueDate).toContain('quá khứ');
    });

    it('returns empty error object for valid assignment', () => {
      const future = new Date(Date.now() + 86400000).toISOString();
      const errors = validateAssignment({ title: 'Bài tập mới', dueDate: future });
      expect(Object.keys(errors).length).toBe(0);
    });
  });

  describe('validateProfile', () => {
    it('validates fullName, email, and phone', () => {
      const invalid = validateProfile({
        fullName: '',
        email: 'bad-email',
        phone: '123',
      });
      expect(invalid.fullName).toBeDefined();
      expect(invalid.email).toBeDefined();
      expect(invalid.phone).toBeDefined();

      const valid = validateProfile({
        fullName: 'Nguyễn Văn An',
        email: 'an.nv@student.edu.vn',
        phone: '0912345678',
      });
      expect(Object.keys(valid).length).toBe(0);
    });
  });
});

