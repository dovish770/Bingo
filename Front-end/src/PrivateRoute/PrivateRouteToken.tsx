import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookieValue } from '../service/tokenService';

interface IPrivateRoute {
  component: ReactNode;
}

const PrivateRouteToken: React.FC<IPrivateRoute> = ({ component }: IPrivateRoute) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const ifHaveToken = (): boolean => {
    const token = getCookieValue('Token');
    return !!token;
  };

  useEffect(() => {
    const tokenExists = ifHaveToken();
    if (tokenExists) {
      setIsLoading(false);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return <>{isLoading ? <h1>Loading...</h1> : component}</>;
};

export default PrivateRouteToken;
