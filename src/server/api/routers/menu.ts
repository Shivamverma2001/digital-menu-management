import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const menuRouter = createTRPCRouter({
  getByRestaurantId: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurant.findUnique({
        where: { id: input.restaurantId },
        include: {
          categories: {
            where: {
              parentId: null, // Only top-level categories
            },
            include: {
              children: {
                include: {
                  dishes: {
                    include: {
                      dish: true,
                    },
                  },
                },
              },
              dishes: {
                include: {
                  dish: true,
                },
              },
            },
          },
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }

      return restaurant;
    }),
});

