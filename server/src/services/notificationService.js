const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// This service is responsible for sending notifications
class NotificationService {
    // Send event to configured webhook
    async sendWebhook(event) {
        // In a real system, we'd look up the user's configured webhook URL
        // For this demo, let's assume we store it in a hypothetical 'Webhook' table or User profile
        // Since we don't have a Webhook table yet, let's just log it or simulate a call.
        
        console.log(`[Notification] 🔔 Event: ${event.type} | Resource: ${event.resourceId} | Status: ${event.status}`);
        
        // TODO: Future Implementation
        // const webhook = await prisma.webhook.findFirst({ where: { userId: event.userId } });
        // if (webhook) {
        //     try {
        //         await axios.post(webhook.url, event);
        //     } catch (err) {
        //         console.error('[Notification] Failed to send webhook:', err.message);
        //     }
        // }
    }
}

module.exports = new NotificationService();
