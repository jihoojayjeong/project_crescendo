const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

const schemaData = mongoose.Schema({
    title: String,
    message: String,
}, {
    timestamps: true
});

const feedbackModel = mongoose.model("feedbacks", schemaData);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to db")
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch((err) => console.log(err))


app.post("/saveFeedback", async (req, res) => {
    try {
        console.log(req.body);

        if (!req.body.title || !req.body.message) {
            return res.status(400).json({ success: false, message: "Title and message are required fields" });
        }

        const data = new feedbackModel(req.body);
        await data.save();

        res.status(200).json({ success: true, message: "Data save successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.get("/getFeedback", async (req, res) => {
    try {
        const data = await feedbackModel.find({}, { title: 1, message: 1 });
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
