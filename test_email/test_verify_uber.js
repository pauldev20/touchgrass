const fs = require('fs');
const { simpleParser } = require('mailparser');
const { dkimVerify } = require('mailauth/lib/dkim/verify');

async function verifyEmailDKIM(rawEmail) {
    try {
        const results = await dkimVerify(rawEmail);
        for (const result of results.results) {
            const status = result.status;
            if (status.result === 'pass' && 
                status.aligned.endsWith('uber.com')) {
                return true;
            }
            if (status.result === 'neutral' && 
                status.comment === 'expired' && 
                status.aligned.endsWith('uber.com')) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Error:', error.message);
        return false;
    }
}

const extractCoordinates = (url) => {
    const markerRegex = /markers=[^&]*?%7Cscale%3A2%7C([-.\d]+)%2C([-.\d]+)/g;
    const matches = [...url.matchAll(markerRegex)];
    if (matches.length >= 2) {
      const origin = {
        lat: parseFloat(matches[0][1]),
        lng: parseFloat(matches[0][2])
      };
      const destination = {
        lat: parseFloat(matches[1][1]),
        lng: parseFloat(matches[1][2])
      };
      return { origin, destination };
    } else {
      throw new Error("Could not find both origin and destination markers.");
    }
  };

  const extractPrice = (text) => {
    // Look for lines containing NT$
    const lines = text.split('\n');
    const priceLine = lines.find(line => line.includes('NT$'));
    
    if (!priceLine) {
      throw new Error("Could not find any line containing NT$ in email text");
    }

    // Try different price formats
    // Format: "Total NT$123.45" or "NT$123.45"
    const standardFormat = priceLine.match(/NT\$(\d+\.\d{2})/);
    if (standardFormat) {
      return { price: parseFloat(standardFormat[1]) };
    }

    // Format: "123,45 NT$" or similar
    const europeanFormat = priceLine.match(/(\d+),(\d{2})\s*NT\$/);
    if (europeanFormat) {
      return { price: parseFloat(`${europeanFormat[1]}.${europeanFormat[2]}`) };
    }

    console.log("Price line found:", priceLine);
    throw new Error("Could not parse price format in the line containing NT$");
  };
  
async function emailInfo(rawEmail) {
    try {
        const parsedEmail = await simpleParser(rawEmail);
        const text = parsedEmail.text;
        // console.log(text);
        const mapUrlMatch = text.match(/https:\/\/maps\.googleapis\.com\/maps\/api\/staticmap[^"'\s]*/);
        if (mapUrlMatch.length === 0) {
            return null;
        }
        const { origin, destination } = extractCoordinates(mapUrlMatch[0]);
        const { price } = extractPrice(text);
        return { origin, destination, price, date: parsedEmail.date };
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

function test_email(filePath) {
    const rawEmail = fs.readFileSync(filePath, 'utf8');
    
    verifyEmailDKIM(rawEmail).then(valid => {
        if (valid) {
            console.log('Valid');
        } else {
            console.log('Invalid');
        }
    });
    emailInfo(rawEmail).then(info => {
        console.log(info);
    });
}

test_email('./email_uber_paul_2.eml');
test_email('./email_uber_jacob.eml');