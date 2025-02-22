import React, { useState } from 'react'
import './Header.css'
import { Link } from 'react-scroll'

const Header = () => {
    const [menuOpened, setMenuOpened] = useState(false);
    return (
        <div className="header">


            <ul className='header-list'>
                <li>
                    <Link
                        onClick={() => setMenuOpened(false)}
                        activeClass="active"
                        to="home"
                        spy={true}
                        smooth={true}
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        onClick={() => setMenuOpened(false)}
                        to="programs"
                        spy={true}
                        smooth={true}
                    >
                        Programs
                    </Link>
                </li>
                <li>
                    <Link
                        onClick={() => setMenuOpened(false)}
                        to="reasons"
                        spy={true}
                        smooth={true}
                    >
                        Why Us
                    </Link>
                </li>
                <li>
                    <Link
                        onClick={() => setMenuOpened(false)}
                        to="Plans"
                        spy={true}
                        smooth={true}
                    >
                        Plans
                    </Link>
                </li>
                <li>
                    <Link
                        onClick={() => setMenuOpened(false)}
                        to="testimonial"
                        spy={true}
                        smooth={true}
                    >
                        Testimoinals
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Header