const chemical = [
    {Chemicalname: 'Ammonium Persulfate', Vendor: 'LG chem', Density: "325.92", Viscosity: "60.631", Packaging: 'Bag', Packsize: '100.00', Unit: 'Kg', Quantity: '6495.18'},
    {Chemicalname: 'Caustic Potash', Vendor: 'Formosa', Density: "3172.15", Viscosity: "48.22", Packaging: 'Bag', Packsize: '100.00', Unit: 'Kg', Quantity: '6495.18'},
    {Chemicalname: 'Dimethylaminopropylamino', Vendor: 'LG chem', Density: "8435.37", Viscosity: "12.62", Packaging: 'Barrel', Packsize: '75.00', Unit: 'L', Quantity: '5964.61'},
    {Chemicalname: 'Mono Ammonium Phosphate', Vendor: 'Sinopec', Density: "1597.65", Viscosity: "76.51", Packaging: 'Bag', Packsize: '105.00', Unit: 'Kg', Quantity: '8183.73'},
    {Chemicalname: 'Ferric Nitrate', Vendor: 'DowDuPont', Density: "364.04", Viscosity: "14.90", Packaging: 'Bag', Packsize: '105.00', Unit: 'Kg', Quantity: '4154.33'},
    {Chemicalname: 'n-Pentane', Vendor: 'Sinopec', Density: "4535.26", Viscosity: "66.76", Packaging: 'N/A', Packsize: 'N/A', Unit: 't', Quantity: '6272.34'},
    {Chemicalname: 'Glycol Ether PM', Vendor: 'LG chem', Density: "6495.18", Viscosity: "72.12", Packaging: 'Bag', Packsize: '250.00', Unit: 'Kg', Quantity: '8749.54'},
];

let chemicals = [...chemical];
let selectedRowIndex = null;
let sortDirection = {};  // To track sorting direction for each column

function renderTable() {
    const tableBody = document.getElementById('table');
    tableBody.innerHTML = `
        <thead>
            <tr>
                <th data-column="Chemicalname">Chemical Name</th>
                <th data-column="Vendor">Vendor</th>
                <th data-column="Density">Density</th>
                <th data-column="Viscosity">Viscosity</th>
                <th data-column="Packaging">Packaging</th>
                <th data-column="Packsize">Pack Size</th>
                <th data-column="Unit">Unit</th>
                <th data-column="Quantity">Quantity</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = tableBody.querySelector('tbody');
    chemicals.forEach((chemical, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index;
        row.innerHTML = `
            <td contenteditable="true">${chemical.Chemicalname || ''}</td>
            <td contenteditable="true">${chemical.Vendor || ''}</td>
            <td contenteditable="true">${chemical.Density || ''}</td>
            <td contenteditable="true">${chemical.Viscosity || ''}</td>
            <td contenteditable="true">${chemical.Packaging || ''}</td>
            <td contenteditable="true">${chemical.Packsize || ''}</td>
            <td contenteditable="true">${chemical.Unit || ''}</td>
            <td contenteditable="true">${chemical.Quantity || ''}</td>
        `;
        tbody.appendChild(row);
    });
    updateArrowButtons();
    addSortingListeners();  // Add event listeners for sorting
}

// Function to handle sorting
function sortTable(column) {
    // Determine sorting order (toggle between ascending and descending)
    if (!sortDirection[column]) {
        sortDirection[column] = 'asc';  // Default to ascending if no order is set
    } else {
        sortDirection[column] = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    }

    chemicals.sort((a, b) => {
        let valueA = a[column];
        let valueB = b[column];

        // Convert to numeric values if the column contains numbers
        if (!isNaN(parseFloat(valueA)) && !isNaN(parseFloat(valueB))) {
            valueA = parseFloat(valueA);
            valueB = parseFloat(valueB);
        }

        if (sortDirection[column] === 'asc') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });

    renderTable();  // Re-render the table after sorting
}

function addSortingListeners() {
    const headers = document.querySelectorAll('th[data-column]');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');
            sortTable(column);  // Call sortTable when a column header is clicked
        });
    });
}

function updateArrowButtons() {
    const upArrow = document.getElementById('UpArrow');
    const downArrow = document.getElementById('downArrow');
    
    upArrow.disabled = (selectedRowIndex === null || selectedRowIndex === 0);
    downArrow.disabled = (selectedRowIndex === null || selectedRowIndex === chemicals.length - 1);
}

document.getElementById('table').addEventListener('click', (e) => {
    const rows = document.querySelectorAll('#table tbody tr');
    rows.forEach(row => row.classList.remove('selected'));
    const selectedRow = e.target.closest('tr');
    if (selectedRow) {
        selectedRow.classList.add('selected');
        selectedRowIndex = parseInt(selectedRow.dataset.index);
    } else {
        selectedRowIndex = null;
    }
    updateArrowButtons();
});

document.getElementById('add').addEventListener('click', () => {
    chemicals.push({});
    renderTable();
});

document.getElementById('refresh').addEventListener('click', () => {
    chemicals = [...chemical];
    selectedRowIndex = null;
    renderTable();
});

document.getElementById('save').addEventListener('click', () => {
    const rows = document.querySelectorAll('#table tbody tr');
    chemicals = Array.from(rows).map((row) => {
        return {
            Chemicalname: row.cells[0].innerText,
            Vendor: row.cells[1].innerText,
            Density: row.cells[2].innerText,
            Viscosity: row.cells[3].innerText,
            Packaging: row.cells[4].innerText,
            Packsize: row.cells[5].innerText,
            Unit: row.cells[6].innerText,
            Quantity: row.cells[7].innerText,
        };
    });
});

document.getElementById('delete').addEventListener('click', () => {
    if (selectedRowIndex !== null) {
        chemicals.splice(selectedRowIndex, 1);
        selectedRowIndex = null;
        renderTable();
    }
});

document.getElementById('UpArrow').addEventListener('click', () => {
    if (selectedRowIndex > 0) {
        [chemicals[selectedRowIndex], chemicals[selectedRowIndex - 1]] =
            [chemicals[selectedRowIndex - 1], chemicals[selectedRowIndex]];
        selectedRowIndex -= 1;
        renderTable();
        updateArrowButtons();
    }
});

document.getElementById('downArrow').addEventListener('click', () => {
    if (selectedRowIndex !== null && selectedRowIndex < chemicals.length - 1) {
        [chemicals[selectedRowIndex], chemicals[selectedRowIndex + 1]] =
            [chemicals[selectedRowIndex + 1], chemicals[selectedRowIndex]];
        selectedRowIndex += 1;
        renderTable();
        updateArrowButtons();
    }
});

window.onload = renderTable;
