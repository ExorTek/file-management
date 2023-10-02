import React from 'react';
import {Table} from "../../toolbox";

function UserTable({users, setUserUpdateModalVis, columns, setUser}) {
    return <Table searchKeys={[
        'name',
        'surname',
        'username',
        'email',
        '_id',
        'status',
        'role'

    ]} buttons={[{
        text: 'Kullanıcı Ekle',
        onClick: () => {
            setUser({
                _id: 'new',
                name: '',
                surname: '',
                username: '',
                email: '',
                status: '',
                password: '',
                role: '',
                accessFolders: []
            });
            setUserUpdateModalVis(true);
        },
        className: 'custom-button'
    }
    ]} columnsData={users} columns={columns}/>
}

export default UserTable;
