import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Cookies from "js-cookie";
import SQB from "./SQB.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const toast = useRef(null);
  const [user, setUser] = useState({
    name: "",
    password: "",
  });

  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.post("/api/v1/login", { ...user });
      Cookies.set("token", data.data.data.token);
      Cookies.set("id", data.data.data.user._id);
      navigate(`/questionaire/${data.data.data.user._id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response.data.data.message,
        life: 3000,
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="flex justify-content-center">
        <Image src={SQB} />
      </div>
      <form onSubmit={submitForm} className="grid m-0">
        <div className="lg:col-offset-4 md:col-offset-3 col-offset-1 lg:col-4 md:col-6 col-10 flex flex-column align-items-start px-6">
          <InputText
            value={user.name}
            name="name"
            onChange={onChangeHandler}
            className="w-full mb-4"
            placeholder="Username"
          />
          <InputText
            onChange={onChangeHandler}
            value={user.password}
            name="password"
            type="password"
            placeholder="Password"
            className="w-full mb-4"
          />
          <Button className="text-center w-full justify-content-center">Sign in</Button>
        </div>
      </form>
    </>
  );
};

export default AuthPage;
