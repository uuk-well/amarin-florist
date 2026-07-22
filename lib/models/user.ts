export type User = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};

export type UserInput = {
  id: string;
  email: string;
  name?: string | null;
};
