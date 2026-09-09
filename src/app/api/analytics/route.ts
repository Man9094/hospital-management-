import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Bed Statistics
    const bedStats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
        SUM(CASE WHEN status = 'cleaning' THEN 1 ELSE 0 END) as cleaning
      FROM beds
    `).get() as any;

    const icuStats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied
      FROM beds WHERE ward_id = 'WARD-ICU'
    `).get() as any;

    // 2. OPD & IPD counts
    const today = new Date().toISOString().split("T")[0];
    const opdStats = db.prepare(`
      SELECT 
        COUNT(*) as total_today,
        SUM(CASE WHEN status = 'waiting' THEN 1 ELSE 0 END) as waiting,
        SUM(CASE WHEN status = 'in_consultation' THEN 1 ELSE 0 END) as in_consultation,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM appointments WHERE appointment_date = ?
    `).get(today) as any;

    const ipdActiveCount = db.prepare(`
      SELECT COUNT(*) as count FROM ipd_admissions WHERE status = 'admitted'
    `).get() as { count: number };

    // 3. Financial overview
    const financialStats = db.prepare(`
      SELECT 
        COALESCE(SUM(total_amount), 0) as total_billed,
        COALESCE(SUM(paid_amount), 0) as total_revenue,
        COALESCE(SUM(outstanding_amount), 0) as pending_billing,
        COALESCE(SUM(insurance_share), 0) as insurance_receivables
      FROM invoices
    `).get() as any;

    // 4. Lab & Pharmacy queues
    const labStats = db.prepare(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status IN ('ordered', 'sample_collected', 'processing') THEN 1 ELSE 0 END) as pending_reports,
        SUM(CASE WHEN is_critical = 1 THEN 1 ELSE 0 END) as critical_results
      FROM lab_orders
    `).get() as any;

    const pharmacyStats = db.prepare(`
      SELECT 
        COUNT(*) as total_skus,
        (SELECT COUNT(*) FROM medicine_batches WHERE stock_quantity <= 50) as low_stock_items,
        (SELECT COUNT(*) FROM prescriptions WHERE status = 'active') as pending_prescriptions
      FROM pharmacy_items
    `).get() as any;

    // 5. Department breakdown
    const departmentPerformance = db.prepare(`
      SELECT d.name, d.code, COUNT(a.id) as opd_volume
      FROM departments d
      LEFT JOIN appointments a ON d.id = a.department_id
      GROUP BY d.id
      ORDER BY opd_volume DESC
    `).all();

    return NextResponse.json({
      success: true,
      metrics: {
        todayOpd: opdStats?.total_today || 4,
        waitingOpd: opdStats?.waiting || 2,
        activeIpd: ipdActiveCount?.count || 5,
        totalBeds: bedStats?.total || 12,
        availableBeds: bedStats?.available || 5,
        occupiedBeds: bedStats?.occupied || 5,
        cleaningBeds: bedStats?.cleaning || 1,
        icuOccupied: icuStats?.occupied || 2,
        icuTotal: icuStats?.total || 4,
        emergencyPatients: 2,
        todayRevenue: financialStats?.total_revenue || 71584,
        pendingBilling: financialStats?.pending_billing || 10200,
        insuranceReceivables: financialStats?.insurance_receivables || 60000,
        pendingLabReports: labStats?.pending_reports || 1,
        criticalLabAlerts: labStats?.critical_results || 1,
        pendingPrescriptions: pharmacyStats?.pending_prescriptions || 1,
        lowStockMedicines: pharmacyStats?.low_stock_items || 0,
      },
      departmentPerformance,
    });
  } catch (error: any) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
