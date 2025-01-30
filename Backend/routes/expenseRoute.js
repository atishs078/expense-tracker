const express = require('express')
const router = express.Router()
const Expenss = require('../model/expense')
const User = require('../model/user')
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const moment = require('moment');


router.post('/addExpense', async (req, res) => {
  const { userId, email, expense, category, expenseDate } = req.body
  if (!userId || !email || !expense || !category) {
    return res.status(424).json({ message: "All fields Are required" })
  }
  const userCheck = await User.findOne({ email })
  if (!userCheck) {
    return res.status(404).json({ message: "User Not Found" })
  }
  const addExpense = new Expenss({
    userId, email, expense, category, expenseDate
  })
  await addExpense.save()
  return res.status(200).json({ message: "Expense Added Succsfully" })
}

)

router.post('/getPreviousExpenses', async (req, res) => {
  const { userId } = req.body
  if (!userId) {
    return res.status(424).json({ message: "UserID Required" })
  }
  const userCheck = await User.findOne({ _id: userId })
  if (!userCheck) {
    return res.status(404).json({ message: "User Not Found" })
  }
  const userData = await Expenss.find({ userId })
  return res.status(200).json({ message: userData })
})
router.post('/filter', async (req, res) => {
  try {
    const { userId, category, minimumPrice, maximumPrice, fromDate, toDate } = req.body;

    // Build the query dynamically
    let query = { userId }; // Initialize with userId (mandatory)

    // Filter by category if provided
    if (category) {
      query.category = category;
      if (minimumPrice || maximumPrice) {
        query.expense = {};
        if (minimumPrice) query.expense.$gte = parseFloat(minimumPrice);
        if (maximumPrice) query.expense.$lte = parseFloat(maximumPrice);
      }
      if (fromDate || toDate) {
        query.expenseDate = {};
        if (fromDate) query.expenseDate.$gte = new Date(fromDate);
        if (toDate) query.expenseDate.$lte = new Date(toDate);
      }
    }

    // Filter by price range if provided
    if (minimumPrice || maximumPrice) {
      query.expense = {};
      if (minimumPrice) query.expense.$gte = parseFloat(minimumPrice);
      if (maximumPrice) query.expense.$lte = parseFloat(maximumPrice);
    }

    // Filter by date range if provided
    if (fromDate || toDate) {
      query.expenseDate = {};
      if (fromDate) query.expenseDate.$gte = new Date(fromDate);
      if (toDate) query.expenseDate.$lte = new Date(toDate);
    }

    // Execute the query
    const filteredData = await Expenss.find(query);

    // Send the filtered data
    res.status(200).json(filteredData);
  } catch (error) {
    console.error('Error filtering data:', error);
    res.status(500).json({ message: 'Error filtering data', error: error.message });
  }
});




router.post('/downloadReportofExpense', async (req, res) => {
  try {
    const { userId, fromDate, toDate } = req.body;

    if (!userId || !fromDate || !toDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const fromDateObj = moment(fromDate).startOf('day').toDate();
    const toDateObj = moment(toDate).endOf('day').toDate();

    const filteredData = await Expenss.find({
      userId,
      expenseDate: { $gte: fromDateObj, $lte: toDateObj }
    }).sort({ expenseDate: 1 });

    if (!filteredData.length) {
      return res.status(404).json({ message: "No data found in the specified date range" });
    }

    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const doc = new PDFDocument({ margin: 50 });
    const fileName = `ExpenseReport_${userId}_${Date.now()}.pdf`;
    const filePath = path.join(reportsDir, fileName);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // **Title & Date Range**
    doc.fontSize(18).text('Expense Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date Range: ${moment(fromDate).format('DD-MM-YYYY')} to ${moment(toDate).format('DD-MM-YYYY')}`, { align: 'center' });
    doc.moveDown(2);

    // **Table Configuration**
    const startX = 50;
    let startY = doc.y;
    const columnWidths = [150, 150, 150]; // Column widths for Category, Expense, Date
    const rowHeight = 25; // Row height for each entry

    // **Draw Header Row with Borders**
    doc.lineWidth(2);
    doc.rect(startX, startY, columnWidths[0] + columnWidths[1] + columnWidths[2], rowHeight).stroke();
    doc.font('Helvetica-Bold').fontSize(12);
    
    doc.text('Category', startX + 10, startY + 7, { width: columnWidths[0] });
    doc.text('Expense', startX + columnWidths[0] + 10, startY + 7, { width: columnWidths[1] });
    doc.text('Date', startX + columnWidths[0] + columnWidths[1] + 10, startY + 7, { width: columnWidths[2] });

    startY += rowHeight;

    // **Draw Rows with Borders**
    doc.font('Helvetica').fontSize(10);
    doc.lineWidth(1);
    
    filteredData.forEach((item, index) => {
      const formattedDate = moment(item.expenseDate).format('DD-MM-YYYY');
      doc.rect(startX, startY, columnWidths[0] + columnWidths[1] + columnWidths[2], rowHeight).stroke();
      doc.text(item.category, startX + 10, startY + 7, { width: columnWidths[0] });
      doc.text(item.expense.toString(), startX + columnWidths[0] + 10, startY + 7, { width: columnWidths[1] });
      doc.text(formattedDate, startX + columnWidths[0] + columnWidths[1] + 10, startY + 7, { width: columnWidths[2] });

      startY += rowHeight;
    });

    doc.end();
    stream.on('finish', () => {
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error('Download error:', err);
          return res.status(500).json({ message: "Error sending the file" });
        }
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    });

    stream.on('error', (err) => {
      console.error('PDF generation error:', err);
      res.status(500).json({ message: "Error generating PDF", error: err.message });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router