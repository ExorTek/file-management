import React from 'react';
import UpdateUserModalContent from "./UpdateUserModalContent";
import {Modal} from "../../toolbox";
import {useWindowResize} from "../../hooks";

function UserModal({userUpdateModalVis, setUserUpdateModalVis, user, setUser, roles, statuses, getUsers}) {
    const {width} = useWindowResize();
    return <Modal width={width < 1024 ? '100%' : width < 1440 ? '60%' : '40%'} className={'user-update-modal'}
                  children={<UpdateUserModalContent userModalVis={userUpdateModalVis} getUsers={getUsers} setUserUpdateModalVis={setUserUpdateModalVis}
                                                    userUpdateModalVis={userUpdateModalVis} user={user}
                                                    setUser={setUser} roles={roles} statuses={statuses}/>}
                  visible={userUpdateModalVis} onCancel={() => {
        setUserUpdateModalVis(false);
        setUser({});
    }
    }/>

}

export default UserModal;
