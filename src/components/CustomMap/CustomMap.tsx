import "./CustomMap.scss"
import { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat, transformExtent } from "ol/proj";
import Draw from "ol/interaction/Draw";
import { createBox } from "ol/interaction/Draw";
import { Extent, containsCoordinate } from "ol/extent";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";
import { useDispatch, useSelector } from "react-redux";
import { getPoints } from "../../api/axios";
import { RootState } from "../../redux/store";

interface PointData {
  position_coordinates: [number, number, number];
  geometry_id: string | number;
}

const initialLayer = new VectorLayer({
  source: new VectorSource(),
});

const highlightLayer = new VectorLayer({
  source: new VectorSource(),
  style: new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({ color: "green" }),
      stroke: new Stroke({ color: "white", width: 4 }),
    }),
  }),
});

function CustomMap() {
  const dispatch = useDispatch();
  const points = useSelector((state: RootState) => state.api.points);
  const [map, setMap] = useState<Map>();
  const [layer, setLayer] = useState<VectorLayer>(initialLayer);

  const [selectedExtent, setSelectedExtent] = useState<Extent | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<PointData[]>([]);

  const mapRef = useRef<HTMLDivElement>(null);

  const handleSelectArea = () => {
    if (map) {
      const draw = new Draw({
        source: new VectorSource(),
        type: "Circle",
        geometryFunction: createBox(), // Restrict to rectangles
      });

      map.addInteraction(draw);

      draw.on("drawend", (event) => {
        const feature = event.feature;
        const featureGeometry = feature.getGeometry()

        if (feature && featureGeometry) {
          const extent: Extent = featureGeometry.getExtent();
          const transformedExtent = transformExtent(extent, "EPSG:3857", "EPSG:4326"); // Adjust CRS as needed
          setSelectedExtent(transformedExtent); // Save the selected area in a state
          map.removeInteraction(draw); // Remove the interaction if selection is one-time
        } else {
          console.error("Geometry or feature is undefined.");
        }
      });
    }
  };

  const handleLayerClean = () => {
    const highlightLayerSource = highlightLayer.getSource()
    if (highlightLayerSource) {
      highlightLayerSource.clear();
    }
  }

  const getPointsInExtent = (points: PointData[], extent: Extent) => {
    return points.filter((point) => {
      const [lon, lat, elevation] = point.position_coordinates
      if (containsCoordinate(extent, [lon, lat])) {
        return true
      }
      return false
    });
  };

  useEffect(() => {
    // Initialize the map
    const map = new Map({
      target: mapRef.current!,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        layer,
      ],
      view: new View({
        center: [2130703.1613, 5999314.369900003],
        zoom: 7,
      }),
    });

    map.on("click", (event) => {
      const clickedFeature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);

      if (clickedFeature) {
        console.log(clickedFeature)
        const pointId = clickedFeature.get("geometry_id"); // Access other properties
        if (pointId) {
          const pointData = clickedFeature.getProperties() as PointData;
          console.log(`Point clicked: (${pointId})`);
          setSelectedPoints([pointData])
        }
        // Trigger your custom onClick event logic here, for example:
      }
    });

    setMap(map)
    return () => {
      map.setTarget();
    };
  }, []);

  useEffect(() => {
    const fetchBorders = async () => {
      const { success, error } = await getPoints(dispatch);
      console.log(success, "error type: ", error);
    };

    if (!points) {
      fetchBorders();
    } else {
      if (points) {
        const generatedLayer = generateLayer(points);
        setLayer(generatedLayer);
      } else {
      }
    }
  }, [points, dispatch]);

  useEffect(() => {
    if (layer && map) {
      map.addLayer(layer);
    }

    return () => {
      if (layer && map) {
        map.removeLayer(layer);
      }
    };
  }, [layer]);

  useEffect(() => {
    if (selectedExtent && points) {
      const pointsInArea = getPointsInExtent(points, selectedExtent);
      setSelectedPoints(pointsInArea);
      console.log("Selected Points:", pointsInArea);
    }
  }, [selectedExtent, points]);


  useEffect(() => {
    if (highlightLayer && map) {
      map.addLayer(highlightLayer);
    }

    const features = selectedPoints.map((point) => {
      const [lon, lat, elevation] = point.position_coordinates

      return new Feature({
        geometry: new Point(fromLonLat([lon, lat])),
      })
    }
    );

    const highlightLayerSource = highlightLayer.getSource()

    if (highlightLayerSource) {
      highlightLayerSource.clear();
      highlightLayerSource.addFeatures(features);
    }

    return () => {
      if (highlightLayer && map) {
        map.removeLayer(highlightLayer);
      }
    };
  }, [selectedPoints]);



  return (
    <div ref={mapRef} className="CustomMap">
      <button onClick={handleSelectArea} className="select-region">Select region</button>
      <button onClick={handleLayerClean} className="clear-layer">Clear</button>
    </div>
  )
}


function generateLayer(points: PointData[]) {
  // Convert points to features
  console.log(points)
  const features = points?.map((point: PointData) => {
    const [lon, lat, elevation] = point.position_coordinates;

    const feature = new Feature({
      geometry: new Point(fromLonLat([lon, lat])),
      geometry_id: point.geometry_id,
      position_coordinates: point.position_coordinates
    });

    return feature;
  });

  // Create a vector source and layer for the points
  const vectorSource = new VectorSource({
    features,
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({ color: "blue" }),
        stroke: new Stroke({ color: "white", width: 2 }),
      }),
    }),
  });

  return vectorLayer
}

export default CustomMap