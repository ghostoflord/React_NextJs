import { useEffect, useState } from 'react';
// import '../../styles/users.css';
import { Table, Button, notification, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import CreateUserModal from './create.user.model';
import UpdateUserModal from './update.user.model';
export interface IUsers {
    _id: string;
    email: string;
    name: string;
    role: string;
    address: string;
    gender: string;
    password: string;
    age: string;
}

const UsersTable = () => {

    const [listUsers, setListUsers] = useState([]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const [dataUpdate, setDataUpdate] = useState<null | IUsers>(null);


    const access_token = localStorage.getItem("access_token") as string;


    useEffect(() => {
        //update
        getData()
    }, [])

    //Promise
    const getData = async () => {

        const res = await fetch(
            "http://localhost:8000/api/v1/users/all",
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
            })

        const d = await res.json();
        if (!d.data) {
            notification.error({
                message: JSON.stringify(d.message)
            })
        }
        setListUsers(d.data.result)
    }

    const confirm = async (user: IUsers) => {
        const res = await fetch(
            `http://localhost:8000/api/v1/users/${user._id}`,
            {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
            })

        const d = await res.json();
        if (d.data) {
            notification.success({
                message: "Xóa user thành công."
            })
            await getData();
        } else {
            notification.error({
                message: JSON.stringify(d.message)
            })
        }
    };

    const columns: ColumnsType<IUsers> = [
        {
            title: 'Email',
            dataIndex: 'email',
            render: (value, record) => {
                return (<div>{record.email}</div>)
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
        {
            title: 'Actions',
            render: (value, record) => {

                return (
                    <div>
                        <button onClick={() => {
                            setDataUpdate(record);
                            setIsUpdateModalOpen(true)
                        }}>Edit</button>

                        <Popconfirm
                            title="Delete the user"
                            description={`Are you sure to delete this user. name = ${record.name}?`}
                            onConfirm={() => confirm(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                style={{ marginLeft: 20 }}
                                danger>
                                Delete
                            </Button>
                        </Popconfirm>
                    </div>)
            }
        }
    ]



    return (
        <div>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <h2>Table Users</h2>
                <div>
                    <Button
                        icon={<PlusOutlined />}
                        type={"primary"}
                        onClick={() => setIsCreateModalOpen(true)}
                    >Add new</Button>
                </div>

            </div>

            <Table
                columns={columns}
                dataSource={listUsers}
                rowKey={"_id"}
            />

            <CreateUserModal
                access_token={access_token}
                getData={getData}
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
            />

            <UpdateUserModal
                access_token={access_token}
                getData={getData}
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </div>
    )
}

export default UsersTable;