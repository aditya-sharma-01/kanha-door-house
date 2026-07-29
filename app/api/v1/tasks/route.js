import { NextResponse } from 'next/server';
import { INITIAL_TASKS } from '@/lib/types';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tech = searchParams.get('technician');
  const status = searchParams.get('status');

  let tasks = INITIAL_TASKS;
  if (tech) {
    tasks = tasks.filter(t => t.assignedTechnician.toLowerCase().includes(tech.toLowerCase()));
  }
  if (status) {
    tasks = tasks.filter(t => t.status.toLowerCase() === status.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    count: tasks.length,
    tasks
  }, { status: 200 });
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { taskId, status, completionPhotoUrl, notes } = body;

    if (!taskId || !status) {
      return NextResponse.json({ success: false, message: 'taskId and status are required' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Task ${taskId} status updated to ${status}`,
      updatedTask: {
        taskId,
        status,
        completionPhotoUrl,
        notes,
        updatedAt: new Date().toISOString()
      }
    }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
