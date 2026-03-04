export default function Home() {
    return (
        <div className='container-fluid p-4'>
            <div className='row'>
                <div className='col-12'>
                    <h1>Bienvenue sur SAE 401</h1>
                    <p className='lead'>Analyse des données socio-économiques en France</p>

                    <div className='row mt-4'>
                        <div className='col-md-6'>
                            <div className='card'>
                                <div className='card-body'>
                                    <h5 className='card-title'>📊 Tableaux de bord</h5>
                                    <p className='card-text'>Explorez les graphiques camembert et les courbes d'évolution des indicateurs sociaux.</p>
                                    <a href='/dashboard' className='btn btn-primary'>Voir les tableaux</a>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className='card'>
                                <div className='card-body'>
                                    <h5 className='card-title'>🗺️ Carte interactive</h5>
                                    <p className='card-text'>Visuel interactif du taux de chômage par département en France.</p>
                                    <a href='/carte' className='btn btn-primary'>Voir la carte</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-4 p-3 bg-light rounded'>
                        <h4>À propos</h4>
                        <p>Cette application analyse les données socio-économiques des départements français, incluant le chômage, la pauvreté et les logements.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
