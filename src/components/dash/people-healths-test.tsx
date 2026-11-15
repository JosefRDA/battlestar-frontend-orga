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

export default function PeopleHealthsTestPanel() {
  const [results, setResults] = useState<Record<string, TestResult>>({})
  const [loading, setLoading] = useState<string | null>(null)

  // State for form inputs
  const [id, setId] = useState("")
  const [createBody, setCreateBody] = useState({
    temperatureCorporelle: "37.0",
    poulsMax: "100",
    poulsMin: "60",
    tensionArterielleMax: "120",
    tensionArterielleMin: "80",
    peopleId: "",
  })

  const runTest = async (key: string, endpoint: string, method = "GET", body?: unknown) => {
    setLoading(key)
    setResults((prev) => ({ ...prev, [key]: { success: false, error: "Loading..." } }))

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      })

      const data = response.status !== 204 ? await response.json().catch(() => ({})) : null
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

  const renderResult = (key: string) => {
    const result = results[key]
    if (!result) return null
    return (
      <div className="mt-4 text-sm">
        <div className={`font-medium ${result.success ? "text-green-600" : "text-red-600"}`}>
          {result.success ? "Success" : "Error"} {result.status ? `(${result.status})` : ""}
        </div>
        {result.error && <pre className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-700 dark:text-red-300 overflow-auto max-h-40">{result.error}</pre>}
        {result.data && (
          <details className="mt-2">
            <summary className="cursor-pointer text-muted-foreground">View response</summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">{JSON.stringify(result.data, null, 2)}</pre>
          </details>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">PeopleHealths API Test Panel</h2>
        <p className="text-muted-foreground">Endpoints: /people-healths</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* GET All */}
        <Card>
          <CardHeader><CardTitle>GET /people-healths</CardTitle></CardHeader>
          <CardContent>
            <Button onClick={() => runTest("getAll", "/people-healths")} disabled={loading === "getAll"}>Execute</Button>
            {renderResult("getAll")}
          </CardContent>
        </Card>

        {/* ID based operations */}
        <Card>
          <CardHeader><CardTitle>ID Operations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="PeopleHealth ID" value={id} onChange={(e) => setId(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={() => runTest("getOne", `/people-healths/${id}`)} disabled={!id || loading === "getOne"}>GET</Button>
              <Button variant="destructive" onClick={() => runTest("delete", `/people-healths/${id}`, "DELETE")} disabled={!id || loading === "delete"}>DELETE</Button>
            </div>
            {renderResult("getOne")}
            {renderResult("delete")}
          </CardContent>
        </Card>

        {/* POST/PUT/PATCH */}
        <Card className="col-span-2">
          <CardHeader><CardTitle>Create / Update Operations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="People ID" value={createBody.peopleId} onChange={(e) => setCreateBody({...createBody, peopleId: e.target.value})} />
              <Input placeholder="Temp Corporelle" value={createBody.temperatureCorporelle} onChange={(e) => setCreateBody({...createBody, temperatureCorporelle: e.target.value})} />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => runTest("post", "/people-healths", "POST", createBody)} disabled={loading === "post"}>POST (create)</Button>
              <Button onClick={() => runTest("put", `/people-healths/${id}`, "PUT", createBody)} disabled={!id || loading === "put"}>PUT (full update)</Button>
              <Button variant="secondary" onClick={() => runTest("patch", `/people-healths/${id}`, "PATCH", createBody)} disabled={!id || loading === "patch"}>PATCH</Button>
            </div>
            {renderResult("post")}
            {renderResult("put")}
            {renderResult("patch")}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
