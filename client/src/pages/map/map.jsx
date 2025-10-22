import React, { useEffect, useState, useMemo } from "react";
import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const MapPage = () => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [schools, setSchools] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch("/api/schools")
      .then((r) => r.json())
      .then((data) => setSchools(Array.isArray(data) ? data : []))
      .catch((e) => console.error("Failed to fetch schools:", e));
  }, []);

  const markers = useMemo(
    () =>
      schools
        .filter((s) => s.lat != null && s.lng != null)
        .map((s) => ({
          ...s,
          position: { lat: Number(s.lat), lng: Number(s.lng) }, // MySQL DECIMAL may arrive as strings
        })),
    [schools]
  );

  const selected = useMemo(
    () => markers.find((m) => m.id === selectedId),
    [markers, selectedId]
  );

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
          >
            {markers.map((m) => (
              <Marker
                key={m.id}
                position={m.position}
                title={`${m.name} (${m.city || "Unknown city"}) - ${m.score ?? 0} pts`}
                onClick={() => setSelectedId(m.id)}
              />
            ))}

            {selected && (
              <InfoWindow
                position={selected.position}
                onCloseClick={() => setSelectedId(null)}
              >
                <div style={{ minWidth: 200 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{selected.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    {selected.city || "Unknown city"}
                    {" · "}
                    Score: {selected.score ?? 0}
                    {selected.best_category ? ` · Best: ${selected.best_category}` : ""}
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>
      </APIProvider>
      <Footer />
    </>
  );
};

export default MapPage;
