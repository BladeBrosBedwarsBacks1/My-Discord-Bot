const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../data/database.json');

const loadDatabase = () => {
    try {
        return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
        return {};
    }
};

const saveDatabase = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

const getUser = (userId) => {
    const db = loadDatabase();
    if (!db[userId]) {
        db[userId] = {
            weaknesses: {
                maths: {},
                english: {},
                science: {}
            }
        };
        saveDatabase(db);
    }
    return db[userId];
};

const updateWeaknesses = (userId, subject, topic, isCorrect) => {
    const db = loadDatabase();
    const user = db[userId] || { weaknesses: {} };
    user.weaknesses[subject] = user.weaknesses[subject] || {};
    user.weaknesses[subject][topic] = user.weaknesses[subject][topic] || { correct: 0, incorrect: 0 };
    if (isCorrect) {
        user.weaknesses[subject][topic].correct++;
    } else {
        user.weaknesses[subject][topic].incorrect++;
    }
    db[userId] = user;
    saveDatabase(db);
};

module.exports = {
    getUser,
    updateWeaknesses
};
