import React from "react";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
//import Select2 from 'react-select';
import Button from "react-validation/build/button";
import required from "required";
import showToast from "showToast";
import getUserCookies from "getUserCookies";
import { Radio } from "antd";
import getDestinationUserAPI from "getDestinationUserAPI";
import getListFixerPartnerApi from "getListFixerPartner";
import Constants from "Constants";
// import getAllUserApi from "getAllUserApi";
import getAllPartnerAPI from "getPartnerAPI";
import getAllFactoryAPI from "getAllFactoryAPI";
import "./product.scss";
import getAllTypeGas from "getAllTypeGas";
class AddProductPopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.options = [];
    this.state = {
      cylinderType: "",
      color: "",
      valve: "",
      weight: "",
      checkedDate: "",
      status: "",
      emptyOrFull: "",
      currentImportPrice: "",
      usingType: "",
      user_type: "",
      user_role: "",
      checkCongtyCon: 1,
      value: 1,
      listconttycon: "",
      activePage: 1,
      options: [],
      options2: [],
      doitac: "",
      factoryy: "",
      listUserFixer: [],
      listTypeGas: [],
      category: "",
      listStation: [],
    };
  }

  /*handleCharacter = (e) => {
        if (e.keyCode === 69 || e.keyCode === 107 || e.keyCode === 109) {
            e.preventDefault();
        }
        let target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]: value
        });
    }*/

  onChangeType = (e) => {
    this.setState({
      usingType: e.target.value,
    });
  };

  onradioChange = (e) => {
    e.preventDefault();
    this.setState({
      factoryy: e.target.value,
      listconttycon: e.target.value,
      doitac: e.target.value,
    });
  };

  onChangeCurrent = async (e) => {
    // console.log('radio checked', e.target.value);
    e.preventDefault();
    await this.setState(
      {
        value: e.target.value,
      },
      () => {}
    );

    if (e.target.value === 2) {
      document.getElementById("listconttycon").style.display = "block";
      document.getElementById("doitac").style.display = "none";
      document.getElementById("factoryy").style.display = "none";
    } else if (e.target.value === 3) {
      document.getElementById("doitac").style.display = "block";
      document.getElementById("listconttycon").style.display = "none";
      document.getElementById("factoryy").style.display = "none";
    } else if (e.target.value === 1) {
      document.getElementById("factoryy").style.display = "block";

      document.getElementById("listconttycon").style.display = "none";
      document.getElementById("doitac").style.display = "none";
      await this.setState({
        listconttycon: "",
        doitac: "",
      });
    }
  };

  async getListFixer() {
    // console.log('luc', dataUsers)
    const dataUsers = await getDestinationUserAPI(
      Constants.FACTORY,
      "",
      Constants.OWNER
    );

    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        // console.log('status OK');
        // var select = $('<select id="duy">')
        // this.setState({
        this.options = dataUsers.data.map((user) => {
          return {
            value: user.id,
            label: user.name,
          };
        });
        // })
      } else {
        showToast(
          dataUsers.data.message
            ? dataUsers.data.message
            : dataUsers.data.err_msg,
          2000
        );
      }
    } else {
      showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u");
    }
  }

  // async getAllPartner() {
  //     const arr = []
  //     const dataUserRelation = await getAllPartnerAPI();
  //     // console.log("ducvidai", dataUserRelation)
  //     if (dataUserRelation) {

  //         if (dataUserRelation.status === Constants.HTTP_SUCCESS_BODY) {
  //             dataUserRelation.data.map(item => {
  //                 arr.push(item.id)
  //             })

  //         } else {
  //             showToast(dataUserRelation.data.message ? dataUserRelation.data.message : dataUserRelation.data.err_msg, 2000);
  //         }

  //     } else {
  //         showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u");
  //     }

  // }

  // async getAllFactory(page = this.state.activePage) {
  //     //const jobMetaData = await this.getJobMetaData();
  //     const arr = []
  //     const dataUsers = await getAllFactoryAPI(page);
  //     console.log('doi tac', dataUsers)
  //     if (dataUsers) {
  //         if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
  //             // dataUsers.data.data.map(async item => {
  //             //     arr.push({ item, checked: false })
  //             // })

  //             this.setState({
  //                 options2: dataUsers.data.data.map((user) => {
  //                     return {
  //                         value: user.id,
  //                         label: user.name
  //                     }
  //                 })
  //             })
  //         } else {
  //             showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
  //         }

  //     } else {
  //         showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u");
  //     }
  // }
  async getList() {
    // console.log('duc vi dai', dataUsers)
    const dataUsers = await getDestinationUserAPI(Constants.FIXER);
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        let listFactoryBacks = [];

        // for (let i = 0; i < dataUsers.data.length; i++) {
        //     listFactoryBacks.push({
        //         value: dataUsers.data[i].id,
        //         label: dataUsers.data[i].name,
        //         ...dataUsers.data[i],
        //     });
        // }
        this.setState({
          options2: dataUsers.data.map((user) => {
            return {
              value: user.id,
              label: user.name,
            };
          }),
        });

        // this.setState({ listUserFixer: listFactoryBacks }, () =>
        //     console.log("DUC VIDAI", this.state.listUserFixer)
        // );
      } else {
        // showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
      }

      //this.setState({image_link: profile.data.company_logo});
    } else {
      showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u");
    }
  }
  // async getFixer() {
  //     const dataUsers = await getDestinationUserAPI(Constants.FIXER);
  //     if (dataUsers) {
  //         if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
  //             console.log('ducvidai', dataUsers);
  //             // let listFactoryBacks = [];
  //             this.setState({
  //                 options2: dataUsers.data.map((user) => {
  //                     return {
  //                         value: user.id,
  //                         label: user.name
  //                     }
  //                 })
  //             })

  //             // this.setState({ listUserFixer: listFactoryBacks });
  //         } else {
  //             showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
  //         }

  //         //this.setState({image_link: profile.data.company_logo});
  //     } else {
  //         showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u");
  //     }
  // }

  async componentDidMount() {
    const user_cookies = await getUserCookies();
    this.setState(
      {
        user_type: user_cookies.user.userType,
        user_role: user_cookies.user.userRole,
      },
      () => {}
    );

    await this.getListFixer();
    // await this.getAllPartner();
    // await this.getAllFactory();
    await this.getList();
    await this.getAllTypeGas();
  }

  componentDidUpdate(prevProps) {}

  fileChangedHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  selectOptionHandler = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value,
    });
  };

  async getAllTypeGas() {
    const dataUsers = await getAllTypeGas(Constants.GENERAL);
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        let listArrTypeGas = [];
        for (let i = 0; i < dataUsers.data.data.length; i++) {
          listArrTypeGas.push({
            value: dataUsers.data.data[i].id,
            label: dataUsers.data.data[i].name,
            ...dataUsers.data.data[i],
          });
        }

        this.setState({
          listTypeGas: listArrTypeGas,
        });
      } else {
        showToast(
          dataUsers.data.message
            ? dataUsers.data.message
            : dataUsers.data.err_msg,
          2000
        );
      }
      //this.setState({image_link: profile.data.company_logo});
    } else {
      showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u");
    }
  }

  async submit(event) {
    event.preventDefault();
    let data = this.form.getValues();
    console.clear();
    console.log(data);
    if (data.color.length < 2 || data.color.length > 20) {
      showToast("Vui l??ng nh???p input m??u s???c t??? 2 t???i 20 k?? t???");
    } else if (data.serial.length > 15) {
      showToast("Vui l??ng nh???p input m?? s???n ph???m t??? 1 t???i 15 k?? t???");
    } else if (data.valve.length > 20) {
      showToast("Vui l??ng nh???p input lo???i van t??? 1 t???i 20 k?? t???");
    } else if (data.weight.length > 7) {
      showToast("Vui l??ng nh???p input lo???i van t??? 1 t???i 7 k?? t???");
    } else {
      console.log(this.state.usingType);
      await this.props.addProduct(
        data.serial,
        data.color,
        data.checkedDate,
        data.weight,
        this.state.user_type === "Factory"
          ? Constants.PLACESTATUS_ENUM[0].key
          : Constants.PLACESTATUS_ENUM[6].key,
        "EMPTY",
        //data.currentImportPrice,
        this.state.usingType,
        this.props.listManufacturers[parseInt(data.manufacture)].id,
        data.valve,
        this.state.listconttycon,
        this.state.doitac,
        // this.state.category,
        this.state.listTypeGas[parseInt(data.typegas)].id
        //data.typegas
      );

      const modal = $("#create-product");
      modal.modal("hide");

      return;
    }
  }

  render() {
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };
    const { value } = this.state;
    return (
      <div className="modal fade" id="create-product" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">T???o m???i s???n ph???m</h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                ref={(c) => {
                  this.form = c;
                }}
                className="card"
                onSubmit={(event) => this.submit(event)}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>M??</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="serial"
                          validations={[required]}
                        />
                      </div>
                      <div className="form-group">
                        <label>Ph??n lo???i</label>
                        <div className="form-group">
                          <Radio.Group
                            onChange={this.onChangeType}
                            value={this.state.usingType}
                            validations={[required]}
                          >
                            <Radio value="New">B??nh s???n xu???t m???i</Radio>
                            <Radio value="Old">B??nh s???a ch???a</Radio>
                          </Radio.Group>
                        </div>
                      </div>
                      {/* <div className="form-group">
                                                <label>Lo???i b??nh</label>
                                                <Select className="form-control"
                                                    name="cylinderType"
                                                    id="cylinderType"
                                                    value={this.state.cylinderType}
                                                    onChange={this.selectOptionHandler}
                                                    validations={[required]}>
                                                    <option value=''>-- Ch???n --</option>
                                                    <option value="CYL12KG">B??nh 12 KG Th?????ng</option>
                                                    <option value="CYL12KGCO">B??nh 12 KG Compact</option>
                                                    <option value="CYL45KG">B??nh 45 KG</option>
                                                    <option value="CYL50KG">B??nh 50 KG</option>
                                                </Select>
                                            </div> */}
                      <div className="form-group">
                        <label>M??u s???c</label>
                        {/*<Select className="form-control"
                                                    name="color"
                                                    id="color"
                                                    value={this.state.color}
                                                    onChange={this.selectOptionHandler}
                                                    validations={[required]}>
                                                    <option value=''>-- Ch???n --</option>
                                                    <option value="X??m">X??m</option>
                                                    <option value="?????">?????</option>
                                                    <option value="V??ng">V??ng</option>
                                                    <option value="Shell">Shell</option>
                                                    <option value="VT">VT</option>
                                                    <option value="Petro">Petro</option>
                                                    <option value="Cam">Cam</option>
                                                </Select>*/}
                        {/* <Select className="form-control"
                                                        name="color"
                                                        validations={[required]}>
                                                    <option value="">-- Ch???n --</option>
                                                    {Constants.COLOR_ENUM.map((item, index) => 
                                                        <option value={index} key={index}>{item.value}
                                                        </option>)}
                                                </Select> */}
                        <Input
                          className="form-control"
                          type="text"
                          name="color"
                          id="color"
                          value={this.state.color}
                          validations={[required]}
                        />
                      </div>
                      <div className="form-group">
                        <label>Lo???i van</label>
                        {/*<Select className="form-control"
                                                    name="valve"
                                                    id="valve"
                                                    value={this.state.valve}
                                                    onChange={this.selectOptionHandler}
                                                    validations={[required]}>
                                                    <option value=''>-- Ch???n --</option>
                                                    <option value="POL">POL</option>
                                                    <option value="COMPACT">COMPACT</option>
                                                    <option value="2 Van">2 Van</option>
                                                </Select>*/}
                        {/* <Select className="form-control"
                                                        name="color"
                                                        validations={[required]}>
                                                    <option value="">-- Ch???n --</option>
                                                    {Constants.COLOR_ENUM.map((item, index) => <option value={index}
                                                    key={index}>{item.value}</option>)}
                                                </Select> */}
                        <Input
                          className="form-control"
                          type="text"
                          name="valve"
                          id="color"
                          value={this.state.valve}
                          validations={[required]}
                        />
                      </div>
                    </div>

                    {/*<div className="form-group">
                                                <label>Gi?? tham kh???o </label>
                                                <Input className="form-control"
                                                    type="number"
                                                    name="currentImportPrice"
                                                    id="currentImportPrice"
                                                    value={this.state.currentImportPrice} />
                                            </div>*/}
                    {/*<div className="col-md-6">
                                            <div>H??nh ???nh</div>
                                            <input type="file" name="logo" data-provide="dropify"
                                                onChange={(event) => this.fileChangedHandler(event)} />
                                        </div>*/}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Tr???ng l?????ng v??? b??nh</label>
                        <Input
                          className="form-control"
                          type="number"
                          name="weight"
                          id="weight"
                          value={this.state.weight}
                          validations={[required]}
                        />
                      </div>
                      <div className="form-group">
                        <label>Ng??y ki???m ?????nh</label>
                        <div
                          className="input-group"
                          style={{ display: "flex", flexWrap: "nowrap" }}
                        >
                          <Input
                            ref={this.expiration_dateRef}
                            type="text"
                            className="form-control"
                            value={this.state.checkedDate}
                            autocomplete="off"
                            validations={[required]}
                            name="checkedDate"
                            id="checkedDate"
                            data-date-format="dd/mm/yyyy"
                            data-provide="datepicker"
                          />
                          <div className="input-group-append">
                            <span className="input-group-text">
                              <i className="fa fa-calendar"></i>
                            </span>
                          </div>
                        </div>
                        {/* <Input className="form-control" type="datetime" name="checkedDate" id="checkedDate" value={this.state.checkedDate} validations={[required]} />*/}
                      </div>
                      <div className="form-group">
                        <label>Th????ng hi???u</label>
                        <Select
                          className="form-control"
                          name="manufacture"
                          validations={[required]}
                        >
                          <option value="">-- Ch???n --</option>
                          {this.props.listManufacturers.map((item, index) => (
                            <option value={index} key={index}>
                              {item.name}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="form-group">
                        <label>Lo???i b??nh</label>
                        <Select
                          className="form-control"
                          name="typegas"
                          validations={[required]}
                        >
                          <option value="">-- Ch???n --</option>
                          {this.state.listTypeGas.map((item, index) => (
                            <option value={index} key={index}>
                              {item.name}
                            </option>
                          ))}
                        </Select>
                      </div>
                      {/* <div className="form-group">
                                                <label>Th????ng nh??n s??? h???u</label>
                                                <Select className="form-control"
                                                        name="factory"
                                                        validations={[required]}>
                                                    <option value="">-- Ch???n --</option>
                                                    {this.props.listFactory.map((item, index) => <option value={index}>{item.name}</option>)}
                                                </Select>
                                            </div> */}
                      {/* <div className="form-group">
                                                <label>C???a h??ng b??n l???</label>
                                                <Select className="form-control"
                                                        name="agency"
                                                        >
                                                    <option value="">-- Ch???n --</option>
                                                    {this.props.listAgency.map((item, index) => <option value={index}>{item.name}</option>)}
                                                </Select>
                                            </div> */}

                      <div className="form-group group">
                        {/* <label>{this.state.user_type === "Factory" ? "V??? tr?? hi???n t???i: T???i th????ng nh??n s??? h???u" : "V??? tr?? hi???n t???i: T???i c???a h??ng b??n l???"} </label> */}

                        <Radio.Group
                          onChange={this.onChangeCurrent}
                          value={value}
                          className=""
                        >
                          <Radio
                            onChange={this.onChangeCurrent}
                            style={radioStyle}
                            value={1}
                            id="factoryy"
                            name="factoryy"
                          >
                            <label
                              onChange={this.onChangeCurrent}
                              id="factoryy"
                              name="factoryy"
                            >
                              {this.state.user_type === "Factory"
                                ? "V??? tr?? hi???n t???i: T???i th????ng nh??n s??? h???u"
                                : "V??? tr?? hi???n t???i: T???i H??? Th???ng CH B??n L???"}
                            </label>
                          </Radio>
                          <Radio
                            style={radioStyle}
                            value={2}
                            id="group1"
                            onChange={this.onChangeCurrent}
                          >
                            <label className="group1">
                              {this.state.user_role ===
                              "cylinderAt_childFactory"
                                ? "V??? tr?? hi???n t???i: T???i th????ng nh??n s??? h???u"
                                : "V??? tr?? hi???n t???i: T???i C??ng ty - Chi nh??nh tr???c thu???c"}
                            </label>
                            <Select
                              className="form-control control1"
                              id="listconttycon"
                              name="listconttycon"
                              style={{
                                display: "none",
                                position: "relative",
                                top: "50px",
                              }}
                              onChange={this.onradioChange}
                            >
                              <option value="">-- Ch???n --</option>
                              {this.options.map((item, index) => (
                                <option value={item.value} key={index}>
                                  {item.label}
                                </option>
                              ))}
                            </Select>
                          </Radio>
                          <Radio
                            style={radioStyle}
                            value={3}
                            className="value3"
                            onChange={this.onChangeCurrent}
                          >
                            <label className="value3">
                              V??? tr?? hi???n t???i: Nh?? m??y s???a ch???a
                            </label>
                            <Select
                              className="form-control"
                              onChange={this.onradioChange}
                              id="doitac"
                              name="doitac"
                              style={{
                                display: "none",
                                position: "absolute",
                                top: "60px",
                              }}
                            >
                              <option value="">-- Ch???n --</option>
                              {this.state.options2.map((item, index) => (
                                <option value={item.value} key={index}>
                                  {item.label}
                                </option>
                              ))}
                            </Select>
                          </Radio>
                        </Radio.Group>

                        {/* <Select className="form-control"
                                                    id="doitac"
                                                    name="doitac"
                                                    style={{ display: 'none' }}
                                                    onChange={this.onChange}
                                                >
                                                    <option value="">-- Ch???n --</option>
                                                    {this.state.options2.map((item, index) => <option
                                                        value={item.value} key={index}>{item.label}</option>)}
                                                </Select> */}
                        {/* <label>{this.state.user_type === "Factory" ? "V??? tr?? hi???n t???i: T???i th????ng nh??n s??? h???u" : "V??? tr?? hi???n t???i: T???i H??? Th???ng CH B??n L???"} </label> */}
                      </div>
                    </div>

                    {/*<div className="form-group">*/}
                    {/*<label>C??c v??? tr??</label>*/}
                    {/*<TagAutoComplete getPosition={this.getPosition.bind(this)}*/}
                    {/*data={this.state.job_titles}/>*/}
                    {/*</div>*/}
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button className="btn btn-primary">L??u</Button>

                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                  >
                    ????ng
                  </button>
                </footer>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddProductPopup.propType = {
  addStore: PropType.func.isRequired,
  jobMetaData: PropType.object.isRequired,
  updateStoreImage: PropType.func.isRequired,
};

export default AddProductPopup;
