"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { AuthTextField } from "@/components/auth/auth-text-field";
import { signUp } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  signupSchema,
  type SignupFormValues,
} from "@/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import type { AuthUser } from "@/types/auth";

const genderOptions = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
] as const;

type SignupFormProps = {
  onSuccess: (user: AuthUser) => void;
  onError: (message: string) => void;
};

export function SignupForm({ onSuccess, onError }: SignupFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      image: "",
    },
  });

  return (
    <form
      className="mt-8"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        try {
          onSuccess(await signUp(values));
        } catch (error) {
          onError(getApiErrorMessage(error));
        }
      })}
    >
      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <AuthTextField
            id="signup-first-name"
            label="First name"
            placeholder="Emily"
            autoComplete="given-name"
            error={errors.firstName?.message}
            registration={register("firstName")}
          />
          <AuthTextField
            id="signup-last-name"
            label="Last name"
            placeholder="Johnson"
            autoComplete="family-name"
            error={errors.lastName?.message}
            registration={register("lastName")}
          />
        </div>
        <AuthTextField
          id="signup-username"
          label="Username"
          placeholder="emily.johnson"
          autoComplete="username"
          error={errors.username?.message}
          registration={register("username")}
        />
        <AuthTextField
          id="signup-email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          registration={register("email")}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <AuthTextField
            id="signup-password"
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            error={errors.password?.message}
            registration={register("password")}
          />
          <Controller
            control={control}
            name="gender"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="signup-gender">Gender</FieldLabel>
                <Combobox
                  items={genderOptions.map((option) => option.value)}
                  itemToStringLabel={(value) =>
                    genderOptions.find((option) => option.value === value)
                      ?.label ?? ""
                  }
                  itemToStringValue={(value) =>
                    genderOptions.find((option) => option.value === value)
                      ?.label ?? ""
                  }
                  value={field.value || null}
                  onValueChange={(value) => field.onChange(value ?? "")}
                >
                  <ComboboxInput
                    id="signup-gender"
                    placeholder="Select gender"
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.error ? "signup-gender-error" : undefined
                    }
                    className="w-full [&_[data-slot=input-group]]:h-11 [&_[data-slot=input-group]]:rounded-xl"
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No gender found.</ComboboxEmpty>
                    <ComboboxList>
                      {genderOptions.map((option) => (
                        <ComboboxItem key={option.value} value={option.value}>
                          {option.label}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.error?.message && (
                  <FieldError id="signup-gender-error" className="mt-1">
                    {fieldState.error.message}
                  </FieldError>
                )}
              </Field>
            )}
          />
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-xl text-sm font-semibold"
        >
          Create account
        </Button>
      </FieldGroup>
    </form>
  );
}
