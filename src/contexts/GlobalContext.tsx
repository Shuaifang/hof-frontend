import React, { createContext, useContext, useReducer, ReactNode, Dispatch, useEffect } from 'react';
import { fetchConfig } from '@/utils/api/global';  // 确保路径正确
import { getSession } from 'next-auth/react';


interface InfoList {
  id: number;
  info_id: number;
  title: string;
  link: string;
  children?: InfoList[];
}

interface ConfigData {
  header: {
    infoList: InfoList[];
  };
  bottom: {
    infoList: InfoList[];
  };
  nation: {
    infoList: {
      key: string;
      name: string;
    }[];
  };
  target_group: {
    infoList: {
      key: string;
      name: string;
    }[];
  };
  type: {
    infoList: {
      key: string;
      name: string;
    }[];
  };
}

interface ConfigApiResponse {
  code: number;
  message: string;
  data: ConfigData;
}

interface ConfigState {
  data?: ConfigData;
}

interface ConfigAction {
  type: string;
  payload?: ConfigData;
}


const ConfigContext = createContext<{
  state: ConfigState;
  dispatch: Dispatch<ConfigAction>;
} | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

const configReducer = (state: ConfigState, action: ConfigAction): ConfigState => {
  switch (action.type) {
    case 'SET_CONFIG':
      return {
        ...state,
        data: action.payload,
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(configReducer, {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchConfig();
        if (response.code === 0) {
          dispatch({ type: 'SET_CONFIG', payload: response.data });
        } else {
          console.error('Failed to fetch config:', response.message);
        }
      } catch (error) {
        console.error('Failed to fetch config:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  
  return (
    <ConfigContext.Provider value={{ state, dispatch }}>
      {children}
    </ConfigContext.Provider>
  );
};
