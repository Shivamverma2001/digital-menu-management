"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { CountrySelect } from "~/components/country-select";
import { toast } from "sonner";

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  countryName: z.string().min(1, "Country name is required"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const utils = api.useUtils();
  const { data: user, isLoading: userLoading, isFetching: userFetching } = api.auth.me.useQuery();
  const updateMutation = api.auth.updateProfile.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      toast.success("Profile updated successfully!");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const countryName = watch("countryName");

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        countryName: user.countryName,
      });
    }
  }, [user, reset]);

  if (userLoading || userFetching || !user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }


  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateMutation.mutateAsync(data);
    } catch (error: any) {
      const errorMessage = error?.data?.zodError?.fieldErrors || error?.message || "Update failed";
      toast.error(typeof errorMessage === "string" ? errorMessage : "Failed to update profile");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Profile Settings</CardTitle>
          <CardDescription className="text-sm sm:text-base">Update your profile information</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-gray-50 text-sm sm:text-base"
              />
              <p className="text-xs sm:text-sm text-gray-500">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm sm:text-base">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className="text-sm sm:text-base"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs sm:text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="countryName" className="text-sm sm:text-base">Country Name</Label>
              <CountrySelect
                value={countryName || ""}
                onValueChange={(value) => setValue("countryName", value, { shouldValidate: true })}
                placeholder="Select your country"
                className="text-sm sm:text-base"
              />
              <input
                type="hidden"
                {...register("countryName", { required: "Country name is required" })}
                value={countryName || ""}
              />
              {errors.countryName && (
                <p className="text-xs sm:text-sm text-red-500">{errors.countryName.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 text-sm sm:text-base"
              >
                {updateMutation.isPending ? "Updating..." : "Update Profile"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="text-sm sm:text-base"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

