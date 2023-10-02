import {useEffect, useState} from 'react';
import {Button, Card, Input, Select} from "antd";
import {createUserFromApi, getUserAccessFoldersFromApi, updateUserFromApi} from "../../services";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {toast} from "react-toastify";
import {Loading} from "../../toolbox";

function UpdateUserModalContent({user, setUser, roles, statuses, setUserUpdateModalVis, getUsers}) {
    const notShow = ['createdAt', 'updatedAt', ''];
    const [loading, setLoading] = useState(false);
    const [userDoesntAccessFolders, setUserDoesntAccessFolders] = useState([]);
    const [userAccessFolders, setUserAccessFolders] = useState([]);
    const getUserFolders = () => {
        setLoading(true);
        getUserAccessFoldersFromApi(user._id).then(({data}) => {
            setUserDoesntAccessFolders(data.doesntAccess || data || []);
            setUserAccessFolders(data.access || []);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            toast.error(err?.response?.data?.message || 'get user folders error')
        });
    }
    useEffect(() => {
        getUserFolders();
        return () => {
            setUserDoesntAccessFolders([]);
        }
    }, []);
    const onDragEnd = (result) => {
        if (!result.destination) return false;
        const {source, destination} = result;
        const doesntAccess = [...userDoesntAccessFolders];
        const access = [...userAccessFolders];
        if (source.droppableId === 'doesntAccess' && destination.droppableId === 'access') {
            doesntAccess.splice(source.index, 1);
            access.splice(destination.index, 0, userDoesntAccessFolders[source.index]);
        }
        if (source.droppableId === 'access' && destination.droppableId === 'doesntAccess') {
            access.splice(source.index, 1)
            doesntAccess.splice(destination.index, 0, userAccessFolders[source.index])
        }
        setUserDoesntAccessFolders(doesntAccess)
        setUserAccessFolders(access);
    }
    const saveUser = () => {
        setLoading(true);
        const clearMethod = () => {
            setLoading(false);
            setUserUpdateModalVis(false);
            setUser({});
            getUsers();
        }
        user.accessFolders = userAccessFolders.map(folder => folder._id);
        delete user.updatedAt;
        if (user._id === 'new') {
            delete user._id;
            return createUserFromApi(user).then(({data}) => {
                toast.success('Kullanıcı oluşturuldu');
                clearMethod();
            }).catch(err => {
                toast.error(err?.response?.data?.message || 'create user error')
                clearMethod();
            });
        }
        updateUserFromApi(user).then(({data}) => {
            toast.success('Kullanıcı güncellendi');
            clearMethod();
        }).catch(err => {
            toast.error(err?.response?.data?.message || 'update user error')
            clearMethod();
        });
    }
    const handleUserInput = (e, key) => setUser(prevState => ({...prevState, [key]: e.target.value}));
    if (!user || loading) return <Loading/>;
    return (
        <div className={'user-edit flex flex-col gap-4'}>
            {Object.keys(user).map((key, index) => {
                const upperKey = `${key.charAt(0).toUpperCase()}${key.substring(1)}`
                if (notShow.includes(key)) return <></>;
                if (key === '_id' && user[key] === 'new') return <></>;
                if (key === 'role') return <div className={'w-full flex flex-row gap-4 items-center'}>
                    <label className={'font-bold w-20 inline-block text-right'}>
                        {upperKey}
                    </label>
                    <Select className={'w-full'} onChange={(value) => setUser(
                        {...user, role: value}
                    )}  value={user.role} options={roles}/>

                </div>
                if (key === 'status') return <div className={'w-full flex flex-row gap-4 items-center'}>
                    <label className={'font-bold w-20 inline-block text-right'}>
                        {upperKey}
                    </label>
                    <Select className={'w-full'} onChange={(value) => setUser(
                        {...user, status: value}
                    )} value={user.status} options={statuses}/>
                </div>
                if (key === 'accessFolders') return <div className={'flex gap-1'}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId={'doesntAccess'}>
                            {(provided) => (
                                <Card title={'Erişimi Olmayan Klasörler'} className={'w-1/2 overflow-x-auto'}
                                      ref={provided.innerRef} {...provided.droppableProps}>
                                    {userDoesntAccessFolders.map((folder, index) => (
                                        <Draggable key={folder._id} draggableId={folder._id} index={index}>
                                            {(provided) => (
                                                <div className={'border p-2 rounded-xl w-full bg-red-600 text-white'}
                                                     ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    {folder.name}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Card>
                            )}
                        </Droppable>
                        <Droppable droppableId={'access'}>
                            {(provided) => (
                                <Card title={'Erişimi Olan Klasörler'} className={'w-1/2 overflow-x-auto'}
                                      ref={provided.innerRef} {...provided.droppableProps}>
                                    {userAccessFolders.map((folder, index) => (
                                        <Draggable key={folder._id} draggableId={folder._id} index={index}>
                                            {(provided) => (
                                                <div className={'border p-2 rounded-xl w-full bg-green-600 text-white'}
                                                     ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    {folder.name}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Card>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                return <div className={'w-full flex flex-row gap-4  items-center'}>
                    <label className={'font-bold w-20 inline-block text-right'}>
                        {upperKey}
                    </label>
                    <Input value={user[key]} className={'font-normal w-full'} onChange={(e) => handleUserInput(e, key)}
                           disabled={key === '_id'}/>
                </div>
            })}
            <div className={'flex justify-center items-center'}>
                <Button onClick={saveUser}
                        className={'custom-button max-w-lg hover:scale-110 transition-all duration-300 w-fit'}>{user._id === 'new' ? 'Kaydet' : 'Güncelle'}</Button>
            </div>
        </div>
    );
}

export default UpdateUserModalContent;
