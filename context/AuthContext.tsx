import React, {createContext, useState, useContext} from 'react';

interface UserData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userData: UserData | null;
  login: (email: string, password: string, rememberMe: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const login = (email: string, password: string, rememberMe: boolean) => {
    // 사용자 데이터 저장 (나중에 API 연동 시 사용)
    setUserData({email, password, rememberMe});
    setIsLoggedIn(true);
    console.log('Login stored:', {email, rememberMe});
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{isLoggedIn, userData, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
