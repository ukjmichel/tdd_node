export interface UserInterface {
  id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean; 
}

export type SafeUser = Omit<UserInterface, 'password'>;
