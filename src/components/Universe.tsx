import * as React from 'react';
import {DEFAULT_UNIVERSE_CONFIG} from "@/types/MapConfig";
import {Map} from "@/components/Map";

const Universe = () => {
    const {mapConfig, cellConfig} = DEFAULT_UNIVERSE_CONFIG

    return (
        <div>
            <Map mapConfig={mapConfig} cellConfig={cellConfig}/>
        </div>
    );

};

export default Universe