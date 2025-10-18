import React from "react";
import { APIProvider, Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const MapPage = () => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  return (
    <>
      <Header />
      <APIProvider apiKey={apiKey} onLoad={() => console.log("Maps API loaded")}>
        <div style={{ width: "100%", height: 735, borderRadius: 12, overflow: "hidden", margin: "0px 0" }}>
          <Map
            defaultCenter={{ lat: 32.0853, lng: 34.7818 }} // Tel Aviv
            defaultZoom={8}
            gestureHandling={"greedy"}
            disableDefaultUI={false}
            mapId={undefined}
          />
        </div>
      </APIProvider>
      <Footer />
    </>
  );
};

export default MapPage;

