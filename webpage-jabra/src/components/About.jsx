import React from 'react'
import { athlete } from '../config/athlete'
import { supabase } from '../supabase-client'
import '../css/About.css'

export default function About() {
    const { data } = supabase.storage.from('images').getPublicUrl('/about/ap_ziel.JPG');
    const publicUrl = data.publicUrl;
    return (
        <div className='about-container'>
            <h1 className='about-section-title'>About {athlete.firstName}</h1>

            <div className='about-body'>
                <div className='about-section-image'>
                    <img src={publicUrl} alt='About' />
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
        </div>
    )
}
