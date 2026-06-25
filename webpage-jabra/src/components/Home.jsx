import React from 'react'
import { supabase } from '../supabase-client'
import { athlete } from '../config/athlete'
import '../css/Home.css'

function getImageUrl(path) {
    return supabase.storage.from('images').getPublicUrl(path).data.publicUrl
}

const portfolioItems = [
    {
        number: '01',
        title: `Athlete Profile: ${athlete.firstName} ${athlete.lastName}`,
        description: `Vom Tennis und Unihockey zum Triathlon: Erfahre mehr über ${athlete.firstName}'s Werdegang, Motivation und seinen Weg zu ${athlete.goals}.`,
        href: '/about',
        imagePath: '/about/about.JPG',
    },
    {
        number: '02',
        title: 'Race Days',
        description: `Kommende Rennen und wichtige Etappen auf dem Weg zu ${athlete.goals} — von der Vorbereitung bis zum Fokus am Renntag.`,
        href: '/raceplan',
        imagePath: '/about/ap_ziel.JPG',
    },
    {
        number: '03',
        title: 'Training Journey',
        description: `Schwimmen, Radfahren und Laufen im Überblick — verfolge das Training, das die Grundlage für die Langdistanz-Leistung legt.`,
        href: '/activities',
        imagePath: '/about/race_day.JPG',
    },
]

export default function Home() {
    const heroImageUrl = getImageUrl('/about/about.JPG')

    return (
        <div className='home-page'>
            <div className='home-container'>
                <div className='home-section-content'>
                    <p className='home-section-subtitle'>Mein Ziel</p>
                    <h1 className='home-section-title'>{athlete.goals}</h1>
                </div>
                <div className='home-section-image'>
                    <img
                        className='home-portfolio-section-card-image home-portfolio-section-card-image--profile'
                        src={heroImageUrl}
                        alt={`${athlete.firstName} ${athlete.lastName}`}
                    />
                </div>
            </div>

            <section className='home-portfolio-section'>
                <div className='home-portfolio-section-inner'>
                    <h2 className='home-portfolio-section-title'>Portfolio</h2>
                    <div className='home-portfolio-section-grid'>
                        {portfolioItems.map((item) => (
                            <article key={item.number} className='home-portfolio-section-card'>
                                <a href={item.href} className='home-portfolio-section-card-link'>
                                    <img
                                        className={`home-portfolio-section-card-image${item.number === '01' ? ' home-portfolio-section-card-image--profile' : ''}`}
                                        src={getImageUrl(item.imagePath)}
                                        alt={item.title}
                                    />
                                    <div className='home-portfolio-section-card-header'>
                                        <h3 className='home-portfolio-section-card-title'>{item.title}</h3>
                                        <span className='home-portfolio-section-card-number'>{item.number}</span>
                                    </div>
                                    <p className='home-portfolio-section-card-description'>{item.description}</p>
                                </a>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
