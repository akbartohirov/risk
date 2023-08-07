import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import axios from "axios";
import Skeleton from "../../components/Skeleton/Skeleton";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const toast = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get("/api/v1/departments");
        setDepartments(data.data.data);
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
  }, []);

  return (
    <div className="card">
      <Toast ref={toast} />
      {departments.length === 0 ? (
        <Skeleton />
      ) : (
        <DataTable value={departments}>
          <Column field="department" header="Departments" />
        </DataTable>
      )}
    </div>
  );
};

export default Departments;
