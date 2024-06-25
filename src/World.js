import React, { useState, useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import { interpolateReds } from "d3-scale-chromatic";
import { scaleLinear } from "d3-scale";
import { SPACE_BG, GLOBE_TEXTURE } from "./constants";

export default function World(props) {
  // eslint-disable-next-line no-unused-vars
  const [colorScale, setColorScale] = useState(null);
  const [countries, setCountries] = useState({ features: [] });
  const globeElm = useRef();
  const [hoverD, setHoverD] = useState();
  const [width, setWidth] = useState(props.initialWidth);
  const [height, setHeight] = useState(() => { return props.isMobile ? window.innerHeight/1.5 : window.innerHeight });

  const w = window.innerWidth;
  const shiftFactor = props.isMobile ? 0 : 0.4;
  const shiftAmmount = shiftFactor * w;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResize = () => {
    setWidth(window.innerWidth);
    setHeight(() => { return props.isMobile ? window.innerHeight/1.5 : window.innerHeight });
  };

  // assign color based of delta temp on that year respective to 1900-2013 mean
  function getColorForTemperature(minTemp, maxTemp, meanTemp, temperature) {
    const colorScale = scaleLinear()
      .domain([minTemp - meanTemp, maxTemp - meanTemp])
      .range([0, 1]);

    setColorScale(colorScale);

    const color = colorScale
      ? interpolateReds(colorScale(temperature - meanTemp))
      : "#3d3d3d";
    return color;
  }

  // Load geoJSON
  useEffect(() => {
    if (props.countryData && props.countryData.features) {
      setCountries(props.countryData);
    }
    setCountries(props.countryData);
    setWidth(props.initialWidth);
    setHeight(() => { return props.isMobile ? window.innerHeight/1.5 : window.innerHeight });

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize, props.countryData, props.initialWidth, props.isMobile]);

  function colorMapping({ properties: d }) {
    return `${
      d.TEMPERATURES && d.TEMPERATURES[props.yearInput]
        ? getColorForTemperature(
            d.MIN_TEMP,
            d.MAX_TEMP,
            d.MEAN_TEMP,
            d.TEMPERATURES[props.yearInput]
          )
        : "#3d3d3d"
    }`;
  }

  function getFlagEmoji(countryCode) {
    return countryCode
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt())
      );
  }

  return (
    <div
      className="globe-container overflow-hidden"
      style={{
        marginRight: `+${shiftAmmount}px`,
      }}
    >
      <Globe
        ref={globeElm}
        onGlobeReady={() => {
          globeElm.current.controls().autoRotate = true;
          globeElm.current.controls().autoRotateSpeed = 0.5;
          globeElm.current.controls().minDistance = 250.0;
        }}
        width={width + shiftAmmount}
        height={height}
        lineHoverPrecision={0}
        polygonAltitude={(d) => (d === hoverD ? 0.1 : 0.01)}
        polygonSideColor={() => "rgba(0, 0, 0, 0.8)"}
        polygonStrokeColor={() => "#111"}
        backgroundImageUrl={SPACE_BG}
        globeImageUrl={GLOBE_TEXTURE}
        polygonsData={countries.features}
        polygonCapColor={colorMapping}
        polygonLabel={({ properties: d }) => {return (d.TEMPERATURES && d.TEMPERATURES[props.yearInput] === 0) ?
          `<div class="label-container" onmouseover="this.style.backgroundColor='#edf2f7'" onmouseout="this.style.backgroundColor='#fff'">
          <h5 class="label-header"> ${d.ADMIN} (<p class="label-header" style="font-size: 1rem;">${getFlagEmoji(d.ISO_A2)}</p>)</h5>
          <p class="label-content">Data Unavailable 💔</p>  
        </div>`
        : `
        <div class="label-container" onmouseover="this.style.backgroundColor='#edf2f7'" onmouseout="this.style.backgroundColor='#fff'">
          <h5 class="label-header" style="display: inline;"> ${d.ADMIN} (<span class="label-header" style="font-size: 1rem; display: inline;">${getFlagEmoji(d.ISO_A2)}</span>)</h5>
          <p class="label-content" style="display: inline;">${props.yearInput} Mean Temp: ${d.TEMPERATURES && d.TEMPERATURES[props.yearInput]}°C</p>
          <p class="label-content" style="display: inline;">Mean Temp: ${d.TEMPERATURES && d.MEAN_TEMP}°C</p>
          <p class="label-content" style="display: inline;">Diff. from mean: ${
              d.TEMPERATURES &&
              (d.TEMPERATURES[props.yearInput] - d.MEAN_TEMP).toFixed(3) > 0
                  ? '🔥'
                  : '❄️'
          } <span class="label-content" style="color: ${
              d.TEMPERATURES &&
              (d.TEMPERATURES[props.yearInput] - d.MEAN_TEMP).toFixed(3) > 0
                  ? '#ff6359'
                  : '#65dbff'
          }; display: inline;">${d.TEMPERATURES &&
              (d.TEMPERATURES[props.yearInput] - d.MEAN_TEMP).toFixed(3)}°C</span></p>
        </div>
        `}}
        onPolygonHover={setHoverD}
        polygonsTransitionDuration={300}
        onPolygonClick={data => props.getCountry(data)}
      />
    </div>
  );
}
