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

export default function PeopleHealthSymptomsTestPanel() {
  const [results, setResults] = useState<Record<string, TestResult>>({})
  const [loading, setLoading] = useState<string | null>(null)

  // State for form inputs
  const [id, setId] = useState("")
  const [createBody, setCreateBody] = useState({
    text: "Headache",
    order: "1",
  })
  const [updateBody, setUpdateBody] = useState({
    text: "Updated Headache",
    order: "2",
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
        {result.data ? (
          <details className="mt-2">
            <summary className="cursor-pointer text-muted-foreground">View response</summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">{JSON.stringify(result.data, null, 2)}</pre>
          </details>
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">PeopleHealthSymptoms API Test Panel</h2>
        <p className="text-muted-foreground">Endpoints: /people-health-symptoms</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* GET All */}
        <Card>
          <CardHeader><CardTitle>GET /people-health-symptoms</CardTitle></CardHeader>
          <CardContent>
            <Button onClick={() => runTest("getAll", "/people-health-symptoms")} disabled={loading === "getAll"}>Execute</Button>
            {renderResult("getAll")}
          </CardContent>
        </Card>

        {/* ID based operations */}
        <Card>
          <CardHeader><CardTitle>ID Operations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Symptom ID" value={id} onChange={(e) => setId(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={() => runTest("getOne", `/people-health-symptoms/${id}`)} disabled={!id || loading === "getOne"}>GET</Button>
              <Button variant="destructive" onClick={() => runTest("delete", `/people-health-symptoms/${id}`, "DELETE")} disabled={!id || loading === "delete"}>DELETE</Button>
            </div>
            {renderResult("getOne")}
            {renderResult("delete")}
          </CardContent>
        </Card>

        {/* POST - Create */}
        <Card className="col-span-2">
          <CardHeader><CardTitle>POST /people-health-symptoms (Create)</CardTitle>
          <CardDescription>Required: text, order</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="create-text">Text</Label>
                <Input id="create-text" placeholder="Text" value={createBody.text} onChange={(e) => setCreateBody({...createBody, text: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="create-order">Order</Label>
                <Input id="create-order" placeholder="Order" type="number" value={createBody.order} onChange={(e) => setCreateBody({...createBody, order: e.target.value})} />
              </div>
            </div>
            <Button onClick={() => runTest("post", "/people-health-symptoms", "POST", createBody)} disabled={loading === "post"}>POST (create)</Button>
            {renderResult("post")}
          </CardContent>
        </Card>

        {/* PUT - Full Update */}
        <Card className="col-span-2">
          <CardHeader><CardTitle>PUT /people-health-symptoms/:id (Full Update)</CardTitle>
          <CardDescription>Requires: id, text, order</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="put-text">Text</Label>
                <Input id="put-text" placeholder="Text" value={updateBody.text} onChange={(e) => setUpdateBody({...updateBody, text: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="put-order">Order</Label>
                <Input id="put-order" placeholder="Order" type="number" value={updateBody.order} onChange={(e) => setUpdateBody({...updateBody, order: e.target.value})} />
              </div>
            </div>
            <Button onClick={() => runTest("put", `/people-health-symptoms/${id}`, "PUT", updateBody)} disabled={!id || loading === "put"}>PUT (full update)</Button>
            {renderResult("put")}
          </CardContent>
        </Card>

        {/* PATCH - Partial Update */}
        <Card className="col-span-2">
          <CardHeader><CardTitle>PATCH /people-health-symptoms/:id (Partial Update)</CardTitle>
          <CardDescription>Requires: id, optional: text, order</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="patch-text">Text (optional)</Label>
                <Input id="patch-text" placeholder="Text" value={updateBody.text} onChange={(e) => setUpdateBody({...updateBody, text: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="patch-order">Order (optional)</Label>
                <Input id="patch-order" placeholder="Order" type="number" value={updateBody.order} onChange={(e) => setUpdateBody({...updateBody, order: e.target.value})} />
              </div>
            </div>
            <Button variant="secondary" onClick={() => runTest("patch", `/people-health-symptoms/${id}`, "PATCH", updateBody)} disabled={!id || loading === "patch"}>PATCH</Button>
            {renderResult("patch")}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}