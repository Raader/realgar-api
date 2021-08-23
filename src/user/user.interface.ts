export default interface User {
  id?: string;
  username: string;
  email: string;
  password?: string;
  settings?: {
    currency?: string;
  };
}
