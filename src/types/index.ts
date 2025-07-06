export interface User {
  id: string;
  name: string;
  email: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  image: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  character: string;
}

export interface CharacterImage {
  id: string;
  name: string;
  data: string;
  uploadedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, name?: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}