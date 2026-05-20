import * as React from "react";

type User = { id: string; email: string } | null;
interface AuthCtx { user: User; login: (u: User) => void; logout: () => void; }
const AuthContext = React.createContext<AuthCtx>({ user: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User>(null);
  return (
    <AuthContext.Provider value={{ user, login: setUser, logout: () => setUser(null) }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() { return React.useContext(AuthContext); }
