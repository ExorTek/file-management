import {useEffect, useState} from 'react';
import {Modal, Table} from "../toolbox";
import {AiFillDelete, AiFillInfoCircle} from "react-icons/ai";
import {Button, Drawer, Input, Popconfirm} from "antd";
import {toast} from "react-toastify";
import {createFolderFromApi, deleteFolderFromApi, getFoldersFromApi} from "../services";
import UserDrawerContent from "./Users/UserDrawerContent";
import {allowedSuperAdmin} from "../helper/other";
import {useSelector} from "react-redux";

function FoldersTable() {
    const [drawerSettings, setDrawerSettings] = useState({
        visible: false,
        user: null
    });
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addFolderModalVisible, setAddFolderModalVisible] = useState(false);
    const [folderName, setFolderName] = useState('');
    const {user: {role}} = useSelector(state => state.auth);

    const getFolders = () => {
        setLoading(true);
        getFoldersFromApi().then(({data}) => {
            setFolders(data);
            setLoading(false);
        }).catch((err) => {
            setLoading(false);
            toast.error('Klasörler alınamadı');
        })
    }
    const saveFolder = () => {
        if (!folderName) return toast.error('Lütfen klasör ismi giriniz.')
        setLoading(true);
        createFolderFromApi({name: folderName}).then(() => {
            setAddFolderModalVisible(false);
            toast.success('Klasör oluşturuldu');
            setFolderName('');
            getFolders();
        }).catch((err) => {
            setLoading(false);
            toast.error(err.response.data.message || 'Klasör oluşturulamadı');
        });
    }
    const deleteFolder = (id) => {
        deleteFolderFromApi(id).then(() => {
            setFolders(folders.filter((folder) => folder._id !== id));
            toast.success('Klasör silindi');
        }).catch((err) => {
            toast.error(err.response.data.message || 'Klasör silinemedi');
        });
    };
    const handleFolderName = (e) => setFolderName(e.target.value.replace(' ', '/').replace('//', '/').replace(/[^a-zA-Z0-9/]/g, '').toLowerCase());

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Creator',
            dataIndex: 'creator',
            key: 'creator',
            render: (creator) => <p onClick={() => setDrawerSettings({
                visible: true,
                user: creator
            })}
                                    className={'hover:scale-110 cursor-pointer flex items-center gap-2 transition-all duration-500 hover:text-green-500 justify-center'}>
                <AiFillInfoCircle size={'1rem'}/> {creator._id}
            </p>
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (createdAt) => ((new Date(createdAt)).toDateString() + " " + (new Date(createdAt)).toLocaleTimeString())
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
            render: (updatedAt) => ((new Date(updatedAt)).toDateString() + " " + (new Date(updatedAt)).toLocaleTimeString())

        },
        {
            title: 'Actions',
            key: 'actions',
            render: ({_id}) => <Popconfirm title="Klasörü Sil"
                                           description="Klasörü silmek istediğine emin misin?"
                                           okText={'Evet'}
                                           cancelText={'Hayır'}
                                           placement={'left'}
                                           onConfirm={() => deleteFolder(_id)}>
                <AiFillDelete className={'hover:text-red-500 hover:scale-110 transition-all text-2xl cursor-pointer'}/>
            </Popconfirm>

        }
    ].filter(item => role !== allowedSuperAdmin ? item.title !== 'Actions' : item);
    const ModalContent = (
        <div className={'flex flex-col gap-4 w-full justify-center items-center mt-6'}>
            <Input value={folderName} onChange={handleFolderName} placeholder={'Klasör İsmi'} className={'max-w-lg'}/>
            <Button onClick={saveFolder} className={'custom-button max-w-min'}>Kaydet</Button>
        </div>
    )
    useEffect(() => {
        getFolders();
        return () => {
            setFolders([]);
        }
    }, [])
    const tablePagination = {
        pageSize: 10,
        showSizeChanger: false,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    }
    const tableButtons = [
        {
            text: 'Yeni Klasör Ekle',
            className: 'custom-button',
            onClick: () => setAddFolderModalVisible(true),
            disabled: role !== allowedSuperAdmin
        }
    ]
    return (
        <>
            {drawerSettings.visible && (
                <Drawer title={`${drawerSettings.user.name} ${drawerSettings.user.surname}`}
                        placement="right" onClose={() => setDrawerSettings({
                    visible: false,
                    user: null
                })} open={drawerSettings.visible}>
                    <div className={'flex flex-col gap-2'}>
                        {Object.keys(drawerSettings.user).map((key, index) => (
                            <UserDrawerContent index={index} keys={key} value={drawerSettings.user[key]}/>
                        ))}
                    </div>
                </Drawer>
            )}
            <Modal title={'Klasör Ekle'} className={'folder-modal'} children={ModalContent}
                   visible={addFolderModalVisible}
                   onCancel={() => setAddFolderModalVisible(false)}/>
            <div className={'flex flex-col gap-4'}>
                <Table columns={columns} columnsData={folders} loading={loading} searchKeys={[
                    'name',
                    'creator._id',
                    'creator.name',
                    'creator.surname',
                    'creator.username',
                    'creator.status',
                    'creator.role'
                ]}
                       pagination={tablePagination}
                       buttons={tableButtons}
                />
            </div>
        </>
    );
}

export default FoldersTable;
