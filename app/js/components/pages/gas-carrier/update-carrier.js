import React from 'react';
import showToast from "showToast";
import Constants from "Constants";
import { Form, Input, Icon, Button, Image, Upload } from "antd";
import "./index.scss";
import updateCarrierAPI from "./../../../../api/updateCarrierAPI";

const initialState = {
    email: "",
    password: "",
    address: "",
    phone: "",
    code: "",
    name: "",
    driverNumber: "",
};

const initialState01 = {}

class UpdateCarrier extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            initialState: {},
            object:
            {
                id: "",
                name: "",
                avatar: "",
                phone: "",
                address: "",
                code: "",
                driverNumber: "",
                email: "",
                isView: ""
            },
            errors: {
                id: "",
                name: "",
                avatar: "",
                phone: "",
                address: "",
                code: "",
                driverNumber: "",
                email: "",
            },
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileChangedHandler = this.fileChangedHandler.bind(this)
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() { }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.dataFromParent) {
            this.setState({
                object: {
                    id: nextProps.dataFromParent.id,
                    name: nextProps.dataFromParent.name ? nextProps.dataFromParent.name : '',
                    avatar: nextProps.dataFromParent.avatar ? nextProps.dataFromParent.avatar : '',
                    phone: nextProps.dataFromParent.phone ? nextProps.dataFromParent.phone : '',
                    address: nextProps.dataFromParent.address ? nextProps.dataFromParent.address : '',
                    code: nextProps.dataFromParent.code ? nextProps.dataFromParent.code : '',
                    driverNumber: nextProps.dataFromParent.driverNumber ? nextProps.dataFromParent.driverNumber : '',
                    email: nextProps.dataFromParent.email ? nextProps.dataFromParent.email : '',
                    isView: nextProps.dataFromParent.isView ? nextProps.dataFromParent.isView : ''
                },
                errors: initialState01
            })
        }
        else {
            this.setState({ object: initialState, errors: initialState01 })
        }
    }

    /* ==================================================== API =============================================*/
    async updateCarrierAPI(carrierId, name, driverNumber, address, phone, avatar) {
        const updateCarrier = await updateCarrierAPI(carrierId, name, driverNumber, address, phone, avatar);
        if (updateCarrier) {
            if (updateCarrier.data.success === true) {
                this.onCheckUpdate(true)
                showToast('C???p nh???t th??nh c??ng!', 3000);
                let modal = $("#update-carrier");
                modal.modal("hide");
                return true;
            }
            else {
                showToast(
                    updateCarrier.data.message
                        ? updateCarrier.data.message
                        : updateCarrier.data.err_msg,
                    2000
                );
                this.props.form.resetFields();
                this.onCheckUpdate(false)
                return false;
            }
        } else {
            showToast("X???y ra l???i trong qu?? tr??nh c???p nh???t d??? li???u!");
            this.props.form.resetFields();
            this.onCheckUpdate(false)
            return false;
        }
    }
    /* ==================================================== /API =============================================*/

    /* ==================================================== /Another Function =============================================*/

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result);
        };
        reader.onerror = function (error) {
            console.log("Error: ", error);
        };
    }

    fileChangedHandler = (event) => {
        let file = event.target.files[0];
        let avatar = "";
        if (file) {
            setTimeout(() => {
                this.getBase64(file, (result) => {
                    avatar = result;
                    this.setState(prevState => ({
                        object: { ...prevState.object, avatar: avatar }
                    }));
                    // this.setState({ avatar })
                });
            }, 1000);
        }
    };


    onChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            object: { ...prevState.object, [name]: value }
        }));
    };


    onCheckUpdate = (checked) => {
        this.props.onChecked(checked);
    }

    validate = (name, value) => {
        if (name === "name") {
            if (!value) {
                return "T??n t??i x??? kh??ng ???????c ????? tr???ng!"
            }
        }
        if (name === "phone") {
            if (!value) {
                return "S??? ??i???n tho???i kh??ng ???????c ????? tr???ng!"
            }
            else if (value && value.search(/(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/)) {
                return "S??? ??i???n tho???i kh??ng h???p l???!";
            }
        }
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
            },
            () => { }
        );
    };

    handleSubmit = (e) => {
        e.preventDefault();
        let { id, name, driverNumber, address, phone, avatar } = this.state.object;
        let _address = address ? address : "";
        let _driverNumber = driverNumber ? driverNumber : "";
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
            showToast("Vui l??ng ki???m tra l???i th??ng tin!");
        }
        else {
            this.updateCarrierAPI(id, name, _driverNumber, _address, phone, avatar)
        }
    };

    resetForm() {
        this.setState({ object: initialState, errors: initialState })
    }

    /* ==================================================== /Another Function =============================================*/


    render() {
        let {
            name,
            avatar,
            phone,
            address,
            code,
            driverNumber,
            email,
            isView } = this.state.object;
        if (isView) {
            return (
                <div className="modal fade" id="update-carrier" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"><Icon className="icon_star" theme="filled" />Xem th??ng tin t??i x???</h5>
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="container">
                                    <Form form='form'>
                                        <div class="row">
                                            <div className="col">
                                                <Form.Item className="form_avt" label="H??nh ?????i di???n">
                                                    <img className="image img_avt" src={this.props.dataFromParent.avatar} alt="Avatar"></img>
                                                </Form.Item>
                                                <Form.Item label="Bi???n s??? xe">
                                                    <Input value={driverNumber} readOnly />
                                                </Form.Item>
                                                <Form.Item label="?????a ch???">
                                                    <Input value={address} readOnly />
                                                </Form.Item>
                                            </div>
                                            <div className="col">
                                                <Form.Item label="M?? t??i x???">
                                                    <Input value={code} readOnly />
                                                </Form.Item>
                                                <Form.Item label="T??n t??i x???">
                                                    <Input value={name} readOnly />
                                                </Form.Item>

                                                <Form.Item label="Email">
                                                    <Input value={email} readOnly />
                                                </Form.Item>
                                                <Form.Item label="S??? ??i???n tho???i">
                                                    <Input value={phone} readOnly />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        {/* <div className="row"> */}
                                        <footer className="card-footer text-center">
                                            <Button type="danger" data-dismiss="modal"
                                                style={{ marginLeft: "10px" }}>????ng
                                            </Button>
                                        </footer>
                                        {/* </div> */}
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="modal fade" id="update-carrier" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <form
                                onSubmit={this.handleSubmit}
                                ref={(c) => {
                                    this.form = c;
                                }}>
                                <div className="modal-header">
                                    <h5 className="modal-title"><Icon className="icon_star" theme="filled" />Ch???nh s???a th??ng tin t??i x???</h5>
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                {/* <div className="modal-body">
                                <div className="container">
                                    <Form
                                        form='form'
                                        onSubmit={this.handleSubmit}
                                    >
                                        <div className="row">
                                            <div className="col-md-6">

                                                <Form.Item className="container avt_input">
                                                    <div class="">
                                                        <label style={{ color: 'black' }}>H??nh ?????i di???n</label>
                                                        <div className="div-image">
                                                            <img id="avatar" src={avatar}></img>
                                                            <div className="button-input">
                                                                <button type="button" class="btn btn-primary">
                                                                    <Icon type="edit" />Thay ?????i
                                                                    </button>
                                                                <input
                                                                    type="file"
                                                                    className="input-file-image"
                                                                    name="avatar"
                                                                    onChange={(event) =>
                                                                        this.fileChangedHandler(event)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Form.Item>
                                               
                                                <Form.Item className="driverNumber_input">
                                                    <label style={{ color: 'black' }}>Bi???n s??? xe</label>
                                                    <Input
                                                        placeholder="Vui l??ng nh???p Bi???n s??? xe"
                                                        type="text"
                                                        name="driverNumber"
                                                        onChange={this.onChange}
                                                        value={driverNumber}
                                                        onBlur={this.handleBlur}
                                                    />
                                                    {this.state.errors.driverNumber ?
                                                        (
                                                            <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                <span>{this.state.errors.driverNumber}</span>
                                                            </div>
                                                        ) : ("")}
                                                </Form.Item>

                                            </div>
                                            <div className="col-md-6">

                                                <Form.Item className="code_input">
                                                    <label style={{ color: 'black' }}>M?? t??i x???</label><label style={{ color: 'red' }}> *</label>
                                                    <Input
                                                        type="text"
                                                        disabled
                                                        onChange={this.onChange}
                                                        value={code}
                                                    />
                                                </Form.Item>

                                                <Form.Item className="email_input">
                                                    <label style={{ color: 'black' }}>Email</label><label style={{ color: 'red' }}> *</label>
                                                    <Input
                                                        type="text"
                                                        disabled
                                                        onChange={this.onChange}
                                                        value={email}
                                                    />
                                                </Form.Item>

                                                <Form.Item className="name_input">
                                                    <label style={{ color: 'black' }}>T??n t??i x???</label><label style={{ color: 'red' }}> *</label>
                                                    <Input
                                                        placeholder="Vui l??ng nh???p T??n t??i x???"
                                                        type="text"
                                                        name="name"
                                                        onChange={this.onChange}
                                                        value={name}
                                                        onBlur={this.handleBlur}
                                                    />
                                                    {this.state.errors.name ?
                                                        (
                                                            <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                <span>{this.state.errors.name}</span>
                                                            </div>
                                                        ) : ("")}
                                                </Form.Item>
                                                
                                                <Form.Item className="phone_input">
                                                    <label style={{ color: 'black' }}>S??? ??i???n tho???i</label><label style={{ color: 'red' }}> *</label>
                                                    <Input
                                                        type="number"
                                                        placeholder="Vui l??ng nh???p S??? ??i???n tho???i"
                                                        name="phone"
                                                        onChange={this.onChange}
                                                        value={phone}
                                                        onBlur={this.handleBlur}
                                                    />
                                                    {this.state.errors.phone ?
                                                        (
                                                            <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                <span>{this.state.errors.phone}</span>
                                                            </div>
                                                        ) : ("")}
                                                </Form.Item>



                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <Form.Item className="address_input">
                                                    <label style={{ color: 'black' }}>?????a ch???</label>
                                                    <Input.TextArea
                                                        placeholder="Vui l??ng nh???p ?????a ch???"
                                                        name="address"
                                                        onChange={this.onChange}
                                                        value={address}
                                                        onBlur={this.handleBlur}
                                                    />
                                                    {this.state.errors.address ?
                                                        (
                                                            <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                <span>{this.state.errors.address}</span>
                                                            </div>
                                                        ) : ("")}
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <footer className="card-footer text-center">
                                            <Button type="primary" htmlType="submit">
                                                <Icon type="save" /> L??u
                                            </Button>
                                            <Button type="danger" data-dismiss="modal" onClick={(e) => { this.props.form.resetFields(); this.reset(); }}
                                                style={{ marginLeft: "10px" }}>????ng
                                            </Button>
                                        </footer>
                                    </Form>
                                </div>
                            </div> */}

                                <div className="modal-body" id="form_body">
                                    <div className="site-card-border-less-wrapper container">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="container avt_input">
                                                    <div className="">
                                                        <label id="input_name" htmlFor="input_value" className="col-sm-5 col-form-label">H??nh ?????i di???n</label>
                                                        <div className="div-image">
                                                            <img id="avatar" src={avatar}></img>
                                                            <div className="button-input">
                                                                <button type="button" class="btn btn-primary">
                                                                    <Icon type="edit" />Thay ?????i
                                                                    </button>
                                                                <input
                                                                    type="file"
                                                                    className="input-file-image"
                                                                    name="avatar"
                                                                    onChange={(event) =>
                                                                        this.fileChangedHandler(event)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label id="input_name" htmlFor="input_value" className="col-sm-5 col-form-label">Bi???n s??? xe <label style={{ color: 'white' }}>*</label></label>
                                                    <div className="col-sm-12">
                                                        <Input
                                                            type="text"
                                                            name="driverNumber"
                                                            className="form-control input_value"
                                                            style={{ color: "black" }}
                                                            placeholder="Nh???p v??o Bi???n s??? xe"
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                            value={driverNumber}
                                                        ></Input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6" style={{ marginTop: "auto" }}>
                                                <div className="form-group row">
                                                    <label id="input_name" htmlFor="input_value" className="col-sm-5 col-form-label">M?? t??i x???</label>
                                                    <div className="col-sm-12">
                                                        <Input
                                                            type="text"
                                                            name="code"
                                                            className="form-control input_value"
                                                            style={{ color: "black" }}
                                                            onChange={this.onChange}
                                                            value={code}
                                                            disabled={true}
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label id="input_name" htmlFor="input_value" className="col-sm-5 col-form-label">Email</label>
                                                    <div className="col-sm-12">
                                                        <Input
                                                            type="text"
                                                            name="email"
                                                            className="form-control input_value"
                                                            style={{ color: "black" }}
                                                            placeholder="Vui l??ng nh???p Email"
                                                            onChange={this.onChange}
                                                            value={email}
                                                            disabled={true}
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label id="input_name" htmlFor="input_value" className="col-sm-5 col-form-label">T??n t??i x??? <label style={{ color: 'red' }}>*</label></label>
                                                    <div className="col-sm-12">
                                                        <Input
                                                            type="text"
                                                            name="name"
                                                            className="form-control input_value"
                                                            style={{ color: "black" }}
                                                            placeholder="Vui l??ng nh???p T??n t??i x???"
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                            value={name}
                                                        ></Input>
                                                        {
                                                            this.state.errors.name ?
                                                                (
                                                                    <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                        <span>{this.state.errors.name}</span>
                                                                    </div>
                                                                ) : ("")
                                                        }
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label id="input_name" htmlFor="input_value" className="col-sm-5 col-form-label">S??? ??i???n tho???i <label style={{ color: 'red' }}>*</label></label>
                                                    <div className="col-sm-12">
                                                        <Input
                                                            type="text"
                                                            name="phone"
                                                            className="form-control input_value"
                                                            style={{ color: "black" }}
                                                            placeholder="Vui l??ng nh???p S??? ??i???n tho???i"
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                            value={phone}
                                                        ></Input>
                                                        {
                                                            this.state.errors.phone ?
                                                                (
                                                                    <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                        <span>{this.state.errors.phone}</span>
                                                                    </div>
                                                                ) : ("")
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group row">
                                                    <label id="input_name" htmlFor="input_value" className="col-sm-5 col-form-label">?????a ch??? <label style={{ color: 'white' }}>*</label></label>
                                                    <div className="col-sm-12">
                                                        <Input.TextArea
                                                            type="text"
                                                            name="address"
                                                            className="form-control input_value"
                                                            style={{ color: "black" }}
                                                            place="Nh???p v??o ?????a ch???"
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                            value={address}
                                                        ></Input.TextArea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <div id="form_footer">
                                        <footer className="card-footer text-center footer_form">
                                            <Button type="primary" htmlType="submit"><Icon type="save" /> L??u </Button>
                                            <Button
                                                type="danger"
                                                data-dismiss="modal"
                                                style={{ marginLeft: "10px" }}
                                                onClick={(e) => { this.resetForm() }}>????ng </Button>
                                        </footer>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
export default UpdateCarrier;
