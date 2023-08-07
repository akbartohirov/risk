import React from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import sqb from "./SQB.svg";
import Cookies from "js-cookie";

export default function Navbar({ id }) {
  const navigate = useNavigate();

  const items = [
    {
      label: "Lists",
      icon: "pi pi-list",
      items: [
        {
          label: "Users",
          icon: "pi pi-users",
          command: () => navigate("/list/users"),
        },
        {
          label: "Products",
          icon: "pi pi-credit-card",
          command: () => navigate("/list/products"),
        },
        {
          label: "Departments",
          icon: "pi pi-book",
          command: () => navigate("/list/departments"),
        },
        {
          label: "Risk factors",
          icon: "pi pi-chart-line",
          command: () => navigate("/list/risk-factors"),
        },
      ],
    },
    {
      label: "Qestionnaire",
      icon: "pi pi-sliders-h",
      command: () => navigate(`/questionaire/${id}`),
    },
    {
      label: "Results",
      icon: "pi pi-table",
      command: () => navigate("/results"),
    },

    {
      label: "Quit",
      icon: "pi pi-fw pi-power-off",
      command: () => {
        Cookies.remove("id");
        Cookies.remove("token");
        navigate("/");
        window.location.reload();
      },
    },
  ];

  const start = <img alt="logo" src={sqb} height="40" className="mr-2"></img>;

  return (
    <div className="card">
      <Menubar className="z-2" model={items} start={start} />
    </div>
  );
}
