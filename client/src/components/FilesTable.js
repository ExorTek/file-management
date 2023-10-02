import React, {useEffect, useState} from 'react';
import {Loading, Modal, Table} from "../toolbox";
import {toast} from "react-toastify";
import {MdContentCopy} from "react-icons/md";
import {bytesToSize} from "../helper/file";
import {AiFillDelete, AiFillInfoCircle} from "react-icons/ai";
import {deleteFileFromApi, getFilesFromApi} from "../services";
import {Drawer, Popconfirm} from "antd";
import Uploads from "./Uploads";
import UserDrawerContent from "./Users/UserDrawerContent";
import {allowedSuperAdmin} from "../helper/other";
import {useWindowResize} from "../hooks";
import {useSelector} from "react-redux";

function FilesTable() {
    const [files, setFiles] = useState({});
    const [page, setPage] = useState(1);
    const [drawerSettings, setDrawerSettings] = useState({
        visible: false,
        user: null
    });
    const [loading, setLoading] = useState(false);
    const [uploadModal, setUploadModal] = useState(false);
    const {width} = useWindowResize();
    const {user: {role}} = useSelector(state => state.auth);
    const getFiles = () => {
        setLoading(true);
        getFilesFromApi(page).then(({data}) => {
            setFiles(data)
            setLoading(false)
        }).catch(e => toast.error(e.response?.data?.message || 'get files error'))
    }
    const deleteFile = (id) => {
        setLoading(true);
        deleteFileFromApi(id).then(({data}) => {
            getFiles()
        }).catch(e => {
            setLoading(false)
            toast.error(e.response?.data?.message || 'delete file error')
        })
    };

    const copyClipboard = (text) => navigator.clipboard.writeText(text).then(() => toast.success('Copied')).catch(() => toast.error('Failed to copy'));
    let columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span
                className={'hover:cursor-pointer hover:scale-105 transition-all duration-500 flex items-center gap-2 justify-center'}
                onClick={() => copyClipboard(text)}>
                {text}<MdContentCopy/>
            </span>
        },
        {
            title: 'Original Name',
            dataIndex: 'originalName',
            key: 'originalName',
        },
        {
            title: 'AWS Location',
            dataIndex: 'location',
            key: 'location',
            render: (text) => <span
                className={'hover:cursor-pointer hover:scale-105 transition-all duration-500 flex items-center gap-2 justify-center'}
                onClick={() => copyClipboard(text)}>
                {text}<MdContentCopy/>
            </span>
        },
        {
            title: 'AWS Bucket',
            dataIndex: 'bucket',
            key: 'bucket',
        },
        {
            title: 'Mime Type',
            dataIndex: 'mimType',
            key: 'mimType',
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            render: (size) => <span>{bytesToSize(size)}</span>
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
            title: 'Actions',
            render: ({_id}) => <Popconfirm title="Dosyayı Sil"
                                           description="Dosyayı silmek istediğine emin misin?"
                                           okText={'Evet'}
                                           cancelText={'Hayır'}
                                           placement={'left'}
                                           onConfirm={() => deleteFile(_id)}>
                <AiFillDelete className={'hover:text-red-500 hover:scale-110 transition-all text-2xl'}/>
            </Popconfirm>

        }
    ].filter(item => role !== allowedSuperAdmin ? item.title !== 'Actions' : item);
    useEffect(() => {
        getFiles()
        return () => {
            setFiles([]);
        }
    }, [page]);
    if (loading) return <Loading/>
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
                            <UserDrawerContent keys={key} value={drawerSettings.user[key]}/>
                        ))}
                    </div>
                </Drawer>
            )}
            <Modal width={width < 1024 ? '100%' : '80%'} className={'files-modal'} title={'Dosya Ekle'}
                   visible={uploadModal}
                   onCancel={() => setUploadModal(false)} children={<Uploads/>}/>
            <Table buttons={[
                {
                    text: 'Yeni Dosya Ekle',
                    onClick: () => setUploadModal(true),
                    className: 'custom-button hover:scale-100',
                    disabled: role !== allowedSuperAdmin
                }
            ]} searchKeys={[
                'name',
                'originalName',
                'bucket',
                'mimType',
            ]} pagination={{
                current: page,
                total: files.total || 0,
                onChange: (page) => setPage(page),
                onShowSizeChange: (current, size) => setPage(current),
                showSizeChanger: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }} className={'w-full'} columns={columns} columnsData={files.data} loading={loading}/>
        </>
    );
}

export default FilesTable;
