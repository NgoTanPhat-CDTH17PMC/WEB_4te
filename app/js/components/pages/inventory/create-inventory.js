import React from 'react';
import showToast from "showToast";
import Constants from "Constants";
import { Form, Input, Icon, Button, Checkbox, Select } from "antd";
import getAllStation from "./../../../../api/getAllStation";
import createWareHouseAPI from "./../../../../api/createWareHouseAPI"
import "./index.scss";
import getUserCookies from 'getUserCookies'

const Option = Select.Option;
const initialState = {
};
class CreateInventory extends React.Component {

    constructor(props) {
        super(props);
        this.options = [];
        this.state = {
            options: [],
            object: {
                name: "",
                code: "",
                stationId: "",
                address: "",
                isSupplier: false,
                mininventory: "",
                namecontact: "",
                mobilecontact: "",
                emailcontact: "",
                note: ""
            },
            errors: {
                name: "",
                code: "",
                stationId: "",
                address: "",
                isSupplier: false,
                mininventory: "",
                namecontact: "",
                mobilecontact: "",
                emailcontact: "",
                note: ""
            }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getAllStationAPI = this.getAllStationAPI.bind(this)
        this.onCheckCreate = this.onCheckCreate.bind(this)
    }

    async componentDidMount() {
        this.getAllStationAPI()
    }

    /* ==================================================== API =============================================*/

    async getAllStationAPI() {
        let options = [];
        var user_cookies = await getUserCookies();

        const listStation = await getAllStation(user_cookies.user.id);
        if (listStation) {
            if (listStation.data.success === true) {
                listStation.data.data.forEach(item => {
                    options = [...options, { label: item.name, value: item.id }]
                });
                this.setState({ options })
            } else {
                showToast(
                    listStation.data.message
                        ? listStation.data.message
                        : listStation.data.err_msg,
                    2000
                );
                return false;
            }
        } else {
            showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u!");
            return false;
        }
    }

    async createWareHouseAPI(target, name, code, address, stationId, mininventory, namecontact, mobilecontact, emailcontact, isSupplier, note) {
        const createWareHouse = await createWareHouseAPI(name, code, address, stationId, mininventory, namecontact, mobilecontact, emailcontact, isSupplier, note);
        if (createWareHouse) {
            console.log(createWareHouse)
            if (createWareHouse.data.status === true) {
                showToast('T???o m???i th??nh c??ng!', 3000);
                let modal = $("#create-inventory");
                modal.modal("hide");
                this.reset();
                target.reset();
                this.onCheckCreate(true);
            }
            else {
                this.onCheckCreate(false);
                if (createWareHouse.data.message === "Code ???? t???n t???i") {
                    showToast("M?? kho ???? t???n t???i!")
                } else {
                    showToast(
                        createWareHouse.data.message
                            ? createWareHouse.data.message
                            : createWareHouse.data.err_msg,
                        2000
                    );
                }
            }
        } else {
            showToast("X???y ra l???i trong qu?? tr??nh th??m d??? li???u!");
            this.onCheckCreate(false);
        }
    }

    /* ==================================================== /API =============================================*/







    /* ==================================================== /Another Function =============================================*/

    onChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            object: { ...prevState.object, [name]: value }
        }));
    };

    onChangeChecked = (e) => {
        const { name, checked } = e.target;
        this.setState(prevState => ({
            object: { ...prevState.object, [name]: checked }
        }));
    }

    OnChangeOption = (value) => {
        this.setState(prevState => ({
            object: { ...prevState.object, stationId: value }
        }));
    };

    validate = (name, value) => {
        if (name === "name") {
            if (!value) {
                return "T??n kho kh??ng ???????c ????? tr???ng!"
            }
        }
        if (name === "code") {
            if (!value) {
                return "M?? kho kh??ng ???????c ????? tr???ng!"
            }
        }
        if (name === "stationId") {
            if (!value) {
                return "Chi nh??nh kh??ng ???????c ????? tr???ng!"
            }
        }
        // if (name === "mininventory") {
        //     if (!value) {
        //         return "Kh???i l?????ng kh??ng ???????c ????? tr???ng!"
        //     }
        // }
        // if (name === "address") {
        //     if (!value) {
        //         return "?????a ch??? kh??ng ???????c ????? tr???ng!"
        //     }
        // }
        if (name === "mobilecontact") {
            if (value && value.search(/(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/)) {
                return "S??? ??i???n tho???i kh??ng h???p l???!";
            }
        }
        if (name === "emailcontact") {
            if (value && value.search(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/)) {
                return "Email kh??ng h???p l???!";
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


    handleBlurOption = (value) => {
        const name = "stationId"
        const error = this.validate(name, value);
        const state = this.state;
        this.setState(
            {
                errors: {
                    ...state.errors,
                    stationId: error,
                },
            },
            () => { }
        );
    }

    handleSubmit = e => {
        e.preventDefault();
        let { name, code, address, stationId, mininventory, namecontact, mobilecontact, emailcontact, isSupplier, note } = this.state.object;
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
            this.createWareHouseAPI(e.target, name, code, address, stationId, mininventory, namecontact, mobilecontact, emailcontact, isSupplier, note)
        }
    }

    onCheckCreate = (checked) => {
        this.props.onChecked(checked);
    }

    reset() {
        this.setState({ errors: initialState, object: initialState });
    }

    /* ==================================================== /Another Function =============================================*/


    render() {
        console.log(this.state.object)
        return (
            <div className="modal fade" id="create-inventory" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"><Icon className="icon_star" theme="filled" />T???o m???i kho</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <form
                                    onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 ">
                                            <div className="form-group row">
                                                <h3>Th??ng tin kho</h3>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_name" className="col-sm-3 col-form-label">T??n kho <label style={{ color: 'red' }}>*</label></label>
                                                <div className="col-sm-9">
                                                    <Input
                                                        type="text"
                                                        name="name"
                                                        className="form-control"
                                                        id="input_name"
                                                        placeholder="Nh???p v??o t??n kho"
                                                        onBlur={this.handleBlur}
                                                        onChange={this.onChange}
                                                    ></Input>
                                                    {this.state.errors.name ?
                                                        (
                                                            <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                <span>{this.state.errors.name}</span>
                                                            </div>
                                                        ) : ("")}
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_code" className="col-sm-3 col-form-label">M?? kho <label style={{ color: 'red' }}>*</label></label>
                                                <div className="col-sm-9">
                                                    <Input
                                                        type="text"
                                                        name="code"
                                                        className="form-control"
                                                        id="input_code"
                                                        placeholder="Nh???p v??o m?? kho"
                                                        onBlur={this.handleBlur}
                                                        onChange={this.onChange}
                                                    ></Input>
                                                    {this.state.errors.code ?
                                                        (
                                                            <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                <span>{this.state.errors.code}</span>
                                                            </div>
                                                        ) : ("")}
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_station" className="col-sm-3 col-form-label">Thu???c <label style={{ color: 'red' }}>*</label></label>
                                                <div className="col-sm-9">
                                                    <Select
                                                        id="input_station"
                                                        placeholder="Ch???n chi nh??nh"
                                                        name="stationId"
                                                        onChange={this.OnChangeOption}
                                                        onBlur={this.handleBlurOption}
                                                        // defaultValue={this.state.object.stationId}
                                                    >
                                                        <Option value="empty" disabled>Ch???n chi nh??nh</Option>
                                                        {this.state.options.map((option) => (
                                                            <Option key={option.value} value={option.value}>{option.label}</Option>
                                                        ))}
                                                    </Select>
                                                    {this.state.errors.stationId ?
                                                        (
                                                            <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                <span>{this.state.errors.stationId}</span>
                                                            </div>
                                                        ) : ("")}
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_mininventory" className="col-sm-3 col-form-label">T???n kho t???i thi???u</label>
                                                <div className="col-sm-9">
                                                    <Input
                                                        type="number"
                                                        name="mininventory"
                                                        className="form-control"
                                                        id="input_mininventory"
                                                        placeholder="Nh???p v??o kh???i l?????ng t???i thi???u"
                                                        // onBlur={this.handleBlur}
                                                        onChange={this.onChange}
                                                    ></Input>
                                                    {this.state.errors.mininventory ?
                                                        (
                                                            <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                <span>{this.state.errors.mininventory}</span>
                                                            </div>
                                                        ) : ("")}
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_address" className="col-sm-3 col-form-label">?????a ch???</label>
                                                <div className="col-sm-9">
                                                    <Input
                                                        type="text"
                                                        name="address"
                                                        className="form-control"
                                                        id="input_address"
                                                        placeholder="Nh???p v??o ?????a ch???"
                                                        // onBlur={this.handleBlur}
                                                        onChange={this.onChange}
                                                    ></Input>
                                                    {this.state.errors.address ?
                                                        (
                                                            <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                <span>{this.state.errors.address}</span>
                                                            </div>
                                                        ) : ("")}
                                                </div>
                                            </div>
                                            <div className="form-group row" style={{ width: '94%' }}>
                                                <label htmlFor="check_isSupplier" className="col-sm-4 col-form-label">Kho nh?? cung c???p</label>
                                                <div className="col-sm-8">
                                                    <div className="check_div">
                                                        {/* <input className="form-check-input" type="checkbox" id="check_isSupplier" /> */}
                                                        <Checkbox
                                                            name="isSupplier"
                                                            className="form-check-input"
                                                            id="check_isSupplier"
                                                            onChange={this.onChangeChecked}
                                                            checked={this.state.object.isSupplier}
                                                        ></Checkbox>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group row">
                                                <h3>Th??ng tin li??n h???</h3>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_namecontact" className="col-sm-3 col-form-label">T??n </label>
                                                <div className="col-sm-9">
                                                    <Input
                                                        type="text"
                                                        name="namecontact"
                                                        className="form-control"
                                                        id="input_namecontact"
                                                        placeholder="Nh???p v??o t??n"
                                                        onBlur={this.handleBlur}
                                                        onChange={this.onChange}
                                                    ></Input>
                                                    {this.state.errors.namecontact ?
                                                        (
                                                            <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                <span>{this.state.errors.namecontact}</span>
                                                            </div>
                                                        ) : ("")}
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_mobilecontact" className="col-sm-3 col-form-label">??i???n tho???i</label>
                                                <div className="col-sm-9">
                                                    <Input
                                                        type="text"
                                                        name="mobilecontact"
                                                        className="form-control"
                                                        id="input_mobilecontact"
                                                        placeholder="Nh???p v??o s??? ??i???n tho???i"
                                                        onBlur={this.handleBlur}
                                                        onChange={this.onChange}
                                                    ></Input>
                                                    {this.state.errors.mobilecontact ?
                                                        (
                                                            <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                <span>{this.state.errors.mobilecontact}</span>
                                                            </div>
                                                        ) : ("")}
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_emailcontact" className="col-sm-3 col-form-label">Email</label>
                                                <div className="col-sm-9">
                                                    <Input
                                                        type="text"
                                                        name="emailcontact"
                                                        className="form-control"
                                                        id="input_emailcontact"
                                                        placeholder="Nh???p v??o email"
                                                        onBlur={this.handleBlur}
                                                        onChange={this.onChange}
                                                    ></Input>
                                                    {this.state.errors.emailcontact ?
                                                        (
                                                            <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                <span>{this.state.errors.emailcontact}</span>
                                                            </div>
                                                        ) : ("")}
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_note" className="col-sm-3 col-form-label">Ghi ch??</label>
                                                <div className="col-sm-9">
                                                    <Input.TextArea
                                                        name="note"
                                                        id="input_note"
                                                        placeholder="Nh???p v??o ghi ch??"
                                                        rows={4}
                                                        onChange={this.onChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="form-group row">
                                        <label htmlFor="input_note" className="col-sm-1 col-form-label">Ghi ch??</label>
                                        <div className="col-sm-11">
                                            <div className="form-check">
                                                <Input.TextArea
                                                    name="note"
                                                    id="inut_note"
                                                    rows={4}
                                                    onChange={this.onChange}
                                                />
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="form-group row">
                                        <footer className="card-footer text-center footer_form">
                                            <Button type="primary" htmlType="submit">
                                                <Icon type="save" /> L??u
                                            </Button>
                                            <Button
                                                type="danger"
                                                data-dismiss="modal"
                                                style={{ marginLeft: "10px" }}
                                                onClick={(e) => { this.reset(); }}
                                            >????ng
                                            </Button>
                                        </footer>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default CreateInventory;
