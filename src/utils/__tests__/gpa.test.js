import { calcGpa, toLetter, toScale4 } from '../gpa';

describe('GPA utils', () => {
  describe('toScale4', () => {
    it('correctly converts 10-point scale to 4-point scale', () => {
      expect(toScale4(9.0)).toBe(4.0);
      expect(toScale4(8.5)).toBe(4.0);
      expect(toScale4(8.2)).toBe(3.5);
      expect(toScale4(7.5)).toBe(3.0);
      expect(toScale4(6.8)).toBe(2.5);
      expect(toScale4(6.0)).toBe(2.0);
      expect(toScale4(5.2)).toBe(1.5);
      expect(toScale4(4.5)).toBe(1.0);
      expect(toScale4(3.5)).toBe(0);
      expect(toScale4(0)).toBe(0);
    });
  });

  describe('toLetter', () => {
    it('correctly maps 10-point scale to letter grades', () => {
      expect(toLetter(9.5)).toBe('A');
      expect(toLetter(8.25)).toBe('B+');
      expect(toLetter(7.7)).toBe('B');
      expect(toLetter(6.6)).toBe('C+');
      expect(toLetter(5.8)).toBe('C');
      expect(toLetter(5.1)).toBe('D+');
      expect(toLetter(4.3)).toBe('D');
      expect(toLetter(3.9)).toBe('F');
    });
  });

  describe('calcGpa', () => {
    it('calculates weighted GPA and excludes F from accumulated credits', () => {
      const grades = [
        { courseId: 1, total: 8.5 }, // A (4.0) x 3 = 12.0
        { courseId: 2, total: 7.5 }, // B (3.0) x 3 = 9.0
        { courseId: 3, total: 3.5 }, // F (0) x 2 = 0
      ];
      const courses = [
        { id: 1, credits: 3 },
        { id: 2, credits: 3 },
        { id: 3, credits: 2 },
      ];

      const result = calcGpa(grades, courses);
      // weighted: (4.0*3 + 3.0*3 + 0*2) / 8 = 21 / 8 = 2.625 -> 2.63
      expect(result.gpa).toBe(2.63);
      // totalCredits excludes F: 3 + 3 = 6
      expect(result.totalCredits).toBe(6);
      expect(result.gpaCredits).toBe(8);
    });

    it('handles empty grades safely', () => {
      const result = calcGpa([], []);
      expect(result.gpa).toBe(0);
      expect(result.totalCredits).toBe(0);
      expect(result.gpaCredits).toBe(0);
    });
  });
});

