import React, { useState, useEffect } from 'react'
import {standardNormalTable} from 'simple-statistics'

const PruebaIndepCorrArrAb = () => {
    let [c, setC] = useState('')
    let [nums, setNums] = useState([]);
    let [testRun, setTestRun] = useState('')
    let [acepta, setAcepta] = useState('');
    let [numbersCSVString, setNumbersCSVString] = useState('');
    let [currentNum, setCurrentNum] = useState('');
    let [numbers, setNumbers] = useState([]);
    let [rawList, setRawList] = useState("");
    let [corridas, setCorridas] = useState(0);
    let [mCo, setMco] = useState(0);
    let [chiCoSq, setChicoSq] = useState(0);
    let [zo, setZo] = useState(0);
    let [size, setSize] = useState(0);
    let [display, setDisplay] = useState(false);
    let [alpha, setAlpha] = useState(0)

    useEffect(()=>{
        if(zo<alpha){
            setAcepta(true);
        }
        if(zo>0){
            setTestRun(true);
        }
    },[alpha,zo])

    const addCSVValues = () => {
        if(parseFloat(c)){
            let temp = numbersCSVString.split(',').map((e)=>parseFloat(e));
            console.log(temp)
            setAlpha(parseFloat(c))
            setNums([...temp])
            setSize(temp.length)
        }
    }

    const addValueToArray = () =>{
        setNumbers([...numbers, currentNum]);
        setCurrentNum('');
    }

    const calculate = () => {
        console.log(nums)
        let s = compareAdjacent(nums)
        let corridas = calculateCorrida(s)
        let mco = calcMCO(size)
        let chiCo = calcChiCo(size)
        let zo = calcZo(corridas, mco, chiCo)
        standardNormalTable.forEach((val, index)=>{
            if(val===1-(parseFloat(c)/2))
                setAlpha(index)
        })
        setCorridas(corridas)
        setMco(mco)
        setChicoSq(chiCo)
        setZo(zo)
        setDisplay(true)
    }

    const inputToList = () => {
        let cleanedList = rawList.split(',').map((x) => {
            return x.trim()
        })
        return cleanedList
    }

    const compareAdjacent = (list) => {
        let s = []
        for (let i = 1; i < list.length; i++) {
            if (list[i - 1] <= list[i]) {
                s.push(1)
            } else {
                s.push(0)
            }
        }
        return s
    }

    const calculateCorrida = (s) => {
        let flag = s[0]
        let Co = 1
        s.forEach((x) => {
            if (x !== flag) {
                Co++
                flag = x
            }
        })
        return Co
    }

    const calcMCO = (n) => {
        return (2 * n - 1) / 3
    }

    const calcChiCo = (n) => {
        return (16 * n - 29) / 90
    }

    const calcZo = (co, mco, chiCo) => {
        return Math.abs((co - mco) / Math.sqrt(chiCo))
    }

    return (
        <div>
            <div className='row d-flex justify-content-center'>
                <h1>
                    Prueba Independencia Corridas Arriba y Abajo
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
                        <div className='btn btn-primary' onClick={(e)=>calculate()}>Correr Prueba</div>
                    </div>
                </div>
            </div>
            <div className="row">
            <div className='container'>
                {
                    testRun ? 
                    <div className='col-12'>
                        <div className='row'>
                            <div className=''> 
                                <div className='row'>
                                    <div className='col-12'>
                                        <h7>H0</h7>
                                        <p>Dado el Z0 = {zo.toFixed(4)}, tiene un valor menor al de la tabla {alpha*.01} no se puede rechazar el 
                                        planteamiento que el conjunto de números son independientes (Con un nivel de confianza {(1-c)*100}%)</p>
                                    </div>
                                    <div className='col-12'>
                                        <h7>H1</h7>
                                        <p>Dado el Z0 = {zo.toFixed(4)}, tiene un valor mayor al de la tabla {alpha*.01} se puede rechazar el 
                                        planteamiento que el conjunto de números son independientes (Con un nivel de confianza {(1-c)*100}%)</p>
                                    </div>
                                </div>
                            </div>  
                        </div>
                        <div className="row d-flex border-bottom">
                            <div className="col ">
                                Tamaño:
                            </div>
                            <div className="col">
                                {size}
                            </div>
                        </div>
                        <div className="row d-flex border-bottom">
                                <div className='col-6'>
                                    Corridas:
                                </div>
                                <div className='col-6'>
                                    {corridas}
                                </div>
                        </div>
                        <div className="row d-flex border-bottom">
                                <div className='col-6'>
                                    MC0:
                                </div>
                                <div className='col-6'>
                                    {mCo.toFixed(4)}
                                </div>
                        </div>
                        <div className="row d-flex border-bottom">
                                <div className='col-6'>
                                    Chi2 C0:
                                </div>
                                <div className='col-6'>
                                    {chiCoSq.toFixed(4)}
                                </div>
                        </div>
                        <div className="row d-flex border-bottom">
                                <div className='col-6'>
                                    Z0:
                                </div>
                                <div className='col-6'>
                                    {zo.toFixed(4)}
                                </div>
                        </div>
                        {acepta ?
                        <div className="card text-white bg-secondary mb-3" >
                            <div className="card-header">No se puede negar la hipotesis</div>
                            <div className="card-body">
                                <h5 className="card-title">Dado el Z0 = {zo.toFixed(4)}, tiene un valor menor al de la tabla {alpha*.01} no se puede rechazar el 
                                planteamiento que el conjunto de números son independientes (Con un nivel de confianza {(1-c)*100}%) </h5>
                                <div className="row">
                                    <div className="col-6 d-flex">
                                        <p className="card-text">Z de tabla= {alpha*.01}</p>
                                    </div>
                                </div>
                            </div>
                        </div>:<div className="card text-white bg-secondary mb-3" >
                            <div className="card-header">Se niega la hipotesis</div>
                            <div className="card-body">
                                <h5 className="card-title">Dado el Z0 = {zo.toFixed(4)}, tiene un valor mayor al de la tabla {alpha*.01} se puede rechazar el 
                                planteamiento que el conjunto de números son independientes (Con un nivel de confianza {(1-c)*100}%)</h5>
                                <div className="row">
                                    <div className="col-6 d-flex">
                                    <p className="card-text ml-auto p-2">Zo de tabla= {alpha*.01}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                    :
                    <div className=''> 
                        <div className='row'>
                            <div className='col-12'>
                                <h7>H0</h7>
                                <p>Dado el Z0 = (valor obtenido de Z0), tiene un valor menor al de la tabla (valor obtenido en la tabla de distribución normal) no se puede rechazar el 
                                planteamiento que el conjunto de números son independientes (Con un nivel de confianza {(1-c)*100}%)</p>
                            </div>
                            <div className='col-12'>
                                <h7>H1</h7>
                                <p>Dado el Z0 = (valor obtenido de Z0), tiene un valor mayor al de la tabla (valor obtenido en la tabla de distribución normal) se puede rechazar el 
                                planteamiento que el conjunto de números son independientes (Con un nivel de confianza {(1-c)*100}%)</p>
                            </div>
                        </div>
                    </div>  
                } 
            </div>
      </div>
    </div>
      
  );
};

export default PruebaIndepCorrArrAb;
