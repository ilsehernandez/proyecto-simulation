import React, {useState, useEffect} from 'react'
import jStat from 'jstat'
import {standardNormalTable} from 'simple-statistics'
import chi from 'chi-squared'
import chiSquareInverse from 'inv-chisquare-cdf'

const PruebaVarianza = () =>{
    let [c, setC] = useState('')
    let [currentNum, setCurrentNum] = useState('');
    let [numbersCSVString, setNumbersCSVString] = useState('');
    let [numbers, setNumbers] = useState([]);
    let [acepta, setAcepta] = useState(false);
    let [testRun, setTestRun] = useState(false);
    let [media, setMedia] = useState(0);
    let [alpha, setAlpha] = useState(0.05);
    let [limitI, setLimitI] = useState(0);
    let [limitS, setLimitS] = useState(0);
    let [variance, setVariance] = useState(0);

    useEffect(()=>{
        let degreeFreed = numbers.length? numbers.length -1 : 1;
        let temp = (12*(numbers.length-1));
        setLimitI(chiSquareInverse.invChiSquareCDF(alpha/2,degreeFreed)/temp);
        setLimitS(chiSquareInverse.invChiSquareCDF((1-(alpha/2)),degreeFreed)/temp);
    },[alpha, numbers])

    useEffect(()=>{
        let temp = numbers.length>0 ? numbers.reduce((prev,curr)=>{
            return (Number(prev) + Math.pow(Number(curr)-media,2))
        }):'';
        setVariance(temp/(numbers.length-1));
    }, [media])

    useEffect(()=>{
        if(limitI< variance&&limitS>variance){
            setAcepta(true);
        }
        if(variance>0)
            setTestRun(true);
    }, [variance])

    const addCSVValues = () => {
        if(parseFloat(c)){
            let nums = numbersCSVString.split(',').map((e)=>parseFloat(e));
            setAlpha(parseFloat(c))
            setNumbers([...nums])
        }
    }
    const addValueToArray = () =>{
        setNumbers([...numbers, currentNum]);
        setCurrentNum('');
    }

    const calculateMed = () =>{
        if(numbers.length>0){
            let sum = numbers.reduce((prev,curr)=>{
                return (Number(prev)+Number(curr)).toFixed(4)}
            )
            setMedia(sum/numbers.length)
        }
    }

    return (
        <div>
            <div className='row d-flex justify-content-center'>
                <h1>
                    Prueba de Varianza
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
                        <div className='btn btn-primary' onClick={(e)=>calculateMed()}>Correr Prueba</div>
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
                                    <p>Dada la varianza = {variance.toFixed(4)}, se encuentra dentro de los límites y no se puede rechazar el 
                                    planteamiento que el conjunto de números tiene una varianza de 1/12 (Con un nivel de confianza {(1-c)*100}%)</p>
                                </div>
                                <div className='col-12'>
                                    <h7>H1</h7>
                                    <p>Dada la varianza = {variance.toFixed(4)}, no se encuentra dentro de los límites se puede rechazar el 
                                    planteamiento que el conjunto de números tiene una varianza de 1/12 (Con un nivel de confianza {(1-c)*100}%)</p>
                                </div>
                            </div>
                        </div>
                        {acepta ?
                        <div className="card text-white bg-secondary mb-3" >
                            <div className="card-header">No se puede negar la hipotesis</div>
                            <div className="card-body">
                                <h5 className="card-title">Dada la varianza = {variance.toFixed(4)}, se encuentra dentro de los límites y no se puede rechazar el 
                                planteamiento que el conjunto de números tiene una varianza de 1/12 (Con un nivel de confianza {(1-c)*100}%) </h5>
                                <div className="row">
                                    <div className="col-6 d-flex">
                                        <p className="card-text">LI= {limitI.toFixed(4)}</p>
                                        <p className="card-text ml-auto p-2">LS= {limitS.toFixed(4)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>:<div className="card text-white bg-secondary mb-3" >
                            <div className="card-header">Se niega la hipotesis</div>
                            <div className="card-body">
                                <h5 className="card-title">Dada la varianza = {variance.toFixed(4)}, no se encuentra dentro de los límites se puede rechazar el 
                                planteamiento que el conjunto de números tiene una varianza de 1/12 (Con un nivel de confianza {(1-c)*100}%) </h5>
                                <div className="row">
                                    <div className="col-6 d-flex">
                                        <p className="card-text">LI= {limitI.toFixed(4)}</p>
                                        <p className="card-text ml-auto p-2">LS= {limitS.toFixed(4)}</p>
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
                                <p>Dada la varianza = nuestra varianza, se encuentra dentro de los límites y no se puede rechazar el 
                                planteamiento que el conjunto de números tiene una varianza de 1/12 (Con un nivel de confianza {(1-c)*100}%)</p>
                            </div>
                            <div className='col-12'>
                                <h7>H1</h7>
                                <p>Dada la varianza = nuestra varianza, no se encuentra dentro de los límites se puede rechazar el 
                                planteamiento que el conjunto de números tiene una varianza de 1/12 (Con un nivel de confianza {(1-c)*100}%)</p>
                            </div>
                        </div>
                    </div>
                } 
            </div>
        </div>
    )
}

export default PruebaVarianza