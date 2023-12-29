export function prepareData(data) {
    const validData = data.map(row => {
        const validProduct = (
            row['asin']?.length && 
            row['price']?.length && 
            row['product name']?.length && 
            (row['brand']?.length || row['manufacturer']?.length)
        ) ;
        
        if(validProduct) {
            if(row['brand']?.length) {
                row['brand'] = String(row['manufacturer']).split(',')[0]
            };
            const price = Number(row['price'].replaceAll(",", "").replaceAll(".", "")); 
            const capacity = Number (row['capacity']?.split(" ")[0]);
            const additionalInfo = {};
            Object.keys(row).forEach(key => {
                if (row[`${key}`]) {
                    additionalInfo[`${key}`] = row[`${key}`];
                }
            })
            const rating = Number(row['customer reviews']?.split(" ")[0]);
            let customerReviews = row['customer reviews']?.replaceAll("  ", " ").replaceAll("  ", " ").replaceAll("  ", " ").split("ratings")[0].split(" ")
            customerReviews && (customerReviews = Number(customerReviews[customerReviews?.length - 2].replaceAll(",", "").replaceAll(".", "")))
            return {
                name: row['product name'],
                price: price,
                "cost per capacity": parseFloat(price / capacity).toFixed(2),
                cpcUnit: row['capacity']?.split(" ")[1],
                capacity: row['capacity'],
                reviews: customerReviews,
                rating,
                brand: row['brand'],
                model: row['model'],
                category: row['category'],
                image: row['image url'],
                additionalInfo: JSON.stringify(additionalInfo),
                asin: row['asin'],
            };
        }
        return null;
    });
    return validData.filter(row => row !== null);
}

export function filterAndSortData(data, filterCriteria) {
    console.log(filterCriteria)
    let filteredData = [...data]
    Object.keys(filterCriteria).forEach(key => {
        switch(key) {
            case 'category':
                filteredData = filteredData.filter(row => String(row[key]).toLowerCase() === String(filterCriteria[key]).toLowerCase())
                break;
            case 'minPrice':
                filteredData = filterCriteria.minPrice ? filteredData.filter(row => row['price'] >= filterCriteria.minPrice) : filteredData;
                break;
            case 'maxPrice':
                filteredData = filterCriteria.maxPrice ? filteredData.filter(row => row['price'] <= filterCriteria.maxPrice) : filteredData
                break;
            case 'sort':
                filteredData = filteredData.sort((row1, row2) =>{ 
                    if (filterCriteria.descending) {
                        if (row1[filterCriteria.sort] < row2[filterCriteria.sort]) {
                            return 1
                        } else if (row1[filterCriteria.sort] > row2[filterCriteria.sort]) {
                            return -1
                        } else {
                            return 0
                        }
                    } else {
                        if (row1[filterCriteria.sort] < row2[filterCriteria.sort]) {
                            return -1
                        } else if (row1[filterCriteria.sort] > row2[filterCriteria.sort]) {
                            return 1
                        } else {
                            return 0
                        }
                    }
                });
                break;
            
        }
    })
    return filteredData
}

export function convertJsonArrayToTable (jsonArray) {
    const hiddenColumns = ['asin', 'cpcUnit', 'additionalInfo', "image"]
    if (jsonArray.length > 0) {
        const columns = Object.keys(jsonArray[0]).filter(key => hiddenColumns.indexOf(key) === -1 && key.length > 0)
        return (
            <table>
                <tr>
                    {columns.map(key => <th>{key}</th>)}
                </tr>
                {jsonArray.map(row => {
                    return (
                        <tr>
                            {columns.map((key, index) => {
                                switch (key) {
                                    case 'name':
                                        return <td style={{textAlign:"left"}}><a target="blank" href={`https://www.amazon.in/dp/${row['asin']}?tag=appliancescan-21`}>{row[`${key}`]}</a></td>
                                    case 'price':
                                        return <td>&#8377;{convertNumberToIndianFormat(row[`${key}`])}</td>
                                    case 'reviews':
                                        return <td>{convertNumberToIndianFormat(row[`${key}`])}</td>
                                    case 'cost per capacity':
                                        return <td>&#8377;{convertNumberToIndianFormat(row[`${key}`])}/{row['cpcUnit']?.slice(0, row['cpcUnit']?.length - 1)}</td>
                                    default:
                                        return <td>{row[`${key}`]}</td>
                                }
                            })}
                        </tr>
                    )
                })}
            </table>
        )
    } else {
        return <div></div>
    }
}

export function convertNumberToIndianFormat(number) {
    return Intl.NumberFormat('en-IN').format(number)
}

export function createFields(name, label, type, callback, value, values) {
    switch (type) {
        case 'select':
            return (
                <div>
                    <label htmlFor={name}>{label}</label>
                    <select 
                        className="form-control" 
                        id={name} 
                        name={name} 
                        onChange={(e) => callback(e.target.value)}
                    >
                        {values.map(option => <option selected={value === option} value={option}>{option}</option>)}
                    </select>
                </div>
            )
        case 'button':
            return (
                <div>
                    <button className="btn btn-primary" onClick={(e) => callback(e.target.value)}>{label}</button>
                </div>
            )
        case 'checkbox':
            return (
                <div>
                    <input 
                        className="btn btn-primary"
                        type={type} 
                        id={name} 
                        name={name} 
                        value={value} 
                        onClick={callback}
                    />
                    <label for={name}>&nbsp;{label}</label>
                </div>
            )
        default:
            return (
                <div>
                    <label htmlFor={name}>{label}</label>
                    <input value={value} className="form-control" id={name} type={type} name={name} onChange={(e) => callback(e.target.value)}></input>
                </div>
            )

    }
}