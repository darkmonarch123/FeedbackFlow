const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Mock Database with a new field for the Slack Webhook
const db = {
    users: [
        { 
            id: "tenant123", 
            email: "ceo@startup.com", 
            plan: "Pro",
            slackWebhookUrl: "" // This will be updated via the dashboard
        },
    ],
    feedbacks: []
};

app.get('/', (req, res) => res.render('marketing'));

app.get('/dashboard', (req, res) => {
    const user = db.users[0];
    const tenantFeedbacks = db.feedbacks.filter(fb => fb.tenantId === user.id);
    res.render('dashboard', { feedbacks: tenantFeedbacks, user: user });
});

// Route to save the Slack Webhook from the Dashboard
app.post('/api/settings/slack', (req, res) => {
    const { webhookUrl } = req.body;
    db.users[0].slackWebhookUrl = webhookUrl;
    res.json({ success: true });
});

// Updated Feedback API with Slack Notification Logic
app.post('/api/feedback', async (req, res) => {
    const { tenantId, email, message } = req.body;
    const user = db.users.find(u => u.id === tenantId);

    const newFeedback = {
        tenantId,
        userEmail: email,
        message,
        date: new Date().toISOString().split('T')[0]
    };

    db.feedbacks.push(newFeedback);

    // Feature 3: Send Slack Notification
    if (user && user.slackWebhookUrl) {
        try {
            await fetch(user.slackWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: `🚀 *New Feedback Received!*\n*User:* ${email}\n*Message:* _"${message}"_`
                })
            });
            console.log("Slack notification sent!");
        } catch (err) {
            console.error("Slack notification failed:", err);
        }
    }

    res.status(200).json({ success: true });
});

app.listen(3000, () => console.log(`🚀 SaaS running on http://localhost:3000`));