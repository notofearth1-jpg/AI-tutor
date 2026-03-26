import { z } from "zod";
export declare const UserRoleSchema: z.ZodEnum<["admin", "student", "content_manager", "ai_ops"]>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export declare const StudentProfileSchema: z.ZodObject<{
    userId: z.ZodString;
    fullName: z.ZodString;
    ageRange: z.ZodOptional<z.ZodString>;
    educationBackground: z.ZodOptional<z.ZodString>;
    goals: z.ZodOptional<z.ZodString>;
    selfReportedLevel: z.ZodEnum<["beginner", "intermediate", "advanced"]>;
    preferredLanguage: z.ZodDefault<z.ZodString>;
    preferredLearningStyle: z.ZodOptional<z.ZodString>;
    knownTopics: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    fullName: string;
    selfReportedLevel: "beginner" | "intermediate" | "advanced";
    preferredLanguage: string;
    knownTopics: string[];
    ageRange?: string | undefined;
    educationBackground?: string | undefined;
    goals?: string | undefined;
    preferredLearningStyle?: string | undefined;
}, {
    userId: string;
    fullName: string;
    selfReportedLevel: "beginner" | "intermediate" | "advanced";
    ageRange?: string | undefined;
    educationBackground?: string | undefined;
    goals?: string | undefined;
    preferredLanguage?: string | undefined;
    preferredLearningStyle?: string | undefined;
    knownTopics?: string[] | undefined;
}>;
export type StudentProfile = z.infer<typeof StudentProfileSchema>;
export declare const TopicSchema: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    difficulty: z.ZodEnum<["beginner", "intermediate", "advanced"]>;
    estimatedMinutes: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    slug: string;
    title: string;
    description: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    estimatedMinutes: number;
}, {
    slug: string;
    title: string;
    description: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    estimatedMinutes: number;
}>;
export type Topic = z.infer<typeof TopicSchema>;
export declare const LessonSchema: z.ZodObject<{
    id: z.ZodString;
    topicSlug: z.ZodString;
    title: z.ZodString;
    contentMarkdown: z.ZodString;
    recap: z.ZodArray<z.ZodString, "many">;
    reflectionQuestions: z.ZodArray<z.ZodString, "many">;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    id: string;
    topicSlug: string;
    contentMarkdown: string;
    recap: string[];
    reflectionQuestions: string[];
    metadata?: Record<string, unknown> | undefined;
}, {
    title: string;
    id: string;
    topicSlug: string;
    contentMarkdown: string;
    recap: string[];
    reflectionQuestions: string[];
    metadata?: Record<string, unknown> | undefined;
}>;
export type Lesson = z.infer<typeof LessonSchema>;
export declare const AssignmentSchema: z.ZodObject<{
    id: z.ZodString;
    lessonId: z.ZodString;
    title: z.ZodString;
    instructions: z.ZodString;
    questions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["multiple_choice", "short_answer", "code", "essay"]>;
        question: z.ZodString;
        options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: "code" | "multiple_choice" | "short_answer" | "essay";
        id: string;
        question: string;
        options?: string[] | undefined;
    }, {
        type: "code" | "multiple_choice" | "short_answer" | "essay";
        id: string;
        question: string;
        options?: string[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    title: string;
    id: string;
    lessonId: string;
    instructions: string;
    questions: {
        type: "code" | "multiple_choice" | "short_answer" | "essay";
        id: string;
        question: string;
        options?: string[] | undefined;
    }[];
}, {
    title: string;
    id: string;
    lessonId: string;
    instructions: string;
    questions: {
        type: "code" | "multiple_choice" | "short_answer" | "essay";
        id: string;
        question: string;
        options?: string[] | undefined;
    }[];
}>;
export type Assignment = z.infer<typeof AssignmentSchema>;
export declare const GradeSchema: z.ZodObject<{
    id: z.ZodString;
    submissionId: z.ZodString;
    score: z.ZodNumber;
    maxScore: z.ZodDefault<z.ZodNumber>;
    feedback: z.ZodString;
    strengths: z.ZodArray<z.ZodString, "many">;
    improvements: z.ZodArray<z.ZodString, "many">;
    nextRecommendedTopic: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    submissionId: string;
    score: number;
    maxScore: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    nextRecommendedTopic?: string | undefined;
}, {
    id: string;
    submissionId: string;
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    maxScore?: number | undefined;
    nextRecommendedTopic?: string | undefined;
}>;
export type Grade = z.infer<typeof GradeSchema>;
export declare const AgentTypeSchema: z.ZodEnum<["course_creator", "teacher", "invigilator", "supervisor", "progress_coach"]>;
export type AgentType = z.infer<typeof AgentTypeSchema>;
