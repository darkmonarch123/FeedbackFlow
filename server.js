const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mock Database
const db = {
    users: [
        { id: "tenant123", email: "ceo@startup.com", plan: "Pro", mrr: 49 },
    ],
    feedbacks: [
        { tenantId: "tenant123", userEmail: "jane@example.com", message: "Love the new fast checkout!", date: "2026-04-20" },
        { tenantId: "tenant123", userEmail: "mark@test.com", message: "The contrast on the buttons is a bit low.", date: "2026-04-22" }
    ]
};

// Routes
// 1. Marketing Page
app.get('/', (req, res) => {
    res.render('marketing');
});

// 2. SaaS Dashboard
app.get('/dashboard', (req, res) => {
    const currentUser = db.users[0]; // Simulating logged-in user
    const tenantFeedbacks = db.feedbacks.filter(fb => fb.tenantId === currentUser.id);
    
    res.render('dashboard', { 
        feedbacks: tenantFeedbacks, 
        user: currentUser 
    });
});

// 3. Widget API (Receives feedback from client websites)
app.post('/api/feedback', (req, res) => {
    const { tenantId, email, message } = req.body;

    if (!tenantId || !email || !message) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    db.feedbacks.push({
        tenantId: tenantId,
        userEmail: email,
        message: message,
        date: new Date().toISOString().split('T')[0]
    });

    console.log(`[CEO Alert] New feedback captured for tenant: ${tenantId}`);
    res.status(200).json({ success: true, message: "Feedback saved." });
});

const port = 3000;
app.listen(port, () => {
    console.log(`🚀 FeedbackFlow SaaS running on http://localhost:${port}`);
});