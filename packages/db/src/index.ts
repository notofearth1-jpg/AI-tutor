import { 
  PrismaClient, 
  User, 
  StudentProfile, 
  Topic, 
  Lesson, 
  Assignment, 
  Submission, 
  Grade, 
  CoursePlan, 
  TopicMastery, 
  PromptTemplate, 
  AgentRun, 
  AnalyticsEvent, 
  AuditLog,
  Assessment,
  Role,
  Difficulty,
  AgentType,
  JobStatus
} from "./generated";

export * from "./generated";

// Explicit type exports for IDE synchronization
export type {
  User,
  StudentProfile,
  Topic,
  Lesson,
  Assignment,
  Submission,
  Grade,
  CoursePlan,
  TopicMastery,
  PromptTemplate,
  AgentRun,
  AnalyticsEvent,
  AuditLog,
  Assessment
};

// Explicit value exports for enums
export {
  Role,
  Difficulty,
  AgentType,
  JobStatus
};

export const prisma = new PrismaClient();
