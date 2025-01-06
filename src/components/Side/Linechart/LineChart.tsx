//Chart JS
import Chart from "chart.js/auto";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

interface PointTimeSeriesData {
  geometry_id: number;
  acquisition_date: Date;
  displacement_value: number;
  displacement_unit_concept_id: number
}

function LineChart() {
  const points_time_series = useSelector(
    (state: RootState) => state.api.points_time_series
  );
  const mapParams = useSelector(
    (state: RootState) => state.global.map
  );

  if (!points_time_series) {
    return <div>No data to display</div>;
  }



  return (
    <div className="LineChart">
      <div className="wrapper">
        {mapParams.selectedPoints?.map((p) => {
          const pointData = points_time_series?.filter((p_data: PointTimeSeriesData) => p_data.geometry_id === p)
          console.log("Point data", pointData)
          const timeLables = pointData?.map((p_data: PointTimeSeriesData) => p_data.acquisition_date);
          const lineValues = pointData?.map((p_data: PointTimeSeriesData) => p_data.displacement_value);
          const calcLineValues = lineValues?.map((p_data: PointTimeSeriesData, i: number) => {
            const value = lineValues[i] + lineValues[i - 1] || 0
            return value.toFixed(4)
          })
          console.log(calcLineValues)

          const dataset = [
            {
              label: `Displacement`,
              data: calcLineValues,
              borderWidth: 2,
              fill: false,
            }
          ];
          return (
            <div className="graph multiple" key={p}>
              <Line
                data={{
                  labels: timeLables,
                  datasets: dataset,
                }}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: `Point ${p}`,
                    },
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => {
                          console.log(tooltipItem);
                          const datasetLabel = tooltipItem.dataset.label || "";
                          const index = tooltipItem.dataIndex;
                          const dataValue = tooltipItem.raw;
                          const displacement = lineValues[index];
                          return `${datasetLabel}: ${dataValue} (${displacement})`;
                        },
                      },
                    },
                  },
                  animation: {
                    duration: 0,
                  },
                }}
                key={p}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default LineChart;
