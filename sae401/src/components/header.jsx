import { useLocation, NavLink } from 'react-router-dom';
import { Sidenav, Nav } from 'rsuite';
import PageIcon from '@rsuite/icons/Page';
import SearchIcon from '@rsuite/icons/Search';
import DashboardIcon from '@rsuite/icons/Dashboard';
import 'rsuite/dist/rsuite.min.css';

// Header now receives expanded and setExpanded from parent (App)
const Header = ({ expanded, setExpanded }) => {
    const location = useLocation();

    return (
        <Sidenav
            expanded={expanded}
            defaultOpenKeys={['3']}
            style={{
                position: 'fixed',
                height: '100vh',
                width: expanded ? '260px' : '56px',
                transition: 'width 0.3s',
                zIndex: 1000
            }}
        >
            <Sidenav.Header>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '50px',
                    fontSize: '20px',
                    fontWeight: 'bold'
                }}>
                    {expanded ? '📊 SAE 401' : '📊'}
                </div>
            </Sidenav.Header>

            <Sidenav.Body>
                <Nav activeKey={location.pathname}>
                    <Nav.Item
                        icon={<PageIcon />}
                        as={NavLink}
                        to="/"
                        className={({ isActive }) => isActive ? 'rs-active' : ''}
                    >
                        Accueil
                    </Nav.Item>

                    <Nav.Item
                        icon={<SearchIcon />}
                        as={NavLink}
                        to="/departement-search"
                        className={({ isActive }) => isActive ? 'rs-active' : ''}
                    >
                        Rechercher
                    </Nav.Item>

                    <Nav.Item
                        icon={<PageIcon />}
                        as={NavLink}
                        to="/carte"
                        className={({ isActive }) => isActive ? 'rs-active' : ''}
                    >
                        Carte
                    </Nav.Item>
                </Nav>
            </Sidenav.Body>

            <Sidenav.Footer style={{ textAlign: 'center' }}>
                <button
                    onClick={() => setExpanded(!expanded)}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '16px',
                        cursor: 'pointer',
                        padding: '10px',
                        width: '100%'
                    }}
                >
                    {expanded ? '◀' : '▶'}
                </button>
            </Sidenav.Footer>
        </Sidenav>
    );
};

export default Header;