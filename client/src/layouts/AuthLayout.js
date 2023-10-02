import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {onlyEmailRegex, onlyTextRegex} from "../helper/regex";
import {loginFromApi} from "../services";
import {useNavigate} from "react-router-dom";
import {useKeyPress} from "../hooks";
import {useDispatch} from "react-redux";
import {Login} from "../pages";

function AuthLayout() {
    const [form, setForm] = useState({
        showPassword: false,
        username: '',
        password: '',
    });
    const navigate = useNavigate();
    const key = useKeyPress();
    const dispatch = useDispatch();
    const showPassword = () => setForm(prevState => ({...prevState, showPassword: !prevState.showPassword}))
    const setPassword = (e) => setForm(prevState => ({...prevState, password: e.target.value}))
    const setUsername = (e) => setForm(prevState => ({...prevState, username: e.target.value}))
    const login = () => {
        if (!form.username || !form.password) return toast.error('Lütfen tüm alanları doldurunuz!');
        if (form.username.includes('@') && !onlyEmailRegex.test(form.username)) return toast.error('Email adresinizi doğru giriniz!');
        if (!form.username.includes('@') && !onlyTextRegex.test(form.username)) return toast.error('Kullanıcı adınızı doğru giriniz!');
        loginFromApi(form).then(({token}) => {
            toast.success('Giriş başarılı!');
            localStorage.setItem('token', token);
            setTimeout(() => navigate('/'), 1000);
        }).catch(err => toast.error(err?.response?.data?.message) || 'Bir hata oluştu!')
    };
    useEffect(() => {
        if (key === 'Enter') login();
    }, [key]);
    return <Login login={login} form={form} showPassword={showPassword} setPassword={setPassword}
                  setUsername={setUsername}/>
}

export default AuthLayout;
