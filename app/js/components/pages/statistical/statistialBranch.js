import React, { Component, useState, useEffect, useRef } from "react";
import { Divider,Col, DatePicker, Row, Select, Table, Modal, Form, Button, Pagination } from "antd";
import moment from "moment";
import getDashboardFixer from "../../../../api/getDashboardFixer";
import getUserCookies from "getUserCookies";
import detailDashboardFixer from "../../../../api/detailDashboardFixer";
import getDetailCylindersImexExcels from "../../../../api/getDetailCylindersImexExcels";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";
const monthFormat = "YYYY/MM";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];
import "./statistialBranch.css";
function statistialBranch() {
    const [isLoading, setLoading] = useState(true);
    const [itemsPerPages,setItemsPerPages]=useState(10);
    const[numberPages,setNumberPages]=useState(0);
    const [startTime, setStartTime] = useState(moment());
    const [endTime, setEndTime] = useState(moment());
    const [newCylinder, setNewCylinder] = useState([]);
    const [exportedCylinder, setExportedCylinder] = useState([]);
    const [inventoryCylinder, setInventoryCylinder] = useState([]);
    const [visible, setVisible] = useState(false);
    const [detailNewCylinder, setDetailNewCylinder] = useState([]);
    const [detailExportCylinder, setDetailExportCylinder] = useState([]);
    const [detailInventoryCylinder, setDetailInventoryCylinder] = useState([]);
    const [checkModal, setCheckModal] = useState("");
    const [activeThisTime, setActiveThisTime] = useState(false);
    const [systemTime, setSystemTime] = useState(new Date(0).toISOString());
    const [statusClick, setStatusClick] = useState(false);
    const refInput = useRef();
    const [id, setId] = useState("");
    useEffect(() => {
        const { current } = refInput;
        async function history(startTime, endTime) {
            let user_cookies = await getUserCookies();
            let sumnew = 0;
            let sumexported = 0;
            let suminventory = 0;
            let resultDashboard = await getDashboardFixer(user_cookies.user.id, startTime, endTime, "NEW");
            if (resultDashboard.data.success === true) {
                // T??nh t???ng s??? l?????ng b??nh khai b??o m???i
                resultDashboard.data.Declaration.map((value) => {
                    sumnew += value.number;
                });
                let sumNewCylinder = {
                    name: "T???ng",
                    number: sumnew,
                };
                // T??nh t???ng s??? l?????ng b??nh ???? xu???t
                resultDashboard.data.Export.map((value) => {
                    sumexported += value.number;
                });
                let sumExportedCylinder = {
                    name: "T???ng",
                    number: sumexported,
                };
                // T??nh t???ng s??? l?????ng b??nh t???n kho
                resultDashboard.data.Inventory.map((value) => {
                    suminventory += value.number;
                });
                let sumInventoryCylinder = {
                    name: "T???ng",
                    number: suminventory,
                };

                // Gh??p object T???ng v??o m???ng
                resultDashboard.data.Declaration[resultDashboard.data.Declaration.length] = sumNewCylinder;
                resultDashboard.data.Export[resultDashboard.data.Export.length] = sumExportedCylinder;
                resultDashboard.data.Inventory[resultDashboard.data.Inventory.length] = sumInventoryCylinder;

                setNewCylinder(resultDashboard.data.Declaration);
                setExportedCylinder(resultDashboard.data.Export);
                setInventoryCylinder(resultDashboard.data.Inventory);
                setLoading(false);
            }
        }
        history(startTime, endTime);
    }, []);
    const columns_khaibaobinhmoi = [
        {
            title: "KHAI B??O V??? M???I",
            children: [
                { title: "Lo???i b??nh", align: 'center',dataIndex: "name",render:(text, record, index)=>{
                    return <div style={inventoryCylinder.length-1===index?{ fontWeight: 'bold' }:{}} >{record.name}</div>;
                } },
                {
                    title: "S??? l?????ng",
                    align: 'center',
                    dataIndex: "number",
                    render: (text, record, index) => {
                        return <div style={inventoryCylinder.length-1===index?{ fontWeight: 'bold' }:{}}>{record.number.toLocaleString("nl-BE")}</div>;
                    },
                },
                {
                    title: "Thao t??c",
                    align: 'center',
                    render: (text, record, index) =>
                        newCylinder.length >= 1 && record.number !== 0 ? (
                            <Button type="primary" htmlType="submit" onClick={() => handleSeeNew(record)}>
                                Xem
                            </Button>
                        ) : (
                            <Button type="primary" onClick={() => handleSeeInventory1(record)}>
                                Xem
                            </Button>
                        ),
                },
            ],
        },
    ];
    const columns_binhdaxuat = [
        {
            title: "V??? ???? XU???T",
            children: [
                { title: "Lo???i b??nh", align: 'center',dataIndex: "name",render:(text, record, index)=>{
                    return <div style={inventoryCylinder.length-1===index?{ fontWeight: 'bold' }:{}} >{record.name}</div>;
                } },
                {
                    title: "S??? l?????ng",
                    align: 'center',
                    dataIndex: "number",
                    render: (text, record, index) => {
                        return <div style={inventoryCylinder.length-1===index?{ fontWeight: 'bold' }:{}}>{record.number.toLocaleString("nl-BE")}</div>;
                    },
                },
                {
                    title: "Thao t??c",
                    align: 'center',
                    render: (text, record, index) =>
                        exportedCylinder.length >= 1 && record.number !== 0 ? (
                            <Button type="primary" htmlType="submit" onClick={() => handleSeeExported(record)}>
                                Xem
                            </Button>
                        ) : (
                            <Button type="primary" htmlType="submit" onClick={() => handleSeeInventory1(record)}>
                                Xem
                            </Button>
                        ),
                },
            ],
        },
    ];
    const columns_binhtonkho = [
        {
            title: "V??? T???N KHO",
            children: [
                { title: "Lo???i b??nh", align: 'center',dataIndex: "name",render:(text, record, index)=>{
                    return <div style={inventoryCylinder.length-1===index?{ fontWeight: 'bold' }:{}} >{record.name}</div>;
                } },
                {
                    title: "S??? l?????ng",
                    align: 'center',
                    dataIndex: "number",
                    render: (text, record, index) => {
                        console.log("record 2212",record);
                        console.log("record 2212",index);
                        console.log("record 2212",inventoryCylinder.length)
                        return <div style={inventoryCylinder.length-1===index?{ fontWeight: 'bold' }:{}} >{record.number.toLocaleString("nl-BE")}</div>;
                    },
                },
                {
                    title: "Thao t??c",
                    align: 'center',
                    render: (text, record, index) =>
                        inventoryCylinder.length >= 1 && record.number !== 0 ? (
                            <Button type="primary" htmlType="submit" onClick={() => handleSeeInventory(record)}>
                                Xem
                            </Button>
                        ) : (
                            <Button type="primary" htmlType="submit" onClick={() => handleSeeInventory1(record)}>
                                Xem
                            </Button>
                        ),
                },
            ],
        },
    ];
    const columns = [
        {
            title: "Danh S??ch Chi Ti???t V??? LPG",
            align: "center",
            children: [
                { title: "STT", dataIndex: "index", align: "center" },
                { title: "S??? Seri", dataIndex: "serial", align: "center" },
                { title: "M??u s???c", dataIndex: "color", align: "center" },
                { title: "Lo???i van", dataIndex: "valve", align: "center" },
                { title: "C??n n???ng", dataIndex: "weight", align: "center" },
                {
                    title: "Ng??y ki???m ?????nh",
                    // dataIndex: "checkedDate",
                    align: "center",
                    render: (record, index) => {
                        const moment = require("moment");
                        const isCorrectFormat = (dateString, format) => {
                            return moment(dateString, format, true).isValid();
                        };
                        return (
                            <div>
                                {isCorrectFormat(record.checkedDate, "DD/MM/YYYY") === true
                                    ? record.checkedDate
                                    : moment(record.checkedDate).format("DD/MM/YYYY")}
                            </div>
                        );
                    },
                },
                { title: "Th????ng hi???u", dataIndex: "manufacture", align: "center" },
                { title: "Lo???i b??nh", dataIndex: "category", align: "center" },
            ],
        },
    ];

    function handleTime(value) {
        setStartTime(value[0]);
        setEndTime(value[1]);
    }
    // L???y ng??y hi???n t???i
    function handleThisTime(e) {
        //Javascript
        var el = document.getElementsByClassName("btn-history");
        el[0].classList.add("active");
        el[1].classList.remove("active");
        el[2].classList.remove("active");
        el[3].classList.remove("active");
        setStartTime(moment());
        setEndTime(moment());
    }
    // L???y ng??y h??m qua
    function handleYesterday() {
        //Jquey
        $(".btn-history").each(function(item, index) {
            if (item === 0) {
                $(this).removeClass("active");
            }
            if (item === 1) {
                $(this).addClass("active");
            }
            if (item === 2) {
                $(this).removeClass("active");
            }
            if (item === 3) {
                $(this).removeClass("active");
            }
        });
        // el1[1].className += "active";
        // console.log("el[1].className",el1[1].className);
        setStartTime(moment().subtract(1, "days"), moment().subtract(1, "days"));
        setEndTime(moment().subtract(1, "days"), moment().subtract(1, "days"));
    }
    //L???y ng??y trong tu???n
    function handleThisWeek() {
        //Jquey
        $(".btn-history").each(function(item, index) {
            if (item === 0) {
                $(this).removeClass("active");
            }
            if (item === 1) {
                $(this).removeClass("active");
            }
            if (item === 2) {
                $(this).addClass("active");
            }
            if (item === 3) {
                $(this).removeClass("active");
            }
        });
        setStartTime(moment().startOf("week"));
        setEndTime(moment().endOf("week"));
    }
    //L???y ng??y trong th??ng
    function handleThisMonth() {
        //Jquey
        $(".btn-history").each(function(item, index) {
            if (item === 0) {
                $(this).removeClass("active");
            }
            if (item === 1) {
                $(this).removeClass("active");
            }
            if (item === 2) {
                $(this).removeClass("active");
            }
            if (item === 3) {
                $(this).addClass("active");
            }
        });
        setStartTime(moment().startOf("month"));
        setEndTime(moment().endOf("month"));
    }

    async function handleSeeDashboard() {
        setLoading(true);
        let sumnew = 0;
        let sumexported = 0;
        let suminventory = 0;
        let user_cookies = await getUserCookies();
        let resultDashboard = await getDashboardFixer(user_cookies.user.id, startTime, endTime, "NEW");
        if (resultDashboard.data.success === true) {
            // T??nh t???ng s??? l?????ng b??nh khai b??o m???i
            resultDashboard.data.Declaration.map((value) => {
                sumnew += value.number;
            });
            let sumNewCylinder = {
                name: "T???ng",
                number: sumnew,
            };
            // T??nh t???ng s??? l?????ng b??nh ???? xu???t
            resultDashboard.data.Export.map((value) => {
                sumexported += value.number;
            });
            let sumExportedCylinder = {
                name: "T???ng",
                number: sumexported,
            };
            // T??nh t???ng s??? l?????ng b??nh t???n kho
            resultDashboard.data.Inventory.map((value) => {
                suminventory += value.number;
            });
            let sumInventoryCylinder = {
                name: "T???ng",
                number: suminventory,
            };

            // Gh??p object T???ng v??o m???ng
            resultDashboard.data.Declaration[resultDashboard.data.Declaration.length] = sumNewCylinder;
            resultDashboard.data.Export[resultDashboard.data.Export.length] = sumExportedCylinder;
            resultDashboard.data.Inventory[resultDashboard.data.Inventory.length] = sumInventoryCylinder;

            setNewCylinder(resultDashboard.data.Declaration);
            setExportedCylinder(resultDashboard.data.Export);
            setInventoryCylinder(resultDashboard.data.Inventory);
            setStatusClick(true);
        }
        setLoading(false);
    }

    async function handleSeeNew(record) {
        setLoading(true);
        setCheckModal("1");
        setId(record.id);
        let detailNewCylinder = [];
        let user_cookies = await getUserCookies();
        setVisible(true);
        let resultDetail = await detailDashboardFixer(
            user_cookies.user.id,
            statusClick === false ? systemTime : startTime,
            endTime,
            "NEW",
            "IN",
            record.id ? record.id : null,
            "CREATE"
        );
        if (resultDetail.data.success === true) {
            resultDetail.data.Cylinders.map((value, index) => {
                detailNewCylinder.push({
                    index: index + 1,
                    id: value.id,
                    serial: value.serial,
                    color: value.color,
                    valve: value.valve,
                    weight: value.weight,
                    checkedDate: value.checkedDate,
                    category: value.category,
                    manufacture: value.manufacture,
                });
            });
            setDetailNewCylinder(detailNewCylinder);
        }
        setNumberPages(Math.ceil(resultDetail.data.Cylinders_Count / itemsPerPages));
        setLoading(false);
    }

    async function handleSeeExported(record) {
        setLoading(true);
        setCheckModal("2");
        setId(record.id);
        let detailExportCylinder = [];
        let user_cookies = await getUserCookies();
        setVisible(true);

        let resultDetail = await detailDashboardFixer(
            user_cookies.user.id,
            statusClick === false ? systemTime : startTime,
            endTime,
            "NEW",
            "OUT",
            record.id ? record.id : null,
            "EXPORT_CELL"
        );
        console.log("detailExportCylinder",resultDetail);
        if (resultDetail.data.success === true) {
            resultDetail.data.Cylinders.map((value, index) => {
                detailExportCylinder.push({
                    index: index + 1,
                    id: value.id,
                    serial: value.serial,
                    color: value.color,
                    valve: value.valve,
                    weight: value.weight,
                    checkedDate: value.checkedDate,
                    category: value.category,
                    manufacture: value.manufacture,
                });
            });
            console.log("detailExportCylinder",detailExportCylinder);
            setDetailExportCylinder(detailExportCylinder);
        }
        setNumberPages(Math.ceil(resultDetail.data.Cylinders_Count / itemsPerPages));
        setLoading(false);
    }

    async function handleSeeInventory1() {
        alert("Kh??ng c?? d??? li???u");
    }
    async function handleSeeInventory(record) {
        setLoading(true);
        setCheckModal("3");
        setId(record.id);
        let detailInventoryCylinder = [];
        let user_cookies = await getUserCookies();
        setVisible(true);
        let resultDetail = await detailDashboardFixer(
            user_cookies.user.id,
            statusClick === false ? systemTime : startTime,
            endTime,
            "NEW",
            null,
            record.id ? record.id : null
        );
        if (resultDetail.data.success === true) {
            resultDetail.data.Cylinders.map((value, index) => {
                detailInventoryCylinder.push({
                    index: index + 1,
                    id: value.id,
                    serial: value.serial,
                    color: value.color,
                    valve: value.valve,
                    weight: value.weight,
                    checkedDate: value.checkedDate,
                    category: value.category,
                    manufacture: value.manufacture,
                });
            });
            setDetailInventoryCylinder(detailInventoryCylinder);
        }
        setNumberPages(Math.ceil(resultDetail.data.Cylinders_Count / itemsPerPages));
        setLoading(false);
    }
    function handleSubmit() {
        //  alert("L???y d??? li???u xu???t excel th??nh c??ng");
        const table = refInput.current.querySelectorAll("table");
        console.log("refInput", refInput.current.querySelectorAll("table"));
        var i;
        for (i = 0; i < table.length; i++) {
            console.log(table[i]);
            if (i === 3) {
                table[i].setAttribute("id", "table-to-xls");
            }
        }
    }
    async function handleSeeExcel() {
        let user_cookies = await getUserCookies();
        if (checkModal === "1") {
            const data = await getDetailCylindersImexExcels(user_cookies.user.id, startTime, endTime, "NEW", "IN", id, "CREATE");
        } else if (checkModal === "2") {
            const data = await getDetailCylindersImexExcels(user_cookies.user.id, startTime, endTime, "NEW", "OUT", id, "EXPORT_CELL");
        } else if (checkModal === "3") {
            const data = await getDetailCylindersImexExcels(user_cookies.user.id, startTime, endTime, "NEW", null, id, null);
        }
    }
  async  function  handleChangePage  (onPage){
        setLoading(true);
    if( checkModal==="1"){
        let detailNewCylinder = [];
        let user_cookies = await getUserCookies();
        let resultDetail = await detailDashboardFixer(
            user_cookies.user.id,
            statusClick === false ? systemTime : startTime,
            endTime,
            "NEW",
            "IN",
            id ? id : null,
            "CREATE",
            onPage,
            itemsPerPages
        );
        if (resultDetail.data.success === true) {
            resultDetail.data.Cylinders.map((value, index) => {
                detailNewCylinder.push({
                    index: index + 1,
                    id: value.id,
                    serial: value.serial,
                    color: value.color,
                    valve: value.valve,
                    weight: value.weight,
                    checkedDate: value.checkedDate,
                    category: value.category,
                    manufacture: value.manufacture,
                });
            });
            setDetailNewCylinder(detailNewCylinder);
        }
        setLoading(false);   
    }    
    if( checkModal==="2"){
        let detailExportCylinder = [];
        let user_cookies = await getUserCookies();
            let resultDetail = await detailDashboardFixer(
            user_cookies.user.id,
            statusClick === false ? systemTime : startTime,
            endTime,
            "NEW",
            "OUT",
            id ? id : null,
            "EXPORT_CELL",
            onPage,
            itemsPerPages
        );
        if (resultDetail.data.success === true) {
            resultDetail.data.Cylinders.map((value, index) => {
                detailExportCylinder.push({
                    index: index + 1,
                    id: value.id,
                    serial: value.serial,
                    color: value.color,
                    valve: value.valve,
                    weight: value.weight,
                    checkedDate: value.checkedDate,
                    category: value.category,
                    manufacture: value.manufacture,
                });
            });
            setDetailExportCylinder(detailExportCylinder);
        }
        setLoading(false);    
    }
    if( checkModal==="3"){
        let detailInventoryCylinder = [];
        let user_cookies = await getUserCookies();
        let resultDetail = await detailDashboardFixer(
            user_cookies.user.id,
            statusClick === false ? systemTime : startTime,
            endTime,
            "NEW",
            null,
            id ? id : null,
            "",
            onPage,
            itemsPerPages
        );
        console.log("resultDetail",resultDetail);
        if (resultDetail.data.success === true) {
            resultDetail.data.Cylinders.map((value, index) => {
                detailInventoryCylinder.push({
                    index: index + 1,
                    id: value.id,
                    serial: value.serial,
                    color: value.color,
                    valve: value.valve,
                    weight: value.weight,
                    checkedDate: value.checkedDate,
                    category: value.category,
                    manufacture: value.manufacture,
                });
            });
            setDetailInventoryCylinder(detailInventoryCylinder);
        }
        setLoading(false);     
    }
        
    }
    return (
        <form ref={refInput} onSubmit={handleSubmit}>
            <div className="section-statistical">
                <div className="section-statistical">
                    <div className="section-statistical__report">
                        <h1>B??o c??o th???ng k?? b??nh m???i</h1>
                        <div className="section-statistical__report__title">
                            <div className="container-fluid">
                                <div className="row border rouded">
                                    <div className="col-12 d-flex mt-3">
                                        <h2>Th???i gian</h2>
                                        <button className={activeThisTime === false ? "btn-history active" : "btn-history"} onClick={handleThisTime} value="1">
                                            H??m nay
                                        </button>
                                        <button className="btn-history" onClick={handleYesterday}>
                                            H??m qua
                                        </button>
                                        <button className="btn-history" onClick={handleThisWeek}>
                                            Tu???n n??y
                                        </button>
                                        <button className="btn-history" onClick={handleThisMonth}>
                                            Th??ng n??y
                                        </button>
                                        <div className="RangePicker--custom">
                                            <RangePicker value={[startTime, endTime]} format={"DD/MM/YYYY"} onChange={handleTime} />
                                        </div>
                                        <div>
                                            <button className="btn-see" onClick={handleSeeDashboard}>
                                                Xem
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="section-statistical__report__body mt-2">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-4">
                                        <Table columns={columns_khaibaobinhmoi} dataSource={newCylinder} pagination={false} bordered loading={isLoading} />
                                    </div>
                                    <div className="col-4">
                                        <Table columns={columns_binhdaxuat} dataSource={exportedCylinder} pagination={false} bordered loading={isLoading} />
                                    </div>
                                    <div className="col-4">
                                        <Table columns={columns_binhtonkho} dataSource={inventoryCylinder} pagination={false} bordered loading={isLoading} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal centered visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)} width={1000}>
                <div className="section-statistical__report">
                    <div className="section-statistical__report__body">
                        <div className="container-fluid">
                            <Table
                                dataSource={
                                    checkModal === "1"
                                        ? detailNewCylinder
                                        : checkModal === "2"
                                        ? detailExportCylinder
                                        : checkModal === "3"
                                        ? detailInventoryCylinder
                                        : ""
                                }
                                columns={columns}
                                pagination={true}
                                bordered
                                loading={isLoading}
                                pagination={
                                        {
                                            defaultCurrent:1,
                                            defaultPageSize:itemsPerPages,
                                            total:numberPages * itemsPerPages,
                                            onChange:(onPage) => handleChangePage(onPage)
                                        }
                                }
                            />
                             {/* <Divider orientation="center">
                                <Pagination
                                    defaultCurrent={1}
                                    defaultPageSize={this.state.itemsPerPages}
                                    total={this.state.numberPages * this.state.itemsPerPages}
                                    onChange={(onPage) => this.handleChangePage(onPage)}
                                
                                />
                            </Divider> */}
                            <Form.Item>
                                <Button type="primary" size="large" onClick={() => handleSeeExcel()}>
                                    Xu???t excel
                                </Button>
                            </Form.Item>
                        </div>
                    </div>
                </div>
            </Modal>
        </form>
    );
}
export default statistialBranch;
