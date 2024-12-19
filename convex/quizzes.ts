import {
  ExpressionOrValue,
  OrderedQuery,
  Query,
  QueryInitializer,
} from "convex/server";
import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { DataModel } from "./_generated/dataModel";

export const createQuiz = mutation({
  args: {
    quizId: v.optional(v.id("quizzes")),
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
        multiple_correct_answers: v.union(
          v.literal("true"),
          v.literal("false"),
        ),
        correct_answer: v.optional(v.union(v.string(), v.null())),
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .collect();

    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    if (args.quizId) {
      const foundQuiz = await ctx.db.get(args.quizId);

      if (!foundQuiz) {
        throw new ConvexError("Quiz not found");
      }

      return await ctx.db.patch(foundQuiz._id, {
        meta: { ...foundQuiz.meta, ...args.meta },
        questions: args.questions,
      });
    }

    const quiz = await ctx.db.insert("quizzes", {
      meta: {
        ...args.meta,
        user: user[0]._id,
        author: user[0].name,
        authorId: user[0].clerkId,
        authorImageUrl: user[0].imageUrl,
      },
      questions: args.questions,
    });

    return quiz;
  },
});

export const deleteQuiz = mutation({
  args: {
    quizId: v.id("quizzes"),
  },
  handler: async (ctx, args) => {
    const quiz = await ctx.db.get(args.quizId);

    if (!quiz) {
      throw new ConvexError("Quiz not found");
    }

    return await ctx.db.delete(args.quizId);
  },
});

export const getQuizzesByAuthorId = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const quizzes = await ctx.db
      .query("quizzes")
      .filter((q) => q.eq(q.field("meta.authorId"), args.authorId))
      .collect();

    return quizzes;
  },
});

export const getAuthorQuizzesBySearch = query({
  args: {
    clerkUserId: v.optional(v.string()),
    search: v.optional(v.string()),
    category: v.optional(v.string()),
    difficulty: v.optional(
      v.union(
        v.literal("Any"),
        v.literal("Easy"),
        v.literal("Medium"),
        v.literal("Hard"),
      ),
    ),
    tags: v.optional(v.array(v.object({ name: v.string() }))),
    sort: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const qI: QueryInitializer<DataModel["quizzes"]> = ctx.db.query("quizzes");
    let q: Query<DataModel["quizzes"]> | OrderedQuery<DataModel["quizzes"]> =
      args.sort === "asc" || args.sort === "desc" ? qI.order(args.sort) : qI;

    if (args.search) {
      const K = qI.withSearchIndex("search_name", (q) =>
        q.search("meta.name", args.search!),
      );
      q = K;
    }

    if (args.clerkUserId) {
      q = q.filter((q) => {
        const isUser = q.eq(q.field("meta.authorId"), args.clerkUserId);
        let isCorrectCategory: ExpressionOrValue<boolean> = true;
        if (args.category) {
          isCorrectCategory = q.or(
            q.eq(q.field("meta.category"), args.category),
            q.eq(q.field("meta.category"), "Any"),
          );
        }

        let isCorrectDifficulty: ExpressionOrValue<boolean> = true;
        if (args.difficulty) {
          isCorrectDifficulty = q.or(
            q.eq(q.field("meta.difficulty"), args.difficulty),
            q.eq(q.field("meta.difficulty"), "Any"),
          );
        }

        let isCorrectTag: ExpressionOrValue<boolean> = true;
        if (args.tags) {
          isCorrectTag = q.eq(q.field("meta.tags"), args.tags);
        }

        return q.and(
          isUser,
          isCorrectCategory,
          isCorrectDifficulty,
          isCorrectTag,
        );
      });
    }

    if (args.sort === "az" || args.sort === "za") {
      const collection = await q.collect();
      const result = collection.sort((a, b) => {
        if (args.sort === "az") {
          return a.meta.name.localeCompare(b.meta.name);
        } else {
          return b.meta.name.localeCompare(a.meta.name);
        }
      });
      return result;
    } else {
      return await q.collect();
    }
  },
});
