import React, { Component } from "react";
import Constants from "Constants";
import showToast from "showToast";
import {
  Form,
  Input,
  Icon,
  Button,
  DatePicker,
  Select,
  Table,
  Tooltip,
  Popconfirm,
  Modal,
} from "antd";
import "./index.scss";
import UpdatePlan from "./update-plan";
import GetAllWareHousePlanAPI from "./../../../../api/getAllWareHousePlanByWareHouseIdAPI";
import CreateWareHousePlanAPI from "./../../../../api/createWareHousePlanAPI";
import DeleteWareHousePlanAPI from "./../../../../api/deleteWareHousePlanAPI";
import moment from "moment";
import _ from "lodash";

const Option = Select.Option;
const { confirm } = Modal;

const initialState = {
  month: "",
  year: "",
  quantity: "",
  note: "",
};

const initialState01 = {};

class CreatePlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataFromPlan: {},
      isLoading: false,
      wareHousePlan: [],
      warehouseId: "",
      object: {
        warehouseId: "",
        month: "",
        year: "",
        quantity: "",
        note: "",
      },
      errors: {
        warehouseId: "",
        month: "",
        year: "",
        quantity: "",
        note: "",
      },
    };

    this.onChange = this.onChange.bind(this);
    this.onCheckDelete = this.onCheckDelete.bind(this);
    this.getDataRowUpdate = this.getDataRowUpdate.bind(this);
    this.onCheckUpdatePlan = this.onCheckUpdatePlan.bind(this);
    this.onCheckCreatePlan = this.onCheckCreatePlan.bind(this);
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
    this.onChangeDatePicker = this.onChangeDatePicker.bind(this);
    this.deleteWareHousePlanAPI = this.deleteWareHousePlanAPI.bind(this);
    this.getAllWareHousePlanAPI = this.getAllWareHousePlanAPI.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.dataFromParent) {
      
      this.setState({
        warehouseId: nextProps.dataFromParent ? nextProps.dataFromParent : "",
        object: {
          warehouseId: nextProps.dataFromParent ? nextProps.dataFromParent : "",
          month: "",
          year: "",
          quantity: "",
        },
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.dataFromParent !== prevProps.dataFromParent) {
      this.getAllWareHousePlanAPI(this.props.dataFromParent);
    }
  }

  /* ==================================================== API =============================================*/

  async getAllWareHousePlanAPI(wareHouseId) {
    this.setState({ isLoading: true });
    const wareHousePlan = await GetAllWareHousePlanAPI(wareHouseId);
    if (wareHousePlan) {
      if (wareHousePlan.data.status === true) {
        showToast("L???y d??? li???u th??nh c??ng!");
        this.setState({
          wareHousePlan: wareHousePlan.data.WareHousePlan,
          isLoading: false,
        });
      } else {
        this.setState({ wareHousePlan: [], isLoading: false });
        if (
          wareHousePlan.data.message === "L???i...Kh??ng t??m th???y WareHousePlan."
        ) {
        } else {
          showToast(
            wareHousePlan.data.message
              ? wareHousePlan.data.message
              : wareHousePlan.data.err_msg
          );
        }
      }
      this.setState({ isLoading: false });
    } else {
      showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u!");
    }
    return false;
  }

  async createWareHousePlanAPI(warehouseId, month, year, quantity, note) {
    const createWareHousePlan = await CreateWareHousePlanAPI(
      warehouseId,
      month,
      year,
      quantity,
      note
    );
    if (createWareHousePlan) {
      console.log(createWareHousePlan);
      if (createWareHousePlan.data.status === true) {
        showToast("T???o m???i th??nh c??ng!", 3000);
        this.onCheckCreatePlan(true);
      } else {
        this.onCheckCreatePlan(false);
        showToast(
          createWareHousePlan.data.message
            ? createWareHousePlan.data.message
            : createWareHousePlan.data.err_msg,
          2000
        );
      }
    } else {
      showToast("X???y ra l???i trong qu?? tr??nh th??m d??? li???u!");
      this.onCheckCreatePlan(false);
    }
  }

  async deleteWareHousePlanAPI(warehouseID) {
    this.setState({ isLoading: true });
    const deleteWareHousePlan = await DeleteWareHousePlanAPI(warehouseID);
    if (deleteWareHousePlan) {
      if (deleteWareHousePlan.data.status === true) {
        showToast("K??? ho???ch ???? ???????c h???y th??nh c??ng!");
        this.onCheckDelete(true);
        this.setState({ isLoading: false });
      } else {
        showToast(
          deleteWareHousePlan.data.message
            ? deleteWareHousePlan.data.message
            : deleteWareHousePlan.data.err_msg
        );
        this.setState({ isLoading: false });
      }
    } else {
      showToast("X???y ra l???i trong qu?? tr??nh x??a d??? li???u!");
      this.setState({ isLoading: false });
    }
  }

  /* ==================================================== /API =============================================*/

  /* ==================================================== Another Function =============================================*/

  onCheckCreatePlan(checked) {
    if (checked) {
      this.setState((prevState) => ({
        object: {
          ...prevState.object,
          warehouseId: prevState.object.warehouseId,
          month: "",
          year: "",
          quantity: "",
          note: "",
        },
      }));
      this.setState({ wareHousePlan: [], errors: initialState01 });
      this.getAllWareHousePlanAPI(this.state.warehouseId);
    }
  }

  onCheckUpdatePlan = (checked) => {
    if (checked) {
      this.setState({ errors: initialState01 });
      this.setState({
        wareHousePlan: [],
        object: initialState,
        errors: initialState01,
      });
      this.getAllWareHousePlanAPI(this.state.warehouseId);
    }
  };

  onCheckDelete = (checked) => {
    if (checked) {
      this.setState({
        wareHousePlan: [],
        object: initialState,
        errors: initialState01,
      });
      this.getAllWareHousePlanAPI(this.state.warehouseId);
    }
  };

  async getDataRowUpdate(data) {
    await this.setState({
      dataFromPlan: data,
    });
  }

  onChangeDatePicker(date, dateString) {
    const month_year = dateString.split("-");
    this.setState((prevState) => ({
      object: {
        ...prevState.object,
        month: month_year[0],
        year: month_year[1],
      },
    }));
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      object: { ...prevState.object, [name]: value },
    }));
    const error = this.validate(name, value);
    const state = this.state;
    this.setState(
      {
        errors: {
          ...state.errors,
          [name]: error,
        },
      },
      () => {}
    );
  };

  validate = (name, value) => {
    if (name === "quantity") {
      if (!value) {
        return "Kh???i l?????ng kh??ng ???????c ????? tr???ng!";
      }
    }
    if (name === "month") {
      if (!value) {
        return "Th??ng - n??m kh??ng ???????c ????? tr???ng!";
      }
    }
  };

  handleBlurPicker = (e) => {
    let value = this.state.object.month;
    const error = this.validate((name = "month"), value);
    const state = this.state;
    this.setState(
      {
        errors: {
          ...state.errors,
          [name]: error,
        },
      },
      () => {}
    );
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
      () => {}
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let { warehouseId, month, year, quantity, note } = this.state.object;
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
    } else {
      this.createWareHousePlanAPI(warehouseId, month, year, quantity, note);
    }
  };

  reset() {
    this.setState((prevState) => ({
      object: {
        ...prevState.object,
        warehouseId: prevState.object.warehouseId,
        month: "",
        year: "",
        quantity: "",
        note: "",
      },
    }));
    this.setState({ errors: initialState01 });
  }

  showDeleteConfirm(record) {
    // e.preventDefault();
    confirm({
      zIndex: 10000,
      title: "X??c nh???n h???y?",
      content: (
        <span style={{ color: "black" }}>
          {"Kh???i l?????ng: " +
            record.quantity +
            " - Th??ng: " +
            record.month +
            "/" +
            record.year}
        </span>
      ),
      okText: "X??c nh???n",
      okType: "danger",
      cancelText: "T??? ch???i",
      onOk: () => {
        this.deleteWareHousePlanAPI(record.id);
      },
      onCancel() {},
    });
  }

  /* ==================================================== /Another Function =============================================*/

  render() {
    let sortArr = []
    if(this.state.wareHousePlan){

     sortArr = _.orderBy(this.state.wareHousePlan, [(datas) => datas.year, (data) => data.month ], ["desc", "desc"]);
    }

    let { id, warehouseId, month, year, quantity, note } = this.state.object;
    const monthFormat = "MM-YYYY";
    // const current_month = "";
    let month_data = month ? month.concat("-", year) : "";
    const columns = [
      {
        title: "STT",
        key: "index",
        align: "center",
        width: 100,
        render: (text, record, index) => (
          <div style={{ color: "black" }}>{index + 1}</div>
        ),
        // fixed: 'left'
      },
      {
        title: "Kh???i l?????ng (t???n)",
        align: "center",
        dataIndex: "quantity",
        width: 200,
        render: (text) => (
          <div style={{ color: "black", fontSize: "14px" }}>{text}</div>
        ),
        // fixed: 'left'
      },
      {
        title: "Th??ng",
        align: "center",
        dataIndex: "month",
        width: 100,
        render: (text) => (
          <div style={{ color: "black", fontSize: "14px" }}>{text}</div>
        ),
        // fixed: 'left'
      },
      {
        title: "N??m",
        align: "center",
        dataIndex: "year",
        width: 100,
        render: (text) => (
          <div style={{ color: "black", fontSize: "14px" }}>{text}</div>
        ),
        // fixed: 'left'
      },
      {
        title: "Ti???n ????? th???c hi???n (%)",
        align: "center",
        dataIndex: "",
        width: 200,
        render: (text) => (
          <div style={{ color: "black", fontSize: "14px" }}>{text + "%"}</div>
        ),
        // fixed: 'left'
      },
      {
        title: "Ghi ch??",
        align: "center",
        dataIndex: "note",
        width: 200,
        render: (text) => (
          <div style={{ color: "black", fontSize: "14px" }}>{text}</div>
        ),
        // fixed: 'left'
      },
      {
        title: "Thao t??c",
        align: "center",
        key: "thaotac",
        width: 200,
        // fixed: 'right',
        render: (text, record) => (
          <div className="action_columns">
            <Tooltip placement="top" title="Ch???nh s???a">
              <a
                className="update_link"
                data-toggle="modal"
                data-target="#update-plan"
                onClick={this.getDataRowUpdate.bind(null, record)}
              >
                <i className="fa fa-edit update_icon"></i>
              </a>
            </Tooltip>
            <Tooltip placement="top" title="H???y">
              <a
                className="delete_link"
                onClick={(e) => this.showDeleteConfirm(record)}
              >
                <i className="fa fa-trash delete_icon"></i>
              </a>
            </Tooltip>
          </div>
        ),
      },
    ];
    return (
      <div>
        <div className="modal fade" id="create-plan" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Icon className="icon_star" theme="filled" />
                  T???o k??? ho???ch nh???p h??ng
                </h5>
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="container">
                  <form onSubmit={this.handleSubmit}>
                    <div className="form-group row">
                      <div className="col-md-5">
                        <div className="form-group row">
                          <label
                            htmlFor="input_month"
                            className="col-sm-4 col-form-label"
                          >
                            Th??ng - n??m<label style={{ color: "red" }}>*</label>
                          </label>
                          <div className="col-sm-8">
                            <DatePicker.MonthPicker
                              name="month"
                              onChange={this.onChangeDatePicker}
                              placeholder="Ch???n th??ng - n??m"
                              format={monthFormat}
                              onBlur={this.handleBlurPicker}
                              value={
                                month_data !== ""
                                  ? moment(month_data, monthFormat)
                                  : null
                              }
                              style={{ width: "100%", color: "black" }}
                              // defaultValue={moment(month_data, monthFormat)}
                            />
                            {this.state.errors.month ? (
                              <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                <span>{this.state.errors.month}</span>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="form-group row">
                          <label
                            htmlFor="input_quantity"
                            className="col-sm-4 col-form-label"
                          >
                            Kh???i l?????ng(t???n)
                            <label style={{ color: "red" }}>*</label>
                          </label>
                          <div className="col-sm-8">
                            <Input
                              name="quantity"
                              type="number"
                              className="form-control"
                              placeholder="Nh???p v??o kh???i l?????ng (t???n)"
                              onChange={this.onChange}
                              onBlur={this.handleBlur}
                              value={quantity}
                              style={{ color: "black" }}
                            ></Input>
                            {this.state.errors.quantity ? (
                              <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                <span>{this.state.errors.quantity}</span>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        htmlFor="input_note"
                        className="col-sm-2 col-form-label"
                      >
                        Ghi ch??
                      </label>
                      <div className="col-sm-12">
                        <div className="form-check">
                          <Input.TextArea
                            name="note"
                            rows={2}
                            placeholder="Nh???p v??o ghi ch??"
                            onChange={this.onChange}
                            value={note}
                            style={{ color: "black" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group row text-center footer_form">
                      <Button type="primary" htmlType="submit">
                        <Icon type="save" /> L??u{" "}
                      </Button>
                      <Button
                        type="danger"
                        data-dismiss="modal"
                        style={{ marginLeft: "10px" }}
                        onClick={(e) => {
                          this.reset();
                        }}
                      >
                        ????ng
                      </Button>
                    </div>
                  </form>
                </div>
                <div className="container">
                  <Table
                    rowKey={(record) => record.id}
                    loading={this.state.isLoading}
                    columns={columns}
                    dataSource={sortArr ? sortArr : []}
                    bordered
                    pagination={{ defaultPageSize: 10 }}
                    // scroll={{ x: 1700 }}
                  ></Table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <UpdatePlan
          onChecked={this.onCheckUpdatePlan}
          dataFromPlan={this.state.dataFromPlan}
        ></UpdatePlan>
      </div>
    );
  }
}
export default CreatePlan;
