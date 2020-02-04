import React from 'react';
import ColorInput from './components/color-input/color-input';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="title">Palette Generator</div>
      </header>
      <ColorInput />
    </div>
  );
}

export default App;
