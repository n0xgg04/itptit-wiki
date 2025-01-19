import { MemberList } from '@/components/MemberList'

export default function AdminMembersPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Quản lý thành viên</h1>
      <MemberList />
    </div>
  )
}

