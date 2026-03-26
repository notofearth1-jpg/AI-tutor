export const RESPONSE_SCHEMAS = {
  course_creator: {
    type: "object",
    properties: {
      studentLevel: { type: "string" },
      knowledgeGaps: { type: "array", items: { type: "string" } },
      recommendedTopics: { type: "array", items: { type: "string" } },
      modules: {
        type: "array",
        items: {
          type: "object",
          properties: {
            topicSlug: { type: "string" },
            title: { type: "string" },
            reason: { type: "string" },
            difficulty: { type: "string" }
          }
        }
      }
    },
    required: ["studentLevel", "recommendedTopics", "modules"]
  },
  teacher: {
    type: "object",
    properties: {
      title: { type: "string" },
      contentMarkdown: { type: "string" },
      recap: { type: "array", items: { type: "string" } },
      reflectionQuestions: { type: "array", items: { type: "string" } }
    },
    required: ["title", "contentMarkdown", "recap", "reflectionQuestions"]
  },
  invigilator_generate: {
    type: "object",
    properties: {
      title: { type: "string" },
      instructions: { type: "string" },
      questions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            type: { type: "string" },
            question: { type: "string" },
            options: { type: "array", items: { type: "string" } }
          }
        }
      }
    },
    required: ["title", "questions"]
  },
  invigilator_grade: {
    type: "object",
    properties: {
      score: { type: "number" },
      maxScore: { type: "number" },
      feedback: { type: "string" },
      strengths: { type: "array", items: { type: "string" } },
      improvements: { type: "array", items: { type: "string" } },
      nextRecommendedTopic: { type: "string" }
    },
    required: ["score", "feedback", "strengths", "improvements"]
  },
  supervisor: {
    type: "object",
    properties: {
      approved: { type: "boolean" },
      reason: { type: "string" },
      suggestedChanges: { type: "string" }
    },
    required: ["approved", "reason"]
  }
};
