export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  leadTime: string;
  features: string[];
  popular?: boolean;
};

export type AdvantageItem = {
  id: string;
  title: string;
  description: string;
  stat?: string;
};

export type ProcessStep = {
  id: number;
  title: string;
  description: string;
};

export type ReviewItem = {
  id: string;
  name: string;
  car: string;
  text: string;
  rating: number;
  date: string;
  service: string;
};

export type BrandItem = {
  id: string;
  name: string;
  color: string;
  group: "china" | "japan" | "korea" | "europe" | "usa" | "russia";
};

export type LeadPayload = {
  name: string;
  phone: string;
  service: string;
  message: string;
};
