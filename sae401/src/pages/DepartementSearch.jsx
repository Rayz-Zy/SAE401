import { useState, useEffect } from 'react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, BarElement, PointElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js'
import dataCSV from '../assets/data.csv?raw'

ChartJS.register(CategoryScale, LinearScale, LineElement, BarElement, PointElement, Title, Tooltip, Legend, ArcElement, Filler)

export default function DepartementSearch() {
    const [departements, setDepartements] = useState([])
    const [selectedDept, setSelectedDept] = useState(null)
    const [filtered, setFiltered] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [deptData, setDeptData] = useState(null)

    // Parser le CSV
    useEffect(() => {
        const parseCSV = (csv) => {
            const lines = csv.trim().split('\n')
            const headers = lines[0].split(',')

            const data = {}

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',')
                const code = values[1]?.trim()
                const nom = values[2]?.trim()

                if (code && nom) {
                    if (!data[code]) {
                        data[code] = {
                            code,
                            nom,
                            annees: {}
                        }
                    }

                    const annee = values[0]?.trim()
                    data[code].annees[annee] = {
                        habitants: parseFloat(values[5]),
                        densitePopulation: parseFloat(values[6]),
                        tauxChomage: parseFloat(values[13]),
                        tauxPauvrete: parseFloat(values[14]),
                        popMoins20: parseFloat(values[10]),
                        pop60Plus: parseFloat(values[11]),
                        tauxLogementsSociaux: parseFloat(values[16]),
                        tauxLogementsVacants: parseFloat(values[17]),
                    }
                }
            }

            return Object.values(data).sort((a, b) => a.nom.localeCompare(b.nom))
        }

        const parsed = parseCSV(dataCSV)
        setDepartements(parsed)
    }, [])

    // Filtrer les départements
    const handleSearch = (value) => {
        setSearchTerm(value)
        if (!value) {
            setFiltered([])
        } else {
            const search = value.toLowerCase()
            setFiltered(
                departements.filter(d =>
                    d.nom.toLowerCase().includes(search) ||
                    d.code.includes(search)
                ).slice(0, 15)
            )
        }
    }

    // Sélectionner un département
    const handleSelectDept = (dept) => {
        setSelectedDept(dept)
        setSearchTerm(`${dept.code} - ${dept.nom}`)
        setFiltered([])
        setDeptData(dept)
    }

    // Préparer les données des graphes
    const getChartData = () => {
        if (!deptData) return null

        const annees = Object.keys(deptData.annees).sort()

        return {
            annees,
            tauxChomage: annees.map(a => deptData.annees[a].tauxChomage),
            tauxPauvrete: annees.map(a => deptData.annees[a].tauxPauvrete),
            habitants: annees.map(a => deptData.annees[a].habitants),
            popMoins20: annees.map(a => deptData.annees[a].popMoins20),
            pop60Plus: annees.map(a => deptData.annees[a].pop60Plus),
            tauxLogementsSociaux: annees.map(a => deptData.annees[a].tauxLogementsSociaux),
        }
    }

    const chartData = getChartData()

    return (
        <div className='container-fluid p-4 row'>
            <div className='row mb-4'>
                <div className='col-12'>
                    <h1>🔍 Recherche de département</h1>
                    <p>Sélectionnez un département pour voir ses indicateurs socio-économiques</p>
                </div>
            </div>

            {/* Barre de recherche */}
            <div className='row mb-4'>
                <div className='col-md-6'>
                    <div className='position-relative'>
                        <input
                            type='text'
                            className='form-control form-control-lg'
                            placeholder='Cherchez un département (ex: Ain, 75...)'
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            autoComplete='off'
                        />

                        {/* Liste déroulante */}
                        {filtered.length > 0 && (
                            <div className='list-group position-absolute w-100' style={{ zIndex: 1000, top: '100%' }}>
                                {filtered.map(dept => (
                                    <button
                                        key={dept.code}
                                        type='button'
                                        className='list-group-item list-group-item-action'
                                        onClick={() => handleSelectDept(dept)}
                                    >
                                        <strong>{dept.code}</strong> - {dept.nom}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Afficher les données si un département est sélectionné */}
            {deptData && chartData && (
                <>
                    {/* Titre du département */}
                    <div className='row mb-3'>
                        <div className='col-12'>
                            <h2>Données pour {deptData.nom} ({deptData.code})</h2>
                        </div>
                    </div>

                    {/* Statistiques clés */}
                    <div className='row mb-4'>
                        <div className='col-md-3'>
                            <div className='card text-center'>
                                <div className='card-body'>
                                    <h6 className='card-title'>Population (2023)</h6>
                                    <h4>{(deptData.annees['2023']?.habitants / 1000).toFixed(0)}k hab.</h4>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div className='card text-center'>
                                <div className='card-body'>
                                    <h6 className='card-title'>Taux de chômage (2023)</h6>
                                    <h4 style={{ color: deptData.annees['2023']?.tauxChomage > 10 ? '#c90000' : '#00b300' }}>
                                        {deptData.annees['2023']?.tauxChomage.toFixed(1)}%
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div className='card text-center'>
                                <div className='card-body'>
                                    <h6 className='card-title'>Taux de pauvreté (2023)</h6>
                                    <h4>{deptData.annees['2023']?.tauxPauvrete.toFixed(1)}%</h4>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div className='card text-center'>
                                <div className='card-body'>
                                    <h6 className='card-title'>Logements sociaux (2023)</h6>
                                    <h4>{deptData.annees['2023']?.tauxLogementsSociaux.toFixed(1)}%</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Graphes */}
                    <div className='row mb-4'>
                        <div className='col-md-6'>
                            <div className='card'>
                                <div className='card-body'>
                                    <h5 className='card-title'>Évolution du chômage et pauvreté</h5>
                                    <Line
                                        data={{
                                            labels: chartData.annees,
                                            datasets: [
                                                {
                                                    label: 'Taux de chômage (%)',
                                                    data: chartData.tauxChomage,
                                                    borderColor: '#c90000',
                                                    backgroundColor: 'rgba(201, 0, 0, 0.1)',
                                                    tension: 0.4,
                                                    fill: true,
                                                    yAxisID: 'y',
                                                },
                                                {
                                                    label: 'Taux de pauvreté (%)',
                                                    data: chartData.tauxPauvrete,
                                                    borderColor: '#ff8c1a',
                                                    backgroundColor: 'rgba(255, 140, 26, 0.1)',
                                                    tension: 0.4,
                                                    fill: true,
                                                    yAxisID: 'y1',
                                                }
                                            ]
                                        }}
                                        options={{
                                            scales: {
                                                y: { position: 'left', title: { display: true, text: 'Chômage (%)' } },
                                                y1: { position: 'right', title: { display: true, text: 'Pauvreté (%)' }, grid: { drawOnChartArea: false } }
                                            },
                                            plugins: { legend: { display: true } }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='col-md-6'>
                            <div className='card'>
                                <div className='card-body'>
                                    <h5 className='card-title'>Structure de la population (2023)</h5>
                                    <Doughnut
                                        data={{
                                            labels: ['- de 20 ans', '60 ans et plus', 'Population active'],
                                            datasets: [{
                                                data: [
                                                    deptData.annees['2023']?.popMoins20 || 0,
                                                    deptData.annees['2023']?.pop60Plus || 0,
                                                    Math.max(0, 100 - (deptData.annees['2023']?.popMoins20 || 0) - (deptData.annees['2023']?.pop60Plus || 0))
                                                ],
                                                backgroundColor: ['#4CAF50', '#ff8c1a', '#2196F3'],
                                            }]
                                        }}
                                        options={{ plugins: { legend: { display: true } } }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row mb-4'>
                        <div className='col-md-6'>
                            <div className='card'>
                                <div className='card-body'>
                                    <h5 className='card-title'>Logements sociaux</h5>
                                    <Bar
                                        data={{
                                            labels: chartData.annees,
                                            datasets: [{
                                                label: 'Taux de logements sociaux (%)',
                                                data: chartData.tauxLogementsSociaux,
                                                backgroundColor: '#2196F3',
                                            }]
                                        }}
                                        options={{
                                            scales: { y: { beginAtZero: true } },
                                            plugins: { legend: { display: true } }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='col-md-6'>
                            <div className='card'>
                                <div className='card-body'>
                                    <h5 className='card-title'>Comparaison des indicateurs (2023)</h5>
                                    <Bar
                                        data={{
                                            labels: ['Chômage', 'Pauvreté', 'Log. sociaux'],
                                            datasets: [{
                                                label: 'Pourcentage (%)',
                                                data: [
                                                    deptData.annees['2023']?.tauxChomage,
                                                    deptData.annees['2023']?.tauxPauvrete,
                                                    deptData.annees['2023']?.tauxLogementsSociaux,
                                                ],
                                                backgroundColor: ['#c90000', '#ff8c1a', '#2196F3'],
                                            }]
                                        }}
                                        options={{
                                            scales: { y: { beginAtZero: true } },
                                            plugins: { legend: { display: false } }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!deptData && (
                <div className='row'>
                    <div className='col-12 text-center'>
                        <p style={{ fontSize: '1.1rem', color: '#666' }}>👆 Sélectionnez un département pour afficher ses données</p>
                    </div>
                </div>
            )}
        </div>
    )
}
