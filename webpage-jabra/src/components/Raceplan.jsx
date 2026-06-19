import React from 'react'
import { supabase } from '../supabase-client'
import { useState, useEffect } from 'react'

async function getRaces() {
    const { data, error } = await supabase.from('races').select('*')
    if (error) {
        console.error(error)
        return []
    }
    return data
}

const handleRaceClick = (race) => {

}

export default function Raceplan() {
    const [races, setRaces] = useState([])
    const [expandedRace, setExpandedRace] = useState(null)

    const toggleRace = (id) => {
        setExpandedRace(current => current === id ? null : id);
    };



    useEffect(() => {
        getRaces().then(setRaces)
    }, [])
    console.log(races)

    return (
        <div className='raceplan-container'>
            <div className='raceplan-section-content'>
                <h1 className='raceplan-section-title'>Raceplan</h1>
                <ul className='raceplan-section-grid'>
                    {races.map((race) => (
                        <div
                        key={race.id}
                        className='raceplan-section-card'
                        onClick={() => toggleRace(race.id)}
                        >
                            <h3 className='raceplan-section-card-title'>{race.name}</h3>
                            {expandedRace === race.id && (
                                <>
                                    <p>{race.race_date}</p>
                                    <p>{race.location} ({race.country_code})</p>
                                    <p>{race.distance}</p>
                                    <a href={race.event_url} target='_blank' rel='noopener noreferrer'>{race.event_url}</a>
                                </>
                            )}
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    )
}