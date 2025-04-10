let itemList = [];

function addItem() {
    let itemName = document.getElementById("itemName").value;
    let retailPrice = parseFloat(document.getElementById("retailPrice").value);
    let wholesalePrice = parseFloat(document.getElementById("wholesalePrice").value);
    let itemQty = parseInt(document.getElementById("itemQty").value);
    let itemCategory = document.getElementById("itemCategory").value;
    let itemGst = parseFloat(document.getElementById("itemGst").value);
    let billType = document.getElementById("billType").value;

    if (!itemName || isNaN(retailPrice) || isNaN(wholesalePrice) || isNaN(itemQty) || itemQty <= 0) {
        alert("Please enter valid item details.");
        return;
    }

    let selectedPrice = billType === "wholesale" ? wholesalePrice : retailPrice;

    const discountRates = {
        "electronics": 0.10,
        "grocery": 0.05,
        "clothing": 0.15,
        "other": 0
    };

    let discountRate = discountRates[itemCategory] || 0;
    let itemDiscount = selectedPrice * discountRate * itemQty;

    let taxableAmount = selectedPrice * itemQty - itemDiscount;
    let itemTax = (taxableAmount * itemGst) / 100;
    let totalPrice = taxableAmount + itemTax;

    itemList.push({
        itemName,
        selectedPrice,
        itemQty,
        itemCategory,
        itemGst,
        itemDiscount,
        itemTax,
        totalPrice
    });

    updateBill();
}

function updateBill() {
    let tableBody = document.querySelector("#billTable tbody");
    tableBody.innerHTML = "";
    let subtotal = 0,
        totalDiscount = 0,
        totalTax = 0,
        finalAmount = 0;

    itemList.forEach((item, index) => {
        subtotal += item.selectedPrice * item.itemQty;
        totalDiscount += item.itemDiscount;
        totalTax += item.itemTax;
        finalAmount += item.totalPrice;

        let row = `
            <tr>
                <td>${item.itemName}</td>
                <td>₹${item.selectedPrice.toFixed(2)}</td>
                <td>${item.itemQty}</td>
                <td>${item.itemCategory}</td>
                <td>${item.itemGst}%</td>
                <td>₹${item.totalPrice.toFixed(2)}</td>
                <td><button onclick="deleteItem(${index})">Delete</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("discount").textContent = totalDiscount.toFixed(2);
    document.getElementById("tax").textContent = totalTax.toFixed(2);
    document.getElementById("finalTotal").textContent = Math.round(finalAmount).toFixed(2);
}

function deleteItem(index) {
    itemList.splice(index, 1);
    updateBill();
}

function generateInvoice() {
    const date = new Date().toLocaleDateString();
    const customerName = document.getElementById("customerName").value;
    const customerPhone = document.getElementById("customerPhone").value;
    const customerAddress = document.getElementById("customerAddress").value;

    let invoiceNumber = localStorage.getItem("invoiceNumber") || 1001;
    localStorage.setItem("invoiceNumber", parseInt(invoiceNumber) + 1);

    let subtotal = 0,
        totalDiscount = 0,
        totalTax = 0,
        finalAmount = 0;

    let tableRows = itemList.map(item => {
        subtotal += item.selectedPrice * item.itemQty;
        totalDiscount += item.itemDiscount;
        totalTax += item.itemTax;
        finalAmount += item.totalPrice;

        return `
            <tr>
                <td>${item.itemName}</td>
                <td>₹${item.selectedPrice.toFixed(2)}</td>
                <td>${item.itemQty}</td>
                <td>${item.itemCategory}</td>
                <td>${item.itemGst}%</td>
                <td>₹${item.totalPrice.toFixed(2)}</td>
            </tr>
        `;
    }).join('');

    const invoiceHTML = `
        <html>
        <head>
            <title>Invoice #${invoiceNumber}</title>
            <style>
                body { font-family: 'Poppins', sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #333; padding: 8px; text-align: center; }
                h2 { color: #0277bd; }
                .totals { margin-top: 20px; font-size: 16px; }
                .thankyou { margin-top: 30px; text-align: center; font-size: 18px; color: #2e7d32; font-weight: bold; }
            </style>
        </head>
        <body>
            <h2>Invoice #${invoiceNumber}</h2>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Customer Name:</strong> ${customerName}</p>
            <p><strong>Phone:</strong> ${customerPhone}</p>
            <p><strong>Address:</strong> ${customerAddress}</p>

            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Category</th>
                        <th>GST</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>

            <div class="totals">
                <p><strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}</p>
                <p><strong>Discount:</strong> ₹${totalDiscount.toFixed(2)}</p>
                <p><strong>Tax:</strong> ₹${totalTax.toFixed(2)}</p>
                <p><strong>Final Total (Rounded):</strong> ₹${Math.round(finalAmount).toFixed(2)}</p>
            </div>

            <div class="thankyou">
                Thank you for your purchase! Visit Again 😊
            </div>
        </body>
        </html>
    `;

    const win = window.open('', '', 'width=800,height=900');
    win.document.write(invoiceHTML);
    win.document.close();
    win.print();
}