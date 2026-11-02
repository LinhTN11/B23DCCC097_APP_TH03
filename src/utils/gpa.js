const SCALE_TABLE = [
  { min: 8.5, scale4: 4.0, letter: 'A' },
  { min: 8.0, scale4: 3.5, letter: 'B+' },
  { min: 7.0, scale4: 3.0, letter: 'B' },
  { min: 6.5, scale4: 2.5, letter: 'C+' },
  { min: 5.5, scale4: 2.0, letter: 'C' },
  { min: 5.0, scale4: 1.5, letter: 'D+' },
  { min: 4.0, scale4: 1.0, letter: 'D' },
];

function normalizeScore(score) {
  const value = Number(score);
  if (Number.isNaN(value)) {
    return 0;
  }
  return Math.max(0, Math.min(10, value));
}

export function toScale4(score10) {
  const score = normalizeScore(score10);
  const row = SCALE_TABLE.find((item) => score >= item.min);
  return row ? row.scale4 : 0;
}

export function toLetter(score10) {
  const score = normalizeScore(score10);
  const row = SCALE_TABLE.find((item) => score >= item.min);
  return row ? row.letter : 'F';
}

export function calcGpa(grades = [], courses = []) {
  const courseMap = new Map(courses.map((course) => [String(course.id), course]));
  let weightedPoints = 0;
  let gpaCredits = 0;
  let totalCredits = 0;

  grades.forEach((grade) => {
    const course = courseMap.get(String(grade.courseId)) || grade.course;
    const credits = Number(course && course.credits ? course.credits : grade.credits) || 0;
    if (credits <= 0) {
      return;
    }
    const score10 = Number(grade.total);
    const scale4 = toScale4(score10);
    weightedPoints += scale4 * credits;
    gpaCredits += credits;
    if (scale4 > 0) {
      totalCredits += credits;
    }
  });

  const gpa = gpaCredits === 0 ? 0 : weightedPoints / gpaCredits;
  return {
    gpa: Math.round(gpa * 100) / 100,
    totalCredits,
    gpaCredits,
  };
}
