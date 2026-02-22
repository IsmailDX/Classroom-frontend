import { useMemo } from "react";
import { useLink, useList } from "@refinedev/core";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BookOpen,
  Building2,
  GraduationCap,
  Layers,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Department, Subject, User } from "@/types";

type ClassListItem = {
  id: number;
  name: string;
  createdAt?: string;
  subject?: {
    name: string;
  };
  teacher?: {
    name: string;
  };
};

const roleColors = ["#f97316", "#0ea5e9", "#22c55e", "#a855f7"];

const Dashboard = () => {
  const Link = useLink();
  const { query: usersQuery } = useList<User>({
    resource: "users",
    pagination: { mode: "off" },
  });

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: { mode: "off" },
  });

  const { query: departmentsQuery } = useList<Department>({
    resource: "departments",
    pagination: { mode: "off" },
  });

  const { query: classesQuery } = useList<ClassListItem>({
    resource: "classes",
    pagination: { mode: "off" },
  });

  const users = usersQuery.data?.data ?? [];
  const subjects = subjectsQuery.data?.data ?? [];
  const departments = departmentsQuery.data?.data ?? [];
  const classes = classesQuery.data?.data ?? [];

  const usersByRole = useMemo(() => {
    const counts = users.reduce<Record<string, number>>((acc, user) => {
      const role = user.role ?? "unknown";
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([role, total]) => ({ role, total }));
  }, [users]);

  const subjectsByDepartment = useMemo(() => {
    const counts = subjects.reduce<Record<string, number>>((acc, subject) => {
      const departmentName =
        (subject as { department?: { name?: string } }).department?.name ??
        "Unassigned";
      acc[departmentName] = (acc[departmentName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([departmentName, totalSubjects]) => ({
      departmentName,
      totalSubjects,
    }));
  }, [subjects]);

  const classesBySubject = useMemo(() => {
    const counts = classes.reduce<Record<string, number>>((acc, classItem) => {
      const subjectName = classItem.subject?.name ?? "Unassigned";
      acc[subjectName] = (acc[subjectName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([subjectName, totalClasses]) => ({
      subjectName,
      totalClasses,
    }));
  }, [classes]);

  const newestClasses = useMemo(() => {
    return [...classes]
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [classes]);

  const newestTeachers = useMemo(() => {
    return users
      .filter((user) => user.role === "teacher")
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [users]);

  const topDepartments = useMemo(() => {
    return [...subjectsByDepartment]
      .sort((a, b) => b.totalSubjects - a.totalSubjects)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        departmentId: index,
      }));
  }, [subjectsByDepartment]);

  const topSubjects = useMemo(() => {
    return [...classesBySubject]
      .sort((a, b) => b.totalClasses - a.totalClasses)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        subjectId: index,
      }));
  }, [classesBySubject]);

  const kpis = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      accent: "text-blue-600",
    },
    {
      label: "Teachers",
      value: users.filter((user) => user.role === "teacher").length,
      icon: GraduationCap,
      accent: "text-emerald-600",
    },
    {
      label: "Admins",
      value: users.filter((user) => user.role === "admin").length,
      icon: ShieldCheck,
      accent: "text-amber-600",
    },
    {
      label: "Subjects",
      value: subjects.length,
      icon: BookOpen,
      accent: "text-purple-600",
    },
    {
      label: "Departments",
      value: departments.length,
      icon: Building2,
      accent: "text-cyan-600",
    },
    {
      label: "Classes",
      value: classes.length,
      icon: Layers,
      accent: "text-rose-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-muted-foreground">
          A quick snapshot of the latest activity and key metrics.
        </p>
      </div>

      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40 rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-xs font-semibold">
                    {kpi.label}
                  </p>
                  <kpi.icon className={`h-4 w-4 ${kpi.accent}`} />
                </div>
                <div className="mt-2 text-2xl font-semibold">{kpi.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="transition-shadow hover:shadow-md lg:col-span-2">
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="total"
                    nameKey="role"
                    data={usersByRole}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {usersByRole.map((entry, index) => (
                      <Cell
                        key={`${entry.role}-${index}`}
                        fill={roleColors[index % roleColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2">
              {usersByRole.map((entry, index) => (
                <span
                  key={entry.role}
                  className="bg-muted inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: roleColors[index % roleColors.length],
                    }}
                  />
                  {entry.role} · {entry.total}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>New Classes (last 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {newestClasses.length}
              </div>
              <p className="text-muted-foreground text-sm">
                Most recent classes added
              </p>
            </CardContent>
          </Card>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>New Teachers (last 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {newestTeachers.length}
              </div>
              <p className="text-muted-foreground text-sm">
                Most recent teachers added
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-muted-foreground text-sm font-semibold">
              Subjects per Department
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectsByDepartment}>
                  <XAxis dataKey="departmentName" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="totalSubjects"
                    fill="#f97316"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-muted-foreground text-sm font-semibold">
              Classes per Subject
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classesBySubject}>
                  <XAxis dataKey="subjectName" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="totalClasses"
                    fill="#0ea5e9"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle>Newest Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {newestClasses.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No recent classes.
              </p>
            )}
            {newestClasses.map((item, index) => (
              <Link
                key={item.id}
                to={`/classes/show/${item.id}`}
                className="hover:border-primary/30 hover:bg-muted/40 flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-xs font-semibold">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {item.subject?.name ?? "No subject"} ·{" "}
                      {item.teacher?.name ?? "No teacher"}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">New</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle>Newest Teachers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {newestTeachers.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No recent teachers.
              </p>
            )}
            {newestTeachers.map((teacher, index) => (
              <Link
                key={teacher.id}
                to={`/users/show/${teacher.id}`}
                className="hover:border-primary/30 hover:bg-muted/40 flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-xs font-semibold">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{teacher.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {teacher.email}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">New</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle>Departments with Most Subjects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topDepartments.map((dept, index) => (
              <div
                key={dept.departmentId}
                className="hover:border-primary/30 hover:bg-muted/40 flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-xs font-semibold">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{dept.departmentName}</p>
                    <p className="text-muted-foreground text-xs">
                      {dept.totalSubjects} subjects
                    </p>
                  </div>
                </div>
                <Badge>{dept.totalSubjects}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle>Subjects with Most Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topSubjects.map((subject, index) => (
              <div
                key={subject.subjectId}
                className="hover:border-primary/30 hover:bg-muted/40 flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-xs font-semibold">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{subject.subjectName}</p>
                    <p className="text-muted-foreground text-xs">
                      {subject.totalClasses} classes
                    </p>
                  </div>
                </div>
                <Badge>{subject.totalClasses}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Separator />
    </div>
  );
};

export default Dashboard;
