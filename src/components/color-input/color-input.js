import React, { useCallback, useState } from 'react';
import paletteGenerator from 'zm-palette-generator';
import './color-input.css'

const categories= ['primary', 'secondary', 'tertiary', 'quarternary', 'success', 'info', 'warning'];
const categoryLabels= ['Primary', 'Secondary', 'Tertiary', 'Quarternary', 'Success', 'Info', 'Warning'];
const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

function showOutput(outputArray) {
    debugger;
    const outputContainer = document.getElementById('palette-display');
    outputContainer.innerHTML = '';
    outputArray.forEach((outerItem, index) => {
        const colorCol = document.createElement('div');
        colorCol.className = 'col-width';
        const colLabel = document.createElement('div');
        colLabel.innerText = categoryLabels[index];
        colLabel.className="col-label";
        Object.keys(outerItem).forEach(item => {
            const colorBox = document.createElement('div');
            colorBox.className = 'h-30';
            colorBox.style.backgroundColor = `${outerItem[item]}`
            colorBox.innerText = `${outerItem[item]}`;
            colorCol.appendChild(colorBox);
        });
        colLabel.append(colorCol);
        outputContainer.appendChild(colLabel);
    })
}



function copyToClipboard(val){
    const output = document.getElementById("palette-snippet");
    output.innerHTML=val;

    const dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute("id", "dummy_id");
    dummy.innerText=val;
    dummy.select();
    dummy.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function getPalette(colorArray, paletteChoice) {
    const outputColorArray = [];
    let str = `<div class="pre-div"><div >:root {\n</div>`;
    Object.keys(colorArray).forEach(item => {
        const generatedJson = [];
        debugger;
        const genPalettes = paletteGenerator(colorArray[item], paletteChoice);
        Object.keys(genPalettes).forEach((c, i) => {
            generatedJson.push(genPalettes[c]);
            str += `<div class="pal-str"><div style="width: 200px">--brand-${item}-${shades[i]}:</div> <span style="background-color: ${genPalettes[c]};padding: 2px 10px; margin-right: 10px"></span>${genPalettes[c]};</div>`;
        });
        outputColorArray.push(generatedJson);
    });

    str += `<div>}</div></div>`;
    console.log('Str: ', str);
    // showOutput(outputColorArray);
    copyToClipboard(str);
}
   
const ColorInput = function () {

    const [categoryValue, setCategoryValue] = useState({});
    const [paletteChoice, setPaletteChoice] = useState('traditional')

    const handleInputChange = useCallback((e) => {
        e.persist();
        const newCategoryValue = {
            ...categoryValue,
            [e.target.id]: e.target.value,
            
        }
        setCategoryValue(categoryValue => newCategoryValue)
    }, [categoryValue]);

    const validateColorcodes = useCallback((colorCodes) => {
        var regex = new RegExp('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$');
        let flag = true;
        Object.keys(colorCodes).map(code => {
            if(!regex.test(colorCodes[code])) {
                flag = false;
            }
            return colorCodes[code];
        });
        !flag && alert('Invalid code!');
        return flag;
    }, []);

    const handleSubmit = useCallback(() => {
        console.log(categoryValue); 
        console.log('C: ', paletteChoice);
        validateColorcodes(categoryValue) ? getPalette(categoryValue, paletteChoice) : setCategoryValue({});
    }, [categoryValue, paletteChoice, validateColorcodes]);

    const handlePaletteChoice = useCallback((e) => {
        e.persist();
        setPaletteChoice(e.target.value);
    },[]);

    return (
        <div>
            <div className="container-top">
                {categories.map((item, index) => {
                    return (
                    <div className="input-container" key={item}>
                        <label htmlFor={`input${item}`} className="category-label">{categoryLabels[index]} Color: </label>
                        <div className="input-item">
                            <input type="text" name={`input${item}`} id={item} onChange={handleInputChange} value={categoryValue[item] || ''} className="category-value" />
                        </div>
                    </div>
                    )
                })}
                <div className="input-container">
                    <label className="category-label">Palette Style: </label>
                    <div className="input-item">
                        <label className="radio-item"><input type="radio" name="palette-style" value='traditional' checked={paletteChoice} onChange={handlePaletteChoice} className="custom-radio" /> Traditional </label>
                        <label className="radio-item"><input type="radio" name="palette-style" value='constantine' onChange={handlePaletteChoice} className="custom-radio"/> Constantine </label>
                    </div>
                    
                </div>
                <button onClick={handleSubmit} className="gen-button">Copy to Clipboard</button>
                
                
            </div>
            <div id="palette-display"></div>
            <div className="output-container">
                <div id="palette-snippet"></div>           
            </div>
        </div>
        
    );
}

export default ColorInput;
