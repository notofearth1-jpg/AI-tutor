import Card from "../Card";
import SectionTitle from "../SectionTitle";

export default function UsersTable({ users }: { users: any[] }) {
  return (
    <Card>
      <SectionTitle title="Users" subtitle="Recent platform users and their profile status." />
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-left text-slate-300">
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Profile</th>
              <th className="px-3 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-800">
                <td className="px-3 py-2">{user.email}</td>
                <td className="px-3 py-2">{user.role}</td>
                <td className="px-3 py-2">{user.studentProfile ? user.studentProfile.fullName : "No profile"}</td>
                <td className="px-3 py-2">{new Date(user.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
