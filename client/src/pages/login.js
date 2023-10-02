import React from 'react';
import {BsFillShieldLockFill} from "react-icons/bs";
import {BiHide, BiShow} from "react-icons/bi";
import {Button} from "antd";

function Login({form, showPassword, setPassword, setUsername, login}) {
    return (
        <div className={'flex justify-center items-center full-height bg-slate-800'}>
            <div className={'w-full max-w-7xl auth-layout-content p-20 shadow-2xl flex flex-col gap-2 bg-slate-700'}>
                <BsFillShieldLockFill className={'mx-auto mb-5 text-slate-200'} size={'10rem'}/>
                <div className={'w-full max-w-sm mx-auto'}>
                    <input autoFocus className={'bg-slate-300 w-full p-2 rounded-md login-input'}
                           placeholder={'Email veya kullanıcı adı'} onChange={setUsername} type="text"/>
                </div>
                <div
                    className={'w-full max-w-sm mx-auto flex items-center justify-center bg-slate-300 rounded-md login-input'}>
                    <input type={form.showPassword ? 'text' : 'password'}
                           className={'bg-slate-300 w-full p-2 rounded-md login-input'}
                           placeholder={'Şifre'} onChange={setPassword}/>
                    {form.showPassword ? <BiShow className={'text-slate-800'} size={'2rem'} onClick={showPassword}/> :
                        <BiHide className={'text-slate-800'} size={'2rem'} onClick={showPassword}/>}
                </div>
                <Button onClick={login} className={'login-button w-full max-w-sm mx-auto min-w-fit'}>Giriş</Button>
            </div>
        </div>
    );
}

export default Login;
