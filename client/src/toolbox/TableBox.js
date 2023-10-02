import {Button, Input, Table} from "antd";
import {AiOutlineLoading3Quarters, AiOutlineSearch} from "react-icons/ai";
import {useEffect, useState} from "react";

function TableBox({
                      columns,
                      columnsData,
                      className,
                      align,
                      pagination,
                      scroll,
                      loading,
                      buttons = [],
                      searchKeys = [],
                      hideSearch
                  }) {
    const [data, setData] = useState([]);
    const [unchangedData, setUnchangedData] = useState([]);
    const filterColumns = (e) => {
        const {target: {value}} = e;
        const tempList = Object.assign([], unchangedData);
        if (!value) return setData(tempList);
        let [keys, objectKeys] = [[], []];
        searchKeys.forEach((key) => key.includes('.') ? objectKeys.push(key) : keys.push(key));
        const filteredData = tempList.filter((item) => {
            let flag = false;
            keys.forEach((key) => {
                if (item[key].toString().toLowerCase().indexOf(value) !== -1) flag = true;
            });
            objectKeys.forEach((key) => {
                const [objectKey, objectValue] = key.split('.');
                if (item[objectKey][objectValue].toString().toLowerCase().indexOf(value) !== -1) flag = true;
            });
            return flag;
        });
        setData(filteredData);
    };
    useEffect(() => {
        setData(columnsData);
        setUnchangedData(columnsData);
    }, [columnsData]);
    return (
        <div className={'flex flex-col gap-2'}>
            {!hideSearch && (
                <div className={'flex justify-between items-center overflow-auto'}>
                    <div className={'w-full h-8 max-w-sm flex items-center justify-center bg-white rounded-xl'}>
                        <Input onChange={filterColumns}
                               className={'w-full h-full p-2 rounded-xl text-slate-900 border-none focus:border-none'}
                               placeholder={'...'}/>
                        <AiOutlineSearch
                            className={'text-slate-800 rounded-xl hover:scale-110 transition-all duration-500 hover:text-blue-700 h-full'}
                            size={'2rem'}/>
                    </div>
                    {buttons.length > 0 && <div className={'flex gap-3'}>
                        {buttons.map((button, index) =>
                            <Button key={index} disabled={button.disabled} onClick={button.onClick}
                                    className={`${button.className} mr-4`}>{button.text}</Button>
                        )}
                    </div>}
                </div>
            )}
            <Table
                className={className}
                columns={columns}
                dataSource={data}
                align={align}
                pagination={pagination || false}
                scroll={scroll}
                loading={{
                    spinning: loading || false,
                    indicator: <AiOutlineLoading3Quarters className={'animate-spin'}/>,
                    size: 'large'
                }}
            />
        </div>
    );
}

export default TableBox;
