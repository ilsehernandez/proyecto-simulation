import React, {useState, useEffect} from 'react'
import {standardNormalTable} from 'simple-statistics'

const MetodoTransformadaInversa = () =>{
    const options = [{
        label: 'Normales',
        value: 'normales'
    },{
        label: 'Uniforme Discreta',
        value: 'uniformeDiscreta',
        formula: '𝑥𝑖=𝑎+(𝑏−𝑎)𝑟𝑖'
    },{
        label: 'Exponencial',
        value: 'exponencial',
        formula: '𝑥𝑖=−1/𝜆 ln⁡(1−𝑟𝑖)'
    },{
        label: 'Bernoulli',
        value: 'bernoulli',
        formula: '𝑝(𝑋)=𝑝^𝑥 (1−𝑝)^(1−𝑥)'
    },{
        label: 'Poisson',
        value: 'poisson',
        formula: '𝑝(𝑥)=  (𝜆^𝑥 𝑒^(−𝜆))/𝑥!'
    }]
    let [distSelected, setDistSelected] = useState(options[0].value);
    let [distName, setDistName] = useState("Selecciona una Distribución");
    let [distFormulaStr, setDistFormulaStr] = useState("");
    let [display, setDisplay] = useState(false);
    let [uniVarA, setUniVarA] = useState(0);
    let [uniVarBmA, setUniVarBmA] = useState(0);
    let [uniResults, setUniResults] = useState([]);
    let [expVarDelta, setExpVarDelta] = useState(0);
    let [expResults, setExpResults] = useState([]);
    let [berVarSuccess, setBerVarSuccess] = useState(0);
    let [berResults, setBerResults] = useState([]);
    let [poiVarProbSize, setPoiVarProbSize] = useState(0);
    let [poiVarDelta, setPoiVarDelta] = useState(0);
    let [poiResults, setPoiResults] = useState([]);
    let [b, setB] = useState([]);
    let [currentNum, setCurrentNum] = useState('');
    let [numbersCSVString, setNumbersCSVString] = useState('');
    let [numbers, setNumbers] = useState([]);
    let [normalResults, setNormalResults] = useState([]);
    let [normalRanges, setNormalRanges] = useState([]);

    useEffect(() => {
        if (distSelected === options[1].value) {
            setDistName(options[1].label)
            setDistFormulaStr(options[1].formula)
        } else if (distSelected === options[2].value) {
            setDistName(options[2].label)
            setDistFormulaStr(options[2].formula)
        } else if (distSelected === options[3].value) {
            setDistName(options[3].label)
            setDistFormulaStr(options[3].formula)
        } else if (distSelected === options[4].value) {
            setDistName(options[4].label)
            setDistFormulaStr(options[4].formula)
        }
    }, [distSelected]);

    const addCSVValues = () => {
        let nums = numbersCSVString.split(',').map((e)=>parseFloat(e));
        setNumbers([...nums])
    }
    const addValueToArray = () =>{
        let temp = [...numbers, currentNum];
        setNumbers(temp);
        setCurrentNum('');
    }

    const getRanges = () =>{
        return [1-standardNormalTable[300],
        1-standardNormalTable[200],
        1-standardNormalTable[100],
        standardNormalTable[0],
        standardNormalTable[100],
        standardNormalTable[200],
        1
    ]
    }
    const getNormalValue = (val) => {
        let ranges = getRanges();
        if(val>0&&val<ranges[0]){
            return -3;
        } else if(val>ranges[0]&&val<ranges[1]){
            return -2;
        } else if(val>ranges[1]&&val<ranges[2]){
            return -1;
        } else if(val>ranges[2]&&val<ranges[3]){
            return 0;
        } else if(val>ranges[3]&&val<ranges[4]){
            return 1;
        } else if(val>ranges[4]&&val<ranges[5]){
            return 2;
        } else if(val>ranges[5]&&val<ranges[6]){
            return 3;
        }
    }

    const calcDistNormal = (list) => {
        let tempSol = [];
        for(let i = 0; i < list.length; i++){
            tempSol.push({ri: list[i], value: getNormalValue(list[i])})
        }
        let tempRanges = getRanges()
        setNormalRanges([`0 - ${tempRanges[0].toFixed(4)}`,
        `${tempRanges[0].toFixed(4)} - ${tempRanges[1].toFixed(4)}`,
        `${tempRanges[1].toFixed(4)} - ${tempRanges[2].toFixed(4)}`,
        `${tempRanges[2].toFixed(4)} - ${tempRanges[3].toFixed(4)}`,
        `${tempRanges[3].toFixed(4)} - ${tempRanges[4].toFixed(4)}`,
        `${tempRanges[4].toFixed(4)} - ${tempRanges[5].toFixed(4)}`,
        `${tempRanges[5].toFixed(4)} - ${tempRanges[6].toFixed(4)}`])
        setNormalResults(tempSol);
    }
    const calcDistUniforme = (list) => {
        let tempUniResults = []
        list.forEach((ri) => {
            let obj = {
                ri: ri,
                xi: uniVarA + (uniVarBmA * ri)
            }
            tempUniResults.push(obj)
        })
        setUniResults(tempUniResults)
    }

    const calcDistExponencial = (list) => {
        let tempExpResults = []
        list.forEach((ri) => {
            let obj = {
                ri: ri,
                xi: (Math.log(1 - ri) * (expVarDelta)) * -1
            }
            tempExpResults.push(obj)
        })
        setExpResults(tempExpResults)
    }

    const calcDistBernoulli = (list) => {
        let tempBerResults = []
        list.forEach((ri) => {
            let obj = {
                ri: ri,
                xi: (ri >= berVarSuccess) ? 1 : 0
            }
            tempBerResults.push(obj)
        })
        setBerResults(tempBerResults)
    }

    const factorial = (num) => {
        let rval = 1;
        for (let i = 2; i <= num; i++)
            rval = rval * i;
        return rval;
    }

    const getProbabilityForPoisson = () => {
        let table = []
        let acumPx = 0
        for (let i = 0; i <= poiVarProbSize; i++) {
            let px = (Math.pow(poiVarDelta, i) * Math.exp(-poiVarDelta)) / (factorial(i))
            acumPx += px
            let obj = {
                x: i,
                px: px.toFixed(4),
                acum: acumPx.toFixed(4)
            }
            table.push(obj)
        }
        return table
    }

    const findInProbTable = (table, needle) => {
        let prevAcum = 0

        for (let i = 0; i <= poiVarProbSize; i++) {
            if (needle >= prevAcum && needle <= table[i].acum) {
                return table[i].x
            }
            prevAcum = table[i].acum
        }
        return 0
    }

    const calcDistPoisson = (list) => {
        let table = getProbabilityForPoisson()
        let tempPoissonResults = []
        list.forEach((ri) => {
            let obj = {
                ri: ri,
                xi: findInProbTable(table, ri)
            }
            tempPoissonResults.push(obj)
        })
        setPoiResults(tempPoissonResults)
    }

    const calculate = () => {
        if(distSelected === options[0].value){
            calcDistNormal(numbers)
        }else if (distSelected === options[1].value) {
            calcDistUniforme(numbers)
        } else if (distSelected === options[2].value) {
            calcDistExponencial(numbers)
        } else if (distSelected === options[3].value) {
            calcDistBernoulli(numbers)
        } else if (distSelected === options[4].value) {
            calcDistPoisson(numbers)
        }
        setDisplay(true)
    }


    return (
        <div className="container">
            <div className='row d-flex justify-content-center'>
                <h1>
                    Metodo Transformada Inversa
                </h1>
            </div>
            <div className='form-group'>

                <div className='col-6 d-flex flex-column'>
                    <div className='d-flex flex-column'>
                        <label htmlFor='numero'>Ingresar digitos de uno en uno:</label>
                        <div className='d-flex'>
                            <input id='numero' type='text' value={currentNum} onChange={(e)=>setCurrentNum(e.target.value)}/>
                            <div className='btn btn-primary ml-auto p-2' onClick={(e)=>addValueToArray()}>Agregar</div>
                        </div>
                    </div>
                    <div className='d-flex flex-column'>
                        <label htmlFor='csv'>Ingresar digitos separados por comas (Estilo de un csv):</label>
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

                <div className="col-6">
                    <div className="form-group">
                        <select className='form-control' value={distSelected} onChange={(e)=>{console.log(e.target);setDistSelected(e.target.value)}}>
                            {options.map((option)=>{
                                return <option value={option.value}>{option.label}</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>



            {/* NORMAL */}
            {distSelected === options[0].value &&
                <div className="container d-flex">
                    <div className="container col-6">
                        <span className="col">{distFormulaStr}</span>
                    </div>
                    <div className="input-group mb-3">
                        <div className='btn btn-primary' onClick={(e) => calculate()}>Calcular</div>
                    </div>
                </div>

            }
            {display && distSelected === options[0].value &&
            <div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>x</th>
                            <th>Rango Valores</th>
                        </tr>
                    </thead>
                    <tbody>
                        {normalRanges.map((e, k)=>{
                            return <tr scope="container" key={k}>
                                <td>{k+1}</td>
                                <td>{e}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <table className='table'>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Ri</th>
                            <th scope="col">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            normalResults.map((e, k) => {
                                console.log(e)
                                return (
                                    <tr scope="container" key={k}>
                                        <td>{k + 1}</td>
                                        <td>{e.ri}</td>
                                        <td>{e.value}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            }
            {/* UNIFORME */}
            {distSelected === options[1].value &&
                <div className="container d-flex">
                    <div className='form-group col-6'>

                        <div className="col-6 d-flex justify-content-between inputs">
                            <label for='a' >a: </label>
                            <input id='a' type='number' min='100' max='999999' onChange={(e) => {setUniVarA(e.target.value * 1); setUniVarBmA(b - uniVarA)}} />
                        </div>

                        <div className="col-6 d-flex justify-content-between inputs">
                            <label for='b'>b: </label>
                            <input type='number' id='b' value={b} min='100' max='999999' onChange={(e) => {setUniVarBmA(e.target.value * 1 - uniVarA); setB(e.target.value * 1)}} />
                        </div>

                        <div className="input-group mb-3">
                            <div className='btn btn-primary' onClick={(e) => calculate()}>Calcular</div>
                        </div>

                    </div>
                    <div className="container col-6">
                        <span className="col">{distFormulaStr}</span>
                    </div>
                </div>

            }
            {display && distSelected === options[1].value &&
                <table className='table'>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Ri</th>
                            <th scope="col">Xi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            uniResults.map((e, k) => {
                                return (
                                    <tr scope="container" key={k}>
                                        <td>{k + 1}</td>
                                        <td>{e.ri}</td>
                                        <td>{e.xi.toFixed(2)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            }
            {/* EXPONENCIAL */}
            {distSelected === options[2].value &&
                <div className="container d-flex">
                    <div className='form-group col-6'>

                        <div className="col-6 d-flex justify-content-between inputs">
                            <label for='lambda'>𝜆 : </label>
                            <input type='number' id='lambda' min='100' max='999999' onChange={(e) => setExpVarDelta(e.target.value * 1)} />
                        </div>

                        <div className="input-group mb-3">
                            <div className='btn btn-primary' onClick={(e) => calculate()}>Calcular</div>
                        </div>

                    </div>
                    <div className="container col-6">
                        <span className="col">{distFormulaStr}</span>
                    </div>
                </div>
            }
            {display && distSelected === options[2].value &&
                <table className='table'>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Ri</th>
                            <th scope="col">Xi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            expResults.map((e, k) => {
                                return (
                                    <tr scope="container" key={k}>
                                        <td>{k + 1}</td>
                                        <td>{e.ri}</td>
                                        <td>{e.xi.toFixed(2)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            }
            {/* BERNOULLI */}
            {distSelected === options[3].value &&
                <div className="container d-flex">
                    <div className='form-group'>

                        <div className="col-6 d-flex justify-content-between inputs">
                            <label for='p'>P: </label>
                            <input type='number' id='p' max='999999' onChange={(e) => setBerVarSuccess(e.target.value * 1)} />
                            <span  >% Probabilidad de éxito </span>
                        </div>

                        <div className="input-group mb-3">
                            <div className='btn btn-primary' onClick={(e) => calculate()}>Calcular</div>
                        </div>

                    </div>
                    <div className="container col-6">
                        <span className="col">{distFormulaStr}</span>
                    </div>
                </div>
            }
            {display && distSelected === options[3].value &&
                <table className='table'>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Ri</th>
                            <th scope="col">Xi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            berResults.map((e, k) => {
                                return (
                                    <tr scope="container" key={k}>
                                        <td>{k + 1}</td>
                                        <td>{e.ri}</td>
                                        <td>{e.xi}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            }
            {/* POISSON */}
            {distSelected === options[4].value &&
                <div className="container d-flex">
                    <div className='form-group'>

                        <div className="col-6 d-flex justify-content-between inputs">
                            <label for='lambda'>𝜆 : </label>
                            <input type='number' id='lambda' min='100' max='999999' onChange={(e) => setPoiVarDelta(e.target.value * 1)} />
                        </div>

                        <div className="col-6 d-flex justify-content-between inputs">
                            <label for='n'>N : </label>
                            <input type='number' id='n' onChange={(e) => setPoiVarProbSize(e.target.value * 1)} />
                            <span >Probabilidades a calcular</span>
                        </div>

                        <div className="input-group mb-3">
                            <div className='btn btn-primary' onClick={(e) => calculate()}>Calcular</div>
                        </div>

                    </div>
                    <div className="container col-6">
                        <span className="col">{distFormulaStr}</span>
                    </div>
                </div>
            }
            {display && distSelected === options[4].value &&
                <table className='table'>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Ri</th>
                            <th scope="col">Xi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            poiResults.map((e, k) => {
                                return (
                                    <tr scope="container" key={k}>
                                        <td>{k + 1}</td>
                                        <td>{e.ri}</td>
                                        <td>{e.xi}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            }



        </div>
    )
}

export default MetodoTransformadaInversa