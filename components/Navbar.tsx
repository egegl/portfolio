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
            // Set theme colors
            document.documentElement.style.setProperty('--background', stored === 'light' ? '#ffffff' : '#0a0a0a');
            document.documentElement.style.setProperty('--foreground', stored === 'light' ? '#171717' : '#ededed');
            // Set shadows based on theme
            document.documentElement.style.setProperty('--shadow-effect', stored === 'light' ? 
                `0 2px 4px rgba(0, 0, 0, 0.1),
                 0 4px 8px rgba(0, 0, 0, 0.1),
                 0 8px 16px rgba(0, 0, 0, 0.1),
                 0 16px 32px rgba(0, 0, 0, 0.1)` :
                `0 2px 4px rgba(255, 255, 255, 0.15),
                 0 4px 8px rgba(255, 255, 255, 0.15),
                 0 8px 16px rgba(255, 255, 255, 0.15),
                 0 16px 32px rgba(255, 255, 255, 0.15)`
            );
            // Set small shadows for interactive elements
            document.documentElement.style.setProperty('--shadow-small', stored === 'light' ? 
                `0 1px 2px rgba(0, 0, 0, 0.3)` :
                `0 1px 2px rgba(255, 255, 255, 0.3)`
            );
        } else {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initial = systemDark ? 'dark' : 'light';
            setThemeState(initial);
            // Set theme colors
            document.documentElement.style.setProperty('--background', initial === 'light' ? '#ffffff' : '#0a0a0a');
            document.documentElement.style.setProperty('--foreground', initial === 'light' ? '#171717' : '#ededed');
            // Set shadows based on theme
            document.documentElement.style.setProperty('--shadow-effect', initial === 'light' ? 
                `0 2px 4px rgba(0, 0, 0, 0.1),
                 0 4px 8px rgba(0, 0, 0, 0.1),
                 0 8px 16px rgba(0, 0, 0, 0.1),
                 0 16px 32px rgba(0, 0, 0, 0.1)` :
                `0 2px 4px rgba(255, 255, 255, 0.15),
                 0 4px 8px rgba(255, 255, 255, 0.15),
                 0 8px 16px rgba(255, 255, 255, 0.15),
                 0 16px 32px rgba(255, 255, 255, 0.15)`
            );
            // Set small shadows for interactive elements
            document.documentElement.style.setProperty('--shadow-small', initial === 'light' ? 
                `0 1px 2px rgba(0, 0, 0, 0.3)` :
                `0 1px 2px rgba(255, 255, 255, 0.3)`
            );
        }
    }, []);

    // Toggle between light and dark themes
    const toggleTheme = () => {
        const next = theme === 'light' ? 'dark' : 'light';
        setThemeState(next);
        localStorage.setItem('theme', next);
        
        // Reset to default theme colors
        document.documentElement.style.setProperty('--background', next === 'light' ? '#ffffff' : '#0a0a0a');
        document.documentElement.style.setProperty('--foreground', next === 'light' ? '#171717' : '#ededed');
        
        // Set shadows based on the new theme
        document.documentElement.style.setProperty('--shadow-effect', next === 'light' ? 
            `0 2px 4px rgba(0, 0, 0, 0.1),
             0 4px 8px rgba(0, 0, 0, 0.1),
             0 8px 16px rgba(0, 0, 0, 0.1),
             0 16px 32px rgba(0, 0, 0, 0.1)` :
            `0 2px 4px rgba(255, 255, 255, 0.15),
             0 4px 8px rgba(255, 255, 255, 0.15),
             0 8px 16px rgba(255, 255, 255, 0.15),
             0 16px 32px rgba(255, 255, 255, 0.15)`
        );
        // Set small shadows for interactive elements
        document.documentElement.style.setProperty('--shadow-small', next === 'light' ? 
            `0 1px 2px rgba(0, 0, 0, 0.3)` :
            `0 1px 2px rgba(255, 255, 255, 0.3)`
        );
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
        
        // Set the colors
        root.style.setProperty('--background', bgColor);
        root.style.setProperty('--foreground', fgColor);
        
        // Set dark shadows for randomized colors
        root.style.setProperty('--shadow-effect', `
            0 2px 4px rgba(0, 0, 0, 0.1),
            0 4px 8px rgba(0, 0, 0, 0.1),
            0 8px 16px rgba(0, 0, 0, 0.1),
            0 16px 32px rgba(0, 0, 0, 0.1)
        `);
        // Set small shadows for interactive elements
        root.style.setProperty('--shadow-small', `0 1px 2px rgba(0, 0, 0, 0.3)`);
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