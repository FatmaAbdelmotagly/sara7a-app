import { z } from "zod";
import { GenderEnum } from "../../common/enum/index.js";
import { generalValidationFields } from "../../common/validation.js";

const loginSchema = (lang) => {
  return z.strictObject({
    email: generalValidationFields.email(lang),
    password: generalValidationFields.password,
  });
};

export const login = (lang) => {
  return z.object({
    body: loginSchema(lang),
  });
};

export const signup = (lang) => {
  return z.object({
    body: loginSchema(lang)
      .safeExtend({
        username: generalValidationFields.username(lang),
        confirmPassword: generalValidationFields.confirmPassword,
        phone: generalValidationFields.phone,
        gender: generalValidationFields.gender,
      })
      .superRefine((data, ctx) => {
        generalValidationFields.matchFields({
          original: "password",
          copy: "confirmPassword",
          data,
          ctx,
          lang,
        });
        if (!data.username.includes(" ")) {
          ctx.addIssue({
            code: "custom",
            path: ["username"],
            message: "username must contain 2 parts",
          });
        }
      }),
  });
};

export const confirmEmail = (lang) => {
  return z.object({
    body: z.strictObject({
      email: generalValidationFields.email(lang),
      otp: generalValidationFields.otp,
    }),
    query: z.object({}),
    headers: z.object({}),
    params: z.object({}),
  });
};
export const resetPassword = (lang) => {
  return z.object({
    body: z
      .object({
        email: generalValidationFields.email(lang),
        otp: generalValidationFields.otp,
        password: generalValidationFields.password,
        confirmPassword: generalValidationFields.confirmPassword,
      })
      .superRefine((data, ctx) => {
        generalValidationFields.matchFields({
          original: "password",
          copy: "confirmPassword",
          data,
          ctx,
        });
      }),
  });
};
export const resendconfirmEmail = (lang) => {
  return z.object({
    body: z.strictObject({
      email: generalValidationFields.email(lang),
    }),
    query: z.object({}),
    headers: z.object({}),
    params: z.object({}),
  });
};
