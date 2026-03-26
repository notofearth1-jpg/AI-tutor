import { z } from "zod";
export const UserRoleSchema = z.enum(["admin", "student", "content_manager", "ai_ops"]);
export const StudentProfileSchema = z.object({
    userId: z.string().uuid(),
    fullName: z.string().min(2),
    ageRange: z.string().optional(),
    educationBackground: z.string().optional(),
    goals: z.string().optional(),
    selfReportedLevel: z.enum(["beginner", "intermediate", "advanced"]),
    preferredLanguage: z.string().default("en"),
    preferredLearningStyle: z.string().optional(),
    knownTopics: z.array(z.string()).default([])
});
export const TopicSchema = z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    estimatedMinutes: z.number().int()
});
export const LessonSchema = z.object({
    id: z.string().uuid(),
    topicSlug: z.string(),
    title: z.string(),
    contentMarkdown: z.string(),
    recap: z.array(z.string()),
    reflectionQuestions: z.array(z.string()),
    metadata: z.record(z.unknown()).optional()
});
export const AssignmentSchema = z.object({
    id: z.string().uuid(),
    lessonId: z.string().uuid(),
    title: z.string(),
    instructions: z.string(),
    questions: z.array(z.object({
        id: z.string(),
        type: z.enum(["multiple_choice", "short_answer", "code", "essay"]),
        question: z.string(),
        options: z.array(z.string()).optional()
    }))
});
export const GradeSchema = z.object({
    id: z.string().uuid(),
    submissionId: z.string().uuid(),
    score: z.number().min(0).max(100),
    maxScore: z.number().default(100),
    feedback: z.string(),
    strengths: z.array(z.string()),
    improvements: z.array(z.string()),
    nextRecommendedTopic: z.string().optional()
});
export const AgentTypeSchema = z.enum([
    "course_creator",
    "teacher",
    "invigilator",
    "supervisor",
    "progress_coach"
]);
