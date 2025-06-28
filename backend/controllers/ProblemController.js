const express = require('express');
const { spawn } = require('child_process');
const Problem = require('../models/problem');
const auth = require('../middleware/authentication');
const User = require('../models/user');
const path = require('path');

const addproblem = async (req, res) => {
    const { title, url, notes, topic, time, tags } = req.body;

    // Validation
    if (!title || !url || !topic || !time || !tags || !Array.isArray(tags)) {
        return res.json({
            success: false,
            msg: "All fields are required and tags must be an array"
        });
    }

    try {
        // Get absolute path to the Python script
        const pythonScriptPath = path.resolve(__dirname, '../ml/predictor.py');
        
        // Call Python script to get ML predictions
        const pyProcess = spawn('python3', [pythonScriptPath, title, topic, ...tags]);

        let dataBuffer = '';

        pyProcess.stdout.on('data', (data) => {
            dataBuffer += data.toString();
        });

        pyProcess.stderr.on('data', (data) => {
            console.error("Python Error:", data.toString());
        });

        pyProcess.on('close', async (code) => {
            if (code !== 0) {
                return res.status(500).json({
                    success: false,
                    msg: "Error in Python script execution"
                });
            }

            // Ensure we get two values (predictedDifficulty and estimatedTime)
            const [predictedDifficulty, estimatedTime] = dataBuffer.trim().split(',');

            if (!predictedDifficulty || !estimatedTime) {
                return res.status(500).json({
                    success: false,
                    msg: "Error parsing predictions from Python script"
                });
            }

            // Create problem with ML predictions
            const problem = await Problem.create({
                title,
                url,
                notes,
                topic,
                time,
                tags,
                predictedDifficulty,
                estimatedTime
            });

            const username = req.username;
            const user = await User.findOne({ username });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    msg: "User not found"
                });
            }

            // Add the problem to the top of the user's problem list
            user.problems.unshift(problem._id); // Add to the beginning of the array
            await user.save();

            res.json({
                success: true,
                msg: "Problem added successfully with ML predictions",
                problem

            });
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};


const getproblems = async (req, res) => {
    try {
        const username = req.username;
        const user = await User.findOne({ username }).populate('problems');

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            problems: user.problems
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};

const deleteproblem = async (req, res) => {
    try {
        const { id } = req.params;
        const username = req.username;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        // Delete problem
        await Problem.deleteOne({ _id: id });
        user.problems = user.problems.filter((val) => val != id);
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Problem deleted successfully"
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};

module.exports = { addproblem, getproblems, deleteproblem };
