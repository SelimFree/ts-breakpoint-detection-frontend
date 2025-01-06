import axios from "axios";
import { getApiSuccess } from "../redux/slices/apiSlice";
import { Dispatch } from "@reduxjs/toolkit";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:8000",
});


const handleAllDataGet = async (name: string, dispatch: Dispatch, callback: (payload: { key: string; value: any }) => { type: string; payload: any }, url: string) => {
  let success = false;
  let errorMsg = "";
  let data;
  try {
    const response = await api.get(url, {
      headers: {
        Accept: "application/json'",
      },
      withCredentials: true,
    });
    data = response?.data;
    success = true;
  } catch (err: unknown) {

    if (axios.isAxiosError(err)) {
      if (!err?.response) {
        errorMsg = "Server error, try again later";
      } else if (err.response?.status == 401) {
        errorMsg = "not_authorized";
      } else {
        errorMsg = "Request error";
      }
    }
    console.log(err);
  }
  dispatch(callback({ key: name, value: data || undefined }));
  return { success, error: errorMsg };
};


export const getPoints = async (dispatch: Dispatch) => {
  const TEMPLATES_URL = "/tables/get_points";
  return handleAllDataGet("points", dispatch, getApiSuccess, TEMPLATES_URL);
};

export const getPointTimeSeries = async (dispatch: Dispatch, params: any) => {
  const TEMPLATES_URL = "/tables/get_points_time_series";
  const paramList = ["geometry_list"];

  const resultingURL = generateParameterizedUrl(TEMPLATES_URL, paramList, params);
  console.log(resultingURL)
  console.log(params)
  return handleAllDataGet("points_time_series", dispatch, getApiSuccess, resultingURL);
};

const generateParameterizedUrl = (baseURL: string, params: string[], values: any) => {
  const result = [];
  for (let i = 0; i < params.length; i++) {
    if (values[params[i]]) {
      if (Array.isArray(values[params[i]])) {
        const arrayParam = values[params[i]];
        for (let j = 0; j < arrayParam.length; j++) {
          result.push(`${params[i]}=${arrayParam[j]}`);
        }
      } else {
        result.push(`${params[i]}=${values[params[i]]}`);
      }
    }
  }

  return `${baseURL}?${result.join("&")}`;
};
