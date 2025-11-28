import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const dishRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        name: z.string().min(1, "Dish name is required"),
        image: z.string().url().optional(),
        description: z.string().optional(),
        spiceLevel: z.number().int().min(0).max(3).optional(),
        dietaryType: z.enum(["vegetarian", "non-vegetarian"]).default("vegetarian"),
        price: z.number().positive().optional(),
        categoryIds: z.array(z.string()).default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify restaurant ownership
      const restaurant = await ctx.db.restaurant.findFirst({
        where: {
          id: input.restaurantId,
          userId: ctx.user.id,
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }

      // Verify all categories belong to this restaurant
      if (input.categoryIds.length > 0) {
        const categories = await ctx.db.category.findMany({
          where: {
            id: { in: input.categoryIds },
            restaurantId: input.restaurantId,
          },
        });

        if (categories.length !== input.categoryIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "One or more categories not found or don't belong to this restaurant",
          });
        }
      }

      // Create dish
      const dish = await ctx.db.dish.create({
        data: {
          name: input.name,
          image: input.image,
          description: input.description,
          spiceLevel: input.spiceLevel,
          dietaryType: input.dietaryType,
          price: input.price,
          restaurantId: input.restaurantId,
          categories: {
            create: input.categoryIds.map((categoryId) => ({
              categoryId,
            })),
          },
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      });

      return dish;
    }),

  getByRestaurant: protectedProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify restaurant ownership
      const restaurant = await ctx.db.restaurant.findFirst({
        where: {
          id: input.restaurantId,
          userId: ctx.user.id,
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }

      const dishes = await ctx.db.dish.findMany({
        where: {
          restaurantId: input.restaurantId,
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return dishes;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const dish = await ctx.db.dish.findFirst({
        where: { id: input.id },
        include: {
          restaurant: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
      });

      if (!dish) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dish not found",
        });
      }

      if (dish.restaurant.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to view this dish",
        });
      }

      return dish;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        image: z.string().url().optional().nullable(),
        description: z.string().optional().nullable(),
        spiceLevel: z.number().int().min(0).max(3).optional().nullable(),
        dietaryType: z.enum(["vegetarian", "non-vegetarian"]).optional(),
        price: z.number().positive().optional().nullable(),
        categoryIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const dish = await ctx.db.dish.findFirst({
        where: { id: input.id },
        include: {
          restaurant: true,
        },
      });

      if (!dish) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dish not found",
        });
      }

      if (dish.restaurant.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to update this dish",
        });
      }

      // If categoryIds provided, verify they belong to same restaurant
      if (input.categoryIds) {
        const categories = await ctx.db.category.findMany({
          where: {
            id: { in: input.categoryIds },
            restaurantId: dish.restaurantId,
          },
        });

        if (categories.length !== input.categoryIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "One or more categories not found or don't belong to this restaurant",
          });
        }

        // Update categories
        await ctx.db.dishCategory.deleteMany({
          where: { dishId: input.id },
        });

        await ctx.db.dishCategory.createMany({
          data: input.categoryIds.map((categoryId) => ({
            dishId: input.id,
            categoryId,
          })),
        });
      }

      const updated = await ctx.db.dish.update({
        where: { id: input.id },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.image !== undefined && { image: input.image }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.spiceLevel !== undefined && { spiceLevel: input.spiceLevel }),
          ...(input.dietaryType && { dietaryType: input.dietaryType }),
          ...(input.price !== undefined && { price: input.price }),
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      });

      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const dish = await ctx.db.dish.findFirst({
        where: { id: input.id },
        include: {
          restaurant: true,
        },
      });

      if (!dish) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dish not found",
        });
      }

      if (dish.restaurant.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete this dish",
        });
      }

      await ctx.db.dish.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

