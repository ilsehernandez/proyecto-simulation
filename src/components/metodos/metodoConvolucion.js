import React, {useState, useEffect} from 'react'

const MetodoConvolucion = () =>{
    const options = [{
        label: 'Erlang',
        value: 'erlang',
        formula: '𝑌=𝐸𝑅𝑖=−1/𝑘𝜆 𝑙𝑛 ∏(𝑖=1)^𝑘:(1−𝑟𝑖)'
    },{
        label: 'Normal',
        value: 'normal',
        formula: '𝑋=𝑁𝑖= [∑_(𝑖=1)^12:(𝑟𝑖) −6 ]+𝜎+𝜇'
    },{
        label: 'Binomial',
        value: 'binomial',
        formula: '𝑌=𝐵𝑖=𝐵𝐸1+𝐵𝐸2+ …+𝐵𝐸𝑁 ~𝐵𝐼(𝑁,𝑝)'
    }]
    let [dummy, setDummy] = useState([]);
    let [distSelected, setDistSelected] = useState(options[0].value);
    let [distName, setDistName] = useState("Selecciona una Distribución");
    let [distFormulaStr, setDistFormulaStr] = useState("");
    let [display, setDisplay] = useState(false);
    // ERLANG
    let [num_erlang, setNum_erlang] = useState(0);
    let [media_erlang, setMedia_erlang] = useState(0);
    let [cantidad_piezas_erlang, setCantidad_piezas_erlang] = useState(0);
    let [valores_Xi_erlang, setValores_Xi_erlang] = useState([]);
    // NORMAL
    let [norMedia, setNorMedia] = useState(0);
    let [norDS, setNorDS] = useState(0);
    let [norRandomN, setNorRandomN] = useState(0);
    let [norResults, setNorResults] = useState([]);
    // BINOMIAL
    let [biProb, setBiProb] = useState(0);
    let [biN, setBiN] = useState(0);
    let [biDef, setBiDef] = useState([]);
  
    useEffect(() => {
        if (distSelected === options[0].value) {
            setDistName(options[0].label);
            setDistFormulaStr(options[1].formula);
        } else if (distSelected === options[1].value) {
            setDistName(options[1].label)
            setDistFormulaStr(options[1].formula)
        } else if (distSelected === options[2].value) {
            setDistName(options[2].label)
            setDistFormulaStr(options[2].formula)
        }
    }, [distSelected]);
  
    const calcDistErlang = () => {
      let num_random = [];
      let valores_Xi = [];
  
      for (let i = 0; i < num_erlang; i++) {
        num_random.push([]);
        for (let e = 0; e < cantidad_piezas_erlang; e++) {
          num_random[i][e] = parseFloat(
            (1 - (Math.random() * (0.9999 - 0.0001) + 0.0001)).toFixed(4)
          );
        }
      }

      let tempErTable = [];
      let multi = 1;
      let tempRis = []
      for (let i = 0; i < cantidad_piezas_erlang; i++) {
          tempRis=[]
        for (let j = 0; j < num_erlang; j++) {
            tempRis.push(num_random[j][i]);
            multi *= num_random[j][i];
        }
        let value = ((-media_erlang / num_erlang) * Math.log(multi)).toFixed(4);
        valores_Xi.push(value);
        tempErTable.push({xi: value, ri: tempRis})
        multi = 1;
      }
      let tempDummy = new Array(num_erlang).fill(0)
      setDummy(tempDummy);
      console.log(tempDummy)
      setValores_Xi_erlang(tempErTable);
      console.log("num random", num_random);
      console.log("valores xi", valores_Xi);
    };
  
    const calcDistNormal = () => {
      let num_random = [];
      let valores_Xi = [];
      let suma_r = [];
      let resta_r = [];
      let tabla = [];
  
      for (let i = 0; i < norRandomN * 12; i++) {
        num_random[i] = parseFloat(
          (1 - (Math.random() * (0.9999 - 0.0001) + 0.0001)).toFixed(4)
        );
      }
  
      for (let i = 0; i < norRandomN * 12; i += 12) {
        let count = 0;
        for (let e = 0; e < 12; e++) {
          count += num_random[i + e];
        }
        suma_r.push(count.toFixed(4));
        resta_r.push((count - 6).toFixed(4));
      }
  
      for (let i = 0; i < norRandomN; i++) {
        valores_Xi[i] = parseFloat(resta_r[i]) + norDS + norMedia;
      }
  
      for (let i = 0; i < norRandomN; i++) {
        let obj = {
          suma: suma_r[i],
          resta: resta_r[i],
          xi: valores_Xi[i],
        };
        tabla.push(obj);
      }
  
      setNorResults(tabla);
      /*
          console.log("num random", num_random);
          console.log("valores xi", valores_Xi);
          console.log("suma_r", suma_r)*/
    };
  
    const calcDistBinomial = () => {
      let num_random = [];
      let valores_Xi = [];
      let error = 1 - biProb*.01;
      let valores_df = [];
  
      for (let i = 0; i < biN; i++) {
        num_random.push([]);
        valores_Xi.push([]);
        for (let e = 0; e < biN; e++) {
          num_random[i][e] = parseFloat(
            (1 - (Math.random() * (0.9999 - 0.0001) + 0.0001)).toFixed(4)
          );
        }
      }
      console.log(error)
  
      for (let i = 0; i < biN; i++) {
        for (let j = 0; j < biN; j++) {
          if (num_random[j][i] <= error) {
            valores_Xi[j][i] = 1;
          } else {
            valores_Xi[j][i] = 0;
          }
        }
      }

      for (let i = 0; i < biN; i++) {
        let count = 0;
        for (let j = 0; j < biN; j++) {
          if (valores_Xi[j][i] == 1) {
            count++;
          }
        }
        valores_df.push(count);
      }
  
      setBiDef(valores_df);
      console.log("num random", num_random);
      console.log("valores xi", valores_Xi);
      console.log("valores df", valores_df);
    };
  
    const calculate = () => {
      if (distSelected === options[0].value) {
        calcDistErlang();
      } else if (distSelected === options[1].value) {
        calcDistNormal();
      } else if (distSelected === options[2].value) {
        calcDistBinomial();
      }
      setDisplay(true);
    };
  
    return (
      <div className="container">
        <div className="row d-flex justify-content-center">
          <h1>Metodo de Convolución</h1>
        </div>
  
        <div className="form-group">
  
          <div className="form-group">
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
  
          <div className="row">
            <span className="col">{distFormulaStr}</span>
          </div>
        </div>
  
        {/* ERLANG */}
        {distSelected === options[0].value && (
          <div className="row">
            <div className="form-group">
              <div className="col-6 d-flex justify-content-between inputs">
                <label>
                    Erlang:
                </label>
                <input
                  type="number"
                  id="erlang"
                  onChange={(e) => setNum_erlang(e.target.value * 1)}
                />
              </div>
  
              <div className="col-6 d-flex justify-content-between inputs">
                <label>
                    Media:{" "}
                  </label>
                <input
                  type="number"
                  id="media"
                  onChange={(e) => setMedia_erlang(e.target.value * 1)}
                />
              </div>
  
              <div className="ol-6 d-flex justify-content-between inputs">
                <label>
                    Piezas:{" "}
                </label>
                <input
                  type="number"
                  min="100"
                  max="999999"
                  onChange={(e) => setCantidad_piezas_erlang(e.target.value * 1)}
                />
              </div>
  
              <div className="input-group mb-3">
                <div className="btn btn-primary" onClick={(e) => calculate()}>
                  Calcular
                </div>
              </div>
            </div>
          </div>
        )}
        {display && distSelected === options[0].value && (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                {
                    dummy.map((e,i)=>{
                        console.log(i)
                        return <th scope="col">1 - Ri</th>
                    })
                }
                <th scope="col">Xi</th>
              </tr>
            </thead>
            <tbody>
              {valores_Xi_erlang.map((e, k) => {
                  console.log(e)
                return (
                  <tr scope="row" key={k}>
                    <td>{k + 1}</td>
                    {e.ri.map((eri)=>{
                        return <td>{eri.toFixed(4)}</td>
                    })}
                    <td>{e.xi}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {/* NORMAL */}
        {distSelected === options[1].value && (
          <div className="row">
            <div className="form-group">
              <div className="col-6 d-flex justify-content-between inputs">
                <label>
                    Media:{" "}
                  </label>
                <input
                  type="number"
                  onChange={(e) => setNorMedia(e.target.value * 1)}
                />
              </div>
  
              <div className="input-group mb-3">
                <label>
                    Desviación estándar:{" "}
                  </label>
                <input
                  type="number"
                  onChange={(e) => setNorDS(e.target.value * 1)}
                />
              </div>
  
              <div className="col-6 d-flex justify-content-between inputs">
                <label>
                    N de variables aleatorias:{" "}
                  </label>
                <input
                  type="number"
                  onChange={(e) => setNorRandomN(e.target.value * 1)}
                />
                  <span >
                    tamaño{" "}
                  </span>
              </div>
  
              <div className="input-group mb-3">
                <div className="btn btn-primary" onClick={(e) => calculate()}>
                  Calcular
                </div>
              </div>
            </div>
          </div>
        )}
        {display && distSelected === options[1].value && (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">suma</th>
                <th scope="col">resta</th>
                <th scope="col">xi</th>
              </tr>
            </thead>
            <tbody>
              {norResults.map((e, k) => {
                return (
                  <tr scope="row" key={k}>
                    <td>{k + 1}</td>
                    <td>{e.suma}</td>
                    <td>{e.resta}</td>
                    <td>{e.xi.toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {/* BINOMIAL */}
        {distSelected === options[2].value && (
          <div className="row">
            <div className="form-group">
              <div className="ol-6 d-flex justify-content-between inputs">
                <label>
                    N:{" "}
                  </label>
                <input
                  type="number"
                  onChange={(e) => setBiN(e.target.value * 1)}
                />
                <span>
                    tamaño{" "}
                  </span>
              </div>
  
              <div className="input-group mb-3">
                <label>
                    P:{" "}
                  </label>
                <input
                  type="number"
                  onChange={(e) => setBiProb(e.target.value * 1)}
                />
                  <span >
                    % [Probabilidad de éxito] :{" "}
                  </span>
              </div>
  
              <div className="input-group mb-3">
                <div className="btn btn-primary" onClick={(e) => calculate()}>
                  Calcular
                </div>
              </div>
            </div>
          </div>
        )}
        {display && distSelected === options[2].value && (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Defectos</th>
              </tr>
            </thead>
            <tbody>
              {biDef.map((e, k) => {
                return (
                  <tr scope="row" key={k}>
                    <td>{k + 1}</td>
                    <td>{e}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    );
}

export default MetodoConvolucion