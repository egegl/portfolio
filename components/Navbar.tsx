'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import './Navbar.css';
import {TypeAnimation} from "react-type-animation";

export default function Navbar() {
    const { setTheme } = useTheme();
    const [theme, setThemeState] = useState<'light' | 'dark'>('light');
    // Mobile menu open state
    const [isOpen, setIsOpen] = useState(false);

    // Apply CSS variable values based on current theme
    const applyTheme = (newTheme: 'light' | 'dark') => {
        document.documentElement.style.setProperty('--background', newTheme === 'light' ? '#ffffff' : '#000000');
        document.documentElement.style.setProperty('--foreground', newTheme === 'light' ? '#000000' : '#ffffff');
    };

    // On mount: load stored theme or system preference
    useEffect(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') {
            setThemeState(stored);
            applyTheme(stored);
        } else {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initial = systemDark ? 'dark' : 'light';
            setThemeState(initial);
            applyTheme(initial);
        }
    }, []);

    // Toggle between light and dark themes
    const toggleTheme = () => {
        const next = theme === 'light' ? 'dark' : 'light';
        setThemeState(next);
        localStorage.setItem('theme', next);
        applyTheme(next);
    };

    // Randomize foreground & background to two colorful hues
    const randomizeColors = () => {
        const root = document.documentElement;
        
        // Generate a random color with good brightness
        const randColor = (minLightness = 40, maxLightness = 60) => {
            const h = Math.floor(Math.random() * 360);
            const s = Math.floor(Math.random() * 30) + 70; // Higher saturation for more vibrant colors
            const l = Math.floor(Math.random() * (maxLightness - minLightness)) + minLightness;
            return `hsl(${h},${s}%,${l}%)`;
        };

        // Generate background color
        const bgColor = randColor(40, 60);
        
        // Generate foreground color with opposite lightness
        const fgColor = randColor(20, 30); // Darker foreground for light background
        // or
        // const fgColor = randColor(80, 90); // Lighter foreground for dark background
        
        // Set the colors
        root.style.setProperty('--background', bgColor);
        root.style.setProperty('--foreground', fgColor);
    };

    const toggleMenu = () => setIsOpen(!isOpen);
    return (
        <nav className="navbar">
            <div className="w-full flex items-center px-4 py-6 sm:px-6 lg:px-8">
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
            </div>
        </nav>
    );
}