import Tesseract from 'tesseract.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class OCRService {
  constructor() {
    this.worker = null;
  }

  async initializeWorker() {
    if (this.worker) return this.worker;
    
    try {
      this.worker = await Tesseract.createWorker('eng');
      return this.worker;
    } catch (error) {
      throw new Error('Failed to initialize OCR engine');
    }
  }

  async processImage(file, onProgress = null) {
    try {
      await this.initializeWorker();
      
      const { data } = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (onProgress && m.status === 'recognizing text') {
            onProgress(Math.round(m.progress * 100));
          }
        }
      });

      return this.parseReceiptText(data.text);
    } catch (error) {
      throw new Error('OCR processing failed: ' + error.message);
    }
  }

  parseReceiptText(text) {
    const lines = text.split('\n').filter(line => line.trim());
    
    // Simple parsing logic - in real app, this would be more sophisticated
    const result = {
      merchant: '',
      amount: '',
      date: '',
      category: 'other',
      items: [],
      rawText: text,
      confidence: 0.75
    };

    // Extract merchant (usually first non-empty line)
    if (lines.length > 0) {
      result.merchant = lines[0].trim();
    }

    // Look for total amount
    const amountRegex = /total.*?(\d+\.?\d*)/i;
    const amountMatch = text.match(amountRegex);
    if (amountMatch) {
      result.amount = amountMatch[1];
    }

    // Look for date
    const dateRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/;
    const dateMatch = text.match(dateRegex);
    if (dateMatch) {
      const dateParts = dateMatch[1].split(/[\/\-]/);
      if (dateParts.length === 3) {
        // Convert to YYYY-MM-DD format
        const year = dateParts[2].length === 2 ? '20' + dateParts[2] : dateParts[2];
        const month = dateParts[0].padStart(2, '0');
        const day = dateParts[1].padStart(2, '0');
        result.date = `${year}-${month}-${day}`;
      }
    }

    // Categorize based on merchant keywords
    const merchantLower = result.merchant.toLowerCase();
    if (merchantLower.includes('restaurant') || merchantLower.includes('cafe') || 
        merchantLower.includes('starbucks') || merchantLower.includes('mcdonald')) {
      result.category = 'meals';
    } else if (merchantLower.includes('gas') || merchantLower.includes('shell') || 
               merchantLower.includes('exxon') || merchantLower.includes('uber')) {
      result.category = 'transport';
    } else if (merchantLower.includes('hotel') || merchantLower.includes('hilton') || 
               merchantLower.includes('marriott')) {
      result.category = 'accommodation';
    }

    return result;
  }

  async cleanup() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

export default new OCRService();