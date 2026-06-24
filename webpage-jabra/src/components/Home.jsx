import React from 'react'
import { supabase } from '../supabase-client'
import { athlete } from '../config/athlete'
import '../css/Home.css'

const portfolioDescription =
    `${athlete.firstName} ${athlete.lastName} is a professional triathlete who has been competing in the sport for over 10 years. He is known for his strong performance in long-distance triathlons and his dedication to training and racing.`

function getImageUrl(path) {
    return supabase.storage.from('images').getPublicUrl(path).data.publicUrl
}

const portfolioItems = [
    {
        number: '01',
        title: `Athlete Profile: ${athlete.firstName} ${athlete.lastName}`,
        description: portfolioDescription,
        href: '/about',
        imagePath: '/about/about.JPG',
    },
    {
        number: '02',
        title: 'Race Days',
        description: portfolioDescription,
        href: '/raceplan',
        imagePath: '/about/ap_ziel.JPG',
    },
    {
        number: '03',
        title: 'Training Journey',
        description: portfolioDescription,
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
                    <img src={heroImageUrl} alt='Home' />
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
