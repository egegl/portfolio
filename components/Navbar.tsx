'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import './Navbar.css';
import {TypeAnimation} from "react-type-animation";

const Navbar = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    // Mobile menu open state
    const [isOpen, setIsOpen] = useState(false);

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

    // Randomize foreground & background to two colorful hues
    const randomizeColors = () => {
        const root = document.documentElement;
        const randColor = () => {
            const h = Math.floor(Math.random() * 360);
            const s = Math.floor(Math.random() * 50) + 50;
            const l = Math.floor(Math.random() * 40) + 40;
            return `hsl(${h},${s}%,${l}%)`;
        };
        root.style.setProperty('--background', randColor());
        root.style.setProperty('--foreground', randColor());
    };

    const toggleMenu = () => setIsOpen(!isOpen);
    return (
        <nav className="navbar">
            <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <TypeAnimation
                    sequence={[
                        "Hi, I'm Ege!"
                    ]}
                    cursor={true}
                    repeat={0}
                />
            </div>
            {/* Mobile menu toggle */}
            <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
                {isOpen ? '✕' : '☰'}
            </button>
            <ul className={`nav-links${isOpen ? ' open' : ''}`}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/projects">Projects</Link></li>
                <li><Link href="/contact">Contact</Link></li>
            </ul>
            {/* Theme toggle */}
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'light' ? '🌚' : '🌞'}
            </button>

            <button className="randomize-toggle" disabled={true}>
                |
            </button>

            {/* Random color brush */}
            <button className="randomize-toggle" onClick={randomizeColors} aria-label="Random colors">
                🎨
            </button>
        </nav>
    );
};

export default Navbar;