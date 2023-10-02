import React from 'react';
import {Drawer} from "antd";
import UserDrawerContent from "./UserDrawerContent";

function UserDrawer({drawerSettings, setDrawerSettings}) {
    return (
        <Drawer title={`${drawerSettings.folder._id}`}
                placement="right" onClose={() => setDrawerSettings({
            visible: false,
            user: null
        })} open={drawerSettings.visible}>
            <div className={'flex flex-col gap-2'}>
                {Object.keys(drawerSettings.folder).map((key, index) => (
                    <UserDrawerContent keys={key} value={drawerSettings.folder[key]}/>
                ))}
            </div>
        </Drawer>
    );
}

export default UserDrawer;
