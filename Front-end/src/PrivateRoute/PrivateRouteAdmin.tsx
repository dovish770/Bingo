import React, { ReactNode, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';

interface IPrivateRoute {
    component: ReactNode;
  }

const PrivateRouteAdmin: React.FC<IPrivateRoute> = ({component}) => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const user = useSelector((state: RootState) => state.user.user);
    const navigate = useNavigate();


    useEffect(() => {
        if (user?.isAdmin === true) {
            setIsAdmin(true);
        } else {
          navigate("/");
        }
      }, [navigate]);
      return <>{isAdmin ? component : <h1>Loading...</h1>}</>;

}

export default PrivateRouteAdmin