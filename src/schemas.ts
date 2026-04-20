import { z } from "zod";

export const DescriptionEntrySchema = z.object({
  languageCode: z.string(),
  description: z.string().nullable().optional(),
});

export const BusinessIdSchema = z.object({
  value: z.string(),
  registrationDate: z.string().nullable().optional(),
  source: z.string(),
});

export const EuIdSchema = z.object({
  value: z.string(),
  source: z.string(),
});

export const CompanyNameSchema = z.object({
  name: z.string(),
  type: z.string(),
  registrationDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  version: z.number(),
  source: z.string(),
});

export const MainBusinessLineSchema = z.object({
  type: z.string(),
  descriptions: z.array(DescriptionEntrySchema),
  typeCodeSet: z.string(),
  registrationDate: z.string().nullable().optional(),
  source: z.string(),
});

export const WebsiteSchema = z.object({
  url: z.string(),
  registrationDate: z.string().nullable().optional(),
  source: z.string(),
});

export const CompanyFormSchema = z.object({
  type: z.string(),
  descriptions: z.array(DescriptionEntrySchema),
  registrationDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  version: z.number(),
  source: z.string(),
});

export const CompanySituationSchema = z.object({
  type: z.string(),
  registrationDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  source: z.string(),
});

export const PostOfficeSchema = z.object({
  city: z.string(),
  languageCode: z.string(),
  municipalityCode: z.string().nullable().optional(),
});

export const AddressSchema = z.object({
  type: z.number(),
  street: z.string().nullable().optional(),
  postCode: z.string().nullable().optional(),
  postOffices: z.array(PostOfficeSchema).optional(),
  postOfficeBox: z.string().nullable().optional(),
  buildingNumber: z.string().nullable().optional(),
  entrance: z.string().nullable().optional(),
  apartmentNumber: z.string().nullable().optional(),
  apartmentIdSuffix: z.string().nullable().optional(),
  co: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  freeAddressLine: z.string().nullable().optional(),
  registrationDate: z.string().nullable().optional(),
  source: z.string(),
});

export const RegisteredEntrySchema = z.object({
  type: z.string(),
  descriptions: z.array(DescriptionEntrySchema),
  registrationDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  register: z.string(),
  authority: z.string(),
});

export const CompanySchema = z.object({
  businessId: BusinessIdSchema,
  euId: EuIdSchema.optional(),
  names: z.array(CompanyNameSchema),
  mainBusinessLine: MainBusinessLineSchema.optional(),
  website: WebsiteSchema.optional(),
  companyForms: z.array(CompanyFormSchema),
  companySituations: z.array(CompanySituationSchema),
  registeredEntries: z.array(RegisteredEntrySchema),
  addresses: z.array(AddressSchema),
  tradeRegisterStatus: z.string(),
  status: z.string(),
  registrationDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  lastModified: z.string().nullable().optional(),
});

export const CompanySearchResponseSchema = z.object({
  totalResults: z.number(),
  companies: z.array(CompanySchema),
});

export const CompanyRelaxedSchema = CompanySchema.partial().extend({
  businessId: BusinessIdSchema.partial().optional(),
  euId: EuIdSchema.partial().optional(),
  names: z.array(CompanyNameSchema.partial()).optional(),
  mainBusinessLine: MainBusinessLineSchema.partial().optional(),
  website: WebsiteSchema.partial().optional(),
  companyForms: z.array(CompanyFormSchema.partial()).optional(),
  companySituations: z.array(CompanySituationSchema.partial()).optional(),
  registeredEntries: z.array(RegisteredEntrySchema.partial()).optional(),
  addresses: z.array(AddressSchema.partial()).optional(),
});

export const CompanySearchResponseRelaxedSchema = z.object({
  totalResults: z.number(),
  companies: z.array(CompanyRelaxedSchema),
});

export const PostCodeEntrySchema = z.object({
  postCode: z.string(),
  city: z.string(),
  active: z.boolean(),
  languageCode: z.string(),
  municipalityCode: z.string().nullable().optional(),
});

export const PostCodesResponseSchema = z.array(PostCodeEntrySchema);

// Inferred types
export type DescriptionEntry = z.infer<typeof DescriptionEntrySchema>;
export type Company = z.infer<typeof CompanyRelaxedSchema>;
export type CompanySearchResponse = z.infer<typeof CompanySearchResponseRelaxedSchema>;
export type PostCodeEntry = z.infer<typeof PostCodeEntrySchema>;

export interface SearchParams {
  name?: string;
  location?: string;
  businessId?: string;
  companyForm?: string;
  mainBusinessLine?: string;
  registrationDateStart?: string;
  registrationDateEnd?: string;
  postCode?: string;
  businessIdRegistrationStart?: string;
  businessIdRegistrationEnd?: string;
  page?: number;
  includeInactive?: boolean;
}
