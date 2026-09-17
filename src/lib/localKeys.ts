import { isGradeLevel, isSubjectSlug } from "../data/catalog";
import type { ClassStudent, GradeLevel, SubjectSlug, UniverseSlug } from "../data/types";

const DEVICE_KEY = "mission-maths-device";
const COLLECTION_KEY = "mission-maths-collection";
const PRENOM_KEY = "mission-maths-prenom";
const CLASS_CODE_KEY = "mission-maths-class-code";
const COURSE_GRADE_KEY = "happy-learn-grade";
const COURSE_SUBJECT_KEY = "happy-learn-subject";
const TEACHER_KEY = "mission-maths-teacher";
const CLASSES_KEY = "mission-maths-classes";
const CLASS_STUDENTS_KEY = "mission-maths-class-students";

export function getDeviceId(): string {
  const existing = localStorage.getItem(DEVICE_KEY);
  if (existing) return existing;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `dev-${Date.now()}`;
  localStorage.setItem(DEVICE_KEY, id);
  return id;
}

export function loadPrenom(): string {
  return localStorage.getItem(PRENOM_KEY) ?? "";
}

export function savePrenom(prenom: string): void {
  localStorage.setItem(PRENOM_KEY, prenom);
}

export function clearPrenom(): void {
  localStorage.removeItem(PRENOM_KEY);
}

export function loadClassCode(): string {
  return localStorage.getItem(CLASS_CODE_KEY) ?? "";
}

export function saveClassCode(code: string): void {
  if (code) localStorage.setItem(CLASS_CODE_KEY, code);
  else localStorage.removeItem(CLASS_CODE_KEY);
}

export function loadCourseGrade(): GradeLevel | null {
  const value = localStorage.getItem(COURSE_GRADE_KEY);
  return isGradeLevel(value) ? value : null;
}

export function loadCourseSubject(): SubjectSlug | null {
  const value = localStorage.getItem(COURSE_SUBJECT_KEY);
  return isSubjectSlug(value) ? value : null;
}

export function saveCourse(grade: GradeLevel, subject: SubjectSlug): void {
  localStorage.setItem(COURSE_GRADE_KEY, grade);
  localStorage.setItem(COURSE_SUBJECT_KEY, subject);
}

export function clearCourse(): void {
  localStorage.removeItem(COURSE_GRADE_KEY);
  localStorage.removeItem(COURSE_SUBJECT_KEY);
}

export function loadLocalTeacher(): { id: string; email: string } | null {
  try {
    const raw = JSON.parse(localStorage.getItem(TEACHER_KEY) ?? "null") as unknown;
    if (!raw || typeof raw !== "object") return null;
    const row = raw as { id?: unknown; email?: unknown };
    if (typeof row.id !== "string" || typeof row.email !== "string") return null;
    return { id: row.id, email: row.email };
  } catch {
    return null;
  }
}

export function saveLocalTeacher(teacher: { id: string; email: string }): void {
  localStorage.setItem(TEACHER_KEY, JSON.stringify(teacher));
}

export function clearLocalTeacher(): void {
  localStorage.removeItem(TEACHER_KEY);
}

const ACTIVE_CLASS_KEY = "happy-learn-active-class";

export function loadActiveClassId(): string | null {
  return localStorage.getItem(ACTIVE_CLASS_KEY);
}

export function saveActiveClassId(classId: string | null): void {
  if (classId) localStorage.setItem(ACTIVE_CLASS_KEY, classId);
  else localStorage.removeItem(ACTIVE_CLASS_KEY);
}

export function loadLocalClasses(): { id: string; nom: string; code: string; teacherId: string }[] {
  try {
    const raw = JSON.parse(localStorage.getItem(CLASSES_KEY) ?? "[]") as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter((item): item is { id: string; nom: string; code: string; teacherId: string } => {
      if (!item || typeof item !== "object") return false;
      const row = item as { id?: unknown; nom?: unknown; code?: unknown; teacherId?: unknown };
      return (
        typeof row.id === "string" &&
        typeof row.nom === "string" &&
        typeof row.code === "string" &&
        typeof row.teacherId === "string"
      );
    });
  } catch {
    return [];
  }
}

export function saveLocalClasses(
  items: { id: string; nom: string; code: string; teacherId: string }[],
): void {
  localStorage.setItem(CLASSES_KEY, JSON.stringify(items));
}

export function loadLocalClassStudents(): ClassStudent[] {
  try {
    const raw = JSON.parse(localStorage.getItem(CLASS_STUDENTS_KEY) ?? "[]") as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter((item): item is ClassStudent => {
      if (!item || typeof item !== "object") return false;
      const row = item as { id?: unknown; classId?: unknown; prenom?: unknown };
      return (
        typeof row.id === "string" &&
        typeof row.classId === "string" &&
        typeof row.prenom === "string" &&
        row.prenom.trim().length > 0
      );
    });
  } catch {
    return [];
  }
}

export function saveLocalClassStudents(items: ClassStudent[]): void {
  localStorage.setItem(CLASS_STUDENTS_KEY, JSON.stringify(items));
}

export function loadLocalCollection(): UniverseSlug[] {
  try {
    const raw = JSON.parse(localStorage.getItem(COLLECTION_KEY) ?? "[]") as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      (item): item is UniverseSlug =>
        item === "football" ||
        item === "rugby" ||
        item === "equitation" ||
        item === "espace",
    );
  } catch {
    return [];
  }
}

export function saveLocalCollection(items: UniverseSlug[]): void {
  localStorage.setItem(COLLECTION_KEY, JSON.stringify([...new Set(items)]));
}

export function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
