import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useRoutes} from "react-router-dom";
import routes from "./routes";

function App() {
    const token= localStorage.getItem('token');
    const routing = useRoutes(routes(!!token));
    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
                            closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme={'dark'}/>
            {routing}
        </>
    );
}

export default App;
