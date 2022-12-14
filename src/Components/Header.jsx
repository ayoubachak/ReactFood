import '../Styles/Header.css';
import Instagram from '../images/icons/instagram.png';
import Facebook from '../images/icons/facebook.png';
import Logo from './Logo';
import { appRoute } from '../utils/vars';

export default function Header(){
    console.log(window.location)
    return (
        <>
            <header>
                <Logo/>
                <div className="nav-items">
                    <div className="nav-item">
                        <a href={window.location.origin+appRoute+"/meals"} className="nav-link">Meals</a>
                    </div>
                    <div className="nav-item">
                        <a href={window.location.origin+appRoute+"/categories"} className="nav-link">Categories</a>
                    </div>
                    <div className="nav-item">
                        <a href={window.location.origin+appRoute+"/areas"} className="nav-link">Areas</a>
                    </div>
                    <div className="nav-item">
                        <a href={window.location.origin+appRoute+"/liked"} className="nav-link">Liked</a>
                    </div>
                    <div className="nav-item">
                        <a href={window.location.origin+appRoute+"/about"} className="nav-link">About</a>
                    </div>
                </div>
                <div className="social-media-icons">
                    <a href="https://instagram.com/">
                        <div className="social-media-icon">
                                <img src={Instagram} width="16" height="16" alt="instagram"/>
                        </div>
                    </a>
                    <a href="https://facebook.com/">
                        <div className="social-media-icon">
                                <img src={Facebook} width="16" height="16" alt='facebook'/>
                        </div>
                    </a>
                </div>
            </header>
        </>
    )
}