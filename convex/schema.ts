import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  quizzes: defineTable({
    meta: v.object({
      name: v.string(),
      category: v.string(),
      difficulty: v.union(
        v.literal("Easy"),
        v.literal("Medium"),
        v.literal("Hard"),
        v.literal("Any"),
      ),
      tags: v.array(v.object({ id: v.optional(v.number()), name: v.string() })),
      user: v.id("users"),
      author: v.string(),
      authorId: v.string(),
      authorImageUrl: v.string(),
    }),
    questions: v.array(
      v.object({
        id: v.number(),
        question: v.string(),
        description: v.union(v.string(), v.null()),
        answers: v.object({
          answer_a: v.union(v.string(), v.null()),
          answer_b: v.union(v.string(), v.null()),
          answer_c: v.union(v.string(), v.null()),
          answer_d: v.union(v.string(), v.null()),
          answer_e: v.union(v.string(), v.null()),
          answer_f: v.union(v.string(), v.null()),
        }),
        correct_answer: v.optional(v.union(v.string(), v.null())),
        multiple_correct_answers: v.union(
          v.literal("true"),
          v.literal("false"),
        ),
        correct_answers: v.object({
          answer_a_correct: v.union(v.literal("true"), v.literal("false")),
          answer_b_correct: v.union(v.literal("true"), v.literal("false")),
          answer_c_correct: v.union(v.literal("true"), v.literal("false")),
          answer_d_correct: v.union(v.literal("true"), v.literal("false")),
          answer_e_correct: v.union(v.literal("true"), v.literal("false")),
          answer_f_correct: v.union(v.literal("true"), v.literal("false")),
        }),
        explanation: v.union(v.string(), v.null()),
        tip: v.union(v.string(), v.null()),
        tags: v.array(
          v.object({ id: v.optional(v.number()), name: v.string() }),
        ),
        category: v.string(),
        difficulty: v.union(
          v.literal("Easy"),
          v.literal("Medium"),
          v.literal("Hard"),
        ),
      }),
    ),
  })
    .index("by_user", ["meta.user"])
    .searchIndex("search_name", {
      searchField: "meta.name",
    }),
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    name: v.string(),
  }).searchIndex("search_clerkId", {
    searchField: "clerkId",
    filterFields: ["clerkId"],
  }),
});
