import React, {useState} from 'react';
import {Button} from "antd";
import {BiHide, BiShow} from "react-icons/bi";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {changePasswordFromApi} from "../services";

function UpdatePassword() {
    const [inputsProps, setInputsProps] = useState([
        {
            placeholder: 'Eski şifre',
            key: 'oldPassword',
            value: '',
            show: false
        },
        {
            placeholder: 'Yeni şifre',
            key: 'newPassword',
            value: '',
            show: false
        },
        {
            placeholder: 'Yeni şifre tekrar',
            key: 'confirmPassword',
            value: '',
            show: false
        }
    ]);
    const navigate = useNavigate();
    const handleInputChange = (e, index) => setInputsProps(prev => {
        const newState = [...prev]
        newState[index].value = e.target.value
        return newState
    })
    const [loading, setLoading] = useState(false);
    const handleShowPassword = (index) => setInputsProps(prev => {
        const newState = [...prev];
        newState[index].show = !newState[index].show;
        return newState;
    })
    const updatePassword = () => {
        setLoading(true);
        const data = {}
        inputsProps.forEach(input => data[input.key] = input.value)
        if (data.newPassword !== data.confirmPassword) return toast.error('Şifreler uyuşmuyor!')
        if (!data.oldPassword || !data.newPassword || !data.confirmPassword) return toast.error('Lütfen tüm alanları doldurun!')
        changePasswordFromApi(data).then(res => {
            toast.success('Şifre başarıyla değiştirildi. Tekrar giriş yapınız.');
            setLoading(false);
            localStorage.clear();
            setTimeout(() => {
                navigate('/auth/login')
            }, 2000)
        }).catch(err => {
            setLoading(false);
            toast.error(err.response.data.message)
        })
    }
    return (
        <div className={'flex flex-col gap-4 max-w-sm mx-auto'}>
            {inputsProps.map((inputProps, index) => (
                <div
                    className={'w-full max-w-sm mx-auto flex items-center justify-center bg-slate-300 rounded-xl text-black'}>
                    <input type={inputProps.show ? 'text' : 'password'}
                           className={'  w-full p-2 rounded-md bg-slate-100'}
                           placeholder={inputProps.placeholder} onChange={(e) => handleInputChange(e, index)}/>
                    {inputProps.show ?
                        <BiShow className={'text-slate-800'} size={'2rem'} onClick={() => handleShowPassword(index)}/> :
                        <BiHide className={'text-slate-800'} size={'2rem'} onClick={() => handleShowPassword(index)}/>}
                </div>
            ))}
            <Button onClick={updatePassword}
                    loading={loading}
                    className={'custom-button hover:scale-105 transition-all duration-500'}>Güncelle</Button>
        </div>
    );
}

export default UpdatePassword;
