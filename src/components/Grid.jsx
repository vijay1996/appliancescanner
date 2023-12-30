import { useEffect, useState } from "react";
import { convertJsonArrayToTable } from "../util/helpers";
import { COLUMNS } from "../util/constants";

const Grid = ({data}) => {
    console.log(data)
    const rowsPerPage = 14;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [data])

    return (
        <div className="col-md-10">
            <span style={{color: data.length > 0 ? "green" : "red", fontWeight: "bold"}}>showing {data.length} rows. {data.length === 0 ? 'Please change the filter criteria.' : ''}</span>
            <div style={{width: "100%"}}>Pages: {Array(Math.ceil(data.length / rowsPerPage)).fill().map((filler, page) => 
                <span>
                    <button 
                        style={{
                            border:"none", 
                            color: currentPage === page+1 ? 'white' :"blue", 
                            textDecoration: "underline", 
                            cursor: "pointer",
                            backgroundColor: currentPage === page+1 ? 'blue' : null
                        }} 
                        onClick={() => setCurrentPage(page+1)}
                    >
                        {page+1}
                    </button> &nbsp; 
                </span>)}
            </div>
            {convertJsonArrayToTable(data.slice((currentPage - 1) * rowsPerPage, (currentPage * rowsPerPage)), data[0]?.category)}
        </div>
    )
}

export default Grid;