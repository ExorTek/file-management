import {useEffect, useState} from 'react';
import {getUsersFromApi} from "../services";
import {toast} from "react-toastify";
import {MdContentCopy, MdDeleteForever} from "react-icons/md";
import {FaHourglassEnd, FaUserAlt, FaUserCog} from "react-icons/fa";
import {RiAdminFill} from "react-icons/ri";
import {AiFillInfoCircle} from "react-icons/ai";
import {Alert, Button, Popconfirm} from "antd";
import {UserDrawer, UserModal, UserTable} from "../components";
import {ImBlocked} from "react-icons/im";
import {Loading} from "../toolbox";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const roles = [
    {
        label: 'Admin',
        value: 'admin'
    },
    {
        label: 'User',
        value: 'user'
    },
    {
        label: 'Super Admin',
        value: 'superadmin'
    }
];
const statuses = [
    {
        label: 'Active',
        value: 'active'
    },
    {
        label: 'Passive',
        value: 'passive'
    },
    {
        label: 'Banned',
        value: 'banned'
    },
    {
        label: 'Deleted',
        value: 'deleted'
    }
]

function User() {
    const {user} = useSelector(state => state.auth);
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [drawerSettings, setDrawerSettings] = useState({
        visible: false,
        folder: null
    });
    const [loading, setLoading] = useState(false);
    const [userUpdateModalVis, setUserUpdateModalVis] = useState(false);
    const [updateUser, setUpdateUser] = useState({});

    const getUsers = () => {
        setLoading(true);
        getUsersFromApi().then(({data}) => {
            setUsers(data);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            toast.error(err?.response?.data?.message || 'get users error')
        });
    }
    useEffect(() => {
        getUsers();
        return () => {
            setUsers([])
        }
    }, []);
    const copyToClipboard = (key, text) => navigator.clipboard.writeText(text).then(() => toast.success(`${key} panoya kopyalandı`));
    const tableStatusIconSize = 'text-2xl'
    const columns = [
        {
            title: 'User ID',
            dataIndex: '_id',
            key: '_id',
            render: (id) => <span
                className={'hover:cursor-pointer hover:scale-105 transition-all duration-500 flex items-center gap-2 justify-center hover:text-blue-500'}
                onClick={() => copyToClipboard('User ID', id)}>{id}<MdContentCopy/></span>

        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Surname',
            dataIndex: 'surname',
            key: 'surname',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (status) => <span className={'flex items-center gap-2 justify-center'}>
                {status === 'active' ? <span className={'text-green-500'}><FaUserAlt
                    className={tableStatusIconSize}/></span> : status === 'passive' ?
                    <span className={'text-yellow-500'}><FaHourglassEnd
                        className={tableStatusIconSize}/></span> : status === 'banned' ?
                        <span className={'text-red-500'}><ImBlocked className={tableStatusIconSize}/></span> :
                        <span className={'text-red-500'}><MdDeleteForever className={tableStatusIconSize}/></span>}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            sorter: (a, b) => a.role.localeCompare(b.role),
            render: (role) => {
                const iconClass = 'text-2xl';
                return <div className={'flex flex-col items-center'}>
                    {role === 'user' ? <FaUserAlt className={`${iconClass} text-teal-600`}/> : role === 'admin' ?
                        <FaUserCog className={`${iconClass} text-fuchsia-600`}/> :
                        <RiAdminFill className={`${iconClass} text-orange-600`}/>}
                    {role.toUpperCase()}
                </div>
            }
        },
        {
            title: 'Access Folders',
            dataIndex: 'accessFolders',
            key: 'accessFolders',
            render: (accessFolders) => <>
                {accessFolders.map((folder, index) => <div onClick={() => setDrawerSettings({
                    visible: true,
                    folder: folder
                })} className={'flex flex-col'}>
                    <span key={index}
                          className={'flex items-center justify-center gap-1 mt-2 bg-slate-900 rounded-xl p-1 hover:scale-110 transition-all duration-500 hover:text-green-500 hover:cursor-pointer'}>
                        <AiFillInfoCircle size={'1rem'}/>{folder._id}</span>
                </div>)}
            </>
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (user) => <div className={'flex flex-col gap-4'}>
                {/*<Popconfirm title="Kullanıcıyı Sil"*/}
                {/*            description={*/}
                {/*                <div>*/}
                {/*                    <p className={'text-lg'}>{`${user.name} ${user.surname}`} silmek istediğinize emin*/}
                {/*                        misiniz?</p>*/}
                {/*                    <Alert className={'text-black max-w-md mt-2'} showIcon type={'error'}*/}
                {/*                           message={'Bu işlem geri alınamaz! Bunun yerine kullanıcıyı pasif hale getirebilirsiniz.'}/>*/}
                {/*                </div>*/}
                {/*            }*/}
                {/*            okText={'Evet'}*/}
                {/*            cancelText={'Hayır'}*/}
                {/*            placement={'left'}*/}
                {/*            onConfirm={() => console.log("sa")}>*/}
                {/*    <Button className={'delete-btn'}>Sil</Button>*/}
                {/*</Popconfirm>*/}
                <Button onClick={() => {
                    setUpdateUser(user);
                    setUserUpdateModalVis(true);
                }} className={'update-btn'}>Güncelle</Button>
            </div>
        }
    ]
    if (user.role !== "superadmin") return navigate('/');
    if (loading) return <Loading/>
    return (
        <>
            {drawerSettings.visible && (
                <UserDrawer drawerSettings={drawerSettings} setDrawerSettings={setDrawerSettings}/>
            )}
            <UserModal getUsers={getUsers} setUser={setUpdateUser} user={updateUser}
                       setUserUpdateModalVis={setUserUpdateModalVis}
                       userUpdateModalVis={userUpdateModalVis} roles={roles} statuses={statuses}/>
            <UserTable setUser={setUpdateUser} setUserUpdateModalVis={setUserUpdateModalVis} columns={columns}
                       users={users}/>
        </>

    );
}

export default User;
