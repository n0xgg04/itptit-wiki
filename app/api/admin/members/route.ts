import { NextResponse } from 'next/server'

// Mock data for demonstration purposes
const members = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'Member', team: 'Frontend' },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', role: 'Leader', team: 'Backend' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', role: 'Member', team: 'Design' },
  { id: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', role: 'Member', team: 'Mobile' },
  { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@example.com', role: 'Leader', team: 'Frontend' },
]

export async function GET() {
  // In a real application, you would fetch this data from a database
  return NextResponse.json(members)
}

