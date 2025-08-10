import { NextRequest, NextResponse } from 'next/server';
import { adminService } from '@/services/admin.service';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing admin service stats...');
    
    // Test dashboard stats
    const dashboardStats = await adminService.getDashboardStats();
    console.log('Dashboard stats result:', dashboardStats);
    
    // Test user growth metrics
    const userGrowthMetrics = await adminService.getUserGrowthMetrics();
    console.log('User growth metrics result:', userGrowthMetrics);
    
    // Test users list
    const usersList = await adminService.getUsers({ limit: 5, page: 1 });
    console.log('Users list result:', usersList);
    
    return NextResponse.json({
      success: true,
      message: 'Admin service test completed',
      results: {
        dashboardStats: {
          success: dashboardStats.success,
          totalUsers: dashboardStats.data?.totalUsers,
          totalBrokers: dashboardStats.data?.totalBrokers,
          totalContractors: dashboardStats.data?.totalContractors,
        },
        userGrowthMetrics: {
          success: userGrowthMetrics.success,
          totalUsers: userGrowthMetrics.data?.totalUsers,
          newUsersThisMonth: userGrowthMetrics.data?.newUsersThisMonth,
          userGrowthRate: userGrowthMetrics.data?.userGrowthRate,
        },
        usersList: {
          success: usersList.success,
          totalUsers: usersList.data?.total,
          usersCount: usersList.data?.users?.length,
          sampleUser: usersList.data?.users?.[0],
        }
      },
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Admin service test error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to test admin service',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
