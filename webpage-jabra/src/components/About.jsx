import React from 'react'
import { athlete } from '../config/athlete'

export default function About() {
    return (
        <div className='about-container'>
            <div className='about-section-image'>

            </div>
            <div className='about-section-content'>
                <h1 className='about-section-title'>About {athlete.firstName}</h1>

            </div>
            <div className='about-section-info'>
                <dl className='about-section-info-list'>
                    <div className='about-page-row'>
                        <dt className='about-page-label'>Name: </dt>
                        <dd className='about-page-value'>{athlete.firstName} {athlete.lastName}</dd>
                    </div>
                    <div className='about-page-row'>
                        <dt className='about-page-label'>Geburtstag: </dt>
                        <dd className='about-page-value'>{athlete.birthdate}</dd>
                    </div>
                    <div className='about-page-row'>
                        <dt className='about-page-label'>Wohnort: </dt>
                        <dd className='about-page-value'>{athlete.location}</dd>
                    </div>
                    <div className='about-page-row'>
                        <dt className='about-page-label'>Hobbys: </dt>
                        <dd className='about-page-value'>{athlete.hobbies.join(', ')}</dd>
                    </div>
                    <div className='about-page-row'>
                        <dt className='about-page-label'>Motivation: </dt>
                        <dd className='about-page-value'>{athlete.motivation}</dd>
                    </div>
                    <div className='about-page-row'>
                        <dt className='about-page-label'>Ziel: </dt>
                        <dd className='about-page-value'>{athlete.goals}</dd>
                    </div>
                    <div className='about-page-row'>
                        <dt className='about-page-label'>Sportliche Vergangenheit: </dt>
                        <dd className='about-page-value'>{athlete.sportiveHistory}</dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}