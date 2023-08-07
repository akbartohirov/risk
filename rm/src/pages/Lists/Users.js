import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import Skeleton from "../../components/Skeleton/Skeleton";
import Cookies from "js-cookie";

const Users = () => {
  let emptyUser = {
    name: "",
    password: "",
  };

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(emptyUser);

  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    async function fetchData() {

      const token = Cookies.get('token')

      try {
        const data = await axios.get("/api/v1/all-users", { headers: { Authorization: `Bearer ${token}` } });
        setUsers(data.data.data);
      } catch (err) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.response.data.data.message,
          life: 3000,
        });
      }
    }

    fetchData();
  }, []);

  const openNew = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const hideDeleteUsersDialog = () => {
    setDeleteUsersDialog(false);
  };

  const confirmDeleteProduct = (user) => {
    setUser(user);
    setDeleteUserDialog(true);
  };

  const deleteProduct = () => {
    let _users = users.filter((val) => val.id !== user.id);

    setUsers(_users);
    setDeleteUserDialog(false);
    setUser(emptyUser);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "User Deleted",
      life: 3000,
    });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteUsersDialog(true);
  };

  const deleteSelectedUsers = () => {
    let _users = users.filter((val) => !selectedUsers.includes(val));

    setUsers(_users);
    setDeleteUsersDialog(false);
    setSelectedUsers(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
      life: 3000,
    });
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedUsers || !selectedUsers.length}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Products</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );
  const UserDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined />
      <Button label="Save" icon="pi pi-check" />
    </React.Fragment>
  );
  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
    </React.Fragment>
  );
  const deleteUsersDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUsersDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedUsers} />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        {users.length === 0 ? (
          <Skeleton />
        ) : (
          <DataTable
            showGridlines
            size="small"
            ref={dt}
            value={users}
            selection={selectedUsers}
            onSelectionChange={(e) => setSelectedUsers(e.value)}
            dataKey="_id"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            globalFilter={globalFilter}
            header={header}
          >
            <Column style={{ maxWidth: "3%" }} selectionMode="multiple" exportable={false}></Column>
            <Column field="name" header="Users" sortable style={{ width: "87%" }}></Column>

            <Column
              header="Action"
              body={actionBodyTemplate}
              exportable={false}
              style={{ width: "10%", textAlign: "center" }}
            ></Column>
          </DataTable>
        )}
      </div>

      <Dialog
        visible={userDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="New User"
        modal
        className="p-fluid"
        footer={UserDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="name" className="font-bold">
            User name
          </label>
          <InputText
            id="name"
            value={user.name}
            onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })}
            required
            autoFocus
            name="name"
            className={classNames({ "p-invalid": submitted && !user.name })}
          />
          {submitted && !user.name && <small className="p-error">Name is required.</small>}
        </div>

        <div className="field">
          <label htmlFor="name" className="font-bold">
            Password
          </label>
          <InputText
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })}
            required
            name="password"
            className={classNames({ "p-invalid": submitted && !user.name })}
          />
          {submitted && !user.name && <small className="p-error">Name is required.</small>}
        </div>
      </Dialog>

      <Dialog
        visible={deleteUserDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteUserDialogFooter}
        onHide={hideDeleteUserDialog}
      >
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
          {user && (
            <span>
              Are you sure you want to delete <b>{user.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteUsersDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteUsersDialogFooter}
        onHide={hideDeleteUsersDialog}
      >
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
          {user && <span>Are you sure you want to delete the selected products?</span>}
        </div>
      </Dialog>
    </div>
  );
};

export default Users;
