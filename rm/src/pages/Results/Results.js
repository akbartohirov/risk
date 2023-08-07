import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import Skeleton from "../../components/Skeleton/Skeleton";
import { scaleFunction, sumFunction, average } from "../../Utils/utils";
import Cookies from "js-cookie";
import classes from './Results.module.css'

const Results = ({ setSpin }) => {
  const [riskFactors, setRiskFactors] = useState([]);
  const [products, setProducts] = useState([]);
  const [statuses, setStatuses] = useState(["", "Low", "Medium", "High"]);
  const [selectedStatus, setSelectedStatuses] = useState(null);
  const [update, setUpdate] = useState(false)
  const [score, setScore] = useState({ mediumHigh: 5.50, lowMedium: 2.50 });
  const [factorWeight, setFactorWeight] = useState([])
  const toast = useRef();

  const geomean = (numbers) => {
    const multiplied = numbers.reduce((a, b) => a * b);

    const result = Math.pow(multiplied, 1 / numbers.length);

    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inst_riskFactor_data = await axios.get("/api/v1/institutions");
        const factors = inst_riskFactor_data.data.data.map((el) => el.riskFactor);
        setRiskFactors(factors);

        const products_data = await axios.get("/api/v1/products");


        const consolidatedQuestionaire = [
          geomean(factors.map((el) => scaleFunction(el.anonymityToTraceability))),
          geomean(factors.map((el) => scaleFunction(el.anonymityToMobility))),
          geomean(factors.map((el) => scaleFunction(el.anonymityToThirdPartyInvolvement))),
          geomean(factors.map((el) => scaleFunction(el.anonymityToCrossBorderTransaction))),
          geomean(factors.map((el) => scaleFunction(el.anonymityToVelocity))),
          geomean(factors.map((el) => scaleFunction(el.traceabilityToMobility))),
          geomean(factors.map((el) => scaleFunction(el.traceabilityToThirdPartyInvolvement))),
          geomean(factors.map((el) => scaleFunction(el.traceabilityToCrossBorderTransaction))),
          geomean(factors.map((el) => scaleFunction(el.traceabilityToVelocity))),
          geomean(factors.map((el) => scaleFunction(el.mobilityToThirdPartyInvolvement))),
          geomean(factors.map((el) => scaleFunction(el.mobilityToCrossBorderTransaction))),
          geomean(factors.map((el) => scaleFunction(el.mobilityToVelocity))),
          geomean(factors.map((el) => scaleFunction(el.thirdPartyInvolvementToCrossBorderTransaction))),
          geomean(factors.map((el) => scaleFunction(el.thirdPartyInvolvementToVelocity))),
          geomean(factors.map((el) => scaleFunction(el.crossBorderTransactionToVelocity))),
        ];

        const comparisonMatrix = [
          [
            1,
            consolidatedQuestionaire[0],
            consolidatedQuestionaire[1],
            consolidatedQuestionaire[2],
            consolidatedQuestionaire[3],
            consolidatedQuestionaire[4],
          ],
          [
            1 / consolidatedQuestionaire[0],
            1,
            consolidatedQuestionaire[5],
            consolidatedQuestionaire[6],
            consolidatedQuestionaire[7],
            consolidatedQuestionaire[8],
          ],
          [
            1 / consolidatedQuestionaire[1],
            1 / consolidatedQuestionaire[5],
            1,
            consolidatedQuestionaire[9],
            consolidatedQuestionaire[10],
            consolidatedQuestionaire[11],
          ],
          [
            1 / consolidatedQuestionaire[2],
            1 / consolidatedQuestionaire[6],
            1 / consolidatedQuestionaire[9],
            1,
            consolidatedQuestionaire[12],
            consolidatedQuestionaire[13],
          ],
          [
            1 / consolidatedQuestionaire[3],
            1 / consolidatedQuestionaire[7],
            1 / consolidatedQuestionaire[10],
            1 / consolidatedQuestionaire[12],
            1,
            consolidatedQuestionaire[14],
          ],
          [
            1 / consolidatedQuestionaire[4],
            1 / consolidatedQuestionaire[8],
            1 / consolidatedQuestionaire[11],
            1 / consolidatedQuestionaire[13],
            1 / consolidatedQuestionaire[14],
            1,
          ],
        ];

        const normalizedMatrix = [
          [
            comparisonMatrix[0][0] /
            sumFunction([
              comparisonMatrix[0][0],
              comparisonMatrix[1][0],
              comparisonMatrix[2][0],
              comparisonMatrix[3][0],
              comparisonMatrix[4][0],
              comparisonMatrix[5][0],
            ]),
            comparisonMatrix[0][1] /
            sumFunction([
              comparisonMatrix[0][1],
              comparisonMatrix[1][1],
              comparisonMatrix[2][1],
              comparisonMatrix[3][1],
              comparisonMatrix[4][1],
              comparisonMatrix[5][1],
            ]),
            comparisonMatrix[0][2] /
            sumFunction([
              comparisonMatrix[0][2],
              comparisonMatrix[1][2],
              comparisonMatrix[2][2],
              comparisonMatrix[3][2],
              comparisonMatrix[4][2],
              comparisonMatrix[5][2],
            ]),
            comparisonMatrix[0][3] /
            sumFunction([
              comparisonMatrix[0][3],
              comparisonMatrix[1][3],
              comparisonMatrix[2][3],
              comparisonMatrix[3][3],
              comparisonMatrix[4][3],
              comparisonMatrix[5][3],
            ]),
            comparisonMatrix[0][4] /
            sumFunction([
              comparisonMatrix[0][4],
              comparisonMatrix[1][4],
              comparisonMatrix[2][4],
              comparisonMatrix[3][4],
              comparisonMatrix[4][4],
              comparisonMatrix[5][4],
            ]),
            comparisonMatrix[0][5] /
            sumFunction([
              comparisonMatrix[0][5],
              comparisonMatrix[1][5],
              comparisonMatrix[2][5],
              comparisonMatrix[3][5],
              comparisonMatrix[4][5],
              comparisonMatrix[5][5],
            ]),
          ],
          [
            comparisonMatrix[1][0] /
            sumFunction([
              comparisonMatrix[0][0],
              comparisonMatrix[1][0],
              comparisonMatrix[2][0],
              comparisonMatrix[3][0],
              comparisonMatrix[4][0],
              comparisonMatrix[5][0],
            ]),
            comparisonMatrix[1][1] /
            sumFunction([
              comparisonMatrix[0][1],
              comparisonMatrix[1][1],
              comparisonMatrix[2][1],
              comparisonMatrix[3][1],
              comparisonMatrix[4][1],
              comparisonMatrix[5][1],
            ]),
            comparisonMatrix[1][2] /
            sumFunction([
              comparisonMatrix[0][2],
              comparisonMatrix[1][2],
              comparisonMatrix[2][2],
              comparisonMatrix[3][2],
              comparisonMatrix[4][2],
              comparisonMatrix[5][2],
            ]),
            comparisonMatrix[1][3] /
            sumFunction([
              comparisonMatrix[0][3],
              comparisonMatrix[1][3],
              comparisonMatrix[2][3],
              comparisonMatrix[3][3],
              comparisonMatrix[4][3],
              comparisonMatrix[5][3],
            ]),
            comparisonMatrix[1][4] /
            sumFunction([
              comparisonMatrix[0][4],
              comparisonMatrix[1][4],
              comparisonMatrix[2][4],
              comparisonMatrix[3][4],
              comparisonMatrix[4][4],
              comparisonMatrix[5][4],
            ]),
            comparisonMatrix[1][5] /
            sumFunction([
              comparisonMatrix[0][5],
              comparisonMatrix[1][5],
              comparisonMatrix[2][5],
              comparisonMatrix[3][5],
              comparisonMatrix[4][5],
              comparisonMatrix[5][5],
            ]),
          ],

          [
            comparisonMatrix[2][0] /
            sumFunction([
              comparisonMatrix[0][0],
              comparisonMatrix[1][0],
              comparisonMatrix[2][0],
              comparisonMatrix[3][0],
              comparisonMatrix[4][0],
              comparisonMatrix[5][0],
            ]),
            comparisonMatrix[2][1] /
            sumFunction([
              comparisonMatrix[0][1],
              comparisonMatrix[1][1],
              comparisonMatrix[2][1],
              comparisonMatrix[3][1],
              comparisonMatrix[4][1],
              comparisonMatrix[5][1],
            ]),
            comparisonMatrix[2][2] /
            sumFunction([
              comparisonMatrix[0][2],
              comparisonMatrix[1][2],
              comparisonMatrix[2][2],
              comparisonMatrix[3][2],
              comparisonMatrix[4][2],
              comparisonMatrix[5][2],
            ]),
            comparisonMatrix[2][3] /
            sumFunction([
              comparisonMatrix[0][3],
              comparisonMatrix[1][3],
              comparisonMatrix[2][3],
              comparisonMatrix[3][3],
              comparisonMatrix[4][3],
              comparisonMatrix[5][3],
            ]),
            comparisonMatrix[2][4] /
            sumFunction([
              comparisonMatrix[0][4],
              comparisonMatrix[1][4],
              comparisonMatrix[2][4],
              comparisonMatrix[3][4],
              comparisonMatrix[4][4],
              comparisonMatrix[5][4],
            ]),
            comparisonMatrix[2][5] /
            sumFunction([
              comparisonMatrix[0][5],
              comparisonMatrix[1][5],
              comparisonMatrix[2][5],
              comparisonMatrix[3][5],
              comparisonMatrix[4][5],
              comparisonMatrix[5][5],
            ]),
          ],

          [
            comparisonMatrix[3][0] /
            sumFunction([
              comparisonMatrix[0][0],
              comparisonMatrix[1][0],
              comparisonMatrix[2][0],
              comparisonMatrix[3][0],
              comparisonMatrix[4][0],
              comparisonMatrix[5][0],
            ]),
            comparisonMatrix[3][1] /
            sumFunction([
              comparisonMatrix[0][1],
              comparisonMatrix[1][1],
              comparisonMatrix[2][1],
              comparisonMatrix[3][1],
              comparisonMatrix[4][1],
              comparisonMatrix[5][1],
            ]),
            comparisonMatrix[3][2] /
            sumFunction([
              comparisonMatrix[0][2],
              comparisonMatrix[1][2],
              comparisonMatrix[2][2],
              comparisonMatrix[3][2],
              comparisonMatrix[4][2],
              comparisonMatrix[5][2],
            ]),
            comparisonMatrix[3][3] /
            sumFunction([
              comparisonMatrix[0][3],
              comparisonMatrix[1][3],
              comparisonMatrix[2][3],
              comparisonMatrix[3][3],
              comparisonMatrix[4][3],
              comparisonMatrix[5][3],
            ]),
            comparisonMatrix[3][4] /
            sumFunction([
              comparisonMatrix[0][4],
              comparisonMatrix[1][4],
              comparisonMatrix[2][4],
              comparisonMatrix[3][4],
              comparisonMatrix[4][4],
              comparisonMatrix[5][4],
            ]),
            comparisonMatrix[3][5] /
            sumFunction([
              comparisonMatrix[0][5],
              comparisonMatrix[1][5],
              comparisonMatrix[2][5],
              comparisonMatrix[3][5],
              comparisonMatrix[4][5],
              comparisonMatrix[5][5],
            ]),
          ],

          [
            comparisonMatrix[4][0] /
            sumFunction([
              comparisonMatrix[0][0],
              comparisonMatrix[1][0],
              comparisonMatrix[2][0],
              comparisonMatrix[3][0],
              comparisonMatrix[4][0],
              comparisonMatrix[5][0],
            ]),
            comparisonMatrix[4][1] /
            sumFunction([
              comparisonMatrix[0][1],
              comparisonMatrix[1][1],
              comparisonMatrix[2][1],
              comparisonMatrix[3][1],
              comparisonMatrix[4][1],
              comparisonMatrix[5][1],
            ]),
            comparisonMatrix[4][2] /
            sumFunction([
              comparisonMatrix[0][2],
              comparisonMatrix[1][2],
              comparisonMatrix[2][2],
              comparisonMatrix[3][2],
              comparisonMatrix[4][2],
              comparisonMatrix[5][2],
            ]),
            comparisonMatrix[4][3] /
            sumFunction([
              comparisonMatrix[0][3],
              comparisonMatrix[1][3],
              comparisonMatrix[2][3],
              comparisonMatrix[3][3],
              comparisonMatrix[4][3],
              comparisonMatrix[5][3],
            ]),
            comparisonMatrix[4][4] /
            sumFunction([
              comparisonMatrix[0][4],
              comparisonMatrix[1][4],
              comparisonMatrix[2][4],
              comparisonMatrix[3][4],
              comparisonMatrix[4][4],
              comparisonMatrix[5][4],
            ]),
            comparisonMatrix[4][5] /
            sumFunction([
              comparisonMatrix[0][5],
              comparisonMatrix[1][5],
              comparisonMatrix[2][5],
              comparisonMatrix[3][5],
              comparisonMatrix[4][5],
              comparisonMatrix[5][5],
            ]),
          ],

          [
            comparisonMatrix[5][0] /
            sumFunction([
              comparisonMatrix[0][0],
              comparisonMatrix[1][0],
              comparisonMatrix[2][0],
              comparisonMatrix[3][0],
              comparisonMatrix[4][0],
              comparisonMatrix[5][0],
            ]),
            comparisonMatrix[5][1] /
            sumFunction([
              comparisonMatrix[0][1],
              comparisonMatrix[1][1],
              comparisonMatrix[2][1],
              comparisonMatrix[3][1],
              comparisonMatrix[4][1],
              comparisonMatrix[5][1],
            ]),
            comparisonMatrix[5][2] /
            sumFunction([
              comparisonMatrix[0][2],
              comparisonMatrix[1][2],
              comparisonMatrix[2][2],
              comparisonMatrix[3][2],
              comparisonMatrix[4][2],
              comparisonMatrix[5][2],
            ]),
            comparisonMatrix[5][3] /
            sumFunction([
              comparisonMatrix[0][3],
              comparisonMatrix[1][3],
              comparisonMatrix[2][3],
              comparisonMatrix[3][3],
              comparisonMatrix[4][3],
              comparisonMatrix[5][3],
            ]),
            comparisonMatrix[5][4] /
            sumFunction([
              comparisonMatrix[0][4],
              comparisonMatrix[1][4],
              comparisonMatrix[2][4],
              comparisonMatrix[3][4],
              comparisonMatrix[4][4],
              comparisonMatrix[5][4],
            ]),
            comparisonMatrix[5][5] /
            sumFunction([
              comparisonMatrix[0][5],
              comparisonMatrix[1][5],
              comparisonMatrix[2][5],
              comparisonMatrix[3][5],
              comparisonMatrix[4][5],
              comparisonMatrix[5][5],
            ]),
          ],
        ];


        const weight = [
          average(normalizedMatrix[0]),
          average(normalizedMatrix[1]),
          average(normalizedMatrix[2]),
          average(normalizedMatrix[3]),
          average(normalizedMatrix[4]),
          average(normalizedMatrix[5]),
        ];
        setFactorWeight(weight);
        setProducts(products_data.data.data);
      } catch (err) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.response.data.data.message,
          life: 3000,
        });
      }
    };

    fetchData();
  }, [update]);


  const riskScoreUpdate = (rowData) => {
    let result = 0

    // Anonymity
    if (rowData.anonimity) {
      result = result + 10 * factorWeight[0]
    } else {
      result = result + 1 * factorWeight[0]
    }

    // Traceability
    if (rowData.traceability) {
      result = result + 10 * factorWeight[1]
    } else {
      result = result + 1 * factorWeight[1]
    }

    // Mobility
    if (rowData.mobility) {
      result = result + 10 * factorWeight[2]
    } else {
      result = result + 1 * factorWeight[2]
    }

    // Third-party Involvement
    if (rowData.thrdPartInv) {
      result = result + 10 * factorWeight[3]
    } else {
      result = result + 1 * factorWeight[3]
    }

    // Cross-border Transaction
    if (rowData.crosBorTran) {
      result = result + 10 * factorWeight[4]
    } else {
      result = result + 1 * factorWeight[4]
    }

    // Velocity
    if (rowData.velocity) {
      result = result + 10 * factorWeight[5]
    } else {
      result = result + 1 * factorWeight[5]
    }

    result = result.toFixed(2)


    return result
  }

  const automaticHighRisk = async (rowData, name) => {
    // initial
    const valueInitial = rowData.riskScore >= score.mediumHigh ? "High" : rowData.riskScore >= score.lowMedium ? "Medium" : "Low"

    // adjusting

    let valueAdjusted;

    if (rowData.depOfCer || rowData.payThrAcc || rowData.offsureZone || rowData.precMetel) {
      valueAdjusted = 'High'
    } else {
      valueAdjusted = rowData.riskScore >= score.mediumHigh ? "High" : rowData.riskScore >= score.lowMedium ? "Medium" : "Low"
    }

    console.log(
      valueInitial,
      valueAdjusted
    )

    const changed = products.map(el => {
      if (el._id === rowData._id) {
        el[name] = !el[name]
        el.initialRiskRating = valueInitial
        el.adjustedRiskRating = valueAdjusted
      }
      return el
    })

    setProducts(changed)

    console.log(changed)

    const data = changed.find(el => el._id === rowData._id)
    const token = Cookies.get('token')

    try {
      setSpin(true)
      const res = await axios.put(`/api/v1/update-product/${rowData._id}`, { ...data },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.statusText === 'OK') {
        setSpin(false)
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response.data.data.message,
        life: 3000,
      });
      setUpdate(prev => !prev)
      setSpin(false)
    }
  }

  const initialRiskRating = (rowData) => {
    const value = rowData.riskScore >= score.mediumHigh ? "High" : rowData.riskScore >= score.lowMedium ? "Medium" : "Low"
    const severity = rowData.riskScore >= score.mediumHigh ? "danger" : rowData.riskScore >= score.lowMedium ? "warning" : "success"
    return <Tag severity={severity} value={value} />;
  };

  const adjustedRiskRating = (rowData) => {
    let value;
    let severity;

    if (rowData.depOfCer || rowData.payThrAcc || rowData.offsureZone || rowData.precMetel) {
      value = 'High'
      severity = "danger"
    } else {
      value = rowData.riskScore >= score.mediumHigh ? "High" : rowData.riskScore >= score.lowMedium ? "Medium" : "Low"
      severity = rowData.riskScore >= score.mediumHigh ? "danger" : rowData.riskScore >= score.lowMedium ? "warning" : "success"
    }
    return <Tag severity={severity} value={value} />;
  };



  const switchHandler = async (rowData, name) => {
    const changed = products.map(el => {
      if (el._id === rowData._id) {
        el[name] = !el[name]
        el.riskScore = riskScoreUpdate(rowData)
      }
      return el
    })

    setProducts(changed)

    const data = changed.find(el => el._id === rowData._id)
    const token = Cookies.get('token')

    try {
      setSpin(true)
      const res = await axios.put(`/api/v1/update-product/${rowData._id}`, { ...data },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.statusText === 'OK') {
        setSpin(false)
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response.data.data.message,
        life: 3000,
      });
      setUpdate(prev => !prev)
      setSpin(false)
    }

  };





  const manualOverride = (rowData, name) => {
    return (
      <Dropdown
        value={rowData[name]}
        options={statuses}
        onChange={async (e) => {
          const _products = products.map((el) => {
            if (el._id === rowData._id) {
              el[name] = e.value;

              if (e.value === "") {
                el.finalRiskRating = el.adjustedRiskRating
              } else {
                el.finalRiskRating = e.value
              }

            }
            return el;
          });
          setRiskFactors(_products);

          console.log(_products)

          const data = _products.find(el => el._id === rowData._id)
          const token = Cookies.get('token')


          try {
            setSpin(true)
            const res = await axios.put(`/api/v1/update-product/${rowData._id}`, { ...data },
              { headers: { Authorization: `Bearer ${token}` } }
            )
            if (res.statusText === 'OK') {
              setSpin(false)
            }
          } catch (err) {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: err.response.data.data.message,
              life: 3000,
            });
            setUpdate(prev => !prev)
            setSpin(false)
          }

        }}
      />
    );
  };


  const rationaleChange = (e, rowData, name) => {
    let _products = products.map((el) => {
      if (el._id === rowData._id) {
        el[name] = e.target.value;
      }
      return el;
    });



    setRiskFactors(_products);

    console.log(_products)
  };

  const rationaleSend = async (rowData) => {

    const data = products.find(el => el._id === rowData._id)
    const token = Cookies.get('token')

    try {
      setSpin(true)
      const res = await axios.put(`/api/v1/update-product/${rowData._id}`, { ...data },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.statusText === 'OK') {
        setSpin(false)
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response.data.data.message,
        life: 3000,
      });
      setUpdate(prev => !prev)
      setSpin(false)
    }
  }

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(products);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'products');
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
          type: EXCEL_TYPE
        });

        module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
    });
  };

  const finalRiskRating = (rowData, name) => {
    let value
    let severity

    if (rowData.manualOverride === "") {
      value = rowData.adjustedRiskRating
    } else {
      if (rowData.finalRiskRating === 'High') {
        value = "High"
      } else if (rowData.finalRiskRating === 'Medium') {
        value = 'Medium'
      } else if (rowData.finalRiskRating === 'Low') {
        value = 'Low'
      }
    }

    if (value === 'High') {
      severity = 'danger'
    } else if (value === 'Medium') {
      severity = 'warning'
    } else if (value === 'Low') {
      severity = 'success'
    }

    return <Tag severity={severity} value={value} />;
  }



  return (
    <div className="card">

      <Toast ref={toast} />
      <Toolbar end={<Button severity="success" onClick={exportExcel} label="Excel" icon="pi pi-file-excel" />} />

      {riskFactors.length === 0 ? (
        <Skeleton />
      ) : (
        <>

          <DataTable
            scrollable
            scrollHeight="800px"
            showGridlines
            paginator
            size="small"
            rows={10}
            rowsPerPageOptions={[10, 20, 30, 40, 50]}
            value={products}
          >
            <Column style={{ minWidth: "200px" }} field={"product"} header="Product Name" />
            <Column
              body={(rowData) => (
                <InputSwitch
                  name="depOfCer"
                  checked={rowData.depOfCer}
                  onChange={(e) => automaticHighRisk(rowData, e.target.name)}
                />
              )}
              style={{ minWidth: "200px", textAlign: "center" }}
              field={"depOfCer"}
              header="Certificate of Deposit"
            />
            <Column
              body={(rowData) => (
                <InputSwitch
                  name="payThrAcc"
                  checked={rowData.payThrAcc}
                  onChange={(e) => automaticHighRisk(rowData, e.target.name)}
                />
              )}
              style={{ minWidth: "200px", textAlign: "center" }}
              field={"payThrAcc"}
              header="Payable-Through Account"
            />
            <Column
              body={(rowData) => (
                <InputSwitch
                  name="offsureZone"
                  checked={rowData.offsureZone}
                  onChange={(e) => automaticHighRisk(rowData, e.target.name)}
                />
              )}
              style={{ minWidth: "200px", textAlign: "center" }}
              field={"offsureZone"}
              header="Offshore Zone Account Transactions"
            />
            <Column
              body={(rowData) => (
                <InputSwitch
                  name="precMetel"
                  checked={rowData.precMetel}
                  onChange={(e) => automaticHighRisk(rowData, e.target.name)}
                />
              )}
              style={{ minWidth: "200px", textAlign: "center" }}
              field={"precMetel"}
              header="Precious Metal Transactions"
            />
            <Column
              body={(rowData) => (
                <InputSwitch
                  name="anonimity"
                  checked={rowData.anonimity}
                  onChange={(e) => switchHandler(rowData, e.target.name)}
                />
              )}
              style={{ minWidth: "200px", textAlign: "center" }}
              field={"anonimity"}
              header="Anonymity"
            />
            <Column
              body={(rowData) => (
                <InputSwitch
                  name="traceability"
                  checked={rowData.traceability}
                  onChange={(e) => switchHandler(rowData, e.target.name)}
                />
              )}
              style={{ minWidth: "200px", textAlign: "center" }}
              field={"traceability"}
              header="Traceability"
            />
            <Column
              body={(rowData) => (
                <InputSwitch
                  name="mobility"
                  checked={rowData.mobility}
                  onChange={(e) => switchHandler(rowData, e.target.name)}
                />
              )}
              style={{ minWidth: "200px", textAlign: "center" }}
              field={"mobility"}
              header="Mobility"
            />
            <Column
              body={(rowData) => (
                <InputSwitch
                  name="thrdPartInv"
                  checked={rowData.thrdPartInv}
                  onChange={(e) => switchHandler(rowData, e.target.name)}
                />
              )}
              style={{ minWidth: "200px", textAlign: "center" }}
              field={"thrdPartInv"}
              header="Third-party Involvement"
            />
            <Column
              body={(rowData) => (
                <InputSwitch
                  name="crosBorTran"
                  checked={rowData.crosBorTran}
                  onChange={(e) => switchHandler(rowData, e.target.name)}
                />
              )}
              style={{ minWidth: "200px", textAlign: "center" }}
              field={"crosBorTran"}
              header="Cross-border Transaction"
            />
            <Column
              body={(rowData) => (
                <InputSwitch
                  name="velocity"
                  checked={rowData.velocity}
                  onChange={(e) => switchHandler(rowData, e.target.name)}
                />
              )}
              style={{ minWidth: "200px", textAlign: "center" }}
              field={"velocity"}
              header="Velocity"
            />
            <Column style={{ minWidth: "200px", textAlign: "center" }}
              field="riskScore"
              header="Risk Score" />
            <Column
              style={{ minWidth: "200px", textAlign: "center" }}
              field={"initialRiskRating"}
              body={(rowData) => initialRiskRating(rowData, "initialRiskRating")}
              header="Initial Risk Rating"
            />
            <Column
              style={{ minWidth: "200px", textAlign: "center" }}
              field={"adjustedRiskRating"}
              body={(rowData) => adjustedRiskRating(rowData, "adjustedRiskRating")}
              header="Adjusted Risk Rating"
            />
            <Column
              style={{ minWidth: "200px", textAlign: "center" }}
              body={(rowData) => manualOverride(rowData, "manualOverride")}
              field={"manualOverride"}
              header="Manual Override"
            />
            <Column
              style={{ minWidth: "200px", textAlign: "center" }}
              body={(rowData) => (
                <div className="flex" >
                  <InputText value={rowData.rationale || ""} onChange={(e) => rationaleChange(e, rowData, "rationale")} />
                  <Button icon="pi pi-check" className="ml-1" onClick={e => rationaleSend(rowData)} />
                </div>
              )}
              field={"rationale"}
              header="Rationale"
            />
            <Column
              style={{ minWidth: "200px", textAlign: "center" }}
              field={"finalRiskRating"}
              body={(rowData) => finalRiskRating(rowData, "finalRiskRating")}
              header="Final Risk Rating"
            />
          </DataTable>
        </>
      )}
    </div>
  );
};

export default Results;
