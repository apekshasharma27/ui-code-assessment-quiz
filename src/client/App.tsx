import * as React from 'react';
import Questions from './Questions';
import './Questions.css';

export const App = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="questionCockpitStyle">
        <Questions/>
        </div>
    </div>

);
