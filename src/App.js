import { useState, useEffect, useRef } from 'react';
import './App.css';
import FilterPanel from './components/FilterPanel';
import Grid from './components/Grid';
import Papa from 'papaparse';
import master_data from './resources/master_data.csv'
import { filterAndSortData, prepareData } from './util/helpers';

function App() {

  const [filterCriteria, setFilterCriteria] = useState({
    category:'television',
    sort: 'price'
  });
  const [data, setData] = useState([])

  useEffect(() => {
    Papa.parse(master_data, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          setData(prepareData(results.data));
        }
    })
  }, []);

  return (
    <div id="application" className="row">
      <h3>ApplianceScanner</h3>
      <hr />
      <FilterPanel filterCriteria={filterCriteria} setFilterCriteria={setFilterCriteria} />
      <Grid data={filterAndSortData(data, filterCriteria)} />
    </div>
  );
}

export default App;
