import express from "express";
import dotenv from "dotenv";
import pool from "./db";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.json());
// POST endpoint to create a new campaign
// app.post("/campaigns", async (req, res) => {
//   try {
//     const { type, start_date, end_date, schedules } = req.body;

//     // Start a transaction
//     const client = await pool.connect();
//     try {
//       await client.query("BEGIN");

//       // Insert campaign
//       const campaignResult = await client.query(
//         "INSERT INTO Campaigns (type, start_date, end_date) VALUES ($1, $2, $3) RETURNING id",
//         [type, start_date, end_date]
//       );
//       const campaignId = campaignResult.rows[0].id;

//       // Insert schedules
//       for (const schedule of schedules) {
//         await client.query(
//           "INSERT INTO Schedules (campaign_id, weekday, start_time, end_time) VALUES ($1, $2, $3, $4)",
//           [
//             campaignId,
//             schedule.weekday,
//             schedule.start_time,
//             schedule.end_time,
//           ]
//         );
//       }

//       await client.query("COMMIT");
//       res
//         .status(201)
//         .json({
//           message: "Campaign created successfully",
//           campaignId,
//         });
//     } catch (e) {
//       await client.query("ROLLBACK");
//       throw e;
//     } finally {
//       client.release();
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error creating campaign" });
//   }
// });
// app.post("/campaigns", async (req, res) => {
//   console.log(req.body);
//   try {
//     const {
//       type,
//       start_date,
//       end_date,
//       selected_date,
//       start_time,
//       end_time,
//     } = req.body;

//     if (
//       !type ||
//       ![
//         "Cost per Order",
//         "Cost per Click",
//         "Buy One Get One",
//       ].includes(type)
//     ) {
//       return res
//         .status(400)
//         .json({ error: "Invalid or missing campaign type" });
//     }

//     const client = await pool.connect();
//     try {
//       await client.query("BEGIN");

//       // Insert campaign
//       const campaignResult = await client.query(
//         "INSERT INTO Campaigns (type, start_date, end_date) VALUES ($1, $2, $3) RETURNING id",
//         [type, start_date, end_date]
//       );
//       const campaignId = campaignResult.rows[0].id;

//       // Insert schedule
//       await client.query(
//         "INSERT INTO Schedules (campaign_id, weekday, start_time, end_time) VALUES ($1, $2, $3, $4)",
//         [
//           campaignId,
//           new Date(selected_date).toLocaleDateString("en-US", {
//             weekday: "long",
//           }),
//           start_time,
//           end_time,
//         ]
//       );

//       await client.query("COMMIT");
//       res.status(201).json({
//         message: "Campaign created successfully",
//         campaignId,
//       });
//     } catch (e) {
//       await client.query("ROLLBACK");
//       throw e;
//     } finally {
//       client.release();
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error creating campaign" });
//   }
// });
app.post("/campaigns", async (req, res) => {
  console.log(req.body);
  try {
    const { type, start_date, end_date, schedules } = req.body;

    if (
      !type ||
      ![
        "Cost per Order",
        "Cost per Click",
        "Buy One Get One",
      ].includes(type)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid or missing campaign type" });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert campaign
      const campaignResult = await client.query(
        "INSERT INTO Campaigns (type, start_date, end_date) VALUES ($1, $2, $3) RETURNING id",
        [type, start_date, end_date]
      );
      const campaignId = campaignResult.rows[0].id;

      // Insert schedules
      for (const schedule of schedules) {
        const date = new Date(schedule.date);
        const weekday = date.toLocaleDateString("en-US", {
          weekday: "long",
        });
        await client.query(
          "INSERT INTO Schedules (campaign_id, weekday, date, start_time, end_time) VALUES ($1, $2, $3, $4, $5)",
          [
            campaignId,
            weekday,
            schedule.date,
            schedule.start_time,
            schedule.end_time,
          ]
        );
      }

      await client.query("COMMIT");
      res.status(201).json({
        message: "Campaign created successfully",
        campaignId,
      });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating campaign" });
  }
});

// GET endpoint to retrieve campaigns
// app.get("/campaigns", async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT c.*,
//              json_agg(json_build_object('weekday', s.weekday, 'start_time', s.start_time, 'end_time', s.end_time)) as schedules,
//              (
//                SELECT json_build_object('weekday', s2.weekday, 'start_time', s2.start_time, 'end_time', s2.end_time)
//                FROM Schedules s2
//                WHERE s2.campaign_id = c.id
//                AND s2.weekday >= EXTRACT(DOW FROM CURRENT_DATE)::text
//                AND s2.start_time > CURRENT_TIME
//                ORDER BY s2.weekday, s2.start_time
//                LIMIT 1
//              ) as next_activation
//       FROM Campaigns c
//       LEFT JOIN Schedules s ON c.id = s.campaign_id
//       GROUP BY c.id
//       ORDER BY c.start_date DESC
//     `);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error retrieving campaigns" });
//   }
// });
app.get("/campaigns", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.type,
        c.start_date,
        c.end_date,
        (
          SELECT json_build_object(
            'date', s.date,
            'weekday', s.weekday,
            'start_time', s.start_time,
            'end_time', s.end_time
          )
          FROM Schedules s
          WHERE s.campaign_id = c.id
          AND s.date >= CURRENT_DATE
          ORDER BY s.date, s.start_time
          LIMIT 1
        ) as next_schedule
      FROM Campaigns c
      ORDER BY c.start_date DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving campaigns" });
  }
});

// PUT endpoint to update an existing campaign
app.put("/campaigns/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, start_date, end_date, schedules } = req.body;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Update campaign
      await client.query(
        "UPDATE Campaigns SET type = $1, start_date = $2, end_date = $3 WHERE id = $4",
        [type, start_date, end_date, id]
      );

      // Delete existing schedules
      await client.query(
        "DELETE FROM Schedules WHERE campaign_id = $1",
        [id]
      );

      // Insert new schedules
      for (const schedule of schedules) {
        await client.query(
          "INSERT INTO Schedules (campaign_id, weekday, start_time, end_time) VALUES ($1, $2, $3, $4)",
          [
            id,
            schedule.weekday,
            schedule.start_time,
            schedule.end_time,
          ]
        );
      }

      await client.query("COMMIT");
      res.json({ message: "Campaign updated successfully" });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating campaign" });
  }
});
async function createCampaignTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Campaigns (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) CHECK (type IN ('Cost per Order', 'Cost per Click', 'Buy One Get One')) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL
      );
      CREATE TABLE IF NOT EXISTS Schedules (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES Campaigns(id),
  weekday VARCHAR(20),
  date DATE,
  start_time TIME,
  end_time TIME
);

    
    `);
    console.log("Campaign tables created successfully");
  } catch (err) {
    console.error("Error creating campaign tables:", err);
  }
}
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("select now()");
    res.json({
      message: "Database connected successfully",
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database connection failed" });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "welcome to the campaign" });
});

app.listen(port, async () => {
  await createCampaignTables();
  console.log(`erver is running on ${port}`);
});
