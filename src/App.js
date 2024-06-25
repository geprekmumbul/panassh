import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, Title, Tooltip, Legend, LineElement } from 'chart.js';
import Navbar from "./Navbar";
import World from "./World";
import GeoJSON from './data/mod_data_geo.geojson';
import CustSlider from './CustSlider';
import CustBar from './CustBar';
import CustLine from './CustLine';
import Header from './Header';
import BackBtn from './img/back-button.png';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [year, setYear] = useState(1900);
  const [globalChart, setGlobalChart] = useState(true);
  const [countries, setCountries] = useState({ features: [] });
  const [loadingGlobal, setLoadingGlobal] = useState(true);
  const [chartDataCountry, setChartDataCountry] = useState([]);
  const [switchMobile, setSwitchMobile] = useState(false);
  const [forceRender, setForceRender] = useState(0); // Add forceRender state

  useEffect(() => {
    fetch(GeoJSON)
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
        setLoadingGlobal(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoadingGlobal(false);
      });

    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setSwitchMobile(isMobile);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
    };

  }, []);

  const handleSliderChange = (value) => {
    setYear(value);
  };

  const handleClickCountry = (value) => {
    setChartDataCountry(value);
    setGlobalChart(false);
  };

  useEffect(() => {
    // Trigger re-render of CustBar when globalChart or countries changes
    setForceRender((prev) => prev + 1);
  }, [globalChart, countries]);

  return (
    <div className="relative w-100 h-auto overflow-hidden">
      <Navbar />
      
      <div className='relative w-100 h-100'>
        <World
          yearInput={year}
          initialWidth={window.innerWidth}
          countryData={countries}
          getCountry={handleClickCountry}
          isMobile={switchMobile}
        />
        <div className="absolute z-20 inset-x-0 lg:inset-x-auto mx-auto my-auto mb-5 lg:mb-0 lg:right-0 w-1/2 h-1/5 bottom-0 pb-10 flex flex-col items-center justify-start lg:pr-[max(10%,12px)]">
          <p className='text-white font-light text-2xl mt-8 mb-4'>{year}</p>
          <CustSlider className="m-0" onChange={handleSliderChange} />
        </div>
      </div>

      <div className="lg:absolute bg-slate-950/100 lg:bg-slate-950/0 z-10 w-full lg:w-1/2 h-[600px] lg:h-full bottom-0 py-5 lg:py-20 flex flex-col items-center justify-center">
        <Header />
        <div className="flex items-start justify-center w-full h-1/2 px-[max(15%,12px)]">
          {(globalChart === true) ?
           (!loadingGlobal && (
            <CustBar data={countries} forceRender={forceRender} width={'100%'} height={'100%'} />
          ))
          :
          <div className='flex flex-col w-full h-full'>
            <div className='w-full h-5/6'>
              <CustLine data={chartDataCountry} />
            </div>
            <div className='h-1/6 flex items-end pl-5'>
              <button onClick={() => setGlobalChart(true)} className='text-white inline'><img className='w-5 h-5 inline' src={BackBtn} alt="no" /> <p className='font-light inline'>   global chart</p></button>
            </div>
          </div>
        }
        </div>
      </div>
    </div>
  );
}

export default App;

