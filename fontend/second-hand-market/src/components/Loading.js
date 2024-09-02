// @flow
import * as React from "react";
import "./Loading.css";

export const Loading = (props) => {
  return (
    <div className={`loading-overlay ${props.loading ? "d-flex" : "d-none"}`}>
      <ul className="wave-menu d-flex">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
};
