import React from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const DEFAULT_CENTER = { lat: 32.0853, lng: 34.7818 };
const DEFAULT_ZOOM = 8;

export default function SchoolsMap({ schools = [], onMarkerClick }) {
    const apiKey = 'AIzaSyD_dNszE0Y4bvElG4mXrBkYfZ6QfuO3B2E';
    if (!apiKey) {
        console.warn("Missing REACT_APP_MAPS_API_KEY");
    }

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={DEFAULT_CENTER}
                    defaultZoom={DEFAULT_ZOOM}
                    gestureHandling="greedy"
                    style={{ height: "100%", width: "100%" }}
                >
                    {schools.map((s) => (
                        <Marker
                            key={s.id}
                            position={{ lat: s.lat, lng: s.lng }}
                            title={s.name}
                            onClick={() => onMarkerClick?.(s)}
                        />
                    ))}
                </Map>
            </APIProvider>
        </div>
    );
}
