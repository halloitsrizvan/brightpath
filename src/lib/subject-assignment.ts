const refId = (value: any) =>
    value?._id?.toString?.() || value?.toString?.() || '';

const subjectName = (value: any) =>
    String(value?.subjectName || value?.name || '')
        .trim()
        .toLocaleLowerCase();

/**
 * Find the student's priced assignment for an attendance record.
 * IDs remain the source of truth, while the normalized-name fallback handles
 * legacy duplicate Subject rows such as "Biology" and "BIOLOGY".
 */
export function findSubjectAssignment(
    assignments: any[] | undefined,
    subject: any,
    teacher: any
) {
    if (!Array.isArray(assignments)) return undefined;

    const wantedSubjectId = refId(subject);
    const wantedTeacherId = refId(teacher);
    const teacherMatches = (assignment: any) =>
        !wantedTeacherId || refId(assignment.teacherId) === wantedTeacherId;

    const idMatch = assignments.find((assignment: any) =>
        teacherMatches(assignment) &&
        wantedSubjectId &&
        refId(assignment.subjectId) === wantedSubjectId
    );
    if (idMatch) return idMatch;

    const wantedSubjectName = subjectName(subject);
    if (!wantedSubjectName) return undefined;

    return assignments.find((assignment: any) =>
        teacherMatches(assignment) &&
        subjectName(assignment.subjectId) === wantedSubjectName
    );
}
