/**
 * Google Apps Script for Tech For Girls Registration
 * Deploy this as a Web App to handle form submissions
 * 
 * Setup Instructions:
 * 1. Go to script.google.com
 * 2. Create new project
 * 3. Paste this code
 * 4. Replace YOUR_SHEET_ID with your Google Sheet ID
 * 5. Deploy as Web App with access set to "Anyone"
 * 6. Copy the Web App URL to your JavaScript file
 */

function doPost(e) {
    try {
        // Parse the incoming data
        const data = JSON.parse(e.postData.contents);
        
        // Replace with your Google Sheet ID
        const SHEET_ID = 'YOUR_SHEET_ID_HERE';
        
        // Open the Google Sheet
        const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
        
        // Add headers if sheet is empty
        if (sheet.getLastRow() === 0) {
            const headers = [
                'Timestamp',
                'Name',
                'Country Code',
                'Phone Number',
                'Full Phone',
                'Email', 
                'College/Department',
                'Screenshot (Base64)',
                'File Name',
                'WhatsApp Clicks',
                'Status'
            ];
            sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
            
            // Format header row
            const headerRange = sheet.getRange(1, 1, 1, headers.length);
            headerRange.setBackground('#667eea');
            headerRange.setFontColor('white');
            headerRange.setFontWeight('bold');
        }
        
        // Prepare the row data
        const rowData = [
            new Date(data.timestamp),
            data.name,
            data.countryCode,
            data.phone,
            data.fullPhone,
            data.email,
            data.college,
            data.screenshot, // Base64 encoded file
            data.fileName,
            data.clickCount,
            'Submitted'
        ];
        
        // Add the data to the sheet
        sheet.appendRow(rowData);
        
        // Auto-resize columns for better readability
        sheet.autoResizeColumns(1, 9);
        
        // Log the submission
        console.log('New registration submitted:', {
            name: data.name,
            email: data.email,
            timestamp: data.timestamp
        });
        
        // Return success response
        return ContentService
            .createTextOutput(JSON.stringify({
                success: true,
                message: 'Registration submitted successfully',
                timestamp: new Date().toISOString()
            }))
            .setMimeType(ContentService.MimeType.JSON);
            
    } catch (error) {
        // Log the error
        console.error('Error processing registration:', error);
        
        // Return error response
        return ContentService
            .createTextOutput(JSON.stringify({
                success: false,
                error: error.toString(),
                message: 'Failed to submit registration'
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * Test function to verify the script works
 * Run this function to test your setup
 */
function testSubmission() {
    const testData = {
        postData: {
            contents: JSON.stringify({
                name: 'Test User',
                phone: '1234567890',
                email: 'test@example.com',
                college: 'Test College',
                screenshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
                fileName: 'test.png',
                timestamp: new Date().toISOString(),
                clickCount: 5
            })
        }
    };
    
    const result = doPost(testData);
    console.log('Test result:', result.getContent());
}

/**
 * Function to get all submissions (optional)
 * You can call this to retrieve all registration data
 */
function getAllSubmissions() {
    try {
        const SHEET_ID = 'YOUR_SHEET_ID_HERE';
        const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
        
        const data = sheet.getDataRange().getValues();
        const headers = data[0];
        const rows = data.slice(1);
        
        const submissions = rows.map(row => {
            const submission = {};
            headers.forEach((header, index) => {
                submission[header] = row[index];
            });
            return submission;
        });
        
        return submissions;
        
    } catch (error) {
        console.error('Error getting submissions:', error);
        return [];
    }
}

/**
 * Function to send email notifications (optional)
 * Uncomment and modify if you want email notifications
 */
/*
function sendNotificationEmail(data) {
    const recipient = 'admin@techforgirls.com'; // Replace with your email
    const subject = 'New Tech For Girls Registration';
    const body = `
        New registration received:
        
        Name: ${data.name}
        Email: ${data.email}
        Phone: ${data.phone}
        College: ${data.college}
        Timestamp: ${data.timestamp}
        WhatsApp Shares: ${data.clickCount}
        
        Please check the Google Sheet for complete details.
    `;
    
    GmailApp.sendEmail(recipient, subject, body);
}
*/