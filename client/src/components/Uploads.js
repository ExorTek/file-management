import {Alert, Input, Popconfirm, Select, Upload} from "antd";
import React, {useEffect, useState} from "react";
import {AiFillDelete, AiOutlineLoading3Quarters} from "react-icons/ai";
import {Loading, Modal, Table} from "../toolbox";
import {toast} from "react-toastify";
import {bytesToSize} from "../helper/file";
import {RiUploadCloudFill} from "react-icons/ri";
import {checkFileNameFromApi, getFoldersByAccessFromApi, uploadFromApi} from "../services";
import {MdContentCopy} from "react-icons/md";

const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve({
        id: file.uid,
        src: reader.result,
        name: file.name.split('.')[0],
        type: file.type,
        videoSrc: '',
        size: bytesToSize(file.size),
    });
    reader.onerror = (error) => reject(error);
});
const getVideoThumbnail = (file) => new Promise((resolve, reject) => {
    try {
        const videoSrc = URL.createObjectURL(file);
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        document.body.appendChild(canvas);
        document.body.appendChild(video);
        video.src = videoSrc;
        video.currentTime = 5;
        video.onloadeddata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL();
            resolve({
                id: file.uid,
                src: dataURL,
                name: file.name.split('.')[0],
                type: file.type,
                videoSrc,
                size: bytesToSize(file.size),
            });
        }
        document.body.removeChild(video);
        document.body.removeChild(canvas);
    } catch (e) {
        reject(e);
    }
});

