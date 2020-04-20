import React, {useState, useEffect} from 'react'
import {getKormorovSmirnov} from '../../services/kolmogorovSmirnov'

const PruebaUniformidadKolSmir = () =>{
    let [c, setC] = useState('')
    let [currentNum, setCurrentNum] = useState('');
    let [numbersCSVString, setNumbersCSVString] = useState('');
    let [numbers, setNumbers] = useState([]);
    let [numbersLength, setNumbersLength] = useState(0);
    let [acepta, setAcepta] = useState(false);
    let [testRun, setTestRun] = useState(false);
    let [alpha, setAlpha] = useState(0);
    let [testTable, setTestTable] = useState([]);
    let [dTableValue, setDTableValue] = useState(0);
    let [dValue, setDValue] = useState(0);
    let [dMaxVal, setDMaxVal] = useState(0);
    let [dMinVal, setDMinVal] = useState(0);

    useEffect(()=>{
        if(dTableValue>dValue){
            setAcepta(true);
        }
        if(dTableValue>0 && dValue > 0){
            setTestRun(true);
        }
    },[dValue])
    useEffect(()=>{
        setDTableValue(getKormorovSmirnov(alpha,numbersLength));
    },[alpha, numbersLength])

    useEffect(()=>{
        console.log(dMaxVal, dMinVal)
        setDValue(dMaxVal>dMinVal?dMaxVal:dMinVal)
    }, [dMaxVal,dMinVal])
    const addCSVValues = () => {
        if(parseFloat(c)){
            let nums = numbersCSVString.split(',').map((e)=>parseFloat(e));
            if(nums.length<=20){
                setAlpha(parseFloat(c))
                setNumbers([...nums])
                setNumbersLength(nums.length);
            }
        }
    }
    const addValueToArray = () =>{
        let temp = [...numbers]
        temp.push(currentNum)
        setNumbers(temp);
        setCurrentNum('');
        setNumbersLength(temp.length);
    }

    const calculateTest = () =>{
        if(numbers.length>0){
            let nums = numbers.sort((a,b)=> parseFloat(a)-parseFloat(b));
            let firstRow = []
            let secondRow = []
            let thirdRow = []
            let fourthRow = []
            let fifthRow = [];
            for(let i = 0; i< numbersLength; i++){
                firstRow[i] = (i + 1) / numbersLength;
                secondRow[i] = nums[i];
                thirdRow[i] = i / numbersLength;
                fourthRow[i] = parseFloat(firstRow[i]-secondRow[i]).toFixed(4);
                fifthRow[i] = parseFloat(nums[i] - thirdRow[i]).toFixed(4)
            }
            let table = [firstRow, secondRow, thirdRow, fourthRow,fifthRow];
            setTestTable(table);
            setDMaxVal(Math.max(...fourthRow));
            setDMinVal(Math.min(...fifthRow));
        }
    }

    return (
        <div>
            <div className='row d-flex justify-content-center'>
                <h1>
                    Prueba de Uniformidad Kolmogorov Smirnov
                </h1>
            </div>
            <div className='form-group'>
                <div className='row'>
                    <div className='col-6 d-flex justify-content-between inputs' >
                        <label for='semilla'>Valor de Alpha:</label>
                        <input id='semilla' type='text' value={c} onChange={(e)=>setC(e.target.value)}/>
                    </div>
                </div>
                <div className='row '>
                    <div className='col-6 d-flex flex-column'>
                        <div className='d-flex flex-column'>
                            <label for='numero'>Ingresar digitos de uno en uno:</label>
                            <div className='d-flex'>
                                <input id='numero' type='text' value={currentNum} onChange={(e)=>setCurrentNum(e.target.value)}/>
                                <div className='btn btn-primary ml-auto p-2' onClick={(e)=>addValueToArray()}>Agregar</div>
                            </div>
                        </div>
                        <div className='d-flex flex-column'>
                            <label for='csv'>Ingresar digitos separados por comas (Estilo de un csv):</label>
                            <div className='d-flex'>
                                <textarea id='csv' className='form-control' value={numbersCSVString} onChange={(e)=>setNumbersCSVString(e.target.value)}/>
                                <div className='btn btn-primary ml-auto p-2' onClick={(e)=>addCSVValues()}>Agregar</div>
                            </div>
                        </div>
                    </div>
                    <div className='col-6 d-flex flex-wrap inputs' >
                        {numbers.map((num)=>{
                            return <p className='number-list'>{num}</p>
                        })}
                    </div>
                </div>
                <div className='row'>
                    <div className='col-6 d-flex justify-content-end inputs'>
                        <div className='btn btn-primary' onClick={(e)=>calculateTest()}>Correr Prueba</div>
                    </div>
                </div>
            </div>
            <div className='container'>
                {
                    testRun ? 
                    <div>
                        <div className='container'> 
                            <div className='row'>
                                <div className='col-12'>
                                    <h7>H0</h7>
                                    <p>Como el D = {dValue.toFixed(4)}, se encuentra tiene un valor menor al de la tabla {dTableValue.toFixed(4)} no se puede rechazar el 
                                    planteamiento que los números se distribuyen uniformemente (Con un nivel de confianza {(1-c)*100}%)</p>
                                </div>
                                <div className='col-12'>
                                    <h7>H1</h7>
                                    <p>Como el D = {dValue.toFixed(4)}, se encuentra tiene un valor mayor al de la tabla {dTableValue.toFixed(4)} se puede rechazar el 
                                    planteamiento que los números se distribuyen uniformemente (Con un nivel de confianza {(1-c)*100}%)</p>
                                </div>
                            </div>
                        </div>
                        {acepta ?
                        <div className="card text-white bg-secondary mb-3" >
                            <div className="card-header">No se puede negar la hipotesis</div>
                            <div className="card-body">
                                <h5 className="card-title">Como el D = {dValue.toFixed(4)}, se encuentra tiene un valor menor al de la tabla {dTableValue.toFixed(4)} no se puede rechazar el 
                                planteamiento que los números se distribuyen uniformemente (Con un nivel de confianza {(1-c)*100}%) </h5>
                                <div className="row">
                                    <div className="col-6 d-flex">
                                        <p className="card-text">D= {dValue.toFixed(4)}</p>
                                        <p className="card-text ml-auto p-2">D de tabla= {dTableValue.toFixed(4)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>:<div className="card text-white bg-secondary mb-3" >
                            <div className="card-header">Se niega la hipotesis</div>
                            <div className="card-body">
                                <h5 className="card-title">Como el D = {dValue.toFixed(4)}, se encuentra tiene un valor mayor al de la tabla {dTableValue.toFixed(4)} se puede rechazar el 
                                planteamiento que los números se distribuyen uniformemente (Con un nivel de confianza {(1-c)*100}%) </h5>
                                <div className="row">
                                    <div className="col-6 d-flex">
                                    <p className="card-text">D= {dValue.toFixed(4)}</p>
                                    <p className="card-text ml-auto p-2">D de tabla= {dTableValue.toFixed(4)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                    :
                    <div className='container'> 
                            <div className='row'>
                                <div className='col-12'>
                                    <h7>H0</h7>
                                    <p>Como el D = (valor obtenido de D), se encuentra tiene un valor menor al de la tabla (valor de la tabla) no se puede rechazar el 
                                planteamiento que los números se distribuyen uniformemente (Con un nivel de confianza {(1-c)*100}%)</p>
                                </div>
                                <div className='col-12'>
                                    <h7>H1</h7>
                                    <p>Como el D = (valor obtenido de D), se encuentra tiene un valor mayor al de la tabla (valor de la tabla) se puede rechazar el 
                                planteamiento que los números se distribuyen uniformemente (Con un nivel de confianza {(1-c)*100}%)</p>
                                </div>
                            </div>
                        </div>
                } 
            </div>
        </div>
    )
}

export default PruebaUniformidadKolSmir