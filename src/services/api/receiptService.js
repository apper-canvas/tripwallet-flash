const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ReceiptService {
  constructor() {
    this.uploadedReceipts = [];
  }

  async uploadReceipt(file) {
    await delay(800); // Simulate upload time
    
    // Simulate upload failures (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Upload failed. Please try again.');
    }

    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload a valid image file');
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size must be less than 10MB');
    }

    const receipt = {
      id: Date.now().toString(),
      filename: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      file: file
    };

    this.uploadedReceipts.push(receipt);
    return { ...receipt };
  }

  async processOCR(receiptId) {
    await delay(2000); // Simulate OCR processing time
    
    // Simulate OCR failures (15% chance)
    if (Math.random() < 0.15) {
      throw new Error('OCR processing failed. Please try again or enter details manually.');
    }

    const receipt = this.uploadedReceipts.find(r => r.id === receiptId);
    if (!receipt) {
      throw new Error('Receipt not found');
    }

    // Mock OCR results with realistic receipt data
    const mockResults = [
      {
        merchant: "Starbucks Coffee",
        amount: "12.75",
        date: "2024-01-15",
        category: "meals",
        items: ["Grande Latte", "Blueberry Muffin"],
        rawText: "STARBUCKS COFFEE\n123 Main St\nGrande Latte    $5.25\nBlueberry Muffin $3.50\nTax             $1.00\nTotal          $12.75\n01/15/2024 10:30 AM"
      },
      {
        merchant: "Shell Gas Station",
        amount: "45.20",
        date: "2024-01-14",
        category: "transport",
        items: ["Unleaded Gas"],
        rawText: "SHELL\n456 Highway Blvd\nUnleaded Gas\nGallons: 12.5\nPrice/Gal: $3.616\nTotal: $45.20\n01/14/2024 2:15 PM"
      },
      {
        merchant: "Hilton Hotel",
        amount: "189.99",
        date: "2024-01-13",
        category: "accommodation",
        items: ["Room 1 Night", "Resort Fee"],
        rawText: "HILTON HOTEL\n789 Downtown Ave\nRoom Rate      $159.99\nResort Fee      $30.00\nTotal          $189.99\n01/13/2024 - 01/14/2024"
      }
    ];

    // Return random mock result
    const result = mockResults[Math.floor(Math.random() * mockResults.length)];
    
    return {
      receiptId,
      success: true,
      data: {
        ...result,
        confidence: 0.85 + Math.random() * 0.1, // 85-95% confidence
        processedAt: new Date().toISOString()
      }
    };
  }

  async deleteReceipt(receiptId) {
    await delay(200);
    const index = this.uploadedReceipts.findIndex(r => r.id === receiptId);
    if (index === -1) {
      throw new Error('Receipt not found');
    }
    
    // Clean up object URL
    const receipt = this.uploadedReceipts[index];
    if (receipt.url) {
      URL.revokeObjectURL(receipt.url);
    }
    
    this.uploadedReceipts.splice(index, 1);
    return true;
  }

  async getReceipt(receiptId) {
    await delay(100);
    const receipt = this.uploadedReceipts.find(r => r.id === receiptId);
    if (!receipt) {
      throw new Error('Receipt not found');
    }
    return { ...receipt };
  }
}

export default new ReceiptService();