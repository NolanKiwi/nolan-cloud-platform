const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

// Task 1: Sync Docker State -> DB
const syncDockerState = async () => {
    // console.log('[Job] Syncing Docker State...');
    try {
        const instances = await prisma.instance.findMany({
            where: {
                status: {
                    not: 'terminated'
                }
            }
        });
        
        for (const instance of instances) {
            try {
                const container = docker.getContainer(instance.containerId);
                const data = await container.inspect();
                const currentStatus = data.State.Status; // running, exited, paused...
                
                if (instance.status !== currentStatus) {
                    console.log(`[Job] Updating ${instance.name} (${instance.id}): ${instance.status} -> ${currentStatus}`);
                    await prisma.instance.update({
                        where: { id: instance.id },
                        data: { status: currentStatus }
                    });
                }
            } catch (err) {
                // If container not found (404), mark as terminated
                if (err.statusCode === 404) {
                    // Only log if it was expected to be alive
                    if (instance.status !== 'terminated') {
                        console.log(`[Job] Container ${instance.containerId} missing. Marking as terminated.`);
                        await prisma.instance.update({
                            where: { id: instance.id },
                            data: { status: 'terminated' }
                        });
                    }
                }
            }
        }
    } catch (err) {
        // Log only critical errors
        console.error('[Job] Sync failed:', err.message);
    }
};

// Task 2: Calculate Disk Usage per User
const calculateDiskUsage = async () => {
    // console.log('[Job] Calculating Disk Usage...');
    try {
        const users = await prisma.user.findMany({
            include: {
                buckets: {
                    include: {
                        objects: true
                    }
                }
            }
        });

        for (const user of users) {
            let totalBytes = 0;
            let objectCount = 0;

            user.buckets.forEach(bucket => {
                bucket.objects.forEach(obj => {
                    totalBytes += obj.size;
                    objectCount++;
                });
            });

            if (totalBytes > 0) {
                console.log(`[Job] User ${user.email}: ${objectCount} objects, ${(totalBytes / 1024 / 1024).toFixed(2)} MB used.`);
            }
        }
    } catch (err) {
        console.error('[Job] Usage calc failed:', err.message);
    }
};

const initJobs = () => {
    // Run every minute
    cron.schedule('* * * * *', syncDockerState);
    
    // Run every hour
    cron.schedule('0 * * * *', calculateDiskUsage);
    
    console.log('🕒 Background jobs initialized (Sync: 1m, Usage: 1h)');
};

module.exports = { initJobs };
