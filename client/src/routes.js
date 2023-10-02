import {AuthLayout, MainLayout} from "./layouts";
import {Navigate} from 'react-router-dom';
import {Login, NotFound} from "./pages";

const routes = (isLoggedIn) => [
    {
        path: '/auth',
        element: <AuthLayout/>,
        children: [
            {path: 'login', element: <AuthLayout/>},
            {path: '*', element: <Navigate to="/login"/>},
        ],
    },
    {
        path: '/',
        element: isLoggedIn ? <MainLayout/> : <Navigate to="/auth/login"/>,
        children: [
            {path: '*', element: <NotFound/>},
        ],
    }
];

export default routes;
