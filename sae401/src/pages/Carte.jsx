import { useState, useEffect } from 'react'
import FranceChomageMap from '../components/carte.jsx'
import FranceDensityMap from '../components/carteDensity.jsx'
import FranceBubblesMap from '../components/carteBubbles.jsx'
import dataCSV from '../assets/data.csv?raw'

export default function CartePage() {
    const [chomageData, setChomageData] = useState({})

    const [densityData, setDensityData] = useState({})
    const [populationData, setPopulationData] = useState({})

    useEffect(() => {
        const parseCSV = (csv) => {
            const lines = csv.trim().split('\n');
            const headers = lines[0].split(',');
            const chomageIndex = headers.findIndex(h => h.includes('Taux de chômage'));
            const codeIndex = headers.findIndex(h => h.toLowerCase().includes('code_departement'));
            const densityIndex = headers.findIndex(h => h.includes('Densit') || h.includes('Densité'));
            const populationIndex = headers.findIndex(h => h.includes('Nombre d') || h.includes("Nombre d'"));

            const data = {};
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',');
                const codeRaw = values[codeIndex]?.trim();
                const codeNum = parseInt(codeRaw);
                if (isNaN(codeNum)) continue;
                const code = String(codeNum);

                const chomage = parseFloat(values[chomageIndex]?.trim());
                const density = parseFloat(values[densityIndex]?.trim());
                const population = parseFloat(values[populationIndex]?.trim());

                data[code] = {};
                if (!isNaN(chomage)) data[code].chomage = chomage;
                if (!isNaN(density)) data[code].density = density;
                if (!isNaN(population)) data[code].population = population;
            }
            return data;
        };

        const parsedData = parseCSV(dataCSV);
        const formattedChomage = {};
        const formattedDensity = {};
        const formattedPopulation = {};

        Object.keys(parsedData).forEach(key => {
            if (parsedData[key].chomage !== undefined) formattedChomage[key] = parsedData[key].chomage;
            if (parsedData[key].density !== undefined) formattedDensity[key] = parsedData[key].density;
            if (parsedData[key].population !== undefined) formattedPopulation[key] = parsedData[key].population;
        });

        setChomageData(formattedChomage);
        setDensityData(formattedDensity);
        setPopulationData(formattedPopulation);
    }, []);

    return (
        <div className='container-fluid p-3'>
            <div className='row mb-3'>
                <div className='col-12'>
                    <h2>🗺️ Carte du chômage en France</h2>
                    <p>Visualisez le taux de chômage par département</p>
                </div>
            </div>
            <div className='row'>
                <div className='col-12 col-md-6 mb-3'>
                    <h5>Carte du chômage</h5>
                    <FranceChomageMap chomageData={chomageData} />
                </div>
                <div className='col-12 col-md-6 mb-3'>
                    <h5>Carte de la densité de population</h5>
                    <FranceDensityMap densityData={densityData} populationData={populationData} />
                </div>
            </div>

            <div className='row mt-3'>
                <div className='col-12'>
                    <h5>Carte à bulles (taille proportionnelle à la densité)</h5>
                    <FranceBubblesMap densityData={densityData} populationData={populationData} sizeBy={'density'} />
                </div>
            </div>
        </div>
    )
}
