import { generalValidationFields } from "../../common/validation.js";

export const respondToIdentityRequest = (lang) => {
  return z.object({
    params: z.object({
      messageId: generalValidationFields.Id(lang),
    }),
    body: z.object({
      status: z.enum(["0", "1", "2"]).default("0"),
    }),
  });
};
export const getAllIdentityRequests = (lang) => {
  return z.object({
    query: z.object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(50).default(20),
    }),
  });
};

export const requestIdentity = (lang) => {
  return z.object({
    params: z.strictObject({
      messageId: generalValidationFields.Id(lang),
    }),
  });
};
