'use client';

import Link from 'next/link';
import './Navbar.css';
import {TypeAnimation} from "react-type-animation";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">
                <TypeAnimation
                    sequence={[
                        "Hi, I'm Ege!"
                    ]}
                    cursor={true}
                    repeat={0}
                />
            </div>
            <ul className="nav-links">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/projects">Projects</Link></li>
                <li><Link href="/contact">Contact</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;