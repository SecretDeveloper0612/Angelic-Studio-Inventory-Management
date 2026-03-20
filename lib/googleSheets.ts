import { google } from "googleapis";
import { Product, UsageEntry } from "../types/product";
import { Supplier, RecentActivity } from "../types/inventory";

/**
 * Professional Google Sheets Integration
 * Supporting multi-sheet real-time tracking
 */

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const SHEET_ID = process.env.SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SERVICE_KEY?.replace(/\\n/g, "\n");

async function getSheetsInstance() {
  if (!CLIENT_EMAIL || !PRIVATE_KEY || !SHEET_ID) {
    throw new Error("Missing Google Sheets Configuration.");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    },
    scopes: SCOPES,
  });

  return google.sheets({ version: "v4", auth });
}

async function logActivityInSheet(activity: Partial<RecentActivity>) {
    try {
        const sheets = await getSheetsInstance();
        const values = [[
            Math.random().toString(36).substr(2, 9), // ID simple
            activity.productName || "Unknown",
            activity.action || "audit",
            new Date().toISOString(),
            activity.staffName || "System Auto",
            activity.details || ""
        ]];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: "Activities!A2",
            valueInputOption: "RAW",
            requestBody: { values },
        });
    } catch (err) {
        console.error("Log Activity Failed:", err);
    }
}

export async function fetchProductsFromSheet(): Promise<Product[]> {
  try {
    const sheets = await getSheetsInstance();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Products!A2:I", 
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    return rows.map((row) => ({
      id: row[0] || "",
      name: row[1] || "",
      category: row[2] || "",
      brand: row[3] || "",
      quantity: parseInt(row[4]) || 0,
      minStock: parseInt(row[5]) || 0,
      unit: (row[6] as any) || "pcs",
      supplier: row[7] || "",
      lastUpdated: row[8] || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

export async function addProductToSheet(product: Product): Promise<void> {
  const sheets = await getSheetsInstance();
  const values = [[
    product.id,
    product.name,
    product.category,
    product.brand,
    product.quantity,
    product.minStock,
    product.unit,
    product.supplier || "",
    product.lastUpdated,
  ]];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: "Products!A2",
    valueInputOption: "RAW",
    requestBody: { values },
  });

  await logActivityInSheet({
    productName: product.name,
    action: "added",
    details: `Initial stock of ${product.quantity} ${product.unit}`
  });
}

export const saveProductToSheet = addProductToSheet;

export async function updateProductInSheet(product: Product): Promise<void> {
    const sheets = await getSheetsInstance();
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: "Products!A2:A",
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === product.id);
    if (rowIndex === -1) return;

    // Get old product to compare quantity
    const oldResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `Products!A${rowIndex + 2}:E${rowIndex + 2}`,
    });
    const oldQty = parseInt(oldResponse.data.values?.[0][4]) || 0;
    const diff = product.quantity - oldQty;

    const range = `Products!A${rowIndex + 2}:I${rowIndex + 2}`;
    const values = [[
        product.id,
        product.name,
        product.category,
        product.brand,
        product.quantity,
        product.minStock,
        product.unit,
        product.supplier || "",
        product.lastUpdated,
    ]];

    await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range,
        valueInputOption: "RAW",
        requestBody: { values },
    });

    if (diff !== 0) {
        await logActivityInSheet({
            productName: product.name,
            action: diff < 0 ? "usage" : "refill",
            details: `${Math.abs(diff)} ${product.unit} recorded`
        });
    }
}

export async function deleteProductFromSheet(productId: string): Promise<void> {
    const sheets = await getSheetsInstance();
    const response = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: "Products!A2:B" });
    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === productId);
    if (rowIndex === -1) return;

    const productName = rows[rowIndex][1];
    await sheets.spreadsheets.values.clear({ spreadsheetId: SHEET_ID, range: `Products!A${rowIndex + 2}:K${rowIndex + 2}` });

    await logActivityInSheet({ productName, action: "deleted", details: "Permanent deletion" });
}

export async function fetchRecentActivities(): Promise<RecentActivity[]> {
  try {
    const sheets = await getSheetsInstance();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Activities!A2:F",
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    return rows.map((row) => ({
      id: row[0],
      productName: row[1],
      action: row[2] as any,
      date: row[3],
      staffName: row[4],
      details: row[5],
    })).reverse().slice(0, 10); // Last 10
  } catch (error) {
    console.error("Fetch Activities Failed:", error);
    return [];
  }
}

export async function updateUsageInSheet(entry: UsageEntry): Promise<void> {
  // Can reuse updateProductInSheet or log specifically
}


export async function initializeProductsSheet(): Promise<void> {
    const sheets = await getSheetsInstance();
    
    // Get Sheet ID for "Products"
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const productSheet = spreadsheet.data.sheets?.find(s => s.properties?.title === "Products");
    const sheetId = productSheet?.properties?.sheetId || 0;

    const headers = [
        "Product ID", 
        "Product Name", 
        "Category", 
        "Brand", 
        "Quantity", 
        "Min Stock", 
        "Unit", 
        "Supplier", 
        "Last Updated"
    ];

    // 1. Update Headers (Clear first to avoid leftovers)
    await sheets.spreadsheets.values.clear({ spreadsheetId: SHEET_ID, range: "Products!A1:L200" });
    
    await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: "Products!A1:I1",
        valueInputOption: "RAW",
        requestBody: { values: [headers] },
    });

    // 2. Styling (Advanced formatting)
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
            requests: [
                {
                    repeatCell: {
                        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 9 },
                        cell: {
                            userEnteredFormat: {
                                backgroundColor: { red: 196/255, green: 164/255, blue: 60/255 }, // Gold #c4a43c
                                textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 11 },
                                horizontalAlignment: "CENTER",
                            }
                        },
                        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
                    }
                },
                {
                    updateSheetProperties: {
                        properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
                        fields: "gridProperties.frozenRowCount"
                    }
                }
            ]
        }
    });
}
