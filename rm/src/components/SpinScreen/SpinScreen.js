import React from 'react'
import { ProgressSpinner } from 'primereact/progressspinner';
import classes from './SpinScreen.module.css'

const SpinScreen = () => {
    return (
        <div className={`card flex justify-content-center spinscreen align-items-center ${classes.spinscreen}`}>
            <ProgressSpinner />
        </div>
    )
}

export default SpinScreen