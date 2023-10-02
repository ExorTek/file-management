import React from 'react';
import {Modal} from "antd";

function ModalBox({
                      className = '',
                      width = '50%',
                      title = 'Modal',
                      visible = true,
                      footer = [],
                      children = <></>,
                      onCancel = () => void null,
                      onOk = () => void null,
                      okText = '',
                      cancelText = '',
                      closeIcon
                  }) {
    return <Modal className={className} width={width} title={title} open={visible} footer={footer} children={children}
                  onCancel={onCancel} cancelText={cancelText} onOk={onOk} okText={okText} closeIcon={closeIcon}/>
}

export default ModalBox;
