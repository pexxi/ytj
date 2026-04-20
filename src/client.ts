import {
  CompanySearchResponseSchema,
  CompanySearchResponseRelaxedSchema,
  PostCodesResponseSchema,
  type Company,
  type CompanySearchResponse,
  type PostCodeEntry,
  type SearchParams,
} from "./schemas.js";

const BASE_URL = "https://avoindata.prh.fi/opendata-ytj-api/v3";

function filterRawCompanies(
  companies: unknown[],
  params: SearchParams,
): unknown[] {
  const locationNeedle = params.location?.trim().toLowerCase();
  const postCodeNeedle = params.postCode?.trim();

  return companies.filter((c) => {
    if (!c || typeof c !== "object") return false;
    const company = c as Record<string, unknown>;

    if (!params.includeInactive && company.endDate) return false;

    if (locationNeedle || postCodeNeedle) {
      const addresses = Array.isArray(company.addresses) ? company.addresses : [];
      const matchesLocation = locationNeedle
        ? addresses.some((a) => {
            const offices = Array.isArray((a as { postOffices?: unknown }).postOffices)
              ? ((a as { postOffices: unknown[] }).postOffices)
              : [];
            return offices.some(
              (o) =>
                typeof (o as { city?: unknown }).city === "string" &&
                ((o as { city: string }).city).toLowerCase() === locationNeedle,
            );
          })
        : true;
      if (!matchesLocation) return false;

      const matchesPostCode = postCodeNeedle
        ? addresses.some(
            (a) => (a as { postCode?: unknown }).postCode === postCodeNeedle,
          )
        : true;
      if (!matchesPostCode) return false;
    }

    return true;
  });
}

export class YtjApiError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`YTJ API error (${status}): ${body}`);
    this.name = "YtjApiError";
  }
}

export class YtjClient {
  private baseUrl: string;

  constructor(baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async searchCompanies(params: SearchParams): Promise<CompanySearchResponse> {
    const url = new URL(`${this.baseUrl}/companies`);

    const paramMap: Record<string, string | number | undefined> = {
      name: params.name,
      location: params.location,
      businessId: params.businessId,
      companyForm: params.companyForm,
      mainBusinessLine: params.mainBusinessLine,
      registrationDateStart: params.registrationDateStart,
      registrationDateEnd: params.registrationDateEnd,
      postCode: params.postCode,
      businessIdRegistrationStart: params.businessIdRegistrationStart,
      businessIdRegistrationEnd: params.businessIdRegistrationEnd,
      page: params.page,
    };

    for (const [key, value] of Object.entries(paramMap)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new YtjApiError(res.status, await res.text());
    }

    const data = await res.json();

    if (Array.isArray(data?.companies)) {
      data.companies = filterRawCompanies(data.companies, params);
      data.totalResults = data.companies.length;
    }

    const schema = params.includeInactive
      ? CompanySearchResponseRelaxedSchema
      : CompanySearchResponseSchema;
    return schema.parse(data);
  }

  async getCompany(businessId: string): Promise<Company> {
    if (!/^\d{7}-\d$/.test(businessId)) {
      throw new Error(
        `Invalid business ID format: "${businessId}". Expected format: NNNNNNN-N (e.g. 2722789-6)`,
      );
    }

    const result = await this.searchCompanies({ businessId, includeInactive: true });

    if (result.companies.length === 0) {
      throw new Error(`No company found with business ID: ${businessId}`);
    }

    return result.companies[0];
  }

  async getDescriptions(
    code: string,
    lang: string,
  ): Promise<string> {
    const url = new URL(`${this.baseUrl}/description`);
    url.searchParams.set("code", code);
    url.searchParams.set("lang", lang);

    const res = await fetch(url);
    if (!res.ok) {
      throw new YtjApiError(res.status, await res.text());
    }

    return res.text();
  }

  async getPostCodes(lang: string): Promise<PostCodeEntry[]> {
    const url = new URL(`${this.baseUrl}/post_codes`);
    url.searchParams.set("lang", lang);

    const res = await fetch(url);
    if (!res.ok) {
      throw new YtjApiError(res.status, await res.text());
    }

    const data = await res.json();
    return PostCodesResponseSchema.parse(data);
  }
}
