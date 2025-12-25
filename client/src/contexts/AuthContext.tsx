import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, LoginCredentials } from '../types';
import toast from 'react-hot-toast';

// Auth State Interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth Actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

// Auth Context Interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  clearError: () => void;
}

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');

      if (userData && token) {
        try {
          const user = JSON.parse(userData);
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } catch (error) {
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };

    checkAuth();
  }, []);

  // Login function (mock implementation)
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      // Mock authentication - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock user data based on WCU ID
      const mockUser: User = {
        id: 1,
        wcu_id: credentials.wcuId,
        email: `${credentials.wcuId.toLowerCase().replace(/\//g, '.')}@wcu.edu.et`,
        role: credentials.wcuId.includes('FAC') ? 'faculty' : 
              credentials.wcuId.includes('ADMIN') ? 'admin' : 'student',
        status: 'active',
        profile: {
          user_id: 1,
          full_name: credentials.wcuId.includes('FAC') ? 'Dr. Ahmed Mohammed' :
                    credentials.wcuId.includes('ADMIN') ? 'System Administrator' :
                    'Abebe Kebede',
          father_name: 'Mohammed Ali',
          mother_name: 'Fatima Hassan',
          date_of_birth: '2000-01-01',
          gender: 'male',
          phone_number: '+251911000001',
        },
        created_at: new Date().toISOString(),
      };

      // Store user data
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('accessToken', 'mock-jwt-token');
      
      dispatch({ type: 'AUTH_SUCCESS', payload: mockUser });
      toast.success(`Welcome back, ${mockUser.profile?.full_name || mockUser.wcu_id}!`);
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  // Update user function
  const updateUser = (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to check if user has specific role
export const hasRole = (user: User | null, roles: string[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

export default AuthContext;