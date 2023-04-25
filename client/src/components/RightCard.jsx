import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { reject, accept } from "../redux/userSlice";
import Alert from "./Alert";

const Card = styled.div`
  display: flex;
  flex-direction: column !important;
  align-items: center;
  gap: 5px;
  border: none !important;
  width: 100%;
  animation: fadein 0.3s;
`;

const Top = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;

  img {
    border-radius: 50%;
    height: 60px;
    width: 60px;
    cursor: pointer;
  }

  & > div {
    color: gray;
    font-size: 18px;
    cursor: pointer;
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  width: 100%;
  button {
    width: 100%;
    font-weight: bold;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    padding: 10px 5px;
  }
`;

const RightCard = ({ u }) => {
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(0);
  const [alert, setAlert] = useState("");
  const dispatch = useDispatch();

  const handleAlert = (err) => {
    setAlert(err);
    setOpen(1);
    setTimeout(() => {
      setOpen(0);
    }, 2000);
  };

  const handleReject = async () => {
    try {
      await axios.put(`/users/reject/${u}`);
      dispatch(reject(u));
    } catch (err) {
      handleAlert("error");
    }
  };

  const handleAccept = async () => {
    try {
      await axios.put(`/users/accept/${u}`);
      dispatch(accept(u));
    } catch (err) {
      handleAlert("error");
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`/users/find/${u}`);
      setUser(res.data);
    } catch (err) {
      handleAlert("error");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [u]);

  return (
    <Card>
      {open === 1 ? <Alert desc={alert} /> : <></>}
      <Top>
        <Link to={`/profile/${u}`}>
          <img src={user.img || "/images/profile.svg"} alt="" />
        </Link>
        
        <Right>
          <div>{user.name}</div>
          <div>{user?.friends?.length + user?.requests?.length} followers</div>
        </Right>
        <Right>
          <button style={{ backgroundColor: "blue" }} onClick={handleAccept}>
            Confirm
          </button>
          <button style={{ backgroundColor: "red" }} onClick={handleReject}>
            Delete
          </button>
        </Right>
      </Top>
    </Card>
  );
};

export default RightCard;
