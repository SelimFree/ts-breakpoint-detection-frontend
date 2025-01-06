import { useEffect } from "react"
import "./Side.scss"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getPointTimeSeries } from "../../api/axios";
import { Dispatch } from "@reduxjs/toolkit";
import LineChart from "./Linechart/LineChart";


function Side() {
    const dispatch = useDispatch()
    const mapParams = useSelector((state: RootState) => state.global.map)

    const fetchData = async (handler: (dispatch: Dispatch, params: any) => Promise<{ success: boolean; error: string; }>, params: any) => {
        const { success, error } = await handler(dispatch, params)
        console.log(success, "error type: ", error);
    };

    useEffect(() => {
        fetchData(getPointTimeSeries, { geometry_list: mapParams.selectedPoints });
    }, [mapParams.selectedPoints]);

    return (
        <div className="Side">
            <LineChart />
        </div>
    )
}

export default Side