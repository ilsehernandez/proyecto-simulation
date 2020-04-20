import React, {useState, useEffect} from 'react'
import chiSquareInverse from 'inv-chisquare-cdf'

const PruebaSerie = () =>{
    let [cuadrants, setCuadrants] = useState([])
    let [c, setC] = useState('');
    let [m, setM]= useState(0);
    let [currentNum, setCurrentNum] = useState('');
    let [numbersCSVString, setNumbersCSVString] = useState('');
    let [numbers, setNumbers] = useState([]);
    let [numbersLength, setNumbersLength] = useState(0);
    let [x2Total, setX2Total] = useState(0);
    let [acepta, setAcepta] = useState(false);
    let [testRun, setTestRun] = useState(false);
    let [alpha, setAlpha] = useState(0.05);
    let [chiValue, setChiValue] = useState(0);
    let [testTable, setTestTable] = useState([]);

    useEffect(()=>{
        if(chiValue>x2Total){
            setAcepta(true)
        }
        if(testTable.length>0)
            setTestRun(true);
    }, [x2Total, chiValue])

    useEffect(()=>{
        let degreeFreed = m > 2 ? m -1 : 1;
        console.log(degreeFreed)
        setChiValue(chiSquareInverse.invChiSquareCDF(1-alpha/2,degreeFreed));
    },[alpha, m])

    const addCSVValues = () => {
        if(parseFloat(c)){
            let nums = numbersCSVString.split(',').map((e)=>parseFloat(e));
            setAlpha(parseFloat(c));
            setNumbers([...nums]);
            setNumbersLength(nums.length);
        }
    }
    const addValueToArray = () =>{
        let temp = [...numbers, currentNum];
        setNumbers(temp);
        setNumbersLength(temp.length)
        setCurrentNum('');
    }

    const closestSquareTable = (m) =>{
        let notFound = true;
        let i = 0;
        while(notFound){
            let ibase2 = Math.pow(i,2)
            if(m> ibase2){
                i++;
            } else if(m<ibase2){
                m = ibase2;
                notFound = false;
            } else if(m==ibase2){
                notFound =false;
            }
        }
        return m;
    }

    const calculateSeriesTest = () =>{
        if(numbers.length>0){
            let nums = [...numbers]
            let divs = Math.sqrt(numbersLength);
            let tempM = closestSquareTable(divs);
            let coordinates = []
            console.log(tempM)
            setM(tempM);
            let ei = numbersLength/tempM;
            for(let i = 0; i < numbersLength-1;i++){
                coordinates.push({xValue: nums[i], yValue: nums[i+1]})
            }
            let base = Math.sqrt(tempM);
            let coordX = 0;
            let coordY = 0;
            let range = 1/base;
            let tableCuadrnts = [];
            for(let i = 0; i < base; i++){
                for(let j = 0; j < base; j++){
                    tableCuadrnts.push({
                        lowerX: coordX,
                        higherX: (coordX+range),
                        lowerY: coordY,
                        higherY: (coordY+range)
                    })
                    coordY+=range;
                }
                coordX +=range;
                coordY = 0;
            }
            setCuadrants(tableCuadrnts);
            
            let ammountByCuadrant = []
            for (let i = 0; i < tableCuadrnts.length; i++) {
                for (let j = 0; j < coordinates.length; j++) {
                    if (
                        coordinates[j].xValue > tableCuadrnts[i].lowerX &&
                        coordinates[j].xValue < tableCuadrnts[i].higherX &&
                        coordinates[j].yValue > tableCuadrnts[i].lowerY &&
                        coordinates[j].yValue < tableCuadrnts[i].higherY
                    ) {
                        ammountByCuadrant.push(i);
                    }
                }
            }

            let tempOi = new Array(tableCuadrnts.length).fill(0);

            for(let i = 0; i< ammountByCuadrant.length; i++){
                tempOi[ammountByCuadrant[i]]++;
            }

            let tempx2Vals= [];
            let tempx2TotalVal = 0;
            for (let i = 0; i < tempM; i++) {
                console.log(ei )
                tempx2Vals[i] = parseFloat(
                    (
                        Math.pow(ei - tempOi[i], 2) / ei
                    )
                );
                tempx2TotalVal += tempx2Vals[i];
            }
            setX2Total(tempx2TotalVal);

            let tempTestTable = []
            for(let i = 0; i <tableCuadrnts.length; i++){
                tempTestTable.push({interval: i+1, oi: tempOi[i], ei: ei, x2: tempx2Vals[i]});
            }
            setTestTable(tempTestTable)
        }
    }

    return (
        <div>
            <div className='row d-flex justify-content-center'>
                <h1>
                    Prueba de Series
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
                        <div className='btn btn-primary' onClick={(e)=>calculateSeriesTest()}>Correr Prueba</div>
                    </div>
                </div>
            </div>
            <div className='continer'>
                {
                    testRun ? 
                    <div>
                        <div className='row'>
                            <div className=''> 
                                <div className='row'>
                                    <div className='col-12'>
                                        <h7>H0</h7>
                                        <p> El estadístico de tabla = {chiValue.toFixed(4)} es mayor al error total {x2Total.toFixed(4)}, entonces no se puede rechazar 
                                        que los números del conjunto consecutivos sean independientes (Con un nivel de confianza {(1-c)*100}%)</p>
                                    </div>
                                    <div className='col-12'>
                                        <h7>H1</h7>
                                        <p>El estadístico de tabla = {chiValue.toFixed(4)} es menor al error total {x2Total.toFixed(4)}, entonces 
                                        rechazamos que los números del conjunto consecutivos sean independientes (Con un nivel de confianza {(1-c)*100}%)</p>
                                    </div>
                                </div>
                            </div>  
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>
                                        Intervalo
                                    </th>
                                    <th>
                                        Oi
                                    </th>
                                    <th>
                                        Ei = n/m
                                    </th>
                                    <th>
                                        (Ei-Oi)^2/Ei
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    testTable.map((e)=>{{
                                        return(
                                            <tr>
                                                <td>{e.interval}</td>
                                                <td>{e.oi}</td>
                                                <td>{e.ei.toFixed(4)}</td>
                                                <td>{e.x2.toFixed(4)}</td>
                                            </tr>
                                        )
                                    }})
                                }
                            </tbody>
                        </table>
                        {acepta ?
                        <div className="card text-white bg-secondary mb-3" >
                            <div className="card-header">No se puede negar la hipotesis</div>
                            <div className="card-body">
                                <h5 className="card-title">El estadístico de tabla = {chiValue.toFixed(4)} es mayor al error total {x2Total.toFixed(4)}, entonces no se puede rechazar 
                                        que los números del conjunto consecutivos sean independientes (Con un nivel de confianza {(1-c)*100}%) </h5>
                                <div className="row">
                                    <div className="col-6 d-flex">
                                        <p className="card-text">Valor de las tablas: {chiValue}</p>
                                    </div>
                                </div>
                            </div>
                        </div>:<div className="card text-white bg-secondary mb-3" >
                            <div className="card-header">Se niega la hipotesis</div>
                            <div className="card-body">
                                <h5 className="card-title">El estadístico de tabla = {chiValue.toFixed(4)} es menor al error total {x2Total.toFixed(4)}, entonces 
                                        rechazamos que los números del conjunto consecutivos sean independientes (Con un nivel de confianza {(1-c)*100}%) </h5>
                                <div className="row">
                                    <div className="col-6 d-flex">
                                        <p className="card-text">Valor de las tablas: {chiValue}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                    :
                    <div className='container'>
                        <div className=''> 
                            <div className='row'>
                                <div className='col-12'>
                                    <h7>H0</h7>
                                    <p> El estadístico de tabla = (valor de la tabla de chi cuadrada) es mayor al error total (valor obtenido de X0^2), entonces no se puede rechazar 
                                    que los números del conjunto consecutivos sean independientes (Con un nivel de confianza {(1-c)*100}%)</p>
                                </div>
                                <div className='col-12'>
                                    <h7>H1</h7>
                                    <p>El estadístico de tabla = (valor de la tabla de chi cuadrada) es menor al error total (valor obtenido de X0^2), entonces 
                                    rechazamos que los números del conjunto consecutivos sean independientes (Con un nivel de confianza {(1-c)*100}%)</p>
                                </div>
                            </div>
                        </div>  
                    </div>
                } 
            </div>
        </div>
    )
}

export default PruebaSerie