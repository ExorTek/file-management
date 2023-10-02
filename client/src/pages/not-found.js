import React, {useEffect} from 'react';
import {Result} from "antd";
import {useNavigate} from "react-router-dom";
import {AiFillHome} from "react-icons/ai";

function NotFound() {
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            navigate('/');
        }, 5000);
    }, []);
    return (
        <Result className={'notfound-result flex flex-col items-center justify-center'}
                status="404"
                title="404"
                subTitle="Üzgünüz, aradığınız sayfa bulunamadı."
                extra={<AiFillHome onClick={() => navigate('/')}
                                   className={'text-4xl text-white bg-purple-800 p-2 rounded-xl w-14 hover:scale-110 transition-all duration-500 hover:cursor-pointer'}/>}
        />
    );
}

export default NotFound;
