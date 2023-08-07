import { useState, useEffect, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { Menubar } from "primereact/menubar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import Skeleton from "../../components/Skeleton/Skeleton";
import { Tag } from "primereact/tag";
import { multiply } from "mathjs";
import Cookies from "js-cookie";


const Questionaire = () => {
  const [factors, setFactors] = useState([]);
  const [factor, setFactor] = useState({});
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [mainUser, setMainUser] = useState(null);
  const [factorStatus, setFactorStatus] = useState({ value: "Done", severity: "success" });
  const toast = useRef(null);

  const { id } = useParams();

  function scaleFunction(number) {
    const calculated = number > 5 ? 1 / (number - 4) : 6 - number;
    const result = Math.round(calculated * 100) / 100;
    if (result) {
      return result;
    }
  }

  function sumFunction(arr) {
    return arr.reduce((a, b) => a + b);
  }

  useEffect(() => {
    const fetchData = async () => {

      const token = Cookies.get('token')

      try {
        const riskFactor_response = await axios.get(`/api/v1/institutions`);
        const mianUser_response = await axios.get(`/api/v1/user/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setMainUser(mianUser_response.data.data);
        setFactors(riskFactor_response.data.data);
        const usersData = riskFactor_response.data.data.map((el) => el.user);
        const factorData = riskFactor_response.data.data.find((el) => el.user._id === id);
        setFactor(factorData);
        setUsers(usersData);
        setUser(usersData.find((el) => el._id === id));
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
  }, [id]);

  const dateFormat = (date) => {
    const newDate = new Date(date);

    return new Intl.DateTimeFormat("ru-RU").format(newDate);
  };

  //comparison matrix

  function statusFunction(factor) {
    const comparisonMatrix = [
      [
        1,
        scaleFunction(factor.riskFactor.anonymityToTraceability),
        scaleFunction(factor.riskFactor.anonymityToMobility),
        scaleFunction(factor.riskFactor.anonymityToThirdPartyInvolvement),
        scaleFunction(factor.riskFactor.anonymityToCrossBorderTransaction),
        scaleFunction(factor.riskFactor.anonymityToVelocity),
      ],
      [
        1 / scaleFunction(factor.riskFactor.anonymityToTraceability),
        1,
        scaleFunction(factor.riskFactor.traceabilityToMobility),
        scaleFunction(factor.riskFactor.traceabilityToThirdPartyInvolvement),
        scaleFunction(factor.riskFactor.traceabilityToCrossBorderTransaction),
        scaleFunction(factor.riskFactor.traceabilityToVelocity),
      ],
      [
        1 / scaleFunction(factor.riskFactor.anonymityToMobility),
        1 / scaleFunction(factor.riskFactor.traceabilityToMobility),
        1,
        scaleFunction(factor.riskFactor.mobilityToThirdPartyInvolvement),
        scaleFunction(factor.riskFactor.mobilityToCrossBorderTransaction),
        scaleFunction(factor.riskFactor.mobilityToVelocity),
      ],
      [
        1 / scaleFunction(factor.riskFactor.anonymityToThirdPartyInvolvement),
        1 / scaleFunction(factor.riskFactor.traceabilityToThirdPartyInvolvement),
        1 / scaleFunction(factor.riskFactor.mobilityToThirdPartyInvolvement),
        1,
        scaleFunction(factor.riskFactor.thirdPartyInvolvementToCrossBorderTransaction),
        scaleFunction(factor.riskFactor.thirdPartyInvolvementToVelocity),
      ],
      [
        1 / scaleFunction(factor.riskFactor.anonymityToCrossBorderTransaction),
        1 / scaleFunction(factor.riskFactor.traceabilityToCrossBorderTransaction),
        1 / scaleFunction(factor.riskFactor.mobilityToCrossBorderTransaction),
        1 / scaleFunction(factor.riskFactor.thirdPartyInvolvementToCrossBorderTransaction),
        1,
        scaleFunction(factor.riskFactor.crossBorderTransactionToVelocity),
      ],
      [
        1 / scaleFunction(factor.riskFactor.anonymityToVelocity),
        1 / scaleFunction(factor.riskFactor.traceabilityToVelocity),
        1 / scaleFunction(factor.riskFactor.mobilityToVelocity),
        1 / scaleFunction(factor.riskFactor.thirdPartyInvolvementToVelocity),
        1 / scaleFunction(factor.riskFactor.crossBorderTransactionToVelocity),
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
      sumFunction(normalizedMatrix[0]) / normalizedMatrix[0].length,
      sumFunction(normalizedMatrix[1]) / normalizedMatrix[1].length,
      sumFunction(normalizedMatrix[2]) / normalizedMatrix[2].length,
      sumFunction(normalizedMatrix[3]) / normalizedMatrix[3].length,
      sumFunction(normalizedMatrix[4]) / normalizedMatrix[4].length,
      sumFunction(normalizedMatrix[5]) / normalizedMatrix[5].length,
    ];

    const multipliedMatrix = multiply(comparisonMatrix, weight);

    const consistancyValidation = [
      [...multipliedMatrix],
      [
        multipliedMatrix[0] / weight[0],
        multipliedMatrix[1] / weight[1],
        multipliedMatrix[2] / weight[2],
        multipliedMatrix[3] / weight[3],
        multipliedMatrix[4] / weight[4],
        multipliedMatrix[5] / weight[5],
      ],
    ];

    const LMax = sumFunction(consistancyValidation[1]) / consistancyValidation[1].length;

    const CI = (LMax - consistancyValidation[0].length) / (consistancyValidation[0].length - 1);

    const CR = CI / 1.24;

    // console.log(comparisonMatrix);
    // console.log(normalizedMatrix);
    // console.log(weight);
    // console.log(consistancyValidation);
    // console.log(LMax, CI, CR);

    if (CR <= 0.15) {
      setFactorStatus({ value: "Done", severity: "success" });
    } else {
      setFactorStatus({ value: "X (Redo)", severity: "danger" });
    }
  }

  return (
    <div className="card">
      <Toast ref={toast} />
      <Menubar
        start={
          <h4 className="my-0 mx-2">
            Last updated: <i>{factor.updatedAt && dateFormat(factor.updatedAt)}</i>
          </h4>
        }
        model={[
          {
            label: "Save",
            icon: "pi pi-save",
            command: async () => {
              try {
                if (factor.user._id === id) {
                  const response = await axios.put(`/api/v1/update-institution/${factor._id}`, {
                    ...factor.riskFactor,
                  });

                  toast.current.show({
                    severity: "success",
                    summary: response.data.status,
                    detail: response.data.data.message,
                    life: 3000,
                  });
                }
              } catch (err) {
                toast.current.show({
                  severity: "error",
                  summary: "Error",
                  detail: err.response.data.data.message,
                  life: 3000,
                });
              }
            },
          },
          {
            label: "Check",
            icon: "pi pi-calculator",
            command: () => statusFunction(factor),
          },
        ]}
        end={
          <>
            <span className="mr-5">
              Status: <Tag severity={factorStatus.severity} value={factorStatus.value} />
            </span>

            {mainUser?.isAdmin && (
              <Dropdown
                value={user}
                onChange={(e) => {
                  setUser(e.value);
                  const selectedField = factors.find((el) => el.user._id === e.value._id);
                  setFactor(selectedField);
                }}
                options={users}
                placeholder="Select an Institution"
                optionLabel={"name"}
              />
            )}
          </>
        }
      />

      {factors.length === 0 ? (
        <Skeleton />
      ) : (
        <div className="doc-tablewrapper">
          <table className="doc-table p-component">
            <thead>
              <tr>
                <th style={{ width: "15%" }}>Risk Factor</th>
                <th style={{ width: "30%" }}>Equel</th>
                <th style={{ width: "15%" }}>Comparison</th>
                <th style={{ width: "15%" }}>Ref. Index</th>
                <th style={{ width: "15%" }}>Scale</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Anonimity</td>
                <td>
                  <input
                    onChange={(e) =>
                      setFactor({
                        ...factor,
                        riskFactor: {
                          ...factor.riskFactor,
                          [e.target.name]: Number(e.target.value),
                        },
                      })
                    }
                    value={factor?.riskFactor?.anonymityToTraceability || 5}
                    min={1}
                    max={9}
                    step={1}
                    style={{ width: "100%" }}
                    type="range"
                    name="anonymityToTraceability"
                  />
                </td>
                <td>Traceability</td>
                <td>{factor?.riskFactor?.anonymityToTraceability}</td>
                <td>{scaleFunction(factor?.riskFactor?.anonymityToTraceability) || 1}</td>
              </tr>

              <tr>
                <td>Anonimity</td>
                <td>
                  <input
                    onChange={(e) =>
                      setFactor({
                        ...factor,
                        riskFactor: {
                          ...factor.riskFactor,
                          [e.target.name]: Number(e.target.value),
                        },
                      })
                    }
                    value={factor?.riskFactor?.anonymityToMobility || 5}
                    min={1}
                    max={9}
                    step={1}
                    style={{ width: "100%" }}
                    type="range"
                    name="anonymityToMobility"
                  />
                </td>
                <td>Mobility</td>
                <td>{factor?.riskFactor?.anonymityToMobility}</td>
                <td>{scaleFunction(factor?.riskFactor?.anonymityToMobility) || 1}</td>
              </tr>

              <tr>
                <td>Anonimity</td>
                <td>
                  <input
                    onChange={(e) =>
                      setFactor({
                        ...factor,
                        riskFactor: {
                          ...factor.riskFactor,
                          [e.target.name]: Number(e.target.value),
                        },
                      })
                    }
                    value={factor?.riskFactor?.anonymityToThirdPartyInvolvement || 5}
                    min={1}
                    max={9}
                    step={1}
                    style={{ width: "100%" }}
                    type="range"
                    name="anonymityToThirdPartyInvolvement"
                  />
                </td>
                <td>Third Party Involvement</td>
                <td>{factor?.riskFactor?.anonymityToThirdPartyInvolvement}</td>
                <td>{scaleFunction(factor?.riskFactor?.anonymityToThirdPartyInvolvement) || 1}</td>
              </tr>

              <tr>
                <td>Anonimity</td>
                <td>
                  <input
                    onChange={(e) =>
                      setFactor({
                        ...factor,
                        riskFactor: {
                          ...factor.riskFactor,
                          [e.target.name]: Number(e.target.value),
                        },
                      })
                    }
                    value={factor?.riskFactor?.anonymityToCrossBorderTransaction || 5}
                    min={1}
                    max={9}
                    step={1}
                    style={{ width: "100%" }}
                    type="range"
                    name="anonymityToCrossBorderTransaction"
                  />
                </td>
                <td>Cross Border Transaction</td>
                <td>{factor?.riskFactor?.anonymityToCrossBorderTransaction}</td>
                <td>{scaleFunction(factor?.riskFactor?.anonymityToCrossBorderTransaction) || 1}</td>
              </tr>

              <tr>
                <td>Anonimity</td>
                <td>
                  <input
                    onChange={(e) =>
                      setFactor({
                        ...factor,
                        riskFactor: {
                          ...factor.riskFactor,
                          [e.target.name]: Number(e.target.value),
                        },
                      })
                    }
                    value={factor?.riskFactor?.anonymityToVelocity || 5}
                    min={1}
                    max={9}
                    step={1}
                    style={{ width: "100%" }}
                    type="range"
                    name="anonymityToVelocity"
                  />
                </td>
                <td>Velocity</td>
                <td>{factor?.riskFactor?.anonymityToVelocity}</td>
                <td>{scaleFunction(factor?.riskFactor?.anonymityToVelocity) || 1}</td>
              </tr>

              <tr>
                <td>Traceability</td>
                <td>
                  <input
                    onChange={(e) =>
                      setFactor({
                        ...factor,
                        riskFactor: {
                          ...factor.riskFactor,
                          [e.target.name]: Number(e.target.value),
                        },
                      })
                    }
                    value={factor?.riskFactor?.traceabilityToMobility || 5}
                    min={1}
                    max={9}
                    step={1}
                    style={{ width: "100%" }}
                    type="range"
                    name="traceabilityToMobility"
                  />
                </td>
                <td>Mobility</td>
                <td>{factor?.riskFactor?.traceabilityToMobility}</td>
                <td>{scaleFunction(factor?.riskFactor?.traceabilityToMobility) || 1}</td>
              </tr>

              <tr>
                <td>Traceability</td>
                <td>
                  <input
                    onChange={(e) =>
                      setFactor({
                        ...factor,
                        riskFactor: {
                          ...factor.riskFactor,
                          [e.target.name]: Number(e.target.value),
                        },
                      })
                    }
                    value={factor?.riskFactor?.traceabilityToThirdPartyInvolvement || 5}
                    min={1}
                    max={9}
                    step={1}
                    style={{ width: "100%" }}
                    type="range"
                    name="traceabilityToThirdPartyInvolvement"
                  />
                </td>
                <td>Third Party Involvement</td>
                <td>{factor?.riskFactor?.traceabilityToThirdPartyInvolvement}</td>
                <td>{scaleFunction(factor?.riskFactor?.traceabilityToThirdPartyInvolvement) || 1}</td>
              </tr>

              <tr>
                <td>Traceability</td>
                <td>
                  <input
                    onChange={(e) =>
                      setFactor({
                        ...factor,
                        riskFactor: {
                          ...factor.riskFactor,
                          [e.target.name]: Number(e.target.value),
                        },
                      })
                    }
                    value={factor?.riskFactor?.traceabilityToCrossBorderTransaction || 5}
                    min={1}
                    max={9}
                    step={1}
                    style={{ width: "100%" }}
                    type="range"
                    name="traceabilityToCrossBorderTransaction"
                  />
                </td>
                <td>Cross Border Transaction</td>
                <td>{factor?.riskFactor?.traceabilityToCrossBorderTransaction}</td>
                <td>{scaleFunction(factor?.riskFactor?.traceabilityToCrossBorderTransaction) || 1}</td>
              </tr>

              <tr>
                <td>Traceability</td>
                <td>
                  <input
                    onChange={(e) =>
                      setFactor({
                        ...factor,
                        riskFactor: {
                          ...factor.riskFactor,
                          [e.target.name]: Number(e.target.value),
                        },
                      })
                    }
                    value={factor?.riskFactor?.traceabilityToVelocity || 5}
                    min={1}
                    max={9}
                    step={1}
                    style={{ width: "100%" }}
                    type="range"
                    name="traceabilityToVelocity"
                  />
                </td>
                <td>Velocity</td>
                <td>{factor?.riskFactor?.traceabilityToVelocity}</td>
                <td>{scaleFunction(factor?.riskFactor?.traceabilityToVelocity) || 1}</td>
              </tr>

              <tr>
                <td>Mobility</td>
                <td>
                  <input
                    onChange={(e) =>
                      setFactor({
                        ...factor,
                        riskFactor: {
                          ...factor.riskFactor,
                          [e.target.name]: Number(e.target.value),
                        },
                      })
                    }
                    value={factor?.riskFactor?.mobilityToThirdPartyInvolvement || 5}
                    min={1}
                    max={9}
                    step={1}
                    style={{ width: "100%" }}
                    type="range"
                    name="mobilityToThirdPartyInvolvement"
                  />
                </td>
                <td>Third Party Involvement</td>
                <td>{factor?.riskFactor?.mobilityToThirdPartyInvolvement}</td>
                <td>{scaleFunction(factor?.riskFactor?.mobilityToThirdPartyInvolvement) || 1}</td>
              </tr>

              <tr>
                <td>Mobility</td>
                <td>
                  <input
                    onChange={(e) =>
                      setFactor({
                        ...factor,
                        riskFactor: {
                          ...factor.riskFactor,
                          [e.target.name]: Number(e.target.value),
                        },
                      })
                    }
                    value={factor?.riskFactor?.mobilityToCrossBorderTransaction || 5}
                    min={1}
                    max={9}
                    step={1}
                    style={{ width: "100%" }}
                    type="range"
                    name="mobilityToCrossBorderTransaction"
                  />
                </td>
                <td>Cross Border Transaction</td>
                <td>{factor?.riskFactor?.mobilityToCrossBorderTransaction}</td>
                <td>{scaleFunction(factor?.riskFactor?.mobilityToCrossBorderTransaction) || 1}</td>
              </tr>

              <tr>
                <td>Mobility</td>
                <td>
                  <input
                    onChange={(e) =>
                      setFactor({
                        ...factor,
                        riskFactor: {
                          ...factor.riskFactor,
                          [e.target.name]: Number(e.target.value),
                        },
                      })
                    }
                    value={factor?.riskFactor?.mobilityToVelocity || 5}
                    min={1}
                    max={9}
                    step={1}
                    style={{ width: "100%" }}
                    type="range"
                    name="mobilityToVelocity"
                  />
                </td>
                <td>Velocity</td>
                <td>{factor?.riskFactor?.mobilityToVelocity}</td>
                <td>{scaleFunction(factor?.riskFactor?.mobilityToVelocity) || 1}</td>
              </tr>

              <tr>
                <td>Third Party Involvement</td>
                <td>
                  <input
                    onChange={(e) =>
                      setFactor({
                        ...factor,
                        riskFactor: {
                          ...factor.riskFactor,
                          [e.target.name]: Number(e.target.value),
                        },
                      })
                    }
                    value={factor?.riskFactor?.thirdPartyInvolvementToCrossBorderTransaction || 5}
                    min={1}
                    max={9}
                    step={1}
                    style={{ width: "100%" }}
                    type="range"
                    name="thirdPartyInvolvementToCrossBorderTransaction"
                  />
                </td>
                <td>Cross Border Transaction</td>
                <td>{factor?.riskFactor?.thirdPartyInvolvementToCrossBorderTransaction}</td>
                <td>{scaleFunction(factor?.riskFactor?.thirdPartyInvolvementToCrossBorderTransaction)}</td>
              </tr>

              <tr>
                <td>Third Party Involvement </td>
                <td>
                  <input
                    onChange={(e) =>
                      setFactor({
                        ...factor,
                        riskFactor: {
                          ...factor.riskFactor,
                          [e.target.name]: Number(e.target.value),
                        },
                      })
                    }
                    value={factor?.riskFactor?.thirdPartyInvolvementToVelocity || 5}
                    min={1}
                    max={9}
                    step={1}
                    style={{ width: "100%" }}
                    type="range"
                    name="thirdPartyInvolvementToVelocity"
                  />
                </td>
                <td>Velocity</td>
                <td>{factor?.riskFactor?.thirdPartyInvolvementToVelocity}</td>
                <td>{scaleFunction(factor?.riskFactor?.thirdPartyInvolvementToVelocity) || 1}</td>
              </tr>

              <tr>
                <td>Cross Border Transaction</td>
                <td>
                  <input
                    onChange={(e) =>
                      setFactor({
                        ...factor,
                        riskFactor: {
                          ...factor.riskFactor,
                          [e.target.name]: Number(e.target.value),
                        },
                      })
                    }
                    value={factor?.riskFactor?.crossBorderTransactionToVelocity || 5}
                    min={1}
                    max={9}
                    step={1}
                    style={{ width: "100%" }}
                    type="range"
                    name="crossBorderTransactionToVelocity"
                  />
                </td>
                <td>Velocity</td>
                <td>{factor?.riskFactor?.crossBorderTransactionToVelocity}</td>
                <td>{scaleFunction(factor?.riskFactor?.crossBorderTransactionToVelocity) || 1}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Questionaire;
