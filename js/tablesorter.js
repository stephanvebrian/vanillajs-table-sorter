/**
 * 
 */

const __thisTableSorter = this;

const tableSorter = (elementTable) => {
    // if( !(elemTable instanceof Element) )
    //     return console.error('Not found any Table Element');
    __tableSorterFn(elementTable);
}

const __tableSorterFn = (table) => {
    let th = table.tHead,
        i;

    th && (th = th.rows[0]) && (th = th.cells);

    if (th) 
        i = th.length;
    else 
        return console.error('table thead not found');

    __attachSorterEvent(table, th, i);
}

const __attachSorterEvent = (table, th, i) => {

    while (--i >= 0) ( (elemIdx) => {
        let idx = elemIdx;
        let direction = 1;
        let tHeadCurr = th[idx];
        
        let opts = {
            DisableSort: tHeadCurr.hasAttribute('sorter-disable') ? true : false,
            SortNumeric: tHeadCurr.hasAttribute('sorter-numeric') ? true : false,
            SortDate: tHeadCurr.hasAttribute('sorter-date') ? true : false,
        };
        
        tHeadCurr.onclick = () => __attachSorterOnclick(table, idx, (direction = 1 - direction), opts);

    })(i);
    
}

const __attachSorterOnclick = (table, col, reverse, opts) => {
    let { DisableSort } = opts;

    if(DisableSort === true) return;

    let tb = table.tBodies[0],
        tr = Array.prototype.slice.call(tb.rows, 0),
        i;

    reverse = -((+reverse) || -1);

    tr = tr.sort((a, b) => __customSortTableSorter(a, b, col, reverse, opts));

    for(i = 0; i < tr.length; i++) tb.appendChild(tr[i]);
}

const __customSortTableSorter = (a, b, col, reverse, opts) => {
    let { SortNumeric, SortDate } = opts,
        result;

    console.log('A dan B', a.cells[col].textContent.trim(), b.cells[col].textContent.trim());

    if(SortNumeric === true){
        result = reverse * (
            a.cells[col].textContent.trim().localeCompare(
                b.cells[col].textContent.trim(), undefined, { numeric: true })
          );
    }else if(SortDate === true){
        let dateA = new Date(a.cells[col].textContent.trim()).toISOString();
        let dateB = new Date(b.cells[col].textContent.trim()).toISOString();

        result = reverse * (
          dateA.trim().localeCompare(dateB.trim())  
        );
    }else{
        result = reverse * (
            a.cells[col].textContent.trim().localeCompare(
                b.cells[col].textContent.trim() )
          );
    }
    
    return result;
}