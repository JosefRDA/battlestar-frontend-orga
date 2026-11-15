"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const API_BASE = "http://localhost:4000"

interface TestResult {
  success: boolean
  status?: number
  data?: unknown
  error?: string
}

interface AdminTestPanelProps {
  className?: string
}

export default function AdminTestPanel({ className }: AdminTestPanelProps) {
  const [results, setResults] = useState<Record<string, TestResult>>({})
  const [loading, setLoading] = useState<string | null>(null)
  const [deleteUserId, setDeleteUserId] = useState("")

  const runTest = async (key: string, endpoint: string, method = "POST", body?: unknown) => {
    setLoading(key)
    setResults((prev) => ({ ...prev, [key]: { success: false, error: "Loading..." } }))

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      })

      const data = await response.json().catch(() => ({}))
      setResults((prev) => ({
        ...prev,
        [key]: { success: response.ok, status: response.status, data },
      }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [key]: { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      }))
    } finally {
      setLoading(null)
    }
  }

  const handleDeleteUser = () => {
    if (!deleteUserId.trim()) return
    runTest("deleteUser", `/admin/users/${deleteUserId}`, "DELETE")
  }

  const tests = [
    {
      key: "seedParts",
      label: "POST /admin/parts/seed",
      description: "Seed 20 default parts into the database",
      action: () => runTest("seedParts", "/admin/parts/seed"),
    },
    {
      key: "seedIncidents",
      label: "POST /admin/incidents/seed",
      description: "Seed incidents (requires parts to be seeded first)",
      action: () => runTest("seedIncidents", "/admin/incidents/seed"),
    },
    {
      key: "seedUsers",
      label: "POST /admin/users/seed",
      description: "Seed 4 default users (admin, operator1, operator2, viewer1)",
      action: () => runTest("seedUsers", "/admin/users/seed"),
    },
    {
      key: "seedReparations",
      label: "POST /admin/reparations/seed",
      description: "Seed reparations for all systems (requires systems & incidents)",
      action: () => runTest("seedReparations", "/admin/reparations/seed"),
    },
    {
      key: "initSystems",
      label: "POST /admin/systems/init",
      description: "Initialize 8 default systems",
      action: () => runTest("initSystems", "/admin/systems/init"),
    },
    {
      key: "initSystemHealths",
      label: "POST /admin/system-healths/init",
      description: "Initialize system health records (requires systems first)",
      action: () => runTest("initSystemHealths", "/admin/system-healths/init"),
    },
    {
      key: "seedPeople",
      label: "POST /admin/people/seed",
      description: "Seed 4 people linked to users (requires users first)",
      action: () => runTest("seedPeople", "/admin/people/seed"),
    },
  ]

  return (
    <div className={className}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Admin API Test Panel</h2>
          <p className="text-muted-foreground mt-1">
            Test all admin endpoints. Backend must be running on <code className="bg-muted px-1 rounded">http://localhost:4000</code>
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <Card key={test.key} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-mono">{test.label}</CardTitle>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <Button
                  onClick={test.action}
                  disabled={loading === test.key}
                  className="w-full"
                >
                  {loading === test.key ? "Running..." : "Execute"}
                </Button>
                {results[test.key] && (
                  <div className="mt-4 text-sm">
                    <div className={`font-medium ${results[test.key].success ? "text-green-600" : "text-red-600"}`}>
                      {results[test.key].success ? "Success" : "Error"}
                      {results[test.key].status && ` (${results[test.key].status})`}
                    </div>
                    {results[test.key].error && (
                      <pre className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-700 dark:text-red-300 overflow-auto max-h-40">
                        {results[test.key].error}
                      </pre>
                    )}
                    {results[test.key].data !== undefined && results[test.key].data !== null ? (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-muted-foreground">View response</summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
                          {JSON.stringify(results[test.key].data as object, null, 2)}
                        </pre>
                      </details>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-mono">DELETE /admin/users/:id</CardTitle>
              <CardDescription>Delete a user by ID</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deleteUserId">User ID</Label>
                <Input
                  id="deleteUserId"
                  placeholder="Enter user ID to delete"
                  value={deleteUserId}
                  onChange={(e) => setDeleteUserId(e.target.value)}
                  disabled={loading === "deleteUser"}
                />
              </div>
              <Button
                onClick={handleDeleteUser}
                disabled={loading === "deleteUser" || !deleteUserId.trim()}
                variant="destructive"
                className="w-full"
              >
                {loading === "deleteUser" ? "Deleting..." : "Delete User"}
              </Button>
              {results.deleteUser && (
                <div className="mt-4 text-sm">
                  <div className={`font-medium ${results.deleteUser.success ? "text-green-600" : "text-red-600"}`}>
                    {results.deleteUser.success ? "Success" : "Error"}
                    {results.deleteUser.status && ` (${results.deleteUser.status})`}
                  </div>
                  {results.deleteUser.error && (
                    <pre className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-700 dark:text-red-300 overflow-auto max-h-40">
                      {results.deleteUser.error}
                    </pre>
                  )}
                  {results.deleteUser.data !== undefined && results.deleteUser.data !== null ? (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-muted-foreground">View response</summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(results.deleteUser.data as object, null, 2)}
                      </pre>
                    </details>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setResults({})} disabled={Object.keys(results).length === 0}>
            Clear All Results
          </Button>
          <Button variant="outline" onClick={() => {
            tests.forEach(t => t.action())
            handleDeleteUser()
          }} disabled={loading !== null}>
            Run All Tests
          </Button>
        </div>
      </div>
    </div>
  )
}