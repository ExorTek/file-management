import {Layout, Menu} from 'antd';
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {File, Folder, Home, NotFound, UpdatePassword, User} from "../pages";
import {useEffect} from "react";
import {sendLoggedInUserFromApi} from "../services";
import {logout, setUser} from "../store/actions/auth";
import {toast} from "react-toastify";
import {Loading} from "../toolbox";
import {FaUserAlt, FaUserCog} from "react-icons/fa";
import {RiAdminFill, RiLockPasswordFill, RiUploadCloud2Fill} from "react-icons/ri";
import {AiFillFileImage, AiFillHome} from "react-icons/ai";
import Uploads from "../components/Uploads";
import {allowedRoles, allowedSuperAdmin} from "../helper/other";
import {IoExit, IoFolderSharp} from "react-icons/io5";

const {Sider, Content} = Layout;

function MainLayout() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector(state => state.auth);
    useEffect(() => {
        sendLoggedInUserFromApi().then(({data}) => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Tekrar giriş yapınız.');
                return navigate('/auth/login');
            }
            dispatch(setUser({user: data}));
        }).catch(err => {
            toast.error(err?.response?.data?.message || 'Bir hata oluştu!');
            navigate('/auth/login');
        });
    }, [location]);
    if (!user) return <Loading/>
    const menuItems = () => {
        let menu = [
            {
                key: '/',
                label: 'Anasayfa',
                icon: <AiFillHome/>,
            },
            {
                key: '/upload',
                label: 'Dosya Yükle',
                icon: <RiUploadCloud2Fill/>,
            },
        ];
        if (allowedRoles.includes(user.role)) {
            if (allowedSuperAdmin === user.role) {
                menu = [...menu, {
                    key: '/user',
                    label: 'Kullanıcılar',
                    icon: <RiAdminFill/>,
                }]
            }
            menu = [...menu,
                {
                    key: '/file',
                    label: 'Dosyalar',
                    icon: <AiFillFileImage/>,
                },
                {
                    key: '/folder',
                    label: 'Klasörler',
                    icon: <IoFolderSharp/>,
                }
            ]
        }
        menu = [...menu,
            {
                key: '/update-password',
                label: 'Şifre Güncelle',
                icon: <RiLockPasswordFill/>,
            },
            {
                key: '/logout',
                label: 'Çıkış Yap',
                icon: <IoExit/>,
                danger: true,
            }]
        return menu;
    };
    const iconClass = 'text-2xl';
    return (
        <Layout className={'full-height user-main-layout'}>
            <Sider trigger={null} collapsible className={'my-2 ml-1 user-layout-sider rounded-xl '}>
                <div
                    onClick={() => navigate('/')}
                    className="m-5 text-center text-white flex flex-col items-center gap-1 border rounded-xl p-2 hover:cursor-pointer">{`${user.name} ${user.surname}`}
                    <div className={'flex flex-row items-center gap-2'}>
                        {user.role === 'user' ?
                            <FaUserAlt className={`${iconClass} text-teal-600`}/> : user.role === 'admin' ?
                                <FaUserCog className={`${iconClass} text-fuchsia-600`}/> :
                                <RiAdminFill className={`${iconClass} text-orange-600`}/>}
                        {user.role.toUpperCase()}
                    </div>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['/']}
                    selectedKeys={[location.pathname]}
                    items={menuItems()}
                    onClick={({key}) => {
                        if (key === '/logout') {
                            dispatch(logout());
                            return navigate('/auth/login');
                        }
                        navigate(key);
                    }}
                />
            </Sider>
            <Layout className="user-site-layout">
                <Content className={'user-layout-content rounded-xl mx-5 my-6 py-8 px-4'}>
                    <Routes>
                        <Route path={'/'}
                               element={<Home/>}/>
                        <Route path={'/file'} element={<File/>}/>
                        <Route path={'/upload'} element={<Uploads/>}/>
                        <Route path={'/folder'} element={<Folder/>}/>
                        <Route path={'/user'} element={<User/>}/>
                        <Route path={'/update-password'} element={<UpdatePassword/>}/>
                        <Route path={'*'} element={<NotFound/>}/>
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}

export default MainLayout;
