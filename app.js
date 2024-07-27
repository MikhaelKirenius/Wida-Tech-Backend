const express = require("express");
const { Pool } = require("pg");
const cors = require("cors"); 

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Invoice",
  password: "admin123",
  port: 5432,
});

app.post("/add-invoice", async (req, res) => {
  const { date, customer_name, salesperson_name, notes, products } = req.body;

  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    const invoiceResult = await client.query(
      "INSERT INTO invoices (date, customer_name, salesperson_name, notes) VALUES ($1, $2, $3, $4) RETURNING invoice_id",
      [date, customer_name, salesperson_name, notes]
    );

    const invoiceId = invoiceResult.rows[0].invoice_id;

    await Promise.all(
      products.map(async (product) => {
        await client.query(
          "INSERT INTO invoice_products (invoice_id, product_id, quantity) VALUES ($1, $2, $3)",
          [invoiceId, product.product_id, product.quantity]
        );
      })
    );

    await client.query("COMMIT");
    res.json({ message: "Invoice added successfully", invoiceId: invoiceId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.get("/invoices", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const client = await pool.connect();

    const invoicesQuery = `
        SELECT i.invoice_id, i.date, i.customer_name, i.salesperson_name, i.notes,
               SUM(ip.quantity * p.price) AS total_amount_paid
        FROM invoices i
        JOIN invoice_products ip ON i.invoice_id = ip.invoice_id
        JOIN products p ON ip.product_id = p.product_id
        GROUP BY i.invoice_id
        ORDER BY i.invoice_id
        LIMIT $1 OFFSET $2
      `;

    const { rows } = await client.query(invoicesQuery, [limit, offset]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.get('/revenue/daily', async (req, res) => {
    try {
      const dailyRevenueQuery = `
        SELECT date(i.date) AS day, SUM(ip.quantity * p.price) AS total_revenue
        FROM invoices i
        JOIN invoice_products ip ON i.invoice_id = ip.invoice_id
        JOIN products p ON ip.product_id = p.product_id
        GROUP BY day
        ORDER BY day
      `;
      const { rows } = await pool.query(dailyRevenueQuery);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error " + err);
    }
  });
  
  app.get('/revenue/weekly', async (req, res) => {
    try {
      const weeklyRevenueQuery = `
        SELECT date_trunc('week', i.date)::date AS week, SUM(ip.quantity * p.price) AS total_revenue
        FROM invoices i
        JOIN invoice_products ip ON i.invoice_id = ip.invoice_id
        JOIN products p ON ip.product_id = p.product_id
        GROUP BY week
        ORDER BY week
      `;
      const { rows } = await pool.query(weeklyRevenueQuery);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error " + err);
    }
  });
  
  app.get('/revenue/monthly', async (req, res) => {
    try {
      const monthlyRevenueQuery = `
        SELECT date_trunc('month', i.date)::date AS month, SUM(ip.quantity * p.price) AS total_revenue
        FROM invoices i
        JOIN invoice_products ip ON i.invoice_id = ip.invoice_id
        JOIN products p ON ip.product_id = p.product_id
        GROUP BY month
        ORDER BY month
      `;
      const { rows } = await pool.query(monthlyRevenueQuery);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error " + err);
    }
  });

  app.get("/invoices-summary", async (req, res) => {
    try {
      const totalInvoicesQuery = `
        SELECT COUNT(*) AS total_invoices FROM invoices
      `;
      const totalInvoicesResult = await pool.query(totalInvoicesQuery);
      const totalInvoices = totalInvoicesResult.rows[0].total_invoices;
  
      const totalInvoicesTodayQuery = `
        SELECT COUNT(*) AS total_invoices_today FROM invoices
        WHERE DATE(date) = CURRENT_DATE
      `;
      const totalInvoicesTodayResult = await pool.query(totalInvoicesTodayQuery);
      const totalInvoicesToday = totalInvoicesTodayResult.rows[0].total_invoices_today;
  
      const totalAmountPaidQuery = `
        SELECT SUM(ip.quantity * p.price) AS total_amount_paid
        FROM invoice_products ip
        JOIN products p ON ip.product_id = p.product_id
      `;
      const totalAmountPaidResult = await pool.query(totalAmountPaidQuery);
      const totalAmountPaid = totalAmountPaidResult.rows[0].total_amount_paid;
  
      const totalAmountPaidTodayQuery = `
        SELECT SUM(ip.quantity * p.price) AS total_amount_paid_today
        FROM invoice_products ip
        JOIN products p ON ip.product_id = p.product_id
        JOIN invoices i ON ip.invoice_id = i.invoice_id
        WHERE DATE(i.date) = CURRENT_DATE
      `;
      const totalAmountPaidTodayResult = await pool.query(totalAmountPaidTodayQuery);
      const totalAmountPaidToday = totalAmountPaidTodayResult.rows[0].total_amount_paid_today;
  
      res.json({
        total_invoices: totalInvoices,
        total_invoices_today: totalInvoicesToday,
        total_amount_paid: totalAmountPaid,
        total_amount_paid_today: totalAmountPaidToday
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error " + err);
    }
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
