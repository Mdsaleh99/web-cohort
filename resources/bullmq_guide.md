# Complete BullMQ Guide with Examples

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Basic Concepts](#basic-concepts)
4. [Basic Queue Operations](#basic-queue-operations)
5. [Job Processing](#job-processing)
6. [Job Options and Configuration](#job-options-and-configuration)
7. [Job Patterns and Types](#job-patterns-and-types)
8. [Advanced Features](#advanced-features)
9. [Real-World Examples](#real-world-examples)
10. [Error Handling](#error-handling)
11. [Monitoring and Management](#monitoring-and-management)
12. [Performance Optimization](#performance-optimization)
13. [Testing](#testing)
14. [Production Best Practices](#production-best-practices)
15. [Troubleshooting](#troubleshooting)

## Introduction

BullMQ is a Node.js library that implements a fast and robust queue system built on top of Redis. It's the successor to Bull and provides advanced features like job scheduling, retries, priorities, and rate limiting.

### Key Features
- **Redis-based**: Uses Redis for persistence and scalability
- **Job scheduling**: Delayed and repeated jobs
- **Priorities**: High, normal, and low priority jobs
- **Rate limiting**: Control job processing rate
- **Retries**: Automatic retry with exponential backoff
- **Events**: Comprehensive event system
- **Sandboxed processing**: Isolated job processors
- **Flow control**: Job dependencies and workflows
- **Metrics**: Built-in job metrics and monitoring

### Why Use BullMQ?
- **Scalability**: Horizontal scaling across multiple processes
- **Reliability**: Persistent jobs with Redis
- **Performance**: Optimized for high throughput
- **Flexibility**: Support for various job patterns
- **Monitoring**: Rich ecosystem of monitoring tools

## Installation

### Prerequisites
- Node.js 16+ 
- Redis 6.2+

### Basic Installation
```bash
npm install bullmq
# or
yarn add bullmq
```

### Additional Dependencies
```bash
# For UI dashboard
npm install @bull-board/api @bull-board/express

# For metrics
npm install @bull-board/api

# For job scheduling
npm install node-cron
```

## Basic Concepts

### Core Components

#### 1. Queue
Container for jobs, manages job lifecycle.

#### 2. Job
Unit of work with data and options.

#### 3. Worker
Processes jobs from the queue.

#### 4. QueueEvents
Listens to queue events.

#### 5. Flow Producer
Manages job dependencies and workflows.

### Architecture
```
Producer → Queue → Worker → Job Processing
     ↓         ↓        ↓
   Events → Redis ← QueueEvents
```

## Basic Queue Operations

### Creating a Queue
```javascript
import { Queue } from 'bullmq';

const emailQueue = new Queue('email processing', {
  connection: {
    host: 'localhost',
    port: 6379,
    // password: 'your-redis-password'
  }
});

// With custom Redis configuration
const advancedQueue = new Queue('advanced processing', {
  connection: {
    host: 'localhost',
    port: 6379,
    db: 0,
    maxRetriesPerRequest: 3,
  },
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});
```

### Adding Jobs
```javascript
// Simple job
await emailQueue.add('send email', {
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Welcome to our platform'
});

// Job with options
await emailQueue.add('send email', {
  to: 'user@example.com',
  subject: 'Newsletter',
  body: 'Monthly newsletter'
}, {
  delay: 5000, // 5 seconds delay
  attempts: 3,
  priority: 10,
  removeOnComplete: true
});

// Bulk add jobs
const jobs = [
  { name: 'send email', data: { to: 'user1@example.com', subject: 'Hi' } },
  { name: 'send email', data: { to: 'user2@example.com', subject: 'Hello' } },
  { name: 'send email', data: { to: 'user3@example.com', subject: 'Hey' } }
];

await emailQueue.addBulk(jobs);
```

### Scheduled Jobs
```javascript
// Delayed job
await emailQueue.add('reminder', {
  userId: 123,
  message: 'Don\'t forget to complete your profile'
}, {
  delay: 24 * 60 * 60 * 1000 // 24 hours
});

// Repeated job
await emailQueue.add('daily-report', {
  reportType: 'sales'
}, {
  repeat: {
    pattern: '0 9 * * *', // Every day at 9 AM
    tz: 'America/New_York'
  }
});

// Cron-style repeated job
await emailQueue.add('weekly-cleanup', {
  action: 'cleanup-old-files'
}, {
  repeat: {
    pattern: '0 0 * * 0' // Every Sunday at midnight
  }
});
```

## Job Processing

### Basic Worker
```javascript
import { Worker } from 'bullmq';

const emailWorker = new Worker('email processing', async (job) => {
  const { to, subject, body } = job.data;
  
  // Simulate email sending
  console.log(`Sending email to ${to}`);
  console.log(`Subject: ${subject}`);
  
  // Update progress
  await job.updateProgress(50);
  
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Update progress
  await job.updateProgress(100);
  
  return { status: 'sent', messageId: 'msg-123' };
}, {
  connection: {
    host: 'localhost',
    port: 6379,
  }
});
```

### Worker with Multiple Job Types
```javascript
const multiWorker = new Worker('task processing', async (job) => {
  switch (job.name) {
    case 'send-email':
      return await handleEmailJob(job);
    case 'generate-report':
      return await handleReportJob(job);
    case 'process-image':
      return await handleImageJob(job);
    default:
      throw new Error(`Unknown job type: ${job.name}`);
  }
}, {
  connection: { host: 'localhost', port: 6379 },
  concurrency: 5
});

async function handleEmailJob(job) {
  const { to, subject, body } = job.data;
  // Email processing logic
  await job.updateProgress(25);
  // ... email sending code
  await job.updateProgress(100);
  return { sent: true, timestamp: Date.now() };
}

async function handleReportJob(job) {
  const { reportType, filters } = job.data;
  // Report generation logic
  await job.updateProgress(20);
  // ... report generation code
  await job.updateProgress(100);
  return { reportUrl: 'https://example.com/report.pdf' };
}
```

### Sandboxed Processing
```javascript
// processor.js - Separate file for job processing
export default async function (job) {
  const { imageUrl, transformations } = job.data;
  
  // Heavy image processing
  await job.updateProgress(10);
  
  // Simulate image processing
  for (let i = 0; i < transformations.length; i++) {
    await processTransformation(transformations[i]);
    await job.updateProgress(((i + 1) / transformations.length) * 100);
  }
  
  return { processedUrl: 'https://cdn.example.com/processed-image.jpg' };
}

// main.js
const imageWorker = new Worker('image processing', './processor.js', {
  connection: { host: 'localhost', port: 6379 },
  concurrency: 3
});
```

## Job Options and Configuration

### Job Options
```javascript
const jobOptions = {
  // Retry configuration
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
  
  // Timing
  delay: 5000, // 5 seconds
  
  // Priority (higher number = higher priority)
  priority: 10,
  
  // Job lifecycle
  removeOnComplete: 10, // Keep 10 completed jobs
  removeOnFail: 5,      // Keep 5 failed jobs
  
  // Job ID and deduplication
  jobId: 'unique-job-id',
  
  // Repeat configuration
  repeat: {
    pattern: '0 */6 * * *', // Every 6 hours
    limit: 100,             // Maximum 100 repetitions
    immediately: true,      // Run immediately, then repeat
  },
  
  // Rate limiting
  settings: {
    stalledInterval: 30000,
    maxStalledCount: 1,
  }
};

await queue.add('job-name', jobData, jobOptions);
```

### Worker Configuration
```javascript
const workerOptions = {
  connection: {
    host: 'localhost',
    port: 6379,
    db: 0,
  },
  
  // Concurrency
  concurrency: 10,
  
  // Rate limiting
  limiter: {
    max: 100,        // Maximum 100 jobs
    duration: 60000, // Per minute
  },
  
  // Job settings
  settings: {
    stalledInterval: 30000,
    maxStalledCount: 1,
  },
  
  // Metrics
  metrics: {
    maxDataPoints: 100,
  }
};

const worker = new Worker('queue-name', processorFunction, workerOptions);
```

## Job Patterns and Types

### 1. Background Jobs
```javascript
// User registration background tasks
const userQueue = new Queue('user registration');

// Add background job after user signs up
async function handleUserRegistration(userData) {
  // Immediate response to user
  const user = await createUser(userData);
  
  // Background tasks
  await userQueue.add('send-welcome-email', {
    userId: user.id,
    email: user.email,
    name: user.name
  });
  
  await userQueue.add('setup-user-preferences', {
    userId: user.id,
    defaultPreferences: getDefaultPreferences()
  });
  
  await userQueue.add('send-to-analytics', {
    event: 'user_registered',
    userId: user.id,
    timestamp: Date.now()
  });
  
  return user;
}
```

### 2. Batch Processing
```javascript
// Batch email processing
const batchQueue = new Queue('batch processing');

async function processBatchEmails(recipients) {
  const batchSize = 100;
  const batches = [];
  
  for (let i = 0; i < recipients.length; i += batchSize) {
    batches.push(recipients.slice(i, i + batchSize));
  }
  
  for (const [index, batch] of batches.entries()) {
    await batchQueue.add('process-email-batch', {
      batch,
      batchNumber: index + 1,
      totalBatches: batches.length
    }, {
      delay: index * 1000, // Stagger batches
    });
  }
}

// Worker for batch processing
const batchWorker = new Worker('batch processing', async (job) => {
  const { batch, batchNumber, totalBatches } = job.data;
  
  console.log(`Processing batch ${batchNumber}/${totalBatches}`);
  
  for (const [index, recipient] of batch.entries()) {
    await sendEmail(recipient);
    await job.updateProgress(((index + 1) / batch.length) * 100);
  }
  
  return { processed: batch.length };
});
```

### 3. Scheduled Tasks
```javascript
// Scheduled maintenance tasks
const maintenanceQueue = new Queue('maintenance');

// Daily database cleanup
await maintenanceQueue.add('cleanup-database', {
  tables: ['logs', 'temp_data', 'expired_sessions']
}, {
  repeat: {
    pattern: '0 2 * * *', // 2 AM every day
  }
});

// Weekly report generation
await maintenanceQueue.add('generate-weekly-report', {
  reportType: 'user-activity',
  recipients: ['admin@example.com']
}, {
  repeat: {
    pattern: '0 9 * * 1', // 9 AM every Monday
  }
});

// Monthly backup
await maintenanceQueue.add('backup-database', {
  backupType: 'full',
  retention: 12 // Keep 12 months
}, {
  repeat: {
    pattern: '0 1 1 * *', // 1 AM on first day of month
  }
});
```

### 4. Priority Jobs
```javascript
// Priority-based job processing
const priorityQueue = new Queue('priority processing');

// High priority - critical system alerts
await priorityQueue.add('send-alert', {
  type: 'system-down',
  message: 'Critical system failure detected'
}, {
  priority: 100, // Highest priority
  attempts: 5
});

// Medium priority - user notifications
await priorityQueue.add('user-notification', {
  userId: 123,
  message: 'Your order has been shipped'
}, {
  priority: 50
});

// Low priority - analytics processing
await priorityQueue.add('process-analytics', {
  eventType: 'page_view',
  data: { page: '/products', userId: 456 }
}, {
  priority: 1
});
```

## Advanced Features

### 1. Job Dependencies (Flows)
```javascript
import { FlowProducer } from 'bullmq';

const flowProducer = new FlowProducer({
  connection: { host: 'localhost', port: 6379 }
});

// Create a job flow with dependencies
const flow = {
  name: 'process-order',
  queueName: 'orders',
  data: { orderId: 123 },
  children: [
    {
      name: 'validate-payment',
      queueName: 'payments',
      data: { orderId: 123, amount: 99.99 },
      children: [
        {
          name: 'charge-card',
          queueName: 'payments',
          data: { cardId: 'card-123', amount: 99.99 }
        }
      ]
    },
    {
      name: 'update-inventory',
      queueName: 'inventory',
      data: { productId: 'prod-456', quantity: 1 }
    },
    {
      name: 'send-confirmation',
      queueName: 'notifications',
      data: { orderId: 123, email: 'user@example.com' }
    }
  ]
};

await flowProducer.add(flow);
```

### 2. Rate Limiting
```javascript
// Queue with rate limiting
const rateLimitedQueue = new Queue('api-calls', {
  connection: { host: 'localhost', port: 6379 }
});

// Worker with rate limiting
const rateLimitedWorker = new Worker('api-calls', async (job) => {
  const { apiEndpoint, data } = job.data;
  
  // Make API call
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  });
  
  return await response.json();
}, {
  connection: { host: 'localhost', port: 6379 },
  limiter: {
    max: 10,        // Maximum 10 requests
    duration: 60000 // Per minute
  }
});
```

### 3. Job Progress Tracking
```javascript
const progressQueue = new Queue('file-processing');

// Worker with detailed progress tracking
const progressWorker = new Worker('file-processing', async (job) => {
  const { fileUrl, operations } = job.data;
  
  // Download file
  await job.updateProgress(10, 'Downloading file...');
  const file = await downloadFile(fileUrl);
  
  // Process operations
  for (let i = 0; i < operations.length; i++) {
    const operation = operations[i];
    const progress = 10 + ((i + 1) / operations.length) * 80;
    
    await job.updateProgress(progress, `Processing: ${operation.name}`);
    await processOperation(file, operation);
  }
  
  // Upload result
  await job.updateProgress(90, 'Uploading processed file...');
  const resultUrl = await uploadFile(file);
  
  await job.updateProgress(100, 'Complete');
  
  return { resultUrl, processedOperations: operations.length };
});
```

### 4. Event Handling
```javascript
import { QueueEvents } from 'bullmq';

const queueEvents = new QueueEvents('email processing', {
  connection: { host: 'localhost', port: 6379 }
});

// Job lifecycle events
queueEvents.on('waiting', ({ jobId }) => {
  console.log(`Job ${jobId} is waiting`);
});

queueEvents.on('active', ({ jobId, prev }) => {
  console.log(`Job ${jobId} is now active; previous status was ${prev}`);
});

queueEvents.on('completed', ({ jobId, returnvalue }) => {
  console.log(`Job ${jobId} completed with result:`, returnvalue);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.log(`Job ${jobId} failed with reason:`, failedReason);
});

queueEvents.on('progress', ({ jobId, data }) => {
  console.log(`Job ${jobId} progress: ${data.progress}% - ${data.message}`);
});

// Queue-level events
queueEvents.on('cleaned', ({ count }) => {
  console.log(`Cleaned ${count} jobs`);
});

// Worker events
emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

emailWorker.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed:`, err);
});

emailWorker.on('error', (err) => {
  console.error('Worker error:', err);
});
```

## Real-World Examples

### 1. E-commerce Order Processing
```javascript
// Order processing system
const orderQueue = new Queue('order-processing');
const paymentQueue = new Queue('payment-processing');
const inventoryQueue = new Queue('inventory-management');
const shippingQueue = new Queue('shipping');

// Order workflow
async function processOrder(orderData) {
  // Main order processing
  const orderJob = await orderQueue.add('process-order', {
    orderId: orderData.id,
    items: orderData.items,
    customerId: orderData.customerId
  }, {
    attempts: 3,
    backoff: 'exponential'
  });
  
  // Payment processing (depends on order validation)
  await paymentQueue.add('process-payment', {
    orderId: orderData.id,
    amount: orderData.total,
    paymentMethod: orderData.paymentMethod
  }, {
    delay: 1000, // Small delay to ensure order is processed first
    attempts: 5
  });
  
  return orderJob;
}

// Order processing worker
const orderWorker = new Worker('order-processing', async (job) => {
  const { orderId, items, customerId } = job.data;
  
  // Validate order
  await job.updateProgress(20, 'Validating order...');
  const validation = await validateOrder(orderId, items, customerId);
  
  if (!validation.valid) {
    throw new Error(`Order validation failed: ${validation.reason}`);
  }
  
  // Reserve inventory
  await job.updateProgress(50, 'Reserving inventory...');
  const inventoryResult = await reserveInventory(items);
  
  if (!inventoryResult.success) {
    throw new Error('Insufficient inventory');
  }
  
  // Calculate shipping
  await job.updateProgress(80, 'Calculating shipping...');
  const shipping = await calculateShipping(items, customerId);
  
  await job.updateProgress(100, 'Order processed successfully');
  
  return {
    orderId,
    status: 'processed',
    inventoryReserved: inventoryResult.reservationId,
    shippingCost: shipping.cost,
    estimatedDelivery: shipping.estimatedDelivery
  };
});

// Payment processing worker
const paymentWorker = new Worker('payment-processing', async (job) => {
  const { orderId, amount, paymentMethod } = job.data;
  
  try {
    await job.updateProgress(25, 'Authorizing payment...');
    const authorization = await authorizePayment(paymentMethod, amount);
    
    await job.updateProgress(50, 'Charging payment...');
    const charge = await chargePayment(authorization.id, amount);
    
    await job.updateProgress(75, 'Updating order status...');
    await updateOrderStatus(orderId, 'paid');
    
    // Trigger shipping
    await shippingQueue.add('create-shipment', {
      orderId,
      trackingNumber: generateTrackingNumber()
    });
    
    await job.updateProgress(100, 'Payment processed successfully');
    
    return {
      orderId,
      transactionId: charge.id,
      status: 'charged',
      amount
    };
  } catch (error) {
    // Handle payment failure
    await updateOrderStatus(orderId, 'payment_failed');
    throw error;
  }
});
```

### 2. Image Processing Pipeline
```javascript
const imageQueue = new Queue('image-processing');

// Image processing workflow
async function processUserUpload(imageData) {
  await imageQueue.add('process-image', {
    imageUrl: imageData.url,
    userId: imageData.userId,
    transformations: [
      { type: 'resize', width: 800, height: 600 },
      { type: 'optimize', quality: 85 },
      { type: 'watermark', position: 'bottom-right' }
    ]
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  });
}

// Image processing worker
const imageWorker = new Worker('image-processing', async (job) => {
  const { imageUrl, userId, transformations } = job.data;
  
  // Download original image
  await job.updateProgress(10, 'Downloading original image...');
  const originalImage = await downloadImage(imageUrl);
  
  let processedImage = originalImage;
  
  // Apply transformations
  for (let i = 0; i < transformations.length; i++) {
    const transformation = transformations[i];
    const progress = 20 + ((i + 1) / transformations.length) * 60;
    
    await job.updateProgress(progress, `Applying ${transformation.type}...`);
    processedImage = await applyTransformation(processedImage, transformation);
  }
  
  // Upload processed image
  await job.updateProgress(85, 'Uploading processed image...');
  const processedUrl = await uploadImage(processedImage, userId);
  
  // Generate thumbnails
  await job.updateProgress(90, 'Generating thumbnails...');
  const thumbnails = await generateThumbnails(processedImage);
  
  // Update database
  await job.updateProgress(95, 'Updating database...');
  await updateUserImage(userId, {
    originalUrl: imageUrl,
    processedUrl,
    thumbnails
  });
  
  await job.updateProgress(100, 'Image processing complete');
  
  return {
    originalUrl: imageUrl,
    processedUrl,
    thumbnails,
    transformationsApplied: transformations.length
  };
}, {
  concurrency: 3, // Limit concurrent image processing
  limiter: {
    max: 50,
    duration: 60000 // Max 50 images per minute
  }
});
```

### 3. Email Campaign System
```javascript
const campaignQueue = new Queue('email-campaign');
const emailQueue = new Queue('email-sending');

// Campaign management
async function launchEmailCampaign(campaignData) {
  const campaign = await campaignQueue.add('prepare-campaign', {
    campaignId: campaignData.id,
    subject: campaignData.subject,
    content: campaignData.content,
    segmentId: campaignData.segmentId,
    scheduledTime: campaignData.scheduledTime
  }, {
    delay: calculateDelay(campaignData.scheduledTime),
    attempts: 2
  });
  
  return campaign;
}

// Campaign worker
const campaignWorker = new Worker('email-campaign', async (job) => {
  const { campaignId, subject, content, segmentId, scheduledTime } = job.data;
  
  // Get recipient list
  await job.updateProgress(10, 'Fetching recipients...');
  const recipients = await getSegmentRecipients(segmentId);
  
  // Personalize content
  await job.updateProgress(30, 'Personalizing content...');
  const personalizedEmails = await personalizeEmails(recipients, content);
  
  // Batch emails for sending
  await job.updateProgress(50, 'Batching emails...');
  const batches = createEmailBatches(personalizedEmails, 100);
  
  // Schedule email batches
  await job.updateProgress(70, 'Scheduling email batches...');
  for (const [index, batch] of batches.entries()) {
    await emailQueue.add('send-email-batch', {
      campaignId,
      batchNumber: index + 1,
      totalBatches: batches.length,
      emails: batch
    }, {
      delay: index * 30000, // 30 second delay between batches
      attempts: 3
    });
  }
  
  // Update campaign status
  await job.updateProgress(90, 'Updating campaign status...');
  await updateCampaignStatus(campaignId, 'sending');
  
  await job.updateProgress(100, 'Campaign launched successfully');
  
  return {
    campaignId,
    recipientCount: recipients.length,
    batchCount: batches.length,
    status: 'sending'
  };
});

// Email sending worker
const emailWorker = new Worker('email-sending', async (job) => {
  const { campaignId, batchNumber, totalBatches, emails } = job.data;
  
  let sent = 0;
  let failed = 0;
  
  for (const [index, email] of emails.entries()) {
    try {
      await sendEmail(email);
      sent++;
      
      // Update progress
      const progress = ((index + 1) / emails.length) * 100;
      await job.updateProgress(progress, `Sent ${sent}/${emails.length} emails`);
      
      // Track email metrics
      await trackEmailSent(campaignId, email.recipientId);
      
    } catch (error) {
      failed++;
      console.error(`Failed to send email to ${email.to}:`, error);
      await trackEmailFailed(campaignId, email.recipientId, error.message);
    }
  }
  
  // Update campaign metrics
  await updateCampaignMetrics(campaignId, { sent, failed });
  
  return {
    campaignId,
    batchNumber,
    totalBatches,
    sent,
    failed,
    total: emails.length
  };
}, {
  concurrency: 5,
  limiter: {
    max: 1000,
    duration: 60000 // Max 1000 emails per minute
  }
});
```

### 4. Data Processing Pipeline
```javascript
const dataQueue = new Queue('data-processing');

// Data processing workflow
async function processDataFile(fileData) {
  await dataQueue.add('process-data-file', {
    fileUrl: fileData.url,
    fileName: fileData.name,
    fileSize: fileData.size,
    processingRules: fileData.rules,
    outputFormat: fileData.outputFormat
  }, {
    attempts: 3,
    backoff: 'exponential'
  });
}

// Data processing worker
const dataWorker = new Worker('data-processing', async (job) => {
  const { fileUrl, fileName, fileSize, processingRules, outputFormat } = job.data;
  
  // Download and validate file
  await job.updateProgress(5, 'Downloading file...');
  const fileBuffer = await downloadFile(fileUrl);
  
  await job.updateProgress(10, 'Validating file format...');
  const validation = await validateFileFormat(fileBuffer, fileName);
  
  if (!validation.valid) {
    throw new Error(`Invalid file format: ${validation.error}`);
  }
  
  // Parse data
  await job.updateProgress(20, 'Parsing data...');
  const rawData = await parseData(fileBuffer, validation.format);
  
  // Apply processing rules
  let processedData = rawData;
  const totalRules = processingRules.length;
  
  for (let i = 0; i < totalRules; i++) {
    const rule = processingRules[i];
    const progress = 20 + ((i + 1) / totalRules) * 60;
    
    await job.updateProgress(progress, `Applying rule: ${rule.name}`);
    processedData = await applyProcessingRule(processedData, rule);
  }
  
  // Generate output
  await job.updateProgress(85, 'Generating output...');
  const output = await generateOutput(processedData, outputFormat);
  
  // Upload result
  await job.updateProgress(95, 'Uploading result...');
  const resultUrl = await uploadResult(output, fileName, outputFormat);
  
  // Generate report
  await job.updateProgress(98, 'Generating report...');
  const report = await generateProcessingReport({
    originalFile: fileName,
    recordsProcessed: processedData.length,
    rulesApplied: totalRules,
    outputFormat,
    resultUrl
  });
  
  await job.updateProgress(100, 'Processing complete');
  
  return {
    fileName,
    recordsProcessed: processedData.length,
    rulesApplied: totalRules,
    resultUrl,
    reportUrl: report.url
  };
}, {
  concurrency: 2, // Limit concurrent data processing
});
```

## Error Handling

### Custom Error Types
```javascript
class ValidationError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
  }
}

class RetryableError extends Error {
  constructor(message, retryAfter = 30000) {
    super(message);
    this.name = 'RetryableError';
    this.retryAfter = retryAfter;
  }
}

class FatalError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FatalError';
  }
}
```

### Error Handling in Workers
```javascript
const errorHandlingWorker = new Worker('error-handling', async (job) => {
  const { operation, data } = job.data;
  
  try {
    switch (operation) {
      case 'validate':
        const validation = await validateData(data);
        if (!validation.valid) {
          throw new ValidationError(validation.message, validation.code);
        }
        break;
        
      case 'api-call':
        try {
          const response = await makeApiCall(data.endpoint, data.payload);
          if (!response.ok) {
            if (response.status >= 500) {
              throw new RetryableError(`Server error: ${response.status}`);
            } else if (response.status >= 400) {
              throw new ValidationError(`Client error: ${response.status}`);
            }
          }
          return response.data;
        } catch (error) {
          if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
            throw new RetryableError('Network error', 60000);
          }
          throw error;
        }
        break;
        
      case 'process-file':
        const fileResult = await processFile(data.fileUrl);
        if (!fileResult.success) {
          throw new FatalError(`File processing failed: ${fileResult.error}`);
        }
        break;
        
      default:
        throw new FatalError(`Unknown operation: ${operation}`);
    }
  } catch (error) {
    // Log error details
    console.error(`Job ${job.id} failed:`, {
      operation,
      error: error.message,
      stack: error.stack,
      data: JSON.stringify(data)
    });
    
    // Handle different error types
    if (error instanceof ValidationError) {
      // Don't retry validation errors
      throw error;
    } else if (error instanceof RetryableError) {
      // Retry with custom delay
      job.opts.backoff = {
        type: 'fixed',
        delay: error.retryAfter
      };
      throw error;
    } else if (error instanceof FatalError) {
      // Don't retry fatal errors
      throw error;
    } else {
      // Unknown error - retry with exponential backoff
      throw error;
    }
  }
}, {
  connection: { host: 'localhost', port: 6379 },
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 5000
  }
});

// Error event handling
errorHandlingWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed after ${job.attemptsMade} attempts:`, err);
  
  // Send alert for critical errors
  if (err instanceof FatalError || job.attemptsMade >= 3) {
    sendAlert({
      type: 'job-failure',
      jobId: job.id,
      jobName: job.name,
      error: err.message,
      attempts: job.attemptsMade
    });
  }
});
```

### Retry Strategies
```javascript
// Custom retry logic
const retryQueue = new Queue('retry-demo', {
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 10,
    removeOnFail: 5
  }
});

const retryWorker = new Worker('retry-demo', async (job) => {
  const { operation, data } = job.data;
  
  // Simulate different failure scenarios
  if (operation === 'flaky-api') {
    // 70% chance of failure on first few attempts
    const failureRate = Math.max(0.1, 0.7 - (job.attemptsMade * 0.15));
    
    if (Math.random() < failureRate) {
      throw new Error(`API call failed (attempt ${job.attemptsMade})`);
    }
    
    return { success: true, attempt: job.attemptsMade };
  }
  
  // Progressive backoff for different error types
  if (operation === 'rate-limited') {
    try {
      const result = await callRateLimitedAPI(data);
      return result;
    } catch (error) {
      if (error.status === 429) {
        // Rate limited - use longer delay
        const delay = Math.min(60000, 5000 * Math.pow(2, job.attemptsMade));
        job.opts.backoff = { type: 'fixed', delay };
      }
      throw error;
    }
  }
}, {
  connection: { host: 'localhost', port: 6379 }
});
```

## Monitoring and Management

### Queue Monitoring
```javascript
import { Queue, QueueEvents } from 'bullmq';

class QueueMonitor {
  constructor(queueName) {
    this.queue = new Queue(queueName, {
      connection: { host: 'localhost', port: 6379 }
    });
    
    this.queueEvents = new QueueEvents(queueName, {
      connection: { host: 'localhost', port: 6379 }
    });
    
    this.setupEventHandlers();
  }
  
  setupEventHandlers() {
    this.queueEvents.on('completed', (job) => {
      this.logJobMetrics('completed', job);
    });
    
    this.queueEvents.on('failed', (job) => {
      this.logJobMetrics('failed', job);
    });
    
    this.queueEvents.on('stalled', (job) => {
      console.warn(`Job ${job.jobId} stalled`);
    });
  }
  
  async getQueueMetrics() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.queue.getWaiting(),
      this.queue.getActive(),
      this.queue.getCompleted(),
      this.queue.getFailed(),
      this.queue.getDelayed()
    ]);
    
    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
      total: waiting.length + active.length + completed.length + failed.length + delayed.length
    };
  }
  
  async getJobDetails(jobId) {
    const job = await this.queue.getJob(jobId);
    if (!job) return null;
    
    return {
      id: job.id,
      name: job.name,
      data: job.data,
      progress: job.progress,
      attempts: job.attemptsMade,
      maxAttempts: job.opts.attempts,
      created: job.timestamp,
      processed: job.processedOn,
      finished: job.finishedOn,
      failed: job.failedReason,
      returnValue: job.returnvalue
    };
  }
  
  logJobMetrics(status, job) {
    const metrics = {
      jobId: job.jobId,
      jobName: job.name,
      status,
      duration: job.finishedOn - job.processedOn,
      attempts: job.attemptsMade,
      timestamp: Date.now()
    };
    
    // Send to monitoring system
    console.log('Job metrics:', metrics);
  }
  
  async cleanupJobs() {
    // Clean completed jobs older than 24 hours
    await this.queue.clean(24 * 60 * 60 * 1000, 100, 'completed');
    
    // Clean failed jobs older than 7 days
    await this.queue.clean(7 * 24 * 60 * 60 * 1000, 50, 'failed');
  }
}

// Usage
const monitor = new QueueMonitor('email-processing');

// Get metrics every 30 seconds
setInterval(async () => {
  const metrics = await monitor.getQueueMetrics();
  console.log('Queue metrics:', metrics);
}, 30000);

// Cleanup old jobs every hour
setInterval(async () => {
  await monitor.cleanupJobs();
}, 60 * 60 * 1000);
```

### Bull Board Integration
```javascript
import express from 'express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

const app = express();

// Create queues
const emailQueue = new Queue('email-processing');
const imageQueue = new Queue('image-processing');
const dataQueue = new Queue('data-processing');

// Setup Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [
    new BullMQAdapter(emailQueue),
    new BullMQAdapter(imageQueue),
    new BullMQAdapter(dataQueue)
  ],
  serverAdapter: serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());

// Custom metrics endpoint
app.get('/api/queue-metrics', async (req, res) => {
  const metrics = {};
  
  for (const queue of [emailQueue, imageQueue, dataQueue]) {
    const [waiting, active, completed, failed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed()
    ]);
    
    metrics[queue.name] = {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length
    };
  }
  
  res.json(metrics);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
  console.log('Bull Board available at http://localhost:3000/admin/queues');
});
```

## Performance Optimization

### Optimizing Queue Performance
```javascript
// Optimized queue configuration
const optimizedQueue = new Queue('high-performance', {
  connection: {
    host: 'localhost',
    port: 6379,
    // Connection pooling
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
  },
  defaultJobOptions: {
    removeOnComplete: 100,  // Keep fewer completed jobs
    removeOnFail: 50,       // Keep fewer failed jobs
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
  settings: {
    stalledInterval: 30000,
    maxStalledCount: 1,
  }
});

// Optimized worker configuration
const optimizedWorker = new Worker('high-performance', async (job) => {
  // Fast job processing
  const result = await processJobQuickly(job.data);
  return result;
}, {
  connection: {
    host: 'localhost',
    port: 6379,
  },
  concurrency: 10,        // Adjust based on system resources
  limiter: {
    max: 1000,
    duration: 60000,      // 1000 jobs per minute
  },
  settings: {
    stalledInterval: 30000,
    maxStalledCount: 1,
  }
});
```

### Batch Processing for Performance
```javascript
// Batch job processing
const batchQueue = new Queue('batch-processing');

// Add jobs in batches
async function addJobsBatch(jobs) {
  const batchSize = 100;
  const batches = [];
  
  for (let i = 0; i < jobs.length; i += batchSize) {
    batches.push(jobs.slice(i, i + batchSize));
  }
  
  for (const batch of batches) {
    await batchQueue.addBulk(batch.map(job => ({
      name: 'process-item',
      data: job,
      opts: {
        removeOnComplete: 10,
        removeOnFail: 5
      }
    })));
  }
}

// Batch processing worker
const batchWorker = new Worker('batch-processing', async (job) => {
  // Process multiple items together when possible
  const { items } = job.data;
  
  if (Array.isArray(items)) {
    return await processBatchItems(items);
  } else {
    return await processSingleItem(job.data);
  }
}, {
  concurrency: 5
});
```

## Testing

### Unit Testing Jobs
```javascript
// test/jobs.test.js
import { Queue, Worker } from 'bullmq';
import { beforeEach, afterEach, describe, it, expect } from 'vitest';

describe('Email Queue Tests', () => {
  let queue;
  let worker;
  
  beforeEach(async () => {
    queue = new Queue('test-email', {
      connection: { host: 'localhost', port: 6379, db: 1 } // Use test database
    });
    
    worker = new Worker('test-email', async (job) => {
      const { to, subject, body } = job.data;
      
      // Mock email sending
      if (!to || !subject || !body) {
        throw new Error('Missing required fields');
      }
      
      return { sent: true, messageId: 'test-123' };
    }, {
      connection: { host: 'localhost', port: 6379, db: 1 }
    });
  });
  
  afterEach(async () => {
    await queue.close();
    await worker.close();
  });
  
  it('should process email job successfully', async () => {
    const job = await queue.add('send-email', {
      to: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test Body'
    });
    
    // Wait for job completion
    const result = await job.waitUntilFinished();
    
    expect(result).toEqual({
      sent: true,
      messageId: 'test-123'
    });
  });
  
  it('should fail with missing required fields', async () => {
    const job = await queue.add('send-email', {
      to: 'test@example.com'
      // Missing subject and body
    });
    
    try {
      await job.waitUntilFinished();
      expect.fail('Job should have failed');
    } catch (error) {
      expect(error.message).toBe('Missing required fields');
    }
  });
});
```

### Integration Testing
```javascript
// test/integration.test.js
import { Queue, Worker, QueueEvents } from 'bullmq';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('Order Processing Integration', () => {
  let orderQueue;
  let paymentQueue;
  let orderWorker;
  let paymentWorker;
  let queueEvents;
  
  beforeAll(async () => {
    // Setup queues
    orderQueue = new Queue('test-orders', {
      connection: { host: 'localhost', port: 6379, db: 1 }
    });
    
    paymentQueue = new Queue('test-payments', {
      connection: { host: 'localhost', port: 6379, db: 1 }
    });
    
    queueEvents = new QueueEvents('test-orders', {
      connection: { host: 'localhost', port: 6379, db: 1 }
    });
    
    // Setup workers
    orderWorker = new Worker('test-orders', async (job) => {
      const { orderId, items } = job.data;
      
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Trigger payment processing
      await paymentQueue.add('process-payment', {
        orderId,
        amount: items.reduce((sum, item) => sum + item.price, 0)
      });
      
      return { orderId, status: 'processed' };
    }, {
      connection: { host: 'localhost', port: 6379, db: 1 }
    });
    
    paymentWorker = new Worker('test-payments', async (job) => {
      const { orderId, amount } = job.data;
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 50));
      
      return { orderId, amount, status: 'charged' };
    }, {
      connection: { host: 'localhost', port: 6379, db: 1 }
    });
  });
  
  afterAll(async () => {
    await orderQueue.close();
    await paymentQueue.close();
    await orderWorker.close();
    await paymentWorker.close();
    await queueEvents.close();
  });
  
  it('should process order and payment workflow', async () => {
    const orderData = {
      orderId: 'test-123',
      items: [
        { name: 'Product 1', price: 29.99 },
        { name: 'Product 2', price: 49.99 }
      ]
    };
    
    // Add order job
    const orderJob = await orderQueue.add('process-order', orderData);
    
    // Wait for order completion
    const orderResult = await orderJob.waitUntilFinished();
    
    expect(orderResult).toEqual({
      orderId: 'test-123',
      status: 'processed'
    });
    
    // Check payment job was created
    const paymentJobs = await paymentQueue.getJobs(['waiting', 'active', 'completed']);
    const paymentJob = paymentJobs.find(job => job.data.orderId === 'test-123');
    
    expect(paymentJob).toBeDefined();
    expect(paymentJob.data.amount).toBe(79.98);
  });
});
```

## Production Best Practices

### 1. Queue Configuration
```javascript
// production-config.js
export const productionQueueConfig = {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB) || 0,
    
    // Connection pooling
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    lazyConnect: true,
    
    // Connection limits
    maxRetriesPerRequest: null,
    connectTimeout: 60000,
    commandTimeout: 5000,
  },
  
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
  
  settings: {
    stalledInterval: 30000,
    maxStalledCount: 1,
  }
};

// Worker configuration
export const productionWorkerConfig = {
  connection: productionQueueConfig.connection,
  concurrency: parseInt(process.env.WORKER_CONCURRENCY) || 5,
  
  limiter: {
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    duration: parseInt(process.env.RATE_LIMIT_DURATION) || 60000,
  },
  
  settings: {
    stalledInterval: 30000,
    maxStalledCount: 1,
  }
};
```

### 2. Graceful Shutdown
```javascript
// graceful-shutdown.js
class GracefulShutdown {
  constructor() {
    this.workers = [];
    this.queues = [];
    this.isShuttingDown = false;
  }
  
  addWorker(worker) {
    this.workers.push(worker);
  }
  
  addQueue(queue) {
    this.queues.push(queue);
  }
  
  async shutdown() {
    if (this.isShuttingDown) return;
    
    console.log('Starting graceful shutdown...');
    this.isShuttingDown = true;
    
    // Stop accepting new jobs
    console.log('Stopping workers...');
    await Promise.all(this.workers.map(worker => worker.close()));
    
    // Close queue connections
    console.log('Closing queue connections...');
    await Promise.all(this.queues.map(queue => queue.close()));
    
    console.log('Graceful shutdown complete');
    process.exit(0);
  }
  
  setupSignalHandlers() {
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGQUIT', () => this.shutdown());
  }
}

// Usage
const gracefulShutdown = new GracefulShutdown();
gracefulShutdown.setupSignalHandlers();

// Add workers and queues to shutdown manager
gracefulShutdown.addWorker(emailWorker);
gracefulShutdown.addQueue(emailQueue);
```

### 3. Health Checks
```javascript
// health-check.js
export class HealthCheck {
  constructor(queues, workers) {
    this.queues = queues;
    this.workers = workers;
  }
  
  async checkHealth() {
    const health = {
      status: 'healthy',
      timestamp: Date.now(),
      queues: {},
      workers: {},
      redis: null
    };
    
    try {
      // Check Redis connection
      const redis = this.queues[0].client;
      await redis.ping();
      health.redis = 'connected';
      
      // Check queues
      for (const queue of this.queues) {
        const queueHealth = await this.checkQueueHealth(queue);
        health.queues[queue.name] = queueHealth;
        
        if (queueHealth.status !== 'healthy') {
          health.status = 'unhealthy';
        }
      }
      
      // Check workers
      for (const worker of this.workers) {
        const workerHealth = await this.checkWorkerHealth(worker);
        health.workers[worker.name] = workerHealth;
        
        if (workerHealth.status !== 'healthy') {
          health.status = 'unhealthy';
        }
      }
      
    } catch (error) {
      health.status = 'unhealthy';
      health.error = error.message;
    }
    
    return health;
  }
  
  async checkQueueHealth(queue) {
    try {
      const [waiting, active, failed] = await Promise.all([
        queue.getWaiting(),
        queue.getActive(),
        queue.getFailed()
      ]);
      
      return {
        status: 'healthy',
        waiting: waiting.length,
        active: active.length,
        failed: failed.length
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
  
  async checkWorkerHealth(worker) {
    return {
      status: worker.closed ? 'unhealthy' : 'healthy',
      running: !worker.closed,
      concurrency: worker.opts.concurrency
    };
  }
}
```

### 4. Logging and Monitoring
```javascript
// logging.js
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Job metrics tracking
class JobMetrics {
  constructor() {
    this.metrics = {
      jobsProcessed: 0,
      jobsFailed: 0,
      avgProcessingTime: 0,
      processingTimes: []
    };
  }
  
  recordJobCompletion(processingTime) {
    this.metrics.jobsProcessed++;
    this.metrics.processingTimes.push(processingTime);
    
    // Keep only last 100 processing times
    if (this.metrics.processingTimes.length > 100) {
      this.metrics.processingTimes = this.metrics.processingTimes.slice(-100);
    }
    
    this.metrics.avgProcessingTime = 
      this.metrics.processingTimes.reduce((a, b) => a + b, 0) / 
      this.metrics.processingTimes.length;
  }
  
  recordJobFailure() {
    this.metrics.jobsFailed++;
  }
  
  getMetrics() {
    return {
      ...this.metrics,
      failureRate: this.metrics.jobsFailed / 
        (this.metrics.jobsProcessed + this.metrics.jobsFailed) * 100
    };
  }
}

export { logger, JobMetrics };
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Memory Leaks
```javascript
// Memory leak prevention
const memoryEfficientQueue = new Queue('memory-efficient', {
  connection: { host: 'localhost', port: 6379 },
  defaultJobOptions: {
    removeOnComplete: 5,   // Keep fewer completed jobs
    removeOnFail: 3,       // Keep fewer failed jobs
  }
});

// Regular cleanup
setInterval(async () => {
  await memoryEfficientQueue.clean(60000, 100, 'completed');
  await memoryEfficientQueue.clean(300000, 50, 'failed');
}, 300000); // Every 5 minutes
```

#### 2. Stalled Jobs
```javascript
// Stalled job handling
const stalledJobWorker = new Worker('stalled-handling', async (job) => {
  // Add job heartbeat for long-running jobs
  const heartbeat = setInterval(async () => {
    try {
      await job.updateProgress(job.progress || 0);
    } catch (error) {
      clearInterval(heartbeat);
    }
  }, 30000); // Every 30 seconds
  
  try {
    const result = await longRunningTask(job.data);
    clearInterval(heartbeat);
    return result;
  } catch (error) {
    clearInterval(heartbeat);
    throw error;
  }
}, {
  settings: {
    stalledInterval: 30000,
    maxStalledCount: 1,
  }
});
```

#### 3. Redis Connection Issues
```javascript
// Robust Redis connection
const robustQueue = new Queue('robust-connection', {
  connection: {
    host: 'localhost',
    port: 6379,
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: 3,
    reconnectOnError: (err) => {
      const targetError = 'READONLY';
      return err.message.includes(targetError);
    }
  }
});

// Connection event handling
robustQueue.on('error', (error) => {
  console.error('Queue connection error:', error);
});

robustQueue.on('waiting', (job) => {
  console.log(`Job ${job.id} is waiting`);
});
```

### Debugging Tools
```javascript
// Debug utility
class BullMQDebugger {
  constructor(queueName) {
    this.queueName = queueName;
    this.queue = new Queue(queueName, {
      connection: { host: 'localhost', port: 6379 }
    });
  }
  
  async inspectJob(jobId) {
    const job = await this.queue.getJob(jobId);
    if (!job) {
      console.log(`Job ${jobId} not found`);
      return;
    }
    
    console.log('Job Details:', {
      id: job.id,
      name: job.name,
      data: job.data,
      opts: job.opts,
      progress: job.progress,
      attempts: job.attemptsMade,
      maxAttempts: job.opts.attempts,
      created: new Date(job.timestamp),
      processed: job.processedOn ? new Date(job.processedOn) : null,
      finished: job.finishedOn ? new Date(job.finishedOn) : null,
      failed: job.failedReason,
      returnValue: job.returnvalue
    });
  }
  
  async getQueueStats() {
    const stats = await this.queue.getJobCounts();
    console.log('Queue Statistics:', stats);
    return stats;
  }
  
  async retryFailedJobs() {
    const failed = await this.queue.getFailed();
    console.log(`Retrying ${failed.length} failed jobs`);
    
    for (const job of failed) {
      await job.retry();
    }
  }
  
  async cleanQueue() {
    const cleaned = await this.queue.clean(0, 1000, 'completed');
    console.log(`Cleaned ${cleaned} completed jobs`);
    
    const failedCleaned = await this.queue.clean(0, 1000, 'failed');
    console.log(`Cleaned ${failedCleaned} failed jobs`);
  }
}

// Usage
const debugger = new BullMQDebugger('email-processing');
await debugger.inspectJob('123');
await debugger.getQueueStats();
```

This comprehensive guide covers BullMQ from basic concepts to advanced production use cases. The examples show real-world scenarios like e-commerce order processing, image processing pipelines, email campaigns, and data processing workflows. Each section includes practical code examples that you can adapt to your specific needs.