function Uploads() {
    const [files, setFiles] = useState([]);
    const [previewFiles, setPreviewFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewFile, setPreviewFile] = useState({
        src: '',
        type: '',
        name: '',
        videoSrc: '',
    });
    const [fileNames, setFileNames] = useState([]);
    const [accessedFolders, setAccessedFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);

    const getAccessedFolders = () => {
        setLoading(true);
        getFoldersByAccessFromApi().then(({data}) => {
            setAccessedFolders(data);
            setLoading(false);
        }).catch(err => {
            toast.error(err.response.data.message || 'get folders error');
            setLoading(false);
        });
    }

    const upload = (id) => {
        setUploadLoading(true);
        if (!files.length) return toast.error('Lütfen en az bir dosya seçiniz.');
        const fileName = fileNames.find(f => f.id === id).name.split('.')[0];
        if (!fileName) return toast.error('Lütfen dosya adını giriniz.');
        if (fileName.length < 6) return toast.error('Dosya adı en az 6 karakter olmalıdır.');
        const file = files.find(file => file.uid === id);
        const folderName = accessedFolders.find(folder => folder._id === selectedFolder).name;
        uploadFromApi(fileName, selectedFolder, folderName, file).then(({data}) => {
            toast.success('Dosya başarıyla yüklendi.');
            setFiles(files.filter(file => file.uid !== id));
            setPreviewFiles(previewFiles.filter(file => file.id !== id));
            setFileNames(fileNames.filter(file => file.id !== id));
            setUploadLoading(false);
        }).catch((err) => {
            toast.error(err.response.data.message || 'upload error');
            setUploadLoading(false);
        });
    }
    const handleChange = async (file) => {
        toast.warn('Dosyayı yüklemeden önce linkini kopyalamayı unutma 🤨', {
            position: 'top-center',
        });
        setLoading(true);
        files.length === 6 && setFiles(files.slice(1));
        setFiles(prevState => [...prevState, file]);
        setFileNames(prevState => [...prevState, {id: file.uid, name: file.name}]);
        if (file.type.includes('image')) await getBase64(file).then((result) => setPreviewFiles(prevState => [...prevState, result]));
        if (file.type.includes('video')) await getVideoThumbnail(file).then((result) => setPreviewFiles(prevState => [...prevState, result]));
        setLoading(false);
        return false;
    };
    const deleteFile = (id) => {
        setFiles(prevState => prevState.filter(file => file.uid !== id));
        setPreviewFiles(prevState => prevState.filter(file => file.id !== id));
    };
    const handleFolderChange = (value) => setSelectedFolder(value);


    const onCancelPreview = () => [setPreviewVisible(false), setPreviewFile({
        src: '',
        type: '',
        name: '',
        videoSrc: '',
    })]
    const handlePreview = (src, type, name, videoSrc) => [setPreviewFile({
        src,
        type,
        name,
        videoSrc
    }), setPreviewVisible(true)];
    const changeFileName = (id, name) => setFileNames(prevState => [...prevState.filter(file => file.id !== id), {
        id,
        name: name.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '')
    }])
    const columns = [
        {
            title: 'Dosya',
            key: 'file',
            render: ({src, type, name, videoSrc}) => <img onClick={() => handlePreview(src, type, name, videoSrc)}
                                                          src={src} alt="preview"
                                                          className={'w-full max-w-[10rem] hover:cursor-pointer hover:scale-110 transition-all mx-auto'}/>
        },
        {
            title: 'Dosya Adı',
            key: 'name',
            render: (row) => <div>
                <Input value={fileNames.find(name => name.id === row.id)?.name?.split('.')[0] || ''} type={'text'}
                       onChange={({target}) => changeFileName(row.id, target.value)}/>

            </div>
        },
        {
            title: 'Dosya Türü',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Dosya Boyutu',
            dataIndex: 'size',
            key: 'size',
            render: (size) => <span>{size}</span>
        },
        {
            title: 'Actions',
            key: 'delete',
            render: ({id}) => <div className={'flex justify-around'}>
                {uploadLoading ? <AiOutlineLoading3Quarters className={'text-4xl text-[#1677ff] animate-spin'}/> : (
                    <>
                        <RiUploadCloudFill
                            className={'hover:text-green-500 hover:scale-110 transition-all text-4xl hover:cursor-pointer'}
                            onClick={() => upload(id)}/>
                        <Popconfirm title="Dosyayı Sil"
                                    description="Dosyayı silmek istediğine emin misin?"
                                    okText={'Evet'}
                                    cancelText={'Hayır'}
                                    placement={'left'}
                                    onConfirm={() => deleteFile(id)}>
                            <AiFillDelete
                                className={'hover:text-red-500 hover:scale-110 transition-all text-4xl hover:cursor-pointer'}
                            />
                        </Popconfirm>
                    </>
                )}
            </div>
        },
        {
            title: 'Link',
            render: (row) => {
                const link = `https://d2lhoncdvyvj95.cloudfront.net/${accessedFolders.find(folder => folder._id === selectedFolder).name}/${row.name}.${row.type.split('/')[1]}`
                return <p
                    className={'cursor-pointer flex items-center gap-1 hover:text-green-500 hover:scale-105 transition-all duration-300'}
                    onClick={() => navigator.clipboard.writeText(link).then(() => toast('Link kopyalandı. 😇', {
                        position: 'top-center',
                    }))}><MdContentCopy size={'1.8rem'}/>{link}</p>
            }
        }
    ]
    const UploadButton = (
        <div
            className={'p-2 rounded-xl transition-all duration-300 hover:scale-105 bg-[#1677ff]'}>
            <div className={'text-slate-100'}>
                Dosya Seç (Max 6)
            </div>
        </div>
    )
    useEffect(() => {
        getAccessedFolders();
        return () => {
            setAccessedFolders([]);
        };
    }, []);
    useEffect(() => {
        if (uploadLoading) window.addEventListener('beforeunload', (event) => {
            event.preventDefault();
            event.returnValue = '';
        });
    }, [uploadLoading]);
    if (loading) return <Loading/>
    return (
        <div className={'w-full flex flex-col items-center gap-8'}>
            {!selectedFolder ? <div className={'flex gap-2 w-full items-center justify-center m-10'}>
                <span>Klasör</span>
                <Select
                    className={'w-full max-w-sm'}
                    showSearch
                    placeholder="Klasör Seç (Zorunlu)"
                    optionFilterProp="children"
                    onChange={handleFolderChange}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    value={selectedFolder}
                    options={accessedFolders.map(folder => ({value: folder._id, label: folder.name}))}
                />
            </div> : <>
                <div
                    className={'border p-4 rounded-xl flex flex-col gap-2'}>
                    <p className={'bg-slate-600 p-2 rounded-xl'}>
                        Dosyaların Yükleneceği Klasör
                    </p>
                    <p className={'bg-blue-600 p-2 rounded-xl w-fit mx-auto'}>
                        {accessedFolders.find(folder => folder._id === selectedFolder).name}
                    </p>
                </div>
                <Upload
                    accept={'image/*, video/*'}
                    beforeUpload={handleChange}
                    fileList={null}
                    multiple
                    maxCount={6}
                >
                    {files.length >= 6 ? null : UploadButton}
                </Upload>
                <Alert type={'info'} showIcon
                       message={'Seçmiş olduğunuz görsellerin doğruluğundan emin olun. Link`i görseli yüklemeden hemen önce kopyalayın. Tablo`da bulunan "Dosya Adı" kısmından dosyanıza isim verin. Ardından "Actions" kısmından dosyanızı upload edin.'}/>

                <div className={'w-full'}>
                    <Table hideSearch className={''} columns={columns} columnsData={previewFiles}
                           loading={loading}/>
                </div>
            </>}
            <Modal visible={previewVisible} onCancel={onCancelPreview} footer={[
                <button onClick={onCancelPreview}
                        className={'bg-red-600 p-2 text-white rounded-xl hover:scale-110 transition-all'}>Kapat</button>
            ]} closeIcon={null} title={previewFile.name}>
                {previewFile.type.match(/video/) ?
                    <video src={previewFile.videoSrc} controls autoPlay className={'w-full'}/> :
                    <img src={previewFile.src} alt={previewFile.name} className={'w-full'}/>}
            </Modal>
        </div>
    );
}

export default Uploads;
