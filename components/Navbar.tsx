'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import './Navbar.css';
import {TypeAnimation} from "react-type-animation";

const Navbar = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Apply CSS variable values based on current theme
    const applyTheme = (newTheme: 'light' | 'dark') => {
        const root = document.documentElement;
        if (newTheme === 'dark') {
            root.style.setProperty('--background', '#0a0a0a');
            root.style.setProperty('--foreground', '#ededed');
        } else {
            root.style.setProperty('--background', '#ffffff');
            root.style.setProperty('--foreground', '#171717');
        }
    };

    // On mount: load stored theme or system preference
    useEffect(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') {
            setTheme(stored);
            applyTheme(stored);
        } else {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initial = systemDark ? 'dark' : 'light';
            setTheme(initial);
            applyTheme(initial);
        }
    }, []);

    // Toggle between light and dark themes
    const toggleTheme = () => {
        const next = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        localStorage.setItem('theme', next);
        applyTheme(next);
    };
    
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
            {/* Theme toggle */}
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'light' ? '🌚' : '🌞'}
            </button>
        </nav>
    );
};

export default Navbar;