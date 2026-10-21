"use client";

import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type AuthTextFieldProps = {
  id: string;
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
} & Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "autoComplete" | "placeholder" | "type"
>;

export function AuthTextField({
  id,
  label,
  error,
  registration,
  ...inputProps
}: AuthTextFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const errorId = `${id}-error`;
  const isPasswordField = inputProps.type === "password";

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup className="h-11 rounded-xl">
        <InputGroupInput
          {...inputProps}
          id={id}
          type={
            isPasswordField && isPasswordVisible ? "text" : inputProps.type
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="h-11 rounded-xl px-3.5"
          {...registration}
        />
        {isPasswordField && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              aria-pressed={isPasswordVisible}
              onClick={() => setIsPasswordVisible((visible) => !visible)}
            >
              {isPasswordVisible ? (
                <EyeOff aria-hidden="true" />
              ) : (
                <Eye aria-hidden="true" />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
      {error && (
        <FieldError id={errorId} className="mt-1">
          {error}
        </FieldError>
      )}
    </Field>
  );
}
