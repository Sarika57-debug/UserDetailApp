import './index.css';

import { Form, Input, Table, Button, message } from 'antd';

import React from 'react';

import { apiCall } from '../../services/Api'


const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

class EditableCell extends React.Component {

    state = {
        editing: false,
    };
    //method triggered on clicking table cell

    toggleEdit = () => {


        const { editing } = this.state;
        const isEditing = !editing;

        this.setState({ editing: isEditing }, () => {
            if (isEditing) {
                this.input.focus();
            }
        });
    };

    //method triggered on focusout
    save = record => {
        try {
            this.form.validateFields((error, values) => {

                this.toggleEdit(record);
                this.props.handleSave({ ...this.props.record, ...values });
            });
        } catch (errInfo) {

        }
    };


    renderCell = (form) => {
        this.form = form;
        const { children, dataIndex } = this.props;
        const { editing } = this.state;

        return editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}

            >
                <Input
                    autoComplete="__away"
                    ref={(node) => {
                        this.input = node;
                    }}
                    onPressEnter={this.save}
                    onBlur={this.save}
                />
            </Form.Item>
        ) : (
                <div
                    className="editable-cell-value-wrap"

                    onClick={this.toggleEdit}
                >
                    {children}
                </div>
            );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                        children
                    )}
            </td>
        );
    }
}


class UserList extends React.Component {
    //coloumns fields
    columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            editable: true,


        },
        {
            title: 'Email',
            dataIndex: 'email',
            editable: true,


        },

    ];

    state = {
        importList: [],
        count: 2,


    };


    componentDidMount() {
        // method to call api
        apiCall(
            'https://jsonplaceholder.typicode.com/users', 'GET'
        ).then((response) => {
            this.setState({
                importList: response
            })


        });

    }
    //method triggered on clicking add button
    handleAdd = () => {

        const { count, importList } = this.state;
        const newData = {
            username: `Username ${count}`,
            email: `example ${count}@gmail.com`,
        };
        this.setState({
            importList: [...importList, newData],
            count: count + 1,
        });
        message.success('New User Added');

    };


    render() {
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };



        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });

        return (

            <div >
                {/* add new user button */}
                <Button
                    onClick={this.handleAdd}
                    type="primary"
                    className="button-style"
                >
                    Add New User
                 </Button>


                {/* user table */}
                <Table
                    columns={columns}
                    dataSource={this.state.importList}
                    components={components}
                    rowKey="id"
                    className="table-style"
                    rowClassName={() => 'editable-row'}
                    bordered />

            </div>
        );
    }
}

export default UserList;
