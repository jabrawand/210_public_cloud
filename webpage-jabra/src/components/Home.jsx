import React from 'react'
import { supabase } from '../supabase-client'
import { useState, useEffect } from 'react'
import { athlete } from '../config/athlete'


export default function Home() {
    return (
        <div className='home-container'>
            <div className='home-section-content'>
                <p className='home-section-subtitle'>Mein Ziel</p>
                <h1 className='home-section-title'>{athlete.goals}</h1>
            </div>
            <div className='home-section-image'>

            </div>
        </div>
    )
}