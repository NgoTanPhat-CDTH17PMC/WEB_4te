import React from 'react';
import Constants from "Constants";
import showToast from "showToast";
import moment from "moment";
import { Form, Icon, Input, Button, Select, Modal, Tooltip, Table, DatePicker, InputNumber } from 'antd';
import getAllCustomerPlanAPI from "../../../../api/getAllCustomerPlan";
import createCustomerPlanAPI from "../../../../api/createCustomerPlanAPI";
import deleteCustomerPlanAPI from "../../../../api/deleteCustomerPlanAPI";
import updateCustomerPlanAPI from "../../../../api/updateCustomerPlanAPI";
import getCustomerPlanById from '../../../../api/getCustomerPlanById';
import accessRightAPI from "../../../../api/accessRightAPI";
const { Option } = Select;
const { TextArea } = Input;

const initialState = {
    id: "",
    month: "",
    year: "",
    quantity: "",
    note: "",
};

const initialState01 = {};

class PlanCustomer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customerGasPlan: [],
            isLoading: false,
            checkEdit: false,
            object: {
                id: "",
                quantity: "",
                month: "",
                year: "",
                // complete: "",
                note: ""
            },
            errors: {
                id: "",
                quantity: "",
                month: "",
                year: "",
                // complete: "",
                note: "",
            }
        }
        this.refresh = this.refresh.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.editPlanCustomer = this.editPlanCustomer.bind(this);
        this.handleBlurPicker = this.handleBlurPicker.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
        this.onChangeDatePicker = this.onChangeDatePicker.bind(this);
        this.getAllCustomerPlan = this.getAllCustomerPlan.bind(this);
        this.deletePlanCustomer = this.deletePlanCustomer.bind(this);
    }

    async componentDidMount() {
        await this.getAllCustomerPlan();
    }

    async componentWillReceiveProps() {
        this.setState({
            checkEdit: false,
            object: initialState,
            errors: initialState
        })
        // await this.accessRight(["createCustomerGasPlan","updateCustomerGasPlan","deleteCustomerGasPlan"])
    }

    /* ==================================================== /API =============================================*/

    async getCustomerGasPlanById(id) {
        this.setState({ isLoading: true })
        const customerGasPlan = await getCustomerPlanById(id);
        if (customerGasPlan) {
            // console.log("customerGasPlan", customerGasPlan)
            if (customerGasPlan.status === Constants.HTTP_SUCCESS_BODY) {
                this.setState({
                    customerGasPlan: customerGasPlan.data,
                    isLoading: false
                });
            } else {
                showToast(customerGasPlan.data.message, 2000)
                this.setState({ isLoading: false })
            }
        } else {
            showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u!");
            this.setState({ isLoading: false })
        }
        return false;
    }

    getAllCustomerPlan = async () => {
        this.setState({ isLoading: true })
        const listCustomerPlan = await getAllCustomerPlanAPI();
        if (listCustomerPlan) {
            // console.log("listCustomerPlan", listCustomerPlan)
            if (listCustomerPlan.status === Constants.HTTP_SUCCESS_BODY) {
                this.setState({
                    listCustomerPlan: listCustomerPlan.data,
                    isLoading: false
                });
            } else {
                showToast(listCustomerPlan.data.message, 2000)
                this.setState({ isLoading: false })
            }
        } else {
            showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u!");
            this.setState({ isLoading: false })
        }
        return false;
    }


    deletePlanCustomer = async (id) => {
        let result = await deleteCustomerPlanAPI(id)
        if (result) {
            if (result.status === Constants.HTTP_SUCCESS_BODY) {
                showToast("H???y k??? ho???ch th??nh c??ng!", 2000);
                this.refresh();
                return true;
            } else {
                showToast(
                    result.data.message ? result.data.message : result.data.err_msg,
                    2000
                );
                return false;
            }
        } else {
            showToast("X???y ra l???i trong qu?? tr??nh h???y");
            return false;
        }
    }

    async createCustomerGasPlan(month, year, note, quantity, customerGasId) {
        const createCustomerGasPlan = await createCustomerPlanAPI(month, year, note, quantity, customerGasId);
        if (createCustomerGasPlan) {
            console.log(createCustomerGasPlan)
            if (createCustomerGasPlan.data.status === true) {
                showToast('T???o m???i th??nh c??ng!', 2000);
                this.refresh();
            }
            else {
                // this.onCheckCreate(false);
                showToast(
                    createCustomerGasPlan.data.message
                        ? createCustomerGasPlan.data.message
                        : createCustomerGasPlan.data.err_msg,
                    2000
                );
            }
        } else {
            showToast("X???y ra l???i trong qu?? tr??nh th??m d??? li???u!");
            // this.onCheckCreate(false);
        }
    }

    async updateCustomerGasPlan(customerGasId, id, month,year, quantity, note) {
        const updateCustomerGasPlan = await updateCustomerPlanAPI(customerGasId, id, month,year, quantity, note);
        if (updateCustomerGasPlan) {
            console.log(updateCustomerGasPlan)
            if (updateCustomerGasPlan.data.status === true) {
                showToast('C???p nh???t th??nh c??ng!', 2000);
                this.refresh();
            }
            else {
                if (updateCustomerGasPlan.data.message === "L???i update!") {
                    showToast("Th??ng trong n??m ???? b??? tr??ng!", 2000)
                }
                else {
                    showToast(
                        updateCustomerGasPlan.data.message
                            ? updateCustomerGasPlan.data.message
                            : updateCustomerGasPlan.data.err_msg,
                        2000
                    );
                }
                // this.onCheckCreate(false);
            }
        } else {
            showToast("X???y ra l???i trong qu?? tr??nh th??m d??? li???u!");
            // this.onCheckCreate(false);
        }
    }

    async accessRight(actionNameArray) {
        let controllerName = window.location.hash.replace("#/","")
        for (let actionName of actionNameArray) {
            const accressRight = await accessRightAPI(actionName,controllerName);
            if (accressRight) {
                if (accressRight.data.success === true) {
                    console.log(actionName,true)
                    $("[name='"+actionName+"']").css("display","inline")
                }
            } else {
                showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u!");
            }
        }
    }

    /* ==================================================== /API =============================================*/


    /* ==================================================== Another Function =============================================*/

    async editPlanCustomer(customer) {
        const modalDOM = ReactDOM.findDOMNode(this.modal);
        modalDOM.scrollTop = 0
        this.setState(prevState => ({
            errors: initialState01,
            checkEdit : true,
            object: {
                id: customer.id,
                quantity: customer.quantity,
                month: customer.month,
                year: customer.year,
                note: customer.note
            }
        }));
    }

    refresh = async () => {
        this.getAllCustomerPlan();
        this.setState({
            checkEdit: false,
            object: {
                id: "",
                quantity: "",
                month: "",
                note: "",
                year: ""
            },
            errors: {
                quantity: "",
                month: "",
                note: "",

            },
        })
    }

    onChangeDatePicker(date, dateString) {
        const month_year = dateString.split('-');
        this.setState(prevState => ({
            object: { ...prevState.object, month: month_year[0], year: month_year[1] }
        }));
    }

    onChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            object: { ...prevState.object, [name]: value }
        }));
    };

    OnChangeOption = (value) => {
        this.setState(prevState => ({
            object: { ...prevState.object, month: value }
        }));
    };

    handleBlur = (e) => {
        const { name, value } = e.target;
        const error = this.validate(name, value);
        const state = this.state;
        this.setState(
            {
                errors: {
                    ...state.errors,
                    [name]: error,
                },
            }
        );
    };

    handleBlurOption = (value) => {
        const name = "month"
        const error = this.validate(name, value);
        const state = this.state;
        this.setState(
            {
                errors: {
                    ...state.errors,
                    month: error,
                },
            },
            () => { }
        );
    }

    handleBlurPicker = (e) => {
        let value = this.state.object.month;
        const error = this.validate(name = "month", value);
        const state = this.state;
        this.setState(
            {
                errors: {
                    ...state.errors,
                    [name]: error,
                },
            },
            () => { }
        );
    };

    validate = (name, value) => {
        if (name === "quantity") {
            if (!value) {
                return "Kh???i l?????ng kh??ng ???????c ????? tr???ng!"
            }
            if(value && Number(value) < 1){
                return "Kh???i l?????ng ph???i l???n h??n ho???c b???ng 1"
            }
        }

        if (name === "note") {
            if (!value) {
                return "Ghi ch?? kh??ng ???????c ????? tr???ng!"
            }
        }

        if (name === "month") {
            if (!value || value === "Th??ng") {
                return "Th???i gian kh??ng ???????c ????? tr???ng!"
            }
        }
    };

    onSubmit = async (e) => {
        e.preventDefault();
        let { month, year, quantity, note, id } = this.state.object;
        let { customerGasId } = this.props;
        let hasError = false;
        for (let key in this.state.object) {
            const erorr = this.validate(key, this.state.object[key]);
            if (erorr) {
                const state = this.state;
                this.setState((state) => {
                    return {
                        errors: {
                            ...state.errors,
                            [key]: erorr,
                        },
                    };
                });
                hasError = true;
            }
        }
        if (hasError) {
            showToast("Vui l??ng ki???m tra l???i th??ng tin!", 1000);
        } else {
            if (id) {
                await this.updateCustomerGasPlan(customerGasId, id, month, year, quantity, note)
            } else {
                await this.createCustomerGasPlan(month, year, note, quantity, customerGasId);
            }
        }

    }

    showDeleteConfirm(record) {
        // e.preventDefault();
        Modal.confirm({
            zIndex: 10000,
            title: 'X??c nh???n h???y?',
            content: <span style={{ color: 'black' }}>{"Th??ng: " + record.month + "/" + record.year + " - Kh???i l?????ng: " + record.quantity + " t???n"}</span>,
            okText: 'X??c nh???n',
            okType: 'danger',
            cancelText: 'T??? ch???i',
            onOk: () => {
                this.deletePlanCustomer(record.id)
            },
            onCancel() {
            },
        });

    }

    /* ==================================================== Another Function =============================================*/

    render() {
        const { listCustomerPlan } = this.state;
        const { quantity, note, id } = this.state.object
        const { customerGasId } = this.props;
        const monthFormat = "MM-YYYY";
        let month = String(this.state.object.month);
        let year = String(this.state.object.year);
        let month_data = month ? (month.length == 1 ? String(0).concat(month) : month.concat("-", year)) : "";
        const showCustomerPlan = listCustomerPlan ? listCustomerPlan.filter(customerPlan => customerPlan.customerGasId === customerGasId) : null

        const columns = [
            {
                title: 'STT',
                key: "index",
                align: 'center',
                width: 100,
                render: (text, record, index) => <div style={{ color: 'black' }}>{index + 1}</div>,
                // fixed: 'left'
            },
            {
                title: 'Th??ng',
                align: 'center',
                dataIndex: 'month',
                width: 100,
                render: text => <div style={{ color: 'black', fontSize: '14px' }}>{text}</div>,
                // fixed: 'left'
            },
            {
                title: 'N??m',
                align: 'center',
                dataIndex: 'year',
                width: 100,
                render: text => <div style={{ color: 'black', fontSize: '14px' }}>{text}</div>,
                // fixed: 'left'
            },
            {
                title: 'Kh???i l?????ng (t???n)',
                align: 'center',
                dataIndex: 'quantity',
                width: 200,
                render: text => <div style={{ color: 'black', fontSize: '14px' }}>{text}</div>,
                // fixed: 'left'
            },
            {
                title: 'Ho??n th??nh (%)',
                align: 'center',
                dataIndex: '',
                width: 200,
                render: text => <div style={{ color: 'black', fontSize: '14px' }}>{text + "%"}</div>,
                // fixed: 'left'
            },
            {
                title: 'Ghi ch??',
                align: 'center',
                dataIndex: 'note',
                width: 200,
                render: text => <div style={{ color: 'black', fontSize: '14px' }}>{text}</div>,
                // fixed: 'left'
            },
            {
                title: 'Thao t??c',
                align: 'center',
                key: 'thaotac',
                width: 200,
                // fixed: 'right',
                render: (text, record) => (
                    <div className="action_columns">
                        <Tooltip placement="top" title="Ch???nh s???a">
                            <button name="updateCustomerGasPlan" className="update_link custom-btn"
                                ref={this.componentRef}
                                onClick={this.editPlanCustomer.bind(null, record)}
                                style={{display: "inline"}}>
                                <i className="fa fa-edit update-icon"></i>
                            </button>
                        </Tooltip>
                        <Tooltip placement="top" title="H???y">
                            <button name="deleteCustomerGasPlan"className="delete_link custom-btn"
                                onClick={this.showDeleteConfirm.bind(null, record)}
                                style={{display: "inline"}}>
                                <i className="fa fa-trash delete-icon"></i>
                            </button>
                        </Tooltip>
                    </div>
                ),
            }];

        return (
            <div className="modal fade" id="create-plan" role="dialog" ref={el => (this.modal = el)}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h6 className="modal-title">K??? ho???ch l???y h??ng</h6>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <form
                                    onSubmit={this.onSubmit}>
                                    <div className="form-group row">
                                        <div className="col-md-5">
                                            <div className="form-group row">
                                                <label htmlFor="input_value" className="col-sm-4 col-form-label">Th??ng - n??m<label style={{ color: 'red' }}>*</label></label>
                                                <div className="col-sm-8">
                                                    <DatePicker.MonthPicker
                                                        // id="input_value"
                                                        name="month"
                                                        onChange={this.onChangeDatePicker}
                                                        placeholder="Ch???n th??ng - n??m"
                                                        format={monthFormat}
                                                        onBlur={this.handleBlurPicker}
                                                        value={month_data !== "" ? moment(month_data, monthFormat) : null}
                                                        style={{ width: '100%', color:"black" }}
                                                        disabled={this.state.checkEdit}
                                                    // defaultValue={moment(month_data, monthFormat)}
                                                    />
                                                    {this.state.errors.month ?
                                                        (
                                                            <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                <span>{this.state.errors.month}</span>
                                                            </div>
                                                        ) : ("")}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="form-group row">
                                                <label htmlFor="input_value" className="col-sm-4 col-form-label" style={{ paddingRight: 'unset' }}>Kh???i l?????ng(t???n)<label style={{ color: 'red' }}>*</label></label>
                                                <div className="col-sm-8">
                                                    <Input
                                                        name="quantity"
                                                        type="number"
                                                        className="form-control"
                                                        // id="input_value"
                                                        placeholder="Nh???p v??o kh???i l?????ng (t???n)"
                                                        onChange={this.onChange}
                                                        onBlur={this.handleBlur}
                                                        value={quantity}
                                                        style={{ color: 'black' }}
                                                    ></Input>
                                                    {this.state.errors.quantity ?
                                                        (
                                                            <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                <span>{this.state.errors.quantity}</span>
                                                            </div>
                                                        ) : ("")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="input_value" className="col-sm-2 col-form-label">Ghi ch??<label style={{ color: 'red' }}>*</label></label>
                                        <div className="col-sm-12">
                                            <div className="form-check">
                                                <Input.TextArea
                                                    name="note"
                                                    // id="input_value"
                                                    rows={2}
                                                    placeholder="Nh???p v??o ghi ch??"
                                                    onChange={this.onChange}
                                                    onBlur={this.handleBlur}
                                                    value={note}
                                                    style={{ color: 'black' }}
                                                />{this.state.errors.note ?
                                                    (
                                                        <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                            <span>{this.state.errors.note}</span>
                                                        </div>
                                                    ) : ("")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row text-center footer_form">
                                        <Button type="primary" htmlType="submit" name="createCustomerGasPlan" style={{display: "inline"}}>
                                            <Icon type="save" /> L??u </Button>
                                        <Button
                                            type="danger"
                                            data-dismiss="modal"
                                            style={{ marginLeft: "10px" }}
                                            onClick={(e) => { this.refresh(); }}
                                        >????ng</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="modal-body">
                            <Table
                                rowKey={record => record.id}
                                style={{ textAlign: "center" }}
                                bordered={true}
                                columns={columns}
                                dataSource={showCustomerPlan}
                                pagination={{ pageSize: 3 }}
                                scroll={{ x: 1000 }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PlanCustomer;