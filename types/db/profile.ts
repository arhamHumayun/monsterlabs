export interface ProfileDocument {
  user_id: string;
  updated_at: string;
  name: string;
  role: string;
  stripe_customer_id: string | null;
  subscription_status: string | null;
  subscription_id: string | null;
  subscribed_to_news: boolean;
}

export interface FullProfileDocument extends ProfileDocument {
  created_at: string;
  email: string;
}