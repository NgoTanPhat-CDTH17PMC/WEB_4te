import React, { Component } from "react";
import getUserCookies from "getUserCookies";
import callApi from "./../../../util/apiCaller";
import moment from "moment";
import {
  DELETE_CYLINDERGAS,
  SEARCH_CYLINDERGAS,
} from "./../../../config/config";
import {
  Row,
  Form,
  Input,
  Popconfirm,
  DatePicker,
  Icon,
  Table,
  message,
} from "antd";
import openNotificationWithIcon from "./../../../helpers/notification";
const { Search } = Input;
import AddCylinderGas from "./addCylinderGas";
import "./create-product.scss";
import EditCylinderGas from "./editCylinderGas";

class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.formUpdatePrice = null;
    this.formBuyCylinder = null;
    this.state = {
      formone: false,
      dataProducts: [],
      product_id: null,
      product_parse: [],
      user_type: "",
      user_role: "",
      parentRoot: "",
      store: "",
      editListCylinderGas: [],
      productResult: [],
      pickProduct: { serial: "", currentImportPrice: 0, status: "FULL" },
      searchKey: "",
      currentSkip: 0,
      isDisabledNext: false,
      total: 0,
      activePage: 1,
      user_cookies: "",
      circleCount: 0,
      allChildOf: [],
      isLoading: false,
      show: false,
      list: [],
      listDriverStation: [],
      listCylinderGas: [],
    };
  }
  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    this.setState({
      user_cookies,
      user_type: user_cookies.user.userType,
      user_role: user_cookies.user.userRole,
      parentRoot: user_cookies.user.parentRoot,
    });
    await this.gelAllCylinder(id, token);
  }
  async gelAllCylinder(id, token) {
    let params = {
      id: id,
    };
    await callApi("GET", params, token).then((res) => {
      console.log("res", res);
    });
  }
  async clickSearchCylinder(value) {
    this.setState({ isLoading: true });
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let params = "";

    await callApi(
      "GET",
      SEARCH_CYLINDERGAS.replace("$serial", value.trim()),
      params,
      token
    ).then((res) => {
      console.log("res", res);
      let arr = [];
      this.setState({
        isLoading: false,
      });
      if (res.data.success === true) {
        arr.push({
          key: res.data.Cylinder.serial ? res.data.Cylinder.serial : "",
          idCylinder: res.data.Cylinder.id,
          serial: res.data.Cylinder.serial,
          classification: res.data.Cylinder.classification,
          color: res.data.Cylinder.color,
          valve: res.data.Cylinder.valve,
          weight: res.data.Cylinder.weight,
          manufacture: res.data.Manufacture.name,
          img_url: res.data.Cylinder.img_url,
        });
        this.setState({
          isLoading: false,
          listCylinderGas: arr,
        });
        message.success("T??m ki???m th??nh c??ng");
      } else {
        this.setState({
          isLoading: false,
        });
        message.error("Kh??ng c?? m?? b??nh ho???c nh???p sai");
        return false;
      }
    });
  }

  onClickEditCylinder = (value) => {
    const { listCylinderGas } = this.state;
    listCylinderGas.map((v) => {
      if (v.idCylinder === value) {
        this.setState({
          editListCylinderGas: v,
        });
      }
    });
    console.log("value", value);
  };

  async onClickDelCylinder(value) {
    const { listCylinderGas } = this.state;
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let params = {
      Cylinders: [
        {
          cylinderId: value,
        },
      ],
    };
    await callApi("POST", DELETE_CYLINDERGAS, params, token).then((res) => {
      console.log("res_del", res);
      if (res.data.success === true) {
        this.setState({
          listCylinderGas: listCylinderGas.filter(
            (e) => e.idCylinder !== value
          ),
        });
        message.success("X??a th??nh c??ng.");
      } else {
        message.error("X??a th???t b???i.");
        return false;
      }
    });
  }

  render() {
    const { isLoading, listCylinderGas } = this.state;
    console.log(listCylinderGas);
    const columns = [
      {
        title: "M??",
        dataIndex: "serial",
        key: "serial",
        width: 150,
      },
      {
        title: "T??nh tr???ng",
        dataIndex: "classification",
        key: "classification",
        width: 150,
        render: (classification) => {
          return <p>{classification === "New" ? "M???i" : "C??"}</p>;
        },
      },
      {
        title: "M??u s???c",
        dataIndex: "color",
        key: "color",
        width: 150,
      },
      {
        title: "Lo???i van",
        dataIndex: "valve",
        key: "valve",
        width: 150,
      },
      {
        title: "Tr???ng l?????ng v??? b??nh",
        dataIndex: "weight",
        key: "weight",
        width: 100,
      },
      {
        title: "Th????ng hi???u",
        dataIndex: "manufacture",
        key: "manufacture",
        width: 150,
      },
      {
        title: "H??nh ???nh",
        dataIndex: "img_url",
        key: "img_url",
        // fixed: "right",
        width: 150,
        render: (img) => {
          return <img src={img} />;
        },
      },
      {
        title: "Thao t??c",
        dataIndex: "idCylinder",
        key: "idCylinder",
        // fixed: "right",
        width: 200,
        render: (idd) => {
          if (
            (this.state.user_type === "Station" &&
              this.state.user_role !== "Deliver" &&
              this.state.user_role !== "Inspector") ||
            (this.state.user_type === "Agency" &&
              this.state.user_role !== "Deliver" &&
              this.state.user_role !== "Inspector" &&
              this.state.parentRoot !== "")
          ) {
            return null;
          }
          return (
            <div className="text-center">
              {((this.state.user_type === "Factory" &&
                this.state.user_role === "SuperAdmin") ||
                this.state.user_type === "Fixer") && (
                <a
                  className="btn btn-success"
                  data-toggle="modal"
                  data-target="#edit-product"
                  onClick={() => this.onClickEditCylinder(idd)}
                  disabled={this.state.isLoading}
                >
                  <Icon type="edit" />
                </a>
              )}
              {(this.state.user_type === "Factory" &&
                this.state.user_role !== "Deliver" &&
                this.state.user_role !== "Inspector") ||
              (this.state.user_type === "General" &&
                this.state.user_role !== "Deliver" &&
                this.state.user_role !== "Inspector") ||
              (this.state.user_type === "Agency" &&
                this.state.user_role !== "Deliver" &&
                this.state.user_role !== "Inspector" &&
                (this.state.user_role !== "SuperAdmin" ||
                  this.state.user_role !== "Owner")) ? (
                <Popconfirm
                  title="B???n c?? ch???c ch???n mu???n x??a?"
                  icon={
                    <Icon type="question-circle-o" style={{ color: "red" }} />
                  }
                  onConfirm={() => this.onClickDelCylinder(idd)}
                  okText="C??"
                  cancelText="Kh??ng"
                >
                  <a className="btn btn-danger" disabled={this.state.isLoading}>
                    <Icon type="delete" />
                  </a>
                </Popconfirm>
              ) : null}
            </div>
          );
        },
      },
    ];
    return (
      <div className="main-content" id="create-product-index">
        <div className="card">
          <div className="card-title">
            <div className="card-product">
              <div className="card-product-left mt-1">
                <h4>S???n ph???m</h4>
                {this.state.user_role !== "Deliver" &&
                  this.state.user_role !== "Inspector" && (
                    <div className="search-product-inputz ml-4">
                      <Search
                        placeholder="Nh???p m?? b??nh..."
                        enterButton="T??m ki???m"
                        className="search-cylinder"
                        onSearch={(value) => this.clickSearchCylinder(value)}
                        loading={isLoading}
                      />
                    </div>
                  )}
              </div>
              <Row>
                <div className="card-product-right">
                  {((this.state.user_type === "Factory" &&
                    this.state.user_role !== "Deliver" &&
                    this.state.user_role !== "Inspector" &&
                    this.state.user_role === "SuperAdmin") ||
                    (this.state.user_type === "Agency" &&
                      this.state.user_role !== "Deliver" &&
                      this.state.user_role !== "Inspector" &&
                      this.state.parentRoot === "")) && (
                    <button
                      className="btn btn-sm btn-primary kiemdinh"
                      data-toggle="modal"
                      data-target="#popup-create-product"
                      style={{ backgroundColor: "#F6921E" }}
                      disabled={isLoading}
                    >
                      T???o m???i b??nh
                    </button>
                  )}
                </div>
              </Row>
            </div>
          </div>

          <div className="card-body">
            <div className="table-responsive-xl">
              <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                <div className="row">
                  <div className="col-md-12">
                    <Table
                      className="text-center"
                      columns={columns}
                      dataSource={listCylinderGas}
                      bordered
                    />
                  </div>
                </div>
              </div>
              <AddCylinderGas />
              <EditCylinderGas cylinderGas={this.state.editListCylinderGas} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default CreateProduct;
